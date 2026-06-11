"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { deleteContentItem, saveContentItem } from "../dashboard-actions";
import type { PublicContentItem } from "../lib/content";

type AboutSection =
  | "profil-organisasi"
  | "ad-art"
  | "struktur-kepengurusan"
  | "program-kerja";

type EditorKind = "ad" | "art" | "unit" | "program" | null;

type DynamicForm = {
  id?: number;
  title: string;
  description: string;
  version: string;
  effectiveDate: string;
  pdfUrl: string;
  fileName: string;
  unitType: string;
  order: string;
  leader: string;
  members: string;
  status: string;
  startDate: string;
  endDate: string;
};

const emptyDynamicForm = (): DynamicForm => ({
  title: "",
  description: "",
  version: "1.0",
  effectiveDate: new Date().toISOString().slice(0, 10),
  pdfUrl: "",
  fileName: "",
  unitType: "Unit Pelaksana",
  order: "0",
  leader: "",
  members: "",
  status: "aktif",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
});

const profileBlocks = [
  {
    key: "profil-sejarah",
    label: "Sejarah Organisasi",
    titlePlaceholder: "Judul Sejarah Organisasi",
    bodyPlaceholder: "Tuliskan sejarah berdirinya Dewan Da'wah Semarang...",
  },
  {
    key: "profil-visi-misi",
    label: "Visi & Misi",
    titlePlaceholder: "Judul Visi & Misi",
    bodyPlaceholder: "Tuliskan visi dan misi organisasi...",
  },
  {
    key: "profil-cabang-semarang",
    label: "Cabang Kota Semarang",
    titlePlaceholder: "Judul Cabang Kota Semarang",
    bodyPlaceholder: "Informasi cabang kota Semarang...",
  },
  {
    key: "profil-kontak-lokasi",
    label: "Kontak & Lokasi",
    titlePlaceholder: "Judul Kontak & Lokasi",
    bodyPlaceholder: "Alamat, telepon, email, jam operasional...",
  },
] as const;

function parseMeta<T extends Record<string, string>>(value: string, fallback: T): T {
  try {
    return { ...fallback, ...JSON.parse(value) } as T;
  } catch {
    return fallback;
  }
}

