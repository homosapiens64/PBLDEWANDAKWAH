"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { updatePmbApplicationStatus } from "../dashboard-actions";

type PmbStatus =
  | "Draft"
  | "Menunggu Verifikasi"
  | "Verifikasi Adm."
  | "Menunggu Bayar"
  | "Sudah Bayar"
  | "Diterima"
  | "Ditolak"
  | "Daftar Ulang";

export type PmbApplicant = {
  address: string;
  agama: string;
  asalSekolah: string;
  billingAmount: number;
  billingCode: string;
  birthDate: string;
  citizenship: string;
  docKkUrl: string;
  docKtpUrl: string;
  email: string;
  fatherName: string;
  gender: string;
  graduationYear: string;
  id: number;
  ijazahUrl: string;
  income: string;
  jalurName: string;
  jurusanName: string;
  motherName: string;
  name: string;
  nisn: string;
  nomorDaftar: string;
  nomorIjazah: string;
  phone: string;
  paymentProofUrl: string;
  photoUrl: string;
  placeOfBirth: string;
  schoolKecamatan: string;
  schoolStatus: string;
  status: PmbStatus;
  statusNote: string;
  sudahBayar: boolean;
};

type EducationPmbWorkspaceProps = {
  initialApplicants: PmbApplicant[];
  institutionShortName: string;
  participantHref: string;
  participantLabel: string;
};

function PmbIcon({ name }: { name: "bell" | "gear" | "more" | "search" | "x" }) {
  const paths = {
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    gear: (
      <>
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09A1.65 1.65 0 0 0 19.4 15Z" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1.2" />
        <circle cx="12" cy="12" r="1.2" />
        <circle cx="19" cy="12" r="1.2" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    x: <path d="M18 6 6 18M6 6l12 12" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const pmbStatuses: PmbStatus[] = [
  "Draft",
  "Menunggu Verifikasi",
  "Verifikasi Adm.",
  "Menunggu Bayar",
  "Sudah Bayar",
  "Diterima",
  "Ditolak",
  "Daftar Ulang",
];

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value || 0);
}

function statusClassName(status: PmbStatus) {
  return status.toLowerCase().replaceAll(" ", "-").replaceAll(".", "");
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <p>
      {label}: <strong>{value || "-"}</strong>
    </p>
  );
}

