import { getPublishedContentItems } from "../../lib/content";

const internationalStories = [
  {
    title: "Jaringan Da'wah Digital Menjangkau Komunitas Global",
    summary: "Kolaborasi antarwilayah membuka ruang baru untuk da'wah lintas negara dan budaya.",
  },
  {
    title: "Pertukaran Ilmu Antar-Lembaga Islam di Asia Tenggara",
    summary: "Forum internasional mendorong pertukaran pengalaman pendidikan dan sosial.",
  },
  {
    title: "Relawan Muslim Membangun Program Kemanusiaan Global",
    summary: "Aksi lintas negara memperlihatkan peran da'wah dalam kerja-kerja kemanusiaan modern.",
  },
];

export default async function BeritaInternasionalPage() {
  const managedStories = await getPublishedContentItems("website", "internasional");
  const displayedStories = managedStories.length
    ? managedStories.map((item) => ({
        title: item.title,
        summary: item.summary || item.body,
      }))
    : internationalStories;

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
        {displayedStories.map((item) => (
          <article key={item.title} className="routeCard">
            <span className="routeTag">INTERNASIONAL</span>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
