"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublicContentItem } from "../lib/content";

type KajianItem = {
  author: string;
  date: string;
  excerpt: string;
  id: number;
  imageUrl: string;
  readMinutes: number;
  section: string;
  sectionLabel: string;
  title: string;
};

const sections = [
  { slug: "tauhid", title: "Materi Tauhid" },
  { slug: "artikel-kajian", title: "Artikel Kajian" },
  { slug: "tazkiyah", title: "Materi Tazkiyah" },
  { slug: "khutbah", title: "Materi Khutbah" },
];

export const kajianSectionLabels: Record<string, string> = {
  "artikel-kajian": "Artikel Kajian",
  khutbah: "Khutbah",
  tauhid: "Tauhid",
  tazkiyah: "Tazkiyah",
};

export function formatKajianDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function kajianReadingMinutes(body: string) {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 200));
}

function toExcerpt(item: PublicContentItem) {
  const source = item.summary || item.body;
  return source.length > 170 ? `${source.slice(0, 167).trimEnd()}...` : source;
}

function toKajianItem(item: PublicContentItem): KajianItem {
  return {
    author: item.authorName || "Tim Kajian",
    date: formatKajianDate(item.publishedAt),
    excerpt: toExcerpt(item),
    id: item.id,
    imageUrl: item.imageUrl,
    readMinutes: kajianReadingMinutes(item.body),
    section: item.section,
    sectionLabel: kajianSectionLabels[item.section] ?? item.section.replaceAll("-", " "),
    title: item.title,
  };
}

function Card({ item }: { item: KajianItem }) {
  return (
    <article className="kajianPublicCard">
      <Link
        className={item.imageUrl ? "kajianPublicCover" : "kajianPublicCover empty"}
        href={`/Kajian/baca/${item.id}`}
        style={item.imageUrl ? { backgroundImage: `url("${item.imageUrl.replaceAll('"', "%22")}")` } : undefined}
      >
        <span>{item.sectionLabel}</span>
      </Link>
      <div className="kajianPublicCardBody">
        <div className="kajianPublicAuthor">
          <span>{item.author.slice(0, 1).toLocaleUpperCase("id-ID")}</span>
          <div>
            <strong>{item.author}</strong>
            <small>{item.date} - {item.readMinutes} menit baca</small>
          </div>
        </div>
        <h4>
          <Link href={`/Kajian/baca/${item.id}`}>{item.title}</Link>
        </h4>
        <p>{item.excerpt}</p>
        <Link className="kajianPublicButton" href={`/Kajian/baca/${item.id}`}>
          Selengkapnya
        </Link>
      </div>
    </article>
  );
}

function SectionPager({
  emptyText,
  items,
  pageSize = 3,
}: {
  emptyText: string;
  items: KajianItem[];
  pageSize?: number;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = page * pageSize;
  const visible = items.slice(start, start + pageSize);

  if (items.length === 0) {
    return (
      <div className="kajianPublicEmpty">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="kajianPublicPager">
      <div className="kajianPublicGrid">
        {visible.map((item) => (
          <Card item={item} key={item.id} />
        ))}
      </div>

      <div className="kajianPagerControls">
        <button
          onClick={() => setPage((current) => Math.max(0, current - 1))}
          disabled={page === 0}
          type="button"
        >
          Back
        </button>
        <span>Halaman {page + 1} dari {totalPages}</span>
        <button
          onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
          disabled={page >= totalPages - 1}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function KajianClient({ items }: { items: PublicContentItem[] }) {
  const mappedItems = useMemo(() => items.map(toKajianItem), [items]);
  const grouped = useMemo(() => {
    return sections.reduce<Record<string, KajianItem[]>>((result, section) => {
      result[section.slug] = mappedItems.filter((item) => item.section === section.slug);
      return result;
    }, {});
  }, [mappedItems]);

  const featured = mappedItems.find((item) => item.section === "artikel-kajian") ?? mappedItems[0] ?? null;

  return (
    <main className="kajianPublicPage">
      <section className="container kajianPublicHero">
        <p>ARTIKEL ISLAMI</p>
        <h1>Kajian &amp; Materi Da&apos;wah</h1>
      </section>

      <section className="container">
        {featured ? (
          <article className="kajianFeatured">
            <div className="kajianFeaturedCopy">
              <span>{featured.sectionLabel}</span>
              <h2>{featured.title}</h2>
              <div className="kajianFeaturedMeta">
                {featured.author} - {featured.date} - {featured.readMinutes} menit baca
              </div>
              <p>{featured.excerpt}</p>
              <Link className="kajianPublicButton" href={`/Kajian/baca/${featured.id}`}>
                Baca Kajian
              </Link>
            </div>
            <Link
              className={featured.imageUrl ? "kajianFeaturedImage" : "kajianFeaturedImage empty"}
              href={`/Kajian/baca/${featured.id}`}
              style={featured.imageUrl ? { backgroundImage: `url("${featured.imageUrl.replaceAll('"', "%22")}")` } : undefined}
            />
          </article>
        ) : (
          <div className="kajianPublicEmpty">
            Belum ada materi kajian yang diterbitkan dari database.
          </div>
        )}

        {sections.map((section) => (
          <section className="kajianPublicSection" key={section.slug}>
            <div className="sectionHead">
              <h3>{section.title}</h3>
            </div>
            <SectionPager
              emptyText={`Belum ada ${section.title.toLowerCase()} yang diterbitkan.`}
              items={grouped[section.slug] ?? []}
              pageSize={3}
            />
          </section>
        ))}
      </section>
    </main>
  );
}
