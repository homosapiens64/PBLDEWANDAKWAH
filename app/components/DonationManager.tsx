"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  deleteDonationCampaign,
  saveDonationCampaign,
  type DonationCampaignInput,
} from "../dashboard-actions";
import ImageUploadField from "./ImageUploadField";

export type DonationCampaignRow = {
  badge: string;
  collectedAmount: number;
  href: string;
  id: number;
  imageUrl: string;
  org: string;
  progress: number;
  remainingTime: string;
  sortOrder: number;
  status: "draft" | "published";
  summary: string;
  targetAmount: number | null;
  title: string;
  updatedAt: string;
};

type DonationForm = Omit<DonationCampaignInput, "id" | "targetAmount"> & {
  targetAmount: string;
};

const emptyForm: DonationForm = {
  badge: "OPEN DONASI",
  collectedAmount: 0,
  href: "https://www.laznasdewandakwah.or.id/zakat",
  imageUrl: "",
  org: "LAZNAS Dewan Dakwah Jawa Tengah",
  progress: 0,
  remainingTime: "3 Bulan",
  sortOrder: 0,
  status: "published",
  summary: "",
  targetAmount: "",
  title: "",
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function DonationManager({
  databaseAvailable,
  items,
}: {
  databaseAvailable: boolean;
  items: DonationCampaignRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DonationForm>(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setIsOpen(true);
  };

  const openEdit = (item: DonationCampaignRow) => {
    setEditingId(item.id);
    setForm({
      badge: item.badge,
      collectedAmount: item.collectedAmount,
      href: item.href,
      imageUrl: item.imageUrl,
      org: item.org,
      progress: item.progress,
      remainingTime: item.remainingTime,
      sortOrder: item.sortOrder,
      status: item.status,
      summary: item.summary,
      targetAmount: item.targetAmount ? String(item.targetAmount) : "",
      title: item.title,
    });
    setMessage("");
    setIsOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      try {
        await saveDonationCampaign({
          ...form,
          id: editingId ?? undefined,
          targetAmount: form.targetAmount ? toNumber(form.targetAmount) : null,
        });
        setEditingId(null);
        setIsOpen(false);
        setMessage("Program donasi berhasil disimpan dan halaman utama telah diperbarui.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Program donasi gagal disimpan.");
      }
    });
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    setMessage("");
    startTransition(async () => {
      try {
        await deleteDonationCampaign(deleteId);
        setDeleteId(null);
        setMessage("Program donasi berhasil dihapus.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Program donasi gagal dihapus.");
      }
    });
  };

  return (
    <section className="moduleWorkspace donationWorkspace" aria-label="Kelola donasi">
      <div className="financePageHead">
        <div>
          <h2>Kelola Donasi</h2>
          <p>Program berstatus terbit akan tampil pada bagian Program Kebaikan di halaman utama.</p>
        </div>
        <button type="button" onClick={openCreate}>+ Tambah Program</button>
      </div>

      {!databaseAvailable ? (
        <div className="financeDatabaseNotice">
          <span className="financeDatabaseNoticeIcon">!</span>
          <div>
            <strong>Database donasi belum dapat dibaca.</strong>
            <p>Pastikan MySQL aktif, database dewandakwah tersedia, dan tabel donation_campaigns sudah dibuat.</p>
          </div>
        </div>
      ) : null}

      {message ? <p className="dashboardActionMessage">{message}</p> : null}

      <article className="financeTableCard">
        <div className="financeTableWrap">
          <table className="financeTable">
            <thead>
              <tr>
                <th>No</th>
                <th>Gambar</th>
                <th>Program</th>
                <th>Terkumpul</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Urutan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    {item.imageUrl ? (
                      <span
                        className="donationTableImage"
                        style={{ backgroundImage: `url("${item.imageUrl.replaceAll('"', "%22")}")` }}
                        title={item.imageUrl}
                      />
                    ) : (
                      <span className="donationTableImage empty">Belum ada</span>
                    )}
                  </td>
                  <td>
                    <strong>{item.title}</strong>
                    <small className="contentTableSummary">
                      {item.org} - {item.remainingTime}
                    </small>
                  </td>
                  <td>{formatRupiah(item.collectedAmount)}</td>
                  <td>
                    <span className="donationProgressText">{item.progress}%</span>
                    <span className="donationProgressTrack">
                      <span style={{ width: `${item.progress}%` }} />
                    </span>
                  </td>
                  <td>
                    <span className={`typeBadge ${item.status === "published" ? "in" : "out"}`}>
                      {item.status === "published" ? "Terbit" : "Draft"}
                    </span>
                  </td>
                  <td>{item.sortOrder}</td>
                  <td>
                    <span className="financeActions">
                      <button className="financeEditButton" type="button" aria-label={`Edit ${item.title}`} onClick={() => openEdit(item)}>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="m12 20 8-8-4-4-8 8-2 6z" />
                          <path d="m14 6 4 4" />
                        </svg>
                      </button>
                      <button className="financeDeleteButton" type="button" aria-label={`Hapus ${item.title}`} onClick={() => setDeleteId(item.id)}>
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
                  <td className="financeEmptyState" colSpan={8}>
                    Belum ada program donasi dari database. Halaman utama akan memakai data LAZNAS/fallback.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>

      {isOpen ? (
        <div className="financeModalOverlay" role="presentation" onMouseDown={() => setIsOpen(false)}>
          <section className="financeModal donationModal" role="dialog" aria-modal="true" aria-labelledby="donation-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="financeModalHeader">
              <h2 id="donation-modal-title">{editingId ? "Edit" : "Tambah"} Program Donasi</h2>
              <button type="button" aria-label="Tutup modal" onClick={() => setIsOpen(false)}>x</button>
            </div>
            <form onSubmit={submit}>
              <label className="financeFormField">
                <span>Judul Program</span>
                <input required maxLength={180} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
              </label>
              <label className="financeFormField">
                <span>Ringkasan</span>
                <textarea rows={3} value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} />
              </label>
              <div className="donationFormGrid">
                <label className="financeFormField">
                  <span>Badge</span>
                  <input required value={form.badge} onChange={(event) => setForm((current) => ({ ...current, badge: event.target.value }))} />
                </label>
                <label className="financeFormField">
                  <span>Organisasi</span>
                  <input required value={form.org} onChange={(event) => setForm((current) => ({ ...current, org: event.target.value }))} />
                </label>
              </div>
              <label className="financeFormField">
                <span>Link Donasi</span>
                <input required type="url" value={form.href} onChange={(event) => setForm((current) => ({ ...current, href: event.target.value }))} />
              </label>
              <ImageUploadField
                label="Gambar Program"
                value={form.imageUrl}
                onUploaded={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))}
              />
              <div className="donationFormGrid">
                <label className="financeFormField">
                  <span>Terkumpul (Rp)</span>
                  <input min="0" type="number" value={form.collectedAmount} onChange={(event) => setForm((current) => ({ ...current, collectedAmount: toNumber(event.target.value) }))} />
                </label>
                <label className="financeFormField">
                  <span>Target (Rp)</span>
                  <input min="0" type="number" value={form.targetAmount} onChange={(event) => setForm((current) => ({ ...current, targetAmount: event.target.value }))} />
                </label>
              </div>
              <div className="donationFormGrid">
                <label className="financeFormField">
                  <span>Progress Manual (%)</span>
                  <input min="0" max="100" type="number" value={form.progress} onChange={(event) => setForm((current) => ({ ...current, progress: toNumber(event.target.value) }))} />
                </label>
                <label className="financeFormField">
                  <span>Sisa Waktu</span>
                  <input required value={form.remainingTime} onChange={(event) => setForm((current) => ({ ...current, remainingTime: event.target.value }))} />
                </label>
              </div>
              <div className="donationFormGrid">
                <label className="financeFormField">
                  <span>Urutan</span>
                  <input min="0" type="number" value={form.sortOrder} onChange={(event) => setForm((current) => ({ ...current, sortOrder: toNumber(event.target.value) }))} />
                </label>
                <label className="financeFormField">
                  <span>Status</span>
                  <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as DonationForm["status"] }))}>
                    <option value="published">Terbit</option>
                    <option value="draft">Draft</option>
                  </select>
                </label>
              </div>
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
          <section className="financeDeleteDialog" role="alertdialog" aria-modal="true" aria-labelledby="donation-delete-title" onMouseDown={(event) => event.stopPropagation()}>
            <h2 id="donation-delete-title">Hapus Program Donasi?</h2>
            <p>Program yang sudah terbit juga akan hilang dari halaman utama.</p>
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
