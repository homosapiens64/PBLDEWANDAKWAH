import { findAboutItem, getAboutItems, profileFallback } from "../../lib/about";

export default async function ProfilePage() {
  const items = await getAboutItems();
  const sections = [
    {
      key: "profil-sejarah",
      eyebrow: "Tentang Kami",
      fallback: profileFallback.sejarah,
    },
    {
      key: "profil-visi-misi",
      eyebrow: "Arah Organisasi",
      fallback: profileFallback.visiMisi,
    },
    {
      key: "profil-cabang-semarang",
      eyebrow: "Cabang Daerah",
      fallback: profileFallback.cabang,
    },
    {
      key: "profil-kontak-lokasi",
      eyebrow: "Hubungi Kami",
      fallback: profileFallback.kontak,
    },
  ];

  return (
    <main className="aboutPublicPage">
      <section className="aboutPublicHero">
        <div className="container">
          <p>DEWAN DA&apos;WAH KOTA SEMARANG</p>
          <h1>Profil Organisasi</h1>
          <span>Jejak perjuangan, arah dakwah, dan informasi organisasi.</span>
        </div>
      </section>

      <section className="container aboutPublicSections">
        {sections.map((section, index) => {
          const item = findAboutItem(items, section.key);
          return (
            <article className={`aboutPublicSection ${index % 2 ? "reverse" : ""}`} key={section.key}>
              {item?.imageUrl ? (
                <div
                  className="aboutPublicImage"
                  role="img"
                  aria-label={item.title}
                  style={{ backgroundImage: `url("${item.imageUrl.replaceAll('"', "%22")}")` }}
                />
              ) : (
                <div className="aboutPublicMark"><span>{String(index + 1).padStart(2, "0")}</span></div>
              )}
              <div>
                <p className="aboutPublicEyebrow">{section.eyebrow}</p>
                <h2>{item?.title || section.fallback.title}</h2>
                <div className="aboutPublicBody">
                  {(item?.body || section.fallback.body).split("\n").map((line, lineIndex) => (
                    <p key={`${section.key}-${lineIndex}`}>{line || "\u00a0"}</p>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
