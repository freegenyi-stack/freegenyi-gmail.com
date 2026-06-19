import type { OpenPolotnoStore } from "openpolotno/model/store";

export type VisualStoreSnapshot = {
  width?: number;
  height?: number;
  pages?: Array<{
    id?: string;
    background?: string;
    children?: Record<string, unknown>[];
  }>;
};

const DEFAULT_W = 794;
const DEFAULT_H = 1123;

function sanitizeElement(raw: Record<string, unknown>): Record<string, unknown> {
  return {
    animations: [],
    filters: {},
    dash: [],
    opacity: 1,
    visible: true,
    selectable: true,
    removable: true,
    showInExport: true,
    rotation: 0,
    ...raw,
  };
}

/** Charge le JSON atelier — même logique que createDemoApp OpenPolotno (fiable). */
export function hydrateVisualStore(store: OpenPolotnoStore, initialJson: string): void {
  let parsed: VisualStoreSnapshot = {};
  try {
    parsed = JSON.parse(initialJson) as VisualStoreSnapshot;
  } catch {
    parsed = {};
  }

  const w = parsed.width && parsed.width > 0 ? parsed.width : DEFAULT_W;
  const h = parsed.height && parsed.height > 0 ? parsed.height : DEFAULT_H;
  const children = parsed.pages?.[0]?.children ?? [];
  const background = parsed.pages?.[0]?.background ?? "white";

  if (store.pages.length > 0) {
    store.clear();
  }

  store.setSize(w, h);
  const page = store.addPage({ background });

  for (const child of children) {
    try {
      page.addElement(sanitizeElement(child), { skipSelect: true });
    } catch {
      /* élément ignoré */
    }
  }

  if (store.pages.length === 0) {
    store.setSize(DEFAULT_W, DEFAULT_H);
    store.addPage({ background: "white" });
  }

  const first = store.pages[0];
  if (first) {
    store.selectPage(first.id);
  }

  store.openSidePanel("templates");
  store.history.clear();
}

export function applyVisualJsonToStore(store: OpenPolotnoStore, json: string): void {
  hydrateVisualStore(store, json);
}
