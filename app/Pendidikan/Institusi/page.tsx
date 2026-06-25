"use client";

import Link from "next/link";

interface Tag {
  label: string;
  variant?: "green" | "default";
}

interface Institution {
  id: string;
  href: string;
  name: string;
  subtitle: string;
  description: string;
  tags: Tag[];
  imageAlt: string;
  reverse?: boolean;
}

const institutions: Institution[] = [
  {
    id: "adi",
    href: "/Pendidikan/ADI",
    name: "ADI",
    subtitle: "Akademi Da'wah Islam Indonesia — Cabang Semarang",
    description:
      "ADI adalah lembaga pendidikan tinggi vokasi yang berfokus pada pembinaan kader da'i profesional. Mahasiswa ADI dibekali ilmu syariah, metode dakwah, kepemimpinan Islam, dan keterampilan komunikasi publik agar siap berdakwah di tengah masyarakat.",
    tags: [
      { label: "📍 Jl. Wajan, Semarang Tengah" },
      { label: "🗓 Pendaftaran: Juni – Agustus" },
      { label: "👥 Kapasitas: 60 mahasiswa/angkatan", variant: "green" },
      { label: "🎓 Jenjang: D3 / Vokasi" },
    ],
    imageAlt: "ADI Campus",
    reverse: false,
  },
  {
    id: "ponpes",
    href: "/Pendidikan/PonpesSuruh",
    name: "PONPES SURUH",
    subtitle: "Lembaga Pendidikan Islam — Kota Semarang",
    description:
      "Pondok Pesantren Suruh adalah lembaga pendidikan Islam tradisional yang berada di bawah naungan Dewan Da'wah Islamiyah Indonesia Cabang Semarang. Pesantren ini menggabungkan pendidikan salaf yang kuat dengan kurikulum modern.",
    tags: [
      { label: "📍 Kec. Suruh, Kab. Semarang" },
      { label: "🏠 Sistem: Mukim (Boarding)", variant: "green" },
      { label: "🧑‍🤝‍🧑 Penerimaan: Putra & Putri" },
      { label: "🗓 Pendaftaran: Mei – Juli" },
    ],
    imageAlt: "Ponpes Suruh",
    reverse: true,
  },
  {
    id: "khawarizmi",
    href: "/Pendidikan/AlKhawarizmi",
    name: "Al Khawarizmi",
    subtitle: "Lembaga Pendidikan Islam — Terafiliasi DDI Cabang Semarang",
    description:
      "Al Khawarizmi adalah lembaga pendidikan Islam terpadu yang mengintegrasikan ilmu agama dengan ilmu sains dan teknologi modern, bertekad melahirkan generasi Muslim yang unggul secara akademik dan kuat secara aqidah.",
    tags: [
      { label: "📍 Kota Semarang" },
      { label: "🏫 Sistem: Full Day School" },
      { label: "✅ Akreditasi: A (Kemenag)", variant: "green" },
      { label: "🧑‍🤝‍🧑 Penerimaan: Putra & Putri" },
    ],
    imageAlt: "Al Khawarizmi",
    reverse: false,
  },
];

const registrationSteps = [
  { icon: "✏️", label: "Daftar Online" },
  { icon: "🎙️", label: "Wawancara" },
  { icon: "📣", label: "Pengumuman" },
  { icon: "📁", label: "Heregistrasi" },
  { icon: "📘", label: "Selesai" },
];

export default function Institusi() {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: "#1a1a1a", backgroundColor: "#fff" }}>

      {/* Hero */}
      <section style={{ padding: "56px 80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.15, margin: "0 0 20px", color: "#1a1a1a" }}>
          Pendidikan{" "}
          <em style={{ fontStyle: "italic", color: "#009688", fontFamily: "Georgia, serif" }}>Islami</em>
          <br />
          Berkualitas &amp; Terpercaya
        </h1>
        <div style={{ borderLeft: "4px solid #009688", paddingLeft: 16, maxWidth: 620 }}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#444", margin: 0 }}>
            DDI Semarang mengelola 3 lembaga pendidikan Islam unggulan — dari tingkat pesantren hingga{" "}
            <span style={{ textDecoration: "line-through", color: "#009688", fontWeight: 600 }}>perguruan tinggi</span>{" "}
            — untuk mencetak generasi Muslim yang <strong>berilmu, berakhlak, dan berdakwah.</strong>
          </p>
        </div>
      </section>

      {/* Institution Cards */}
      <section style={{ padding: "20px 80px 60px", maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 48 }}>
        {institutions.map((inst) => (
          <div
            key={inst.id}
            style={{ display: "flex", flexDirection: inst.reverse ? "row-reverse" : "row", gap: 40, alignItems: "stretch" }}
          >
            {/* Info Card */}
            <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5e5e5", padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #009688, #4CAF50)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>
                  ✦
                </div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{inst.name}</h2>
              </div>

              <p style={{ color: "#009688", fontSize: 13, fontWeight: 600, margin: "0 0 12px" }}>{inst.subtitle}</p>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "#555", margin: "0 0 20px" }}>{inst.description}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {inst.tags.map((tag) => (
                  <span
                    key={tag.label}
                    style={{
                      display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20,
                      fontSize: 12, fontWeight: 500,
                      backgroundColor: tag.variant === "green" ? "#e6f4f1" : "#f5f5f5",
                      color: tag.variant === "green" ? "#009688" : "#444",
                      border: tag.variant === "green" ? "1px solid #b2dfdb" : "1px solid #e0e0e0",
                    }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* ── Dua tombol ── */}
              <div style={{ display: "flex", gap: 10 }}>
                <Link
                  href={inst.href}
                  style={{ backgroundColor: "#009688", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00796b")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#009688")}
                >
                  Selengkapnya
                </Link>

                {/* Tombol Daftar — pakai query param ?institusi=id */}
                <Link
                  href="/Pendidikan/pmb/login"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    backgroundColor: "#fff", color: "#009688",
                    border: "2px solid #009688", borderRadius: 8,
                    padding: "10px 24px", fontSize: 14, fontWeight: 600,
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#009688"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#009688"; }}
                >
                  Daftar →
                </Link>
              </div>
            </div>

            {/* Image Placeholder */}
            <div style={{ flex: 1, backgroundColor: "#d0d0d0", borderRadius: 16, minHeight: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 13 }}>
              {inst.imageAlt}
            </div>
          </div>
        ))}
      </section>

      {/* Alur Pendaftaran */}
      <section style={{ backgroundColor: "#f9f9f9", padding: "60px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {[{ top: 20, right: 40 }, { top: 60, right: 20 }, { bottom: 40, left: 20 }, { bottom: 20, left: 60 }].map((pos, i) => (
          <div key={i} style={{ position: "absolute", ...pos, display: "grid", gridTemplateColumns: "repeat(4, 8px)", gap: 6 }}>
            {Array.from({ length: 16 }).map((_, j) => (
              <div key={j} style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#009688", opacity: 0.3 }} />
            ))}
          </div>
        ))}
        <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 12px" }}>Alur Pendaftaran</h2>
        <p style={{ fontSize: 15, color: "#666", maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.6 }}>
          Panduan lengkap untuk mengikuti program pendidikan di lembaga DDI Semarang.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {registrationSteps.map((step) => (
            <div key={step.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#fff", border: "2px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                {step.icon}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{step.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
