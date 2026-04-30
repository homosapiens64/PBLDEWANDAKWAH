'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
          <Link className={isActive("/Berita") ? "navActive" : undefined} href="/Berita">
            Berita
          </Link>
          <a href="#">Kajian</a>
          <Link className={isActive("/Konsultasi") ? "navActive" : undefined} href="/Konsultasi">
            Konsultasi
          </Link>
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
  );
}