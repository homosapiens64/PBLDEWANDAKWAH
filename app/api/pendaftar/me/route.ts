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
    return Response.json({ message: "Data sesi tidak valid." }, { status: 400 });
  }

  const accountId = Number(payload.id);
  const email = cleanText(payload.email).toLowerCase();
  const nisn = cleanText(payload.nisn);
  const institution = cleanInstitution(payload.institution || payload.institution_slug);

  if (!accountId || !email || !nisn) {
    return Response.json(
      { message: "Sesi login tidak lengkap. Silakan login ulang." },
      { status: 400 },
    );
  }

  const account = await prisma.pmbApplicantAccount.findFirst({
    where: {
      email,
      id: accountId,
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
      { message: "Akun tidak ditemukan. Silakan login ulang." },
      { status: 404 },
    );
  }

  const application = await prisma.pmbApplication.findFirst({
    orderBy: { createdAt: "desc" },
    where: {
      email,
      institution: account.institution,
      nisn,
    },
    select: {
      adminNote: true,
      billingAmount: true,
      billingCode: true,
      createdAt: true,
      docPhotoUrl: true,
      email: true,
      fullName: true,
      id: true,
      institution: true,
      institutionName: true,
      institutionShort: true,
      jalurName: true,
      jurusanName: true,
      nisn: true,
      paymentProofUrl: true,
      phone: true,
      registrationNumber: true,
      status: true,
      updatedAt: true,
    },
  });

  return Response.json({
    account: {
      email: account.email,
      full_name: account.fullName,
      id: account.id,
      institution: account.institution,
      institution_id: account.institutionId,
      institution_name: account.institutionName,
      institution_short: account.institutionShort,
      nisn: account.nisn,
    },
    application: application
      ? {
          admin_note: application.adminNote,
          billing_amount: application.billingAmount,
          billing_code: application.billingCode,
          created_at: application.createdAt,
          doc_photo_url: application.docPhotoUrl,
          email: application.email,
          full_name: application.fullName,
          id: application.id,
          institution: application.institution,
          institution_name: application.institutionName,
          institution_short: application.institutionShort,
          jalur_name: application.jalurName,
          jurusan_name: application.jurusanName,
          nisn: application.nisn,
          payment_proof_url: application.paymentProofUrl,
          phone: application.phone,
          registration_number: application.registrationNumber,
          status: application.status,
          updated_at: application.updatedAt,
        }
      : null,
  });
}
