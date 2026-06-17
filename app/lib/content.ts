import { prisma } from "./prisma";
import type { UserRole } from "./auth";

export type EditableModule = "education" | "pmb" | "kajian" | "konsultasi" | "website" | "manajemen" | "tentang-kami";

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
  education: ["admin", "pengurus"],
  pmb: ["admin", "pengurus"],
  kajian: ["ustadz"],
  konsultasi: ["ustadz"],
  website: ["pengurus"],
  manajemen: [],
  "tentang-kami": ["pengurus"],
};

export function canEditModule(role: UserRole, module: string): module is EditableModule {
  return module in modulePermissions
    && modulePermissions[module as EditableModule].includes(role);
}

type StoredContentItem = {
  id: number;
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
};

export function serializeContentItem(
  item: StoredContentItem & { module: string },
): PublicContentItem {
  return {
    ...item,
    summary: item.summary ?? "",
    imageUrl: item.imageUrl ?? "",
    tags: item.tags ?? "",
    publishedAt: (item.publishedAt ?? item.updatedAt).toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export function serializeDomainContentItem(
  item: StoredContentItem,
  module: "education" | "kajian" | "pmb" | "website",
): PublicContentItem {
  return serializeContentItem({ ...item, module });
}

export async function getContentItems(module: string, section: string) {
  try {
    if (module === "website") {
      const items = await prisma.news.findMany({
        where: { section },
        orderBy: [{ updatedAt: "desc" }],
      });
      return items.map((item: typeof items[0]) => serializeDomainContentItem(item, "website"));
    }
    if (module === "kajian") {
      const items = await prisma.studyArticle.findMany({
        where: { section },
        orderBy: [{ updatedAt: "desc" }],
      });
      return items.map((item: typeof items[0]) => serializeDomainContentItem(item, "kajian"));
    }
    if (module === "education" || module === "pmb") {
      const items = await prisma.educationInformation.findMany({
        where: { module, section },
        orderBy: [{ updatedAt: "desc" }],
      });
      return items.map((item: typeof items[0]) => serializeDomainContentItem(item, module));
    }

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

export async function getModuleContentItems(module: string): Promise<PublicContentItem[]> {
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

export async function getPublishedContentItems(module: string, section?: string): Promise<PublicContentItem[]> {
  try {
    const where = {
      status: "published",
      ...(section ? { section } : {}),
    };
    const orderBy = [
      { publishedAt: "desc" as const },
      { updatedAt: "desc" as const },
    ];

    if (module === "website") {
      const items = await prisma.news.findMany({ where, orderBy });
      return items.map((item: typeof items[0]) => serializeDomainContentItem(item, "website"));
    }
    if (module === "kajian") {
      const items = await prisma.studyArticle.findMany({ where, orderBy });
      return items.map((item: typeof items[0]) => serializeDomainContentItem(item, "kajian"));
    }
    if (module === "education" || module === "pmb") {
      const items = await prisma.educationInformation.findMany({
        where: { module, ...where },
        orderBy,
      });
      return items.map((item: typeof items[0]) => serializeDomainContentItem(item, module));
    }

    const items = await prisma.contentItem.findMany({
      where: {
        module,
        ...where,
      },
      orderBy,
    });

    return items.map(serializeContentItem);
  } catch {
    console.warn(
      `Published content database is unavailable for ${module}${section ? `/${section}` : ""}.`,
    );
    return [];
  }
}
