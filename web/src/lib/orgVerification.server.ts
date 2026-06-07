import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import {
  getRequiredNgoDocs,
  getRequiredSchoolDocs,
} from "@/lib/orgVerification.shared";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads", "verifications");
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export function generateTrackingCode(): string {
  const year = new Date().getFullYear();
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `FG-${year}-${suffix}`;
}

export async function saveVerificationDocument(
  userId: number,
  fieldName: string,
  file: File
): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error(`Fichier manquant: ${fieldName}`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Fichier trop volumineux: ${fieldName}`);
  }
  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    throw new Error(`Format non accepté: ${fieldName}`);
  }

  const ext = path.extname(file.name) || (file.type === "application/pdf" ? ".pdf" : ".jpg");
  const safeName = `${fieldName}-${Date.now()}${ext}`;
  const dir = path.join(UPLOAD_ROOT, String(userId));
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const fullPath = path.join(dir, safeName);
  await writeFile(fullPath, buffer);

  return path.posix.join("verifications", String(userId), safeName);
}

export async function processOrgDocuments(
  userId: number,
  userType: "ecole" | "ong",
  formData: FormData,
  requiredKeys?: string[]
): Promise<Record<string, string>> {
  const docs: Record<string, string> = {};
  const institutionType = (formData.get("institution_type") as string) || "Publique";
  const privateDocType = (formData.get("private_doc_type") as string) || "licence";

  const required =
    requiredKeys ??
    (userType === "ecole"
      ? getRequiredSchoolDocs(institutionType, privateDocType)
      : getRequiredNgoDocs());

  for (const key of required) {
    const file = formData.get(`doc_${key}`) as File | null;
    if (!file || file.size === 0) {
      throw new Error(`DOCUMENT_MISSING:${key}`);
    }
    docs[key] = await saveVerificationDocument(userId, key, file);
  }

  return docs;
}
