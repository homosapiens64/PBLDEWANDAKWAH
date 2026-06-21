"use client";

import { useEffect, useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  deleteFinanceTransaction,
  saveFinanceTransaction,
} from "../dashboard-actions";

export type FinanceView = "pemasukan" | "pengeluaran" | "laporan";

type TransactionType = "pemasukan" | "pengeluaran";

export type FinanceTransaction = {
  id: number;
  date: string;
  category: string;
  detail: string;
  note: string;
  amount: number;
  author: string;
  type: TransactionType;
};

type FinanceForm = {
  date: string;
  category: string;
  amount: string;
  detail: string;
  note: string;
};

const categories: Record<TransactionType, string[]> = {
  pemasukan: ["Donasi", "Infaq", "Bantuan", "Kas", "Lainnya"],
  pengeluaran: ["Konsumsi", "Operasional", "Kegiatan Da'wah", "Transportasi", "Lainnya"],
};

const emptyForm = (): FinanceForm => ({
  date: new Date().toISOString().slice(0, 10),
  category: "",
  amount: "",
  detail: "",
  note: "",
});

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function FinanceActionButtons({
  onDelete,
  onEdit,
}: {
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <span className="financeActions">
      <button className="financeEditButton" type="button" aria-label="Edit transaksi" onClick={onEdit}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 20 8-8-4-4-8 8-2 6z" />
          <path d="m14 6 4 4" />
        </svg>
      </button>
      <button className="financeDeleteButton" type="button" aria-label="Hapus transaksi" onClick={onDelete}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M6 6l1 15h10l1-15" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      </button>
    </span>
  );
}

