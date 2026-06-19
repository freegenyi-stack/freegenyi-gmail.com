import { readFile } from "fs/promises";
import path from "path";
import { readLibraryFileBuffer } from "@/lib/library/library-upload.server";

/** Charge le binaire d'un livre (uploads://, public/, URL absolue ou distante). */
export async function loadBookFileBuffer(fileUrl: string): Promise<ArrayBuffer> {
  const trimmed = fileUrl.trim();

  if (trimmed.startsWith("uploads://")) {
    const data = await readLibraryFileBuffer(trimmed);
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
  }

  if (trimmed.startsWith("/")) {
    const abs = path.join(process.cwd(), "public", trimmed.slice(1));
    const data = await readFile(abs);
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
  }

  const res = await fetch(trimmed, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Fichier inaccessible (${res.status})`);
  }
  return res.arrayBuffer();
}