function AboutIcon({
  name,
}: {
  name: "clipboard" | "edit" | "file" | "folder" | "plus" | "trash" | "upload" | "users";
}) {
  const paths = {
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4V2h6v2M9 9h6M9 13h6M9 17h4" />
      </>
    ),
    edit: (
      <>
        <path d="m12 20 8-8-4-4-8 8-2 6z" />
        <path d="m14 6 4 4" />
      </>
    ),
    file: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5" />
      </>
    ),
    folder: (
      <>
        <path d="M3 6h7l2 2h9v11H3z" />
        <path d="M12 11v6M9 14h6" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V3M7 8l5-5 5 5" />
        <path d="M4 15v5h16v-5" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function ProfileWorkspace({
  items,
  onMessage,
}: {
  items: PublicContentItem[];
  onMessage: (message: string) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", body: "", imageUrl: "" });

  const findItem = (section: string) => items.find((item) => item.section === section);

  const openEdit = (block: (typeof profileBlocks)[number]) => {
    const item = findItem(block.key);
    setEditingKey(block.key);
    setForm({
      title: item?.title ?? "",
      body: item?.body ?? "",
      imageUrl: item?.imageUrl ?? "",
    });
    onMessage("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingKey) return;
    const block = profileBlocks.find((item) => item.key === editingKey);
    const existing = findItem(editingKey);
    if (!block) return;

    startTransition(async () => {
      try {
        await saveContentItem({
          id: existing?.id,
          module: "tentang-kami",
          section: editingKey,
          title: form.title || block.label,
          summary: block.label,
          body: form.body,
          imageUrl: form.imageUrl,
          status: "published",
        });
        setEditingKey(null);
        onMessage(`${block.label} berhasil diperbarui.`);
        router.refresh();
      } catch (error) {
        onMessage(error instanceof Error ? error.message : "Konten gagal disimpan.");
      }
    });
  };

  return (
    <section className="aboutWorkspace">
      <header className="aboutPageHeading">
        <h2>Profil Organisasi</h2>
        <p>Kelola konten halaman Tentang Kami — Profil</p>
      </header>

      <div className="aboutProfileList">
        {profileBlocks.map((block) => {
          const item = findItem(block.key);
          const isEditing = editingKey === block.key;

          return (
            <article className={`aboutProfileCard${isEditing ? " editing" : ""}`} key={block.key}>
              {!isEditing ? (
                <>
                  <div>
                    <h3>{block.label}</h3>
                    <p>
                      {item?.body
                        ? item.body.slice(0, 180)
                        : "Belum ada konten. Klik “Edit” untuk menambahkan."}
                    </p>
                  </div>
                  <button type="button" className="aboutOutlineButton" onClick={() => openEdit(block)}>
                    <AboutIcon name="edit" /> Edit
                  </button>
                </>
              ) : (
                <form onSubmit={submit}>
                  <h3>{block.label}</h3>
                  <label>
                    <span>Judul</span>
                    <input
                      required
                      value={form.title}
                      placeholder={block.titlePlaceholder}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    />
                  </label>
                  <label>
                    <span>Konten</span>
                    <textarea
                      required
                      value={form.body}
                      placeholder={block.bodyPlaceholder}
                      onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
                    />
                  </label>
                  <label>
                    <span>URL Gambar (opsional)</span>
                    <input
                      type="url"
                      value={form.imageUrl}
                      placeholder="https://..."
                      onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                    />
                  </label>
                  <div className="aboutFormActions">
                    <button className="aboutPrimaryButton" type="submit" disabled={isPending}>
                      {isPending ? "Menyimpan..." : "▣ Simpan"}
                    </button>
                    <button className="aboutCancelButton" type="button" onClick={() => setEditingKey(null)}>
                      × Batal
                    </button>
                  </div>
                </form>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AboutModal({
  form,
  kind,
  onChange,
  onClose,
  onSubmit,
  pending,
}: {
  form: DynamicForm;
  kind: Exclude<EditorKind, null>;
  onChange: (field: keyof DynamicForm, value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  pending: boolean;
}) {
  const documentKind = kind === "ad" || kind === "art";
  const title = kind === "ad"
    ? "Tambah Dokumen AD"
    : kind === "art"
      ? "Tambah Dokumen ART"
      : kind === "unit"
        ? "Tambah Unit"
        : "Tambah Program";

  return (
    <div className="aboutModalOverlay" role="presentation" onMouseDown={onClose}>
      <section className="aboutModal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <h2>{form.id ? title.replace("Tambah", "Edit") : title}</h2>
          <button type="button" aria-label="Tutup" onClick={onClose}>×</button>
        </header>
        <form onSubmit={onSubmit}>
          <label>
            <span>{documentKind ? "Judul Dokumen *" : kind === "unit" ? "Nama Unit *" : "Nama Program *"}</span>
            <input required autoFocus value={form.title} onChange={(event) => onChange("title", event.target.value)} />
          </label>

          {kind === "unit" ? (
            <>
              <label>
                <span>Tipe Unit</span>
                <select value={form.unitType} onChange={(event) => onChange("unitType", event.target.value)}>
                  <option>Unit Pelaksana</option>
                  <option>Dewan Penasehat</option>
                  <option>Pimpinan Harian</option>
                  <option>Sub Unit</option>
                </select>
              </label>
              <label>
                <span>Nama Ketua / Penanggung Jawab</span>
                <input value={form.leader} onChange={(event) => onChange("leader", event.target.value)} />
              </label>
              <label>
                <span>Anggota (satu nama per baris)</span>
                <textarea value={form.members} onChange={(event) => onChange("members", event.target.value)} />
              </label>
            </>
          ) : null}

          <label>
            <span>Deskripsi</span>
            <textarea value={form.description} onChange={(event) => onChange("description", event.target.value)} />
          </label>

          {documentKind ? (
            <>
              <div className="aboutModalGrid">
                <label>
                  <span>Versi</span>
                  <input value={form.version} onChange={(event) => onChange("version", event.target.value)} />
                </label>
                <label>
                  <span>Tanggal Berlaku</span>
                  <input type="date" value={form.effectiveDate} onChange={(event) => onChange("effectiveDate", event.target.value)} />
                </label>
              </div>
              <label>
                <span>Upload File (PDF)</span>
                <span className="aboutFilePicker">
                  <AboutIcon name="upload" />
                  {form.fileName || "Pilih File"}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => onChange("fileName", event.target.files?.[0]?.name ?? "")}
                  />
                </span>
              </label>
              <label>
                <span>URL PDF (opsional, agar dapat dibuka di website)</span>
                <input type="url" value={form.pdfUrl} placeholder="https://..." onChange={(event) => onChange("pdfUrl", event.target.value)} />
              </label>
            </>
          ) : null}

          {kind === "unit" ? (
            <label>
              <span>Urutan</span>
              <input type="number" min="0" value={form.order} onChange={(event) => onChange("order", event.target.value)} />
            </label>
          ) : null}

          {kind === "program" ? (
            <>
              <label>
                <span>Status</span>
                <select value={form.status} onChange={(event) => onChange("status", event.target.value)}>
                  <option value="aktif">Aktif</option>
                  <option value="selesai">Selesai</option>
                  <option value="rencana">Rencana</option>
                </select>
              </label>
              <div className="aboutModalGrid">
                <label>
                  <span>Tanggal Mulai</span>
                  <input type="date" value={form.startDate} onChange={(event) => onChange("startDate", event.target.value)} />
                </label>
                <label>
                  <span>Tanggal Selesai</span>
                  <input type="date" value={form.endDate} onChange={(event) => onChange("endDate", event.target.value)} />
                </label>
              </div>
            </>
          ) : null}

          <div className="aboutModalActions">
            <button type="button" className="aboutCancelButton" onClick={onClose}>Batal</button>
            <button type="submit" className="aboutPrimaryButton" disabled={pending}>
              {pending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function DynamicWorkspace({
  items,
  mode,
  onMessage,
}: {
  items: PublicContentItem[];
  mode: "ad-art" | "struktur-kepengurusan" | "program-kerja";
  onMessage: (message: string) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editorKind, setEditorKind] = useState<EditorKind>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<DynamicForm>(emptyDynamicForm);

  const adItems = items.filter((item) => item.section === "ad-document");
  const artItems = items.filter((item) => item.section === "art-document");
  const units = useMemo(
    () => items
      .filter((item) => item.section === "struktur-unit")
      .sort((a, b) => Number(parseMeta(a.summary, { order: "0" }).order) - Number(parseMeta(b.summary, { order: "0" }).order)),
    [items],
  );
  const programs = items.filter((item) => item.section === "program-kerja");

  const openCreate = (kind: Exclude<EditorKind, null>) => {
    setEditorKind(kind);
    setForm(emptyDynamicForm());
    onMessage("");
  };

  const openEdit = (item: PublicContentItem, kind: Exclude<EditorKind, null>) => {
    const meta = parseMeta(item.summary, {
      version: "1.0",
      effectiveDate: "",
      fileName: "",
      unitType: "Unit Pelaksana",
      order: "0",
      leader: "",
      members: "",
      status: "aktif",
      startDate: "",
      endDate: "",
    });
    setEditorKind(kind);
    setForm({
      ...emptyDynamicForm(),
      ...meta,
      id: item.id,
      title: item.title,
      description: item.body,
      pdfUrl: item.imageUrl,
    });
    onMessage("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editorKind) return;
    const section = editorKind === "ad"
      ? "ad-document"
      : editorKind === "art"
        ? "art-document"
        : editorKind === "unit"
          ? "struktur-unit"
          : "program-kerja";
    const metadata = editorKind === "unit"
      ? {
          unitType: form.unitType,
          order: form.order,
          leader: form.leader,
          members: form.members,
        }
      : editorKind === "program"
        ? {
            status: form.status,
            startDate: form.startDate,
            endDate: form.endDate,
          }
        : {
            version: form.version,
            effectiveDate: form.effectiveDate,
            fileName: form.fileName,
          };

    startTransition(async () => {
      try {
        await saveContentItem({
          id: form.id,
          module: "tentang-kami",
          section,
          title: form.title,
          summary: JSON.stringify(metadata),
          body: form.description || form.title,
          imageUrl: form.pdfUrl,
          status: "published",
        });
        setEditorKind(null);
        onMessage("Data berhasil disimpan dan halaman publik telah diperbarui.");
        router.refresh();
      } catch (error) {
        onMessage(error instanceof Error ? error.message : "Data gagal disimpan.");
      }
    });
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    startTransition(async () => {
      try {
        await deleteContentItem(deleteId);
        setDeleteId(null);
        onMessage("Data berhasil dihapus.");
        router.refresh();
      } catch (error) {
        onMessage(error instanceof Error ? error.message : "Data gagal dihapus.");
      }
    });
  };

  const renderActions = (item: PublicContentItem, kind: Exclude<EditorKind, null>) => (
    <div className="aboutItemActions">
      <button type="button" onClick={() => openEdit(item, kind)}><AboutIcon name="edit" /> Edit</button>
      <button type="button" onClick={() => setDeleteId(item.id)}><AboutIcon name="trash" /> Hapus</button>
    </div>
  );

  return (
    <section className="aboutWorkspace">
      {mode === "ad-art" ? (
        <>
          <header className="aboutPageHeading">
            <h2>AD &amp; ART</h2>
            <p>Anggaran Dasar &amp; Anggaran Rumah Tangga Dewan Da&apos;wah Semarang</p>
          </header>
          <div className="aboutDocumentList">
            {[
              { title: "Anggaran Dasar (AD)", kind: "ad" as const, data: adItems },
              { title: "Anggaran Rumah Tangga (ART)", kind: "art" as const, data: artItems },
            ].map((group) => (
              <article className="aboutDocumentCard" key={group.kind}>
                <header>
                  <h3>{group.title}</h3>
                  <button className="aboutPrimaryButton" type="button" onClick={() => openCreate(group.kind)}>
                    <AboutIcon name="plus" /> Tambah
                  </button>
                </header>
                {group.data.length === 0 ? (
                  <p className="aboutEmptyText">Belum ada dokumen {group.title}</p>
                ) : (
                  <div className="aboutDocumentRows">
                    {group.data.map((item) => {
                      const meta = parseMeta(item.summary, { version: "-", effectiveDate: "-", fileName: "" });
                      return (
                        <div key={item.id}>
                          <span><AboutIcon name="file" /></span>
                          <div>
                            <strong>{item.title}</strong>
                            <small>Versi {meta.version} · Berlaku {meta.effectiveDate || "-"}</small>
                          </div>
                          {renderActions(item, group.kind)}
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      ) : null}

      {mode === "struktur-kepengurusan" ? (
        <>
          <header className="aboutPageHeading withAction">
            <div>
              <h2>Struktur Kepengurusan</h2>
              <p>Kelola unit dan anggota pengurus</p>
            </div>
            <button className="aboutPrimaryButton" type="button" onClick={() => openCreate("unit")}>
              <AboutIcon name="folder" /> Tambah Unit
            </button>
          </header>
          {units.length === 0 ? (
            <div className="aboutLargeEmpty">
              <AboutIcon name="users" />
              <h3>Belum ada unit kepengurusan</h3>
              <p>Tambah unit terlebih dahulu</p>
            </div>
          ) : (
            <div className="aboutUnitGrid">
              {units.map((item) => {
                const meta = parseMeta(item.summary, {
                  unitType: "Unit Pelaksana",
                  order: "0",
                  leader: "",
                  members: "",
                });
                return (
                  <article className="aboutUnitCard" key={item.id}>
                    <span>{meta.unitType}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    {meta.leader ? <strong>Ketua: {meta.leader}</strong> : null}
                    {meta.members ? <small>{meta.members.split("\n").filter(Boolean).length} anggota</small> : null}
                    {renderActions(item, "unit")}
                  </article>
                );
              })}
            </div>
          )}
        </>
      ) : null}

      {mode === "program-kerja" ? (
        <>
          <header className="aboutPageHeading withAction">
            <div>
              <h2>Program Kerja</h2>
              <p>Kelola program kerja Dewan Da&apos;wah Semarang</p>
            </div>
            <button className="aboutPrimaryButton" type="button" onClick={() => openCreate("program")}>
              <AboutIcon name="plus" /> Tambah Program
            </button>
          </header>
          <div className="aboutProgramStats">
            <article><span>Total Program</span><strong>{programs.length}</strong></article>
            <article><span>Aktif</span><strong>{programs.filter((item) => parseMeta(item.summary, { status: "" }).status === "aktif").length}</strong></article>
            <article><span>Selesai</span><strong>{programs.filter((item) => parseMeta(item.summary, { status: "" }).status === "selesai").length}</strong></article>
          </div>
          {programs.length === 0 ? (
            <div className="aboutLargeEmpty">
              <AboutIcon name="clipboard" />
              <h3>Belum ada program kerja</h3>
            </div>
          ) : (
            <div className="aboutProgramGrid">
              {programs.map((item) => {
                const meta = parseMeta(item.summary, { status: "aktif", startDate: "", endDate: "" });
                return (
                  <article className="aboutProgramCard" key={item.id}>
                    <span className={`aboutStatus ${meta.status}`}>{meta.status}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    <small>{meta.startDate || "-"} {meta.endDate ? `— ${meta.endDate}` : ""}</small>
                    {renderActions(item, "program")}
                  </article>
                );
              })}
            </div>
          )}
        </>
      ) : null}

      {editorKind ? (
        <AboutModal
          form={form}
          kind={editorKind}
          onChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
          onClose={() => setEditorKind(null)}
          onSubmit={submit}
          pending={isPending}
        />
      ) : null}

      {deleteId !== null ? (
        <div className="aboutModalOverlay" role="presentation" onMouseDown={() => setDeleteId(null)}>
          <section className="aboutDeleteDialog" role="alertdialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <h2>Hapus Data?</h2>
            <p>Data juga akan hilang dari halaman publik Tentang Kami.</p>
            <div className="aboutModalActions">
              <button className="aboutCancelButton" type="button" onClick={() => setDeleteId(null)}>Batal</button>
              <button className="aboutDangerButton" type="button" onClick={confirmDelete} disabled={isPending}>
                {isPending ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}

export default function AboutManager({
  items,
  section,
}: {
  items: PublicContentItem[];
  section: string;
}) {
  const [message, setMessage] = useState("");
  const activeSection = (
    ["profil-organisasi", "ad-art", "struktur-kepengurusan", "program-kerja"].includes(section)
      ? section
      : "profil-organisasi"
  ) as AboutSection;

  return (
    <>
      {message ? <p className="aboutGlobalMessage">{message}</p> : null}
      {activeSection === "profil-organisasi" ? (
        <ProfileWorkspace items={items} onMessage={setMessage} />
      ) : (
        <DynamicWorkspace items={items} mode={activeSection} onMessage={setMessage} />
      )}
    </>
  );
}
