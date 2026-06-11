import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { serializeContentItem } from "../../lib/content";

export async function GET() {
  const [items, finance] = await Promise.all([
    prisma.contentItem.findMany({
      where: {
        status: "published",
        module: { in: ["website", "kajian", "pmb"] },
      },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      take: 12,
    }),
    prisma.financeTransaction.groupBy({
      by: ["type"],
      _sum: { amount: true },
    }),
  ]);

  const totals = Object.fromEntries(
    finance.map((entry) => [entry.type, entry._sum.amount ?? 0]),
  );

  return NextResponse.json({
    items: items.map(serializeContentItem),
    finance: {
      pemasukan: totals.pemasukan ?? 0,
      pengeluaran: totals.pengeluaran ?? 0,
      saldo: (totals.pemasukan ?? 0) - (totals.pengeluaran ?? 0),
    },
  });
}
