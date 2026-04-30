import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dewan Dakwah Kota Semarang",
  description: "Berita dan kegiatan Dewan Dakwah Kota Semarang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="topStrip">
          <div className="container">
            <div className="topStripInner">
              <div className="topStripLeft">
                <div className="topContactItem">
                  <span className="phoneIcon">☎</span>
                  <span>(029) 555-0129</span>
                </div>
                <span className="dot">|</span>
                <div className="topContactItem">
                  <span className="emailIcon">✉</span>
                  <span>felicia.reid@example.com</span>
                </div>
              </div>
              <div className="topStripRight">
                <div className="langBox">
                  <Image src="/indonesia.png" alt="Indonesia" width={24} height={16} />
                </div>
                <div className="langBox">
                  <Image src="/amerika.png" alt="America" width={24} height={16} />
                </div>
                <div className="langBox">
                  <Image src="/arab.png" alt="Arab" width={24} height={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <header className="header">
          <div className="container headerInner">
            <a className="logo" href="#" aria-label="Dewan Dakwah Kota Semarang">
              <Image
                src="/logo.png"
                alt="Logo Dewan Dakwah Kota Semarang"
                width={160}
                height={64}
                className="logoImage"
                priority
              />
            </a>

            <nav className="nav">
              <a href="#">Beranda</a>
              <a className="navActive" href="#">
                Berita
              </a>
              <a href="#">Kajian</a>
              <a href="#">Konsultasi</a>
              <a href="#">Tentang Kami</a>
            </nav>

            <div className="searchWrap">
              <input placeholder="Cari Berita, Kajian, Program..." />
              <button type="button" aria-label="search">
                ⌕
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="footer">
          <div className="container">
            <div className="footerGrid">
              <div>
                <h4>DEWAN DAKWAH ISLAMIYAH INDONESIA KOTA SEMARANG</h4>
                <p>
                  Jl. Tlogo Asri Raya, Semarang Selatan, Jawa Tengah. Melayani dakwah,
                  pendidikan, dan gerakan sosial umat.
                </p>
              </div>
              <div>
                <h4>Menu</h4>
                <ul>
                  <li>Beranda</li>
                  <li>Berita</li>
                  <li>Kajian</li>
                  <li>Tentang Kami</li>
                </ul>
              </div>
              <div>
                <h4>Our Partners</h4>
                <ul>
                  <li>DDII Pusat</li>
                  <li>DDII Semarang</li>
                  <li>Program Sosial</li>
                  <li>Relawan</li>
                </ul>
              </div>
            </div>
            <div className="footerBar">
              <span>© 2026 Dewan Dakwah. All rights reserved.</span>
              <span>Design by KGLD Studio</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
