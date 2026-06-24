import Link from "next/link";
import { getPublishedContentItems, type PublicContentItem } from "../../lib/content";
import InlineContentEditor from "../../components/InlineContentEditor";

type NewsCardItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  author: string;
  readMinutes: number;
};

const sectionMeta: Record<string, { color: string; href: string; label: string; summary: string }> = {
  internasional: {
    color: "#f0b84f",
    href: "/Berita/Internasional",
    label: "Internasional",
    summary: "Berita luar negeri",
  },
  kegiatan: {
    color: "#b46df1",
    href: "/Berita/Kegiatan",
    label: "Kegiatan DDI",
    summary: "Program & aktivitas",
  },
  nasional: {
    color: "#4f7cf7",
    href: "/Berita/Nasional",
    label: "Nasional",
    summary: "Berita dalam negeri",
  },
  terkini: {
    color: "#2ab7a4",
    href: "/Berita/Terkini",
    label: "Terkini",
    summary: "Informasi terbaru",
  },
};

function sectionLabel(value: string) {
  return sectionMeta[value]?.label ?? value.replaceAll("-", " ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function readingMinutes(body: string) {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 200));
}

function toNewsCard(item: PublicContentItem): NewsCardItem {
  return {
    id: item.id,
    title: item.title,
    category: sectionLabel(item.section).toLocaleUpperCase("id-ID"),
    date: formatDate(item.publishedAt).toLocaleUpperCase("id-ID"),
    excerpt: item.summary || item.body,
    image: item.imageUrl,
    author: item.authorName,
    readMinutes: readingMinutes(item.body),
  };
}

function EmptyNews({ title }: { title: string }) {
  return (
    <div className="routeCard">
      <span className="routeTag">BELUM ADA DATA</span>
      <h3>{title}</h3>
      <p>Berita akan tampil otomatis setelah admin menerbitkan konten dari dashboard.</p>
    </div>
  );
}

export default async function BeritaTerkiniPage() {
  const managedItems = await getPublishedContentItems("website");
  const featured = managedItems[0];
  const nasionalItems = managedItems.filter((item) => item.section === "nasional").map(toNewsCard);
  const internasionalItems = managedItems.filter((item) => item.section === "internasional").map(toNewsCard);
  const populer = managedItems.slice(0, 4);
  const managedTags = [...new Set(
    managedItems.flatMap((item) =>
      item.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    ),
  )];
  const categoryCounts = managedItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.section] = (acc[item.section] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="page">
      <section className="hero container">
        <p className="heroEyebrow">INFORMASI TERKINI</p>
        <h1 className="heroTitle">BERITA &amp; KEGIATAN</h1>

        {featured ? (
          <article
            className="heroCard"
            style={{
              backgroundImage:
                `linear-gradient(90deg, rgba(17,35,45,0.54) 0%, rgba(17,35,45,0.35) 100%), url('${featured.imageUrl || "/logo.png"}')`,
            }}
          >
            <div className="heroOverlay">
              <span className="pill">{sectionLabel(featured.section).toLocaleUpperCase("id-ID")}</span>
              <h2>{featured.title}</h2>
              <p>
                <span>By {featured.authorName}</span>
                <span>{formatDate(featured.publishedAt)}</span>
                <span>{readingMinutes(featured.body)} Mins</span>
              </p>
            </div>
          </article>
        ) : (
          <div className="routeGrid">
            <EmptyNews title="Belum ada berita terbit" />
          </div>
        )}
      </section>

      <section className="container contentGrid">
        <div className="mainColumn">
          <div className="sectionHead">
            <h3>Berita Nasional</h3>
            <Link href="/Berita/Nasional">VIEW ALL -&gt;</Link>
          </div>

          <div className="cardsGrid">
            {nasionalItems.length ? nasionalItems.map((item) => (
              <article key={item.id} className="newsCard">
                <div
                  className="newsImage"
                  style={item.image ? { backgroundImage: `url('${item.image.replaceAll("'", "%27")}')` } : undefined}
                />
                <div className="newsBody">
                  <span className="pill">{item.category}</span>
                  <h4>{item.title}</h4>
                  <div className="metaRow">
                    <span>{item.date}</span>
                    <span>{item.readMinutes} MINS</span>
                  </div>
                  <p>{item.excerpt}</p>
                </div>
              </article>
            )) : <EmptyNews title="Belum ada berita nasional" />}
          </div>
        </div>

        <aside className="sidebar">
          <section className="sideCard">
            <h4>Kategori Berita</h4>
            <div className="categoryList">
              <Link className="categoryItem" href="/Berita/Terkini">
                <div className="categoryIcon" style={{ background: "#2ab7a4" }} />
                <div>
                  <strong>Semua Berita</strong>
                  <small>Semua kategori</small>
                </div>
                <span>{managedItems.length}</span>
              </Link>
              {Object.entries(sectionMeta).map(([section, meta]) => (
                <Link className="categoryItem" href={meta.href} key={section}>
                  <div className="categoryIcon" style={{ background: meta.color }} />
                  <div>
                    <strong>{meta.label}</strong>
                    <small>{meta.summary}</small>
                  </div>
                  <span>{categoryCounts[section] ?? 0}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="sideCard">
            <h4>Berita Terpopuler</h4>
            <ol className="popularList">
              {populer.map((item, index) => (
                <li key={item.id}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{sectionLabel(item.section)} - {formatDate(item.publishedAt)}</small>
                  </div>
                </li>
              ))}
              {populer.length === 0 ? (
                <li>
                  <span>0</span>
                  <div>
                    <strong>Belum ada berita</strong>
                    <small>Terbitkan konten dari dashboard</small>
                  </div>
                </li>
              ) : null}
            </ol>
          </section>

          <section className="sideCard">
            <h4>Topik Berita</h4>
            <div className="tagCloud">
              {managedTags.length ? managedTags.map((tag) => (
                <span key={tag}>{tag}</span>
              )) : <span>Belum ada topik</span>}
            </div>
          </section>
        </aside>
      </section>

      <section className="container internationalSection">
        <div className="sectionHead">
          <h3>Berita Internasional</h3>
          <Link href="/Berita/Internasional">VIEW ALL -&gt;</Link>
        </div>
        <div className="internationalGrid">
          {internasionalItems.length ? internasionalItems.map((item, idx) => (
            <article key={item.id} className={idx === 0 ? "intlFeature" : "intlCard"}>
              <div
                className={idx === 0 ? "intlFeatureImage" : "intlCardImage"}
                style={item.image ? { backgroundImage: `url('${item.image.replaceAll("'", "%27")}')` } : undefined}
              />
              <div className="intlBody">
                <span className="pill">{item.category}</span>
                <h4>{item.title}</h4>
                <div className="metaRow">
                  <span>{item.date}</span>
                </div>
                {idx === 0 && <p>{item.excerpt}</p>}
              </div>
            </article>
          )) : <EmptyNews title="Belum ada berita internasional" />}
        </div>
      </section>

      <InlineContentEditor items={managedItems} module="website" section="website" />
    </main>
  );
}
