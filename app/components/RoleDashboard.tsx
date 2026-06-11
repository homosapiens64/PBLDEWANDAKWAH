import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "../login/actions";
import { requireRole, roleLabels, type UserRole } from "../lib/auth";
import FinanceWorkspace, { type FinanceView } from "./FinanceWorkspace";
import type { FinanceTransaction } from "./FinanceWorkspace";
import ContentManager from "./ContentManager";
import KajianManager from "./KajianManager";
import AboutManager from "./AboutManager";
import NewsManager from "./NewsManager";
import { getContentItems, getModuleContentItems } from "../lib/content";
import { prisma } from "../lib/prisma";

const roleTitles: Record<UserRole, string> = {
  admin: "Administrator",
  pengurus: "Pengurus",
  bendahara: "Bendahara",
  ustadz: "Ustadz",
};

const roleStats: Record<
  UserRole,
  Array<{
    accent: string;
    icon: string;
    label: string;
    tone: string;
    value: string;
    width: string;
  }>
> = {
  admin: [
    { icon: "down", value: "Rp 48,5jt", label: "Total Pemasukan Bulan Ini", tone: "+12%", accent: "green", width: "72%" },
    { icon: "up", value: "Rp 31,2jt", label: "Total Pengeluaran Bulan Ini", tone: "+5%", accent: "red", width: "48%" },
    { icon: "wallet", value: "Rp 17,3jt", label: "Saldo Kas Akhir", tone: "Surplus", accent: "blue", width: "56%" },
    { icon: "users", value: "47", label: "Total Pendaftar PMB", tone: "+8", accent: "gold", width: "60%" },
    { icon: "chat", value: "3", label: "Konsultasi Belum Dijawab", tone: "Perlu Jawab", accent: "purple", width: "30%" },
  ],
  pengurus: [
    { icon: "down", value: "18", label: "Program Aktif Bulan Ini", tone: "+6", accent: "green", width: "70%" },
    { icon: "up", value: "9", label: "Agenda Perlu Review", tone: "+3", accent: "red", width: "42%" },
    { icon: "wallet", value: "24", label: "Data Pengurus Terverifikasi", tone: "Stabil", accent: "blue", width: "58%" },
    { icon: "users", value: "47", label: "Total Pendaftar PMB", tone: "+8", accent: "gold", width: "60%" },
    { icon: "chat", value: "6", label: "Pesan Internal Masuk", tone: "Baru", accent: "purple", width: "36%" },
  ],
  bendahara: [
    { icon: "down", value: "Rp 48,5jt", label: "Total Pemasukan Bulan Ini", tone: "+12%", accent: "green", width: "72%" },
    { icon: "up", value: "Rp 31,2jt", label: "Total Pengeluaran Bulan Ini", tone: "+5%", accent: "red", width: "48%" },
    { icon: "wallet", value: "Rp 17,3jt", label: "Saldo Kas Akhir", tone: "Surplus", accent: "blue", width: "56%" },
    { icon: "users", value: "14", label: "Donatur Baru", tone: "+4", accent: "gold", width: "52%" },
    { icon: "chat", value: "5", label: "Bukti Transfer Perlu Cek", tone: "Cek", accent: "purple", width: "38%" },
  ],
  ustadz: [
    { icon: "down", value: "26", label: "Konsultasi Masuk Bulan Ini", tone: "+10", accent: "green", width: "70%" },
    { icon: "up", value: "3", label: "Konsultasi Belum Dijawab", tone: "Perlu Jawab", accent: "red", width: "28%" },
    { icon: "wallet", value: "12", label: "Materi Kajian Tersimpan", tone: "Aktif", accent: "blue", width: "56%" },
    { icon: "users", value: "47", label: "Total Pendaftar PMB", tone: "+8", accent: "gold", width: "60%" },
    { icon: "chat", value: "8", label: "Komentar Kajian Baru", tone: "Baru", accent: "purple", width: "45%" },
  ],
};