function DocumentLink({ href, label }: { href: string; label: string }) {
  if (!href || href === "#") {
    return <span className="pmbDocumentMissing">{label}: belum diupload</span>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

export default function EducationPmbWorkspace({
  initialApplicants,
  institutionShortName,
  participantHref,
  participantLabel,
}: EducationPmbWorkspaceProps) {
  const [applicants, setApplicants] = useState<PmbApplicant[]>(initialApplicants);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<PmbStatus | "Semua" | "Siap Dipindahkan">("Semua");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draftStatus, setDraftStatus] = useState<PmbStatus>("Menunggu Verifikasi");
  const [draftNote, setDraftNote] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setApplicants(initialApplicants);
    setQuery("");
    setActiveTab("Semua");
    setSelectedId(null);
    setDraftStatus("Menunggu Verifikasi");
    setDraftNote("");
    setMessage("");
  }, [initialApplicants, institutionShortName]);

  const selectedApplicant = applicants.find((item) => item.id === selectedId) ?? null;

  const filteredApplicants = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return applicants.filter((applicant) => {
      const isReadyForParticipant = applicant.status === "Diterima" && applicant.sudahBayar;
      const matchesTab = activeTab === "Semua"
        || (activeTab === "Siap Dipindahkan" ? isReadyForParticipant : applicant.status === activeTab);
      const matchesQuery = !keyword
        || applicant.name.toLowerCase().includes(keyword)
        || applicant.nisn.toLowerCase().includes(keyword)
        || applicant.nomorDaftar.toLowerCase().includes(keyword);

      return matchesTab && matchesQuery;
    });
  }, [activeTab, applicants, query]);

  const waitingCount = applicants.filter((item) => item.status === "Menunggu Verifikasi").length;
  const acceptedCount = applicants.filter((item) => item.status === "Diterima").length;
  const readyApplicants = applicants.filter((item) => item.status === "Diterima" && item.sudahBayar);
  const tabStatuses = pmbStatuses.filter((status) => (
    status === "Menunggu Verifikasi" || applicants.some((item) => item.status === status)
  ));

  const stats = [
    { label: "Total Daftar", tone: "neutral", value: applicants.length },
    { label: "Menunggu Verifikasi", tone: "gold", value: waitingCount },
    { label: "Diterima", tone: "green", value: acceptedCount },
    { label: `Siap Jadi ${participantLabel}`, tone: "teal", value: readyApplicants.length },
  ];

  function openDetail(applicant: PmbApplicant) {
    setSelectedId(applicant.id);
    setDraftStatus(applicant.status);
    setDraftNote(applicant.statusNote);
  }

  function saveDetail() {
    if (!selectedApplicant) return;

    setMessage("");
    startTransition(async () => {
      try {
        await updatePmbApplicationStatus({
          id: selectedApplicant.id,
          note: draftNote,
          status: toStoredStatus(draftStatus),
        });
        setApplicants((current) => current.map((applicant) => (
          applicant.id === selectedApplicant.id
            ? {
                ...applicant,
                status: draftStatus,
                statusNote: draftNote,
                sudahBayar: applicant.sudahBayar || draftStatus === "Sudah Bayar",
              }
            : applicant
        )));
        setSelectedId(null);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Gagal menyimpan perubahan.");
      }
    });
  }

  return (
    <section className="pmbWorkspace">
      <header className="participantTopbar">
        <label className="participantGlobalSearch">
          <PmbIcon name="search" />
          <input aria-label="Cari" placeholder="Cari..." type="search" />
        </label>

        <div className="participantUserTools">
          <button className="participantBell" type="button" aria-label="Notifikasi">
            <PmbIcon name="bell" />
            <span />
          </button>
          <button className="participantProfile" type="button">
            <strong>AK</strong>
            <span>
              <b>Ak K</b>
              <small>Admin</small>
            </span>
          </button>
        </div>
      </header>

      <div className="pmbPageHead">
        <div>
          <h1>PMB - {institutionShortName}</h1>
          <p>Manajemen Penerimaan Peserta Didik Baru</p>
        </div>
        <button className="pmbSettingsButton" type="button">
          <PmbIcon name="gear" />
          <span>Jurusan & Jalur</span>
        </button>
      </div>

      <div className="participantStats pmbStats" aria-label="Ringkasan PMB">
        {stats.map((stat) => (
          <article className="participantStatCard" key={stat.label}>
            <span>{stat.label}</span>
            <strong className={`participantStatValue ${stat.tone}`}>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="pmbSearchWrap">
        <input
          aria-label="Cari pendaftar"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama, NISN, no. pendaftaran..."
          type="search"
          value={query}
        />
      </div>

      <div className="pmbTabs" aria-label="Filter status PMB">
        <button
          className={activeTab === "Semua" ? "active" : ""}
          onClick={() => setActiveTab("Semua")}
          type="button"
        >
          Semua ({applicants.length})
        </button>
        <button
          className={activeTab === "Siap Dipindahkan" ? "active" : ""}
          onClick={() => setActiveTab("Siap Dipindahkan")}
          type="button"
        >
          Siap Jadi {participantLabel} ({readyApplicants.length})
        </button>
        {tabStatuses.map((status) => (
          <button
            className={activeTab === status ? "active" : ""}
            key={status}
            onClick={() => setActiveTab(status)}
            type="button"
          >
            {status} ({applicants.filter((item) => item.status === status).length})
          </button>
        ))}
      </div>

      <div className="pmbApplicantList" aria-label="Daftar pendaftar PMB">
        {filteredApplicants.length > 0 ? filteredApplicants.map((applicant) => (
          <button className="pmbApplicantCard" key={applicant.id} onClick={() => openDetail(applicant)} type="button">
            <span className="pmbAvatar">{getInitials(applicant.name)}</span>
            <span className="pmbApplicantMain">
              <strong>{applicant.name}</strong>
              <small>NISN: {applicant.nisn} - {applicant.nomorDaftar} - {applicant.placeOfBirth}</small>
            </span>
            <span className={`pmbStatusBadge ${statusClassName(applicant.status)}`}>
              {applicant.status}
            </span>
            {applicant.status === "Diterima" && applicant.sudahBayar ? (
              <span className="pmbTransferBadge">Siap masuk Data {participantLabel}</span>
            ) : null}
            <span className="pmbMore"><PmbIcon name="more" /></span>
          </button>
        )) : (
          <div className="pmbEmpty">Belum ada data pendaftar.</div>
        )}
      </div>

      {selectedApplicant ? (
        <div className="pmbDetailOverlay" role="presentation" onMouseDown={() => setSelectedId(null)}>
          <section className="pmbDetailModal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="pmbDetailHead">
              <h2>Detail Pendaftar - {selectedApplicant.name}</h2>
              <button type="button" aria-label="Tutup" onClick={() => setSelectedId(null)}>
                <PmbIcon name="x" />
              </button>
            </div>

            <div className="pmbDetailGrid">
              <DetailItem label="NISN" value={selectedApplicant.nisn} />
              <DetailItem label="No. Daftar" value={selectedApplicant.nomorDaftar} />
              <DetailItem label="Jenis Kelamin" value={selectedApplicant.gender} />
              <DetailItem label="Agama" value={selectedApplicant.agama} />
              <DetailItem label="Tempat Lahir" value={selectedApplicant.placeOfBirth} />
              <DetailItem label="Tanggal Lahir" value={selectedApplicant.birthDate} />
              <DetailItem label="Kewarganegaraan" value={selectedApplicant.citizenship} />
              <DetailItem label="No. HP" value={selectedApplicant.phone} />
              <DetailItem label="Email" value={selectedApplicant.email} />
              <DetailItem label="Jalur" value={selectedApplicant.jalurName} />
              <DetailItem label="Program/Kelas" value={selectedApplicant.jurusanName} />
              <DetailItem label="Asal Sekolah" value={selectedApplicant.asalSekolah} />
              <DetailItem label="Status Sekolah" value={selectedApplicant.schoolStatus} />
              <DetailItem label="Kecamatan Sekolah" value={selectedApplicant.schoolKecamatan} />
              <DetailItem label="Nomor Ijazah" value={selectedApplicant.nomorIjazah} />
              <DetailItem label="Tahun Ijazah" value={selectedApplicant.graduationYear} />
              <DetailItem label="Nama Ayah" value={selectedApplicant.fatherName} />
              <DetailItem label="Nama Ibu" value={selectedApplicant.motherName} />
              <DetailItem label="Penghasilan Gabungan" value={selectedApplicant.income} />
              <DetailItem label="Kode Tagihan" value={selectedApplicant.billingCode} />
              <DetailItem label="Nominal" value={formatRupiah(selectedApplicant.billingAmount)} />
              <DetailItem label="Alamat" value={selectedApplicant.address} />
            </div>

            <div className="pmbDocuments">
              <h3>Dokumen</h3>
              <div className="pmbDocumentLinks">
                <DocumentLink href={selectedApplicant.photoUrl} label="Foto" />
                <DocumentLink href={selectedApplicant.ijazahUrl} label="Ijazah" />
                <DocumentLink href={selectedApplicant.docKtpUrl} label="KTP/Akta" />
                <DocumentLink href={selectedApplicant.docKkUrl} label="Kartu Keluarga" />
                <DocumentLink href={selectedApplicant.paymentProofUrl} label="Bukti Pembayaran" />
              </div>
            </div>

            <div className="pmbUpdatePanel">
              <h3>Update Status</h3>
              <label>
                <span>Status</span>
                <select
                  onChange={(event) => setDraftStatus(event.target.value as PmbStatus)}
                  value={draftStatus}
                >
                  {pmbStatuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              {draftStatus === "Menunggu Bayar" || draftStatus === "Sudah Bayar" ? (
                <div className="pmbPaymentInfo">
                  <span>Informasi pembayaran</span>
                  <p>
                    Kode tagihan: <strong>{selectedApplicant.billingCode}</strong><br />
                    Nominal: <strong>{formatRupiah(selectedApplicant.billingAmount)}</strong>
                  </p>
                </div>
              ) : null}
              <label>
                <span>Catatan untuk Pendaftar</span>
                <textarea
                  onChange={(event) => setDraftNote(event.target.value)}
                  placeholder="Pesan untuk pendaftar..."
                  rows={4}
                  value={draftNote}
                />
              </label>
              {message ? <p className="pmbErrorMessage">{message}</p> : null}
            </div>

            <div className="pmbDetailActions">
              {selectedApplicant.status === "Diterima" && selectedApplicant.sudahBayar ? (
                <a className="participantSaveButton pmbParticipantLink" href={participantHref}>
                  Buka Data {participantLabel}
                </a>
              ) : null}
              <button className="participantCancelButton" type="button" onClick={() => setSelectedId(null)}>
                Tutup
              </button>
              <button className="participantSaveButton" type="button" onClick={saveDetail} disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function toStoredStatus(status: PmbStatus) {
  if (status === "Draft") return "draft";
  if (status === "Verifikasi Adm.") return "verifikasi_adm";
  if (status === "Menunggu Bayar") return "menunggu_bayar";
  if (status === "Sudah Bayar") return "sudah_bayar";
  if (status === "Diterima") return "diterima";
  if (status === "Ditolak") return "ditolak";
  if (status === "Daftar Ulang") return "daftar_ulang";
  return "menunggu_verifikasi";
}
