import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const extensionByType: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

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

  if (file.size > 5 * 1024 * 1024) {
    return Response.json(
      { message: "Ukuran file maksimal 5 MB." },
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