const activities = [
  { accent: "green", icon: "down", title: "Infaq Jumat masuk -- Rp 1.200.000", meta: "Dicatat oleh Bendahara - 2 jam lalu" },
  { accent: "blue", icon: "user", title: "Ahmad Fauzi lolos ke tahap seleksi", meta: "Admin PMB - 3 jam lalu" },
  { accent: "red", icon: "up", title: "Pengeluaran konsumsi kajian -- Rp 320.000", meta: "Dicatat oleh Bendahara - 5 jam lalu" },
  { accent: "gold", icon: "file", title: "Rizki Pratama upload bukti pembayaran", meta: "Portal Pendaftar - 6 jam lalu" },
];

const allRoles: UserRole[] = ["admin", "pengurus", "bendahara", "ustadz"];

type DashboardNavItem = {
  active?: boolean;
  children: string[];
  icon: string;
  label: string;
  roles: UserRole[];
};

const navItems: DashboardNavItem[] = [
  { icon: "home", label: "Dashboard", active: true, children: [], roles: allRoles },
  { icon: "home", label: "Beranda", children: [], roles: allRoles },
  {
    icon: "list",
    label: "Berita",
    children: ["Terkini", "Kegiatan", "Nasional", "Internasional"],
    roles: ["admin", "pengurus"] satisfies UserRole[],
  },
  {
    icon: "list",
    label: "Tentang Kami",
    children: ["Profil", "AD/ART", "Struktur Kepengurusan", "Program Kerja"],
    roles: ["admin", "pengurus"] satisfies UserRole[],
  },
  {
    icon: "list",
    label: "Kajian",
    children: ["Artikel Kajian", "Tauhid", "Tazkiyah", "Khutbah"],
    roles: ["admin", "ustadz"] satisfies UserRole[],
  },
  {
    icon: "list",
    label: "Konsultasi",
    children: ["Pertanyaan Masuk", "Jawaban"],
    roles: ["admin", "ustadz"] satisfies UserRole[],
  },
  {
    icon: "file",
    label: "Pendidikan",
    children: ["ADI", "Ponpes Suruh", "Al Khawarizmi"],
    roles: ["admin", "pengurus"] satisfies UserRole[],
  },
  {
    icon: "wallet",
    label: "Keuangan",
    children: ["Pemasukan", "Pengeluaran", "Laporan Keuangan", "Riwayat Transaksi"],
    roles: ["admin", "bendahara"] satisfies UserRole[],
  },
  {
    icon: "users",
    label: "Manajemen",
    children: ["Pengurus", "Ustadz", "Admin PMB", "Hak Akses"],
    roles: ["admin"] satisfies UserRole[],
  },
];

const chartData = [
  { month: "Jan", income: 60, expense: 38 },
  { month: "Feb", income: 54, expense: 34 },
  { month: "Mar", income: 66, expense: 46 },
  { month: "Apr", income: 57, expense: 32 },
  { month: "Mei", income: 64, expense: 42 },
  { month: "Jun", income: 85, expense: 30 },
];

type EducationView = "adi" | "ponpes-suruh" | "al-khawarizmi";
type EducationMode = "view" | "edit";
type DashboardModule = "kajian" | "konsultasi" | "website" | "manajemen" | "tentang-kami";

const moduleLabels: Record<DashboardModule, string> = {
  kajian: "Kajian",
  konsultasi: "Konsultasi",
  website: "Berita",
  manajemen: "Manajemen",
  "tentang-kami": "Tentang Kami",
};

const moduleAccess: Record<UserRole, DashboardModule[]> = {
  admin: ["kajian", "konsultasi", "website", "manajemen", "tentang-kami"],
  pengurus: ["website", "tentang-kami"],
  bendahara: [],
  ustadz: ["kajian", "konsultasi"],
};

const moduleLinks: Record<string, DashboardModule> = {
  Berita: "website",
  Kajian: "kajian",
  Konsultasi: "konsultasi",
  Manajemen: "manajemen",
  "Tentang Kami": "tentang-kami",
};

const financeLinks: Record<string, FinanceView> = {
  Pemasukan: "pemasukan",
  Pengeluaran: "pengeluaran",
  "Laporan Keuangan": "laporan",
  "Riwayat Transaksi": "riwayat",
};

