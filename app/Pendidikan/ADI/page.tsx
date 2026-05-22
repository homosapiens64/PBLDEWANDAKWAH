"use client";

// ─── Data ─────────────────────────────────────────────────────────────────────
const requirements = [
  "Muslim/Muslimah, usia minimal 18 tahun",
  "Lulusan SMA/MA/sederajat atau lebih tinggi",
  "Memiliki niat kuat berdakwah di jalan Allah",
  "Mampu membaca Al-Qur'an dengan baik dan benar",
  "Sehat jasmani dan rohani",
  "Mendapat rekomendasi dari tokoh setempat / masjid",
];

const registrationFlow = [
  {
    title: "Ambil Formulir",
    desc: "Datang langsung ke sekretariat atau unduh formulir via WhatsApp",
    align: "left",
  },
  {
    title: "Lengkapi Berkas",
    desc: "Foto, ijazah, KTP, surat rekomendasi, dan pas foto 3×4",
    align: "right",
  },
  {
    title: "Seleksi & Wawancara",
    desc: "Tes baca Al-Qur'an, wawancara motivasi, dan tes tulis dasar",
    align: "left",
  },
  {
    title: "Pengumuman & Daftar Ulang",
    desc: "Hasil seleksi diumumkan dan dilanjutkan pendaftaran ulang",
    align: "right",
  },
];

const programs = [
  {
    icon: "🕌",
    color: "#009688",
    bg: "#e0f2f1",
    title: "Ilmu Dakwah & Komunikasi",
    desc: "Teori dan praktik dakwah, retorika Islam, dan komunikasi publik berbasis nilai Qur'an.",
    semester: 3,
  },
  {
    icon: "📖",
    color: "#e65100",
    bg: "#fff3e0",
    title: "Fiqih & Ushul Fiqih",
    desc: "Dasar-dasar hukum Islam, metodologi ijtihad hukum, dan penerapan fiqih kontemporer.",
    semester: 2,
  },
  {
    icon: "👤",
    color: "#1565c0",
    bg: "#e3f2fd",
    title: "Leadership & Manajemen Dakwah",
    desc: "Kepemimpinan Islam, manajemen organisasi dakwah, dan pengembangan komunitas.",
    semester: 2,
  },
  {
    icon: "🏫",
    color: "#6a1b9a",
    bg: "#f3e5f5",
    title: "Praktek Lapangan Dakwah",
    desc: "Penempatan mahasiswa di komunitas dan masjid untuk praktik dakwah langsung di masyarakat.",
    semester: 1,
  },
];

