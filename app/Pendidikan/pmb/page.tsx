import Link from "next/link";
import { Building2, GraduationCap, School } from "lucide-react";

const schools = [
  {
    description: "Program Diploma Da'wah & Kepemimpinan Islam",
    href: "/Pendidikan/pendaftaran?institution=adi",
    icon: GraduationCap,
    name: "ADI (Akademi Da'wah Indonesia)",
    tone: "green",
  },
  {
    description: "Pondok Pesantren Terpadu",
    href: "/Pendidikan/pendaftaran?institution=ponpes-suruh",
    icon: School,
    name: "Ponpes Suruh",
    tone: "teal",
  },
  {
    description: "Sekolah Islam Terpadu",
    href: "/Pendidikan/pendaftaran?institution=al-khawarizmi",
    icon: Building2,
    name: "Al Khawarizmi",
    tone: "blue",
  },
];

export default function PmbPortalPage() {
  return (
    <main className="pmbAuthPage pmbPortalPage">
      <section className="pmbPortalShell">
        <div className="pmbAuthBrand">
          <span>DD</span>
          <h1>Portal PMB DDI Semarang</h1>
          <p>Penerimaan Peserta Didik Baru Tahun 2026</p>
          <Link className="pmbBackHome" href="/">
            &lt;- Kembali ke Beranda
          </Link>
        </div>

        <div className="pmbSchoolGrid" aria-label="Pilihan lembaga PMB">
          {schools.map((school) => {
            const Icon = school.icon;

            return (
              <Link className="pmbSchoolCard" href={school.href} key={school.name}>
                <span className={`pmbSchoolIcon ${school.tone}`}>
                  <Icon aria-hidden="true" />
                </span>
                <strong>{school.name}</strong>
                <small>{school.description}</small>
                <em>Isi Formulir -&gt;</em>
              </Link>
            );
          })}
        </div>

        <section className="pmbLoginCallout">
          <Link href="/Pendidikan/pmb/dashboard">
            Login & Cek Status Pendaftaran
            <b aria-hidden="true">-&gt;</b>
          </Link>
          <p>Gunakan NISN + email untuk masuk ke dashboard pendaftaran</p>
        </section>

        <p className="pmbAuthFooter">
          &copy; 2026 DDI Semarang &middot; Portal Penerimaan Peserta Didik Baru
        </p>
      </section>
    </main>
  );
}
