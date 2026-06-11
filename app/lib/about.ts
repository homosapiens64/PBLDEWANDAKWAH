import { getModuleContentItems, type PublicContentItem } from "./content";

export type AboutMeta = Record<string, string>;

export function parseAboutMeta<T extends AboutMeta>(value: string, fallback: T): T {
  try {
    return { ...fallback, ...JSON.parse(value) } as T;
  } catch {
    return fallback;
  }
}

export async function getAboutItems() {
  const items = await getModuleContentItems("tentang-kami");
  return items.filter((item) => item.status === "published");
}

export function findAboutItem(items: PublicContentItem[], section: string) {
  return items.find((item) => item.section === section);
}

export const profileFallback = {
  sejarah: {
    title: "Sejarah Organisasi",
    body:
      "Dewan Da'wah Islamiyah Indonesia didirikan pada tahun 1967 oleh Mohammad Natsir bersama para ulama dan tokoh dakwah. Organisasi ini lahir untuk memperkuat pembinaan umat, menjaga akidah, dan menghadirkan dakwah yang menjawab kebutuhan masyarakat.",
  },
  visiMisi: {
    title: "Visi & Misi",
    body:
      "Visi: Terwujudnya masyarakat Kota Semarang yang bertakwa, berakhlak mulia, beradab, dan mandiri melalui dakwah Islam yang berdampak.\n\nMisi:\n1. Menguatkan dakwah berlandaskan Al-Quran dan As-Sunnah.\n2. Mengembangkan pendidikan Islam berkualitas.\n3. Mendorong kemandirian ekonomi umat.\n4. Memanfaatkan teknologi sebagai sarana dakwah.\n5. Membangun jejaring dan kemitraan strategis.",
  },
  cabang: {
    title: "Cabang Kota Semarang",
    body:
      "Dewan Da'wah Kota Semarang berkomitmen mendukung pembinaan umat di tingkat daerah melalui program dakwah, pendidikan, sosial, ekonomi, serta pemanfaatan teknologi yang berbasis kebutuhan nyata masyarakat.",
  },
  kontak: {
    title: "Kontak & Lokasi",
    body:
      "Kesekretariatan Dewan Da'wah Kota Semarang\nJl. Wirijan, Semarang Tengah\nEmail: info@dewandakwahsemarang.com\nTelepon: (629) 555-0129",
  },
};

export const structureFallback = [
  {
    title: "Dewan Penasehat",
    description: "Dewan Penasehat Organisasi",
    unitType: "Dewan Penasehat",
    leader: "Dr. Ir. Achmad Syafi'i, M.Pd.I.",
    members: "Drs. Muhammad Asrori, M.Si., M.Pd.I.\nDrs. Anwar Cholil",
    order: "1",
  },
  {
    title: "Pimpinan Harian",
    description: "Pimpinan harian Dewan Da'wah Kota Semarang",
    unitType: "Pimpinan Harian",
    leader: "Prof. Ir. Yusuf Dewantoro Herlambang, S.T., M.T., Ph.D.",
    members: "Sucipto, S.E., Ak\nSyahid, S.T., M.Eng\nSeptiantar Tebe Nursaputro, S.T., M.Tr.T.",
    order: "2",
  },
];

export const programFallback = [
  {
    title: "Pembinaan Da'i",
    description: "Pelatihan berkala, mentoring lapangan, dan penguatan dakwah digital.",
    status: "aktif",
    startDate: "",
    endDate: "",
  },
  {
    title: "Pendidikan Umat",
    description: "Kajian rutin, beasiswa santri, dan program literasi Islam.",
    status: "aktif",
    startDate: "",
    endDate: "",
  },
  {
    title: "Sosial Kemanusiaan",
    description: "Bakti sosial, layanan dhuafa, dan penguatan relawan daerah.",
    status: "aktif",
    startDate: "",
    endDate: "",
  },
];
