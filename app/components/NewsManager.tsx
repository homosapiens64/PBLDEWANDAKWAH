"use client";

import { useMemo, useRef, useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { deleteContentItem, saveContentItem } from "../dashboard-actions";
import type { PublicContentItem } from "../lib/content";

type NewsForm = {
  authorName: string;
  body: string;
  imageUrl: string;
  publishedAt: string;
  status: "draft" | "published";
  summary: string;
  tags: string;
  title: string;
};

type NewsSection = "terkini" | "kegiatan" | "nasional" | "internasional";

const sectionConfig: Record<NewsSection, {
  addLabel: string;
  icon: "bolt" | "clipboard" | "pin" | "globe";
  search: string;
  title: string;
}> = {
  terkini: {
    addLabel: "Tambah Berita",
    icon: "bolt",
    search: "Cari judul berita...",
    title: "Berita Terkini",
  },
  kegiatan: {
    addLabel: "Tambah Kegiatan",
    icon: "clipboard",
    search: "Cari kegiatan...",
    title: "Berita Kegiatan",
  },
  nasional: {
    addLabel: "Tambah Berita",
    icon: "pin",
    search: "Cari judul berita...",
    title: "Berita Nasional",
  },
  internasional: {
    addLabel: "Tambah Berita",
    icon: "globe",
    search: "Cari judul berita...",
    title: "Berita Internasional",
  },
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm(): NewsForm {
  return {
    authorName: "",
    body: "",
    imageUrl: "",
    publishedAt: today(),
    status: "draft",
    summary: "",
    tags: "",
    title: "",
  };
}

function NewsIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7z" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h4" />
      </>
    ),
    document: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </>
    ),
    edit: (
      <>
        <path d="m12 20 8-8-4-4-8 8-2 6z" />
        <path d="m14 6 4 4" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 15-5-5L5 20" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    save: (
      <>
        <path d="M5 3h12l2 2v16H5z" />
        <path d="M8 3v6h8V3M8 21v-8h8v8" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16.5 16.5 4 4" />
      </>
    ),
    tag: (
      <>
        <path d="M20 13 13 20 4 11V4h7z" />
        <circle cx="8.5" cy="8.5" r="1" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15" />
        <path d="M10 11v6M14 11v6" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V3M7 8l5-5 5 5" />
        <path d="M4 15v5h16v-5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name] ?? paths.document}
    </svg>
  );
}

