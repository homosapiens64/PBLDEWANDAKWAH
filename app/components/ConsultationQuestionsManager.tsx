"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Calendar, Filter, Inbox, Mail, MessageSquare, Phone, Search, Send, Tag, X } from "lucide-react";
import {
  answerConsultationQuestion,
  type ConsultationAnswerInput,
} from "../dashboard-actions";
import type { PublicContentItem } from "../lib/content";

type ConsultationSection = "jawaban" | "pertanyaan-masuk";

type ParsedConsultation = {
  answer: string;
  attachment: string;
  date: string;
  email: string;
  initial: string;
  item: PublicContentItem;
  name: string;
  question: string;
  status: "answered" | "pending";
  subtopic: string;
  whatsapp: string;
};

const emptyAnswer: Omit<ConsultationAnswerInput, "id"> = {
  answer: "",
  summary: "",
  title: "",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getInitial(value: string) {
  return (value.trim().charAt(0) || "?").toUpperCase();
}

function splitPublishedAnswer(body: string) {
  const normalized = body.replace(/\r\n/g, "\n").trim();
  const questionMarker = "Pertanyaan:";
  const answerMarker = "Jawaban:";
  const questionIndex = normalized.indexOf(questionMarker);
  const answerIndex = normalized.indexOf(answerMarker);

  if (questionIndex >= 0 && answerIndex > questionIndex) {
    return {
      answer: normalized.slice(answerIndex + answerMarker.length).trim(),
      question: normalized.slice(questionIndex + questionMarker.length, answerIndex).trim(),
    };
  }

  return {
    answer: "",
    question: normalized,
  };
}

function parseIncomingQuestion(item: PublicContentItem): ParsedConsultation {
  const lines = item.body.replace(/\r\n/g, "\n").split("\n");
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
    .filter((line) => !/^(Nama|Email|WhatsApp|Sub-topik|Lampiran):/i.test(line.trim()))
    .join("\n")
    .trim();
  const name = metadata.get("nama") ?? item.authorName ?? "Pengirim";
  const subtopic = metadata.get("sub-topik") ?? item.summary ?? "-";

  return {
    answer: "",
    attachment: metadata.get("lampiran") ?? item.imageUrl,
    date: formatDate(item.updatedAt),
    email: metadata.get("email") ?? "-",
    initial: getInitial(name),
    item,
    name,
    question: questionLines.join("\n").trim() || fallbackQuestion || item.body.trim(),
    status: "pending",
    subtopic,
    whatsapp: metadata.get("whatsapp") ?? "-",
  };
}

function parseAnsweredQuestion(item: PublicContentItem): ParsedConsultation {
  const parsed = splitPublishedAnswer(item.body);
  const subtopic = item.summary || "-";
  const name = item.title || "Riwayat Jawaban";

  return {
    answer: parsed.answer,
    attachment: item.imageUrl,
    date: formatDate(item.updatedAt),
    email: "-",
    initial: getInitial(name),
    item,
    name,
    question: parsed.question || item.title,
    status: "answered",
    subtopic,
    whatsapp: "-",
  };
}

function parseConsultation(item: PublicContentItem): ParsedConsultation {
  return item.section === "jawaban"
    ? parseAnsweredQuestion(item)
    : parseIncomingQuestion(item);
}

function truncate(value: string, length = 86) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}...`;
}

export default function ConsultationQuestionsManager({
  items,
  readOnly = false,
  section = "pertanyaan-masuk",
}: {
  items: PublicContentItem[];
  readOnly?: boolean;
  section?: ConsultationSection | string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState("Semua");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [answerForm, setAnswerForm] = useState(emptyAnswer);
  const activeSection: ConsultationSection = section === "jawaban" ? "jawaban" : "pertanyaan-masuk";
  const isHistory = activeSection === "jawaban";

  const parsedItems = useMemo(() => items.map(parseConsultation), [items]);
  const visibleItems = useMemo(
    () => parsedItems.filter(({ item }) => item.section === activeSection),
    [activeSection, parsedItems],
  );
  const subtopics = useMemo(
    () => ["Semua", ...Array.from(new Set(visibleItems.map((entry) => entry.subtopic).filter(Boolean)))],
    [visibleItems],
  );
  const effectiveSubtopic = subtopics.includes(selectedSubtopic) ? selectedSubtopic : "Semua";
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return visibleItems.filter((entry) => {
      const matchesQuery = !normalizedQuery
        || entry.name.toLowerCase().includes(normalizedQuery)
        || entry.item.title.toLowerCase().includes(normalizedQuery)
        || entry.question.toLowerCase().includes(normalizedQuery)
        || entry.answer.toLowerCase().includes(normalizedQuery);
      const matchesSubtopic = effectiveSubtopic === "Semua" || entry.subtopic === effectiveSubtopic;

      return matchesQuery && matchesSubtopic;
    });
  }, [effectiveSubtopic, query, visibleItems]);
  const activeItem = filteredItems.find((entry) => entry.item.id === selectedId)
    ?? visibleItems.find((entry) => entry.item.id === selectedId)
    ?? null;
  const totalCount = parsedItems.length;
  const pendingCount = parsedItems.filter((entry) => entry.status === "pending").length;
  const answeredCount = parsedItems.filter((entry) => entry.status === "answered").length;

  const selectItem = (entry: ParsedConsultation) => {
    setMessage("");
    setSelectedId(entry.item.id);
    setAnswerForm({
      answer: entry.answer,
      summary: entry.subtopic !== "-" ? entry.subtopic : entry.item.summary,
      title: entry.item.title,
    });
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
        setMessage(isHistory ? "Perubahan jawaban berhasil disimpan." : "Jawaban berhasil dikirim ke user.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Jawaban gagal disimpan.");
      }
    });
  };

  return (
    <section className="moduleWorkspace consultationWorkspace split" aria-label={isHistory ? "Riwayat jawaban konsultasi" : "Pertanyaan masuk konsultasi"}>
      <header className={`consultationSplitHeader ${isHistory ? "history" : ""}`}>
        <span className="consultationHeaderIcon">
          {isHistory ? <BookOpen /> : <Inbox />}
        </span>
        <div>
          <h2>{isHistory ? "Riwayat Jawaban" : "Pertanyaan Masuk"}</h2>
          <p>{isHistory ? `${visibleItems.length} pertanyaan sudah dijawab` : `${visibleItems.length} pertanyaan menunggu jawaban`}</p>
        </div>
      </header>

      {message ? <p className="dashboardActionMessage">{message}</p> : null}

      <div className="consultationMetricGrid">
        <article>
          <strong>{totalCount}</strong>
          <span>Total</span>
        </article>
        <article>
          <strong>{pendingCount}</strong>
          <span>Pending</span>
        </article>
        <article>
          <strong>{answeredCount}</strong>
          <span>Dijawab</span>
        </article>
      </div>

      <div className="consultationSplitLayout">
        <aside className="consultationListPane">
          <div className="consultationToolbar">
            <label>
              <Search />
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama / pertanyaan..."
                value={query}
              />
            </label>
            <div>
              <Filter />
              <select
                onChange={(event) => setSelectedSubtopic(event.target.value)}
                value={effectiveSubtopic}
              >
                {subtopics.map((subtopic) => (
                  <option key={subtopic}>{subtopic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="consultationCardList">
            {filteredItems.map((entry) => (
              <button
                className={`consultationListCard ${selectedId === entry.item.id ? "active" : ""}`}
                key={entry.item.id}
                onClick={() => selectItem(entry)}
                type="button"
              >
                <span className={`consultationAvatar ${entry.status}`}>{entry.initial}</span>
                <span className="consultationListBody">
                  <span className="consultationListTop">
                    <strong>{entry.name}</strong>
                    <small>{entry.date}</small>
                  </span>
                  <span className="consultationListBadges">
                    <i>{entry.subtopic}</i>
                    <b>{entry.status === "answered" ? "Dijawab" : "Pending"}</b>
                  </span>
                  <span className="consultationListPreview">
                    {truncate(entry.question)}
                  </span>
                </span>
              </button>
            ))}
            {filteredItems.length === 0 ? (
              <div className="consultationListEmpty">Belum ada data konsultasi pada kategori ini.</div>
            ) : null}
          </div>
        </aside>

        <section className="consultationDetailPane">
          {!activeItem ? (
            <div className="consultationEmptyDetail">
              <MessageSquare />
              <strong>Pilih pertanyaan untuk melihat detail</strong>
              <p>Klik salah satu item di sebelah kiri.</p>
            </div>
          ) : (
            <article className="consultationDetailCard">
              <div className="consultationDetailHead">
                <span className={`consultationAvatar ${activeItem.status}`}>{activeItem.initial}</span>
                <div>
                  <h3>{activeItem.name}</h3>
                  <p>{activeItem.status === "answered" ? "Sudah Dijawab" : "Belum Dijawab"}</p>
                </div>
                <button type="button" aria-label="Tutup detail" onClick={() => setSelectedId(null)}>
                  <X />
                </button>
              </div>

              <div className="consultationInfoGrid">
                <span><Phone /> {activeItem.whatsapp}</span>
                <span><Tag /> {activeItem.subtopic}</span>
                <span><Mail /> {activeItem.email}</span>
                <span><Calendar /> {activeItem.date}</span>
              </div>

              <div className="consultationQuestionBox">
                <span>Pertanyaan</span>
                <p>{activeItem.question}</p>
                {activeItem.attachment ? (
                  <a href={activeItem.attachment} target="_blank" rel="noreferrer">
                    Buka lampiran
                  </a>
                ) : null}
              </div>

              <form className="consultationAnswerForm" onSubmit={submitAnswer}>
                {isHistory ? (
                  <div className="consultationAnswerBox">
                    <span>Jawaban</span>
                    <p>{activeItem.answer || "Belum ada jawaban tersimpan."}</p>
                  </div>
                ) : null}

                <label>
                  <span>{isHistory ? "Edit Jawaban" : "Tulis Jawaban"}</span>
                  <textarea
                    disabled={readOnly}
                    onChange={(event) =>
                      setAnswerForm((current) => ({ ...current, answer: event.target.value }))
                    }
                    placeholder="Tuliskan jawaban yang jelas dan komprehensif berdasarkan Al-Qur'an dan Sunnah..."
                    required
                    rows={isHistory ? 5 : 7}
                    value={answerForm.answer}
                  />
                </label>

                <button disabled={readOnly || isPending} type="submit">
                  <Send />
                  {isPending
                    ? "Menyimpan..."
                    : isHistory
                      ? "Simpan Perubahan"
                      : "Kirim Jawaban"}
                </button>
              </form>
            </article>
          )}
        </section>
      </div>
    </section>
  );
}
