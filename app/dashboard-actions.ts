"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "./lib/auth";
import { canEditModule } from "./lib/content";
import { prisma } from "./lib/prisma";

export type ContentInput = {
  id?: number;
  module: string;
  section: string;
  title: string;
  summary: string;
  body: string;
  imageUrl: string;
  tags?: string;
  authorName?: string;
  publishedAt?: string;
  status: "draft" | "published";
};

export type FinanceInput = {
  id?: number;
  type: "pemasukan" | "pengeluaran";
  date: string;
  category: string;
  detail: string;
  note: string;
  amount: number;
};

function revalidatePublicContent() {
  revalidatePath("/");
  revalidatePath("/Berita/Terkini");
  revalidatePath("/Berita/Kegiatan");
  revalidatePath("/Berita/Nasional");
  revalidatePath("/Berita/Internasional");
  revalidatePath("/Kajian");
  revalidatePath("/Konsultasi");
  revalidatePath("/Pendidikan/Institusi");
  revalidatePath("/TentangKami/Profile");
  revalidatePath("/TentangKami/AdDanArt");
  revalidatePath("/TentangKami/StrukturKepengurusan");
  revalidatePath("/TentangKami/Program");
}

export async function saveContentItem(input: ContentInput) {
  const session = await getSession();
  if (!session || !canEditModule(session.role, input.module)) {
    throw new Error("Anda tidak memiliki akses untuk mengubah konten ini.");
  }

  const title = input.title.trim();
  const body = input.body.trim();
  if (!title || !body) {
    throw new Error("Judul dan isi konten wajib diisi.");
  }

  const data = {
    module: input.module,
    section: input.section,
    title,
    summary: input.summary.trim() || null,
    body,
    imageUrl: input.imageUrl.trim() || null,
    tags: input.tags?.trim() || null,
    status: input.status,
    authorRole: session.role,
    authorName: input.authorName?.trim() || session.name,
    publishedAt: input.status === "published"
      ? input.publishedAt
        ? new Date(`${input.publishedAt}T00:00:00.000Z`)
        : new Date()
      : null,
  };

  try {
    if (input.id) {
      const existing = await prisma.contentItem.findUnique({ where: { id: input.id } });
      if (!existing || !canEditModule(session.role, existing.module)) {
        throw new Error("Konten tidak ditemukan atau tidak dapat diubah.");
      }
      await prisma.contentItem.update({ where: { id: input.id }, data });
    } else {
      await prisma.contentItem.create({ data });
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("tidak ditemukan")) {
      throw error;
    }
    throw new Error("Database konten belum terhubung. Pastikan MySQL sedang berjalan.");
  }

  revalidatePublicContent();
  revalidatePath(`/${session.role}`);
}

export async function deleteContentItem(id: number) {
  const session = await getSession();
  if (!session) {
    throw new Error("Sesi tidak ditemukan. Silakan masuk kembali.");
  }

  try {
    const existing = await prisma.contentItem.findUnique({ where: { id } });
    if (!existing || !canEditModule(session.role, existing.module)) {
      throw new Error("Konten tidak ditemukan atau tidak dapat dihapus.");
    }
    await prisma.contentItem.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Error && error.message.includes("tidak ditemukan")) {
      throw error;
    }
    throw new Error("Database konten belum terhubung. Pastikan MySQL sedang berjalan.");
  }
  revalidatePublicContent();
  revalidatePath(`/${session.role}`);
}

export async function saveFinanceTransaction(input: FinanceInput) {
  const session = await getSession();
  if (!session || !["admin", "bendahara"].includes(session.role)) {
    throw new Error("Anda tidak memiliki akses ke transaksi keuangan.");
  }
  if (!input.category.trim() || !input.detail.trim() || input.amount <= 0) {
    throw new Error("Data transaksi belum lengkap.");
  }

  const data = {
    type: input.type,
    date: new Date(`${input.date}T00:00:00.000Z`),
    category: input.category.trim(),
    detail: input.detail.trim(),
    note: input.note.trim() || null,
    amount: Math.round(input.amount),
    authorRole: session.role,
    authorName: session.name,
  };

  try {
    if (input.id) {
      await prisma.financeTransaction.update({ where: { id: input.id }, data });
    } else {
      await prisma.financeTransaction.create({ data });
    }
  } catch {
    throw new Error("Database keuangan belum terhubung. Pastikan MySQL sedang berjalan.");
  }

  revalidatePath("/");
  revalidatePath(`/${session.role}`);
}

export async function deleteFinanceTransaction(id: number) {
  const session = await getSession();
  if (!session || !["admin", "bendahara"].includes(session.role)) {
    throw new Error("Anda tidak memiliki akses ke transaksi keuangan.");
  }

  try {
    await prisma.financeTransaction.delete({ where: { id } });
  } catch {
    throw new Error("Database keuangan belum terhubung. Pastikan MySQL sedang berjalan.");
  }
  revalidatePath("/");
  revalidatePath(`/${session.role}`);
}
