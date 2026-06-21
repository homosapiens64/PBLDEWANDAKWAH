import { prisma } from "@/app/lib/prisma";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Data login tidak valid." }, { status: 400 });
  }

  const nisn = cleanText(payload.nisn);
  const email = cleanText(payload.email).toLowerCase();

  if (!nisn || !email) {
    return Response.json(
      { message: "NISN dan email wajib diisi." },
      { status: 400 },
    );
  }

  const application = await prisma.pmbApplication.findFirst({
    where: {
      email,
      nisn,
    },
    select: {
      email: true,
      id: true,
      nisn: true,
      registrationNumber: true,
    },
  });

  if (!application) {
    return Response.json(
      { message: "Data pendaftaran tidak ditemukan. Pastikan NISN dan email sama dengan saat daftar." },
      { status: 404 },
    );
  }

  return Response.json({
    id: application.id,
    email: application.email,
    nisn: application.nisn,
    registration_number: application.registrationNumber,
  });
}
