import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, UserRound } from "lucide-react";
import type { PublicContentItem } from "../lib/content";
import styles from "./BeritaPublicView.module.css";

type NewsSection = "terkini" | "nasional" | "internasional" | "kegiatan";

type SectionMeta = {
  color: string;
  href: string;
  label: string;
  lead: string;
  summary: string;
};

export const sectionMeta: Record<NewsSection, SectionMeta> = {
  terkini: {
    color: "#2ab7a4",
    href: "/Berita/Terkini",
    label: "Terkini",
    lead: "Kabar terbaru dari kanal nasional, internasional, dan kegiatan Dewan Da'wah.",
    summary: "Informasi terbaru",
  },
  nasional: {
    color: "#4f7cf7",
    href: "/Berita/Nasional",
    label: "Nasional",
    lead: "Kumpulan berita nasional yang berkaitan dengan pergerakan da'wah, pendidikan umat, dan agenda strategis DDII di Indonesia.",
    summary: "Berita dalam negeri",
  },
  internasional: {
    color: "#f0b84f",
    href: "/Berita/Internasional",
    label: "Internasional",
    lead: "Ringkasan berita internasional yang menyoroti aktivitas da'wah, jejaring umat, dan isu lintas negara yang relevan.",
    summary: "Berita luar negeri",
  },
  kegiatan: {
    color: "#b46df1",
    href: "/Berita/Kegiatan",
    label: "Kegiatan",
    lead: "Agenda, dokumentasi, dan laporan kegiatan Dewan Da'wah Kota Semarang untuk jamaah dan relawan.",
    summary: "Program & aktivitas",
  },
};

const visibleSections: NewsSection[] = ["terkini", "nasional", "internasional", "kegiatan"];

export function sectionLabel(value: string) {
  return sectionMeta[value as NewsSection]?.label ?? value.replaceAll("-", " ");
}

export function formatDate(value: string, variant: "short" | "long" = "long") {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: variant === "short" ? "short" : "long",
    year: "numeric",
  }).format(new Date(value));
}

export function readingMinutes(body: string) {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 200));
}

function getExcerpt(item: PublicContentItem, maxLength = 180) {
  const source = item.summary || item.body;
  return source.length > maxLength ? `${source.slice(0, maxLength - 3).trimEnd()}...` : source;
}

function imageStyle(imageUrl: string) {
  if (!imageUrl) return undefined;
  const cleanUrl = imageUrl.replace(/\s/g, "").replaceAll('"', "%22");
  return { backgroundImage: `url("${cleanUrl}")` };
}

function EmptyNews({ title }: { title: string }) {
  return (
    <div className={styles.emptyNews}>
      <span>BELUM ADA DATA</span>
      <h3>{title}</h3>
      <p>Berita akan tampil otomatis setelah admin menerbitkan konten dari dashboard internal.</p>
    </div>
  );
}

function NewsCard({ item }: { item: PublicContentItem }) {
  const meta = sectionMeta[item.section as NewsSection];

  return (
    <Link className={styles.newsCard} href={`/Berita/baca/${item.id}`}>
      <div
        className={`${styles.newsImage} ${item.imageUrl ? "" : styles.emptyImage}`}
        style={imageStyle(item.imageUrl || "/logo.png")}
      >
        <span className={styles.newsBadge} style={meta ? { "--section-color": meta.color } as React.CSSProperties : undefined}>
          {sectionLabel(item.section)}
        </span>
      </div>
      <div className={styles.newsBody}>
        <h4>{item.title}</h4>
        <div className={styles.metaRow}>
          <span><CalendarDays aria-hidden="true" /> {formatDate(item.publishedAt, "short")}</span>
          <span><Clock3 aria-hidden="true" /> {readingMinutes(item.body)} menit baca</span>
        </div>
        <p>{getExcerpt(item)}</p>
        <span className={styles.readMore}>Baca berita <ArrowUpRight aria-hidden="true" /></span>
      </div>
    </Link>
  );
}

function FeaturedNewsCard({ item }: { item: PublicContentItem }) {
  const meta = sectionMeta[item.section as NewsSection];

  return (
    <Link
      className={`${styles.leadCard} ${item.imageUrl ? "" : styles.emptyLead}`}
      href={`/Berita/baca/${item.id}`}
      style={imageStyle(item.imageUrl || "/logo.png")}
    >
      <div className={styles.leadBackdrop}>
        <span className={styles.newsBadge} style={meta ? { "--section-color": meta.color } as React.CSSProperties : undefined}>
          {sectionLabel(item.section)}
        </span>
      </div>
      <div className={styles.leadBody}>
        <span className={styles.featuredKicker}>Sorotan terbaru</span>
        <h4>{item.title}</h4>
        <div className={styles.metaRow}>
          <span><UserRound aria-hidden="true" /> {item.authorName || "Tim Redaksi"}</span>
          <span><CalendarDays aria-hidden="true" /> {formatDate(item.publishedAt, "short")}</span>
          <span><Clock3 aria-hidden="true" /> {readingMinutes(item.body)} menit baca</span>
        </div>
        <p>{getExcerpt(item, 220)}</p>
        <span className={styles.leadAction}>Baca selengkapnya <ArrowUpRight aria-hidden="true" /></span>
      </div>
    </Link>
  );
}

