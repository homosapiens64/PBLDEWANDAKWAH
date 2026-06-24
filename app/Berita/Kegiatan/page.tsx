import { getPublishedContentItems } from "../../lib/content";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BeritaKegiatanPage() {
  const activities = await getPublishedContentItems("website", "kegiatan");

  return (
    <main className="page simpleRoutePage">
      <section className="container routeHero">
        <p className="routeEyebrow">Berita</p>
        <h1 className="routeTitle">Kegiatan</h1>
        <p className="routeLead">
          Halaman ini menampilkan agenda, dokumentasi, dan laporan kegiatan Dewan Da&apos;wah
          Kota Semarang yang paling relevan untuk jamaah dan relawan.
        </p>
      </section>

      <section className="container routeGrid">
        {activities.map((item) => (
          <article key={item.id} className="routeCard">
            <span className="routeTag">{formatDate(item.publishedAt)}</span>
            <h3>{item.title}</h3>
            <p>{item.summary || item.body}</p>
          </article>
        ))}
        {activities.length === 0 ? (
          <article className="routeCard">
            <span className="routeTag">BELUM ADA DATA</span>
            <h3>Belum ada berita kegiatan</h3>
            <p>Berita kegiatan akan tampil otomatis setelah admin menerbitkan konten dari dashboard.</p>
          </article>
        ) : null}
      </section>
    </main>
  );
}
