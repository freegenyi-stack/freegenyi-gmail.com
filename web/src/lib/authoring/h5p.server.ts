import {
  appendH5pLanguage,
  getH5pPublicUrl,
  getH5pServerUrl,
  h5pEditorPath,
  h5pPlayerPath,
  isH5pConfigured,
} from "./h5p-config";

export { isH5pConfigured };

export type H5pCreateResult =
  | { ok: true; contentId: string }
  | { ok: false; error: string; offline?: boolean };

export type H5pUpdateResult = H5pCreateResult;

export async function h5pServerFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const base = getH5pServerUrl();
  if (!base) throw new Error("H5P_SERVER_URL non configuré");

  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init?.headers);
  const apiKey = process.env.H5P_API_KEY;
  if (apiKey) headers.set("Authorization", `Bearer ${apiKey}`);

  return fetch(url, { ...init, headers, cache: "no-store" });
}

export async function resolveH5pLibrary(machineName: string): Promise<string | null> {
  if (!isH5pConfigured()) return null;
  try {
    const res = await h5pServerFetch(`/internal/bootstrap/resolve/${encodeURIComponent(machineName)}`);
    if (!res.ok) return machineName;
    const data = (await res.json()) as { library?: string };
    return data.library ?? machineName;
  } catch {
    return machineName;
  }
}

/** Crée un contenu interactif vide côté serveur. */
export async function createH5pContent(input: {
  library: string;
  title: string;
  params?: Record<string, unknown>;
}): Promise<H5pCreateResult> {
  if (!isH5pConfigured()) {
    return { ok: false, error: "h5p_not_configured", offline: true };
  }

  const library = input.library.includes(" ")
    ? input.library
    : (await resolveH5pLibrary(input.library)) ?? input.library;

  try {
    const res = await h5pServerFetch("/internal/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        library,
        title: input.title,
        params: {
          params: input.params ?? {},
          metadata: { title: input.title, license: "U" },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: text || `h5p_http_${res.status}` };
    }

    const data = (await res.json()) as { contentId?: string | number; id?: string | number };
    const contentId = String(data.contentId ?? data.id ?? "");
    if (!contentId) return { ok: false, error: "h5p_no_content_id" };
    return { ok: true, contentId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "h5p_unreachable", offline: true };
  }
}

/** Met à jour le contenu interactif existant. */
export async function updateH5pContent(input: {
  contentId: string;
  library: string;
  title: string;
  params: Record<string, unknown>;
}): Promise<H5pUpdateResult> {
  if (!isH5pConfigured()) {
    return { ok: false, error: "h5p_not_configured", offline: true };
  }

  const library = input.library.includes(" ")
    ? input.library
    : (await resolveH5pLibrary(input.library)) ?? input.library;

  try {
    const res = await h5pServerFetch(`/internal/content/${encodeURIComponent(input.contentId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        library,
        title: input.title,
        params: {
          params: input.params,
          metadata: { title: input.title, license: "U" },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: text || `h5p_http_${res.status}` };
    }

    const data = (await res.json()) as { contentId?: string | number; id?: string | number };
    const contentId = String(data.contentId ?? data.id ?? input.contentId);
    return { ok: true, contentId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "h5p_unreachable", offline: true };
  }
}

export async function deleteH5pContent(contentId: string): Promise<boolean> {
  if (!isH5pConfigured() || !contentId) return false;
  try {
    const res = await h5pServerFetch(`/internal/content/${encodeURIComponent(contentId)}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function publicH5pEditorUrl(contentId: string, locale?: string): string | null {
  if (!contentId) return null;
  const base = getH5pPublicUrl();
  if (base === null) return null;
  const path = h5pEditorPath(contentId);
  const url = base ? `${base}${path}` : path;
  return appendH5pLanguage(url, locale);
}

export function publicH5pPlayerUrl(contentId: string, locale?: string): string | null {
  if (!contentId) return null;
  const base = getH5pPublicUrl();
  if (base === null) return null;
  const path = h5pPlayerPath(contentId);
  const url = base ? `${base}${path}` : path;
  return appendH5pLanguage(url, locale);
}

export async function bootstrapH5pLibraries(allTypes = true): Promise<{ ok: boolean; installed?: number; total?: number }> {
  if (!isH5pConfigured()) return { ok: false };
  try {
    const qs = allTypes ? "?all=1" : "";
    const res = await h5pServerFetch(`/internal/bootstrap${qs}`, { method: "POST" });
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as { installed?: string[]; total?: number };
    return { ok: true, installed: data.installed?.length, total: data.total };
  } catch {
    return { ok: false };
  }
}

export type H5pActivityTypeDto = {
  machineName: string;
  title: string;
  summary: string;
  description: string;
  icon: string | null;
  installed: boolean;
  version: string | null;
};

export async function listH5pActivityTypes(): Promise<H5pActivityTypeDto[]> {
  if (!isH5pConfigured()) return [];
  try {
    const res = await h5pServerFetch("/internal/bootstrap/types", { method: "GET" });
    if (!res.ok) return [];
    const data = (await res.json()) as { types?: H5pActivityTypeDto[] };
    return data.types ?? [];
  } catch {
    return [];
  }
}

export async function checkH5pHealth(): Promise<{ ok: boolean; message: string }> {
  if (!isH5pConfigured()) {
    return {
      ok: false,
      message: "Les activités interactives ne sont pas encore disponibles sur cet environnement.",
    };
  }
  try {
    const res = await h5pServerFetch("/health", { method: "GET" });
    if (res.ok) return { ok: true, message: "Activités interactives disponibles." };
    return { ok: false, message: "Le service d'activités interactives est momentanément indisponible." };
  } catch {
    return { ok: false, message: "Le service d'activités interactives est momentanément indisponible." };
  }
}
