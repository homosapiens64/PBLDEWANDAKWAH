import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { serializeContentItem, serializeDomainContentItem } from "../../lib/content";

export async function GET(request: Request) {
  const requestedModule = new URL(request.url).searchParams.get("module");
  const allowedModules = ["beranda", "website", "kajian", "education"];
  const moduleFilter = requestedModule && allowedModules.includes(requestedModule)
    ? [requestedModule]
    : allowedModules;

  const [home, news, studies, education, finance] = await Promise.all([
    moduleFilter.includes("beranda")
      ? prisma.contentItem.findMany({
          where: { module: "beranda", status: "published" },
          orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
          take: 100,
        })
      : [],
    moduleFilter.includes("website")
      ? prisma.news.findMany({
          where: { status: "published" },
          orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
          take: 100,
        })
      : [],
    moduleFilter.includes("kajian")
      ? prisma.studyArticle.findMany({
          where: { status: "published" },
          orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
          take: 100,
        })
      : [],
    moduleFilter.includes("education")
      ? prisma.educationInformation.findMany({
          where: { status: "published" },
          orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
          take: 100,
        })
      : [],
    prisma.financeTransaction.groupBy({
      by: ["type"],
      _sum: { amount: true },
    }),
  ]);

  const totals = Object.fromEntries(
    finance.map((entry: typeof finance[0]) => [entry.type, entry._sum.amount ?? 0]),
  );
  const items = [
    ...home.map(serializeContentItem),
    ...news.map((item: typeof news[0]) => serializeDomainContentItem(item, "website")),
    ...studies.map((item: typeof studies[0]) => serializeDomainContentItem(item, "kajian")),
    ...education.map((item: typeof education[0]) => serializeDomainContentItem(item, "education")),
  ].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return NextResponse.json({
    items,
    finance: {
      pemasukan: totals.pemasukan ?? 0,
      pengeluaran: totals.pengeluaran ?? 0,
      saldo: (totals.pemasukan ?? 0) - (totals.pengeluaran ?? 0),
    },
  }, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