function FinanceModal({
  editing,
  form,
  onChange,
  onClose,
  onSubmit,
  type,
}: {
  editing: boolean;
  form: FinanceForm;
  onChange: (field: keyof FinanceForm, value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  type: TransactionType;
}) {
  const label = type === "pemasukan" ? "Pemasukan" : "Pengeluaran";
  const detailLabel = type === "pemasukan" ? "Sumber" : "Tujuan";

  return (
    <div className="financeModalOverlay" role="presentation" onMouseDown={onClose}>
      <section
        className="financeModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="finance-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="financeModalHeader">
          <h2 id="finance-modal-title">{editing ? "Edit" : "Tambah"} {label}</h2>
          <button type="button" aria-label="Tutup modal" onClick={onClose}>×</button>
        </div>

        <form onSubmit={onSubmit}>
          <label className="financeFormField">
            <span>Tanggal</span>
            <input required type="date" value={form.date} onChange={(event) => onChange("date", event.target.value)} />
          </label>

          <label className="financeFormField">
            <span>Kategori</span>
            <select required value={form.category} onChange={(event) => onChange("category", event.target.value)}>
              <option value="">Pilih kategori</option>
              {categories[type].map((category) => <option value={category} key={category}>{category}</option>)}
            </select>
          </label>

          <label className="financeFormField">
            <span>Nominal (Rp)</span>
            <input required min="1" inputMode="numeric" type="number" placeholder="0" value={form.amount} onChange={(event) => onChange("amount", event.target.value)} />
          </label>

          <label className="financeFormField">
            <span>{detailLabel}</span>
            <input required type="text" placeholder={`${detailLabel} ${type}`} value={form.detail} onChange={(event) => onChange("detail", event.target.value)} />
          </label>

          <label className="financeFormField">
            <span>Keterangan</span>
            <textarea rows={3} placeholder="Keterangan tambahan (opsional)" value={form.note} onChange={(event) => onChange("note", event.target.value)} />
          </label>

          <div className="financeModalActions">
            <button className="financeCancelButton" type="button" onClick={onClose}>Batal</button>
            <button className="financeSaveButton" type="submit">Simpan</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function FinanceWorkspace({
  databaseAvailable,
  initialTransactions,
  readOnly = false,
  view,
}: {
  databaseAvailable: boolean;
  initialTransactions: FinanceTransaction[];
  readOnly?: boolean;
  view: FinanceView;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const transactions = initialTransactions;
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | TransactionType>("");
  const [modalType, setModalType] = useState<TransactionType | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<FinanceForm>(emptyForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!modalType && deleteId === null) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalType(null);
        setDeleteId(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [deleteId, modalType]);

  const visibleTransactions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id-ID");
    return transactions.filter((transaction) => {
      const matchesView = view === "laporan" || transaction.type === view;
      const matchesType = view !== "laporan" || !typeFilter || transaction.type === typeFilter;
      const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
      const matchesSearch = !query || [transaction.category, transaction.detail, transaction.note, transaction.author]
        .some((value) => value.toLocaleLowerCase("id-ID").includes(query));
      return matchesView && matchesType && matchesCategory && matchesSearch;
    });
  }, [categoryFilter, search, transactions, typeFilter, view]);

  const openCreate = (type: TransactionType) => {
    setMessage("");
    setEditingId(null);
    setForm(emptyForm());
    setModalType(type);
  };

  const openEdit = (transaction: FinanceTransaction) => {
    setMessage("");
    setEditingId(transaction.id);
    setForm({
      date: transaction.date,
      category: transaction.category,
      amount: String(transaction.amount),
      detail: transaction.detail,
      note: transaction.note,
    });
    setModalType(transaction.type);
  };

  const closeModal = () => {
    setModalType(null);
    setEditingId(null);
  };

  const submitTransaction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!modalType) return;

    const payload = {
      date: form.date,
      category: form.category,
      detail: form.detail.trim(),
      note: form.note.trim(),
      amount: Number(form.amount),
      type: modalType,
    };

    startTransition(async () => {
      try {
        await saveFinanceTransaction({
          ...payload,
          id: editingId ?? undefined,
        });
        closeModal();
        setMessage("Transaksi berhasil disimpan.");
        router.refresh();
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Transaksi gagal disimpan. Periksa koneksi database.",
        );
      }
    });
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    startTransition(async () => {
      try {
        await deleteFinanceTransaction(deleteId);
        setDeleteId(null);
        setMessage("Transaksi berhasil dihapus.");
        router.refresh();
      } catch (error) {
        setDeleteId(null);
        setMessage(
          error instanceof Error
            ? error.message
            : "Transaksi gagal dihapus. Periksa koneksi database.",
        );
      }
    });
  };

  const currentType = view === "pengeluaran" ? "pengeluaran" : "pemasukan";
  const isReport = view === "laporan";
  const isHistory = isReport;
  const title = isReport
    ? "Laporan Keuangan"
    : currentType === "pemasukan"
      ? readOnly ? "Pemasukan" : "Kelola Pemasukan"
      : readOnly ? "Pengeluaran" : "Kelola Pengeluaran";
  const description = currentType === "pemasukan"
    ? "Catat dan kelola semua sumber pemasukan"
    : "Catat dan kelola semua pengeluaran organisasi";

  return (
    <>
      <section className={`financeWorkspace${isHistory ? " history" : ""}`} aria-label={isReport ? "Laporan keuangan" : isHistory ? "Riwayat transaksi" : title}>
        {!databaseAvailable ? (
          <div className="financeDatabaseNotice" role="status">
            <span className="financeDatabaseNoticeIcon">!</span>
            <div>
              <strong>Database keuangan belum terhubung</strong>
              <p>
                Halaman tetap dapat dibuka, tetapi data dan perubahan transaksi belum tersedia.
                Jalankan MySQL pada port 3306 lalu muat ulang halaman.
              </p>
            </div>
          </div>
        ) : null}

        {message ? <p className="dashboardActionMessage">{message}</p> : null}

        {!isHistory ? (
          <div className="financePageHead">
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            {!readOnly ? <button
              className={currentType === "pengeluaran" ? "expenseAddButton" : ""}
              type="button"
              onClick={() => openCreate(currentType)}
              disabled={!databaseAvailable}
            >
              + Tambah {currentType === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
            </button> : null}
          </div>
        ) : null}

        <article className={isHistory ? "financeHistoryCard" : "financeTableCard"}>
          <div className="financeFilters">
            {isReport ? (
              <select aria-label="Jenis transaksi" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as "" | TransactionType)}>
                <option value="">Semua Transaksi</option>
                <option value="pemasukan">Pemasukan / Uang Masuk</option>
                <option value="pengeluaran">Pengeluaran / Uang Keluar</option>
              </select>
            ) : null}
            <select aria-label="Kategori" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="">Semua Kategori</option>
              {[...new Set(transactions.map((transaction) => transaction.category))].map((category) => (
                <option value={category} key={category}>{category}</option>
              ))}
            </select>
            <select aria-label="Bulan" defaultValue="2025-05">
              <option value="2025-05">Mei 2025</option>
            </select>
            <label className="financeSearch">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
              <input type="search" placeholder="Cari transaksi..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </label>
          </div>

          <div className="financeTableWrap">
            <table className={`financeTable${isHistory ? " historyTable" : ""}`}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Kategori</th>
                  <th>{isHistory ? "Transaksi" : currentType === "pemasukan" ? "Sumber" : "Tujuan"}</th>
                  <th>Keterangan</th>
                  <th>{isHistory ? "Jenis" : "Nominal"}</th>
                  <th>Dicatat Oleh</th>
                  <th>{isHistory ? "Nominal" : "Aksi"}</th>
                </tr>
              </thead>
              <tbody>
                {visibleTransactions.map((transaction, index) => (
                  <tr key={transaction.id}>
                    <td>{index + 1}</td>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.detail}</td>
                    <td>{transaction.note || "-"}</td>
                    {isHistory ? (
                      <>
                        <td><span className={`typeBadge ${transaction.type === "pemasukan" ? "in" : "out"}`}>{transaction.type === "pemasukan" ? "Masuk" : "Keluar"}</span></td>
                        <td>{transaction.author}</td>
                        <td className={transaction.type === "pemasukan" ? "amountIn" : "amountOut"}>
                          {transaction.type === "pemasukan" ? "+" : "-"}{formatAmount(transaction.amount)}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className={transaction.type === "pemasukan" ? "amountIn" : "amountOut"}>{formatAmount(transaction.amount)}</td>
                        <td>{transaction.author}</td>
                        <td>
                          {readOnly
                            ? "-"
                            : <FinanceActionButtons onEdit={() => openEdit(transaction)} onDelete={() => setDeleteId(transaction.id)} />}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {visibleTransactions.length === 0 ? (
                  <tr>
                    <td className="financeEmptyState" colSpan={8}>
                      {databaseAvailable
                        ? "Belum ada transaksi yang sesuai."
                        : "Data transaksi akan tampil setelah database terhubung."}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {modalType && !readOnly ? (
        <FinanceModal
          editing={editingId !== null}
          form={form}
          onChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
          onClose={closeModal}
          onSubmit={submitTransaction}
          type={modalType}
        />
      ) : null}

      {deleteId !== null && !readOnly ? (
        <div className="financeModalOverlay" role="presentation" onMouseDown={() => setDeleteId(null)}>
          <section className="financeDeleteDialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" onMouseDown={(event) => event.stopPropagation()}>
            <h2 id="delete-title">Hapus Transaksi?</h2>
            <p>Data yang dihapus dari tampilan tidak dapat dikembalikan.</p>
            <div className="financeModalActions">
              <button className="financeCancelButton" type="button" onClick={() => setDeleteId(null)}>Batal</button>
              <button className="financeConfirmDeleteButton" type="button" onClick={confirmDelete} disabled={isPending}>
                {isPending ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
