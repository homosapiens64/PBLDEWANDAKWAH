"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  deleteCertifiedUstadz,
  saveCertifiedUstadz,
  type CertifiedUstadzInput,
} from "../dashboard-actions";
import type { CertifiedUstadzItem } from "../lib/certified-ustadz";

type CertifiedUstadzForm = Omit<CertifiedUstadzInput, "id">;

const emptyForm: CertifiedUstadzForm = {
  isActive: true,
  name: "",
  sortOrder: 0,
  specialization: "Spesialis fikih dan pembinaan keluarga",
};

export default function CertifiedUstadzManager({
  items,
}: {
  items: CertifiedUstadzItem[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CertifiedUstadzForm>(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      sortOrder: items.length + 1,
    });
    setMessage("");
    setIsOpen(true);
  };

  const openEdit = (item: CertifiedUstadzItem) => {
    setEditingId(item.id);
    setForm({
      isActive: item.isActive,
      name: item.name,
      sortOrder: item.sortOrder,
      specialization: item.specialization,
    });
    setMessage("");
    setIsOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      try {
        await saveCertifiedUstadz({
          ...form,
          id: editingId ?? undefined,
        });
        setIsOpen(false);
        setEditingId(null);
        setMessage("Daftar ustadz bersertifikat berhasil diperbarui.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Data ustadz gagal disimpan.");
      }
    });
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    setMessage("");
    startTransition(async () => {
      try {
        await deleteCertifiedUstadz(deleteId);
        setDeleteId(null);
        setMessage("Ustadz berhasil dihapus dari daftar.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Data ustadz gagal dihapus.");
      }
    });
  };

  return (
    <section className="moduleWorkspace certifiedUstadzWorkspace" aria-label="Kelola Ustadz Bersertifikat">
      <div className="financePageHead">
        <div>
          <h2>Kelola Ustadz Bersertifikat</h2>
          <p>Data aktif akan tampil otomatis pada sidebar halaman Konsultasi.</p>
        </div>
        <button type="button" onClick={openCreate}>+ Tambah Ustadz</button>
      </div>

      {message ? <p className="dashboardActionMessage">{message}</p> : null}

      <article className="financeTableCard">
        <div className="financeTableWrap">
          <table className="financeTable">
            <thead>
              <tr>
                <th>Urutan</th>
                <th>Nama</th>
                <th>Spesialisasi</th>
                <th>Status</th>
                <th>Terakhir Diubah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.sortOrder}</td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.specialization}</td>
                  <td>
                    <span className={`typeBadge ${item.isActive ? "in" : "out"}`}>
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(item.updatedAt))}</td>
                  <td>
                    <span className="financeActions">
                      <button className="financeEditButton" type="button" aria-label={`Edit ${item.name}`} onClick={() => openEdit(item)}>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="m12 20 8-8-4-4-8 8-2 6z" />
                          <path d="m14 6 4 4" />
                        </svg>
                      </button>
                      <button className="financeDeleteButton" type="button" aria-label={`Hapus ${item.name}`} onClick={() => setDeleteId(item.id)}>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M6 6l1 15h10l1-15" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="financeEmptyState" colSpan={6}>
                    Belum ada ustadz bersertifikat.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>

      {isOpen ? (
        <div className="financeModalOverlay" role="presentation" onMouseDown={() => setIsOpen(false)}>
          <section className="financeModal certifiedUstadzModal" role="dialog" aria-modal="true" aria-labelledby="certified-ustadz-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="financeModalHeader">
              <h2 id="certified-ustadz-modal-title">{editingId ? "Edit" : "Tambah"} Ustadz Bersertifikat</h2>
              <button type="button" aria-label="Tutup modal" onClick={() => setIsOpen(false)}>x</button>
            </div>
            <form onSubmit={submit}>
              <label className="financeFormField">
                <span>Nama Ustadz</span>
                <input required maxLength={120} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <label className="financeFormField">
                <span>Spesialisasi</span>
                <input required maxLength={180} value={form.specialization} onChange={(event) => setForm((current) => ({ ...current, specialization: event.target.value }))} />
              </label>
              <label className="financeFormField">
                <span>Urutan Tampil</span>
                <input min={0} type="number" value={form.sortOrder} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} />
              </label>
              <label className="certifiedUstadzCheck">
                <input checked={form.isActive} type="checkbox" onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
                <span>Tampilkan di halaman Konsultasi</span>
              </label>
              <div className="financeModalActions">
                <button className="financeCancelButton" type="button" onClick={() => setIsOpen(false)}>Batal</button>
                <button className="financeSaveButton" type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : "Simpan"}</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {deleteId !== null ? (
        <div className="financeModalOverlay" role="presentation" onMouseDown={() => setDeleteId(null)}>
          <section className="financeDeleteDialog" role="alertdialog" aria-modal="true" aria-labelledby="certified-ustadz-delete-title" onMouseDown={(event) => event.stopPropagation()}>
            <h2 id="certified-ustadz-delete-title">Hapus Ustadz?</h2>
            <p>Nama ini akan hilang dari daftar ustadz bersertifikat di halaman Konsultasi.</p>
            <div className="financeModalActions">
              <button className="financeCancelButton" type="button" onClick={() => setDeleteId(null)}>Batal</button>
              <button className="financeConfirmDeleteButton" type="button" onClick={confirmDelete} disabled={isPending}>{isPending ? "Menghapus..." : "Hapus"}</button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
