import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const extensionByType: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const PDF_MIME_TYPE = "application/pdf";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PDF_SIZE = 50 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ message: "File belum dipilih." }, { status: 400 });
  }

  if (!extensionByType[file.type]) {
    return Response.json(
      { message: "Format file harus JPG, PNG, WEBP, atau PDF." },
      { status: 400 },
    );
  }

  const maxSize = file.type === PDF_MIME_TYPE ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;

  if (file.size > maxSize) {
    return Response.json(
      { message: file.type === PDF_MIME_TYPE ? "Ukuran file PDF maksimal 50 MB." : "Ukuran file gambar maksimal 5 MB." },
      { status: 400 },
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const extension = extensionByType[file.type];
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(uploadDir, fileName), bytes);

  return Response.json({ file_url: `/uploads/${fileName}` });
}
