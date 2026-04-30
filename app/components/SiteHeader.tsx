"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const beritaMenu = [
  { label: "Kegiatan", href: "/Berita/Kegiatan" },
  { label: "Nasional", href: "/Berita/Nasional" },
  { label: "Internasional", href: "/Berita/Internasional" },
];

const tentangKamiMenu = [
  { label: "AD dan ART", href: "/TentangKami/AdDanArt" },
  { label: "Struktur Kepengurusan", href: "/TentangKami/StrukturKepengurusan" },
  { label: "Program", href: "/TentangKami/Program" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="header">
      <div className="container headerInner">
        <Link className="logo" href="/" aria-label="Dewan Dakwah Kota Semarang">
          <Image
            src="/logo.png"
            alt="Logo Dewan Dakwah Kota Semarang"
            width={160}
            height={64}
            className="logoImage"
            priority
          />
        </Link>

        <nav className="nav" aria-label="Navigasi utama">
          <Link className={isActive("/") ? "navActive" : undefined} href="/">
            Beranda
          </Link>

          <div className={`navGroup ${isActive("/Berita") ? "navGroupActive" : ""}`}>
            <Link
              className={isActive("/Berita") ? "navActive navLabel" : "navLabel"}
              href="/Berita"
            >
              <span>Berita</span>
              <span className="navCaret" aria-hidden="true">
                ▾
              </span>
            </Link>
            <div className="navMenu" role="menu" aria-label="Menu Berita">
              {beritaMenu.map((item) => (
                <Link key={item.href} className="navMenuItem" href={item.href} role="menuitem">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link className={isActive("/Kajian") ? "navActive" : undefined} href="/Kajian">
            Kajian
          </Link>

          <Link className={isActive("/Konsultasi") ? "navActive" : undefined} href="/Konsultasi">
            Konsultasi
          </Link>

          <div className={`navGroup ${isActive("/TentangKami") ? "navGroupActive" : ""}`}>
            <Link
              className={isActive("/TentangKami") ? "navActive navLabel" : "navLabel"}
              href="/TentangKami"
            >
              <span>Tentang Kami</span>
              <span className="navCaret" aria-hidden="true">
                ▾
              </span>
            </Link>
            <div className="navMenu" role="menu" aria-label="Menu Tentang Kami">
              {tentangKamiMenu.map((item) => (
                <Link key={item.href} className="navMenuItem" href={item.href} role="menuitem">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="searchWrap">
          <input placeholder="Cari Berita, Kajian, Program..." />
          <button type="button" aria-label="search">
            ⌕
          </button>
        </div>
      </div>
    </header>
  );
}