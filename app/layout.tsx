import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dewan Da'wah Kota Semarang",
  description: "Berita dan kegiatan Dewan Da'wah Kota Semarang",
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
                    <Image src="/america.png" alt="Amerika Serikat" width={24} height={16} />
                </div>
                <div className="langBox">
                  <Image src="/arab.png" alt="Arab" width={24} height={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <SiteHeader />

        <div className="flex-1">{children}</div>

        <footer className="footer">
          <div className="container">
            <div className="footerGrid">
              <div className="footerBrand">
                <h2>
                  <span>DEWAN DA'WAH</span>
                  <span>ISLAMIYAH</span>
                  <span>INDONESIA</span>
                  <span>KOTA</span>
                  <span>SEMARANG</span>
                </h2>
                <p className="brandContact">dewandawahnslamayahsemarang@gmail.com<br/>15Th Street Avenue, New York, USA<br/>011-554-8798-6556</p>
                <div className="socialRow">
                  <a aria-label="facebook" href="#" className="socialIcon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8.5v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.07 1.8.07v2h-1c-1 0-1.3.62-1.3 1.2V12h2.3l-.37 3h-1.93v7A10 10 0 0 0 22 12z" strokeWidth="0" fill="#fff" />
                    </svg>
                  </a>
                  <a aria-label="instagram" href="#" className="socialIcon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="0" fill="#fff" />
                      <circle cx="12" cy="12" r="3.2" fill="#16a085" />
                    </svg>
                  </a>
                  <a aria-label="twitter" href="#" className="socialIcon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M22 5.92c-.66.3-1.37.5-2.12.6.76-.45 1.34-1.17 1.61-2.03-.71.42-1.5.72-2.34.89A4.03 4.03 0 0 0 12.3 9.9c0 .32.03.63.1.93-3.36-.17-6.34-1.78-8.34-4.23-.35.6-.56 1.3-.56 2.05 0 1.42.72 2.67 1.81 3.4-.67-.02-1.3-.2-1.85-.5v.05c0 1.98 1.42 3.63 3.3 4-.35.1-.72.15-1.1.15-.27 0-.54-.03-.8-.08.54 1.72 2.1 2.97 3.95 3.01A8.12 8.12 0 0 1 2 19.54a11.47 11.47 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68v-.53c.8-.58 1.5-1.3 2.05-2.12-.74.33-1.54.56-2.36.66z" strokeWidth="0" fill="#fff"/>
                    </svg>
                  </a>
                  <a aria-label="whatsapp" href="#" className="socialIcon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M20.5 3.5A11 11 0 0 0 3 20.6L3 22l1.5-.4A11 11 0 1 0 20.5 3.5zM12 6.8c-2.3 0-4.1 1.9-4.1 4.2 0 .7.2 1.3.5 1.8L8.1 15l1.3-.3c.4.2.9.3 1.6.3 2.3 0 4.1-1.9 4.1-4.2S14.3 6.8 12 6.8z" strokeWidth="0" fill="#fff"/>
                    </svg>
                  </a>
                  <a aria-label="linkedin" href="#" className="socialIcon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M4.98 3.5A2.5 2.5 0 1 0 4.96 8 2.5 2.5 0 0 0 4.98 3.5zM3 9h3.96V21H3zM9.5 9H13v1.71c.54-.9 1.72-1.71 3.54-1.71 3.78 0 4.5 2.49 4.5 5.73V21H17v-5.04c0-1.2-.02-2.75-1.68-2.75-1.68 0-1.94 1.31-1.94 2.66V21H9.5z" strokeWidth="0" fill="#fff"/>
                    </svg>
                  </a>
                  <a aria-label="dribbble" href="#" className="socialIcon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <circle cx="12" cy="12" r="9" strokeWidth="0" fill="#fff"/>
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h4>MENU</h4>
                <ul>
                  <li><Link href="/">Beranda</Link></li>
                  <li><Link href="/Berita">Berita</Link></li>
                  <li><Link href="/Kajian">Kajian</Link></li>
                  <li><Link href="/Konsultasi">Konsultasi</Link></li>
                  <li><Link href="/Galeri">Galeri</Link></li>
                  <li><Link href="/TentangKami">Tentang Kami</Link></li>
                </ul>
              </div>

              <div>
                <h4>MENU</h4>
                <ul>
                  <li>Our Partners</li>
                  <li>Buy a T-shirt</li>
                  <li>Adopt an Animal</li>
                  <li>Donate</li>
                </ul>
              </div>

              <div>
                <h4>OUR PARTNERS</h4>
                <ul>
                  <li>DDII Pusat</li>
                  <li>DDII Semarang</li>
                  <li>Program Sosial</li>
                  <li>Relawan</li>
                </ul>
              </div>
            </div>
            <div className="footerBar">
              <span>© 2026 DDI Semarang Organization All Rights Reserved.</span>
              <span>Design by IK-2A Polines</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
