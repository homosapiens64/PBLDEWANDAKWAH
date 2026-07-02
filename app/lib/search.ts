import { prisma } from "./prisma";
import { ensureDomainContentTables } from "./content";

export type SearchResult = {
  id: string;
  type: "berita" | "kajian" | "pendidikan" | "halaman";
  typeLabel: string;
  title: string;
  summary: string;
  href: string;
  publishedAt: string | null;
};

const beritaSectionLabels: Record<string, string> = {
  terkini: "Terkini",
  kegiatan: "Kegiatan",
  nasional: "Nasional",
  internasional: "Internasional",
};

const kajianSectionLabels: Record<string, string> = {
  "artikel-kajian": "Artikel Kajian",
  "kajian-rutin": "Kajian Rutin",
  "kajian-tematik": "Kajian Tematik",
};

// Static/informational pages that should be reachable through search even
// though they are not stored in the database.
const staticPages: Array<{ title: string; summary: string; href: string; keywords: string }> = [
  { title: "Beranda", summary: "Halaman utama Dewan Da'wah Kota Semarang.", href: "/", keywords: "beranda home utama" },
  { title: "Kajian", summary: "Kumpulan artikel dan jadwal kajian.", href: "/Kajian", keywords: "kajian ceramah ustadz" },
  { title: "Konsultasi", summary: "Ajukan pertanyaan dan konsultasi keagamaan.", href: "/Konsultasi", keywords: "konsultasi tanya jawab ustadz syariah" },
  { title: "Pendidikan", summary: "Program dan lembaga pendidikan Dewan Da'wah.", href: "/Pendidikan", keywords: "pendidikan sekolah pesantren pendaftaran" },
  { title: "ADI - Akademi Da'wah Islam Indonesia", summary: "Lembaga pendidikan tinggi vokasi kader dai.", href: "/Pendidikan/ADI", keywords: "adi akademi dakwah kuliah vokasi dai" },
  { title: "Ponpes Suruh", summary: "Pondok pesantren di Suruh.", href: "/Pendidikan/PonpesSuruh", keywords: "ponpes pesantren suruh santri" },
  { title: "Al Khawarizmi", summary: "Lembaga pendidikan Al Khawarizmi.", href: "/Pendidikan/AlKhawarizmi", keywords: "al khawarizmi sekolah" },
  { title: "Pendaftaran Pendidikan", summary: "Informasi dan alur pendaftaran peserta didik baru.", href: "/Pendidikan/pendaftaran", keywords: "pendaftaran pmb daftar peserta didik baru" },
  { title: "Profil Organisasi", summary: "Profil Dewan Da'wah Kota Semarang.", href: "/TentangKami/Profile", keywords: "profil tentang kami organisasi sejarah" },
  { title: "AD & ART", summary: "Anggaran Dasar dan Anggaran Rumah Tangga.", href: "/TentangKami/AdDanArt", keywords: "ad art anggaran dasar rumah tangga" },
  { title: "Struktur Kepengurusan", summary: "Susunan pengurus organisasi.", href: "/TentangKami/StrukturKepengurusan", keywords: "struktur pengurus kepengurusan pengelola" },
  { title: "Program Kerja", summary: "Program kerja Dewan Da'wah Kota Semarang.", href: "/TentangKami/Program", keywords: "program kerja kegiatan agenda" },
];

function normalize(value: string | null | undefined) {
  return (value ?? "").toLowerCase();
}

function buildSummary(summary: string | null, body: string) {
  const source = (summary && summary.trim()) || body || "";
  const plain = source.replace(/\s+/g, " ").trim();
  return plain.length > 180 ? `${plain.slice(0, 177)}…` : plain;
}

export async function searchAll(rawQuery: string): Promise<SearchResult[]> {
  const query = rawQuery.trim();
  if (!query) {
    return [];
  }

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (haystack: string) => terms.every((term) => haystack.includes(term));

  const results: SearchResult[] = [];

  try {
    await ensureDomainContentTables();

    const [news, studies, education] = await Promise.all([
      prisma.news.findMany({
        where: { status: "published" },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        take: 200,
      }),
      prisma.studyArticle.findMany({
        where: { status: "published" },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        take: 200,
      }),
      prisma.educationInformation.findMany({
        where: { status: "published" },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        take: 200,
      }),
    ]);

    for (const item of news) {
      const haystack = normalize(`${item.title} ${item.summary ?? ""} ${item.body} ${item.tags ?? ""}`);
      if (!matches(haystack)) continue;
      results.push({
        id: `berita-${item.id}`,
        type: "berita",
        typeLabel: `Berita · ${beritaSectionLabels[item.section] ?? item.section}`,
        title: item.title,
        summary: buildSummary(item.summary, item.body),
        href: `/Berita/baca/${item.id}`,
        publishedAt: (item.publishedAt ?? item.updatedAt).toISOString(),
      });
    }

    for (const item of studies) {
      const haystack = normalize(`${item.title} ${item.summary ?? ""} ${item.body} ${item.tags ?? ""}`);
      if (!matches(haystack)) continue;
      results.push({
        id: `kajian-${item.id}`,
        type: "kajian",
        typeLabel: `Kajian · ${kajianSectionLabels[item.section] ?? item.section}`,
        title: item.title,
        summary: buildSummary(item.summary, item.body),
        href: `/Kajian/baca/${item.id}`,
        publishedAt: (item.publishedAt ?? item.updatedAt).toISOString(),
      });
    }

    for (const item of education) {
      const haystack = normalize(`${item.title} ${item.summary ?? ""} ${item.body} ${item.tags ?? ""}`);
      if (!matches(haystack)) continue;
      results.push({
        id: `pendidikan-${item.id}`,
        type: "pendidikan",
        typeLabel: "Pendidikan",
        title: item.title,
        summary: buildSummary(item.summary, item.body),
        href: "/Pendidikan",
        publishedAt: (item.publishedAt ?? item.updatedAt).toISOString(),
      });
    }
  } catch (error) {
    console.warn("Search database is unavailable:", error);
  }

  for (const page of staticPages) {
    const haystack = normalize(`${page.title} ${page.summary} ${page.keywords}`);
    if (!matches(haystack)) continue;
    results.push({
      id: `halaman-${page.href}`,
      type: "halaman",
      typeLabel: "Halaman",
      title: page.title,
      summary: page.summary,
      href: page.href,
      publishedAt: null,
    });
  }

  // Rank exact title matches first, then by recency.
  const lowerQuery = query.toLowerCase();
  return results.sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(lowerQuery) ? 1 : 0;
    const bTitle = b.title.toLowerCase().includes(lowerQuery) ? 1 : 0;
    if (aTitle !== bTitle) return bTitle - aTitle;
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
}
