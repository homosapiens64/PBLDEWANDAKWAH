import InstitutionDetail, { type InstitutionDetailData } from "../InstitutionDetail";
import { getEducationField, getEducationProfile } from "../../lib/education-profile";

const adiData: InstitutionDetailData = {
  titleTop: "Akademi Da'wah Islam",
  titleAccent: "Indonesia",
  description:
    "ADI adalah lembaga pendidikan tinggi vokasi yang berfokus pada pembinaan kader dai profesional. Mahasiswa ADI dibekali ilmu syariah, metode dakwah, kepemimpinan Islam, dan keterampilan komunikasi publik agar siap berdakwah di tengah masyarakat.",
  registration: "Juni - Agustus",
  capacity: "60 mahasiswa/angkatan",
  level: "D3 / Vokasi",
  requirements: [
    "Muslim/Muslimah, usia minimal 18 tahun",
    "Lulusan SMA/MA/sederajat atau lebih tinggi",
    "Memiliki niat kuat berdakwah di jalan Allah",
    "Mampu membaca Al-Qur'an dengan baik dan benar",
    "Sehat jasmani dan rohani",
    "Mendapat rekomendasi dari tokoh setempat atau masjid",
  ],
  programs: [
    {
      title: "Ilmu Dakwah & Komunikasi",
      description: "Teori dan praktik dakwah, retorika Islam, serta komunikasi publik berbasis nilai Qur'an.",
      badge: "3 Semester",
      icon: "message",
      tone: "green",
    },
    {
      title: "Fiqih & Ushul Fiqih",
      description: "Dasar hukum Islam, metodologi istinbath hukum, dan penerapan fiqih kontemporer.",
      badge: "3 Semester",
      icon: "book",
      tone: "gold",
    },
    {
      title: "Leadership & Manajemen Dakwah",
      description: "Kepemimpinan Islam, manajemen organisasi dakwah, dan pengembangan komunitas.",
      badge: "2 Semester",
      icon: "grad",
      tone: "blue",
    },
    {
      title: "Praktek Lapangan Dakwah",
      description: "Penempatan mahasiswa di komunitas dan masjid untuk praktik dakwah langsung di masyarakat.",
      badge: "1 Semester",
      icon: "home",
      tone: "purple",
    },
  ],
  admissionTitle: "Penerimaan Mahasiswa Baru",
  admissionDescription:
    "Pendaftaran mahasiswa baru ADI dibuka setiap tahun pada bulan Juni-Agustus. Tersedia pendampingan seleksi bagi calon dai berprestasi.",
  contactTitle: "Kontak ADI Semarang",
  contact: {
    address: "Jl. Wajan, Semarang Tengah",
    phone: "(024) 123-4567",
    email: "adi@dewandakwah-semarang.or.id",
    hours: "Senin-Jumat, 08.00-16.00 WIB",
  },
  registerHref: "/Pendidikan/pendaftaran?institution=adi",
};

export default async function ADIPage() {
  const profile = await getEducationProfile("adi");
  const data: InstitutionDetailData = {
    ...adiData,
    capacity: getEducationField(profile, "capacity") || adiData.capacity,
    contact: {
      address: getEducationField(profile, "address") || adiData.contact.address,
      email: getEducationField(profile, "email") || adiData.contact.email,
      hours: getEducationField(profile, "hours") || adiData.contact.hours,
      phone: getEducationField(profile, "phone") || adiData.contact.phone,
    },
    description: profile.description || adiData.description,
    imageUrl: profile.imageUrl,
    level: getEducationField(profile, "level") || adiData.level,
    registration: getEducationField(profile, "registration") || adiData.registration,
  };

  return <InstitutionDetail data={data} />;
}
