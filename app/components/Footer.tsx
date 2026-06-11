import Image from "next/image";
import Link from "next/link";

const primaryLinks = [
  { label: "Beranda", href: "/" },
  { label: "Berita", href: "/Berita/Terkini" },
  { label: "Kajian", href: "/Kajian" },
  { label: "Konsultasi", href: "/Konsultasi" },
  { label: "Pendidikan", href: "/Pendidikan/Institusi" },
];

const aboutLinks = [
  { label: "Profil Organisasi", href: "/TentangKami/Profile" },
  { label: "AD & ART", href: "/TentangKami/AdDanArt" },
  { label: "Struktur Kepengurusan", href: "/TentangKami/StrukturKepengurusan" },
  { label: "Program Kerja", href: "/TentangKami/Program" },
];

export default function Footer() {
  return (
    <footer className="siteFooter">
      <div className="container siteFooterGrid">
        <div className="siteFooterBrand">
          <Image
            src="/logo.png"
            alt="Dewan Da'wah Kota Semarang"
            width={300}
            height={120}
          />
          <p>
            Menguatkan dakwah, pendidikan, dan pelayanan umat di Kota Semarang
            melalui program yang amanah dan berkelanjutan.
          </p>
        </div>

        <div className="siteFooterColumn">
          <h3>Navigasi</h3>
          {primaryLinks.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </div>

        <div className="siteFooterColumn">
          <h3>Tentang Kami</h3>
          {aboutLinks.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </div>

        <div className="siteFooterContact">
          <h3>Hubungi Kami</h3>
          <p>Jl. Wirijan, Semarang Tengah</p>
          <a href="mailto:info@dewandakwah-semarang.or.id">
            info@dewandakwah-semarang.or.id
          </a>
          <a href="tel:+62241234567">(024) 123-4567</a>
          <Link className="siteFooterLogin" href="/login">Masuk ke Sistem Internal</Link>
        </div>
      </div>

      <div className="siteFooterBottom">
        <div className="container">
          <p>&copy; 2026 Dewan Da&apos;wah Islamiyah Indonesia Kota Semarang.</p>
          <p>Dikelola untuk pelayanan dakwah dan umat.</p>
        </div>
      </div>
    </footer>
  );
}
