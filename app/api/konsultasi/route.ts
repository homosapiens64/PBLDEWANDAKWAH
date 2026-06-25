import { mkdir, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import path from "path";
import { sendConsultationEmailNotification } from "../../lib/consultation-notifications";
import { prisma } from "../../lib/prisma";

export const runtime = "nodejs";

const extensionByType: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function consultationAdminEmails() {
  return (process.env.CONSULTATION_ADMIN_EMAILS ?? "info@dewandakwah-semarang.or.id")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function saveAttachment(file: File) {
  if (file.size === 0) return "";

  const extension = extensionByType[file.type];
  if (!extension) {
    throw new Error("Format lampiran harus JPG, PNG, WEBP, atau PDF.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran lampiran maksimal 5 MB.");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "konsultasi");
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, fileName), bytes);

  return `/uploads/konsultasi/${fileName}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = readText(formData, "name");
  const email = readText(formData, "email");
  const whatsapp = readText(formData, "whatsapp");
  const subtopic = readText(formData, "subtopic");
  const title = readText(formData, "title");
  const question = readText(formData, "question");
  const privacy = formData.get("privacy");
  const attachment = formData.get("attachment");

  if (!name || !email || !subtopic || !title || !question || !privacy) {
    return NextResponse.json(
      { message: "Nama, email, sub-topik, judul, isi pertanyaan, dan persetujuan wajib diisi." },
      { status: 400 },
    );
  }

  if (title.length > 180) {
    return NextResponse.json(
      { message: "Judul pertanyaan maksimal 180 karakter." },
      { status: 400 },
    );
  }

  try {
    const attachmentUrl = attachment instanceof File ? await saveAttachment(attachment) : "";

    await prisma.contentItem.create({
      data: {
        authorName: name,
        authorRole: "visitor",
        body: [
          `Nama: ${name}`,
          `Email: ${email}`,
          whatsapp ? `WhatsApp: ${whatsapp}` : "",
          `Sub-topik: ${subtopic}`,
          attachmentUrl ? `Lampiran: ${attachmentUrl}` : "",
          "",
          question,
        ].filter(Boolean).join("\n"),
        imageUrl: attachmentUrl || null,
        module: "konsultasi",
        section: "pertanyaan-masuk",
        status: "draft",
        summary: subtopic,
        tags: subtopic,
        title,
      },
    });

    void sendConsultationEmailNotification({
      body: [
        `Pertanyaan konsultasi baru dari ${name}.`,
        `Email: ${email}`,
        whatsapp ? `WhatsApp: ${whatsapp}` : "",
        `Sub-topik: ${subtopic}`,
        `Judul: ${title}`,
        attachmentUrl ? `Lampiran: ${attachmentUrl}` : "",
        "",
        question,
      ].filter(Boolean).join("\n"),
      subject: `Pertanyaan Konsultasi Baru: ${title}`,
      to: consultationAdminEmails(),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("lampiran")) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Database konsultasi belum dapat diakses. Pastikan MySQL aktif." },
      { status: 500 },
    );
  }

  revalidatePath("/Konsultasi");
  revalidatePath("/ustadz");
  revalidatePath("/super-admin");

  return NextResponse.json({ ok: true });
}
