import InstitutionDetail, { type InstitutionDetailData } from "../InstitutionDetail";

const alKhawarizmiData: InstitutionDetailData = {
  titleTop: "Al Khawarizmi",
  titleAccent: "Semarang",
  description:
    "Al Khawarizmi adalah lembaga pendidikan Islam terpadu yang mengintegrasikan ilmu agama dengan ilmu sains dan teknologi modern. Terinspirasi dari ilmuwan Muslim besar, lembaga ini bertekad melahirkan generasi Muslim yang unggul secara akademik, kuat secara aqidah, dan siap menghadapi tantangan zaman.",
  registration: "Juni - Agustus",
  capacity: "60 siswa/angkatan",
  level: "Sekolah Islam Terpadu",
  vision:
    "Terwujudnya generasi Muslim yang bertaqwa, berilmu, berakhlak mulia, dan cakap menggunakan ilmu pengetahuan untuk memberi manfaat bagi masyarakat.",
  requirements: [
    "Muslim/Muslimah dan memiliki semangat belajar yang baik",
    "Melampirkan rapor serta dokumen pendidikan terakhir",
    "Mampu membaca Al-Qur'an sesuai jenjang masuk",
    "Mengikuti observasi akademik dan wawancara orang tua",
    "Sehat jasmani dan rohani",
    "Bersedia mengikuti pembinaan karakter Islami",
  ],
  programs: [
    {
      title: "Tahfidz & Tahsin",
      description: "Pembinaan bacaan, hafalan, dan adab bersama Al-Qur'an secara bertahap sesuai capaian siswa.",
      badge: "Qur'ani",
      icon: "book",
      tone: "gold",
    },
    {
      title: "Sains Terpadu",
      description: "Pembelajaran sains dan matematika yang dikaitkan dengan nilai keimanan dan kehidupan nyata.",
      badge: "Terpadu",
      icon: "code",
      tone: "green",
    },
    {
      title: "Karakter & Leadership",
      description: "Pembiasaan akhlak, kemandirian, kepemimpinan, dan kepedulian sosial dalam aktivitas harian.",
      badge: "Karakter",
      icon: "shield",
      tone: "blue",
    },
  ],
  admissionTitle: "Penerimaan Peserta Didik Baru",
  admissionDescription:
    "Pendaftaran peserta didik baru Al Khawarizmi dibuka setiap tahun pada bulan Juni-Agustus dengan tahapan observasi akademik dan wawancara keluarga.",
  contactTitle: "Kontak Al Khawarizmi",
  contact: {
    address: "Kota Semarang",
    phone: "(024) 456-7890",
    email: "alkhawarizmi@dewandakwah-semarang.or.id",
    hours: "Senin-Jumat, 08.00-15.30 WIB",
  },
  registerHref: "/Pendidikan/pmb",
};

export default function AlKhawarizmiPage() {
  return <InstitutionDetail data={alKhawarizmiData} />;
}
