"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const beritaMenu = [
  { label: "Terkini", href: "/Berita/Terkini" },
  { label: "Kegiatan", href: "/Berita/Kegiatan" },
  { label: "Nasional", href: "/Berita/Nasional" },
  { label: "Internasional", href: "/Berita/Internasional" },
];

const tentangKamiMenu = [
  { label: "Profil Organisasi", href: "/TentangKami/Profile" },
  { label: "AD & ART", href: "/TentangKami/AdDanArt" },
  { label: "Struktur Kepengurusan", href: "/TentangKami/StrukturKepengurusan" },
  { label: "Program Kerja", href: "/TentangKami/Program" },
];

const pendidikanMenu = [
  { label: "ADI", href: "/Pendidikan/ADI" },
  { label: "Ponpes Suruh", href: "/Pendidikan/PonpesSuruh" },
  { label: "Al Khawarizmi", href: "/Pendidikan/AlKhawarizmi" },
];

function ChevronDown() {
  return (
    <svg className="navCaret" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 3.5 3.5" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 16h13" />
      <path d="m15 10 6 6-6 6" />
      <path d="M19 6h5a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-5" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {open ? (
        <path d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"berita" | "pendidikan" | "tentang" | null>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const closeNavigation = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header className="header">
      <div className="container headerInner">
        <Link className="logo" href="/" aria-label="Dewan Da'wah Kota Semarang">
          <Image
            src="/logo.png"
            alt="Logo Dewan Da'wah Kota Semarang"
            width={320}
            height={120}
            className="logoImage"
            style={{ height: "auto" }}
            priority
          />
        </Link>

        <button
          className="mobileNavButton"
          type="button"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
        >
          <MenuIcon open={mobileOpen} />
        </button>

        <nav className={`nav${mobileOpen ? " mobileOpen" : ""}`} aria-label="Navigasi utama">
          <Link className={isActive("/") ? "navActive" : undefined} href="/" onClick={closeNavigation}>
            Beranda
          </Link>

          <div className={`navGroup ${isActive("/Berita") ? "navGroupActive" : ""} ${openDropdown === "berita" ? "menuOpen" : ""}`}>
            <button
              type="button"
              className={isActive("/Berita") ? "navActive navLabel navTrigger" : "navLabel navTrigger"}
              aria-haspopup="true"
              aria-expanded={openDropdown === "berita"}
              onClick={() => setOpenDropdown((current) => current === "berita" ? null : "berita")}
            >
              <span>Berita</span>
              <ChevronDown />
            </button>
            <div className="navMenu" role="menu" aria-label="Menu Berita">
              {beritaMenu.map((item) => (
                <Link key={item.href} className="navMenuItem" href={item.href} role="menuitem" onClick={closeNavigation}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            className={isActive("/Kajian") ? "navActive navLabel" : "navLabel"}
            href="/Kajian"
            onClick={closeNavigation}
          >
            <span>Kajian</span>
          </Link>

          <Link className={isActive("/Konsultasi") ? "navActive" : undefined} href="/Konsultasi" onClick={closeNavigation}>
            Konsultasi
          </Link>

          <div className={`navGroup educationNavGroup ${isActive("/Pendidikan") ? "navGroupActive" : ""} ${openDropdown === "pendidikan" ? "menuOpen" : ""}`}>
            <Link
              className={isActive("/Pendidikan") ? "navActive navLabel navSplitLink" : "navLabel navSplitLink"}
              href="/Pendidikan"
              onClick={closeNavigation}
            >
              <span>Pendidikan</span>
            </Link>
            <button
              type="button"
              className="navDropdownToggle"
              aria-label="Buka menu Pendidikan"
              aria-haspopup="true"
              aria-expanded={openDropdown === "pendidikan"}
              onClick={() => setOpenDropdown((current) => current === "pendidikan" ? null : "pendidikan")}
            >
              <ChevronDown />
            </button>
            <div className="navMenu" role="menu" aria-label="Menu Pendidikan">
              {pendidikanMenu.map((item) => (
                <Link
                  key={item.href}
                  className={isActive(item.href) ? "navMenuItem active" : "navMenuItem"}
                  href={item.href}
                  role="menuitem"
                  onClick={closeNavigation}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={`navGroup ${isActive("/TentangKami") ? "navGroupActive" : ""} ${openDropdown === "tentang" ? "menuOpen" : ""}`}>
            <button
              type="button"
              className={isActive("/TentangKami") ? "navActive navLabel navTrigger" : "navLabel navTrigger"}
              aria-haspopup="true"
              aria-expanded={openDropdown === "tentang"}
              onClick={() => setOpenDropdown((current) => current === "tentang" ? null : "tentang")}
            >
              <span>Tentang Kami</span>
              <ChevronDown />
            </button>
            <div className="navMenu" role="menu" aria-label="Menu Tentang Kami">
              {tentangKamiMenu.map((item) => (
                <Link key={item.href} className="navMenuItem" href={item.href} role="menuitem" onClick={closeNavigation}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="searchWrap">
          <input placeholder="Cari Berita..." />
          <button type="button" aria-label="Cari berita">
            <SearchIcon />
          </button>
        </div>

        <Link className="loginNavButton" href="/login" onClick={closeNavigation}>
          <LoginIcon />
          <span>Masuk</span>
        </Link>
      </div>
    </header>
  );
}
