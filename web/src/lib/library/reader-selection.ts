import { getReaderIframe, getReaderIframes } from "@/lib/library/reader-iframe";

export type ReaderSelectionAnchor = {
  text: string;
  top: number;
  left: number;
};

function readSelectionText(doc: Document): string {
  const sel = doc.getSelection();
  if (!sel || sel.isCollapsed) return "";
  return sel.toString().replace(/\s+/g, " ").trim();
}

function viewportAnchor(
  iframe: HTMLIFrameElement,
  clientX: number,
  clientY: number,
  text: string
): ReaderSelectionAnchor {
  const frame = iframe.getBoundingClientRect();
  return {
    text: text.slice(0, 500),
    top: frame.top + clientY,
    left: frame.left + clientX,
  };
}

function anchorFromSelection(iframe: HTMLIFrameElement, doc: Document): ReaderSelectionAnchor | null {
  const text = readSelectionText(doc);
  if (text.length < 1) return null;

  const sel = doc.getSelection();
  if (!sel?.rangeCount) return null;
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  const frame = iframe.getBoundingClientRect();

  return {
    text: text.slice(0, 500),
    top: frame.top + rect.bottom + 6,
    left: frame.left + rect.left + rect.width / 2,
  };
}

function selectWordAtPoint(doc: Document, x: number, y: number): boolean {
  const sel = doc.getSelection();
  if (!sel) return false;

  let range: Range | null = null;
  if (typeof doc.caretRangeFromPoint === "function") {
    range = doc.caretRangeFromPoint(x, y);
  } else {
    const pos = (
      doc as Document & {
        caretPositionFromPoint?: (px: number, py: number) => { offsetNode: Node; offset: number } | null;
      }
    ).caretPositionFromPoint?.(x, y);
    if (pos) {
      range = doc.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
    }
  }
  if (!range) return false;

  if (range.startContainer.nodeType === Node.TEXT_NODE) {
    const node = range.startContainer;
    const content = node.textContent || "";
    let start = range.startOffset;
    let end = range.startOffset;
    while (start > 0 && /\S/u.test(content[start - 1] ?? "")) start--;
    while (end < content.length && /\S/u.test(content[end] ?? "")) end++;
    if (start >= end) return false;
    range.setStart(node, start);
    range.setEnd(node, end);
  }

  sel.removeAllRanges();
  sel.addRange(range);
  return readSelectionText(doc).length > 0;
}

const HIGHLIGHT_BG: Record<string, string> = {
  yellow: "rgba(250, 204, 21, 0.55)",
  green: "rgba(134, 239, 172, 0.55)",
  blue: "rgba(147, 197, 253, 0.55)",
  pink: "rgba(249, 168, 212, 0.55)",
};

export function highlightReaderSelection(color = "yellow"): string | null {
  const iframe = getReaderIframe();
  const doc = iframe?.contentDocument;
  const sel = doc?.getSelection();
  if (!doc || !sel || sel.isCollapsed || !sel.rangeCount) return null;

  const text = readSelectionText(doc);
  if (!text) return null;

  const range = sel.getRangeAt(0).cloneRange();
  const mark = doc.createElement("mark");
  mark.className = "freegeny-hl";
  mark.style.backgroundColor = HIGHLIGHT_BG[color] ?? HIGHLIGHT_BG.yellow;
  mark.style.borderRadius = "2px";

  try {
    const fragment = range.extractContents();
    mark.appendChild(fragment);
    range.insertNode(mark);
  } catch {
    try {
      range.surroundContents(mark);
    } catch {
      /* garder le texte pour l'API */
    }
  }

  sel.removeAllRanges();
  return text.slice(0, 500);
}

