import { getAboutItems, parseAboutMeta, structureFallback } from "../../lib/about";

export default async function StrukturKepengurusanPage() {
  const items = await getAboutItems();
  const managedUnits = items
    .filter((item) => item.section === "struktur-unit")
    .map((item) => ({
      id: String(item.id),
      title: item.title,
      description: item.body,
      ...parseAboutMeta(item.summary, {
        unitType: "Unit Pelaksana",
        leader: "",
        members: "",
        order: "0",
      }),
    }))
    .sort((a, b) => Number(a.order) - Number(b.order));
  const units = managedUnits.length
    ? managedUnits
    : structureFallback.map((item, index) => ({ ...item, id: `fallback-${index}` }));

  return (
    <main className="aboutPublicPage">
      <section className="aboutPublicHero compact">
        <div className="container">
          <p>PERIODE 2024 — 2028</p>
          <h1>Struktur Kepengurusan</h1>
          <span>Amanah, dakwah, dan khidmah untuk masyarakat Kota Semarang.</span>
        </div>
      </section>

      <section className="container aboutStructureGrid">
        {units.map((unit, index) => {
          const members = unit.members.split("\n").filter(Boolean);
          return (
            <article className="aboutStructureCard" key={unit.id}>
              <header>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>{unit.unitType}</small>
                  <h2>{unit.title}</h2>
                </div>
              </header>
              <p>{unit.description}</p>
              {unit.leader ? (
                <div className="aboutLeader">
                  <span>{unit.leader.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span>
                  <div><small>Ketua / Penanggung Jawab</small><strong>{unit.leader}</strong></div>
                </div>
              ) : null}
              {members.length ? (
                <div className="aboutMemberList">
                  <small>Anggota</small>
                  {members.map((member) => <span key={member}>{member}</span>)}
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </main>
  );
}
