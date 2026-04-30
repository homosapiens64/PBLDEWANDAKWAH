const programs = [
  {
    title: "Pembinaan Dai",
    points: ["Pelatihan berkala", "Mentoring lapangan", "Penguatan dakwah digital"],
  },
  {
    title: "Pendidikan Umat",
    points: ["Kajian rutin", "Beasiswa santri", "Program literasi Islam"],
  },
  {
    title: "Sosial Kemanusiaan",
    points: ["Bakti sosial", "Layanan dhuafa", "Penguatan relawan daerah"],
  },
];

export default function ProgramPage() {
  return (
    <main className="page simpleRoutePage">
      <section className="container routeHero">
        <p className="routeEyebrow">Tentang Kami</p>
        <h1 className="routeTitle">Program</h1>
        <p className="routeLead">
          Program kerja DDII disusun untuk menjawab kebutuhan dakwah, pendidikan, dan pelayanan
          sosial yang nyata di tingkat masyarakat.
        </p>
      </section>

      <section className="container routeGrid">
        {programs.map((item) => (
          <article key={item.title} className="routeCard">
            <h3>{item.title}</h3>
            <ul className="routeList">
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
