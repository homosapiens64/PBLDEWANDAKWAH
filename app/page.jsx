"use client";

import React from "react";

export default function TentangKami() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Poppins:wght@300;400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .tk-body {
          font-family: 'Poppins', sans-serif;
          color: #333;
          overflow-x: hidden;
        }

        /* ── Sejarah Organisasi ── */
        .tk-sejarah {
          background: #fff;
          padding: 80px 0 60px;
        }

        .tk-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .tk-sejarah-title {
          text-align: center;
          margin-bottom: 40px;
        }

        .tk-sejarah-title h1 {
          font-family: 'Poppins', sans-serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.5px;
        }

        .tk-sejarah-title h1 span {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          color: #e8a020;
          font-weight: 700;
        }

        .tk-title-divider {
          width: 60px;
          height: 3px;
          background: #e8a020;
          margin: 12px auto 0;
          border-radius: 2px;
        }

        .tk-sejarah-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .tk-sejarah-cols p {
          font-size: 0.88rem;
          line-height: 1.85;
          color: #555;
          text-align: justify;
        }

        /* ── Cabang Banner ── */
        .tk-cabang {
          position: relative;
          background: #1a7a6e;
          padding: 60px 40px 80px;
          text-align: center;
          overflow: hidden;
        }

        .tk-cabang::before {
          content: '';
          position: absolute;
          top: -40px;
          left: 0;
          right: 0;
          height: 80px;
          background: #fff;
          border-radius: 0 0 50% 50%;
        }

        .tk-cabang::after {
          content: '';
          position: absolute;
          bottom: -40px;
          left: 0;
          right: 0;
          height: 80px;
          background: #fff;
          border-radius: 50% 50% 0 0;
          z-index: 1;
        }

        .tk-cabang-inner {
          position: relative;
          z-index: 2;
        }

        .tk-cabang h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.9rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 24px;
        }

        .tk-cabang p {
          font-size: 0.9rem;
          line-height: 1.9;
          color: rgba(255,255,255,0.92);
          max-width: 720px;
          margin: 0 auto;
        }

        /* ── Visi ── */
        .tk-visi {
          background: #fff;
          padding: 90px 40px;
          text-align: center;
        }

        .tk-visi-label {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: 4px;
          margin-bottom: 32px;
        }

        .tk-visi-quote {
          position: relative;
          max-width: 780px;
          margin: 0 auto;
        }

        .tk-visi-quote::before {
          content: '"';
          font-family: 'Playfair Display', serif;
          font-size: 7rem;
          color: #1a7a6e;
          line-height: 0.6;
          position: absolute;
          left: -50px;
          top: 10px;
        }

        .tk-visi-quote p {
          font-family: 'Poppins', sans-serif;
          font-size: 1.05rem;
          font-weight: 500;
          line-height: 1.85;
          color: #2a2a2a;
          text-align: center;
        }

        /* ── Misi ── */
        .tk-misi {
          background: #fff;
          padding: 20px 0 90px;
          position: relative;
        }

        .tk-misi-label {
          text-align: center;
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 4px;
          color: #1a1a1a;
          margin-bottom: 44px;
        }

        .tk-misi-wrap {
          position: relative;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .tk-dots {
          position: absolute;
          top: -20px;
          display: grid;
          grid-template-columns: repeat(5, 10px);
          grid-template-rows: repeat(5, 10px);
          gap: 8px;
        }

        .tk-dots-left {
          left: 0px;
        }

        .tk-dots-right {
          right: 0px;
        }

        .tk-dots span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #1a7a6e;
          opacity: 0.5;
          display: block;
        }

        .tk-misi-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 22px;
          max-width: 760px;
          margin: 0 auto;
        }

        .tk-misi-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .tk-misi-num {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          color: #1a1a1a;
          font-size: 0.92rem;
          min-width: 20px;
          padding-top: 1px;
        }

        .tk-misi-text {
          font-size: 0.88rem;
          line-height: 1.85;
          color: #555;
        }

        /* ── Kontak & Lokasi ── */
        .tk-kontak {
          background: #f9f9f9;
          padding: 80px 0 80px;
        }

        .tk-kontak-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .tk-kontak-sub {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 10px;
        }

        .tk-kontak-sub span {
          font-size: 0.7rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #888;
          font-family: 'Poppins', sans-serif;
        }

        .tk-kontak-sub::before,
        .tk-kontak-sub::after {
          content: '';
          height: 1px;
          width: 60px;
          background: #ccc;
        }

        .tk-kontak-title {
          font-family: 'Poppins', sans-serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .tk-kontak-title span {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          color: #e8a020;
        }

        .tk-kontak-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Map Card */
        .tk-map-card {
          background: #1a4a40;
          border-radius: 12px;
          overflow: hidden;
          min-height: 320px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0;
          position: relative;
        }

        .tk-map-bg {
          position: absolute;
          inset: 0;
          background: 
            linear-gradient(160deg, #1a6a5e 0%, #0d3d35 100%);
          z-index: 0;
        }

        /* Decorative map pattern */
        .tk-map-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .tk-map-content {
          position: relative;
          z-index: 2;
          padding: 28px 28px 32px;
          text-align: center;
        }

        .tk-map-pin {
          width: 36px;
          height: 36px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }

        .tk-map-pin svg {
          width: 18px;
          height: 18px;
          fill: #1a7a6e;
        }

        .tk-map-label {
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .tk-map-addr {
          color: rgba(255,255,255,0.75);
          font-size: 0.8rem;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .tk-map-btn {
          display: inline-block;
          background: #e8a020;
          color: #fff;
          padding: 10px 24px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: none;
          font-family: 'Poppins', sans-serif;
        }

        /* Contact list */
        .tk-contact-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tk-contact-item {
          background: #fff;
          border-radius: 10px;
          padding: 18px 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .tk-contact-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e8f5f2;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tk-contact-icon svg {
          width: 17px;
          height: 17px;
          fill: #1a7a6e;
        }

        .tk-contact-info h4 {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .tk-contact-info p {
          font-size: 0.8rem;
          color: #777;
          line-height: 1.55;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .tk-sejarah-cols {
            grid-template-columns: 1fr;
          }
          .tk-kontak-grid {
            grid-template-columns: 1fr;
          }
          .tk-visi-quote::before {
            font-size: 5rem;
            left: -10px;
          }
        }
      `}</style>

      <main className="tk-body">

        {/* ── 1. Sejarah Organisasi ── */}
        <section className="tk-sejarah">
          <div className="tk-container">
            <div className="tk-sejarah-title">
              <h1>
                Sejarah <span>Organisasi</span>
              </h1>
              <div className="tk-title-divider" />
            </div>
            <div className="tk-sejarah-cols">
              <p>
                Dewan Dakwah Islamiyah Indonesia (DDII) didirikan pada tahun 1967
                oleh Mohammad Natsir, seorang tokoh pergerakan kemerdekaan
                Indonesia, mantan pemimpin Partai Masyumi dan pemimpin
                kebangkitan Islam di Indonesia dan interaksi dengan Timur Tengah.
                Setelah partai Masyumi dibubarkan, Natsir dan mantan anggota partai
                lainnya bertemu untuk membuat DDII. DDII berfokus pada
                menarik kelas menengah ke bawah dan calon mslin kota yang
                mempromosikan hukum syariah dan kesetaan ritual Islam sebagai
                solusi untuk penyakit masyarakat, dan menurut salah satu kritikus
                yang menyerang.
              </p>
              <p>
                "korupsi pemerintah, asosisisme Jawa, liberalisme Muslim dan
                dominasi ekonomi orang Cina" sebagai gejala konspirasi yang lebih
                besar untuk mengkristentkan Indonesia.
                Pada 26 Februari 1967, atas undangan pengurus masjid Al-
                Munawwarah, Kampung Bali, Tanah Abang, Jakarta Pusat, para
                alim ulama dan da'wah berkumpul untuk bermusyawarah, membahas,
                meneliti, dan menilai berbagai masalah, terutama yang rapat
                hubungannya dengan usaha pembangunan umat. Juga tentang usaha
                mempertahankan aqidah di dalam kesimpangsiuran kekuatan-
                kekuatan yang ada dalam masyarakat.
              </p>
            </div>
          </div>
        </section>

        {/* ── 2. Cabang Kota Semarang ── */}
        <section className="tk-cabang">
          <div className="tk-cabang-inner">
            <h2>Cabang Kota Semarang</h2>
            <p>
              Dikukuhkan pada tanggal 2 Februari 2026 di Semarang, Dewan Da'wah Kota Semarang
              berkomitmen untuk terus berperan aktif dalam mendukung pembinaan umat di tingkat daerah.
              Dengan program kerja yang strategis dan berbasis kebutuhan nyata, Dewan Da'wah Kabupaten
              Sidoarjo dapat lebih maksimal dalam memberikan kontribusi nyata kepada masyarakat.
              Program kerja yang dirumuskan diharapkan mampu memberikan solusi atas permasalahan
              yang dihadapi umat sekaligus memperkuat karakter Islami di tengah masyarakat.
            </p>
          </div>
        </section>

        {/* ── 3. Visi ── */}
        <section className="tk-visi">
          <div className="tk-visi-label">VISI</div>
          <div className="tk-visi-quote">
            <p>
              Terwujudnya masyarakat Kota Semarang yang bertaqwa, berakhlak mulia, dan
              beradab, serta mandiri secara sosial-ekonomi dan saintek melalui da&apos;wah Islam
              yang berdampak.
            </p>
          </div>
        </section>

        {/* ── 4. Misi ── */}
        <section className="tk-misi">
          <div className="tk-misi-label">MISI</div>
          <div className="tk-misi-wrap">
            {/* Dots left */}
            <div className="tk-dots tk-dots-left">
              {Array.from({ length: 25 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
            {/* Dots right */}
            <div className="tk-dots tk-dots-right">
              {Array.from({ length: 25 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>

            <ul className="tk-misi-list">
              <li className="tk-misi-item">
                <span className="tk-misi-num">1.</span>
                <span className="tk-misi-text">
                  Menguatkan da&apos;wah Islam yang berlandaskan Al-Qur&apos;an dan As-Sunnah melalui
                  pembinaan majelis ta&apos;lim, komunitas muslim, dan kegiatan sosial keagamaan.
                </span>
              </li>
              <li className="tk-misi-item">
                <span className="tk-misi-num">2.</span>
                <span className="tk-misi-text">
                  Mengembangkan pendidikan Islam berkualitas pada jenjang pendidikan tinggi,
                  dasar, dan menengah untuk membentuk generasi Muslim yang berilmu, berakhlak, dan
                  berkomitmen pada da&apos;wah.
                </span>
              </li>
              <li className="tk-misi-item">
                <span className="tk-misi-num">3.</span>
                <span className="tk-misi-text">
                  Mendorong kemandirian ekonomi umat dengan program pemberdayaan ekonomi
                  berbasis syariah, penguatan kewirausahaan, edukasi kesehatan, dan pendampingan usaha
                  produktif masyarakat.
                </span>
              </li>
              <li className="tk-misi-item">
                <span className="tk-misi-num">4.</span>
                <span className="tk-misi-text">
                  Menerapkan sains-teknologi, informasi dan komunikasi sebagai sarana da&apos;wah yang
                  efektif, akurat, dan menjangkau generasi lintas usia.
                </span>
              </li>
              <li className="tk-misi-item">
                <span className="tk-misi-num">5.</span>
                <span className="tk-misi-text">
                  Membangun jejaring dan kemitraan strategis dengan lembaga pendidikan, pemerintah,
                  dan masyarakat untuk memperluas dampak da&apos;wah di Kota Semarang.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── 5. Kontak & Lokasi ── */}
        <section className="tk-kontak">
          <div className="tk-kontak-header">
            <div className="tk-kontak-sub">
              <span>HUBUNGI KAMI</span>
            </div>
            <h2 className="tk-kontak-title">
              Kontak &amp; <span>Lokasi</span>
            </h2>
          </div>

          <div className="tk-kontak-grid">
            {/* Map Card */}
            <div className="tk-map-card">
              <div className="tk-map-bg" />
              <div className="tk-map-content">
                <div className="tk-map-pin">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                  </svg>
                </div>
                <p className="tk-map-label">Kesekretariatan DDI Semarang</p>
                <p className="tk-map-addr">Jl. Wirijan, Semarang Tengah</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tk-map-btn"
                >
                  Buka di Google Maps →
                </a>
              </div>
            </div>

            {/* Contact List */}
            <div className="tk-contact-list">
              {/* Alamat Sekretariat */}
              <div className="tk-contact-item">
                <div className="tk-contact-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                  </svg>
                </div>
                <div className="tk-contact-info">
                  <h4>Alamat Sekretariat</h4>
                  <p>Jl. Wirijan No. XX, Semarang Tengah<br />Kota Semarang, Jawa Tengah 50XXX</p>
                </div>
              </div>

              {/* Ponpes Suruh */}
              <div className="tk-contact-item">
                <div className="tk-contact-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                  </svg>
                </div>
                <div className="tk-contact-info">
                  <h4>Ponpes Suruh</h4>
                  <p>Jl. Ponpes Suruh, Kec. Suruh<br />Kab. Semarang, Jawa Tengah</p>
                </div>
              </div>

              {/* Telepon */}
              <div className="tk-contact-item">
                <div className="tk-contact-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </div>
                <div className="tk-contact-info">
                  <h4>Telepon</h4>
                  <p>(024) 123-4567<br />Senin – Jumat, 08.00 – 16.00 WIB</p>
                </div>
              </div>

              {/* Email */}
              <div className="tk-contact-item">
                <div className="tk-contact-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <div className="tk-contact-info">
                  <h4>Email</h4>
                  <p>info@dewandakwah-semarang.or.id</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="tk-contact-item">
                <div className="tk-contact-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="tk-contact-info">
                  <h4>WhatsApp</h4>
                  <p>+62 857-0671-0998<br />Untuk konsultasi &amp; informasi cepat</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