const educationLinks: Record<string, EducationView> = {
  ADI: "adi",
  "Ponpes Suruh": "ponpes-suruh",
  "Al Khawarizmi": "al-khawarizmi",
};

const educationProfiles: Record<
  EducationView,
  {
    description: string;
    empty?: boolean;
    icon: string;
    subtitle: string;
    tagline: string;
    title: string;
    contact: Array<{ icon: string; label: string; value: string }>;
  }
> = {
  adi: {
    icon: "🎓",
    title: "ADI - Akademi Da'wah Islam",
    subtitle: "Profil & informasi lembaga",
    tagline: "",
    description: "",
    contact: [],
  },
  "ponpes-suruh": {
    icon: "🏫",
    title: "Ponpes Suruh",
    subtitle: "Profil & informasi lembaga",
    tagline: "Pendidikan Islam Tradisional Berkualitas Modern",
    description:
      "Pondok Pesantren Suruh adalah lembaga pendidikan Islam tradisional di bawah naungan Dewan Da'wah Islamiyah Indonesia Cabang Semarang. Menggabungkan pendidikan salaf yang kuat dengan kurikulum modern.",
    contact: [
      { icon: "pin", label: "Alamat", value: "Kec. Suruh, Kab. Semarang" },
      { icon: "phone", label: "Telepon", value: "-" },
      { icon: "mail", label: "Email", value: "ponpes@dewandakwah-semarang.or.id" },
      { icon: "clock", label: "Jam Operasional", value: "24 Jam (Boarding)" },
      { icon: "users", label: "Sistem / Jenjang", value: "Mukim (Boarding)" },
      { icon: "users", label: "Kapasitas / Penerimaan", value: "Putra & Putri" },
      { icon: "calendar", label: "Jadwal Pendaftaran", value: "Mei - Juli" },
    ],
  },
  "al-khawarizmi": {
    icon: "🏛️",
    title: "Al Khawarizmi",
    subtitle: "Profil & informasi lembaga",
    tagline: "Integrasi Ilmu Agama & Sains Teknologi",
    description:
      "Al Khawarizmi adalah lembaga pendidikan Islam terpadu yang mengintegrasikan ilmu agama dengan ilmu sains dan teknologi modern. Terinspirasi dari nama ilmuwan Muslim terbesar.",
    contact: [],
  },
};

type EducationDisplayProfile = {
  description: string;
  editTitle: string;
  icon: IconName;
  institutionName: string;
  subtitle: string;
  tagline: string;
  title: string;
  vision: string;
  missions: string[];
  fields: Array<{
    icon: IconName;
    label: string;
    name: string;
    value: string;
  }>;
};

