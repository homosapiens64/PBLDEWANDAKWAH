const topicCards = [
  {
    title: "Hukum Islam",
    description: "Fiqih, ibadah, muamalah, dan adab sehari-hari.",
    icon: "◌",
    active: true,
  },
  {
    title: "Keluarga Sakinah",
    description: "Pernikahan, waris, rumah tangga, dan anak.",
    icon: "◔",
    active: false,
  },
];

const recentConsultations = [
  {
    title: "Hukum zakat penghasilan dari gaji suami yang harus?",
    category: "Fiqih",
    date: "21 Jul 2025",
  },
  {
    title: "Tata cara melamar dalam ikatan yang sesuai syariat",
    category: "Keluarga",
    date: "20 Jul 2025",
  },
  {
    title: "Bolehkah bekerja di perusahaan yang menjual produk non-halal?",
    category: "Ekonomi Islam",
    date: "19 Jul 2025",
  },
];

const ustadzList = [
  "Dr. Ahmad Hadi, Lc",
  "Dr. Saiful Rahman, M.A",
  "Dr. Fathur Rahman, Lc",
  "Ust. Hasan Sabil, M.Ag",
];

const faqItems = [
  "Seberapa cepat pertanyaan dijawab?",
  "Apakah jawaban dikirim via email?",
  "Bagaimana jika pertanyaan saya sensitif?",
  "Apakah pertanyaan bisa anonim?",
];

const tips = [
  "Sampaikan pertanyaan dengan singkat dan jelas.",
  "Sertakan kronologi agar ustadz bisa melihat konteks.",
  "Jika perlu, lampirkan foto atau dokumen pendukung.",
  "Gunakan bahasa yang sopan dan mudah dipahami.",
];

