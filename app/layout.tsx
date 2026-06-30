import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Script from "next/script";
import "./globals.css";
import "./portal.css";
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
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="remove-extension-hydration-attributes"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                function clean(root) {
                  if (!root) return;
                  if (root.removeAttribute && root.hasAttribute && root.hasAttribute("fdprocessedid")) {
                    root.removeAttribute("fdprocessedid");
                  }
                  if (!root.querySelectorAll) return;
                  root.querySelectorAll("[fdprocessedid]").forEach(function (element) {
                    element.removeAttribute("fdprocessedid");
                  });
                }

                clean(document.documentElement);

                if (!window.MutationObserver) return;
                new MutationObserver(function (mutations) {
                  mutations.forEach(function (mutation) {
                    if (mutation.type === "attributes" && mutation.attributeName === "fdprocessedid") {
                      mutation.target.removeAttribute("fdprocessedid");
                    }
                    mutation.addedNodes.forEach(clean);
                  });
                }).observe(document.documentElement, {
                  attributeFilter: ["fdprocessedid"],
                  attributes: true,
                  childList: true,
                  subtree: true
                });
              })();
            `,
          }}
        />
        <div className="topStrip">
          <div className="container">
            <div className="topStripInner">
              <div className="topStripLeft">
                <div className="topContactItem">
                  <svg className="topIcon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L8 9.69a16 16 0 0 0 6.31 6.31l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  <span>(629) 555-0129</span>
                </div>
                <span className="dot">|</span>
                <div className="topContactItem">
                  <svg className="topIcon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 4h16v16H4z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                  <a href="mailto:info@dewandakwahsemarang.com">
                    info@dewandakwahsemarang.com
                  </a>
                </div>
              </div>

              <div className="topStripRight">
                <span className="dot">|</span>
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
