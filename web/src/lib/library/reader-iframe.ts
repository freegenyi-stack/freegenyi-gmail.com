function normalizeReaderText(raw: string | null | undefined): string {
  return (raw || "").replace(/\s+/g, " ").trim();
}

function iframeBodyText(iframe: HTMLIFrameElement): string {
  const doc = iframe.contentDocument;
  if (!doc?.body) return "";
  return normalizeReaderText(doc.body.innerText || doc.body.textContent);
}

/** Toutes les iframes Readium dans le conteneur Thorium. */
export function getReaderIframes(): HTMLIFrameElement[] {
  const container = document.getElementById("thorium-web-container");
  const list: HTMLIFrameElement[] = [];
  const root = container ?? document.body;

  for (const node of root.querySelectorAll("iframe")) {
    if (node instanceof HTMLIFrameElement) list.push(node);
  }
  return list;
}

/** Iframe visible contenant le texte du chapitre courant. */
export function getReaderIframe(): HTMLIFrameElement | null {
  for (const iframe of getReaderIframes()) {
    const style = window.getComputedStyle(iframe);
    if (style.visibility === "hidden" || style.opacity === "0" || style.pointerEvents === "none") {
      continue;
    }
    const doc = iframe.contentDocument;
    if (doc?.body && iframeBodyText(iframe).length > 10) return iframe;
  }

  for (const iframe of getReaderIframes()) {
    if (iframe.contentDocument?.body) return iframe;
  }
  return null;
}

export function getReaderPageText(max = 1200): string {
  const iframe = getReaderIframe();
  const fromIframe = iframe ? iframeBodyText(iframe) : "";
  if (fromIframe.length > 20) return fromIframe.slice(0, max);

  const fromShell = normalizeReaderText(document.querySelector(".th-reader")?.textContent);
  return fromShell.slice(0, max);
}

export async function waitForReaderPageText(max = 1200, attempts = 10, delayMs = 400): Promise<string> {
  for (let i = 0; i < attempts; i++) {
    const text = getReaderPageText(max);
    if (text.length > 20) return text;
    await new Promise((resolve) => window.setTimeout(resolve, delayMs));
  }
  return getReaderPageText(max);
}

export function getReaderSelection(): string {
  const iframe = getReaderIframe();
  const doc = iframe?.contentDocument;
  const sel = doc?.getSelection();
  if (!sel || sel.isCollapsed) return "";
  return sel.toString().trim().slice(0, 500);
}

export function applyHighlightMarks(doc: Document, snippets: string[]) {
  doc.querySelectorAll("mark.freegeny-hl").forEach((el) => {
    const parent = el.parentNode;
    if (!parent) return;
    parent.replaceChild(doc.createTextNode(el.textContent || ""), el);
    parent.normalize();
  });

  const unique = [...new Set(snippets.map((s) => s.trim()).filter((s) => s.length >= 3))];
  for (const snippet of unique) {
    wrapFirstMatch(doc.body, snippet);
  }
}

function wrapFirstMatch(root: Node, snippet: string): boolean {
  if (root.nodeType === Node.TEXT_NODE) {
    const text = root.textContent || "";
    const idx = text.indexOf(snippet);
    if (idx === -1) return false;
    const range = document.createRange();
    range.setStart(root, idx);
    range.setEnd(root, idx + snippet.length);
    const mark = document.createElement("mark");
    mark.className = "freegeny-hl";
    mark.style.backgroundColor = "rgba(250, 204, 21, 0.55)";
    mark.style.borderRadius = "2px";
    try {
      range.surroundContents(mark);
      return true;
    } catch {
      return false;
    }
  }

  for (const child of Array.from(root.childNodes)) {
    if (wrapFirstMatch(child, snippet)) return true;
  }
  return false;
}
