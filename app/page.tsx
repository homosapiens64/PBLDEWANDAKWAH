
export default function Home() {
  return (
    <>
      {/* HERO BANNER KOSONG */}
      <section className="hero-banner">
        <img
          src="/natsir.png"
          alt="Banner Utama"
          className="hero-banner-img"
        />
        <a href="#" className="banner-btn">
          Selengkapnya <span className="banner-btn-icon">↗</span>
        </a>
      </section>

      {/* INFORMASI TERKINI: 2 kolom */}
      <section style={{ background: '#f8faf9', padding: '48px 0 32px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 36 }}>
          {/* Kolom utama */}
          <div style={{ flex: 2 }}>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 1, color: '#1EAE98', marginBottom: 8 }}>
              INFORMASI TERKINI
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#F9A826', marginBottom: 28 }}>
              BERITA & KEGIATAN
            </div>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              {[1,2,3].map((i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #0001', width: 320, minHeight: 320, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginBottom: 18 }}>
                  <div style={{ height: 160, background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#bbb' }}>Gambar</span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Judul Berita {i}</div>
                    <div style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>Ringkasan singkat berita atau kegiatan yang ditampilkan di sini.</div>
                    <div style={{ fontSize: 13, color: '#1EAE98', fontWeight: 600 }}>Selengkapnya →</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Kolom samping */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1EAE98', marginBottom: 12 }}>Selengkapnya</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[1,2,3,4].map((i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: '#444', boxShadow: '0 1px 4px #0001' }}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Judul Berita {i}</div>
                  <div style={{ color: '#888', fontSize: 13 }}>Ringkasan singkat berita</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ARTIKEL ISLAMI: Tab & List */}
      <section style={{ background: '#eaf6f4', padding: '48px 0 32px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#888', letterSpacing: 2, marginBottom: 8 }}>ARTIKEL ISLAMI</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#F9A826', marginBottom: 18 }}>Kajian & Materi Dakwah</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            {['Semua','Tauhid','Ekonomi Islam','Tazkiyah','Khutbah'].map((cat, idx) => (
              <button key={cat} style={{
                background: idx===0 ? '#1EAE98' : '#fff',
                color: idx===0 ? '#fff' : '#1EAE98',
                border: '1.5px solid #1EAE98',
                borderRadius: 20,
                padding: '7px 18px',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: idx===0 ? '0 2px 8px #1EAE9822' : 'none',
              }}>{cat}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[1,2,3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #0001', padding: 18 }}>
                <div style={{ width: 90, height: 70, background: '#e0e0e0', borderRadius: 8, marginRight: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#bbb' }}>Gambar</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Judul Artikel {i}</div>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 6 }}>Ringkasan singkat artikel islami atau materi dakwah.</div>
                  <div style={{ fontSize: 13, color: '#888' }}>Penulis • Tanggal • 8 menit baca</div>
                </div>
                <div style={{ marginLeft: 18 }}>
                  <span style={{ background: '#1EAE98', color: '#fff', borderRadius: 12, padding: '4px 14px', fontSize: 13, fontWeight: 600 }}>Tauhid</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KONSULTASI AGAMA: Gambar kiri, deskripsi kanan */}
      <section style={{ background: '#fff', padding: '48px 0 32px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 40, alignItems: 'center' }}>
          {/* Gambar kiri */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ width: '100%', height: 120, background: '#e0e0e0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#bbb' }}>Gambar</span>
            </div>
            <div style={{ width: '100%', height: 80, background: '#e0e0e0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#bbb' }}>Gambar</span>
            </div>
          </div>
          {/* Deskripsi kanan */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, color: '#1EAE98', fontWeight: 700, marginBottom: 8 }}>Layanan Islami Terpercaya</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#F9A826', marginBottom: 18 }}>Konsultasi <span style={{ color: '#1EAE98' }}>Agama</span></div>
            <div style={{ fontSize: 16, color: '#444', marginBottom: 18 }}>
              Tim ustadz Dewan Da'wah siap menjawab pertanyaan seputar hukum Islam dan keluarga secara gratis, terpercaya, dan berlandaskan Al-Qur'an & Sunnah.
            </div>
            <ul style={{ color: '#1EAE98', fontWeight: 600, fontSize: 15, marginBottom: 18, paddingLeft: 18 }}>
              <li>Tanya Hukum Alam</li>
              <li>Jawaban Termotifikasi via Email & WA</li>
              <li>Chat Langsung Jam Kerja</li>
            </ul>
            <button className="btn-primary">Konsultasi Gratis</button>
          </div>
        </div>
      </section>

      {/* PROGRAM KEBAIKAN: Card donasi */}
      <section style={{ background: '#f8faf9', padding: '48px 0 32px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#888', letterSpacing: 2, marginBottom: 8 }}>LAZNAS SEMARANG</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1EAE98', marginBottom: 18 }}>Program Kebaikan</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[1,2,3].map((i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #0001', width: 340, minHeight: 320, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginBottom: 18 }}>
                <div style={{ height: 180, background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ color: '#bbb' }}>Gambar</span>
                  <span style={{ position: 'absolute', top: 12, left: 12, background: '#F44336', color: '#fff', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 700 }}>URGENT</span>
                </div>
                <div style={{ padding: 18 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Judul Program {i}</div>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>Deskripsi singkat program kebaikan atau donasi.</div>
                  <div style={{ fontSize: 13, color: '#1EAE98', fontWeight: 600 }}>Sisa Waktu • Terkumpul</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
