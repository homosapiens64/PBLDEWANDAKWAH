import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "../login/actions";
import {
  institutionLabels,
  isEducationInstitution,
  requireRole,
  roleHomePaths,
  roleLabels,
  type UserRole,
} from "../lib/auth";
import FinanceWorkspace, { type FinanceView } from "./FinanceWorkspace";
import type { FinanceTransaction } from "./FinanceWorkspace";
import ContentManager from "./ContentManager";
import KajianManager from "./KajianManager";
import AboutManager from "./AboutManager";
import NewsManager from "./NewsManager";
import AdminManagement, { type EducationAdminRow } from "./AdminManagement";
import CertifiedUstadzManager from "./CertifiedUstadzManager";
import ConsultationQuestionsManager from "./ConsultationQuestionsManager";
import EducationPmbWorkspace, { type PmbApplicant } from "./EducationPmbWorkspace";
import EducationParticipantWorkspace from "./EducationParticipantWorkspace";
import {
  getCertifiedUstadzItems,
  type CertifiedUstadzItem,
} from "../lib/certified-ustadz";
import {
  getContentItems,
  getModuleContentItems,
} from "../lib/content";
import { prisma } from "../lib/prisma";

const roleTitles: Record<UserRole, string> = {
  super_admin: "Super Administrator",
  admin: "Admin Pendidikan",
  pengurus: "Pengurus",
  bendahara: "Bendahara",
  ustadz: "Ustadz",
};

type DashboardTransaction = {
  id: number;
  type: string;
  date: Date;
  category: string;
  detail: string;
  amount: number;
  authorName: string;
  updatedAt: Date;
};

type DashboardContent = {
  id: number;
  module: string;
  section: string;
  title: string;
  status: string;
  authorName: string;
  updatedAt: Date;
};

type DashboardStat = {
  accent: string;
  icon: string;
  label: string;
  tone: string;
  value: string;
  width: string;
};

const allRoles: UserRole[] = ["super_admin", "admin", "pengurus", "bendahara", "ustadz"];

const latestApplicants = [
  {
    email: "ahmad.fadilah@gmail.com",
    institution: "ADI",
    name: "Ahmad Fadilah",
    status: "Diterima",
  },
  {
    email: "siti.aisyah@gmail.com",
    institution: "Ponpes Suruh",
    name: "Siti Aisyah",
    status: "Menunggu",
  },
  {
    email: "m.rizki@gmail.com",
    institution: "Al Khawarizmi",
    name: "Muhammad Rizki",
    status: "Selesai",
  },
  {
    email: "fatimah.z@gmail.com",
    institution: "ADI",
    name: "Fatimah Zahra",
    status: "Menunggu",
  },
  {
    email: "umar.hasan@gmail.com",
    institution: "Ponpes Suruh",
    name: "Umar Hasan",
    status: "Diterima",
  },
];

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
    roles: ["super_admin", "pengurus"] satisfies UserRole[],
  },
  {
    icon: "list",
    label: "Tentang Kami",
    children: ["Profil", "AD/ART", "Struktur Kepengurusan", "Program Kerja"],
    roles: ["super_admin", "pengurus"] satisfies UserRole[],
  },
  {
    icon: "list",
    label: "Kajian",
    children: ["Artikel Kajian", "Tauhid", "Tazkiyah", "Khutbah"],
    roles: ["super_admin", "ustadz"] satisfies UserRole[],
  },
  {
    icon: "list",
    label: "Konsultasi",
    children: ["Pertanyaan Masuk", "Jawaban", "Ustadz Bersertifikat"],
    roles: ["super_admin", "ustadz"] satisfies UserRole[],
  },
  {
    icon: "file",
    label: "PendidikanHub",
    children: [],
    roles: ["super_admin", "admin", "pengurus"] satisfies UserRole[],
  },
  {
    icon: "wallet",
    label: "Keuangan",
    children: ["Pemasukan", "Pengeluaran", "Laporan Keuangan"],
    roles: ["super_admin", "bendahara"] satisfies UserRole[],
  },
  {
    icon: "users",
    label: "Manajemen",
    children: ["Admin Pendidikan"],
    roles: ["super_admin"] satisfies UserRole[],
  },
];

type EducationView = "adi" | "ponpes-suruh" | "al-khawarizmi";
type EducationMode = "view" | "edit";
type EducationParticipantSection = "mahasiswa" | "santri" | "siswa";
type DashboardModule = "beranda" | "kajian" | "konsultasi" | "website" | "manajemen" | "tentang-kami";

const moduleLabels: Record<DashboardModule, string> = {
  beranda: "Beranda",
  kajian: "Kajian",
  konsultasi: "Konsultasi",
  website: "Berita",
  manajemen: "Manajemen",
  "tentang-kami": "Tentang Kami",
};

const moduleAccess: Record<UserRole, DashboardModule[]> = {
  super_admin: ["beranda", "kajian", "konsultasi", "website", "manajemen", "tentang-kami"],
  admin: [],
  pengurus: ["website", "tentang-kami"],
  bendahara: [],
  ustadz: ["kajian", "konsultasi"],
};

const moduleLinks: Record<string, DashboardModule> = {
  Beranda: "beranda",
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
};

const educationLinks: Record<string, EducationView> = {
  ADI: "adi",
  "Ponpes Suruh": "ponpes-suruh",
  "Al Khawarizmi": "al-khawarizmi",
};

const educationShortNames: Record<EducationView, string> = {
  adi: "ADI",
  "ponpes-suruh": "Ponpes Suruh",
  "al-khawarizmi": "Al Khawarizmi",
};

function toPmbDisplayStatus(status: string): PmbApplicant["status"] {
  if (status === "draft") return "Draft";
  if (status === "verifikasi_adm") return "Verifikasi Adm.";
  if (status === "menunggu_bayar") return "Menunggu Bayar";
  if (status === "sudah_bayar") return "Sudah Bayar";
  if (status === "diterima") return "Diterima";
  if (status === "ditolak") return "Ditolak";
  if (status === "daftar_ulang") return "Daftar Ulang";
  return "Menunggu Verifikasi";
}

