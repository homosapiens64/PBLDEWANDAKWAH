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
  const institution = cleanText(payload.institution);

  if (!nisn || !email) {
    return Response.json(
      { message: "NISN dan email wajib diisi." },
      { status: 400 },
    );
  }

  const account = await prisma.pmbApplicantAccount.findFirst({
    where: {
      email,
      institution: institution || undefined,
      nisn,
    },
    select: {
      email: true,
      fullName: true,
      id: true,
      institution: true,
      institutionId: true,
      institutionName: true,
      institutionShort: true,
      nisn: true,
    },
  });

  if (!account) {
    return Response.json(
      { message: "Akun belum ditemukan. Silakan daftar akun terlebih dahulu." },
      { status: 404 },
    );
  }

  return Response.json({
    email: account.email,
    full_name: account.fullName,
    id: account.id,
    institution: account.institution,
    institution_id: account.institutionId,
    institution_name: account.institutionName,
    institution_short: account.institutionShort,
    nisn: account.nisn,
  });
}