export function underlineReaderSelection(): string | null {
  const iframe = getReaderIframe();
  const doc = iframe?.contentDocument;
  const sel = doc?.getSelection();
  if (!doc || !sel || sel.isCollapsed || !sel.rangeCount) return null;

  const text = readSelectionText(doc);
  if (!text) return null;

  const range = sel.getRangeAt(0).cloneRange();
  const el = doc.createElement("u");
  el.className = "freegeny-ul";
  el.style.textDecorationColor = "rgba(167, 139, 250, 0.9)";
  el.style.textUnderlineOffset = "2px";

  try {
    const fragment = range.extractContents();
    el.appendChild(fragment);
    range.insertNode(el);
  } catch {
    try {
      range.surroundContents(el);
    } catch {
      /* garder le texte pour l'API */
    }
  }

  sel.removeAllRanges();
  return text.slice(0, 500);
}

export function attachReaderEditingListeners(onOpen: (anchor: ReaderSelectionAnchor) => void): () => void {
  const bound = new WeakSet<Document>();
  let longPressTimer: number | null = null;
  let touchX = 0;
  let touchY = 0;
  let touchIframe: HTMLIFrameElement | null = null;
  let suppressPointerOpenUntil = 0;

  const clearLongPress = () => {
    if (longPressTimer !== null) {
      window.clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };

  const openAnchor = (anchor: ReaderSelectionAnchor | null) => {
    if (anchor) onOpen(anchor);
  };

  const bindFrame = (iframe: HTMLIFrameElement) => {
    const doc = iframe.contentDocument;
    if (!doc?.body || bound.has(doc)) return;
    bound.add(doc);

    const onContextMenu = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      suppressPointerOpenUntil = Date.now() + 400;

      const ev = event as MouseEvent;
      let text = readSelectionText(doc);
      if (!text) selectWordAtPoint(doc, ev.clientX, ev.clientY);
      text = readSelectionText(doc);
      if (!text) return;

      openAnchor(viewportAnchor(iframe, ev.clientX, ev.clientY, text));
    };

    const onPointerUp = (event: Event) => {
      if (Date.now() < suppressPointerOpenUntil) return;
      const ev = event as PointerEvent;
      if (ev.pointerType === "touch" && longPressTimer !== null) return;

      const anchor = anchorFromSelection(iframe, doc);
      if (anchor && anchor.text.length >= 2) openAnchor(anchor);
    };

    const onTouchStart = (event: Event) => {
      const ev = event as TouchEvent;
      if (ev.touches.length !== 1) return;
      touchIframe = iframe;
      touchX = ev.touches[0].clientX;
      touchY = ev.touches[0].clientY;
      clearLongPress();
      longPressTimer = window.setTimeout(() => {
        if (!touchIframe) return;
        if (navigator.vibrate) navigator.vibrate(35);
        selectWordAtPoint(doc, touchX, touchY);
        const text = readSelectionText(doc);
        if (text) openAnchor(viewportAnchor(iframe, touchX, touchY, text));
        longPressTimer = null;
      }, 520);
    };

    const onTouchMove = (event: Event) => {
      const ev = event as TouchEvent;
      const t = ev.touches[0];
      if (!t) return;
      if (Math.abs(t.clientX - touchX) > 14 || Math.abs(t.clientY - touchY) > 14) clearLongPress();
    };

    doc.addEventListener("contextmenu", onContextMenu, true);
    doc.addEventListener("pointerup", onPointerUp, true);
    doc.addEventListener("mouseup", onPointerUp, true);
    doc.addEventListener("touchend", onPointerUp, { capture: true, passive: true });
    doc.addEventListener("touchstart", onTouchStart, { capture: true, passive: true });
    doc.addEventListener("touchmove", onTouchMove, { capture: true, passive: true });
    doc.addEventListener("touchcancel", clearLongPress, true);
  };

  const scan = () => {
    for (const iframe of getReaderIframes()) bindFrame(iframe);
    const active = getReaderIframe();
    if (active) bindFrame(active);
  };

  scan();
  const poll = window.setInterval(scan, 400);

  const container = document.getElementById("thorium-web-container");
  let observer: MutationObserver | null = null;
  if (container) {
    observer = new MutationObserver(() => {
      scan();
    });
    observer.observe(container, { childList: true, subtree: true });
  }

  return () => {
    window.clearInterval(poll);
    clearLongPress();
    observer?.disconnect();
  };
}