function formatPmbAddress(application: {
  address: string | null;
  kecamatan: string | null;
  kelurahan: string | null;
  kota: string | null;
  provinsi: string | null;
  rt: string | null;
  rw: string | null;
}) {
  return [
    application.address,
    application.rt || application.rw ? `RT/RW ${application.rt || "-"}/${application.rw || "-"}` : "",
    application.kelurahan,
    application.kecamatan,
    application.kota,
    application.provinsi,
  ].filter(Boolean).join(", ");
}

const educationNavGroups: Array<{
  icon: IconName;
  participantLabel: string;
  participantSection: EducationParticipantSection;
  profileLabel: string;
  title: string;
  view: EducationView;
}> = [
  {
    icon: "graduation",
    participantLabel: "Mahasiswa",
    participantSection: "mahasiswa",
    profileLabel: "Profil ADI",
    title: "ADI",
    view: "adi",
  },
  {
    icon: "building",
    participantLabel: "Santri",
    participantSection: "santri",
    profileLabel: "Profil",
    title: "Ponpes Suruh",
    view: "ponpes-suruh",
  },
  {
    icon: "building",
    participantLabel: "Siswa",
    participantSection: "siswa",
    profileLabel: "Profil",
    title: "Al Khawarizmi",
    view: "al-khawarizmi",
  },
];

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
    icon: "graduation",
    title: "ADI - Akademi Da'wah Islam",
    editTitle: "Edit Profil ADI - Akademi Da'wah Islam",
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

type IconName = "bell" | "building" | "calendar" | "chat" | "clipboard" | "clock" | "down" | "file" | "graduation" | "home" | "info" | "list" | "logout" | "mail" | "phone" | "pin" | "save" | "up" | "user" | "users" | "wallet" | "x";

function DashboardIcon({ name }: { name: IconName | string }) {
  const paths: Record<IconName, ReactNode> = {
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V7l8-4 8 4v14" />
        <path d="M9 21v-6h6v6" />
        <path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M16 13h.01" />
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
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4V2h6v2M9 9h6M9 13h6M9 17h4" />
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
    graduation: (
      <>
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5" />
      </>
    ),
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10v6M12 7h.01" />
      </>
    ),
    list: (
      <>
        <path d="M8 6h13M8 12h13M8 18h13" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
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
    save: (
      <>
        <path d="M5 3h12l2 2v16H5z" />
        <path d="M8 3v6h8V3M8 21v-8h8v8" />
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
    x: <path d="M18 6 6 18M6 6l12 12" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[(name as IconName) in paths ? (name as IconName) : "home"]}
    </svg>
  );
}

function formatDashboardRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function isSameMonth(value: Date, reference: Date) {
  return value.getUTCFullYear() === reference.getUTCFullYear()
    && value.getUTCMonth() === reference.getUTCMonth();
}

function buildDashboardStats(
  role: UserRole,
  transactions: DashboardTransaction[],
  content: DashboardContent[],
): DashboardStat[] {
  const now = new Date();
  const monthlyTransactions = transactions.filter((item) => isSameMonth(item.date, now));
  const monthlyIncome = monthlyTransactions
    .filter((item) => item.type === "pemasukan")
    .reduce((total, item) => total + item.amount, 0);
  const monthlyExpense = monthlyTransactions
    .filter((item) => item.type === "pengeluaran")
    .reduce((total, item) => total + item.amount, 0);
  const totalIncome = transactions
    .filter((item) => item.type === "pemasukan")
    .reduce((total, item) => total + item.amount, 0);
  const totalExpense = transactions
    .filter((item) => item.type === "pengeluaran")
    .reduce((total, item) => total + item.amount, 0);
  const balance = totalIncome - totalExpense;
  const roleContent = role === "ustadz"
    ? content.filter((item) => ["kajian", "konsultasi"].includes(item.module))
    : role === "pengurus"
      ? content.filter((item) => ["website", "tentang-kami", "education"].includes(item.module))
      : content;
  const published = roleContent.filter((item) => item.status === "published").length;
  const drafts = roleContent.length - published;
  const monthlyPeak = Math.max(monthlyIncome, monthlyExpense, 1);
  const balancePeak = Math.max(totalIncome + totalExpense, 1);
  const contentPeak = Math.max(roleContent.length, 1);

  return [
    {
      icon: "down",
      value: formatDashboardRupiah(monthlyIncome),
      label: "Pemasukan Bulan Ini",
      tone: `${monthlyTransactions.filter((item) => item.type === "pemasukan").length} transaksi`,
      accent: "green",
      width: `${Math.max(4, (monthlyIncome / monthlyPeak) * 100)}%`,
    },
    {
      icon: "up",
      value: formatDashboardRupiah(monthlyExpense),
      label: "Pengeluaran Bulan Ini",
      tone: `${monthlyTransactions.filter((item) => item.type === "pengeluaran").length} transaksi`,
      accent: "red",
      width: `${Math.max(4, (monthlyExpense / monthlyPeak) * 100)}%`,
    },
    {
      icon: "wallet",
      value: formatDashboardRupiah(balance),
      label: "Saldo Kas Keseluruhan",
      tone: balance >= 0 ? "Surplus" : "Defisit",
      accent: "blue",
      width: `${Math.max(4, (Math.abs(balance) / balancePeak) * 100)}%`,
    },
    {
      icon: "file",
      value: String(published),
      label: "Konten Diterbitkan",
      tone: `${roleContent.length} total`,
      accent: "gold",
      width: `${Math.max(4, (published / contentPeak) * 100)}%`,
    },
    {
      icon: "chat",
      value: String(drafts),
      label: "Konten Masih Draft",
      tone: drafts ? "Perlu ditinjau" : "Semua selesai",
      accent: "purple",
      width: `${Math.max(4, (drafts / contentPeak) * 100)}%`,
    },
  ];
}

