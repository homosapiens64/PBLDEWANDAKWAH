const sections = [
  {
    title: "Anggaran Dasar",
    text: "Menjelaskan landasan, tujuan, dan prinsip organisasi yang menjadi acuan gerak dakwah DDII.",
  },
  {
    title: "Anggaran Rumah Tangga",
    text: "Mengatur tata kelola internal, kewenangan pengurus, dan mekanisme kerja lembaga.",
  },
  {
    title: "Dokumen Pendukung",
    text: "Rangkuman dokumen administrasi untuk kebutuhan organisasi dan koordinasi cabang.",
  },
];

export default function AdDanArtPage() {
  return (
    <main className="page simpleRoutePage">
      <section className="container routeHero">
        <p className="routeEyebrow">Tentang Kami</p>
        <h1 className="routeTitle">AD dan ART</h1>
        <p className="routeLead">
          Halaman ini memuat ringkasan dasar organisasi dan aturan rumah tangga yang menjadi
          acuan resmi Dewan Dakwah.
        </p>
      </section>

      <section className="container routeGrid">
        {sections.map((item) => (
          <article key={item.title} className="routeCard">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
