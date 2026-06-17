import { getPublishedContentItems } from "../../lib/content";

const activities = [
  {
    title: "Pelatihan Dai Muda di Semarang",
    date: "Agustus 2026",
    description: "Pembinaan dai muda untuk memperkuat da'wah digital dan pelayanan umat di tingkat kota.",
  },
  {
    title: "Bakti Sosial Ramadan",
    date: "Maret 2026",
    description: "Distribusi paket sembako, layanan kesehatan, dan santunan untuk keluarga dhuafa.",
  },
  {
    title: "Kajian Akbar Bersama Ustadz Tamu",
    date: "Januari 2026",
    description: "Rangkaian kajian publik yang mempertemukan pengurus, jamaah, dan relawan da'wah.",
  },
];

export default async function BeritaKegiatanPage() {
  const managedActivities = await getPublishedContentItems("website", "kegiatan");
  const displayedActivities = managedActivities.length
    ? managedActivities.map((item) => ({
        title: item.title,
        date: new Intl.DateTimeFormat("id-ID", {
          month: "long",
          year: "numeric",
        }).format(new Date(item.publishedAt)),
        description: item.summary || item.body,
      }))
    : activities;

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
        {displayedActivities.map((item) => (
          <article key={item.title} className="routeCard">
            <span className="routeTag">{item.date}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
