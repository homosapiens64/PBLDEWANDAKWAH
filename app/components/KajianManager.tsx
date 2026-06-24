"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  deleteContentItem,
  saveContentItem,
  type ContentInput,
} from "../dashboard-actions";
import type { PublicContentItem } from "../lib/content";

type KajianForm = Omit<ContentInput, "module" | "section" | "id">;

const sectionLabels: Record<string, { title: string; subtitle: string }> = {
  "artikel-kajian": {
    title: "Artikel Kajian",
    subtitle: "Kajian umum, ekonomi Islam, dan materi dakwah",
  },
  khutbah: {
    title: "Materi Khutbah",
    subtitle: "Naskah khutbah dan bahan ceramah",
  },
  kajian: {
    title: "Kajian",
    subtitle: "Materi dakwah dan artikel islami",
  },
  tauhid: {
    title: "Kajian Tauhid",
    subtitle: "Akidah, Tauhid & Keimanan",
  },
  tazkiyah: {
    title: "Materi Tazkiyah",
    subtitle: "Penyucian jiwa dan pembinaan akhlak",
  },
};

function createEmptyForm(): KajianForm {
  return {
    title: "",
    summary: "",
    body: "",
    imageUrl: "",
    authorName: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    status: "published",
  };
}

function Icon({
  name,
}: {
  name: "book" | "calendar" | "edit" | "image" | "search" | "send" | "trash";
}) {
  const paths = {
    book: (
      <>
        <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v17H7.5A2.5 2.5 0 0 0 5 21.5z" />
        <path d="M5 4.5v17M9 6h6M9 10h6" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </>
    ),
    edit: (
      <>
        <path d="m12 20 8-8-4-4-8 8-2 6z" />
        <path d="m14 6 4 4" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4z" />
        <path d="M22 2 11 13" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function KajianManager({
  items,
  readOnly = false,
  section,
}: {
  items: PublicContentItem[];
  readOnly?: boolean;
  section: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<KajianForm>(createEmptyForm);
  const currentSection = sectionLabels[section] ?? sectionLabels.kajian;

  const publishedCount = items.filter((item) => item.status === "published").length;
  const draftCount = items.length - publishedCount;
  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("id-ID");
    if (!keyword) return items;
    return items.filter((item) =>
      [item.title, item.summary, item.authorName].some((value) =>
        value.toLocaleLowerCase("id-ID").includes(keyword),
      ),
    );
  }, [items, query]);

  const openCreate = () => {
    setEditingId(null);
    setForm(createEmptyForm());
    setMessage("");
    setOpenMenuId(null);
    setEditorOpen(true);
  };

  const openEdit = (item: PublicContentItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      summary: item.summary,
      body: item.body,
      imageUrl: item.imageUrl,
      authorName: item.authorName,
      publishedAt: item.publishedAt.slice(0, 10),
      status: item.status === "draft" ? "draft" : "published",
    });
    setMessage("");
    setOpenMenuId(null);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditingId(null);
    setForm(createEmptyForm());
    setEditorOpen(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const requestedStatus = submitter?.dataset.status;
    const status = requestedStatus === "draft" ? "draft" : "published";
    setMessage("");
    startTransition(async () => {
      try {
        await saveContentItem({
          ...form,
          status,
          title: form.title.trim(),
          id: editingId ?? undefined,
          module: "kajian",
          section,
        });
        closeEditor();
        setMessage("Materi kajian berhasil disimpan.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Materi gagal disimpan.");
      }
    });
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    startTransition(async () => {
      try {
        await deleteContentItem(deleteId, "kajian");
        setDeleteId(null);
        setMessage("Materi kajian berhasil dihapus.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Materi gagal dihapus.");
      }
    });
  };

  if (editorOpen) {
    return (
      <section className="kajianEditor">
        <form onSubmit={submit}>
          <header className="kajianEditorBar">
            <button type="button" className="kajianBackButton" onClick={closeEditor}>
              <span aria-hidden="true">←</span> Kembali
            </button>
            <span className="kajianEditorDivider" />
            <strong>
              {editingId ? "Edit" : "Tambah"}: {form.title.trim() || "Materi Kajian Baru"}
            </strong>
            <div className="kajianEditorActions">
              <span>{form.body.trim().split(/\s+/).filter(Boolean).length} kata · 1 mnt baca</span>
              <button
                type="submit"
                className="kajianDraftButton"
                disabled={isPending}
                data-status="draft"
              >
                Simpan Draf
              </button>
              <button
                type="submit"
                className="kajianPublishButton"
                disabled={isPending}
                data-status="published"
              >
                <Icon name="send" /> Terbitkan
              </button>
            </div>
          </header>

          <div className="kajianEditorCanvas">
            <label className="kajianTitleInput">
              <span className="sr-only">Judul materi</span>
              <input
                autoFocus
                required
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Judul materi kajian"
              />
            </label>

            <div className="kajianEditorGrid">
              <div className="kajianMainFields">
                <label className="kajianEditorField">
                  <span>☰ &nbsp; RINGKASAN / DESKRIPSI SINGKAT</span>
                  <textarea
                    maxLength={300}
                    rows={3}
                    value={form.summary}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, summary: event.target.value }))
                    }
                    placeholder="Tuliskan ringkasan singkat materi..."
                  />
                </label>
                <label className="kajianEditorField kajianBodyField">
                  <span>☰ &nbsp; ISI / KONTEN LENGKAP</span>
                  <textarea
                    required
                    value={form.body}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, body: event.target.value }))
                    }
                    placeholder="Tuliskan isi materi kajian..."
                  />
                </label>
              </div>

              <aside className="kajianSettings">
                <section className="kajianSettingsCard">
                  <h3>Pengaturan Publikasi</h3>
                  <label>
                    <span>Status</span>
                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          status: event.target.value as KajianForm["status"],
                        }))
                      }
                    >
                      <option value="published">☑ Terbit</option>
                      <option value="draft">Draf</option>
                    </select>
                  </label>
                  <label>
                    <span>Tanggal Publikasi</span>
                    <input
                      type="date"
                      value={form.publishedAt ?? ""}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, publishedAt: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    <span>Penulis / Ustadz</span>
                    <input
                      value={form.authorName ?? ""}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, authorName: event.target.value }))
                      }
                      placeholder="Otomatis memakai nama akun jika dikosongkan"
                    />
                  </label>
                  <label>
                    <span>Kategori</span>
                    <input value={currentSection.title} readOnly />
                  </label>
                </section>

                <section className="kajianSettingsCard">
                  <h3><Icon name="image" /> Gambar Cover</h3>
                  <label className="kajianCoverUpload">
                    <Icon name="image" />
                    <span>Masukkan URL gambar cover</span>
                    <input
                      type="url"
                      value={form.imageUrl}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, imageUrl: event.target.value }))
                      }
                      placeholder="https://..."
                    />
                  </label>
                </section>

                <div className="kajianPreview">
                  <p>Preview Card</p>
                  <article>
                    <span>{currentSection.title}</span>
                    <h4>{form.title.trim() || "Judul materi kajian"}</h4>
                    <p>{form.summary || "Ringkasan materi akan tampil di sini."}</p>
                    <small>✍ Ust. Ahmad Fauzi, Lc.</small>
                  </article>
                </div>
              </aside>
            </div>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="kajianWorkspace" aria-label={`Kelola ${currentSection.title}`}>
      <header className="kajianPageHead">
        <div className="kajianHeading">
          <span><Icon name="book" /></span>
          <div>
            <h2>{currentSection.title}</h2>
            <p>{currentSection.subtitle}</p>
          </div>
        </div>
        {!readOnly ? <button type="button" onClick={openCreate}>＋ &nbsp; Tambah Materi</button> : null}
      </header>

      {message ? <p className="dashboardActionMessage">{message}</p> : null}

      <div className="kajianStats">
        <article className="total"><strong>{items.length}</strong><span>⌁ Total Materi</span></article>
        <article className="published"><strong>{publishedCount}</strong><span>◎ Terbit</span></article>
        <article className="draft"><strong>{draftCount}</strong><span>◉ Draf</span></article>
      </div>

      <label className="kajianSearch">
        <Icon name="search" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Cari ${currentSection.title.toLowerCase()}...`}
        />
      </label>

      <div className="kajianCardGrid">
        {filteredItems.map((item) => (
          <article className="kajianCard" key={item.id}>
            <div
              className="kajianCardCover"
              style={item.imageUrl ? { backgroundImage: `url("${item.imageUrl}")` } : undefined}
            >
              {!item.imageUrl ? <Icon name="book" /> : null}
            </div>
            <div className="kajianCardBody">
              <div className="kajianCardMeta">
                <span>{currentSection.title}</span>
                <span className={item.status === "published" ? "live" : "saved"}>
                  ◎ {item.status === "published" ? "Terbit" : "Draf"}
                </span>
                {!readOnly ? <button
                  type="button"
                  aria-label={`Menu ${item.title}`}
                  onClick={() => setOpenMenuId((current) => current === item.id ? null : item.id)}
                >
                  •••
                </button> : null}
                {!readOnly && openMenuId === item.id ? (
                  <div className="kajianCardMenu">
                    <button type="button" onClick={() => openEdit(item)}>
                      <Icon name="edit" /> Edit
                    </button>
                    <button type="button" onClick={() => {
                      setDeleteId(item.id);
                      setOpenMenuId(null);
                    }}>
                      <Icon name="trash" /> Hapus
                    </button>
                  </div>
                ) : null}
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary || item.body}</p>
              <footer>
                <span><Icon name="calendar" /> {formatDate(item.publishedAt)}</span>
                <span>✍ {item.authorName}</span>
              </footer>
            </div>
          </article>
        ))}
        {filteredItems.length === 0 ? (
          <div className="kajianEmpty">
            <Icon name="book" />
            <h3>Materi belum ditemukan</h3>
            <p>Tambahkan materi baru atau gunakan kata kunci pencarian lain.</p>
          </div>
        ) : null}
      </div>

      {deleteId !== null ? (
        <div className="financeModalOverlay" role="presentation" onMouseDown={() => setDeleteId(null)}>
          <section
            className="financeDeleteDialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="kajian-delete-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="kajian-delete-title">Hapus Materi Kajian?</h2>
            <p>Materi yang sudah terbit juga akan hilang dari website utama.</p>
            <div className="financeModalActions">
              <button className="financeCancelButton" type="button" onClick={() => setDeleteId(null)}>
                Batal
              </button>
              <button
                className="financeConfirmDeleteButton"
                type="button"
                onClick={confirmDelete}
                disabled={isPending}
              >
                {isPending ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
