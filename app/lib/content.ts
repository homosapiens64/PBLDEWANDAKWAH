import { prisma } from "./prisma";
import type { UserRole } from "./auth";

export type EditableModule = "pmb" | "kajian" | "konsultasi" | "website" | "manajemen" | "tentang-kami";

export type PublicContentItem = {
  id: number;
  module: string;
  section: string;
  title: string;
  summary: string;
  body: string;
  imageUrl: string;
  tags: string;
  status: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
};

export const modulePermissions: Record<EditableModule, UserRole[]> = {
  pmb: ["admin", "pengurus"],
  kajian: ["admin", "ustadz"],
  konsultasi: ["admin", "ustadz"],
  website: ["admin", "pengurus"],
  manajemen: ["admin"],
  "tentang-kami": ["admin", "pengurus"],
};

export function canEditModule(role: UserRole, module: string): module is EditableModule {
  return module in modulePermissions
    && modulePermissions[module as EditableModule].includes(role);
}

export function serializeContentItem(item: {
  id: number;
  module: string;
  section: string;
  title: string;
  summary: string | null;
  body: string;
  imageUrl: string | null;
  tags: string | null;
  status: string;
  authorName: string;
  authorRole: string;
  publishedAt: Date | null;
  updatedAt: Date;
}): PublicContentItem {
  return {
    ...item,
    summary: item.summary ?? "",
    imageUrl: item.imageUrl ?? "",
    tags: item.tags ?? "",
    publishedAt: (item.publishedAt ?? item.updatedAt).toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export async function getContentItems(module: string, section: string) {
  try {
    const items = await prisma.contentItem.findMany({
      where: { module, section },
      orderBy: [{ updatedAt: "desc" }],
    });

    return items.map(serializeContentItem);
  } catch {
    console.warn(`Content database is unavailable for ${module}/${section}.`);
    return [];
  }
}

export async function getModuleContentItems(module: string) {
  try {
    const items = await prisma.contentItem.findMany({
      where: { module },
      orderBy: [{ section: "asc" }, { updatedAt: "desc" }],
    });

    return items.map(serializeContentItem);
  } catch {
    console.warn(`Content database is unavailable for ${module}.`);
    return [];
  }
}
