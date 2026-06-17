"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  deleteContentItem,
  saveContentItem,
  type ContentInput,
} from "../dashboard-actions";
import type { PublicContentItem } from "../lib/content";

type ContentForm = Omit<ContentInput, "module" | "section" | "id">;

const emptyForm: ContentForm = {
  title: "",
  summary: "",
  body: "",
  imageUrl: "",
  status: "published",
};

export default function ContentManager({
  items,
  module,
  readOnly = false,
  section,
  sectionLabel,
}: {
  items: PublicContentItem[];
  module: string;
  readOnly?: boolean;
  section: string;
  sectionLabel: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<ContentForm>(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setIsOpen(true);
  };

  const openEdit = (item: PublicContentItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      summary: item.summary,
      body: item.body,
      imageUrl: item.imageUrl,
      status: item.status === "draft" ? "draft" : "published",
    });
    setMessage("");
    setIsOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      try {
        await saveContentItem({
          ...form,
          id: editingId ?? undefined,
          module,
          section,
        });
        setIsOpen(false);
        setEditingId(null);
        setMessage("Konten berhasil disimpan dan website publik telah diperbarui.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Konten gagal disimpan.");
      }
    });
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    startTransition(async () => {
      try {
        await deleteContentItem(deleteId, module);
        setDeleteId(null);
        setMessage("Konten berhasil dihapus dari dashboard dan website publik.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Konten gagal dihapus.");
      }
    });
  };

  return (
    <section className="moduleWorkspace" aria-label={`Kelola ${sectionLabel}`}>
      <div className="financePageHead">
        <div>
          <h2>{readOnly ? "Lihat" : "Kelola"} {sectionLabel}</h2>
          <p>
            {readOnly
              ? "Mode baca saja. Perubahan dilakukan oleh admin yang berwenang."
              : "Konten berstatus terbit akan langsung muncul pada website utama."}
          </p>
        </div>
        {!readOnly ? <button type="button" onClick={openCreate}>+ Tambah Konten</button> : null}
      </div>

      {message ? <p className="dashboardActionMessage">{message}</p> : null}

      <article className="financeTableCard">
        <div className="financeTableWrap">
          <table className="financeTable">
            <thead>
              <tr>
                <th>No</th>
                <th>Judul</th>
                <th>Status</th>
                <th>Penulis</th>
                <th>Terakhir Diubah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{item.title}</strong>
                    {item.summary ? <small className="contentTableSummary">{item.summary}</small> : null}
                  </td>
                  <td>
                    <span className={`typeBadge ${item.status === "published" ? "in" : "out"}`}>
                      {item.status === "published" ? "Terbit" : "Draft"}
                    </span>
                  </td>
                  <td>{item.authorName}</td>
                  <td>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(item.updatedAt))}</td>
                  <td>
                    {!readOnly ? <span className="financeActions">
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
                    </span> : "-"}
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr><td className="financeEmptyState" colSpan={6}>Belum ada konten pada bagian ini.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>

      {isOpen && !readOnly ? (
        <div className="financeModalOverlay" role="presentation" onMouseDown={() => setIsOpen(false)}>
          <section className="financeModal contentEditorModal" role="dialog" aria-modal="true" aria-labelledby="content-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="financeModalHeader">
              <h2 id="content-modal-title">{editingId ? "Edit" : "Tambah"} {sectionLabel}</h2>
              <button type="button" aria-label="Tutup modal" onClick={() => setIsOpen(false)}>×</button>
            </div>
            <form onSubmit={submit}>
              <label className="financeFormField">
                <span>Judul</span>
                <input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
              </label>
              <label className="financeFormField">
                <span>Ringkasan</span>
                <input maxLength={300} value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} />
              </label>
              <label className="financeFormField">
                <span>Isi Konten</span>
                <textarea required rows={7} value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} />
              </label>
              <label className="financeFormField">
                <span>URL Gambar (opsional)</span>
                <input type="url" placeholder="https://..." value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} />
              </label>
              <label className="financeFormField">
                <span>Status</span>
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ContentForm["status"] }))}>
                  <option value="published">Terbitkan</option>
                  <option value="draft">Simpan sebagai draft</option>
                </select>
              </label>
              <div className="financeModalActions">
                <button className="financeCancelButton" type="button" onClick={() => setIsOpen(false)}>Batal</button>
                <button className="financeSaveButton" type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : "Simpan"}</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {deleteId !== null && !readOnly ? (
        <div className="financeModalOverlay" role="presentation" onMouseDown={() => setDeleteId(null)}>
          <section className="financeDeleteDialog" role="alertdialog" aria-modal="true" aria-labelledby="content-delete-title" onMouseDown={(event) => event.stopPropagation()}>
            <h2 id="content-delete-title">Hapus Konten?</h2>
            <p>Konten yang sudah terbit juga akan hilang dari website utama.</p>
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