const educationContent: Record<EducationView, EducationDisplayProfile> = {
  adi: {
    ...educationProfiles.adi,
    icon: "users",
    title: "ADI — Akademi Da'wah Islam",
    editTitle: "Edit Profil ADI — Akademi Da'wah Islam",
    institutionName: "Akademi Da'wah Islam (ADI) Semarang",
    subtitle: "Profil & informasi lembaga",
    tagline: "Mencetak Kader Da'i Profesional",
    description:
      "ADI adalah lembaga pendidikan tinggi vokasi yang berfokus pada pembinaan kader da'i profesional. Mahasiswa ADI dibekali ilmu syariah, metode dakwah, kepemimpinan Islam, dan keterampilan komunikasi publik.",
    vision:
      "Menjadi lembaga pendidikan kader da'i terdepan di Jawa Tengah yang menghasilkan da'i berakhlak mulia, berkompeten, dan berdedikasi tinggi dalam menyebarkan Islam rahmatan lil 'alamin.",
    missions: [
      "Menyelenggarakan pendidikan dakwah berbasis Al-Quran dan Sunnah",
      "Membina karakter dan akhlak mahasiswa secara holistik",
      "Melatih keterampilan dakwah dan komunikasi publik",
      "Membangun jaringan alumni da'i yang aktif di masyarakat",
    ],
    fields: [
      { icon: "pin", label: "Alamat", name: "address", value: "Jl. Wirijan, Semarang Tengah" },
      { icon: "phone", label: "Telepon", name: "phone", value: "(024) 123-4567" },
      { icon: "mail", label: "Email", name: "email", value: "adi@dewandakwah-semarang.or.id" },
      { icon: "clock", label: "Jam Operasional", name: "hours", value: "Senin-Jumat, 08.00-16.00 WIB" },
      { icon: "users", label: "Sistem / Jenjang", name: "level", value: "D3 / Vokasi" },
      { icon: "users", label: "Kapasitas / Penerimaan", name: "capacity", value: "60 mahasiswa/angkatan" },
      { icon: "calendar", label: "Jadwal Pendaftaran", name: "registration", value: "Juni - Agustus" },
    ],
  },
  "ponpes-suruh": {
    ...educationProfiles["ponpes-suruh"],
    icon: "home",
    title: "Ponpes Suruh",
    editTitle: "Edit Profil Ponpes Suruh",
    institutionName: "Pondok Pesantren Suruh",
    subtitle: "Profil & informasi lembaga",
    vision:
      "Menjadi lembaga pendidikan kader da'i terdepan di Jawa Tengah yang menghasilkan da'i berakhlak mulia, berkompeten, dan berdedikasi tinggi dalam menyebarkan Islam rahmatan lil 'alamin.",
    missions: [
      "Menyelenggarakan pendidikan dakwah berbasis Al-Quran dan Sunnah",
      "Membina karakter dan akhlak mahasiswa secara holistik",
      "Melatih keterampilan dakwah dan komunikasi publik",
      "Membangun jaringan alumni da'i yang aktif di masyarakat",
    ],
    fields: [
      { icon: "pin", label: "Alamat", name: "address", value: "Kec. Suruh, Kab. Semarang" },
      { icon: "phone", label: "Telepon", name: "phone", value: "-" },
      { icon: "mail", label: "Email", name: "email", value: "ponpes@dewandakwah-semarang.or.id" },
      { icon: "clock", label: "Jam Operasional", name: "hours", value: "24 Jam (Boarding)" },
      { icon: "users", label: "Sistem / Jenjang", name: "level", value: "Mukim (Boarding)" },
      { icon: "users", label: "Kapasitas / Penerimaan", name: "capacity", value: "Putra & Putri" },
      { icon: "calendar", label: "Jadwal Pendaftaran", name: "registration", value: "Mei - Juli" },
    ],
  },
  "al-khawarizmi": {
    ...educationProfiles["al-khawarizmi"],
    icon: "file",
    title: "Al Khawarizmi",
    editTitle: "Edit Profil Al Khawarizmi",
    institutionName: "Al Khawarizmi",
    subtitle: "Profil & informasi lembaga",
    vision:
      "Menjadi lembaga pendidikan kader da'i terdepan di Jawa Tengah yang menghasilkan da'i berakhlak mulia, berkompeten, dan berdedikasi tinggi dalam menyebarkan Islam rahmatan lil 'alamin.",
    missions: [
      "Menyelenggarakan pendidikan dakwah berbasis Al-Quran dan Sunnah",
      "Membina karakter dan akhlak mahasiswa secara holistik",
      "Melatih keterampilan dakwah dan komunikasi publik",
      "Membangun jaringan alumni da'i yang aktif di masyarakat",
    ],
    fields: [
      { icon: "pin", label: "Alamat", name: "address", value: "Kota Semarang" },
      { icon: "phone", label: "Telepon", name: "phone", value: "-" },
      { icon: "mail", label: "Email", name: "email", value: "alkh@dewandakwah-semarang.or.id" },
      { icon: "clock", label: "Jam Operasional", name: "hours", value: "Full Day School" },
      { icon: "users", label: "Sistem / Jenjang", name: "level", value: "Full Day School" },
      { icon: "users", label: "Kapasitas / Penerimaan", name: "capacity", value: "Putra & Putri" },
      { icon: "calendar", label: "Jadwal Pendaftaran", name: "registration", value: "Mei - Juli" },
      { icon: "file", label: "Akreditasi", name: "accreditation", value: "A (Kemenag)" },
    ],
  },
};

