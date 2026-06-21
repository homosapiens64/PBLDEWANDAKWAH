import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";

const institutionMap: Record<string, string> = {
  ADI: "adi",
  "Al Khawarizmi": "al-khawarizmi",
  "Ponpes Suruh": "ponpes-suruh",
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
        email,
        institution,
        nisn,
      },
      select: { id: true },
    });

    if (!account) {
      return Response.json(
        { message: "Silakan daftar akun dan login terlebih dahulu sebelum mengirim formulir." },
        { status: 403 },
      );
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

    return Response.json({
      id: application.id,
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
