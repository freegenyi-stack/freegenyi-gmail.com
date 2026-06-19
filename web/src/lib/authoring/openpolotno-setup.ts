import { setTranslations, setUploadFunc } from "openpolotno/config";
import { OPENPOLOTNO_AR, OPENPOLOTNO_FR } from "./openpolotno-translations";

let uploadConfigured = false;

export function configureOpenPolotno(locale: string): void {
  if (typeof window === "undefined") return;
  const isAr = locale.startsWith("ar") || locale.endsWith("-ar");
  setTranslations(isAr ? OPENPOLOTNO_AR : OPENPOLOTNO_FR);

  if (!uploadConfigured) {
    setUploadFunc(async (file: File) => {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/authoring/media", { method: "POST", body: fd });
      if (!res.ok) throw new Error("upload_failed");
      const data = (await res.json()) as { url: string };
      const absolute = data.url.startsWith("http") ? data.url : `${window.location.origin}${data.url}`;
      return absolute;
    });
    uploadConfigured = true;
  }
}
