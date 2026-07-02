"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type SearchResult = {
  id: string;
  typeLabel: string;
  title: string;
  href: string;
};

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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"berita" | "pendidikan" | "tentang" | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const closeNavigation = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const submitSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setSearchOpen(false);
    closeNavigation();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  // Live suggestions with debounce.
  useEffect(() => {
    const trimmed = searchQuery.trim();
    const controller = new AbortController();

    if (trimmed.length < 2) {
      const clear = setTimeout(() => {
        setSearchResults([]);
        setSearchLoading(false);
      }, 0);
      return () => clearTimeout(clear);
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("search failed");
        const data = (await response.json()) as { results: SearchResult[] };
        setSearchResults(data.results.slice(0, 6));
      } catch {
        if (!controller.signal.aborted) {
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Close suggestions when clicking outside.
  useEffect(() => {
    if (!searchOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchOpen]);

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

        <div className="searchWrap" ref={searchWrapRef}>
          <form
            className="searchForm"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch();
            }}
          >
            <input
              type="search"
              placeholder="Cari Berita..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              aria-label="Cari di website"
            />
            <button type="submit" aria-label="Cari berita">
              <SearchIcon />
            </button>
          </form>

          {searchOpen && searchQuery.trim().length >= 2 && (
            <div className="searchDropdown" role="listbox">
              {searchLoading && searchResults.length === 0 && (
                <p className="searchDropdownStatus">Mencari…</p>
              )}
              {!searchLoading && searchResults.length === 0 && (
                <p className="searchDropdownStatus">Tidak ada hasil.</p>
              )}
              {searchResults.map((result) => (
                <Link
                  key={result.id}
                  href={result.href}
                  className="searchDropdownItem"
                  role="option"
                  onClick={() => {
                    setSearchOpen(false);
                    closeNavigation();
                  }}
                >
                  <span className="searchDropdownType">{result.typeLabel}</span>
                  <span className="searchDropdownTitle">{result.title}</span>
                </Link>
              ))}
              {searchResults.length > 0 && (
                <button type="button" className="searchDropdownAll" onClick={submitSearch}>
                  Lihat semua hasil untuk “{searchQuery.trim()}”
                </button>
              )}
            </div>
          )}
        </div>

        <Link className="loginNavButton" href="/login" onClick={closeNavigation}>
          <LoginIcon />
          <span>Masuk</span>
        </Link>
      </div>
    </header>
  );
}
