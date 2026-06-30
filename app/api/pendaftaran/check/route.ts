import { prisma } from "@/app/lib/prisma";

const institutionSlugs = ["adi", "al-khawarizmi", "ponpes-suruh"] as const;

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanInstitution(value: unknown) {
  const institution = cleanText(value);
  return institutionSlugs.includes(institution as typeof institutionSlugs[number])
    ? institution
    : "";
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
  const institution = cleanInstitution(payload.institution || payload.institution_slug);

  if (!nisn || !email) {
    return Response.json(
      { message: "NISN dan email wajib diisi." },
      { status: 400 },
    );
  }

  const application = await prisma.pmbApplication.findFirst({
    where: {
      email,
      institution: institution || undefined,
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
