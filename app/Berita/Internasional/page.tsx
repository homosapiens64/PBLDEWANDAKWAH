const internationalStories = [
  {
    title: "Jaringan Dakwah Digital Menjangkau Komunitas Global",
    summary: "Kolaborasi antarwilayah membuka ruang baru untuk dakwah lintas negara dan budaya.",
  },
  {
    title: "Pertukaran Ilmu Antar-Lembaga Islam di Asia Tenggara",
    summary: "Forum internasional mendorong pertukaran pengalaman pendidikan dan sosial.",
  },
  {
    title: "Relawan Muslim Membangun Program Kemanusiaan Global",
    summary: "Aksi lintas negara memperlihatkan peran dakwah dalam kerja-kerja kemanusiaan modern.",
  },
];

export default function BeritaInternasionalPage() {
  return (
    <main className="page simpleRoutePage">
      <section className="container routeHero">
        <p className="routeEyebrow">Berita</p>
        <h1 className="routeTitle">Internasional</h1>
        <p className="routeLead">
          Ringkasan berita internasional yang menyoroti aktivitas dakwah, jejaring umat,
          dan isu-isu lintas negara yang relevan.
        </p>
      </section>

      <section className="container routeGrid">
        {internationalStories.map((item) => (
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
