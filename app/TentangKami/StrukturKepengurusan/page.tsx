import { getAboutItems, parseAboutMeta, structureFallback } from "../../lib/about";
import InlineContentEditor from "../../components/InlineContentEditor";

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getCategoryWeight(type: string): number {
  switch (type) {
    case "Pimpinan Harian": return 1;
    case "Dewan Penasehat": return 2;
    case "Unit Pelaksana": return 3;
    case "Sub Unit": return 4;
    default: return 5;
  }
}

function getUnitRank(title: string): number {
  const t = title.toLowerCase();
  if (t.includes("ketua") && !t.includes("wakil")) return 1;
  if (t.includes("wakil")) return 2;
  if (t.includes("sekretaris")) return 3;
  if (t.includes("bendahara")) return 4;
  if (t.includes("staff") || t.includes("staf")) return 5;
  return 10;
}

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
        leaderPhotoUrl: "",
        unitPhotoUrl: "",
      }),
    }));

  const units = (
    managedUnits.length
      ? managedUnits
      : structureFallback.map((item, index) => ({
          ...item,
          id: `fallback-${index}`,
          leaderPhotoUrl: "",
          unitPhotoUrl: "",
        }))
  ).sort((a, b) => {
    const catWeightA = getCategoryWeight(a.unitType);
    const catWeightB = getCategoryWeight(b.unitType);
    if (catWeightA !== catWeightB) {
      return catWeightA - catWeightB;
    }
    const rankA = getUnitRank(a.title);
    const rankB = getUnitRank(b.title);
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return a.title.localeCompare(b.title);
  });

  const categories = [
    { name: "Pimpinan Harian", type: "Pimpinan Harian" },
    { name: "Dewan Penasehat", type: "Dewan Penasehat" },
    { name: "Unit Pelaksana", type: "Unit Pelaksana" },
    { name: "Sub Unit", type: "Sub Unit" },
  ];

  return (
    <main className="aboutPublicPage">
      <section className="aboutPublicHero compact">
        <div className="container">
          <p>PERIODE 2024 — 2028</p>
          <h1>Struktur <span>Kepengurusan</span></h1>
          <span>Amanah, dakwah, dan khidmah untuk masyarakat Kota Semarang.</span>
        </div>
      </section>

      <section className="container aboutStructurePublic">
        {categories.map((cat) => {
          const categoryUnits = units.filter((u) => u.unitType === cat.type);
          if (categoryUnits.length === 0) return null;

          return (
            <div className="aboutCategoryGroup" key={cat.type}>
              <div className="aboutCategoryHeader">
                <p className="aboutPublicEyebrow">Kepengurusan</p>
                <h2 className="aboutCategoryTitle">{cat.name}</h2>
              </div>

              {cat.type === "Pimpinan Harian" ? (
                <div className="aboutPimpinanWrapper">
                  {categoryUnits.slice(0, 1).map((unit) => {
                    const members = unit.members.split("\n").filter(Boolean);
                    return (
                      <article className="aboutStructureFeatured" key={unit.id}>
                        <div className="aboutStructureFeaturedHead">
                          <p className="aboutPublicEyebrow">{unit.unitType}</p>
                          <h2>{unit.title}</h2>
                          <span>{unit.description}</span>
                        </div>
                        {unit.leader ? (
                          <div className="aboutLeaderFeatured">
                            {unit.leaderPhotoUrl ? (
                              <img src={unit.leaderPhotoUrl} alt={unit.leader} className="aboutLeaderAvatar" />
                            ) : (
                              <span>{getInitials(unit.leader)}</span>
                            )}
                            <div>
                              <small>Ketua / Penanggung Jawab</small>
                              <strong>{unit.leader}</strong>
                            </div>
                          </div>
                        ) : null}
                        {members.length ? (
                          <div className="aboutMemberFeatured">
                            <small>Anggota Pimpinan</small>
                            <div>
                              {members.map((member) => <span key={member}>{member}</span>)}
                            </div>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                  {categoryUnits.length > 1 ? (
                    <div className="aboutStructureGrid" style={{ marginTop: "1.25rem" }}>
                      {categoryUnits.slice(1).map((unit) => {
                        const members = unit.members.split("\n").filter(Boolean);
                        return (
                          <article className="aboutStructureCard" key={unit.id}>
                            <header>
                              {unit.unitPhotoUrl ? (
                                <img src={unit.unitPhotoUrl} alt={unit.title} className="aboutUnitAvatar" />
                              ) : (
                                <span>{getInitials(unit.title)}</span>
                              )}
                              <div>
                                <small>{unit.unitType}</small>
                                <h2>{unit.title}</h2>
                              </div>
                            </header>
                            <p>{unit.description}</p>
                            {unit.leader ? (
                              <div className="aboutLeader">
                                {unit.leaderPhotoUrl ? (
                                  <img src={unit.leaderPhotoUrl} alt={unit.leader} className="aboutLeaderAvatar" />
                                ) : (
                                  <span>{unit.leader.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span>
                                )}
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
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="aboutStructureGrid">
                  {categoryUnits.map((unit) => {
                    const members = unit.members.split("\n").filter(Boolean);
                    return (
                      <article className="aboutStructureCard" key={unit.id}>
                        <header>
                          {unit.unitPhotoUrl ? (
                            <img src={unit.unitPhotoUrl} alt={unit.title} className="aboutUnitAvatar" />
                          ) : (
                            <span>{getInitials(unit.title)}</span>
                          )}
                          <div>
                            <small>{unit.unitType}</small>
                            <h2>{unit.title}</h2>
                          </div>
                        </header>
                        <p>{unit.description}</p>
                        {unit.leader ? (
                          <div className="aboutLeader">
                            {unit.leaderPhotoUrl ? (
                              <img src={unit.leaderPhotoUrl} alt={unit.leader} className="aboutLeaderAvatar" />
                            ) : (
                              <span>{unit.leader.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span>
                            )}
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
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Inline Editor untuk Super Admin */}
      <InlineContentEditor items={items} module="tentang-kami" section="tentang-kami" />
    </main>
  );
}
