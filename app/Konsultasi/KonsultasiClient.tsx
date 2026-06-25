"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { CertifiedUstadzItem } from "../lib/certified-ustadz";
import type { PublicContentItem } from "../lib/content";

const subtopics = [
  "Fiqih Ibadah",
  "Keluarga & Pernikahan",
  "Akidah & Tauhid",
  "Pendidikan Anak",
  "Ekonomi Islam",
];

const topicCards = [
  {
    title: "Hukum Islam",
    description: "Fiqih, ibadah, muamalah, dan adab sehari-hari.",
    icon: "o",
    active: true,
  },
  {
    title: "Keluarga Sakinah",
    description: "Pernikahan, waris, rumah tangga, dan anak.",
    icon: "o",
    active: false,
  },
];

const faqItems = [
  "Seberapa cepat pertanyaan dijawab?",
  "Apakah jawaban dikirim via email?",
  "Bagaimana jika pertanyaan saya sensitif?",
  "Apakah pertanyaan bisa anonim?",
];

const tips = [
  "Sampaikan pertanyaan dengan singkat dan jelas.",
  "Sertakan kronologi agar ustadz bisa melihat konteks.",
  "Jika perlu, lampirkan foto atau dokumen pendukung.",
  "Gunakan bahasa yang sopan dan mudah dipahami.",
];

const answerPreviewLimit = 180;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function sectionLabel(value: string) {
  const labels: Record<string, string> = {
    jawaban: "Jawaban",
    "pertanyaan-masuk": "Pertanyaan",
  };

  return labels[value] ?? value.replaceAll("-", " ");
}

function getPublishedAnswer(body: string) {
  const answerMarker = "Jawaban:";
  const answerIndex = body.indexOf(answerMarker);

  if (answerIndex < 0) return body.trim();

  return body.slice(answerIndex + answerMarker.length).trim();
}

function getPreviewText(value: string, isExpanded: boolean) {
  if (isExpanded || value.length <= answerPreviewLimit) return value;

  return `${value.slice(0, answerPreviewLimit).trimEnd()}...`;
}

