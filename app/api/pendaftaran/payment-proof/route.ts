import { prisma } from "@/app/lib/prisma";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Data bukti pembayaran tidak valid." }, { status: 400 });
  }

  const id = Number(payload.id);
  const nisn = cleanText(payload.nisn);
  const email = cleanText(payload.email).toLowerCase();
  const paymentProofUrl = cleanText(payload.payment_proof_url);

  if (!id || !nisn || !email || !paymentProofUrl) {
    return Response.json(
      { message: "ID pendaftaran, NISN, email, dan bukti pembayaran wajib diisi." },
      { status: 400 },
    );
  }

  const application = await prisma.pmbApplication.findFirst({
    where: {
      email,
      id,
      nisn,
    },
    select: { id: true },
  });

  if (!application) {
    return Response.json(
      { message: "Data pendaftaran tidak ditemukan." },
      { status: 404 },
    );
  }

  await prisma.pmbApplication.update({
    where: { id },
    data: { paymentProofUrl },
  });

  return Response.json({ payment_proof_url: paymentProofUrl });
}