function itemDate(item: PublicContentItem) {
  return new Date(item.publishedAt || item.updatedAt);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function NewsManager({
  items,
  readOnly = false,
  section,
}: {
  items: PublicContentItem[];
  readOnly?: boolean;
  section: string;
}) {
  const activeSection = (section in sectionConfig ? section : "terkini") as NewsSection;
  const config = sectionConfig[activeSection];
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"list" | "editor">("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteItem, setDeleteItem] = useState<PublicContentItem | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<NewsForm>(emptyForm);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return [...items]
      .filter((item) => !keyword || [item.title, item.summary, item.tags, item.authorName]
        .some((value) => value.toLowerCase().includes(keyword)))
      .sort((a, b) => itemDate(b).getTime() - itemDate(a).getTime());
  }, [items, query]);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, { date: Date; items: PublicContentItem[] }>();
    filteredItems.forEach((item) => {
      const date = itemDate(item);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const current = groups.get(key) ?? { date, items: [] };
      current.items.push(item);
      groups.set(key, current);
    });
    return [...groups.entries()];
  }, [filteredItems]);

  const publishedCount = items.filter((item) => item.status === "published").length;
  const imageCount = items.filter((item) => Boolean(item.imageUrl)).length;
  const selectedTags = form.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  const primaryTag = selectedTags[0] || (activeSection === "kegiatan" ? "Kegiatan" : "Da'wah");
  const wordCount = form.body.trim() ? form.body.trim().split(/\s+/).length : 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const updateForm = (field: keyof NewsForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setMessage("");
    setMode("editor");
  };

  const openEdit = (item: PublicContentItem) => {
    setEditingId(item.id);
    setForm({
      authorName: item.authorName,
      body: item.body,
      imageUrl: item.imageUrl,
      publishedAt: item.publishedAt.slice(0, 10),
      status: item.status === "published" ? "published" : "draft",
      summary: item.summary,
      tags: item.tags,
      title: item.title,
    });
    setOpenMenuId(null);
    setMessage("");
    setMode("editor");
  };

  const save = (status: NewsForm["status"]) => {
    if (!form.title.trim() || !form.body.trim()) {
      setMessage("Judul berita dan konten berita wajib diisi.");
      return;
    }

    setMessage("");
    startTransition(async () => {
      try {
        await saveContentItem({
          ...form,
          id: editingId ?? undefined,
          module: "website",
          section: activeSection,
          status,
        });
        setMode("list");
        setEditingId(null);
        setMessage(status === "published"
          ? "Berita berhasil diterbitkan dan website publik telah diperbarui."
          : "Berita berhasil disimpan sebagai draf.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Berita gagal disimpan.");
      }
    });
  };

  const confirmDelete = () => {
    if (!deleteItem) return;
    startTransition(async () => {
      try {
        await deleteContentItem(deleteItem.id, "website");
        setDeleteItem(null);
        setMessage("Berita berhasil dihapus.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Berita gagal dihapus.");
      }
    });
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("Format gambar harus JPG, PNG, atau WEBP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Ukuran gambar maksimal 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateForm("imageUrl", typeof reader.result === "string" ? reader.result : "");
      setMessage("");
    };
    reader.readAsDataURL(file);
  };

  if (mode === "editor") {
    return (
      <section className="newsEditorWorkspace">
        <header className="newsEditorHeader">
          <button className="newsBackButton" type="button" onClick={() => setMode("list")} aria-label="Kembali ke daftar berita">
            <span aria-hidden="true">←</span>
          </button>
          <div>
            <p>{config.title}</p>
            <h2>{editingId ? `Edit ${activeSection === "kegiatan" ? "Berita" : config.title}` : activeSection === "kegiatan" ? "Tulis Berita Baru" : `Tulis ${config.title}`}</h2>
          </div>
          <div className="newsEditorActions">
            <button type="button" className="newsDraftButton" onClick={() => save("draft")} disabled={isPending}>
              Simpan Draf
            </button>
            <button type="button" className="newsPublishButton" onClick={() => save("published")} disabled={isPending}>
              <NewsIcon name="save" />
              {isPending ? "Menyimpan..." : "Terbitkan"}
            </button>
          </div>
        </header>

        {message ? <p className="dashboardActionMessage">{message}</p> : null}

        <div className="newsEditorGrid">
          <div className="newsEditorMain">
            <article className="newsEditorCard newsIntroCard">
              <label>
                <span>Judul Berita *</span>
                <input
                  className="newsTitleInput"
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="Tulis judul berita yang menarik..."
                />
              </label>
              <label>
                <span><NewsIcon name="document" /> Ringkasan / Deskripsi Singkat</span>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={form.summary}
                  onChange={(event) => updateForm("summary", event.target.value)}
                  placeholder="Tulis ringkasan singkat yang menggambarkan isi berita (akan ditampilkan di listing)..."
                />
              </label>
            </article>

            <article className="newsEditorCard newsBodyCard">
              <label>
                <span className="newsBodyLabel">
                  <b>Konten Berita *</b>
                  <small>{wordCount} kata · ±{readingMinutes} menit baca</small>
                </span>
                <textarea
                  rows={18}
                  value={form.body}
                  onChange={(event) => updateForm("body", event.target.value)}
                  placeholder="Tulis isi berita selengkapnya di sini..."
                />
              </label>
            </article>
          </div>

          <aside className="newsEditorAside">
            <article className="newsEditorCard newsSettingsCard">
              <h3>Pengaturan Publikasi</h3>
              <label>
                <span>Status</span>
                <select value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                  <option value="draft">Draf</option>
                  <option value="published">Terbit</option>
                </select>
              </label>
              <label>
                <span><NewsIcon name="calendar" /> Tanggal Publish</span>
                <input type="date" value={form.publishedAt} onChange={(event) => updateForm("publishedAt", event.target.value)} />
              </label>
              <label>
                <span><NewsIcon name="user" /> Penulis / Sumber</span>
                <input value={form.authorName} onChange={(event) => updateForm("authorName", event.target.value)} placeholder="Nama penulis..." />
              </label>
              <label>
                <span><NewsIcon name="tag" /> Tags</span>
                <input value={form.tags} onChange={(event) => updateForm("tags", event.target.value)} placeholder="Da'wah, Semarang, Pendidikan..." />
              </label>
              <p className={`newsStatusNotice ${form.status}`}>
                <span />
                {form.status === "published"
                  ? "Berita akan langsung terbit dan dapat dilihat publik."
                  : "Berita disimpan sebagai draf dan belum tampil ke publik."}
              </p>
            </article>

            <article className="newsEditorCard newsCoverCard">
              <h3><NewsIcon name="image" /> Gambar Cover</h3>
              <input ref={fileInputRef} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} />
              {form.imageUrl ? (
                <>
                  <div className="newsCoverPreview" style={{ backgroundImage: `url("${form.imageUrl.replaceAll('"', "%22")}")` }} />
                  <button type="button" onClick={() => updateForm("imageUrl", "")}>Hapus Gambar</button>
                </>
              ) : (
                <button className="newsUploadArea" type="button" onClick={() => fileInputRef.current?.click()}>
                  <NewsIcon name="upload" />
                  <span>Klik untuk upload gambar</span>
                  <small>JPG, PNG, WEBP · maks. 2 MB</small>
                </button>
              )}
            </article>

            <article className="newsEditorCard newsLivePreview">
              <h3><NewsIcon name="check" /> Preview Card</h3>
              <div className={form.imageUrl ? "newsPreviewImage" : "newsPreviewImage empty"} style={form.imageUrl ? { backgroundImage: `url("${form.imageUrl.replaceAll('"', "%22")}")` } : undefined} />
              <div className="newsPreviewBadges">
                <span>{form.status === "published" ? "Terbit" : "Draf"}</span>
                <b>{primaryTag}</b>
              </div>
              <h4>{form.title || "Judul berita akan tampil di sini"}</h4>
              <p>{form.summary || "Ringkasan berita akan tampil di sini..."}</p>
              <small>{form.authorName || "Tim Redaksi"}</small>
            </article>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="newsWorkspace" aria-label={config.title}>
      <header className="newsPageHeader">
        <div className="newsHeading">
          <span><NewsIcon name={config.icon} /></span>
          <div>
            <h2>{config.title}</h2>
            <p>{items.length} berita total</p>
          </div>
        </div>
        {!readOnly ? (
          <button className="newsAddButton" type="button" onClick={openCreate}>
            + <span>{config.addLabel}</span>
          </button>
        ) : null}
      </header>

      {message ? <p className="dashboardActionMessage">{message}</p> : null}

      <label className="newsSearch">
        <NewsIcon name="search" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={config.search} />
      </label>

      <div className="newsStats">
        <article className="published"><strong>{publishedCount}</strong><span><NewsIcon name="check" /> Terbit</span></article>
        <article className="draft"><strong>{items.length - publishedCount}</strong><span><NewsIcon name="calendar" /> Draf</span></article>
        <article className="images"><strong>{imageCount}</strong><span><NewsIcon name="document" /> Bergambar</span></article>
      </div>

      <div className="newsGroups">
        {groupedItems.map(([key, group]) => {
          const label = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(group.date);
          const collapsed = collapsedGroups.has(key);
          return (
            <section className="newsMonthGroup" key={key}>
              <button
                className="newsMonthHeader"
                type="button"
                onClick={() => setCollapsedGroups((current) => {
                  const next = new Set(current);
                  if (next.has(key)) next.delete(key);
                  else next.add(key);
                  return next;
                })}
              >
                <span className="newsMonthPill"><NewsIcon name="check" /> {label} <b>{group.items.length}</b></span>
                <i />
                <span className={`newsMonthChevron${collapsed ? " collapsed" : ""}`}>⌄</span>
              </button>
              {!collapsed ? (
                <div className="newsList">
                  {group.items.map((item) => {
                    const tag = item.tags.split(",").map((value) => value.trim()).filter(Boolean)[0]
                      || (activeSection === "kegiatan" ? "Kegiatan" : "Da'wah");
                    return (
                      <article className="newsListCard" key={item.id}>
                        <div
                          className={item.imageUrl ? "newsListImage" : "newsListImage empty"}
                          style={item.imageUrl ? { backgroundImage: `url("${item.imageUrl.replaceAll('"', "%22")}")` } : undefined}
                        >
                          {!item.imageUrl ? <NewsIcon name="image" /> : null}
                        </div>
                        <div className="newsListBody">
                          <div className="newsListBadges">
                            <span className={item.status === "published" ? "published" : "draft"}>
                              <NewsIcon name={item.status === "published" ? "check" : "calendar"} />
                              {item.status === "published" ? "Terbit" : "Draf"}
                            </span>
                            <b>{tag}</b>
                          </div>
                          <h3>{item.title}</h3>
                          <p>{item.summary || item.body}</p>
                          <footer>
                            <span><NewsIcon name="calendar" /> {formatDate(item.publishedAt)}</span>
                            <span>✍ {item.authorName}</span>
                          </footer>
                        </div>
                        {!readOnly ? <button
                          className="newsMoreButton"
                          type="button"
                          aria-label={`Aksi untuk ${item.title}`}
                          onClick={() => setOpenMenuId((current) => current === item.id ? null : item.id)}
                        >
                          •••
                        </button> : null}
                        {!readOnly && openMenuId === item.id ? (
                          <div className="newsActionMenu">
                            <button type="button" onClick={() => openEdit(item)}><NewsIcon name="edit" /> Edit</button>
                            <button type="button" className="danger" onClick={() => {
                              setDeleteItem(item);
                              setOpenMenuId(null);
                            }}><NewsIcon name="trash" /> Hapus</button>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
        {filteredItems.length === 0 ? (
          <div className="newsEmptyState">
            <NewsIcon name="document" />
            <h3>Belum ada berita</h3>
            <p>Tambahkan berita pertama untuk kategori {config.title.toLowerCase()}.</p>
          </div>
        ) : null}
      </div>

      {deleteItem ? (
        <div className="newsDeleteOverlay" role="presentation" onMouseDown={() => setDeleteItem(null)}>
          <section role="alertdialog" aria-modal="true" aria-labelledby="news-delete-title" onMouseDown={(event) => event.stopPropagation()}>
            <h2 id="news-delete-title">Hapus {activeSection === "kegiatan" ? "kegiatan" : "berita"}?</h2>
            <p>&quot;{deleteItem.title}&quot; akan dihapus permanen.</p>
            <div>
              <button type="button" onClick={() => setDeleteItem(null)}>Batal</button>
              <button type="button" className="danger" onClick={confirmDelete} disabled={isPending}>
                {isPending ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