export default function KonsultasiPage() {
  return (
    <main className="page konsultasiPage">
      <section className="container consultHero">
        <p className="consultEyebrow">Layanan Islami Terpercaya</p>
        <h1 className="consultTitle">
          Konsultasi<span>Agama</span>
        </h1>
        <p className="consultLead">
          Tim Ustadz Dewan Dakwah siap menjawab pertanyaan seputar hukum Islam dan keluarga
          secara gratis, terpercaya, dan berlandaskan Al-Qur'an serta Sunnah.
        </p>

        <div className="consultTopicsHeader">PILIH TOPIK KONSULTASI</div>
        <div className="consultTopicRow">
          {topicCards.map((topic) => (
            <article key={topic.title} className={`consultTopicCard ${topic.active ? "active" : ""}`}>
              <div className="consultTopicIcon">{topic.icon}</div>
              <div className="consultTopicCopy">
                <h2>{topic.title}</h2>
                <p>{topic.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container consultLayout">
        <div className="consultMainColumn">
          <section className="consultFormCard">
            <div className="consultFormHead">
              <div>
                <p>Form Pertanyaan</p>
                <h2>Hubungi Kami</h2>
              </div>
              <span>Aktif 08.00 - 16.00</span>
            </div>

            <div className="consultFormBar">
              <span className="consultBarIcon">☎</span>
              <div>
                <strong>Form Pertanyaan - Hubungi Kami</strong>
                <p>Isi data dengan lengkap agar jawaban dapat diproses lebih cepat.</p>
              </div>
            </div>

            <form className="consultFormGrid">
              <label>
                Nama Lengkap <span>*</span>
                <input type="text" placeholder="Nama Anda..." />
              </label>
              <label>
                Email <span>*</span>
                <input type="email" placeholder="email@domain.com" />
              </label>
              <label>
                No. WhatsApp
                <input type="tel" placeholder="08xx-xxxx-xxxx" />
              </label>
              <label>
                Sub-topik <span>*</span>
                <select defaultValue="">
                  <option value="" disabled>
                    Pilih sub-topik...
                  </option>
                  <option>Fiqih Ibadah</option>
                  <option>Keluarga & Pernikahan</option>
                  <option>Akidah & Tauhid</option>
                  <option>Pendidikan Anak</option>
                </select>
              </label>
              <label className="fullWidth">
                Judul Pertanyaan <span>*</span>
                <input type="text" placeholder="Ringkasan singkat pertanyaan Anda" />
              </label>
              <label className="fullWidth">
                Isi Pertanyaan <span>*</span>
                <textarea
                  rows={6}
                  placeholder="Jelaskan pertanyaan Anda secara lengkap dan detail. Sertakan konteks bila perlu."
                />
              </label>

              <div className="uploadBox fullWidth">
                <div className="uploadIcon">☁</div>
                <div>
                  <strong>Klik atau tarik file ke sini</strong>
                  <p>JPG, PNG, atau PDF. Maksimum 10 MB.</p>
                </div>
              </div>

              <label className="checkLine fullWidth">
                <input type="checkbox" defaultChecked />
                Saya setuju data diproses untuk keperluan konsultasi.
              </label>
              <label className="checkLine fullWidth">
                <input type="checkbox" defaultChecked />
                Saya menyetujui kontak lanjutan melalui WhatsApp atau email.
              </label>

              <button type="submit" className="primaryButton fullWidth">
                Kirim Pertanyaan
              </button>
              <button type="button" className="whatsappButton fullWidth">
                Konsultasi Langsung via WhatsApp
              </button>
            </form>
          </section>

          <section className="consultRecentCard">
            <div className="sectionHead compact">
              <div>
                <p className="sectionEyebrow">Recent Konsultasi Sakin</p>
                <h3>Recent Konsultasi Sava</h3>
              </div>
              <a href="#">Lihat Semua</a>
            </div>

            <div className="recentList">
              {recentConsultations.map((item, index) => (
                <article key={item.title} className="recentItem">
                  <div className="recentIndex">{index + 1}</div>
                  <div className="recentContent">
                    <h4>{item.title}</h4>
                    <div className="recentMeta">
                      <span className="pill tiny">{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="consultSidebar">
          <section className="sidebarCard chatCard darkCard">
            <p className="sidebarTitle">Chat Langsung dengan Ustadz</p>
            <div className="chatHeader">
              <div className="chatAvatar">TS</div>
              <div>
                <strong>Tim Ustadz DDI Semarang</strong>
                <p>Online</p>
              </div>
            </div>

            <div className="chatMessage user">Apa hukum zakat penghasilan?</div>
            <div className="chatMessage admin">Silakan kirim nominal gaji dan kebutuhan pokoknya.</div>
            <div className="chatMessage user">Baik, saya kirimkan data via form.</div>

            <div className="chatInputRow">
              <input type="text" placeholder="Tulis pesan disini..." />
              <button type="button">➤</button>
            </div>
          </section>

          <section className="sidebarCard whiteCard">
            <p className="sidebarTitle muted">Ustadz Bersertifikat</p>
            <div className="ustadzList">
              {ustadzList.map((name, index) => (
                <div key={name} className="ustadzItem">
                  <div className="ustadzAvatar">{index + 1}</div>
                  <div>
                    <strong>{name}</strong>
                    <p>Spesialis fikih dan pembinaan keluarga</p>
                  </div>
                  <span className="statusDot" />
                </div>
              ))}
            </div>
          </section>

          <section className="sidebarCard whiteCard">
            <p className="sidebarTitle muted">Tips Konsultasi</p>
            <div className="tipsList">
              {tips.map((tip) => (
                <div key={tip} className="tipItem">
                  <span>•</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="sidebarCard whiteCard">
            <p className="sidebarTitle muted">Pertanyaan Umum (FAQ)</p>
            <div className="faqList">
              {faqItems.map((item) => (
                <details key={item}>
                  <summary>{item}</summary>
                  <p>Jawaban diberikan oleh tim ustadz sesuai konteks pertanyaan dan urgensinya.</p>
                </details>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}