import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { serializeDomainContentItem } from "../../lib/content";

export async function GET(request: Request) {
  const requestedModule = new URL(request.url).searchParams.get("module");
  const allowedModules = ["website", "kajian", "education"];
  const moduleFilter = requestedModule && allowedModules.includes(requestedModule)
    ? [requestedModule]
    : allowedModules;

  const [news, studies, education, finance] = await Promise.all([
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
    finance.map((entry) => [entry.type, entry._sum.amount ?? 0]),
  );
  const items = [
    ...news.map((item) => serializeDomainContentItem(item, "website")),
    ...studies.map((item) => serializeDomainContentItem(item, "kajian")),
    ...education.map((item) => serializeDomainContentItem(item, "education")),
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
