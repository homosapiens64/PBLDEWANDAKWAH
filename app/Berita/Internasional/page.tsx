import { getPublishedContentItems } from "../../lib/content";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BeritaInternasionalPage() {
  const stories = await getPublishedContentItems("website", "internasional");

  return (
    <main className="page simpleRoutePage">
      <section className="container routeHero">
        <p className="routeEyebrow">Berita</p>
        <h1 className="routeTitle">Internasional</h1>
        <p className="routeLead">
          Ringkasan berita internasional yang menyoroti aktivitas da&apos;wah, jejaring umat,
          dan isu-isu lintas negara yang relevan.
        </p>
      </section>

      <section className="container routeGrid">
        {stories.map((item) => (
          <article key={item.id} className="routeCard">
            <span className="routeTag">{formatDate(item.publishedAt)}</span>
            <h3>{item.title}</h3>
            <p>{item.summary || item.body}</p>
          </article>
        ))}
        {stories.length === 0 ? (
          <article className="routeCard">
            <span className="routeTag">BELUM ADA DATA</span>
            <h3>Belum ada berita internasional</h3>
            <p>Berita internasional akan tampil otomatis setelah admin menerbitkan konten dari dashboard.</p>
          </article>
        ) : null}
      </section>
    </main>
  );
}
