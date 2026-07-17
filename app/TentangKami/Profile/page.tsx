import { findAboutItem, getAboutItems, profileFallback } from "../../lib/about";
import InlineContentEditor from "../../components/InlineContentEditor";

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
  const resolvedSections = sections.map((section) => ({
    ...section,
    item: findAboutItem(items, section.key),
  }));
  const featured = resolvedSections[0];
  const supportingSections = resolvedSections.slice(1);

  return (
    <main className="aboutPublicPage">
      <section className="aboutPublicHero">
        <div className="container">
          <p>DEWAN DA&apos;WAH KOTA SEMARANG</p>
          <h1>Profil <span>Organisasi</span></h1>
          <span>Jejak perjuangan, arah dakwah, dan informasi organisasi.</span>
        </div>
      </section>

      <section className="container aboutProfileShowcase">
        <article className="aboutProfileLead">
          <div className="aboutProfileLeadText">
            <p className="aboutPublicEyebrow">{featured.eyebrow}</p>
            <h2>{featured.item?.title || featured.fallback.title}</h2>
            <div className="aboutPublicBody">
              {(featured.item?.body || featured.fallback.body).split("\n").map((line, lineIndex) => (
                <p key={`${featured.key}-${lineIndex}`}>{line || "\u00a0"}</p>
              ))}
            </div>
          </div>
          <aside className="aboutProfileIdentity" aria-label="Identitas organisasi">
            <span>DDI</span>
            <strong>Dewan Da&apos;wah Kota Semarang</strong>
            <p>Dakwah, pendidikan, sosial, dan pelayanan umat berbasis kebutuhan masyarakat.</p>
          </aside>
        </article>

        <div className="aboutProfileCards">
          {supportingSections.map((section) => (
            <article className="aboutProfileInfoCard" key={section.key}>
              <p className="aboutPublicEyebrow">{section.eyebrow}</p>
              <h2>{section.item?.title || section.fallback.title}</h2>
              <div className="aboutPublicBody">
                {(section.item?.body || section.fallback.body).split("\n").map((line, lineIndex) => (
                  <p key={`${section.key}-${lineIndex}`}>{line || "\u00a0"}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Inline Editor untuk Super Admin */}
      <InlineContentEditor items={items} module="tentang-kami" section="tentang-kami" />
    </main>
  );
}
