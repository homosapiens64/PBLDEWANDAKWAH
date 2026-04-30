type NewsItem = {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
};

const beritaNasional: NewsItem[] = [
  {
    title: "Wanita Langka Di Zaman Riya: Ketika Iman Lebih Indah Dari Sorotan Dunia",
    category: "NASIONAL",
    date: "27 AGUSTUS, 2024",
    excerpt:
      "Ketika dunia berkata, \"tunjukkan dirimu agar dianggap penting,\" ia menjawab dalam diam: \"Aku sudah cantik dalam pandangan Rabb-ku.\"",
    image: "/wanita.png",
  },
  {
    title: "Cahaya Ilmu Dari Pesantren: Menyinari Jiwa Dan Peradaban",
    category: "NASIONAL",
    date: "27 AGUSTUS, 2024",
    excerpt:
      "Pesantren merupakan salah satu warisan intelektual Islam paling berharga dalam sejarah bangsa Indonesia.",
    image: "/cahaya.png",
  },
];

const beritaInternasional: NewsItem[] = [
  {
    title: "Petualangan di Alam Terbuka: Jiwa yang Mengenal Kebebasan",
    category: "INTERNASIONAL",
    date: "25 AGUSTUS, 2024",
    excerpt:
      "Petualangan alam membuka mata terhadap kebesaran ciptaan dan makna kehidupan yang sesungguhnya.",
    image: "/misi.png",
  },
  {
    title: "Dakwah Global: Strategi Menjangkau Hati Jutaan Orang",
    category: "INTERNASIONAL",
    date: "22 AGUSTUS, 2024",
    excerpt:
      "Dakwah dengan pendekatan digital membuka peluang keterlibatan komunitas global yang belum pernah terjadi sebelumnya.",
    image: "/inovasi.png",
  },
  {
    title: "Transformasi Sosial: Gerakan Pemuda Muslim Internasional",
    category: "INTERNASIONAL",
    date: "20 AGUSTUS, 2024",
    excerpt:
      "Generasi muda memimpin perubahan sosial dengan nilai-nilai Islam di berbagai belahan dunia.",
    image: "/tentara.png",
  },
];

const kategori = [
  { name: "Semua Berita", count: "48", color: "#2ab7a4" },
  { name: "Nasional", count: "18", color: "#4f7cf7" },
  { name: "Internasional", count: "12", color: "#f0b84f" },
  { name: "Kegiatan DDI", count: "18", color: "#b46df1" },
];

const populer = [
  "Munas DDII 2026 Hasilkan Rekomendasi Strategis",
  "Pelatihan Dai Angkatan XIV Dibuka di Semarang",
  "Bakti Sosial Ramadan: Distribusi 500 Paket Sembako",
  "Platform Dakwah Resmi Diluncurkan DDI Pusat",
];

const videos = [
  {
    title: "Isro launches 104 satellites in a single mission to create world record",
    image: "/roket.png",
    time: "23 JULY | 14:02",
  },
  {
    title: "Style launches 32 satellites in a single mission",
    image: "/tentara.png",
    time: "19 JULY | 11:25",
  },
  {
    title: "New mission reaches lower orbit successfully",
    image: "/inovasi.png",
    time: "18 JULY | 09:40",
  },
];

const tags = ["Dakwah", "Pendidikan", "Dai", "Semarang", "Sosial", "Program Kerja", "Kajian", "Internasional", "Ramadan", "Pelatihan", "JT"];