type IconName = "bell" | "calendar" | "chat" | "clock" | "down" | "file" | "home" | "list" | "mail" | "phone" | "pin" | "up" | "user" | "users" | "wallet";

function DashboardIcon({ name }: { name: IconName | string }) {
  const paths: Record<IconName, ReactNode> = {
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    calendar: (
      <>
        <path d="M8 2v4M16 2v4M3 10h18" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
      </>
    ),
    chat: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    down: <path d="M12 4v16M7 15l5 5 5-5" />,
    file: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5" />
      </>
    ),
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    list: (
      <>
        <path d="M8 6h13M8 12h13M8 18h13" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L8 9.69a16 16 0 0 0 6.31 6.31l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92Z" />
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    up: <path d="M12 20V4M7 9l5-5 5 5" />,
    user: (
      <>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    wallet: (
      <>
        <path d="M20 7H5a3 3 0 0 0 0 6h15v7H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h13z" />
        <path d="M16 13h6v4h-6z" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[(name as IconName) in paths ? (name as IconName) : "home"]}
    </svg>
  );
}

type RoleDashboardProps = {
  educationMode?: string;
  educationView?: string;
  financeView?: string;
  moduleView?: string;
  role: UserRole;
  sectionView?: string;
};

function normalizeFinanceView(view?: string): FinanceView | null {
  if (view === "pemasukan" || view === "pengeluaran" || view === "laporan" || view === "riwayat") {
    return view;
  }

  return null;
}

function normalizeEducationView(view?: string): EducationView | null {
  if (view === "adi" || view === "ponpes-suruh" || view === "al-khawarizmi") {
    return view;
  }

  return null;
}

function normalizeEducationMode(mode?: string): EducationMode {
  return mode === "edit" ? "edit" : "view";
}

function normalizeModule(view?: string): DashboardModule | null {
  if (
    view === "kajian"
    || view === "konsultasi"
    || view === "website"
    || view === "manajemen"
    || view === "tentang-kami"
  ) {
    return view;
  }

  return null;
}

function slugifySection(value: string) {
  return value
    .toLowerCase()
    .replaceAll("&", "")
    .trim()
    .replace(/\s+/g, "-");
}

function getSectionSlug(parent: string, child: string) {
  if (parent === "Tentang Kami" && child === "Profil") {
    return "profil-organisasi";
  }

  if (parent === "Tentang Kami" && child === "AD/ART") {
    return "ad-art";
  }

  return slugifySection(child);
}

function EditPencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 20 8-8-4-4-8 8-2 6z" />
      <path d="m14 6 4 4" />
    </svg>
  );
}

