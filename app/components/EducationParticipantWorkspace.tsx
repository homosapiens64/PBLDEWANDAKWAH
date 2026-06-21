"use client";

import { FormEvent, useMemo, useState } from "react";

type ParticipantStatus = "Aktif" | "Lulus" | "Cuti/Keluar";

type Participant = {
  angkatan: string;
  asalDaerah: string;
  gender: string;
  id: number;
  name: string;
  nis: string;
  phone: string;
  status: ParticipantStatus;
};

type EducationParticipantWorkspaceProps = {
  institutionName: string;
  participantLabel: string;
};

const emptyForm = {
  angkatan: "2026",
  asalDaerah: "",
  gender: "Laki-laki",
  name: "",
  nis: "",
  phone: "",
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

export default function EducationParticipantWorkspace({
  institutionName,
  participantLabel,
}: EducationParticipantWorkspaceProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filteredParticipants = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return participants;

    return participants.filter((participant) => (
      participant.name.toLowerCase().includes(keyword)
      || participant.nis.toLowerCase().includes(keyword)
    ));
  }, [participants, query]);

  const stats = [
    { label: `Total ${participantLabel}`, value: participants.length, tone: "neutral" },
    { label: "Aktif", value: participants.filter((item) => item.status === "Aktif").length, tone: "green" },
    { label: "Lulus", value: participants.filter((item) => item.status === "Lulus").length, tone: "blue" },
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

    setParticipants((current) => [
      ...current,
      {
        ...form,
        asalDaerah: form.asalDaerah.trim(),
        id: Date.now(),
        name,
        nis: form.nis.trim(),
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
          <p>{institutionName}</p>
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
      </div>

      <section className="participantListCard" aria-label={`Daftar ${participantLabel}`}>
        {filteredParticipants.length > 0 ? (
          <div className="participantTableWrap">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>NIS/NIM</th>
                  <th>Angkatan</th>
                  <th>Status</th>
                  <th>Asal Daerah</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((participant) => (
                  <tr key={participant.id}>
                    <td>{participant.name}</td>
                    <td>{participant.nis || "-"}</td>
                    <td>{participant.angkatan}</td>
                    <td>
                      <span className={`participantStatus ${participant.status.toLowerCase().replace("/", "-")}`}>
                        {participant.status}
                      </span>
                    </td>
                    <td>{participant.asalDaerah || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="participantEmptyState">
            <MiniIcon name="users" />
            <p>Belum ada data {participantLabel}</p>
          </div>
        )}
      </section>

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
