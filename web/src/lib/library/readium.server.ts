import AdmZip from "adm-zip";
import path from "path";
import { loadBookFileBuffer } from "@/lib/library/book-file.server";
import { getPublishedBookById, type LibraryBookRow } from "@/lib/library/books.server";

export type ReadiumManifest = Record<string, unknown>;
export type ReadiumPositions = { total: number; positions: Record<string, unknown>[] };

type ParsedEpub = {
  zip: AdmZip;
  manifest: ReadiumManifest;
  positions: ReadiumPositions;
  mimeTypes: Map<string, string>;
};

const epubCache = new Map<number, ParsedEpub>();

function readiumBaseUrl(bookId: number): string {
  const app =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    process.env.APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  return `${app}/api/library/books/${bookId}/readium`;
}

function xmlAttr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`${name}="([^"]+)"`, "i"));
  return m?.[1] ?? null;
}

function parseContainer(xml: string): string {
  const m = xml.match(/full-path="([^"]+)"/i);
  if (!m) throw new Error("container.xml invalide");
  return m[1].replace(/\\/g, "/");
}

type TocLink = { href: string; title: string; children?: TocLink[] };

function resolveOpfHref(opfPath: string, href: string): string {
  const clean = href.split("#")[0].replace(/\\/g, "/");
  if (!clean) return opfPath;
  if (clean.startsWith("/")) return clean.slice(1);
  const base = path.posix.dirname(opfPath.replace(/\\/g, "/"));
  return path.posix.normalize(path.posix.join(base === "." ? "" : base, clean)).replace(/^\.\//, "");
}

function findNavHref(
  opfXml: string,
  manifestItems: Map<string, { href: string; type: string }>
): string | null {
  for (const block of opfXml.match(/<item\b[^>]*\/?>/gi) ?? []) {
    const id = xmlAttr(block, "id");
    const properties = xmlAttr(block, "properties") || "";
    if (!id) continue;
    const item = manifestItems.get(id);
    if (!item) continue;
    if (properties.split(/\s+/).includes("nav")) return item.href;
  }
  for (const item of manifestItems.values()) {
    if (item.type === "application/x-dtbncx+xml" || item.href.toLowerCase().endsWith(".ncx")) {
      return item.href;
    }
  }
  return null;
}

function parseOlList(html: string, basePath: string): TocLink[] {
  const entries: TocLink[] = [];
  const liPattern = /<li(?:\s[^>]*)?>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null;
  while ((match = liPattern.exec(html)) !== null) {
    const li = match[1];
    const anchor = li.match(/<a[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
    if (!anchor) continue;
    const href = resolveOpfHref(basePath, anchor[1]);
    const title = anchor[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!title) continue;
    const nested = li.match(/<ol[^>]*>([\s\S]*?)<\/ol>/i);
    const children = nested ? parseOlList(nested[0], basePath) : undefined;
    entries.push(children?.length ? { href, title, children } : { href, title });
  }
  return entries;
}

function parseNavXhtml(xml: string, navPath: string): TocLink[] {
  const tocNav = xml.match(
    /<nav[^>]*(?:epub:type\s*=\s*["']toc["']|type\s*=\s*["']toc["'])[^>]*>([\s\S]*?)<\/nav>/i
  );
  if (tocNav) return parseOlList(tocNav[0], navPath);
  const firstNav = xml.match(/<nav[^>]*>([\s\S]*?)<\/nav>/i);
  if (firstNav) return parseOlList(firstNav[0], navPath);
  return [];
}

function parseNcx(xml: string, ncxPath: string): TocLink[] {
  const entries: TocLink[] = [];
  for (const block of xml.match(/<navPoint\b[\s\S]*?<\/navPoint>/gi) ?? []) {
    const label = block
      .match(/<navLabel[^>]*>[\s\S]*?<text[^>]*>([^<]+)<\/text>/i)?.[1]
      ?.trim();
    const src = block.match(/<content[^>]*src\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!label || !src) continue;
    entries.push({ href: resolveOpfHref(ncxPath, src), title: label });
  }
  return entries;
}

function flattenToc(links: TocLink[]): { href: string; title: string }[] {
  const out: { href: string; title: string }[] = [];
  for (const link of links) {
    out.push({ href: link.href, title: link.title });
    if (link.children?.length) out.push(...flattenToc(link.children));
  }
  return out;
}

function extractToc(
  zip: AdmZip,
  opfXml: string,
  opfPath: string,
  manifestItems: Map<string, { href: string; type: string }>,
  readingOrder: { href: string; type: string }[]
): { href: string; title: string }[] {
  const navHref = findNavHref(opfXml, manifestItems);
  if (navHref) {
    const entry = zip.getEntry(navHref);
    if (entry) {
      const xml = entry.getData().toString("utf8");
      const links =
        navHref.toLowerCase().endsWith(".ncx") || xml.includes("<ncx")
          ? parseNcx(xml, navHref)
          : parseNavXhtml(xml, navHref);
      const flat = flattenToc(links);
      if (flat.length) return flat;
    }
  }
  return readingOrder.map((r, i) => ({ href: r.href, title: `Chapitre ${i + 1}` }));
}

function parseOpf(
  opfXml: string,
  opfPath: string,
  book: LibraryBookRow,
  bookId: number,
  zip: AdmZip
) {
  const opfDir = path.posix.dirname(opfPath).replace(/^\.$/, "");
  const prefix = opfDir ? `${opfDir}/` : "";

  const manifestItems = new Map<string, { href: string; type: string }>();
  for (const block of opfXml.match(/<item\b[^>]*\/?>/gi) ?? []) {
    const id = xmlAttr(block, "id");
    const href = xmlAttr(block, "href");
    const type = xmlAttr(block, "media-type");
    if (id && href && type) {
      manifestItems.set(id, { href: prefix + href.replace(/\\/g, "/"), type });
    }
  }

  const spineIds: string[] = [];
  for (const block of opfXml.match(/<itemref\b[^>]*\/?>/gi) ?? []) {
    const idref = xmlAttr(block, "idref");
    if (idref) spineIds.push(idref);
  }

  const title =
    opfXml.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i)?.[1]?.trim() || book.title;
  const author =
    opfXml.match(/<dc:creator[^>]*>([^<]+)<\/dc:creator>/i)?.[1]?.trim() || book.author || undefined;
  const language =
    opfXml.match(/<dc:language[^>]*>([^<]+)<\/dc:language>/i)?.[1]?.trim() || book.language || "fr";
  const identifier =
    opfXml.match(/<dc:identifier[^>]*>([^<]+)<\/dc:identifier>/i)?.[1]?.trim() ||
    `urn:freegeny:book:${bookId}`;

  const readingOrder = spineIds
    .map((id) => manifestItems.get(id))
    .filter(Boolean)
    .map((item) => ({ href: item!.href, type: item!.type }));

  const spineSet = new Set(readingOrder.map((r) => r.href));
  const resources = [...manifestItems.values()]
    .filter((item) => !spineSet.has(item.href))
    .map((item) => ({ href: item.href, type: item.type }));

  const toc = extractToc(zip, opfXml, opfPath, manifestItems, readingOrder);
  const base = readiumBaseUrl(bookId);

  const manifest: ReadiumManifest = {
    "@context": "https://readium.org/webpub-manifest/context.jsonld",
    metadata: {
      "@type": "http://schema.org/Book",
      title,
      author,
      language,
      identifier,
      conformsTo: "https://readium.org/webpub-manifest/profiles/epub",
      layout: "reflowable",
    },
    links: [
      { rel: "self", href: `${base}/manifest.json`, type: "application/webpub+json" },
      { href: "positions.json", type: "application/vnd.readium.position-list+json" },
    ],
    readingOrder,
    resources: resources.length ? resources : undefined,
    toc,
  };

  const total = Math.max(readingOrder.length, 1);
  const positions: ReadiumPositions = {
    total,
    positions: readingOrder.map((item, index) => ({
      href: item.href,
      type: item.type,
      locations: {
        position: index + 1,
        progression: 0,
        totalProgression: total === 1 ? 0 : index / (total - 1),
      },
    })),
  };

  return { manifest, positions };
}

async function parseEpubForBook(bookId: number, book: LibraryBookRow): Promise<ParsedEpub> {
  const cached = epubCache.get(bookId);
  if (cached) return cached;

  const buffer = await loadBookFileBuffer(book.fileUrl!);
  const zip = new AdmZip(Buffer.from(buffer));
  const containerEntry = zip.getEntry("META-INF/container.xml");
  if (!containerEntry) throw new Error("EPUB sans container.xml");

  const opfPath = parseContainer(containerEntry.getData().toString("utf8"));
  const opfEntry = zip.getEntry(opfPath);
  if (!opfEntry) throw new Error("OPF introuvable");

  const { manifest, positions } = parseOpf(
    opfEntry.getData().toString("utf8"),
    opfPath.replace(/\\/g, "/"),
    book,
    bookId,
    zip
  );

  const mimeTypes = new Map<string, string>();
  for (const entry of zip.getEntries()) {
    if (!entry.isDirectory) {
      mimeTypes.set(entry.entryName.replace(/\\/g, "/"), guessMime(entry.entryName));
    }
  }

  const parsed: ParsedEpub = { zip, manifest, positions, mimeTypes };
  epubCache.set(bookId, parsed);
  return parsed;
}

function guessMime(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const map: Record<string, string> = {
    ".xhtml": "application/xhtml+xml",
    ".html": "text/html",
    ".css": "text/css",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".opf": "application/oebps-package+xml",
  };
  return map[ext] ?? "application/octet-stream";
}

function sanitizeEntryPath(entryPath: string): string | null {
  const normalized = path.posix.normalize(entryPath.replace(/\\/g, "/")).replace(/^(\.\/)+/, "");
  if (normalized.startsWith("..") || normalized.includes("/../")) return null;
  return normalized;
}

export async function getReadiumManifest(bookId: number): Promise<ReadiumManifest | null> {
  const book = await getPublishedBookById(bookId);
  if (!book?.fileUrl || book.format !== "epub") return null;
  return (await parseEpubForBook(bookId, book)).manifest;
}

export async function getReadiumPositions(bookId: number): Promise<ReadiumPositions | null> {
  const book = await getPublishedBookById(bookId);
  if (!book?.fileUrl || book.format !== "epub") return null;
  return (await parseEpubForBook(bookId, book)).positions;
}

export async function readReadiumResource(
  bookId: number,
  entryPath: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const book = await getPublishedBookById(bookId);
  if (!book?.fileUrl || book.format !== "epub") return null;

  const safe = sanitizeEntryPath(entryPath);
  if (!safe) return null;

  const parsed = await parseEpubForBook(bookId, book);
  const entry = parsed.zip.getEntry(safe);
  if (!entry || entry.isDirectory) return null;

  return {
    buffer: entry.getData(),
    contentType: parsed.mimeTypes.get(safe) ?? guessMime(safe),
  };
}
