import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";

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

        <Footer />
      </body>
    </html>
  );
}
// Update the SiteHeader component to include the new "Pendidikan"
