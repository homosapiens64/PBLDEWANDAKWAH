import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
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
    await prisma.contentItem.create({
      data: {
        authorName: name,
        authorRole: "visitor",
        body: [
          `Nama: ${name}`,
          `Email: ${email}`,
          whatsapp ? `WhatsApp: ${whatsapp}` : "",
          `Sub-topik: ${subtopic}`,
          "",
          question,
        ].filter(Boolean).join("\n"),
        module: "konsultasi",
        section: "pertanyaan-masuk",
        status: "draft",
        summary: subtopic,
        tags: subtopic,
        title,
      },
    });
  } catch {
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