export default function KonsultasiClient({
  certifiedUstadz,
  items,
}: {
  certifiedUstadz: CertifiedUstadzItem[];
  items: PublicContentItem[];
}) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedAnswerIds, setExpandedAnswerIds] = useState<number[]>([]);

  const recentItems = useMemo(
    () => items.filter((item) => item.section === "jawaban").slice(0, 5),
    [items],
  );
  const toggleAnswer = (id: number) => {
    setExpandedAnswerIds((current) =>
      current.includes(id)
        ? current.filter((answerId) => answerId !== id)
        : [...current, id],
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/konsultasi", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "Pertanyaan gagal dikirim.");
      }

      form.reset();
      setMessage("Pertanyaan berhasil dikirim. Tim ustadz akan meninjau dari dashboard.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pertanyaan gagal dikirim.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="container consultHero">
        <p className="consultEyebrow">Layanan Islami Terpercaya</p>
        <h1 className="consultTitle">
          Konsultasi<span>Agama</span>
        </h1>
        <p className="consultLead">
          Tim Ustadz Dewan Da&apos;wah siap menjawab pertanyaan seputar hukum Islam dan keluarga
          secara gratis, terpercaya, dan berlandaskan Al-Qur&apos;an serta Sunnah.
        </p>

        <div className="consultTopicsHeader">PILIH TOPIK KONSULTASI</div>
        <div className="consultTopicRow">
          {topicCards.map((topic) => (
            <article key={topic.title} className={`consultTopicCard ${topic.active ? "active" : ""}`}>
              <div className="consultTopicIcon">{topic.icon}</div>
              <div className="consultTopicCopy">
                <h2>{topic.title}</h2>
                <p>{topic.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container consultLayout">
        <div className="consultMainColumn">
          <section className="consultFormCard">
            <div className="consultFormHead">
              <div>
                <p>Form Pertanyaan</p>
                <h2>Hubungi Kami</h2>
              </div>
              <span>Aktif 08.00 - 16.00</span>
            </div>

            <div className="consultFormBar">
              <span className="consultBarIcon">?</span>
              <div>
                <strong>Form Pertanyaan - Hubungi Kami</strong>
                <p>Isi data dengan lengkap agar jawaban dapat diproses lebih cepat.</p>
              </div>
            </div>

            <form className="consultFormGrid" onSubmit={submit}>
              <label>
                Nama Lengkap <span>*</span>
                <input name="name" required type="text" placeholder="Nama Anda..." />
              </label>
              <label>
                Email <span>*</span>
                <input name="email" required type="email" placeholder="email@domain.com" />
              </label>
              <label>
                No. WhatsApp
                <input name="whatsapp" type="tel" placeholder="08xx-xxxx-xxxx" />
              </label>
              <label>
                Sub-topik <span>*</span>
                <select name="subtopic" required defaultValue="">
                  <option value="" disabled>
                    Pilih sub-topik...
                  </option>
                  {subtopics.map((subtopic) => (
                    <option key={subtopic}>{subtopic}</option>
                  ))}
                </select>
              </label>
              <label className="fullWidth">
                Judul Pertanyaan <span>*</span>
                <input name="title" required type="text" placeholder="Ringkasan singkat pertanyaan Anda" />
              </label>
              <label className="fullWidth">
                Isi Pertanyaan <span>*</span>
                <textarea
                  name="question"
                  required
                  rows={6}
                  placeholder="Jelaskan pertanyaan Anda secara lengkap dan detail. Sertakan konteks bila perlu."
                />
              </label>
              <label className="fullWidth">
                Lampiran
                <input
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  name="attachment"
                  type="file"
                />
                <small className="consultFieldHint">Opsional, format JPG, PNG, WEBP, atau PDF. Maksimal 5 MB.</small>
              </label>

              <label className="checkLine fullWidth">
                <input name="privacy" required type="checkbox" defaultChecked />
                Saya setuju data diproses untuk keperluan konsultasi.
              </label>
              <label className="checkLine fullWidth">
                <input name="contactConsent" type="checkbox" defaultChecked />
                Saya menyetujui kontak lanjutan melalui WhatsApp atau email.
              </label>

              {message ? <p className="dashboardActionMessage fullWidth">{message}</p> : null}

              <button type="submit" className="primaryButton fullWidth" disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim Pertanyaan"}
              </button>
              <a className="whatsappButton fullWidth" href="https://wa.me/" target="_blank" rel="noreferrer">
                Konsultasi Langsung via WhatsApp
              </a>
            </form>
          </section>

          <section className="consultRecentCard">
            <div className="sectionHead compact">
              <div>
                <p className="sectionEyebrow">Konsultasi Terbit</p>
                <h3>Jawaban Terbaru</h3>
              </div>
              <a href="#recent-konsultasi">Lihat Semua</a>
            </div>

            <div className="recentList" id="recent-konsultasi">
              {recentItems.map((item, index) => {
                const answer = getPublishedAnswer(item.body);
                const isExpanded = expandedAnswerIds.includes(item.id);
                const isLongAnswer = answer.length > answerPreviewLimit;

                return (
                  <article key={item.id} className="recentItem">
                    <div className="recentContent">
                      <div className="recentItemHeader">
                        <div className="recentIndex">{index + 1}</div>
                        <div>
                          <h4>{item.title}</h4>
                          {item.summary ? <p className="recentSummary">{item.summary}</p> : null}
                        </div>
                      </div>
                      <div className="recentAnswer">
                        <span className="recentAnswerLabel">Jawaban</span>
                        <p>{getPreviewText(answer, isExpanded)}</p>
                        {isLongAnswer ? (
                          <button
                            className="recentToggleButton"
                            type="button"
                            onClick={() => toggleAnswer(item.id)}
                          >
                            {isExpanded ? "Tutup" : "Lihat selengkapnya"}
                          </button>
                        ) : null}
                      </div>
                      <div className="recentMeta">
                        <span className="pill tiny">{sectionLabel(item.section)}</span>
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
              {recentItems.length === 0 ? (
                <div className="financeEmptyState">Belum ada jawaban konsultasi yang diterbitkan.</div>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="consultSidebar">
          <section className="sidebarCard chatCard darkCard">
            <p className="sidebarTitle">Chat Langsung dengan Ustadz</p>
            <div className="chatHeader">
              <div className="chatAvatar">TS</div>
              <div>
                <strong>Tim Ustadz DDI Semarang</strong>
                <p>Online</p>
              </div>
            </div>

            <div className="chatMessage user">Apa hukum zakat penghasilan?</div>
            <div className="chatMessage admin">Silakan kirim nominal gaji dan kebutuhan pokoknya.</div>
            <div className="chatMessage user">Baik, saya kirimkan data via form.</div>

            <div className="chatInputRow">
              <input type="text" placeholder="Tulis pesan disini..." />
              <button type="button">➤</button>
            </div>
          </section>

          <section className="sidebarCard whiteCard">
            <p className="sidebarTitle muted">Ustadz Bersertifikat</p>
            <div className="ustadzList">
              {certifiedUstadz.map((ustadz, index) => (
                <div key={ustadz.id} className="ustadzItem">
                  <div className="ustadzAvatar">{index + 1}</div>
                  <div>
                    <strong>{ustadz.name}</strong>
                    <p>{ustadz.specialization}</p>
                  </div>
                  <span className="statusDot" />
                </div>
              ))}
              {certifiedUstadz.length === 0 ? (
                <div className="financeEmptyState">Belum ada ustadz bersertifikat.</div>
              ) : null}
            </div>
          </section>

          <section className="sidebarCard whiteCard">
            <p className="sidebarTitle muted">Tips Konsultasi</p>
            <div className="tipsList">
              {tips.map((tip) => (
                <div key={tip} className="tipItem">
                  <span>•</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="sidebarCard whiteCard">
            <p className="sidebarTitle muted">Pertanyaan Umum (FAQ)</p>
            <div className="faqList">
              {faqItems.map((item) => (
                <details key={item}>
                  <summary>{item}</summary>
                  <p>Jawaban diberikan oleh tim ustadz sesuai konteks pertanyaan dan urgensinya.</p>
                </details>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </>
  );
}
