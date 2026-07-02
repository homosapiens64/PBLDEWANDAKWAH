import { prisma } from "./prisma";

export type EducationView = "adi" | "ponpes-suruh" | "al-khawarizmi";

export type EducationProfileField = {
  icon: string;
  label: string;
  name: string;
  value: string;
};

export type EducationProfile = {
  description: string;
  editTitle: string;
  icon: string;
  imageUrl: string;
  institutionName: string;
  subtitle: string;
  tagline: string;
  title: string;
  vision: string;
  missions: string[];
  fields: EducationProfileField[];
};

type EducationInformationRecord = {
  body: string;
  imageUrl: string | null;
  summary: string | null;
  title: string;
};

type EducationProfilePayload = {
  description?: unknown;
  fields?: unknown;
  imageUrl?: unknown;
  institutionName?: unknown;
  tagline?: unknown;
};

export const educationProfileDefaults: Record<EducationView, EducationProfile> = {
  adi: {
    icon: "graduation",
    imageUrl: "",
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
    icon: "home",
    imageUrl: "",
    title: "Ponpes Suruh",
    editTitle: "Edit Profil Ponpes Suruh",
    institutionName: "Pondok Pesantren Suruh",
    subtitle: "Profil & informasi lembaga",
    tagline: "Pendidikan Islam Tradisional Berkualitas Modern",
    description:
      "Pondok Pesantren Suruh adalah lembaga pendidikan Islam tradisional di bawah naungan Dewan Da'wah Islamiyah Indonesia Cabang Semarang. Menggabungkan pendidikan salaf yang kuat dengan kurikulum modern.",
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
    icon: "file",
    imageUrl: "",
    title: "Al Khawarizmi",
    editTitle: "Edit Profil Al Khawarizmi",
    institutionName: "Al Khawarizmi",
    subtitle: "Profil & informasi lembaga",
    tagline: "Integrasi Ilmu Agama & Sains Teknologi",
    description:
      "Al Khawarizmi adalah lembaga pendidikan Islam terpadu yang mengintegrasikan ilmu agama dengan ilmu sains dan teknologi modern. Terinspirasi dari nama ilmuwan Muslim terbesar.",
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

export const educationViews = Object.keys(educationProfileDefaults) as EducationView[];

export function isEducationView(value: string): value is EducationView {
  return educationViews.includes(value as EducationView);
}

export function getEducationField(profile: EducationProfile, name: string) {
  return profile.fields.find((field) => field.name === name)?.value ?? "";
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function parseProfileBody(body: string): EducationProfilePayload | null {
  try {
    const parsed = JSON.parse(body) as unknown;
    return parsed && typeof parsed === "object" ? parsed as EducationProfilePayload : null;
  } catch {
    return null;
  }
}

function readFieldValue(fields: unknown, fieldName: string) {
  if (fields && typeof fields === "object" && !Array.isArray(fields)) {
    const value = (fields as Record<string, unknown>)[fieldName];
    return asString(value);
  }

  if (Array.isArray(fields)) {
    const field = fields.find((item) => (
      item && typeof item === "object" && (item as { name?: unknown }).name === fieldName
    ));
    return field && typeof field === "object"
      ? asString((field as { value?: unknown }).value)
      : "";
  }

  return "";
}

export function mergeEducationProfile(
  view: EducationView,
  record?: EducationInformationRecord | null,
): EducationProfile {
  const base = educationProfileDefaults[view];

  if (!record) {
    return {
      ...base,
      fields: base.fields.map((field) => ({ ...field })),
      missions: [...base.missions],
    };
  }

  const payload = parseProfileBody(record.body);
  const description = payload
    ? asString(payload.description) || base.description
    : record.body || base.description;
  const fields = base.fields.map((field) => ({
    ...field,
    value: payload ? readFieldValue(payload.fields, field.name) || field.value : field.value,
  }));

  return {
    ...base,
    description,
    fields,
    imageUrl: (payload ? asString(payload.imageUrl) : "") || record.imageUrl || "",
    institutionName: (payload ? asString(payload.institutionName) : "") || record.title || base.institutionName,
    missions: [...base.missions],
    tagline: (payload ? asString(payload.tagline) : "") || record.summary || base.tagline,
  };
}

export async function getEducationProfile(view: EducationView) {
  try {
    const record = await prisma.educationInformation.findFirst({
      where: { module: "education", section: view, tags: "profile" },
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    });

    return mergeEducationProfile(view, record);
  } catch {
    console.warn(`Education profile database is unavailable for ${view}.`);
    return mergeEducationProfile(view);
  }
}

export async function getEducationProfiles() {
  const profiles = Object.fromEntries(
    educationViews.map((view) => [view, mergeEducationProfile(view)]),
  ) as Record<EducationView, EducationProfile>;

  try {
    const records = await prisma.educationInformation.findMany({
      where: { module: "education", section: { in: [...educationViews] }, tags: "profile" },
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    });
    const seen = new Set<string>();

    for (const record of records) {
      if (!isEducationView(record.section) || seen.has(record.section)) {
        continue;
      }
      profiles[record.section] = mergeEducationProfile(record.section, record);
      seen.add(record.section);
    }
  } catch {
    console.warn("Education profile database is unavailable.");
  }

  return profiles;
}

export function serializeEducationProfilePayload(profile: {
  description: string;
  fields: Array<{ name: string; value: string }>;
  imageUrl: string;
  institutionName: string;
  tagline: string;
}) {
  return JSON.stringify({
    description: profile.description,
    fields: Object.fromEntries(profile.fields.map((field) => [field.name, field.value])),
    imageUrl: profile.imageUrl,
    institutionName: profile.institutionName,
    tagline: profile.tagline,
  });
}
