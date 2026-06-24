"use client";

import { useMemo, useState } from "react";
import type { PublicContentItem } from "../lib/content";

type KajianItem = {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  sectionLabel: string;
};

const sections = [
  { slug: "tauhid", title: "Materi Tauhid" },
  { slug: "artikel-kajian", title: "Materi Ekonomi Islam" },
  { slug: "tazkiyah", title: "Materi Tazkiyah" },
  { slug: "khutbah", title: "Materi Khutbah" },
];

const sectionLabels: Record<string, string> = {
  "artikel-kajian": "Artikel Kajian",
  khutbah: "Khutbah",
  tauhid: "Tauhid",
  tazkiyah: "Tazkiyah",
};

function formatMonth(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function toExcerpt(item: PublicContentItem) {
  const source = item.summary || item.body;
  return source.length > 150 ? `${source.slice(0, 147).trim()}...` : source;
}

function toKajianItem(item: PublicContentItem): KajianItem {
  return {
    id: item.id,
    title: item.title,
    author: item.authorName,
    date: formatMonth(item.publishedAt),
    excerpt: toExcerpt(item),
    imageUrl: item.imageUrl,
    sectionLabel: sectionLabels[item.section] ?? item.section.replaceAll("-", " "),
  };
}

function Card({ item }: { item: KajianItem }) {
  return (
    <article style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px #0001" }}>
      <div
        style={{
          width: "100%",
          height: 160,
          background: item.imageUrl ? `center / cover url("${item.imageUrl.replaceAll('"', "%22")}")` : "#e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {!item.imageUrl ? <span style={{ color: "#999" }}>Gambar</span> : null}
        <span style={{ position: "absolute", top: 12, left: 12, background: "#333", color: "#fff", padding: "2px 8px", fontSize: 12, borderRadius: 4 }}>
          {item.sectionLabel}
        </span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, background: "#e0e0e0", borderRadius: "50%" }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{item.author}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{item.date}</div>
          </div>
        </div>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: "#333", marginBottom: 8 }}>{item.title}</h4>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>{item.excerpt}</p>
        <button style={{ background: "#333", color: "#fff", border: "none", padding: "6px 16px", borderRadius: 4, fontSize: 13, cursor: "pointer" }}>
          Selengkapnya
        </button>
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
      <div style={{ border: "1px dashed #ddd", borderRadius: 8, color: "#888", fontSize: 14, padding: 24, textAlign: "center" }}>
        {emptyText}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 28, marginBottom: 20 }}>
        {visible.map((item) => (
          <Card item={item} key={item.id} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <button
          onClick={() => setPage((current) => Math.max(0, current - 1))}
          disabled={page === 0}
          style={{
            background: page === 0 ? "#eee" : "#333",
            color: page === 0 ? "#999" : "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            cursor: page === 0 ? "default" : "pointer",
          }}
        >
          Back
        </button>

        <div style={{ fontSize: 13, color: "#666" }}>
          Halaman {page + 1} dari {totalPages}
        </div>

        <button
          onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
          disabled={page >= totalPages - 1}
          style={{
            background: page >= totalPages - 1 ? "#eee" : "#333",
            color: page >= totalPages - 1 ? "#999" : "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            cursor: page >= totalPages - 1 ? "default" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function KajianClient({ items }: { items: PublicContentItem[] }) {
  const grouped = useMemo(() => {
    return sections.reduce<Record<string, KajianItem[]>>((result, section) => {
      result[section.slug] = items
        .filter((item) => item.section === section.slug)
        .map(toKajianItem);
      return result;
    }, {});
  }, [items]);

  const featured = items.find((item) => item.section === "artikel-kajian") ?? items[0] ?? null;

  return (
    <section style={{ background: "#fff", padding: "48px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 16, color: "#888", letterSpacing: 2, marginBottom: 8 }}>ARTIKEL ISLAMI</div>
          <div style={{ fontSize: 38, fontWeight: 700, color: "#F9A826", marginBottom: 8 }}>Kajian &amp; Materi Da&apos;wah</div>
        </div>

        {featured ? (
          <div style={{ display: "flex", gap: 40, marginBottom: 60, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 360px" }}>
              <h3 style={{ fontSize: 28, fontWeight: 700, color: "#333", marginBottom: 16 }}>{featured.title}</h3>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
                {featured.authorName} - {formatMonth(featured.publishedAt)}
              </div>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, marginBottom: 16 }}>{featured.summary || toExcerpt(featured)}</p>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, marginBottom: 20 }}>{featured.body}</p>
            </div>
            <div style={{ flex: "1 1 300px", minWidth: 280 }}>
              <div
                style={{
                  width: "100%",
                  height: 280,
                  background: featured.imageUrl ? `center / cover url("${featured.imageUrl.replaceAll('"', "%22")}")` : "#e0e0e0",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {!featured.imageUrl ? <span style={{ color: "#999" }}>Gambar</span> : null}
              </div>
              <div style={{ fontSize: 13, color: "#888" }}>{sectionLabels[featured.section] ?? featured.section}</div>
              <div style={{ fontSize: 12, color: "#aaa" }}>
                {featured.authorName} - {formatMonth(featured.publishedAt)}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ border: "1px dashed #ddd", borderRadius: 8, color: "#888", marginBottom: 60, padding: 32, textAlign: "center" }}>
            Belum ada materi kajian yang diterbitkan dari database.
          </div>
        )}

        {sections.map((section) => (
          <div style={{ marginBottom: 60 }} key={section.slug}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#333", marginBottom: 24 }}>{section.title}</h3>
            <SectionPager
              emptyText={`Belum ada ${section.title.toLowerCase()} yang diterbitkan.`}
              items={grouped[section.slug] ?? []}
              pageSize={3}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
