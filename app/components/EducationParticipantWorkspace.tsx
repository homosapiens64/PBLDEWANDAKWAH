"use client";

import { FormEvent, useMemo, useState } from "react";
import type { PmbApplicant } from "./EducationPmbWorkspace";

type ParticipantStatus = "Aktif" | "Lulus" | "Cuti/Keluar";

type Participant = {
  angkatan: string;
  asalDaerah: string;
  gender: string;
  id: number;
  name: string;
  nis: string;
  pmbApplicant: PmbApplicant | null;
  phone: string;
  source: "Manual" | "PMB";
  status: ParticipantStatus;
};

type EducationParticipantWorkspaceProps = {
  acceptedPmbApplicants?: PmbApplicant[];
  institutionName: string;
  participantLabel: string;
};

const emptyForm = {
  angkatan: "2026",
  asalDaerah: "",
  gender: "Laki-laki",
  name: "",
  nis: "",
  pmbApplicant: null,
  phone: "",
  source: "Manual" as const,
  status: "Aktif" as ParticipantStatus,
};

function MiniIcon({ name }: { name: "bell" | "chevron" | "plus" | "search" | "users" | "x" }) {
  const paths = {
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
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

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value || 0);
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

export default function EducationParticipantWorkspace({
  acceptedPmbApplicants = [],
  institutionName,
  participantLabel,
}: EducationParticipantWorkspaceProps) {
  const pmbParticipants = useMemo<Participant[]>(() => acceptedPmbApplicants.map((applicant) => ({
    angkatan: "2026",
    asalDaerah: applicant.address,
    gender: applicant.gender,
    id: applicant.id,
    name: applicant.name,
    nis: applicant.nisn || applicant.nomorDaftar,
    pmbApplicant: applicant,
    phone: applicant.phone,
    source: "PMB",
    status: "Aktif",
  })), [acceptedPmbApplicants]);
  const [manualParticipants, setManualParticipants] = useState<Participant[]>([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const participants = useMemo(() => [...pmbParticipants, ...manualParticipants], [manualParticipants, pmbParticipants]);
  const selectedParticipant = participants.find((participant) => participant.id === selectedId) ?? null;

  const filteredParticipants = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return participants;

    return participants.filter((participant) => (
      participant.name.toLowerCase().includes(keyword)
      || participant.nis.toLowerCase().includes(keyword)
      || participant.phone.toLowerCase().includes(keyword)
      || (participant.pmbApplicant?.nomorDaftar.toLowerCase().includes(keyword) ?? false)
    ));
  }, [participants, query]);

  const stats = [
    { label: `Total ${participantLabel}`, value: participants.length, tone: "neutral" },
    { label: "Dari PMB", value: pmbParticipants.length, tone: "teal" },
    { label: "Aktif", value: participants.filter((item) => item.status === "Aktif").length, tone: "green" },
    { label: "Cuti/Keluar", value: participants.filter((item) => item.status === "Cuti/Keluar").length, tone: "red" },
  ];

  function closeModal() {
    setIsModalOpen(false);
    setForm(emptyForm);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    if (!name) return;

    setManualParticipants((current) => [
      ...current,
      {
        ...form,
        asalDaerah: form.asalDaerah.trim(),
        id: Date.now(),
        name,
        nis: form.nis.trim(),
        pmbApplicant: null,
        phone: form.phone.trim(),
      },
    ]);
    closeModal();
  }

  return (
    <section className="participantWorkspace">
      <header className="participantTopbar">
        <label className="participantGlobalSearch">
          <MiniIcon name="search" />
          <input aria-label="Cari" placeholder="Cari..." type="search" />
        </label>

        <div className="participantUserTools">
          <button className="participantBell" type="button" aria-label="Notifikasi">
            <MiniIcon name="bell" />
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

      <div className="participantPageHead">
        <div>
          <h1>Data {participantLabel}</h1>
          <p>{institutionName} - {pmbParticipants.length} data diterima dari PMB</p>
        </div>
        <button className="participantAddButton" type="button" onClick={() => setIsModalOpen(true)}>
          <MiniIcon name="plus" />
          <span>Tambah {participantLabel}</span>
        </button>
      </div>

      <div className="participantStats" aria-label={`Ringkasan ${participantLabel}`}>
        {stats.map((stat) => (
          <article className="participantStatCard" key={stat.label}>
            <span>{stat.label}</span>
            <strong className={`participantStatValue ${stat.tone}`}>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="participantFilterCard">
        <label className="participantSearchBox">
          <MiniIcon name="search" />
          <input
            aria-label={`Cari nama atau NIS ${participantLabel}`}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama / NIS..."
            type="search"
            value={query}
          />
        </label>
        <p className="participantImportNote">
          Data dari PMB otomatis diambil jika pendaftar sudah bayar dan statusnya diterima.
        </p>
      </div>

      <section className="participantListCard" aria-label={`Daftar ${participantLabel}`}>
        {filteredParticipants.length > 0 ? filteredParticipants.map((participant) => (
          <button
            className="participantApplicantCard"
            key={`${participant.source}-${participant.id}`}
            onClick={() => setSelectedId(participant.id)}
            type="button"
          >
            <span className="pmbAvatar">{getInitials(participant.name)}</span>
            <span className="pmbApplicantMain">
              <strong>{participant.name}</strong>
              <small className="participantMeta">
                <span>NIS/NIM: {participant.nis || "-"}</span>
                <span>{participant.pmbApplicant?.nomorDaftar ?? "Manual"}</span>
                <span>{(participant.pmbApplicant?.placeOfBirth ?? participant.asalDaerah) || "-"}</span>
              </small>
            </span>
            <span className="participantBadges">
              <span className={`participantStatus ${participant.status.toLowerCase().replace("/", "-")}`}>
                {participant.status}
              </span>
              <span className={`participantSource ${participant.source.toLowerCase()}`}>
                {participant.source}
              </span>
            </span>
            <span className="pmbMore"><MiniIcon name="chevron" /></span>
          </button>
        )) : (
          <div className="participantEmptyState">
            <MiniIcon name="users" />
            <p>Belum ada data {participantLabel}</p>
          </div>
        )}
      </section>

      {selectedParticipant ? (
        <div className="pmbDetailOverlay" role="presentation" onMouseDown={() => setSelectedId(null)}>
          <section className="pmbDetailModal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="pmbDetailHead">
              <h2>Detail {participantLabel} - {selectedParticipant.name}</h2>
              <button type="button" aria-label="Tutup" onClick={() => setSelectedId(null)}>
                <MiniIcon name="x" />
              </button>
            </div>

            {selectedParticipant.pmbApplicant ? (
              <>
                <div className="pmbDetailGrid">
                  <DetailItem label="NISN" value={selectedParticipant.pmbApplicant.nisn} />
                  <DetailItem label="No. Daftar" value={selectedParticipant.pmbApplicant.nomorDaftar} />
                  <DetailItem label="Jenis Kelamin" value={selectedParticipant.pmbApplicant.gender} />
                  <DetailItem label="Agama" value={selectedParticipant.pmbApplicant.agama} />
                  <DetailItem label="Tempat Lahir" value={selectedParticipant.pmbApplicant.placeOfBirth} />
                  <DetailItem label="Tanggal Lahir" value={selectedParticipant.pmbApplicant.birthDate} />
                  <DetailItem label="Kewarganegaraan" value={selectedParticipant.pmbApplicant.citizenship} />
                  <DetailItem label="No. HP" value={selectedParticipant.pmbApplicant.phone} />
                  <DetailItem label="Email" value={selectedParticipant.pmbApplicant.email} />
                  <DetailItem label="Jalur" value={selectedParticipant.pmbApplicant.jalurName} />
                  <DetailItem label="Program/Kelas" value={selectedParticipant.pmbApplicant.jurusanName} />
                  <DetailItem label="Asal Sekolah" value={selectedParticipant.pmbApplicant.asalSekolah} />
                  <DetailItem label="Status Sekolah" value={selectedParticipant.pmbApplicant.schoolStatus} />
                  <DetailItem label="Kecamatan Sekolah" value={selectedParticipant.pmbApplicant.schoolKecamatan} />
                  <DetailItem label="Nomor Ijazah" value={selectedParticipant.pmbApplicant.nomorIjazah} />
                  <DetailItem label="Tahun Ijazah" value={selectedParticipant.pmbApplicant.graduationYear} />
                  <DetailItem label="Nama Ayah" value={selectedParticipant.pmbApplicant.fatherName} />
                  <DetailItem label="Nama Ibu" value={selectedParticipant.pmbApplicant.motherName} />
                  <DetailItem label="Penghasilan Gabungan" value={selectedParticipant.pmbApplicant.income} />
                  <DetailItem label="Kode Tagihan" value={selectedParticipant.pmbApplicant.billingCode} />
                  <DetailItem label="Nominal" value={formatRupiah(selectedParticipant.pmbApplicant.billingAmount)} />
                  <DetailItem label="Alamat" value={selectedParticipant.pmbApplicant.address} />
                </div>

                <div className="pmbDocuments">
                  <h3>Dokumen</h3>
                  <div className="pmbDocumentLinks">
                    <DocumentLink href={selectedParticipant.pmbApplicant.photoUrl} label="Foto" />
                    <DocumentLink href={selectedParticipant.pmbApplicant.ijazahUrl} label="Ijazah" />
                    <DocumentLink href={selectedParticipant.pmbApplicant.docKtpUrl} label="KTP/Akta" />
                    <DocumentLink href={selectedParticipant.pmbApplicant.docKkUrl} label="Kartu Keluarga" />
                    <DocumentLink href={selectedParticipant.pmbApplicant.paymentProofUrl} label="Bukti Pembayaran" />
                  </div>
                </div>
              </>
            ) : (
              <div className="pmbDetailGrid">
                <DetailItem label="NIS/NIM" value={selectedParticipant.nis} />
                <DetailItem label="Angkatan" value={selectedParticipant.angkatan} />
                <DetailItem label="Jenis Kelamin" value={selectedParticipant.gender} />
                <DetailItem label="Status" value={selectedParticipant.status} />
                <DetailItem label="No. HP" value={selectedParticipant.phone} />
                <DetailItem label="Asal Daerah" value={selectedParticipant.asalDaerah} />
                <DetailItem label="Sumber Data" value="Manual" />
              </div>
            )}

            <div className="pmbDetailActions">
              <button className="participantCancelButton" type="button" onClick={() => setSelectedId(null)}>
                Tutup
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="participantModalOverlay" role="presentation" onMouseDown={closeModal}>
          <form
            className="participantModal"
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <div className="participantModalHead">
              <h2>Tambah {participantLabel}</h2>
              <button type="button" aria-label="Tutup" onClick={closeModal}>
                <MiniIcon name="x" />
              </button>
            </div>

            <label className="participantField full">
              <span>Nama Lengkap</span>
              <input
                autoFocus
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
                value={form.name}
              />
            </label>

            <div className="participantFormGrid">
              <label className="participantField">
                <span>NIS/NIM</span>
                <input
                  onChange={(event) => setForm((current) => ({ ...current, nis: event.target.value }))}
                  value={form.nis}
                />
              </label>
              <label className="participantField">
                <span>Angkatan</span>
                <input
                  onChange={(event) => setForm((current) => ({ ...current, angkatan: event.target.value }))}
                  value={form.angkatan}
                />
              </label>
              <label className="participantField">
                <span>Jenis Kelamin</span>
                <select
                  onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
                  value={form.gender}
                >
                  <option>Laki-laki</option>
                  <option>Perempuan</option>
                </select>
              </label>
              <label className="participantField">
                <span>Status</span>
                <select
                  onChange={(event) => setForm((current) => ({
                    ...current,
                    status: event.target.value as ParticipantStatus,
                  }))}
                  value={form.status}
                >
                  <option>Aktif</option>
                  <option>Lulus</option>
                  <option>Cuti/Keluar</option>
                </select>
              </label>
              <label className="participantField">
                <span>No. HP</span>
                <input
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  value={form.phone}
                />
              </label>
              <label className="participantField">
                <span>Asal Daerah</span>
                <input
                  onChange={(event) => setForm((current) => ({ ...current, asalDaerah: event.target.value }))}
                  value={form.asalDaerah}
                />
              </label>
            </div>

            <div className="participantModalActions">
              <button className="participantCancelButton" type="button" onClick={closeModal}>
                Batal
              </button>
              <button className="participantSaveButton" type="submit">
                Simpan
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
