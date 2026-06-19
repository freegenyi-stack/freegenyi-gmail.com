/**
 * Sync Calibre-Web → library_books
 * Env: CALIBRE_WEB_URL, CALIBRE_WEB_TOKEN (Bearer), CALIBRE_WEB_USERNAME/PASSWORD (session login)
 */

import { upsertLibraryBook, getBookByCalibreId } from "./books.server";

type CalibreBook = {
  id?: number;
  title?: string;
  authors?: string[];
  comments?: string;
  tags?: string[];
  languages?: string[];
  formats?: string[];
};

async function calibreFetch(path: string, init?: RequestInit): Promise<Response> {
  const baseUrl = process.env.CALIBRE_WEB_URL?.replace(/\/$/, "");
  if (!baseUrl) throw new Error("CALIBRE_WEB_URL non configuré");

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init?.headers as Record<string, string>),
  };

  const token = process.env.CALIBRE_WEB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  let cookieHeader = init?.headers && "Cookie" in (init.headers as object)
    ? (init.headers as Record<string, string>).Cookie
    : "";

  if (!cookieHeader && process.env.CALIBRE_WEB_USERNAME && process.env.CALIBRE_WEB_PASSWORD) {
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: process.env.CALIBRE_WEB_USERNAME,
        password: process.env.CALIBRE_WEB_PASSWORD,
        next: "/",
      }),
      redirect: "manual",
    });
    const setCookie = loginRes.headers.get("set-cookie");
    if (setCookie) cookieHeader = setCookie.split(";")[0];
  }

  if (cookieHeader) headers.Cookie = cookieHeader;

  return fetch(`${baseUrl}${path}`, { ...init, headers, cache: "no-store" });
}

export async function syncBooksFromCalibre(): Promise<{
  imported: number;
  updated: number;
  error?: string;
  log?: string[];
}> {
  if (!process.env.CALIBRE_WEB_URL) {
    return { imported: 0, updated: 0, error: "CALIBRE_WEB_URL non configuré dans .env.local" };
  }

  const log: string[] = [];

  try {
    const res = await calibreFetch("/ajax/search?q=&num=200&offset=0");
    if (!res.ok) {
      return { imported: 0, updated: 0, error: `Calibre HTTP ${res.status} — vérifiez URL / login` };
    }

    const data = (await res.json()) as { book_ids?: number[]; data?: Record<string, CalibreBook> };
    const bookIds = data.book_ids ?? [];
    const bookMap = data.data ?? {};
    let imported = 0;
    let updated = 0;
    const baseUrl = process.env.CALIBRE_WEB_URL!.replace(/\/$/, "");

    for (const id of bookIds) {
      const b = bookMap[String(id)] ?? bookMap[id as unknown as string];
      if (!b?.title) continue;

      const format = b.formats?.includes("EPUB") ? "epub" : null;
      if (!format) continue;
      const calibreId = String(id);
      const existing = await getBookByCalibreId(calibreId);

      await upsertLibraryBook({
        id: existing?.id,
        calibreId,
        title: b.title,
        author: b.authors?.join(", ") ?? undefined,
        description: b.comments ?? undefined,
        subject: b.tags?.[0],
        language: b.languages?.[0] ?? "fr",
        format: "epub",
        fileUrl: `${baseUrl}/get/${id}/EPUB`,
        coverUrl: `${baseUrl}/get/cover/${id}`,
        audience: (process.env.CALIBRE_DEFAULT_AUDIENCE as "teachers" | "parents" | "family") || "family",
        isPublished: true,
      });

      if (existing) {
        updated++;
        log.push(`↻ ${b.title}`);
      } else {
        imported++;
        log.push(`+ ${b.title}`);
      }
    }

    return { imported, updated, log: log.slice(0, 20) };
  } catch (e) {
    console.error("Calibre sync error:", e);
    return { imported: 0, updated: 0, error: "Impossible de joindre Calibre-Web — lancez docker compose calibre-web." };
  }
}

export async function checkCalibreConnection(): Promise<{ ok: boolean; message: string }> {
  if (!process.env.CALIBRE_WEB_URL) {
    return { ok: false, message: "CALIBRE_WEB_URL absent" };
  }
  try {
    const res = await calibreFetch("/ajax/search?q=&num=1&offset=0");
    if (res.ok) return { ok: true, message: "Calibre-Web joignable" };
    return { ok: false, message: `HTTP ${res.status}` };
  } catch {
    return { ok: false, message: "Connexion refusée" };
  }
}