const contactItems = [
  { icon: "📍", label: "Alamat", value: "Jl. Wirijan, Semarang Tengah" },
  { icon: "📞", label: "Telepon", value: "(024) 123-4567" },
  { icon: "✉️", label: "Email", value: "adi@dewandakwah-semarang.or.id" },
  { icon: "🕐", label: "Jam Operasional", value: "Senin–Jumat, 08.00–16.00 WIB" },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const TEAL = "#009688";
const TEAL_DARK = "#00796b";
const GOLD = "#f5a623";

// ─── Component ────────────────────────────────────────────────────────────────
export default function ADI() {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: "#1a1a1a", backgroundColor: "#fff" }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: "56px 80px 0", maxWidth: 1200, margin: "0 auto" }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, margin: 0, letterSpacing: 1, textTransform: "uppercase", color: "#1a1a1a" }}>
            AKADEMI DA'WAH ISLAM
          </h1>
          <h1 style={{ fontSize: 48, fontWeight: 900, margin: 0, letterSpacing: 2, textTransform: "uppercase", color: GOLD }}>
            Indonesia
          </h1>
        </div>

        {/* Description */}
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "#555", maxWidth: 860, margin: "0 auto 24px", textAlign: "center" }}>
          ADI adalah lembaga pendidikan tinggi vokasi yang berfokus pada pembinaan kader da'i profesional.
          Mahasiswa ADI dibekali ilmu syariah, metode dakwah, kepemimpinan Islam, dan keterampilan komunikasi
          publik agar siap berdakwah di tengah masyarakat. Program ini dirancang untuk mencetak dai yang
          memiliki wawasan luas, akhlak mulia, dan kemampuan adaptasi dakwah di era modern.
        </p>

        {/* Tags */}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
          {[
            { label: "🗓 Pendaftaran: Juni – Agustus" },
            { label: "👥 Kapasitas: 60 mahasiswa/angkatan", highlight: true },
            { label: "🎓 Jenjang: D3 / Vokasi" },
          ].map((tag) => (
            <span
              key={tag.label}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 500,
                backgroundColor: tag.highlight ? "#e0f2f1" : "#f5f5f5",
                color: tag.highlight ? TEAL : "#444",
                border: tag.highlight ? `1px solid #b2dfdb` : "1px solid #e0e0e0",
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Image placeholder */}
        <div
          style={{
            width: "100%",
            height: 340,
            backgroundColor: "#d0d0d0",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            fontSize: 14,
            marginBottom: 0,
          }}
        >
          Gambar ADI Semarang
        </div>
      </section>

      {/* ── Syarat Pendaftaran ────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f5f5f5", padding: "64px 80px", position: "relative", overflow: "hidden", marginTop: 0 }}>
        {/* Decorative circle */}
        <div style={{
          position: "absolute",
          left: -60,
          top: "50%",
          transform: "translateY(-50%)",
          width: 220,
          height: 220,
          borderRadius: "50%",
          border: "2px solid rgba(0,150,136,0.15)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          left: -100,
          top: "50%",
          transform: "translateY(-50%)",
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: "2px solid rgba(0,150,136,0.08)",
          pointerEvents: "none",
        }} />

        {/* Decorative dots bottom-right */}
        <div style={{ position: "absolute", bottom: 24, right: 40, display: "grid", gridTemplateColumns: "repeat(5, 8px)", gap: 6, pointerEvents: "none" }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: TEAL, opacity: 0.25 }} />
          ))}
        </div>

        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 800, margin: "0 0 36px" }}>
          Syarat Pendaftaran
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 640, margin: "0 auto" }}>
          {requirements.map((req, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: TEAL,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 15, color: "#333", fontWeight: 500 }}>{req}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Alur Pendaftran ───────────────────────────────────────────────── */}
      <section style={{ padding: "64px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 4px" }}>Alur Pendaftran</h2>
          <div style={{ width: 48, height: 4, backgroundColor: GOLD, borderRadius: 2, margin: "8px auto 16px" }} />
          <p style={{ fontSize: 14, color: "#666", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            Sebologoi panduan Anda untuk mengikuti program pebelaran disekolah kami kami
            sediakan panduan alur pedaftaran sebgoi berikut.
          </p>
        </div>

        {/* Zigzag steps */}
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: "#e0e0e0",
            transform: "translateX(-50%)",
          }} />

          {registrationFlow.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: step.align === "left" ? "flex-start" : "flex-end",
                paddingBottom: 36,
                position: "relative",
              }}
            >
              {/* Dot on center line */}
              <div style={{
                position: "absolute",
                left: "50%",
                top: 6,
                transform: "translateX(-50%)",
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: TEAL,
                zIndex: 1,
              }} />

              {/* Content block */}
              <div style={{ width: "44%", padding: step.align === "left" ? "0 0 0 0" : "0 0 0 0" }}>
                <div style={{
                  borderLeft: step.align === "left" ? `3px solid ${TEAL}` : "none",
                  borderRight: step.align === "right" ? `3px solid ${TEAL}` : "none",
                  paddingLeft: step.align === "left" ? 14 : 0,
                  paddingRight: step.align === "right" ? 14 : 0,
                  textAlign: step.align === "right" ? "right" : "left",
                }}>
                  <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 4px", color: "#1a1a1a" }}>{step.title}</p>
                  <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Program Pendidikan ────────────────────────────────────────────── */}
      <section style={{ padding: "0 80px 64px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 800, margin: "0 0 36px" }}>
          Program Pendidikan
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {programs.map((prog) => (
            <div
              key={prog.title}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 14,
                padding: 22,
                backgroundColor: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              {/* Icon */}
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: prog.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                marginBottom: 14,
              }}>
                {prog.icon}
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.4, color: "#1a1a1a" }}>
                {prog.title}
              </h3>

              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: "0 0 16px" }}>
                {prog.desc}
              </p>

              {/* Semester badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>🕐</span>
                <span style={{ fontSize: 12, color: "#888" }}>{prog.semester} Semester</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Penerimaan & Kontak ───────────────────────────────────────────── */}
      <section style={{ padding: "0 80px 64px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>

          {/* Penerimaan Mahasiswa Baru */}
          <div style={{ border: "1px solid #e5e5e5", borderRadius: 14, padding: 28, backgroundColor: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px", color: "#1a1a1a" }}>
              Penerimaan Mahasiswa Baru
            </h3>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, margin: "0 0 24px" }}>
              Pendaftaran mahasiswa baru ADI & STIDI dibuka setiap tahun pada bulan Juni–
              Agustus. Tersedia beasiswa penuh bagi calon dai berprestasi
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                style={{
                  backgroundColor: "#fff",
                  color: "#1a1a1a",
                  border: "1.5px solid #ccc",
                  borderRadius: 8,
                  padding: "11px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = TEAL)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
              >
                Daftar Sekarang
              </button>
              <button
                style={{
                  backgroundColor: "#fff",
                  color: "#1a1a1a",
                  border: "1.5px solid #ccc",
                  borderRadius: 8,
                  padding: "11px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = TEAL)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
              >
                Info via WhatsApp
              </button>
            </div>
          </div>

          {/* Kontak ADI Semarang */}
          <div style={{ border: "1px solid #e5e5e5", borderLeft: `4px solid ${TEAL}`, borderRadius: 14, padding: 28, backgroundColor: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px", color: "#1a1a1a" }}>
              Kontak ADI Semarang
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {contactItems.map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    backgroundColor: "#e0f2f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: TEAL, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: 14, color: "#333", margin: 0 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
