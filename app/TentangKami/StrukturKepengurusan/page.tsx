"use client";

import React from "react";

export default function StrukturKepengurusan() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Poppins:wght@300;400;500;600;700&display=swap');

        .sk-body * { box-sizing: border-box; margin: 0; padding: 0; }

        .sk-body {
          font-family: 'Poppins', sans-serif;
          color: #333;
          background: #f5f5f5;
          overflow-x: hidden;
        }

        /* ── Hero Banner ── */
        .sk-hero {
          background: linear-gradient(160deg, #1a7a6e 0%, #0f5248 100%);
          padding: 64px 40px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .sk-hero::after {
          content: '';
          position: absolute;
          bottom: -30px;
          left: 0; right: 0;
          height: 60px;
          background: #f5f5f5;
          border-radius: 50% 50% 0 0;
        }

        .sk-hero-org {
          font-size: 0.72rem;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .sk-hero-title {
          font-family: 'Poppins', sans-serif;
          font-size: 2.8rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 10px;
        }

        .sk-hero-title em {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-weight: 700;
          color: #a8e6df;
        }

        .sk-hero-periode {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.85);
          margin-bottom: 20px;
          letter-spacing: 1px;
        }

        .sk-hero-tagline {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.65);
          letter-spacing: 1.5px;
        }

        .sk-hero-tagline::before,
        .sk-hero-tagline::after {
          content: '';
          width: 60px;
          height: 1px;
          background: rgba(255,255,255,0.4);
        }

        /* ── Page Container ── */
        .sk-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 40px 80px;
        }

        /* ── Section titles ── */
        .sk-section {
          margin-bottom: 52px;
        }

        .sk-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 24px;
        }

        .sk-section-title::before {
          content: '';
          display: block;
          width: 5px;
          height: 28px;
          background: #1a7a6e;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .sk-section-title em {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          color: #e8a020;
          font-weight: 700;
        }

        /* ── Dewan Penasehat ── */
        .sk-penasehat-header {
          background: #1a7a6e;
          border-radius: 8px 8px 0 0;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .sk-penasehat-header-icon {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }

        .sk-penasehat-body {
          border: 1px solid #e0e0e0;
          border-top: none;
          border-radius: 0 0 8px 8px;
          background: #fff;
          overflow: hidden;
        }

        .sk-penasehat-item {
          display: flex;
          align-items: center;
          gap: 0;
          border-bottom: 1px solid #f0f0f0;
          padding: 8px 0;
        }

        .sk-penasehat-item:last-child {
          border-bottom: none;
        }

        /* numbering removed for penasehat; layout adjusted */

        .sk-penasehat-info {
          padding: 10px 12px;
          flex: 1;
          text-align: center;
        }

        .sk-penasehat-info h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 4px 0 6px 0;
        }

        .sk-penasehat-info span {
          font-size: 0.78rem;
          color: #888;
        }

        /* ── Pimpinan Harian Cards ── */
        .sk-pimpinan-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          align-items: start;
        }

        .sk-pimpinan-card {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          padding: 18px 14px;
          text-align: center;
          transition: box-shadow 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 280px; /* fixed card height to keep alignment */
        }

        .sk-pimpinan-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        .sk-pimpinan-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: #e8f5f2;
          color: #1a7a6e;
          font-weight: 700;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 8px auto 6px;
          letter-spacing: 1px;
          overflow: hidden;
        }

        /* Empty photo placeholder state (no photo available yet) */
        .sk-pimpinan-avatar.no-photo {
          background: #fff;
          border: 2px dashed #e0e0e0;
        }

        .sk-pimpinan-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .sk-pimpinan-role {
          font-size: 0.72rem;
          font-weight: 700;
          color: #1a7a6e;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0;
          align-self: center;
        }

        .sk-pimpinan-name {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.25;
          margin: 6px 0 8px 0;
          text-align: center;
          max-width: 220px;
          word-break: break-word;
          min-height: 48px; /* reserve vertical space so names align */
        }

        /* ── Unit Pelaksana ── */
        .sk-unit-card {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .sk-unit-header {
          background: #edf7f5;
          padding: 18px 20px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
          border-bottom: 1px solid #ddd;
        }

        .sk-unit-badge {
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
          padding: 4px 10px;
          border-radius: 4px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .sk-unit-badge-i   { background: #1a7a6e; }
        .sk-unit-badge-ii  { background: #e8a020; }
        .sk-unit-badge-iii { background: #7a6e1a; }

        .sk-unit-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          text-align: left;
          flex: 1 1 auto;
          width: fit-content;
          max-width: 100%;
          align-self: flex-start;
        }

        .sk-unit-info h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f4f47;
          margin: 0;
          text-align: left;
        }

        .sk-unit-info p {
          font-size: 0.9rem;
          color: #333;
          margin: 0;
          text-align: left;
          white-space: normal;
        }

        .sk-unit-info p strong {
          color: #1a1a1a;
        }

        .sk-unit-body {
          padding: 0 20px 20px;
        }

        /* Unit leader placeholder avatar */
        /* Unit avatar */
        .sk-unit-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: #fff;
          border: 2px dashed #e0e0e0;
          flex-shrink: 0;
          margin: 8px 0 6px 0;
          align-self: flex-start;
        }

        .sk-unit-header .sk-unit-info > h3,
        .sk-unit-header .sk-unit-info > p,
        .sk-unit-header .sk-unit-info > .sk-unit-avatar {
          align-self: flex-start;
        }

        /* layout: avatar + info */
        .sk-unit-header-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sk-sub-unit {
          padding-top: 18px;
        }

        .sk-sub-unit-title {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .sk-sub-unit-members {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .sk-member-chip {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 12px 10px;
          font-size: 0.78rem;
          color: #444;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          min-width: 140px;
          text-align: center;
        }

        /* Placeholder avatar for penasehat names (block over name) */
        .sk-penasehat-info h4 {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin: 0;
        }

        .sk-penasehat-info h4::before {
          content: '';
          display: block;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: #fff;
          border: 2px dashed #e0e0e0;
          margin: 0;
          vertical-align: middle;
        }

        /* Placeholder avatar for member chips (small, above name) */
        .sk-member-chip::before {
          content: '';
          display: block;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: #fff;
          border: 2px dashed #e0e0e0;
          margin: 0 auto 8px auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sk-pimpinan-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .sk-hero-title { font-size: 2rem; }
          .sk-page { padding: 40px 20px 60px; }
        }

        @media (max-width: 480px) {
          .sk-pimpinan-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <main className="sk-body">

        {/* ── Hero Banner ── */}
        <section className="sk-hero">
          <p className="sk-hero-org">Dewan Da'wah Islamiyah Indonesia — Cabang Semarang</p>
          <h1 className="sk-hero-title">
            Struktur <em>Kepengurusan</em>
          </h1>
          <p className="sk-hero-periode">Periode 2024 – 2028</p>
          <div className="sk-hero-tagline">
            Amanah · Da'wah · Khidmah
          </div>
        </section>

        {/* ── Main Content ── */}
        <div className="sk-page">

          {/* ── Dewan Penasehat ── */}
          <div className="sk-section">
            <h2 className="sk-section-title">
              Dewan <em>Penasehat</em>
            </h2>

            <div>
              <div className="sk-penasehat-header">
                <div className="sk-penasehat-header-icon">⚙</div>
                Dewan Penasehat Organisasi
              </div>
              <div className="sk-penasehat-body">
                <div className="sk-penasehat-item">
                  <div className="sk-penasehat-info">
                    <h4>Dr. Ir. Achmad Syafi'i, M.Pd.I.</h4>
                    <span>Ketua DDI Jawa Tengah</span>
                  </div>
                </div>
                <div className="sk-penasehat-item">
                  <div className="sk-penasehat-info">
                    <h4>Drs. Muhammad Asrori, M.Si., M.Pd.I.</h4>
                  </div>
                </div>
                <div className="sk-penasehat-item">
                  <div className="sk-penasehat-info">
                    <h4>Drs. Anwar Cholil</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Pimpinan Harian ── */}
          <div className="sk-section">
            <h2 className="sk-section-title">
              Pimpinan <em>Harian</em>
            </h2>

            <div className="sk-pimpinan-grid">
              <div className="sk-pimpinan-card">
                <div className="sk-pimpinan-avatar no-photo"></div>
                <div className="sk-pimpinan-name">
                  Prof. Ir. Yusuf Dewantoro Herlambang, S.T., M.T., Ph.D.
                </div>
                <div className="sk-pimpinan-role">Ketua Umum</div>
              </div>
              <div className="sk-pimpinan-card">
                <div className="sk-pimpinan-avatar no-photo"></div>
                <div className="sk-pimpinan-name">Sucipto, S.E., Ak</div>
                <div className="sk-pimpinan-role">Wakil Ketua</div>
              </div>
              <div className="sk-pimpinan-card">
                <div className="sk-pimpinan-avatar no-photo"></div>
                <div className="sk-pimpinan-name">Syahid, S.T., M.Eng</div>
                <div className="sk-pimpinan-role">Sekretaris</div>
              </div>
              <div className="sk-pimpinan-card">
                <div className="sk-pimpinan-avatar no-photo"></div>
                <div className="sk-pimpinan-name">
                  Septiantar Tebe Nursaputro, S.T., M.Tr.T.
                </div>
                <div className="sk-pimpinan-role">Bendahara</div>
              </div>
            </div>
          </div>

          {/* ── Unit Pelaksana ── */}
          <div className="sk-section">
            <h2 className="sk-section-title">
              Unit <em>Pelaksana</em>
            </h2>

            {/* Unit I */}
            <div className="sk-unit-card">
              <div className="sk-unit-header">
                <span className="sk-unit-badge sk-unit-badge-i">Unit I</span>
                <div className="sk-unit-info">
                  <h3>Da' wah dan Pendidikan</h3>
                  <div className="sk-unit-avatar no-photo" aria-hidden></div>
                  <p>Ketua: <strong>Prof. Dr.Eng. Ir. Achmad Widodo, S.T., M.T.</strong></p>
                </div>
              </div>
              <div className="sk-unit-body">
                <div className="sk-sub-unit">
                  <div className="sk-sub-unit-title">Sub Unit Pendidikan Tinggi</div>
                  <div className="sk-sub-unit-members">
                    <span className="sk-member-chip">Dr. Norman Iskandar, S.T., M.T.</span>
                    <span className="sk-member-chip">Avicenna An-Nizhami, S.T., M.Sc.</span>
                  </div>
                </div>
                <div className="sk-sub-unit">
                  <div className="sk-sub-unit-title">Sub Unit Pendidikan Dasar &amp; Menengah</div>
                  <div className="sk-sub-unit-members">
                    <span className="sk-member-chip">Sahri, S.Pd.</span>
                  </div>
                </div>
                <div className="sk-sub-unit">
                  <div className="sk-sub-unit-title">Sub Unit Da' wah Kemasyarakatan</div>
                  <div className="sk-sub-unit-members">
                    <span className="sk-member-chip">Muhammad Sigit, A.Md.</span>
                    <span className="sk-member-chip">Genry Nuswantoro, S.S.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Unit II */}
            <div className="sk-unit-card">
              <div className="sk-unit-header">
                <span className="sk-unit-badge sk-unit-badge-ii">Unit II</span>
                <div className="sk-unit-info">
                  <h3>Ekonomi dan Kemasyarakatan</h3>
                  <div className="sk-unit-avatar no-photo" aria-hidden></div>
                  <p>Ketua: <strong>Sapto Brastokoro, S.E.</strong></p>
                </div>
              </div>
              <div className="sk-unit-body">
                <div className="sk-sub-unit">
                  <div className="sk-sub-unit-title">Sub Unit Pemberdayaan Ekonomi</div>
                  <div className="sk-sub-unit-members">
                    <span className="sk-member-chip">Bambang Supradono, S.T., M.Eng.</span>
                    <span className="sk-member-chip">Susilo, S.T.</span>
                    <span className="sk-member-chip">Hamboro Widodo, S.T.</span>
                    <span className="sk-member-chip">Drs. Budhi Hartoyo</span>
                    <span className="sk-member-chip">Venditias Yudha, S.Pd., M.Eng.</span>
                    <span className="sk-member-chip">Abdurrahim</span>
                  </div>
                </div>
                <div className="sk-sub-unit">
                  <div className="sk-sub-unit-title">Sub Unit Kesejahteraan Masyarakat</div>
                  <div className="sk-sub-unit-members">
                    <span className="sk-member-chip">dr. Malik Abdul Hakim</span>
                    <span className="sk-member-chip">dr. Singgih</span>
                    <span className="sk-member-chip">Gelar Purnama, A.Md., Kep.</span>
                    <span className="sk-member-chip">Kasno, S.K.M.</span>
                    <span className="sk-member-chip">Effendi Bayu Ariesta, S.T.</span>
                  </div>
                </div>
                <div className="sk-sub-unit">
                  <div className="sk-sub-unit-title">Sub Unit Penggalangan Dana</div>
                  <div className="sk-sub-unit-members">
                    <span className="sk-member-chip">Ir. Setyo Edhi Nurcahyo</span>
                    <span className="sk-member-chip">Widiyanto Antariksa, S.E.</span>
                    <span className="sk-member-chip">Irsyad Arif, A.Md.</span>
                    <span className="sk-member-chip">Rakiman</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Unit III */}
            <div className="sk-unit-card">
              <div className="sk-unit-header">
                <span className="sk-unit-badge sk-unit-badge-iii">Unit III</span>
                <div className="sk-unit-info">
                  <h3>Teknologi, Informasi dan Komunikasi</h3>
                  <div className="sk-unit-avatar no-photo" aria-hidden></div>
                  <p>Ketua: <strong>Dr. Sukamto, S.Kom., M.T.</strong></p>
                </div>
              </div>
              <div className="sk-unit-body">
                <div className="sk-sub-unit">
                  <div className="sk-sub-unit-title">Sub Unit Sains dan Teknologi</div>
                  <div className="sk-sub-unit-members">
                    <span className="sk-member-chip">Dr.Eng. Ir. Irfan Mujahidin, S.T., M.T., M.Sc.</span>
                    <span className="sk-member-chip">Arif Pambektl, S.T., M.Eng.</span>
                    <span className="sk-member-chip">Nanang Apriandi, S.T., M.T.</span>
                    <span className="sk-member-chip">Paryono</span>
                  </div>
                </div>
                <div className="sk-sub-unit">
                  <div className="sk-sub-unit-title">Sub Unit Informasi dan Komunikasi</div>
                  <div className="sk-sub-unit-members">
                    <span className="sk-member-chip">Dr. Iwan Hermawan, S.Kom., M.T.</span>
                    <span className="sk-member-chip">Suko Tyas Pernanda, S.ST., M.Cs.</span>
                    <span className="sk-member-chip">Darto</span>
                    <span className="sk-member-chip">Abita Syahri Ismail, S.Si.</span>
                    <span className="sk-member-chip">Yulianto Adi Karyono, S.Kom.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
