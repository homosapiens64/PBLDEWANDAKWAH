import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedContentItemById, getPublishedContentItems } from "../../../lib/content";
import { formatDate, readingMinutes, sectionLabel } from "../../BeritaPublicView";

export const dynamic = "force-dynamic";

function paragraphs(body: string) {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default async function BeritaDetailPage({
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
    getPublishedContentItemById("website", numericId),
    getPublishedContentItems("website"),
  ]);

  if (!article) {
    notFound();
  }

  const related = latest
    .filter((item) => item.id !== article.id && item.section === article.section)
    .slice(0, 4);

  return (
    <main className="page articleDetailPage">
      <article className="container articleDetail">
        <Link className="articleBackLink" href={`/Berita/${sectionLabel(article.section)}`}>
          Kembali ke {sectionLabel(article.section)}
        </Link>

        <header className="articleDetailHeader">
          <span className="pill">{sectionLabel(article.section).toLocaleUpperCase("id-ID")}</span>
          <h1>{article.title}</h1>
          <div className="articleDetailMeta">
            <span>{article.authorName || "Tim Redaksi"}</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>{readingMinutes(article.body)} menit baca</span>
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
            <h3>Berita Terkait</h3>
            <Link href="/Berita/Terkini">SEMUA BERITA -&gt;</Link>
          </div>
          <div className="cardsGrid">
            {related.map((item) => (
              <Link className="routeCard articleRelatedCard" href={`/Berita/baca/${item.id}`} key={item.id}>
                <span className="routeTag">{formatDate(item.publishedAt, "short")}</span>
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
