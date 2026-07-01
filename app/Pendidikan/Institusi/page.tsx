import Link from "next/link";
import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Home,
  MapPin,
  Megaphone,
  Mic,
  PenLine,
  Send,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Tag {
  icon: LucideIcon;
  label: string;
  variant?: "green" | "default";
}

interface Institution {
  id: string;
  href: string;
  name: string;
  subtitle: string;
  description: string;
  tags: Tag[];
  imageAlt: string;
  reverse?: boolean;
  featureIcon: LucideIcon;
}

const institutions: Institution[] = [
  {
    id: "adi",
    href: "/Pendidikan/ADI",
    name: "ADI",
    subtitle: "Akademi Da'wah Islam Indonesia - Cabang Semarang",
    description:
      "ADI adalah lembaga pendidikan tinggi vokasi yang berfokus pada pembinaan kader da'i profesional. Mahasiswa ADI dibekali ilmu syariah, metode dakwah, kepemimpinan Islam, dan keterampilan komunikasi publik agar siap berdakwah di tengah masyarakat.",
    tags: [
      { icon: MapPin, label: "Jl. Wajan, Semarang Tengah" },
      { icon: CalendarDays, label: "Pendaftaran: Juni - Agustus" },
      { icon: Users, label: "Kapasitas: 60 mahasiswa/angkatan", variant: "green" },
      { icon: GraduationCap, label: "Jenjang: D3 / Vokasi" },
    ],
    imageAlt: "Kampus ADI",
    featureIcon: GraduationCap,
  },
  {
    id: "ponpes",
    href: "/Pendidikan/PonpesSuruh",
    name: "PONPES SURUH",
    subtitle: "Lembaga Pendidikan Islam - Kota Semarang",
    description:
      "Pondok Pesantren Suruh adalah lembaga pendidikan Islam tradisional yang berada di bawah naungan Dewan Da'wah Islamiyah Indonesia Cabang Semarang. Pesantren ini menggabungkan pendidikan salaf yang kuat dengan kurikulum modern.",
    tags: [
      { icon: MapPin, label: "Kec. Suruh, Kab. Semarang" },
      { icon: Home, label: "Sistem: Mukim (Boarding)", variant: "green" },
      { icon: Users, label: "Penerimaan: Putra & Putri" },
      { icon: CalendarDays, label: "Pendaftaran: Mei - Juli" },
    ],
    imageAlt: "Pondok Pesantren Suruh",
    reverse: true,
    featureIcon: BookOpen,
  },
  {
    id: "khawarizmi",
    href: "/Pendidikan/AlKhawarizmi",
    name: "Al Khawarizmi",
    subtitle: "Lembaga Pendidikan Islam - Terafiliasi DDI Cabang Semarang",
    description:
      "Al Khawarizmi adalah lembaga pendidikan Islam terpadu yang mengintegrasikan ilmu agama dengan ilmu sains dan teknologi modern, bertekad melahirkan generasi Muslim yang unggul secara akademik dan kuat secara aqidah.",
    tags: [
      { icon: MapPin, label: "Kota Semarang" },
      { icon: Home, label: "Sistem: Full Day School" },
      { icon: CheckCircle2, label: "Akreditasi: A (Kemenag)", variant: "green" },
      { icon: Users, label: "Penerimaan: Putra & Putri" },
    ],
    imageAlt: "Al Khawarizmi",
    featureIcon: Award,
  },
];

const registrationSteps = [
  { icon: PenLine, label: "Daftar Online" },
  { icon: Mic, label: "Wawancara" },
  { icon: Megaphone, label: "Pengumuman" },
  { icon: ClipboardList, label: "Heregistrasi" },
  { icon: BookOpen, label: "Selesai" },
];

export default function Institusi() {
  return (
    <main className="educationPublicIndex">
      <section className="educationHero">
        <div className="container">
          <h1>
            Pendidikan <em>Islami</em>
            <br />
            Berkualitas &amp; Terpercaya
          </h1>
          <p>
            DDI Semarang mengelola 3 lembaga pendidikan Islam unggulan, dari tingkat pesantren
            hingga <strong>perguruan tinggi</strong>, untuk mencetak generasi Muslim yang berilmu,
            berakhlak, dan berdakwah.
          </p>
        </div>
      </section>

      <section className="educationInstitutionSection">
        <div className="container grid gap-8 lg:gap-12">
          {institutions.map((institution) => {
            const FeatureIcon = institution.featureIcon;

            return (
              <article
                className={`educationInstitutionCard flex flex-col overflow-hidden lg:flex-row ${
                  institution.reverse ? "lg:flex-row-reverse" : ""
                }`}
                key={institution.id}
              >
                <div className="educationInstitutionContent">
                  <div className="educationInstitutionHeading">
                    <span aria-hidden="true">
                      <FeatureIcon />
                    </span>
                    <div>
                      <h2>{institution.name}</h2>
                      <p>{institution.subtitle}</p>
                    </div>
                  </div>

                  <p className="educationInstitutionDescription">{institution.description}</p>

                  <div className="educationTagList" aria-label={`Informasi ${institution.name}`}>
                    {institution.tags.map((tag) => {
                      const TagIcon = tag.icon;

                      return (
                        <span className={tag.variant === "green" ? "green" : undefined} key={tag.label}>
                          <TagIcon aria-hidden="true" />
                          {tag.label}
                        </span>
                      );
                    })}
                  </div>

                  <div className="educationInstitutionActions">
                    <Link className="educationPrimaryButton" href={institution.href}>
                      Selengkapnya
                    </Link>
                    <Link className="educationSecondaryButton" href="/Pendidikan/pmb">
                      Daftar
                      <Send aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <div className={`educationInstitutionBanner ${institution.id}`}>
                  <FeatureIcon aria-hidden="true" />
                  <span>{institution.imageAlt}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="educationRegistrationFlow">
        <div className="container">
          <h2>Alur Pendaftaran</h2>
          <p>Panduan lengkap untuk mengikuti program pendidikan di lembaga DDI Semarang.</p>

          <div className="educationFlowGrid">
            {registrationSteps.map((step, index) => {
              const StepIcon = step.icon;

              return (
                <div className="educationFlowStep" key={step.label}>
                  <span className="educationFlowNumber">{index + 1}</span>
                  <span className="educationFlowIcon">
                    <StepIcon aria-hidden="true" />
                  </span>
                  <strong>{step.label}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
