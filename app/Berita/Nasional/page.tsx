import { getPublishedContentItems } from "../../lib/content";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BeritaNasionalPage() {
  const news = await getPublishedContentItems("website", "nasional");

  return (
    <main className="page simpleRoutePage">
      <section className="container routeHero">
        <p className="routeEyebrow">Berita</p>
        <h1 className="routeTitle">Nasional</h1>
        <p className="routeLead">
          Kumpulan berita nasional yang berkaitan dengan pergerakan da&apos;wah, pendidikan umat,
          dan agenda strategis DDII di Indonesia.
        </p>
      </section>

      <section className="container routeGrid">
        {news.map((item) => (
          <article key={item.id} className="routeCard">
            <span className="routeTag">{formatDate(item.publishedAt)}</span>
            <h3>{item.title}</h3>
            <p>{item.summary || item.body}</p>
          </article>
        ))}
        {news.length === 0 ? (
          <article className="routeCard">
            <span className="routeTag">BELUM ADA DATA</span>
            <h3>Belum ada berita nasional</h3>
            <p>Berita nasional akan tampil otomatis setelah admin menerbitkan konten dari dashboard.</p>
          </article>
        ) : null}
      </section>
    </main>
  );
}
