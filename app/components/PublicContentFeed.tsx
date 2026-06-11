"use client";

import { useEffect, useState } from "react";
import type { PublicContentItem } from "../lib/content";

type PublicPayload = {
  items: PublicContentItem[];
  finance: {
    pemasukan: number;
    pengeluaran: number;
    saldo: number;
  };
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PublicContentFeed({ module, section }: { module?: string; section?: string }) {
  const [payload, setPayload] = useState<PublicPayload | null>(null);

  useEffect(() => {
    fetch("/api/public-content")
      .then((response) => response.ok ? response.json() as Promise<PublicPayload> : null)
      .then(setPayload)
      .catch(() => setPayload(null));
  }, []);

  if (!payload) return null;
  const items = payload.items.filter((item) =>
    (!module || item.module === module) && (!section || item.section === section),
  );
  if (items.length === 0 && (module || section)) return null;

  return (
    <section className="publicManagedContent">
      <div className="container">
        <div className="publicManagedHead">
          <div>
            <p>TERHUBUNG DENGAN DASHBOARD</p>
            <h2>{module === "kajian" ? "Kajian Terbaru" : "Informasi Terbaru"}</h2>
          </div>
          {!module ? (
            <div className="publicFinanceSummary">
              <span>Pemasukan <strong>{formatRupiah(payload.finance.pemasukan)}</strong></span>
              <span>Pengeluaran <strong>{formatRupiah(payload.finance.pengeluaran)}</strong></span>
              <span>Saldo <strong>{formatRupiah(payload.finance.saldo)}</strong></span>
            </div>
          ) : null}
        </div>
        <div className="publicManagedGrid">
          {items.slice(0, module ? 9 : 6).map((item) => (
            <article key={item.id}>
              {item.imageUrl ? (
                <div
                  className="publicContentImage"
                  role="img"
                  aria-label={`Gambar ${item.title}`}
                  style={{ backgroundImage: `url("${item.imageUrl.replaceAll('"', "%22")}")` }}
                />
              ) : <div className="publicContentPlaceholder" />}
              <div>
                <span>{item.section.replaceAll("-", " ")}</span>
                <h3>{item.title}</h3>
                <p>{item.summary || item.body}</p>
                <small>Diperbarui oleh {item.authorName}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
