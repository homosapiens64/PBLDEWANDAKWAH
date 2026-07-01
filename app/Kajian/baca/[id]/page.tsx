import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedContentItemById, getPublishedContentItems } from "../../../lib/content";

export const dynamic = "force-dynamic";

const kajianSectionLabels: Record<string, string> = {
  "artikel-kajian": "Artikel Kajian",
  khutbah: "Khutbah",
  tauhid: "Tauhid",
  tazkiyah: "Tazkiyah",
};

function formatKajianDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function kajianReadingMinutes(body: string) {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 200));
}

function paragraphs(body: string) {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function sectionLabel(section: string) {
  return kajianSectionLabels[section] ?? section.replaceAll("-", " ");
}

export default async function KajianDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId)) {
    notFound();
  }

  const [article, latest] = await Promise.all([
    getPublishedContentItemById("kajian", numericId),
    getPublishedContentItems("kajian"),
  ]);

  if (!article) {
    notFound();
  }

  const related = latest
    .filter((item) => item.id !== article.id && item.section === article.section)
    .slice(0, 3);

  return (
    <main className="page articleDetailPage kajianDetailPage">
      <article className="container articleDetail">
        <Link className="articleBackLink" href="/Kajian">
          Kembali ke Kajian
        </Link>

        <header className="articleDetailHeader">
          <span className="pill">{sectionLabel(article.section).toLocaleUpperCase("id-ID")}</span>
          <h1>{article.title}</h1>
          <div className="articleDetailMeta">
            <span>{article.authorName || "Tim Kajian"}</span>
            <span>{formatKajianDate(article.publishedAt)}</span>
            <span>{kajianReadingMinutes(article.body)} menit baca</span>
          </div>
          {article.summary ? <p>{article.summary}</p> : null}
        </header>

        <div
          className={article.imageUrl ? "articleHeroImage" : "articleHeroImage empty"}
          style={article.imageUrl ? { backgroundImage: `url("${article.imageUrl.replaceAll('"', "%22")}")` } : undefined}
        />

        <div className="articleBody">
          {paragraphs(article.body).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      {related.length ? (
        <section className="container articleRelated">
          <div className="sectionHead">
            <h3>Kajian Terkait</h3>
            <Link href="/Kajian">SEMUA KAJIAN -&gt;</Link>
          </div>
          <div className="kajianPublicGrid">
            {related.map((item) => (
              <Link className="routeCard articleRelatedCard" href={`/Kajian/baca/${item.id}`} key={item.id}>
                <span className="routeTag">{sectionLabel(item.section)}</span>
                <h3>{item.title}</h3>
                <p>{item.summary || item.body}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