function VisionMissionCard({
  profile,
  role,
  view,
}: {
  profile: EducationDisplayProfile;
  role: UserRole;
  view: EducationView;
}) {

  return (
    <article className="educationVisionCard">
      <header className="educationCardHeader">
        <span className="educationHeaderIcon">
          <DashboardIcon name="list" />
        </span>
        <div>
          <h2>Visi & Misi</h2>
          <p>Tujuan pendirian lembaga</p>
        </div>
        <Link
          className="educationInlineEdit"
          href={`/${role}?education=${view}&educationMode=edit`}
        >
          <EditPencilIcon />
          <span>Edit</span>
        </Link>
      </header>

      <div className="educationVisionGrid">
        <section className="educationVisionBlock">
          <h3>Visi</h3>
          <blockquote>
            &quot;{profile.vision}&quot;
          </blockquote>
        </section>

        <section className="educationMissionBlock">
          <h3>Misi</h3>
          <ol>
            {profile.missions.map((item, index) => (
              <li key={item}>
                <span>{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}

function EducationHeader({
  editable = true,
  profile,
  role,
  view,
}: {
  editable?: boolean;
  profile: EducationDisplayProfile;
  role: UserRole;
  view: EducationView;
}) {
  return (
    <div className="educationHeader">
      <div>
        <h1>
          <span><DashboardIcon name={profile.icon} /></span>
          {profile.title}
        </h1>
        <p>{profile.subtitle}</p>
      </div>
      {editable ? (
        <Link className="educationEditProfile" href={`/${role}?education=${view}&educationMode=edit`}>
          <EditPencilIcon />
          <span>Edit Profil</span>
        </Link>
      ) : null}
    </div>
  );
}

function EducationContactCard({ profile }: { profile: EducationDisplayProfile }) {
  return (
    <article className="educationContactCard">
      <h2>Informasi Kontak</h2>
      <div className="educationContactList">
        {profile.fields.map((item) => (
          <div className="educationContactItem" key={item.label}>
            <span>
              <DashboardIcon name={item.icon} />
            </span>
            <div>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function EducationProfileSummary({
  profile,
}: {
  profile: EducationDisplayProfile;
}) {
  return (
    <article className="educationSummaryCard">
      <h2>{profile.institutionName}</h2>
      <h3>{profile.tagline}</h3>
      <p>{profile.description}</p>
    </article>
  );
}

function EducationEditForm({
  role,
  view,
}: {
  role: UserRole;
  view: EducationView;
}) {
  const profile = educationContent[view];

  return (
    <section className="educationWorkspace edit">
      <EducationHeader editable={false} profile={profile} role={role} view={view} />
      <form className="educationEditForm">
        <div className="educationEditHeading">
          <div>
            <h2>{profile.editTitle}</h2>
          </div>
        </div>
        <div className="educationEditGrid">
          <label>
            <span>Nama Lembaga</span>
            <input name="institutionName" defaultValue={profile.institutionName} />
          </label>
          <label>
            <span>Tagline</span>
            <input name="tagline" defaultValue={profile.tagline} />
          </label>
        </div>
        <label>
          <span>Deskripsi</span>
          <textarea name="description" defaultValue={profile.description} />
        </label>
        <div className="educationEditGrid educationContactFields">
          {profile.fields.map((field) => (
            <label key={field.name}>
              <span>{field.label}</span>
              <input name={field.name} defaultValue={field.value} />
            </label>
          ))}
        </div>
        <div className="educationFormActions">
          <button type="button" className="educationSaveButton">
            <span aria-hidden="true">▣</span> Simpan
          </button>
          <Link href={`/${role}?education=${view}`} className="educationCancelButton">
            <span aria-hidden="true">×</span> Batal
          </Link>
        </div>
      </form>
    </section>
  );
}

function EducationWorkspace({
  mode,
  role,
  view,
}: {
  mode: EducationMode;
  role: UserRole;
  view: EducationView;
}) {
  if (mode === "edit") {
    return <EducationEditForm role={role} view={view} />;
  }

  const profile = educationContent[view];

  return (
    <section className={`educationWorkspace ${view}`}>
      <EducationHeader profile={profile} role={role} view={view} />
      <EducationProfileSummary profile={profile} />
      <VisionMissionCard profile={profile} role={role} view={view} />
      <EducationContactCard profile={profile} />
    </section>
  );
}

export default async function RoleDashboard({
  role,
  financeView,
  educationView,
  educationMode,
  moduleView,
  sectionView,
}: RoleDashboardProps) {
  const session = await requireRole(role);
  const label = roleLabels[role];
  const canAccessFinance = role === "admin" || role === "bendahara";
  const canAccessEducation = role === "admin" || role === "pengurus";
  const activeFinanceView = canAccessFinance ? normalizeFinanceView(financeView) : null;
  const activeEducationView = canAccessEducation ? normalizeEducationView(educationView) : null;
  const requestedModule = normalizeModule(moduleView);
  const activeModule =
    requestedModule && moduleAccess[role].includes(requestedModule)
      ? requestedModule
      : null;
  const activeEducationMode = normalizeEducationMode(educationMode);
  const hasWorkspace = Boolean(activeFinanceView || activeEducationView || activeModule);
  const visibleNavItems = navItems.filter((item) => item.roles.includes(role));
  const initials = session.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const currentDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date());
  const activeSection = activeModule
    ? sectionView || slugifySection(moduleLabels[activeModule])
    : "";
  const contentItems = activeModule === "tentang-kami"
    ? await getModuleContentItems(activeModule)
    : activeModule
      ? await getContentItems(activeModule, activeSection)
      : [];
  let databaseAvailable = true;
  let financeTransactions: FinanceTransaction[] = [];

  if (activeFinanceView) {
    try {
      financeTransactions = (await prisma.financeTransaction.findMany({
        orderBy: [{ date: "desc" }, { id: "desc" }],
      })).map((transaction) => ({
        id: transaction.id,
        type: transaction.type === "pengeluaran" ? "pengeluaran" : "pemasukan",
        date: transaction.date.toISOString().slice(0, 10),
        category: transaction.category,
        detail: transaction.detail,
        note: transaction.note ?? "",
        amount: transaction.amount,
        author: transaction.authorName,
      }));
    } catch (error) {
      databaseAvailable = false;
      console.error("Finance database is unavailable:", error);
    }
  }

  return (
    <main className="dashboardApp">
      <aside className="dashboardSidebar">
        <Link href="/" className="dashboardLogo" aria-label="Dewan Da'wah Kota Semarang">
          <Image src="/logo.png" alt="Logo Dewan Da'wah Kota Semarang" width={300} height={120} priority />
        </Link>

        <nav className="dashboardNav" aria-label="Navigasi dashboard">
          {visibleNavItems.map((item) => (
            <div key={item.label} className="dashboardNavGroup">
              {item.label === "Dashboard" ? (
                <Link
                  className={
                    item.active && !hasWorkspace
                      ? "dashboardNavItem active"
                      : "dashboardNavItem"
                  }
                  href={`/${role}`}
                >
                  <DashboardIcon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              ) : item.label === "Beranda" ? (
                <Link className="dashboardNavItem" href="/">
                  <DashboardIcon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              ) : item.label === "Pendidikan" ? (
                <Link
                  className={
                    activeEducationView
                      ? "dashboardNavItem active"
                      : "dashboardNavItem"
                  }
                  href={`/${role}?education=adi`}
                >
                  <DashboardIcon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              ) : moduleLinks[item.label] ? (
                <Link
                  className={
                    moduleLinks[item.label] === activeModule
                      ? "dashboardNavItem active"
                      : "dashboardNavItem"
                  }
                  href={`/${role}?module=${moduleLinks[item.label]}&section=${getSectionSlug(item.label, item.children[0])}`}
                >
                  <DashboardIcon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              ) : (
                <button
                  className={
                    item.label === "Keuangan" && activeFinanceView
                      ? "dashboardNavItem active"
                      : item.label === "Pendidikan" && activeEducationView
                        ? "dashboardNavItem active"
                        : "dashboardNavItem"
                  }
                  type="button"
                >
                  <DashboardIcon name={item.icon} />
                  <span>{item.label}</span>
                </button>
              )}

              {item.children.length > 0 ? (
                <div className="dashboardSubnav" aria-label={`${item.label} submenu`}>
                  {item.children.map((child) => {
                    const financeLink = financeLinks[child];
                    const educationLink = educationLinks[child];
                    const moduleLink = moduleLinks[item.label];
                    const childSection = getSectionSlug(item.label, child);

                    return financeLink ? (
                      <Link
                        className={activeFinanceView === financeLink ? "active" : ""}
                        href={`/${role}?finance=${financeLink}`}
                        key={child}
                      >
                        {child}
                      </Link>
                    ) : educationLink ? (
                      <Link
                        className={activeEducationView === educationLink ? "active" : ""}
                        href={`/${role}?education=${educationLink}`}
                        key={child}
                      >
                        {child}
                      </Link>
                    ) : moduleLink ? (
                      <Link
                        className={
                          activeModule === moduleLink &&
                          sectionView === childSection
                            ? "active"
                            : ""
                        }
                        href={`/${role}?module=${moduleLink}&section=${childSection}`}
                        key={child}
                      >
                        {child}
                      </Link>
                    ) : (
                      <button key={child} type="button">
                        {child}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <form action={logoutAction} className="dashboardLogoutForm">
          <button type="submit" className="dashboardLogoutButton">
            Logout
          </button>
        </form>
      </aside>

      <section className="dashboardMain">
        <header className="dashboardTopbar">
          <div>
            <h1>Selamat datang, {session.name}</h1>
            <p>{currentDate} · Sistem Internal Dewan Da&apos;wah</p>
          </div>

          <div className="dashboardUserArea">
            <button className="notificationButton" type="button" aria-label="Notifikasi">
              <DashboardIcon name="bell" />
              <span />
            </button>
            <button className="userProfileButton" type="button">
              <strong>{initials}</strong>
              <span>
                <b>{session.name}</b>
                <small>{roleTitles[role]}</small>
              </span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        </header>

        {activeFinanceView ? (
          <FinanceWorkspace
            databaseAvailable={databaseAvailable}
            view={activeFinanceView}
            initialTransactions={financeTransactions}
          />
        ) : activeEducationView ? (
          <EducationWorkspace view={activeEducationView} mode={activeEducationMode} role={role} />
        ) : activeModule ? (
          activeModule === "kajian" ? (
            <KajianManager items={contentItems} section={activeSection} />
          ) : activeModule === "website" ? (
            <NewsManager items={contentItems} section={activeSection} />
          ) : activeModule === "tentang-kami" ? (
            <AboutManager items={contentItems} section={activeSection} />
          ) : (
            <ContentManager
              items={contentItems}
              module={activeModule}
              section={activeSection}
              sectionLabel={activeSection
                .split("-")
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" ")}
            />
          )
        ) : (
          <>
            <section className="dashboardStats" aria-label={`Ringkasan ${label}`}>
              {roleStats[role].map((stat) => (
                <article className={`dashboardStatCard ${stat.accent}`} key={stat.label}>
                  <div className="statTopline">
                    <span className="statIcon">
                      <DashboardIcon name={stat.icon} />
                    </span>
                    <span className="statBadge">{stat.tone}</span>
                  </div>
                  <strong>{stat.value}</strong>
                  <p>{stat.label}</p>
                  <div className="statTrack">
                    <span style={{ width: stat.width }} />
                  </div>
                </article>
              ))}
            </section>

            <section className="dashboardContentGrid">
              <article className="financeChartCard">
                <div className="dashboardCardHeader">
                  <span className="cardHeaderIcon">
                    <DashboardIcon name="list" />
                  </span>
                  <div>
                    <h2>Grafik Keuangan</h2>
                    <p>Pemasukan vs Pengeluaran</p>
                  </div>
                  <div className="chartTabs" aria-label="Filter grafik">
                    <button type="button">Bulanan</button>
                    <span>Tahunan</span>
                  </div>
                </div>

                <div className="barChart" aria-label="Grafik batang keuangan">
                  {chartData.map((item) => (
                    <div className="barMonth" key={item.month}>
                      <div className="barPair">
                        <span className="incomeBar" style={{ height: `${item.income}%` }} />
                        <span className="expenseBar" style={{ height: `${item.expense}%` }} />
                      </div>
                      <small>{item.month}</small>
                    </div>
                  ))}
                </div>

                <div className="chartLegend">
                  <span><i className="incomeDot" /> Pemasukan</span>
                  <span><i className="expenseDot" /> Pengeluaran</span>
                </div>
              </article>

              <article className="activityCard">
                <div className="dashboardCardHeader activityHeader">
                  <span className="cardHeaderIcon blue">
                    <DashboardIcon name="up" />
                  </span>
                  <div>
                    <h2>Aktivitas Terbaru</h2>
                    <p>Hari ini</p>
                  </div>
                  <Link href="/">Lihat semua {"->"}</Link>
                </div>

                <div className="activityList">
                  {activities.map((activity) => (
                    <div className="activityItem" key={activity.title}>
                      <span className={`activityIcon ${activity.accent}`}>
                        <DashboardIcon name={activity.icon} />
                      </span>
                      <div>
                        <strong>{activity.title}</strong>
                        <p>{activity.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