function Sidebar({
  allItems,
  currentSection,
}: {
  allItems: PublicContentItem[];
  currentSection: NewsSection;
}) {
  const categoryCounts = allItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.section] = (acc[item.section] ?? 0) + 1;
    return acc;
  }, {});
  const popular = allItems.slice(0, 5);
  const tags = [...new Set(
    allItems.flatMap((item) => item.tags.split(",").map((tag) => tag.trim()).filter(Boolean)),
  )].slice(0, 14);

  return (
    <aside className={styles.sidebar}>
      <section className={styles.sideCard}>
        <h4>Kategori Berita</h4>
        <div className={styles.categoryList}>
          <Link className={styles.categoryItem} href="/Berita/Terkini">
            <div className={styles.categoryIcon} style={{ background: sectionMeta.terkini.color }} />
            <div>
              <strong>Semua Berita</strong>
              <small>Semua kategori</small>
            </div>
            <span>{allItems.length}</span>
          </Link>
          {visibleSections.map((section) => {
            const itemMeta = sectionMeta[section];
            return (
              <Link
                className={`${styles.categoryItem}${currentSection === section ? ` ${styles.active}` : ""}`}
                href={itemMeta.href}
                key={section}
              >
                <div className={styles.categoryIcon} style={{ background: itemMeta.color }} />
                <div>
                  <strong>{itemMeta.label}</strong>
                  <small>{itemMeta.summary}</small>
                </div>
                <span>{categoryCounts[section] ?? 0}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.sideCard}>
        <h4>Berita Terpopuler</h4>
        <ol className={styles.popularList}>
          {popular.map((item, index) => (
            <li key={item.id}>
              <span>{index + 1}</span>
              <div>
                <Link href={`/Berita/baca/${item.id}`}>{item.title}</Link>
                <small>{sectionLabel(item.section)} - {formatDate(item.publishedAt, "short")}</small>
              </div>
            </li>
          ))}
          {popular.length === 0 ? (
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

      <section className={styles.sideCard}>
        <h4>Topik Berita</h4>
        <div className={styles.tagCloud}>
          {tags.length ? tags.map((tag) => <span key={tag}>{tag}</span>) : <span>Belum ada topik</span>}
        </div>
      </section>
    </aside>
  );
}

export default function BeritaPublicView({
  allItems,
  currentSection = "terkini",
}: {
  allItems: PublicContentItem[];
  currentSection?: NewsSection;
}) {
  const isTerkini = currentSection === "terkini";
  const meta = sectionMeta[currentSection];
  const pageItems = isTerkini
    ? allItems.filter((item) => visibleSections.includes(item.section as NewsSection))
    : allItems.filter((item) => item.section === currentSection);
  const featured = pageItems[0] ?? null;
  const highlights = pageItems.slice(1, 3);
  const remaining = pageItems.slice(3);

  return (
    <main
      className={styles.page}
      style={{
        "--section-color": meta.color,
      } as React.CSSProperties}
    >
      <section className={`${styles.hero} container`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>BERITA {meta.label.toLocaleUpperCase("id-ID")}</p>
          <h1>{isTerkini ? "Berita & Kegiatan" : `Berita ${meta.label}`}</h1>
          <p>{meta.lead}</p>
        </div>
      </section>

      <section className={`${styles.shell} container`}>
        <div>
          <div className={styles.sectionHead}>
            <span>Pilihan redaksi</span>
          </div>

          <div className={styles.magazineLayout}>
            {featured ? <FeaturedNewsCard item={featured} /> : null}
            {highlights.length ? (
              <div className={styles.highlightStack}>
                {highlights.map((item) => <NewsCard item={item} key={item.id} />)}
              </div>
            ) : null}
            {pageItems.length === 0 ? (
              <EmptyNews title={`Belum ada berita ${meta.label.toLowerCase()}`} />
            ) : null}
          </div>

          {remaining.length ? (
            <div className={styles.archiveGrid}>
              {remaining.map((item) => <NewsCard item={item} key={item.id} />)}
            </div>
          ) : null}
        </div>

        <Sidebar allItems={allItems} currentSection={currentSection} />
      </section>
    </main>
  );
}
