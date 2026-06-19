import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { getBookById, upsertLibraryBook, type LibraryBookFormat } from "@/lib/library/books.server";
import { parseAudience } from "@/lib/library/audience";
import { LIBRARY_ERROR } from "@/lib/library/library-errors";
import { saveLibraryCover, saveLibraryEpub, saveLibraryPdf } from "@/lib/library/library-upload.server";
import { countPdfPages } from "@/lib/library/pdf-utils.server";

function detectFormat(file: File): LibraryBookFormat | null {
  const name = file.name.toLowerCase();
  if (name.endsWith(".epub") || file.type === "application/epub+zip") return "epub";
  if (name.endsWith(".pdf") || file.type === "application/pdf") return "pdf";
  return null;
}

export async function POST(req: NextRequest) {
  const admin = await requireAdminSession();
  if ("error" in admin) {
    return NextResponse.json({ error: LIBRARY_ERROR.UNAUTHORIZED }, { status: 401 });
  }

  const formData = await req.formData();
  const bookIdRaw = formData.get("bookId") as string | null;
  const bookFile =
    (formData.get("bookFile") as File | null) ||
    (formData.get("epub") as File | null) ||
    (formData.get("pdf") as File | null);
  const cover = formData.get("cover") as File | null;
  const bookIdParsed = bookIdRaw ? parseInt(bookIdRaw, 10) : undefined;
  const isUpdate = bookIdParsed != null && !Number.isNaN(bookIdParsed);

  let title = (formData.get("title") as string)?.trim();
  if (!title && isUpdate) {
    const existing = await getBookById(bookIdParsed!);
    title = existing?.title ?? "";
  }
  if (!title) {
    return NextResponse.json({ error: LIBRARY_ERROR.TITLE_REQUIRED }, { status: 400 });
  }

  const hasBookFile = bookFile && bookFile.size > 0;
  const hasCover = cover && cover.size > 0;

  if (!isUpdate && !hasBookFile) {
    return NextResponse.json({ error: LIBRARY_ERROR.FILE_REQUIRED }, { status: 400 });
  }
  if (isUpdate && !hasBookFile && !hasCover) {
    return NextResponse.json({ error: LIBRARY_ERROR.PICK_FILE_OR_COVER }, { status: 400 });
  }

  const audience = parseAudience(formData.get("audience") as string);
  const ageMinStr = formData.get("ageMin") as string;
  const ageMaxStr = formData.get("ageMax") as string;

  try {
    const existing = isUpdate ? await getBookById(bookIdParsed!) : null;
    let format: LibraryBookFormat = existing?.format === "pdf" ? "pdf" : "epub";
    let pageCount: number | null = existing?.pageCount ?? null;

    const base = {
      id: isUpdate ? bookIdParsed : undefined,
      title,
      author: (formData.get("author") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      subject: (formData.get("subject") as string) || undefined,
      language: (formData.get("language") as string) || "fr",
      audience,
      ageMin: ageMinStr ? parseInt(ageMinStr, 10) : null,
      ageMax: ageMaxStr ? parseInt(ageMaxStr, 10) : null,
      isPublished: formData.get("isPublished") === "true",
      format,
      pageCount,
    };

    const { id } = isUpdate ? { id: bookIdParsed! } : await upsertLibraryBook(base);

    let fileUrl: string | undefined;
    let coverUrl: string | undefined;

    if (hasBookFile) {
      const detected = detectFormat(bookFile!);
      if (!detected) {
        return NextResponse.json({ error: LIBRARY_ERROR.FILE_REQUIRED }, { status: 400 });
      }
      format = detected;
      if (detected === "pdf") {
        const buffer = Buffer.from(await bookFile!.arrayBuffer());
        pageCount = countPdfPages(buffer);
        fileUrl = await saveLibraryPdf(id, bookFile!);
      } else {
        pageCount = null;
        fileUrl = await saveLibraryEpub(id, bookFile!);
      }
    }
    if (hasCover) {
      coverUrl = await saveLibraryCover(id, cover!);
    }

    await upsertLibraryBook({
      ...base,
      id,
      format,
      pageCount,
      fileUrl: fileUrl ?? existing?.fileUrl ?? undefined,
      coverUrl: coverUrl ?? existing?.coverUrl ?? undefined,
    });

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/dashboard/admin/library");
    revalidatePath(`/dashboard/admin/library/${id}`);
    revalidatePath("/dashboard/parent/bibliotheque");
    revalidatePath("/dashboard/enseignant/bibliotheque");

    return NextResponse.json({ success: true, id, format });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "pdf_only" || msg === "pdf_too_large") {
      return NextResponse.json({ error: LIBRARY_ERROR.FILE_REQUIRED }, { status: 400 });
    }
    return NextResponse.json({ error: LIBRARY_ERROR.UPLOAD_FAILED }, { status: 400 });
  }
}
