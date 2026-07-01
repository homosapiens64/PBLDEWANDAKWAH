import InstitutionDetail, { type InstitutionDetailData } from "../InstitutionDetail";

const ponpesSuruhData: InstitutionDetailData = {
  titleTop: "Ponpes Suruh",
  titleAccent: "Semarang",
  description:
    "Pondok Pesantren Suruh adalah lembaga pendidikan Islam tradisional yang berada di bawah naungan Dewan Da'wah Islamiyah Indonesia Cabang Semarang. Pesantren ini menggabungkan pendidikan salaf yang kuat dengan kurikulum modern untuk membentuk santri yang hafiz, berakhlak, dan siap berdakwah.",
  registration: "Mei - Juli",
  capacity: "60 santri/angkatan",
  level: "Pesantren / Boarding",
  vision:
    "Terwujudnya masyarakat Kota Semarang yang bertaqwa, berakhlak mulia, beradab, serta mandiri secara sosial-ekonomi melalui da'wah Islam yang berdampak.",
  requirements: [
    "Muslim/Muslimah dan siap mengikuti pembinaan pesantren",
    "Lulusan SMP/MTs atau SMA/MA/sederajat sesuai program",
    "Mampu membaca Al-Qur'an dengan baik",
    "Bersedia tinggal di lingkungan pesantren",
    "Sehat jasmani dan rohani",
    "Mendapat izin serta dukungan orang tua atau wali",
  ],
  programs: [
    {
      title: "Tahfidz Al-Qur'an",
      description: "Program hafalan 30 juz dengan metode talaqqi dan muraja'ah intensif bersama hafidz senior.",
      badge: "Program Unggulan",
      icon: "star",
      tone: "gold",
    },
    {
      title: "Kitab Kuning (Salaf)",
      description: "Pengajian kitab klasik: fiqih, nahwu-sharaf, tauhid, hadits, tafsir, dan adab ulama salaf.",
      badge: "Salaf",
      icon: "book",
      tone: "green",
    },
    {
      title: "Dakwah & Muhadharah",
      description: "Latihan ceramah, khutbah, kultum, dan pidato bahasa Indonesia-Arab mingguan.",
      badge: "Dakwah",
      icon: "mic",
      tone: "blue",
    },
  ],
  admissionTitle: "Penerimaan Santri Baru",
  admissionDescription:
    "Pendaftaran santri baru Ponpes Suruh dibuka setiap tahun pada bulan Mei-Juli. Calon santri dapat mengikuti tahapan seleksi baca Al-Qur'an dan wawancara pembinaan.",
  contactTitle: "Kontak Ponpes Suruh",
  contact: {
    address: "Kec. Suruh, Kab. Semarang",
    phone: "(024) 765-4321",
    email: "ponpes-suruh@dewandakwah-semarang.or.id",
    hours: "Senin-Sabtu, 08.00-16.00 WIB",
  },
  registerHref: "/Pendidikan/pendaftaran?institution=ponpes-suruh",
};

export default function PonpesSuruhPage() {
  return <InstitutionDetail data={ponpesSuruhData} />;
}
