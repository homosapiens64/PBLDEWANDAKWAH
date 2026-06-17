import { getPublishedContentItems } from "../../lib/content";

const nasionalNews = [
  {
    title: "Munas DDII Menetapkan Arah Da'wah Nasional",
    summary: "Rapat kerja memperkuat sinergi cabang daerah dengan program pembinaan yang lebih terukur.",
  },
  {
    title: "Gerakan Sosial Ramadan Menjangkau Banyak Wilayah",
    summary: "Kabar nasional tentang distribusi bantuan, layanan kesehatan, dan edukasi masyarakat.",
  },
  {
    title: "Pelatihan Dai dan Guru Ngaji Meningkat Pesat",
    summary: "Konsolidasi sumber daya da'wah menjadi fokus utama pemberitaan nasional.",
  },
];

export default async function BeritaNasionalPage() {
  const managedNews = await getPublishedContentItems("website", "nasional");
  const displayedNews = managedNews.length
    ? managedNews.map((item) => ({
        title: item.title,
        summary: item.summary || item.body,
      }))
    : nasionalNews;

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
        {displayedNews.map((item) => (
          <article key={item.title} className="routeCard">
            <span className="routeTag">NASIONAL</span>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
