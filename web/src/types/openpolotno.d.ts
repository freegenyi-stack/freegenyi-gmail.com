declare module "openpolotno/model/store" {
  export interface OpenPolotnoPage {
    id: string;
    addElement(attrs: Record<string, unknown>, opts?: { skipSelect?: boolean }): unknown;
  }

  export interface OpenPolotnoStore {
    pages: OpenPolotnoPage[];
    loadJSON(json: unknown): void;
    toJSON(): unknown;
    addPage(attrs?: { background?: string }): OpenPolotnoPage;
    clear(opts?: { keepHistory?: boolean }): void;
    on(event: "change", handler: () => void): () => void;
    saveAsPDF(options?: { fileName?: string; pageId?: string }): Promise<void>;
    saveAsImage(options?: { fileName?: string; pageId?: string; mimeType?: string }): Promise<void>;
    saveAsSVG(options?: { fileName?: string; pageId?: string }): Promise<void>;
    setSize(width: number, height: number, useMagic?: boolean): void;
    openSidePanel(name: string): void;
    selectPage(id: string): void;
    history: { clear(): void };
  }

  export function createStore(options: {
    key: string;
    showCredit?: boolean;
  }): OpenPolotnoStore;
}

declare module "openpolotno" {
  import type { OpenPolotnoStore } from "openpolotno/model/store";

  export function RaeditorApp(props: {
    store: OpenPolotnoStore;
    sections?: readonly string[];
    style?: React.CSSProperties;
  }): React.JSX.Element;
}

declare module "openpolotno/config" {
  export function setTranslations(translations: Record<string, unknown>): void;
  export function setUploadFunc(fn: (file: File) => Promise<string>): void;
}