function buildChartData(transactions: DashboardTransaction[]) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1));
    const income = transactions
      .filter((item) => item.type === "pemasukan" && isSameMonth(item.date, date))
      .reduce((total, item) => total + item.amount, 0);
    const expense = transactions
      .filter((item) => item.type === "pengeluaran" && isSameMonth(item.date, date))
      .reduce((total, item) => total + item.amount, 0);

    return {
      key: `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
      month: new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "UTC" }).format(date),
      income,
      expense,
    };
  });
  const peak = Math.max(...months.flatMap((item) => [item.income, item.expense]), 1);

  return months.map((item) => ({
    ...item,
    incomeHeight: item.income ? Math.max(8, (item.income / peak) * 100) : 0,
    expenseHeight: item.expense ? Math.max(8, (item.expense / peak) * 100) : 0,
  }));
}

function formatActivityDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(value);
}

function buildActivities(
  transactions: DashboardTransaction[],
  content: DashboardContent[],
) {
  return [
    ...transactions.map((item) => ({
      key: `transaction-${item.id}`,
      accent: item.type === "pemasukan" ? "green" : "red",
      icon: item.type === "pemasukan" ? "down" : "up",
      title: `${item.detail} - ${formatDashboardRupiah(item.amount)}`,
      meta: `${item.category} oleh ${item.authorName} - ${formatActivityDate(item.updatedAt)}`,
      date: item.updatedAt,
    })),
    ...content.map((item) => ({
      key: `content-${item.id}`,
      accent: item.status === "published" ? "blue" : "gold",
      icon: "file",
      title: `${item.status === "published" ? "Konten diterbitkan" : "Draft diperbarui"}: ${item.title}`,
      meta: `${item.module.replaceAll("-", " ")} / ${item.section.replaceAll("-", " ")} oleh ${item.authorName} - ${formatActivityDate(item.updatedAt)}`,
      date: item.updatedAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 4);
}

function buildFinanceSummary(transactions: DashboardTransaction[]) {
  const now = new Date();
  const monthlyTransactions = transactions.filter((item) => isSameMonth(item.date, now));
  const monthlyIncome = monthlyTransactions
    .filter((item) => item.type === "pemasukan")
    .reduce((total, item) => total + item.amount, 0);
  const monthlyExpense = monthlyTransactions
    .filter((item) => item.type === "pengeluaran")
    .reduce((total, item) => total + item.amount, 0);
  const totalIncome = transactions
    .filter((item) => item.type === "pemasukan")
    .reduce((total, item) => total + item.amount, 0);
  const totalExpense = transactions
    .filter((item) => item.type === "pengeluaran")
    .reduce((total, item) => total + item.amount, 0);

  return {
    balance: totalIncome - totalExpense,
    monthlyExpense,
    monthlyIncome,
  };
}

function SuperAdminOverview({
  activities,
  chart,
  content,
  transactions,
}: {
  activities: ReturnType<typeof buildActivities>;
  chart: ReturnType<typeof buildChartData>;
  content: DashboardContent[];
  transactions: DashboardTransaction[];
}) {
  const finance = buildFinanceSummary(transactions);
  const published = content.filter((item) => item.status === "published").length;
  const drafts = content.length - published;
  const educationCards = [
    {
      accent: "green",
      code: "ADI",
      description: "Lembaga pendidikan tinggi vokasi yang berfokus pada pembinaan kader da'i profesional.",
      href: `${roleHomePaths.super_admin}?education=adi`,
      meta: ["Jl. Wrigin, Semarang Tengah", "Vokasi / D3"],
      tag: "perguruan tinggi",
      title: "Akademi Da'wah Islam Indonesia",
    },
    {
      accent: "gold",
      code: "Pon",
      description: "Pondok Pesantren tradisional yang menggabungkan pendidikan salaf dengan kurikulum modern.",
      href: `${roleHomePaths.super_admin}?education=ponpes-suruh`,
      meta: ["Kec. Suruh, Kab. Semarang", "Boarding / Mukim"],
      tag: "pesantren",
      title: "Pondok Pesantren Suruh",
    },
    {
      accent: "blue",
      code: "AI",
      description: "Lembaga pendidikan Islam terpadu yang mengintegrasikan ilmu agama dengan ilmu sains dan teknologi.",
      href: `${roleHomePaths.super_admin}?education=al-khawarizmi`,
      meta: ["Kota Semarang", "Full Day School"],
      tag: "sekolah",
      title: "Al Khawarizmi",
    },
  ];
  const generalStats = [
    { accent: "green", icon: "building", label: "Total Lembaga", value: educationCards.length },
    { accent: "blue", icon: "users", label: "Total Pendaftar", value: latestApplicants.length },
    {
      accent: "gold",
      icon: "clock",
      label: "Menunggu Seleksi",
      value: latestApplicants.filter((item) => item.status !== "Diterima").length,
    },
    {
      accent: "purple",
      icon: "file",
      label: "Total Program",
      value: 8,
    },
  ];
  const financeCards = [
    { accent: "green", icon: "down", label: "Pemasukan Bulan Ini", value: finance.monthlyIncome },
    { accent: "red", icon: "up", label: "Pengeluaran Bulan Ini", value: finance.monthlyExpense },
    { accent: "green", icon: "wallet", label: "Saldo Kas Keseluruhan", value: finance.balance },
  ];

  return (
    <section className="superOverview" aria-label="Dashboard utama super admin">
      <div className="overviewSectionTitle">
        <span />
        <div>
          <h2>Ringkasan Umum</h2>
          <p>Data keseluruhan sistem</p>
        </div>
      </div>

      <section className="overviewStats" aria-label="Ringkasan umum">
        {generalStats.map((stat) => (
          <article className={`overviewStat ${stat.accent}`} key={stat.label}>
            <div>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
            </div>
            <span>
              <DashboardIcon name={stat.icon} />
            </span>
          </article>
        ))}
      </section>

      <div className="overviewSectionTitle">
        <span />
        <div>
          <h2>Keuangan</h2>
          <p>Pemasukan, pengeluaran & saldo kas</p>
        </div>
      </div>

      <section className="overviewFinance" aria-label="Ringkasan keuangan">
        <div className="overviewFinanceCards">
          {financeCards.map((card) => (
            <article className={`overviewMoneyCard ${card.accent}`} key={card.label}>
              <div>
                <p>{card.label}</p>
                <strong>{formatDashboardRupiah(card.value)}</strong>
              </div>
              <span>
                <DashboardIcon name={card.icon} />
              </span>
            </article>
          ))}
        </div>

        <article className="overviewChartCard">
          <div className="overviewCardHeader">
            <span className="overviewHeaderIcon">
              <DashboardIcon name="list" />
            </span>
            <div>
              <h3>Grafik Keuangan</h3>
              <p>Pemasukan vs Pengeluaran</p>
            </div>
            <small>6 Bulan Terakhir</small>
          </div>
          <div className="overviewLineChart" aria-label="Grafik keuangan 6 bulan terakhir">
            <div className="chartScale" aria-hidden="true">
              <span>4</span>
              <span>3</span>
              <span>2</span>
              <span>1</span>
              <span>0</span>
            </div>
            <div className="chartPlot">
              {chart.map((item) => (
                <div className="chartMonth" key={item.key}>
                  <div className="chartBars">
                    <span
                      className="incomeBar"
                      style={{ height: `${item.incomeHeight}%` }}
                      title={`Pemasukan ${item.month}: ${formatDashboardRupiah(item.income)}`}
                    />
                    <span
                      className="expenseBar"
                      style={{ height: `${item.expenseHeight}%` }}
                      title={`Pengeluaran ${item.month}: ${formatDashboardRupiah(item.expense)}`}
                    />
                  </div>
                  <small>{item.month}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="overviewLegend">
            <span><i className="incomeDot" /> Pemasukan</span>
            <span><i className="expenseDot" /> Pengeluaran</span>
          </div>
        </article>
      </section>

      <div className="overviewSectionTitle">
        <span />
        <div>
          <h2>Pendidikan & PMB</h2>
          <p>Data lembaga dan pendaftaran masuk</p>
        </div>
      </div>

      <section className="overviewEducationGrid" aria-label="Pendidikan dan PMB">
        {educationCards.map((card) => (
          <article className="overviewEducationCard" key={card.title}>
            <div className="educationCardTop">
              <span className={`educationInitial ${card.accent}`}>{card.code}</span>
              <span className={`educationTag ${card.accent}`}>{card.tag}</span>
            </div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <ul>
              {card.meta.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href={card.href}>Kelola -&gt;</Link>
          </article>
        ))}
      </section>

      <article className="overviewTableCard">
        <h3>Pendaftaran Terbaru</h3>
        <div className="overviewTableWrap">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Lembaga</th>
                <th>Tanggal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {latestApplicants.map((applicant) => (
                <tr key={applicant.email}>
                  <td>
                    <strong>{applicant.name}</strong>
                    <span>{applicant.email}</span>
                  </td>
                  <td>{applicant.institution}</td>
                  <td>04 Jun 2026</td>
                  <td>
                    <span className={`applicantStatus ${applicant.status.toLowerCase()}`}>
                      {applicant.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <div className="overviewSectionTitle">
        <span />
        <div>
          <h2>Konten & Aktivitas</h2>
          <p>Status konten dan log aktivitas terbaru</p>
        </div>
      </div>

      <section className="overviewBottomGrid">
        <article className="overviewStatusCard">
          <h3>Status Konten</h3>
          <div className="contentStatusGrid">
            <div className="contentStatusBox green">
              <span><DashboardIcon name="file" /></span>
              <small>{content.length} total</small>
              <strong>{published}</strong>
              <p>Konten Diterbitkan</p>
              <i />
            </div>
            <div className="contentStatusBox blue">
              <span><DashboardIcon name="file" /></span>
              <small>{drafts ? "Perlu ditinjau" : "Semua selesai"}</small>
              <strong>{drafts}</strong>
              <p>Konten Masih Draft</p>
              <i />
            </div>
          </div>
        </article>

        <article className="overviewActivityCard">
          <div className="overviewCardHeader compact">
            <span className="overviewHeaderIcon">
              <DashboardIcon name="clock" />
            </span>
            <div>
              <h3>Aktivitas Terbaru</h3>
              <p>Berdasarkan data tersimpan</p>
            </div>
          </div>
          <div className="overviewActivityList">
            {activities.length > 0 ? activities.map((activity) => (
              <div className="overviewActivityItem" key={activity.key}>
                <span className={`activityIcon ${activity.accent}`}>
                  <DashboardIcon name={activity.icon} />
                </span>
                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.meta}</p>
                </div>
              </div>
            )) : (
              <p className="overviewEmpty">Belum ada transaksi atau perubahan konten.</p>
            )}
          </div>
        </article>
      </section>
    </section>
  );
}

type RoleDashboardProps = {
  educationMode?: string;
  educationView?: string;
  financeView?: string;
  moduleView?: string;
  pmbView?: string;
  role: UserRole;
  sectionView?: string;
};

function normalizeFinanceView(view?: string): FinanceView | null {
  if (view === "pemasukan" || view === "pengeluaran" || view === "laporan") {
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

function normalizeEducationParticipantSection(
  section: string | undefined,
  view: EducationView | null,
): EducationParticipantSection | null {
  if (!view) return null;
  const group = educationNavGroups.find((item) => item.view === view);
  if (!group || group.participantSection !== section) return null;
  return group.participantSection;
}

function normalizeModule(view?: string): DashboardModule | null {
  if (
    view === "beranda"
    || view === "kajian"
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
  editable,
  profile,
  role,
  view,
}: {
  editable: boolean;
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
        {editable ? (
          <Link
            className="educationInlineEdit"
            href={`${roleHomePaths[role]}?education=${view}&educationMode=edit`}
          >
            <EditPencilIcon />
            <span>Edit</span>
          </Link>
        ) : null}
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
        <Link className="educationEditProfile" href={`${roleHomePaths[role]}?education=${view}&educationMode=edit`}>
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

function EducationProfileCards({
  profile,
}: {
  profile: EducationDisplayProfile;
}) {
  return (
    <div className="educationProfileGrid">
      <EducationProfileSummary profile={profile} />
      <EducationContactCard profile={profile} />
    </div>
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
        <label>
          <span>Nama Lembaga</span>
          <input name="institutionName" defaultValue={profile.institutionName} />
        </label>
        <label>
          <span>Tagline</span>
          <input name="tagline" defaultValue={profile.tagline} />
        </label>
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
            <DashboardIcon name="save" />
            <span>Simpan</span>
          </button>
          <Link href={`${roleHomePaths[role]}?education=${view}`} className="educationCancelButton">
            <DashboardIcon name="x" />
            <span>Batal</span>
          </Link>
        </div>
      </form>
    </section>
  );
}

function EducationWorkspace({
  mode,
  module,
  participantLabel,
  pmbApplicants,
  readOnly,
  role,
  view,
}: {
  mode: EducationMode;
  module: "education" | "pmb";
  participantLabel?: string;
  pmbApplicants: PmbApplicant[];
  readOnly: boolean;
  role: UserRole;
  view: EducationView;
}) {
  const profile = educationContent[view];

  if (module === "education" && participantLabel) {
    return (
      <EducationParticipantWorkspace
        institutionName={profile.institutionName}
        participantLabel={participantLabel}
      />
    );
  }

  if (mode === "edit" && module === "education" && !readOnly) {
    return <EducationEditForm role={role} view={view} />;
  }

  if (module === "pmb") {
    return (
      <EducationPmbWorkspace
        initialApplicants={pmbApplicants}
        institutionShortName={educationShortNames[view]}
      />
    );
  }

  return (
    <section className={`educationWorkspace ${view}`}>
      <EducationHeader editable={!readOnly} profile={profile} role={role} view={view} />
      <EducationProfileCards profile={profile} />
    </section>
  );
}

export default async function RoleDashboard({
  role,
  financeView,
  educationView,
  educationMode,
  moduleView,
  pmbView,
  sectionView,
}: RoleDashboardProps) {
  const session = await requireRole(role);
  const label = roleLabels[role];
  const contentReadOnly = false;
  const financeReadOnly = role !== "bendahara" && role !== "super_admin";
  const canAccessFinance = role === "super_admin" || role === "bendahara";
  const canAccessEducation = role === "super_admin" || role === "admin" || role === "pengurus";
  const activeFinanceView = canAccessFinance ? normalizeFinanceView(financeView) : null;
  const requestedEducationView = canAccessEducation
    ? normalizeEducationView(educationView)
    : null;
  const requestedPmbView = canAccessEducation ? normalizeEducationView(pmbView) : null;
  const isAllowedInstitution = (view: EducationView | null) => (
    view && (role !== "admin" || session.institution === view)
  );
  const activeEducationView = isAllowedInstitution(requestedEducationView)
    ? requestedEducationView
    : null;
  const activePmbView = isAllowedInstitution(requestedPmbView)
    ? requestedPmbView
    : null;
  const activeInstitutionView = activeEducationView || activePmbView;
  const activeEducationModule = activePmbView ? "pmb" : "education";
  const activeParticipantSection = normalizeEducationParticipantSection(
    sectionView,
    activeEducationView,
  );
  const activeParticipantLabel = activeEducationView
    ? educationNavGroups.find((item) => item.view === activeEducationView)?.participantLabel
    : undefined;
  const requestedModule = normalizeModule(moduleView);
  const activeModule =
    requestedModule && moduleAccess[role].includes(requestedModule)
      ? requestedModule
      : null;
  const activeEducationMode = contentReadOnly ? "view" : normalizeEducationMode(educationMode);
  const hasWorkspace = Boolean(
    activeFinanceView || activeInstitutionView || activeModule,
  );
  const showDashboardTopbar = !(
    activeEducationView && activeEducationModule === "education" && activeParticipantSection
  ) && !activePmbView;
  const visibleNavItems = navItems
    .filter((item) => item.roles.includes(role))
    .map((item) => {
      if (item.label === "Konsultasi" && role !== "super_admin") {
        return {
          ...item,
          children: item.children.filter((child) => child !== "Ustadz Bersertifikat"),
        };
      }

      if (
        role !== "admin"
        || item.label !== "PendidikanHub"
      ) {
        return item;
      }

      return {
        ...item,
        children: item.children,
      };
    });
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
    ? sectionView
      || (activeModule === "kajian"
        ? "artikel-kajian"
        : activeModule === "konsultasi"
          ? "pertanyaan-masuk"
          : slugifySection(moduleLabels[activeModule]))
    : "";
  const activeCertifiedUstadz = activeModule === "konsultasi"
    && activeSection === "ustadz-bersertifikat";
  const activeIncomingConsultation = activeModule === "konsultasi"
    && activeSection === "pertanyaan-masuk";
  const contentItems = activeModule === "tentang-kami"
    ? await getModuleContentItems(activeModule)
    : activeModule && !activeCertifiedUstadz
      ? await getContentItems(activeModule, activeSection)
      : [];
  let databaseAvailable = true;
  let financeTransactions: FinanceTransaction[] = [];
  let dashboardTransactions: DashboardTransaction[] = [];
  let dashboardContent: DashboardContent[] = [];
  let educationAdmins: EducationAdminRow[] = [];
  let certifiedUstadz: CertifiedUstadzItem[] = [];
  let pmbApplicants: PmbApplicant[] = [];

  if (activeModule === "manajemen" && role === "super_admin") {
    try {
      const admins = await prisma.user.findMany({
        where: {
          role: "admin",
          institution: { not: null },
        },
        select: {
          createdAt: true,
          id: true,
          institution: true,
          name: true,
          username: true,
        },
        orderBy: [{ institution: "asc" }, { name: "asc" }],
      });

      educationAdmins = admins.flatMap((admin: typeof admins[0]) => {
        if (!admin.institution || !isEducationInstitution(admin.institution)) {
          return [];
        }

        return [{
          ...admin,
          createdAt: new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Jakarta",
          }).format(admin.createdAt),
          institution: admin.institution,
        }];
      });
    } catch (error) {
      databaseAvailable = false;
      console.error("Admin database is unavailable:", error);
    }
  }

  if (activeCertifiedUstadz && role === "super_admin") {
    certifiedUstadz = await getCertifiedUstadzItems();
  }

  if (activePmbView) {
    try {
      const applications = await prisma.pmbApplication.findMany({
        where: { institution: activePmbView },
        orderBy: { createdAt: "desc" },
        select: {
          address: true,
          adminNote: true,
          billingAmount: true,
          billingCode: true,
          birthDate: true,
          birthPlace: true,
          certificateNumber: true,
          citizenship: true,
          docIjazahUrl: true,
          docKkUrl: true,
          docKtpUrl: true,
          docPhotoUrl: true,
          email: true,
          fatherName: true,
          gender: true,
          graduationYear: true,
          id: true,
          jalurName: true,
          jurusanName: true,
          kecamatan: true,
          kelurahan: true,
          kota: true,
          motherName: true,
          nisn: true,
          parentIncome: true,
          paymentProofUrl: true,
          phone: true,
          provinsi: true,
          registrationNumber: true,
          religion: true,
          rt: true,
          rw: true,
          schoolKecamatan: true,
          schoolName: true,
          schoolStatus: true,
          status: true,
          fullName: true,
        },
      });

      pmbApplicants = applications.map((application) => ({
        address: formatPmbAddress(application),
        agama: application.religion || "-",
        asalSekolah: application.schoolName || "-",
        billingAmount: application.billingAmount,
        billingCode: application.billingCode,
        birthDate: application.birthDate || "-",
        citizenship: application.citizenship || "-",
        docKkUrl: application.docKkUrl || "#",
        docKtpUrl: application.docKtpUrl || "#",
        email: application.email || "-",
        fatherName: application.fatherName || "-",
        gender: application.gender || "-",
        graduationYear: application.graduationYear || "-",
        id: application.id,
        ijazahUrl: application.docIjazahUrl || "#",
        income: application.parentIncome || "-",
        jalurName: application.jalurName || "-",
        jurusanName: application.jurusanName || "-",
        motherName: application.motherName || "-",
        name: application.fullName,
        nisn: application.nisn || "-",
        nomorDaftar: application.registrationNumber,
        nomorIjazah: application.certificateNumber || "-",
        paymentProofUrl: application.paymentProofUrl || "#",
        phone: application.phone || "-",
        photoUrl: application.docPhotoUrl || "#",
        placeOfBirth: application.birthPlace || "-",
        schoolKecamatan: application.schoolKecamatan || "-",
        schoolStatus: application.schoolStatus || "-",
        status: toPmbDisplayStatus(application.status),
        statusNote: application.adminNote || "",
        sudahBayar: Boolean(application.paymentProofUrl) || application.status === "sudah_bayar",
      }));
    } catch {
      databaseAvailable = false;
    }
  }

  if (activeFinanceView) {
    try {
      financeTransactions = (await prisma.financeTransaction.findMany({
        orderBy: [{ date: "desc" }, { id: "desc" }],
      })).map((transaction: Awaited<ReturnType<typeof prisma.financeTransaction.findMany>>[0]) => ({
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

  if (!hasWorkspace) {
    try {
      const [transactions, genericContent, news, studies, education] = await Promise.all([
        prisma.financeTransaction.findMany({
          where: canAccessFinance ? {} : { id: -1 },
          select: {
            id: true,
            type: true,
            date: true,
            category: true,
            detail: true,
            amount: true,
            authorName: true,
            updatedAt: true,
          },
          orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        }),
        prisma.contentItem.findMany({
          where: {
            ...(role === "admin" ? { id: -1 } : {}),
            module: { notIn: ["website", "kajian", "education", "pmb"] },
          },
          select: {
            id: true,
            module: true,
            section: true,
            title: true,
            status: true,
            authorName: true,
            updatedAt: true,
          },
          orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        }),
        prisma.news.findMany({
          where: role === "super_admin" || role === "pengurus" ? {} : { id: -1 },
          select: {
            id: true,
            section: true,
            title: true,
            status: true,
            authorName: true,
            updatedAt: true,
          },
          orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        }),
        prisma.studyArticle.findMany({
          where: role === "super_admin" || role === "ustadz" ? {} : { id: -1 },
          select: {
            id: true,
            section: true,
            title: true,
            status: true,
            authorName: true,
            updatedAt: true,
          },
          orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        }),
        prisma.educationInformation.findMany({
          where: role === "admin" && session.institution
            ? { section: session.institution }
            : role === "super_admin" || role === "pengurus"
              ? {}
              : { id: -1 },
          select: {
            id: true,
            module: true,
            section: true,
            title: true,
            status: true,
            authorName: true,
            updatedAt: true,
          },
          orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        }),
      ]);
      dashboardTransactions = transactions;
      dashboardContent = [
        ...genericContent,
        ...news.map((item: typeof news[0]) => ({ ...item, module: "website" })),
        ...studies.map((item: typeof studies[0]) => ({ ...item, module: "kajian" })),
        ...education,
      ];
    } catch (error) {
      databaseAvailable = false;
      console.error("Dashboard database is unavailable:", error);
    }
  }

  const dashboardStats = buildDashboardStats(role, dashboardTransactions, dashboardContent);
  const dashboardChart = buildChartData(dashboardTransactions);
  const dashboardActivities = buildActivities(dashboardTransactions, dashboardContent);

  return (
    <main className="dashboardApp">
      <input className="dashboardSidebarToggleInput" id="dashboardSidebarToggle" type="checkbox" />
      <aside className="dashboardSidebar">
        <div className="dashboardSidebarHead">
          <Link href="/" className="dashboardLogo dashboardBrand" aria-label="DDI Semarang Admin Panel">
            <span className="dashboardBrandMark">DDI</span>
            <span className="dashboardBrandText">
              <strong>DDI Semarang</strong>
              <small>Admin Panel</small>
            </span>
          </Link>
          <label className="dashboardSidebarToggleButton" htmlFor="dashboardSidebarToggle" aria-label="Buka atau tutup sidebar">
            <span />
          </label>
        </div>

        <nav className="dashboardNav" aria-label="Navigasi dashboard">
          {visibleNavItems.map((item) => {
            const moduleLink = moduleLinks[item.label];
            const isModuleActive = Boolean(moduleLink && activeModule === moduleLink);
            const isFinanceActive = item.label === "Keuangan" && Boolean(activeFinanceView);
            const isDropdownActive = isModuleActive || isFinanceActive;

            if (item.label === "Dashboard") {
              return (
                <div key={item.label} className="dashboardNavGroup">
                  <Link
                    className={
                      item.active && !hasWorkspace
                        ? "dashboardNavItem active"
                        : "dashboardNavItem"
                    }
                    href={roleHomePaths[role]}
                  >
                    <DashboardIcon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                </div>
              );
            }

            if (item.label === "Beranda" && role !== "super_admin") {
              return (
                <div key={item.label} className="dashboardNavGroup">
                  <Link className="dashboardNavItem" href="/">
                    <DashboardIcon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                </div>
              );
            }

            if (item.label === "PendidikanHub") {
              return (
                <section className="dashboardEducationNav" aria-label="Pendidikan" key={item.label}>
                  {educationNavGroups
                    .filter((group) => role !== "admin" || group.view === session.institution)
                    .map((group) => {
                      const isGroupActive = activeEducationView === group.view || activePmbView === group.view;
                      const isParticipantActive = activeEducationView === group.view
                        && activeParticipantSection === group.participantSection;
                      const isProfileActive = activeEducationView === group.view && !activeParticipantSection;

                      return (
                        <details className="dashboardDropdown dashboardEducationGroup" key={group.view} open={isGroupActive}>
                          <summary className={isGroupActive ? "dashboardNavItem dashboardDropdownSummary active" : "dashboardNavItem dashboardDropdownSummary"}>
                            <DashboardIcon name={group.icon} />
                            <span>{group.title}</span>
                            <span className="dashboardDropdownCaret">v</span>
                          </summary>
                          <div className="dashboardSubnav dashboardEducationChildren">
                            <Link
                              className={isProfileActive ? "active" : ""}
                              href={`${roleHomePaths[role]}?education=${group.view}`}
                            >
                              <DashboardIcon name="info" />
                              <span>{group.profileLabel}</span>
                            </Link>
                            <Link
                              className={isParticipantActive ? "active" : ""}
                              href={`${roleHomePaths[role]}?education=${group.view}&section=${group.participantSection}`}
                            >
                              <DashboardIcon name="users" />
                              <span>{group.participantLabel}</span>
                            </Link>
                            <Link
                              className={activePmbView === group.view ? "active" : ""}
                              href={`${roleHomePaths[role]}?pmb=${group.view}`}
                            >
                              <DashboardIcon name="clipboard" />
                              <span>PMB</span>
                            </Link>
                          </div>
                        </details>
                      );
                    })}
                </section>
              );
            }

            if (item.children.length > 0) {
              return (
                <details className="dashboardNavGroup dashboardDropdown" key={item.label} open={isDropdownActive}>
                  <summary className={isDropdownActive ? "dashboardNavItem dashboardDropdownSummary active" : "dashboardNavItem dashboardDropdownSummary"}>
                    <DashboardIcon name={item.icon} />
                    <span>{item.label}</span>
                    <span className="dashboardDropdownCaret">v</span>
                  </summary>
                  <div className="dashboardSubnav" aria-label={`${item.label} submenu`}>
                    {item.children.map((child) => {
                      const financeLink = financeLinks[child];
                      const educationLink = educationLinks[child];
                      const childSection = getSectionSlug(item.label, child);

                      return financeLink ? (
                        <Link
                          className={activeFinanceView === financeLink ? "active" : ""}
                          href={`${roleHomePaths[role]}?finance=${financeLink}`}
                          key={child}
                        >
                          {child}
                        </Link>
                      ) : educationLink ? (
                        <Link
                          className={
                            item.label === "PMB"
                              ? activePmbView === educationLink ? "active" : ""
                              : activeEducationView === educationLink ? "active" : ""
                          }
                          href={`${roleHomePaths[role]}?${
                            item.label === "PMB" ? "pmb" : "education"
                          }=${educationLink}`}
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
                          href={`${roleHomePaths[role]}?module=${moduleLink}&section=${childSection}`}
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
                </details>
              );
            }

            return (
              <div key={item.label} className="dashboardNavGroup">
                {moduleLink ? (
                  <Link
                    className={isModuleActive ? "dashboardNavItem active" : "dashboardNavItem"}
                    href={`${roleHomePaths[role]}?module=${moduleLink}&section=${getSectionSlug(item.label, item.label)}`}
                  >
                    <DashboardIcon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    className="dashboardNavItem"
                    type="button"
                  >
                    <DashboardIcon name={item.icon} />
                    <span>{item.label}</span>
                  </button>
                )}
              </div>
            );
          })}
        </nav>

        <form action={logoutAction} className="dashboardLogoutForm">
          <button type="submit" className="dashboardLogoutButton">
            <DashboardIcon name="logout" />
            <span>
            Logout
            </span>
          </button>
        </form>
      </aside>

      <section className="dashboardMain">
        {showDashboardTopbar ? (
          <header className={role === "super_admin" && !hasWorkspace ? "dashboardTopbar superHomeTopbar" : "dashboardTopbar"}>
            <div>
              <h1>
                {role === "super_admin" && !hasWorkspace
                  ? "Selamat datang di Admin Panel DDI Semarang"
                  : `Selamat datang, ${session.name}`}
              </h1>
              <p>{currentDate} - Sistem Internal Dewan Da&apos;wah</p>
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
                  <small>
                    {roleTitles[role]}
                    {role === "admin" && session.institution
                      ? ` - ${institutionLabels[session.institution]}`
                      : ""}
                  </small>
                </span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </header>
        ) : null}

        {activeFinanceView ? (
          <FinanceWorkspace
            databaseAvailable={databaseAvailable}
            view={activeFinanceView}
            initialTransactions={financeTransactions}
            readOnly={financeReadOnly}
          />
        ) : activeInstitutionView ? (
          <EducationWorkspace
            view={activeInstitutionView}
            mode={activeEducationMode}
            module={activeEducationModule}
            participantLabel={activeParticipantSection ? activeParticipantLabel : undefined}
            pmbApplicants={pmbApplicants}
            readOnly={contentReadOnly}
            role={role}
          />
        ) : activeModule ? (
          activeModule === "kajian" ? (
            <KajianManager items={contentItems} readOnly={contentReadOnly} section={activeSection} />
          ) : activeModule === "beranda" ? (
            <ContentManager
              items={contentItems}
              module="beranda"
              readOnly={contentReadOnly}
              section={activeSection}
              sectionLabel="Beranda"
            />
          ) : activeModule === "website" ? (
            <NewsManager items={contentItems} readOnly={contentReadOnly} section={activeSection} />
          ) : activeModule === "tentang-kami" ? (
            <AboutManager items={contentItems} readOnly={contentReadOnly} section={activeSection} />
          ) : activeModule === "manajemen" ? (
            <AdminManagement admins={educationAdmins} />
          ) : activeIncomingConsultation ? (
            <ConsultationQuestionsManager items={contentItems} readOnly={contentReadOnly} />
          ) : activeCertifiedUstadz ? (
            role === "super_admin" ? (
              <CertifiedUstadzManager items={certifiedUstadz} />
            ) : (
              <div className="dashboardDatabaseNotice">
                Hanya Super Admin yang dapat mengelola daftar ustadz bersertifikat.
              </div>
            )
          ) : (
            <ContentManager
              items={contentItems}
              module={activeModule}
              readOnly={contentReadOnly}
              section={activeSection}
              sectionLabel={activeSection
                .split("-")
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" ")}
            />
          )
        ) : (
          role === "super_admin" ? (
            <>
              {!databaseAvailable ? (
                <div className="dashboardDatabaseNotice">
                  Data dashboard belum dapat dibaca. Pastikan MySQL sedang berjalan.
                </div>
              ) : null}
              <SuperAdminOverview
                activities={dashboardActivities}
                chart={dashboardChart}
                content={dashboardContent}
                transactions={dashboardTransactions}
              />
            </>
          ) : (
            <>
            {!databaseAvailable ? (
              <div className="dashboardDatabaseNotice">
                Data dashboard belum dapat dibaca. Pastikan MySQL sedang berjalan.
              </div>
            ) : null}
            <section className="dashboardStats" aria-label={`Ringkasan ${label}`}>
              {dashboardStats.map((stat) => (
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
                    <span>6 Bulan Terakhir</span>
                  </div>
                </div>

                <div className="barChart" aria-label="Grafik batang keuangan">
                  {dashboardChart.map((item) => (
                    <div className="barMonth" key={item.key}>
                      <div className="barPair">
                        <span
                          className={`incomeBar ${item.income ? "" : "empty"}`}
                          style={{ height: `${item.incomeHeight}%` }}
                          title={`Pemasukan ${item.month}: ${formatDashboardRupiah(item.income)}`}
                        />
                        <span
                          className={`expenseBar ${item.expense ? "" : "empty"}`}
                          style={{ height: `${item.expenseHeight}%` }}
                          title={`Pengeluaran ${item.month}: ${formatDashboardRupiah(item.expense)}`}
                        />
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
                    <p>Berdasarkan data tersimpan</p>
                  </div>
                  <Link href={canAccessFinance
                    ? `${roleHomePaths[role]}?finance=laporan`
                    : roleHomePaths[role]}>
                    Lihat semua {"->"}
                  </Link>
                </div>

                <div className="activityList">
                  {dashboardActivities.map((activity) => (
                    <div className="activityItem" key={activity.key}>
                      <span className={`activityIcon ${activity.accent}`}>
                        <DashboardIcon name={activity.icon} />
                      </span>
                      <div>
                        <strong>{activity.title}</strong>
                        <p>{activity.meta}</p>
                      </div>
                    </div>
                  ))}
                  {dashboardActivities.length === 0 ? (
                    <div className="activityEmpty">
                      Belum ada transaksi atau perubahan konten.
                    </div>
                  ) : null}
                </div>
              </article>
            </section>
            </>
          )
        )}
      </section>
    </main>
  );
}
