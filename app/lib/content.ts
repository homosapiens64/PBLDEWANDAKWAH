import { prisma } from "./prisma";
import type { UserRole } from "./auth";

export type EditableModule = "beranda" | "education" | "pmb" | "kajian" | "konsultasi" | "website" | "manajemen" | "tentang-kami";

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
  beranda: ["super_admin"],
  education: ["super_admin", "admin", "pengurus"],
  pmb: ["super_admin", "admin", "pengurus"],
  kajian: ["super_admin", "ustadz"],
  konsultasi: ["super_admin", "ustadz"],
  website: ["super_admin", "pengurus"],
  manajemen: [],
  "tentang-kami": ["super_admin", "pengurus"],
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

let domainContentTablesReady: Promise<void> | null = null;

export function ensureDomainContentTables() {
  domainContentTablesReady ??= (async () => {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS news (
        id INT NOT NULL AUTO_INCREMENT,
        section VARCHAR(50) NOT NULL,
        title VARCHAR(180) NOT NULL,
        summary TEXT NULL,
        body TEXT NOT NULL,
        image_url LONGTEXT NULL,
        tags VARCHAR(300) NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'published',
        author_role VARCHAR(20) NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        published_at DATETIME(3) NULL,
        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id),
        INDEX news_section_status_idx (section, status)
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS study_articles (
        id INT NOT NULL AUTO_INCREMENT,
        section VARCHAR(50) NOT NULL,
        title VARCHAR(180) NOT NULL,
        summary TEXT NULL,
        body TEXT NOT NULL,
        image_url LONGTEXT NULL,
        tags VARCHAR(300) NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'published',
        author_role VARCHAR(20) NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        published_at DATETIME(3) NULL,
        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id),
        INDEX study_articles_section_status_idx (section, status)
      )
    `);

    try {
      await prisma.$executeRawUnsafe(`
        INSERT IGNORE INTO news
          (id, section, title, summary, body, image_url, tags, status, author_role, author_name, published_at, created_at, updated_at)
        SELECT
          id, section, title, summary, body, image_url, tags, status, author_role, author_name, published_at, created_at, updated_at
        FROM content_items
        WHERE module = 'website'
      `);

      await prisma.$executeRawUnsafe(`
        INSERT IGNORE INTO study_articles
          (id, section, title, summary, body, image_url, tags, status, author_role, author_name, published_at, created_at, updated_at)
        SELECT
          id, section, title, summary, body, image_url, tags, status, author_role, author_name, published_at, created_at, updated_at
        FROM content_items
        WHERE module = 'kajian'
      `);
    } catch (error) {
      console.warn("Legacy content_items migration skipped:", error);
    }
  })();

  return domainContentTablesReady;
}

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
      await ensureDomainContentTables();
      const items = await prisma.news.findMany({
        where: { section },
        orderBy: [{ updatedAt: "desc" }],
      });
      return items.map((item: typeof items[0]) => serializeDomainContentItem(item, "website"));
    }
    if (module === "kajian") {
      await ensureDomainContentTables();
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
    if (module === "website") {
      await ensureDomainContentTables();
      const items = await prisma.news.findMany({
        orderBy: [{ section: "asc" }, { updatedAt: "desc" }],
      });

      return items.map((item: typeof items[0]) => serializeDomainContentItem(item, "website"));
    }

    if (module === "kajian") {
      await ensureDomainContentTables();
      const items = await prisma.studyArticle.findMany({
        orderBy: [{ section: "asc" }, { updatedAt: "desc" }],
      });

      return items.map((item: typeof items[0]) => serializeDomainContentItem(item, "kajian"));
    }

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
      await ensureDomainContentTables();
      const items = await prisma.news.findMany({ where, orderBy });
      return items.map((item: typeof items[0]) => serializeDomainContentItem(item, "website"));
    }
    if (module === "kajian") {
      await ensureDomainContentTables();
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

export async function getPublishedContentItemById(
  module: "website" | "kajian",
  id: number,
): Promise<PublicContentItem | null> {
  try {
    if (module === "website") {
      await ensureDomainContentTables();
      const item = await prisma.news.findFirst({
        where: { id, status: "published" },
      });

      return item ? serializeDomainContentItem(item, "website") : null;
    }

    await ensureDomainContentTables();
    const item = await prisma.studyArticle.findFirst({
      where: { id, status: "published" },
    });

    return item ? serializeDomainContentItem(item, "kajian") : null;
  } catch {
    console.warn(`Published content database is unavailable for ${module}/${id}.`);
    return null;
  }
}
