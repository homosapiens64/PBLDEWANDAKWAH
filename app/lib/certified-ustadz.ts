import { prisma } from "./prisma";

export type CertifiedUstadzItem = {
  id: number;
  isActive: boolean;
  name: string;
  sortOrder: number;
  specialization: string;
  updatedAt: string;
};

const fallbackCertifiedUstadz: CertifiedUstadzItem[] = [
  {
    id: -1,
    isActive: true,
    name: "Dr. Ahmad Hadi, Lc",
    sortOrder: 1,
    specialization: "Spesialis fikih dan pembinaan keluarga",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: -2,
    isActive: true,
    name: "Dr. Saiful Rahman, M.A",
    sortOrder: 2,
    specialization: "Spesialis fikih dan pembinaan keluarga",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: -3,
    isActive: true,
    name: "Dr. Fathur Rahman, Lc",
    sortOrder: 3,
    specialization: "Spesialis fikih dan pembinaan keluarga",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: -4,
    isActive: true,
    name: "Ust. Hasan Sabil, M.Ag",
    sortOrder: 4,
    specialization: "Spesialis fikih dan pembinaan keluarga",
    updatedAt: new Date(0).toISOString(),
  },
];

type StoredCertifiedUstadz = {
  id: number;
  isActive: boolean;
  name: string;
  sortOrder: number;
  specialization: string;
  updatedAt: Date;
};

function serializeCertifiedUstadz(item: StoredCertifiedUstadz): CertifiedUstadzItem {
  return {
    ...item,
    updatedAt: item.updatedAt.toISOString(),
  };
}

export async function getPublishedCertifiedUstadz(): Promise<CertifiedUstadzItem[]> {
  try {
    const items = await prisma.certifiedUstadz.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });

    return items.map(serializeCertifiedUstadz);
  } catch {
    console.warn("Certified ustadz database is unavailable.");
    return fallbackCertifiedUstadz;
  }
}

export async function getCertifiedUstadzItems(): Promise<CertifiedUstadzItem[]> {
  try {
    const items = await prisma.certifiedUstadz.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });

    return items.map(serializeCertifiedUstadz);
  } catch {
    console.warn("Certified ustadz database is unavailable for dashboard.");
    return [];
  }
}