export default function BeritaPage() {
  return (
    <main className="page">
      <section className="hero container">
        <p className="heroEyebrow">INFORMASI TERKINI</p>
        <h1 className="heroTitle">BERITA &amp; KEGIATAN</h1>

        <article
          className="heroCard"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(17,35,45,0.54) 0%, rgba(17,35,45,0.35) 100%), url('/munas.png')",
          }}
        >
          <div className="heroOverlay">
            <span className="pill">NASIONAL</span>
            <h2>Munas Dewan Da&apos;wah 2026 Hasilkan Rekomendasi Strategis Untuk Dakwah Digital</h2>
            <p>
              <span>By Admin</span>
              <span>27 August, 2024</span>
              <span>20 Mins</span>
            </p>
          </div>
        </article>
      </section>

      <section className="container contentGrid">
        <div className="mainColumn">
          <div className="sectionHead">
            <h3>Berita Nasional</h3>
            <a href="#">VIEW ALL ↗</a>
          </div>

          <div className="cardsGrid">
            {beritaNasional.map((item) => (
              <article key={item.title} className="newsCard">
                <div className="newsImage" style={{ backgroundImage: `url('${item.image}')` }} />
                <div className="newsBody">
                  <span className="pill">{item.category}</span>
                  <h4>{item.title}</h4>
                  <div className="metaRow">
                    <span>{item.date}</span>
                    <span>20 MINS</span>
                  </div>
                  <p>{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>

          <section className="videoSection">
            <div className="videoSectionHead">
              <h3>Videos</h3>
              <a href="#">View all Videos</a>
            </div>

            <div className="videoTabs">
              <button className="videoTabActive">Nasional</button>
              <button>Internasional</button>
              <button>Kegiatan</button>
            </div>

            <div className="videoLayout">
              <article className="featureVideo">
                <div className="featureVideoImage" style={{ backgroundImage: `url('${videos[0].image}')` }} />
                <div className="featureVideoOverlay">
                  <div className="playButton">▶</div>
                  <h4>{videos[0].title}</h4>
                  <span>{videos[0].time}</span>
                </div>
              </article>

              <div className="videoRail">
                {videos.slice(1).map((video) => (
                  <article key={video.title} className="railItem">
                    <div className="railImage" style={{ backgroundImage: `url('${video.image}')` }} />
                    <div className="railOverlay">
                      <div className="playMini">▶</div>
                      <p>{video.title}</p>
                      <span>{video.time}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="sidebar">
          <section className="sideCard">
            <h4>Kategori Berita</h4>
            <div className="categoryList">
              {kategori.map((item) => (
                <div key={item.name} className="categoryItem">
                  <div className="categoryIcon" style={{ background: item.color }} />
                  <div>
                    <strong>{item.name}</strong>
                    <small>
                      {item.name === "Semua Berita"
                        ? "Semua kategori"
                        : item.name === "Nasional"
                          ? "Berita dalam negeri"
                          : item.name === "Internasional"
                            ? "Berita luar negeri"
                            : "Program & aktivitas"}
                    </small>
                  </div>
                  <span>{item.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="sideCard">
            <h4>Berita Terpopuler</h4>
            <ol className="popularList">
              {populer.map((item, index) => (
                <li key={item}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{item}</strong>
                    <small>
                      {index === 0 ? "1,248 pembaca" : index === 1 ? "876 pembaca" : index === 2 ? "712 pembaca" : "634 pembaca"}
                    </small>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="sideCard">
            <h4>Topik Berita</h4>
            <div className="tagCloud">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="container internationalSection">
        <div className="sectionHead">
          <h3>Berita Internasional</h3>
        </div>
        <div className="internationalGrid">
          {beritaInternasional.map((item, idx) => (
            <article key={item.title} className={idx === 0 ? "intlFeature" : "intlCard"}>
              <div
                className={idx === 0 ? "intlFeatureImage" : "intlCardImage"}
                style={{ backgroundImage: `url('${item.image}')` }}
              />
              <div className="intlBody">
                <span className="pill">{item.category}</span>
                <h4>{item.title}</h4>
                <div className="metaRow">
                  <span>{item.date}</span>
                </div>
                {idx === 0 && <p>{item.excerpt}</p>}
              </div>
            </article>
          ))}
        </div>
        <div className="authorGrid">
          <div className="authorCard">
            <div className="authorImage" style={{ backgroundImage: "url('/wanita.png')" }} />
            <h5>Using Instagram Trends to Promote Your</h5>
            <small>27 AUGUST, 2024</small>
          </div>
          <div className="authorCard">
            <div className="authorImage" style={{ backgroundImage: "url('/cahaya.png')" }} />
            <h5>Everything Developers Must Know About</h5>
            <small>25 AUGUST, 2024</small>
          </div>
          <div className="authorCard">
            <div className="authorImage" style={{ backgroundImage: "url('/misi.png')" }} />
            <h5>Implementing Data Authentication in</h5>
            <small>22 AUGUST, 2024</small>
          </div>
        </div>
      </section>

      <section className="subscribe">
        <div className="container">
          <h3>Dapatkan Info &amp; Update Terbaru Kami</h3>
          <form className="subscribeForm">
            <input placeholder="Nama" type="text" />
            <input placeholder="E-mail" type="email" />
            <button type="submit">KIRIM</button>
          </form>
        </div>
      </section>
    </main>
  );
}
