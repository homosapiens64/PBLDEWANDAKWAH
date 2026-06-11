import { getAboutItems, parseAboutMeta } from "../../lib/about";

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
          <h1>AD &amp; ART</h1>
          <span>Anggaran Dasar dan Anggaran Rumah Tangga Dewan Da&apos;wah Semarang.</span>
        </div>
      </section>

      <section className="container aboutDocumentPublicGrid">
        {groups.map((group) => {
          const documents = items.filter((item) => item.section === group.section);
          return (
            <article className="aboutDocumentPublicCard" key={group.section}>
              <header>
                <span>PDF</span>
                <div>
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
                      fileName: "",
                    });
                    return (
                      <div key={item.id}>
                        <div>
                          <strong>{item.title}</strong>
                          <small>Versi {meta.version} {meta.effectiveDate ? `· ${meta.effectiveDate}` : ""}</small>
                          <p>{item.body}</p>
                        </div>
                        {item.imageUrl ? (
                          <a href={item.imageUrl} target="_blank" rel="noreferrer">Buka PDF</a>
                        ) : <span>Belum ada berkas</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
