import { prisma } from "@/app/lib/prisma";
import { sendConsultationEmailNotification as sendEmailNotification } from "@/app/lib/consultation-notifications";

const institutionMeta: Record<string, { id: string; name: string; shortName: string }> = {
  adi: {
    id: "inst-1",
    name: "ADI (Akademi Da'wah Indonesia)",
    shortName: "ADI",
  },
  "ponpes-suruh": {
    id: "inst-2",
    name: "Ponpes Suruh",
    shortName: "Ponpes Suruh",
  },
  "al-khawarizmi": {
    id: "inst-3",
    name: "Al Khawarizmi",
    shortName: "Al Khawarizmi",
  },
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Data akun tidak valid." }, { status: 400 });
  }

  const institution = cleanText(payload.institution);
  const meta = institutionMeta[institution];
  const fullName = cleanText(payload.full_name || payload.name);
  const nisn = cleanText(payload.nisn);
  const email = cleanText(payload.email).toLowerCase();

  if (!meta || !fullName || !nisn || !email) {
    return Response.json(
      { message: "Lembaga, NISN, nama lengkap, dan email wajib diisi." },
      { status: 400 },
    );
  }

  const existingAccount = await prisma.pmbApplicantAccount.findFirst({
    where: {
      OR: [
        { institution, nisn },
        { nisn, email },
      ],
    },
    select: { id: true },
  });

  if (existingAccount) {
    return Response.json(
      { message: "Akun pendaftar sudah terdaftar. Silakan login memakai NISN dan email tersebut." },
      { status: 409 },
    );
  }

  const account = await prisma.pmbApplicantAccount.create({
    data: {
      email,
      fullName,
      institution,
      institutionId: meta.id,
      institutionName: meta.name,
      institutionShort: meta.shortName,
      nisn,
    },
  });

  void sendEmailNotification({
    body: [
      `Assalamu'alaikum ${account.fullName},`,
      "",
      "Akun pendaftar PMB DDI Semarang Anda berhasil dibuat.",
      `Lembaga: ${account.institutionName}`,
      `NISN: ${account.nisn}`,
      `Email: ${account.email}`,
      "",
      "Silakan lanjut login ke Portal PMB menggunakan NISN dan email tersebut, lalu lengkapi formulir pendaftaran.",
      "",
      "Salam,",
      "Admin PMB DDI Semarang",
    ].join("\n"),
    subject: "Akun PMB DDI Semarang Berhasil Dibuat",
    to: [account.email],
  });

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
