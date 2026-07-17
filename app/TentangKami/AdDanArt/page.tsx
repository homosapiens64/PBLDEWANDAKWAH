import { getAboutItems, parseAboutMeta } from "../../lib/about";
import InlineContentEditor from "../../components/InlineContentEditor";

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function AdDanArtPage() {
  const items = await getAboutItems();
  const groups = [
    {
      section: "ad-document",
      title: "Anggaran Dasar (AD)",
      description: "Landasan utama organisasi, tujuan, kedudukan, dan ketentuan pokok Dewan Da'wah.",
    },
    {
      section: "art-document",
      title: "Anggaran Rumah Tangga (ART)",
      description: "Pedoman pelaksanaan organisasi dan tata kerja kepengurusan Dewan Da'wah.",
    },
  ];

  return (
    <main className="aboutPublicPage">
      <section className="aboutPublicHero compact">
        <div className="container">
          <p>DOKUMEN ORGANISASI</p>
          <h1>AD &amp; <span>ART</span></h1>
          <span>Anggaran Dasar dan Anggaran Rumah Tangga Dewan Da&apos;wah Semarang.</span>
        </div>
      </section>

      <section className="container aboutDocumentPublicGrid">
        {groups.map((group) => {
          const documents = items
            .filter((item) => item.section === group.section)
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

          return (
            <article className="aboutDocumentPublicCard" key={group.section}>
              <header>
                <div>
                  <span className="aboutDocumentPublicLabel">Dokumen resmi</span>
                  <h2>{group.title}</h2>
                  <p>{group.description}</p>
                </div>
              </header>

              {documents.length === 0 ? (
                <div className="aboutPublicEmpty">Dokumen belum diterbitkan.</div>
              ) : (
                <div className="aboutPublicDocumentList">
                  {documents.map((item) => {
                    const meta = parseAboutMeta(item.summary, {
                      version: "-",
                      effectiveDate: "",
                    });

                    return (
                      <div className={item.imageUrl ? "isAvailable" : "isMissing"} key={item.id}>
                        <div className="aboutPublicDocumentInfo">
                          <span>{item.imageUrl ? "Tersedia" : "Perlu upload ulang"}</span>
                          <strong>{item.title}</strong>
                          <small>
                            Versi {meta.version}
                            {meta.effectiveDate ? ` - Berlaku ${formatDate(meta.effectiveDate)}` : ""}
                          </small>
                          <p>{item.body}</p>
                        </div>

                        {item.imageUrl ? (
                          <a className="aboutPublicDocumentAction" href={item.imageUrl} target="_blank" rel="noreferrer">
                            Buka PDF
                          </a>
                        ) : (
                          <span className="aboutPublicFileNotice">Upload ulang PDF</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </section>

      <InlineContentEditor items={items} module="tentang-kami" section="tentang-kami" />
    </main>
  );
}
