import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

function statusLabel(status: string) {
  if (status === "diterima") return "Diterima";
  if (status === "ditolak") return "Ditolak";
  return "Menunggu Verifikasi";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(value);
}

export default async function PmbStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ email?: string; nisn?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const applicationId = Number(id);

  if (!Number.isInteger(applicationId)) {
    notFound();
  }

  const application = await prisma.pmbApplication.findFirst({
    where: {
      email: query.email || "",
      id: applicationId,
      nisn: query.nisn || "",
    },
    select: {
      adminNote: true,
      billingAmount: true,
      billingCode: true,
      createdAt: true,
      fullName: true,
      institutionName: true,
      institutionShort: true,
      jurusanName: true,
      registrationNumber: true,
      status: true,
    },
  });

  if (!application) {
    notFound();
  }

  return (
    <main className="pmbAuthPage">
      <section className="pmbStatusShell">
        <div className="pmbAuthBrand compact">
          <span>DD</span>
          <h1>Status Pendaftaran</h1>
          <p>Portal PMB DDI Semarang 2026</p>
        </div>

        <article className="pmbStatusCard">
          <div className="pmbStatusTop">
            <div>
              <p>No. Pendaftaran</p>
              <h2>{application.registrationNumber}</h2>
            </div>
            <span className={`pmbStatusPill ${application.status}`}>
              {statusLabel(application.status)}
            </span>
          </div>

          <div className="pmbStatusRows">
            <p><span>Nama</span><strong>{application.fullName}</strong></p>
            <p><span>Lembaga</span><strong>{application.institutionName}</strong></p>
            <p><span>Program/Kelas</span><strong>{application.jurusanName || "-"}</strong></p>
            <p><span>Tanggal Daftar</span><strong>{formatDate(application.createdAt)}</strong></p>
            <p><span>Kode Tagihan</span><strong>{application.billingCode}</strong></p>
            <p><span>Biaya</span><strong>Rp {application.billingAmount.toLocaleString("id-ID")}</strong></p>
          </div>

          {application.adminNote ? (
            <div className="pmbStatusNote">
              <strong>Catatan Admin</strong>
              <p>{application.adminNote}</p>
            </div>
          ) : null}

          <div className="pmbStatusActions">
            <Link href="/Pendidikan/pmb/login">Kembali ke Login</Link>
            <Link href="/Pendidikan/pmb">Portal PMB</Link>
          </div>
        </article>

        <p className="pmbAuthFooter">&copy; 2026 DDI Semarang &middot; Portal PMB</p>
      </section>
    </main>
  );
}
