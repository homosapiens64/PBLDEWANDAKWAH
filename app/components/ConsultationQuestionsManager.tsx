"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  answerConsultationQuestion,
  deleteConsultationQuestion,
  type ConsultationAnswerInput,
} from "../dashboard-actions";
import type { PublicContentItem } from "../lib/content";

type ParsedQuestion = {
  email: string;
  name: string;
  question: string;
  subtopic: string;
  whatsapp: string;
};

const emptyAnswer: Omit<ConsultationAnswerInput, "id"> = {
  answer: "",
  summary: "",
  title: "",
};

function parseQuestionBody(body: string): ParsedQuestion {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blankIndex = lines.findIndex((line) => line.trim() === "");
  const metaLines = blankIndex >= 0 ? lines.slice(0, blankIndex) : lines;
  const questionLines = blankIndex >= 0 ? lines.slice(blankIndex + 1) : [];
  const metadata = new Map<string, string>();

  metaLines.forEach((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 0) return;
    metadata.set(
      line.slice(0, separatorIndex).trim().toLowerCase(),
      line.slice(separatorIndex + 1).trim(),
    );
  });

  const fallbackQuestion = lines
    .filter((line) => !/^(Nama|Email|WhatsApp|Sub-topik):/i.test(line.trim()))
    .join("\n")
    .trim();

  return {
    email: metadata.get("email") ?? "-",
    name: metadata.get("nama") ?? "-",
    question: questionLines.join("\n").trim() || fallbackQuestion || body.trim(),
    subtopic: metadata.get("sub-topik") ?? "-",
    whatsapp: metadata.get("whatsapp") ?? "-",
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Icon({ name }: { name: "check" | "trash" }) {
  const paths = {
    check: (
      <>
        <path d="M20 6 9 17l-5-5" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M6 6l1 15h10l1-15" />
        <path d="M10 11v6M14 11v6" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function ConsultationQuestionsManager({
  items,
  readOnly = false,
}: {
  items: PublicContentItem[];
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [answeringId, setAnsweringId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [answerForm, setAnswerForm] = useState(emptyAnswer);
  const parsedItems = useMemo(
    () => items.map((item) => ({ item, parsed: parseQuestionBody(item.body) })),
    [items],
  );
  const activeItem = parsedItems.find(({ item }) => item.id === answeringId) ?? null;

  const openAnswer = (item: PublicContentItem, parsed: ParsedQuestion) => {
    setAnsweringId(item.id);
    setMessage("");
    setAnswerForm({
      answer: "",
      summary: parsed.subtopic !== "-" ? parsed.subtopic : item.summary,
      title: item.title,
    });
  };

  const closeAnswer = () => {
    setAnsweringId(null);
    setAnswerForm(emptyAnswer);
  };

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeItem) return;
    setMessage("");

    startTransition(async () => {
      try {
        await answerConsultationQuestion({
          ...answerForm,
          id: activeItem.item.id,
        });
        closeAnswer();
        setMessage("Jawaban berhasil diterbitkan ke website utama.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Jawaban gagal disimpan.");
      }
    });
  };

  const confirmDelete = () => {
    if (deleteId === null) return;

    startTransition(async () => {
      try {
        await deleteConsultationQuestion(deleteId);
        setDeleteId(null);
        setMessage("Pertanyaan konsultasi berhasil dihapus.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Pertanyaan gagal dihapus.");
      }
    });
  };

  return (
    <section className="moduleWorkspace consultationWorkspace" aria-label="Pertanyaan masuk konsultasi">
      <div className="financePageHead">
        <div>
          <h2>Pertanyaan Masuk</h2>
          <p>Pertanyaan dari form konsultasi website utama masuk ke sini untuk dijawab ustadz.</p>
        </div>
      </div>

      {message ? <p className="dashboardActionMessage">{message}</p> : null}

      <div className="kajianStats consultationStats">
        <article className="total">
          <strong>{items.length}</strong>
          <span>Total Masuk</span>
        </article>
        <article className="draft">
          <strong>{items.filter((item) => item.status === "draft").length}</strong>
          <span>Menunggu Jawaban</span>
        </article>
      </div>

      <article className="financeTableCard">
        <div className="financeTableWrap">
          <table className="financeTable">
            <thead>
              <tr>
                <th>No</th>
                <th>Pertanyaan</th>
                <th>Pengirim</th>
                <th>Sub-topik</th>
                <th>Masuk</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {parsedItems.map(({ item, parsed }, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{item.title}</strong>
                    <small className="contentTableSummary consultationQuestionPreview">
                      {parsed.question}
                    </small>
                  </td>
                  <td>
                    <strong>{parsed.name}</strong>
                    <small className="contentTableSummary">
                      {parsed.email}
                      {parsed.whatsapp !== "-" ? ` / ${parsed.whatsapp}` : ""}
                    </small>
                  </td>
                  <td>{parsed.subtopic}</td>
                  <td>{formatDate(item.updatedAt)}</td>
                  <td>
                    <span className={`typeBadge ${item.status === "published" ? "in" : "out"}`}>
                      {item.status === "published" ? "Terbit" : "Baru"}
                    </span>
                  </td>
                  <td>
                    {!readOnly ? (
                      <span className="financeActions">
                        <button
                          className="financeEditButton"
                          type="button"
                          aria-label={`Jawab ${item.title}`}
                          onClick={() => openAnswer(item, parsed)}
                        >
                          <Icon name="check" />
                        </button>
                        <button
                          className="financeDeleteButton"
                          type="button"
                          aria-label={`Hapus ${item.title}`}
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Icon name="trash" />
                        </button>
                      </span>
                    ) : "-"}
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="financeEmptyState" colSpan={7}>
                    Belum ada pertanyaan masuk dari website utama.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>

      {activeItem && !readOnly ? (
        <div className="financeModalOverlay" role="presentation" onMouseDown={closeAnswer}>
          <section
            className="financeModal consultationAnswerModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-answer-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="financeModalHeader">
              <h2 id="consultation-answer-title">Jawab Pertanyaan</h2>
              <button type="button" aria-label="Tutup modal" onClick={closeAnswer}>x</button>
            </div>

            <div className="consultationSubmittedQuestion">
              <span>{activeItem.parsed.subtopic}</span>
              <h3>{activeItem.item.title}</h3>
              <p>{activeItem.parsed.question}</p>
            </div>

            <form onSubmit={submitAnswer}>
              <label className="financeFormField">
                <span>Judul Publikasi</span>
                <input
                  required
                  maxLength={180}
                  value={answerForm.title}
                  onChange={(event) =>
                    setAnswerForm((current) => ({ ...current, title: event.target.value }))
                  }
                />
              </label>
              <label className="financeFormField">
                <span>Ringkasan / Kategori</span>
                <input
                  maxLength={220}
                  value={answerForm.summary}
                  onChange={(event) =>
                    setAnswerForm((current) => ({ ...current, summary: event.target.value }))
                  }
                />
              </label>
              <label className="financeFormField">
                <span>Jawaban Ustadz</span>
                <textarea
                  required
                  rows={8}
                  value={answerForm.answer}
                  onChange={(event) =>
                    setAnswerForm((current) => ({ ...current, answer: event.target.value }))
                  }
                  placeholder="Tulis jawaban yang akan diterbitkan di website utama..."
                />
              </label>
              <div className="financeModalActions">
                <button className="financeCancelButton" type="button" onClick={closeAnswer}>
                  Batal
                </button>
                <button className="financeSaveButton" type="submit" disabled={isPending}>
                  {isPending ? "Menerbitkan..." : "Terbitkan Jawaban"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {deleteId !== null && !readOnly ? (
        <div className="financeModalOverlay" role="presentation" onMouseDown={() => setDeleteId(null)}>
          <section
            className="financeDeleteDialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="consultation-delete-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="consultation-delete-title">Hapus Pertanyaan?</h2>
            <p>Pertanyaan ini akan hilang dari daftar pertanyaan masuk.</p>
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
