import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { sendConsultationEmailNotification as sendEmailNotification } from "@/app/lib/consultation-notifications";

const institutionMap: Record<string, string> = {
  ADI: "adi",
  "Al Khawarizmi": "al-khawarizmi",
  "Ponpes Suruh": "ponpes-suruh",
};

const institutionIds: Record<string, string> = {
  ADI: "inst-1",
  "Al Khawarizmi": "inst-3",
  "Ponpes Suruh": "inst-2",
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptional(value: unknown) {
  const text = cleanText(value);
  return text || null;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Payload pendaftaran tidak valid." }, { status: 400 });
  }

  const institutionShort = cleanText(payload.institution_short);
  const institution = institutionMap[institutionShort];
  const fullName = cleanText(payload.full_name);
  const nisn = cleanText(payload.nisn);
  const email = cleanText(payload.email).toLowerCase();
  const registrationNumber = cleanText(payload.registration_number);
  const billingCode = cleanText(payload.billing_code);

  if (!institution || !fullName || !nisn || !email || !registrationNumber || !billingCode) {
    return Response.json(
      { message: "Data wajib pendaftaran belum lengkap." },
      { status: 400 },
    );
  }

  try {
    const account = await prisma.pmbApplicantAccount.findFirst({
      where: {
        OR: [
          { institution, nisn },
          { nisn, email },
        ],
      },
      select: { id: true, institution: true },
    });

    try {
      if (account && account.institution === institution) {
        await prisma.pmbApplicantAccount.update({
          where: { id: account.id },
          data: {
            email,
            fullName,
            institutionId: institutionIds[institutionShort],
            institutionName: cleanText(payload.institution_name) || institutionShort,
            institutionShort,
          },
        });
      } else if (!account) {
        await prisma.pmbApplicantAccount.create({
          data: {
            email,
            fullName,
            institution,
            institutionId: institutionIds[institutionShort],
            institutionName: cleanText(payload.institution_name) || institutionShort,
            institutionShort,
            nisn,
          },
        });
      }
    } catch (error) {
      console.warn("Akun pendaftar tidak dapat dibuat/diperbarui, pendaftaran tetap disimpan.", error);
    }

    const existingApplication = await prisma.pmbApplication.findFirst({
      where: {
        email,
        institution,
        nisn,
      },
      orderBy: { createdAt: "desc" },
      select: {
        billingAmount: true,
        billingCode: true,
        id: true,
        registrationNumber: true,
        status: true,
      },
    });

    if (existingApplication) {
      return Response.json({
        already_registered: true,
        billing_amount: existingApplication.billingAmount,
        billing_code: existingApplication.billingCode,
        email,
        full_name: fullName,
        id: existingApplication.id,
        institution,
        nisn,
        registration_number: existingApplication.registrationNumber,
        status: existingApplication.status,
      });
    }

    const application = await prisma.pmbApplication.create({
      data: {
        address: cleanOptional(payload.address),
        billingAmount: Number(payload.billing_amount) || 150000,
        billingCode,
        birthDate: cleanOptional(payload.birth_date),
        birthPlace: cleanOptional(payload.birth_place),
        certificateNumber: cleanOptional(payload.certificate_number),
        citizenship: cleanOptional(payload.citizenship),
        docIjazahUrl: cleanOptional(payload.doc_ijazah_url),
        docKkUrl: cleanOptional(payload.doc_kk_url),
        docKtpUrl: cleanOptional(payload.doc_ktp_url),
        docPhotoUrl: cleanOptional(payload.doc_photo_url),
        email,
        fatherEducation: cleanOptional(payload.father_education),
        fatherName: cleanOptional(payload.father_name),
        fatherOccupation: cleanOptional(payload.father_occupation),
        fullName,
        gender: cleanOptional(payload.gender),
        graduationYear: cleanOptional(payload.graduation_year),
        guardianName: cleanOptional(payload.guardian_name),
        guardianOccupation: cleanOptional(payload.guardian_occupation),
        institution,
        institutionName: cleanText(payload.institution_name) || institutionShort,
        institutionShort,
        jalurId: cleanOptional(payload.jalur_id),
        jalurName: cleanOptional(payload.jalur_name),
        jurusanId: cleanOptional(payload.jurusan_id),
        jurusanName: cleanOptional(payload.jurusan_name),
        kecamatan: cleanOptional(payload.kecamatan),
        kelurahan: cleanOptional(payload.kelurahan),
        kota: cleanOptional(payload.kota),
        motherEducation: cleanOptional(payload.mother_education),
        motherName: cleanOptional(payload.mother_name),
        motherOccupation: cleanOptional(payload.mother_occupation),
        nisn,
        parentIncome: cleanOptional(payload.parent_income),
        paymentProofUrl: cleanOptional(payload.payment_proof_url),
        phone: cleanOptional(payload.phone),
        provinsi: cleanOptional(payload.provinsi),
        registrationNumber,
        religion: cleanOptional(payload.religion),
        rt: cleanOptional(payload.rt),
        rw: cleanOptional(payload.rw),
        schoolKecamatan: cleanOptional(payload.school_kecamatan),
        schoolName: cleanOptional(payload.school_name),
        schoolStatus: cleanOptional(payload.school_status),
        status: cleanText(payload.status) || "menunggu_verifikasi",
      },
    });

    revalidatePath("/admin");
    revalidatePath("/super-admin");

    void sendEmailNotification({
      body: [
        `Assalamu'alaikum ${application.fullName},`,
        "",
        "Pendaftaran PMB DDI Semarang Anda sudah kami terima.",
        `Lembaga: ${application.institutionName}`,
        application.jurusanName ? `Program/Kelas: ${application.jurusanName}` : "",
        "",
        "Silakan login ke dashboard PMB menggunakan NISN dan email yang didaftarkan untuk memantau status pendaftaran.",
        "",
        "Salam,",
        "Admin PMB DDI Semarang",
      ].filter(Boolean).join("\n"),
      subject: "Pendaftaran PMB DDI Semarang Berhasil Diterima",
      to: [application.email || email],
    });

    return Response.json({
      email: application.email,
      full_name: application.fullName,
      id: application.id,
      institution: application.institution,
      nisn: application.nisn,
      registration_number: application.registrationNumber,
      billing_code: application.billingCode,
      billing_amount: application.billingAmount,
      status: application.status,
    });
  } catch (error) {
    if (
      error instanceof Error
      && error.message.includes("Unique constraint")
    ) {
      return Response.json(
        { message: "Nomor pendaftaran sudah terdaftar." },
        { status: 409 },
      );
    }

    return Response.json(
      { message: "Gagal menyimpan pendaftaran. Pastikan database aktif." },
      { status: 500 },
    );
  }
}
