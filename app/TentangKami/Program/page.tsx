import { getAboutItems, parseAboutMeta, programFallback } from "../../lib/about";
import InlineContentEditor from "../../components/InlineContentEditor";

export default async function ProgramPage() {
  const items = await getAboutItems();
  const managedPrograms = items
    .filter((item) => item.section === "program-kerja")
    .map((item) => ({
      id: String(item.id),
      title: item.title,
      description: item.body,
      ...parseAboutMeta(item.summary, {
        status: "aktif",
        startDate: "",
        endDate: "",
      }),
    }));
  const programs = managedPrograms.length
    ? managedPrograms
    : programFallback.map((item, index) => ({ ...item, id: `fallback-${index}` }));

  return (
    <main className="aboutPublicPage">
      <section className="aboutPublicHero compact">
        <div className="container">
          <p>GERAKAN &amp; PELAYANAN</p>
          <h1>Program <span>Kerja</span></h1>
          <span>Program dakwah, pendidikan, dan sosial yang dirancang untuk kebutuhan umat.</span>
        </div>
      </section>

      <section className="container aboutProgramPublic">
        <div className="aboutProgramPublicStats">
          <article><strong>{programs.length}</strong><span>Total Program</span></article>
          <article><strong>{programs.filter((item) => item.status === "aktif").length}</strong><span>Aktif</span></article>
          <article><strong>{programs.filter((item) => item.status === "selesai").length}</strong><span>Selesai</span></article>
        </div>
        <div className="aboutProgramPublicGrid">
          {programs.map((program, index) => (
            <article key={program.id}>
              <span className={`aboutProgramPublicStatus ${program.status}`}>{program.status}</span>
              <small>PROGRAM {String(index + 1).padStart(2, "0")}</small>
              <h2>{program.title}</h2>
              <p>{program.description}</p>
              {program.startDate || program.endDate ? (
                <footer>{program.startDate || "—"} {program.endDate ? `sampai ${program.endDate}` : ""}</footer>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {/* Inline Editor untuk Super Admin */}
      <InlineContentEditor items={items} module="tentang-kami" section="tentang-kami" />
    </main>
  );
}
