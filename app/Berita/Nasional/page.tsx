const nasionalNews = [
  {
    title: "Munas DDII Menetapkan Arah Dakwah Nasional",
    summary: "Rapat kerja memperkuat sinergi cabang daerah dengan program pembinaan yang lebih terukur.",
  },
  {
    title: "Gerakan Sosial Ramadan Menjangkau Banyak Wilayah",
    summary: "Kabar nasional tentang distribusi bantuan, layanan kesehatan, dan edukasi masyarakat.",
  },
  {
    title: "Pelatihan Dai dan Guru Ngaji Meningkat Pesat",
    summary: "Konsolidasi sumber daya dakwah menjadi fokus utama pemberitaan nasional.",
  },
];

export default function BeritaNasionalPage() {
  return (
    <main className="page simpleRoutePage">
      <section className="container routeHero">
        <p className="routeEyebrow">Berita</p>
        <h1 className="routeTitle">Nasional</h1>
        <p className="routeLead">
          Kumpulan berita nasional yang berkaitan dengan pergerakan dakwah, pendidikan umat,
          dan agenda strategis DDII di Indonesia.
        </p>
      </section>

      <section className="container routeGrid">
        {nasionalNews.map((item) => (
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
