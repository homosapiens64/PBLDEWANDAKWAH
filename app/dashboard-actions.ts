"use server";

import { revalidatePath } from "next/cache";
import {
  educationInstitutions,
  getSession,
  hashPassword,
  isEducationInstitution,
  roleHomePaths,
} from "./lib/auth";
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

export type CreateAdminState = {
  message: string;
  success: boolean;
};

function canEditSection(
  session: NonNullable<Awaited<ReturnType<typeof getSession>>>,
  module: string,
  section: string,
) {
  if (!canEditModule(session.role, module)) {
    return false;
  }

  return session.role !== "admin"
    || (
      (module === "education" || module === "pmb")
      && session.institution === section
    );
}

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
  if (!session || !canEditSection(session, input.module, input.section)) {
    throw new Error("Anda tidak memiliki akses untuk mengubah konten ini.");
  }

  const title = input.title.trim();
  const body = input.body.trim();
  if (!title || !body) {
    throw new Error("Judul dan isi konten wajib diisi.");
  }

  const data = {
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
    if (input.module === "website") {
      if (input.id) {
        await prisma.news.update({ where: { id: input.id }, data });
      } else {
        await prisma.news.create({ data });
      }
    } else if (input.module === "kajian") {
      if (input.id) {
        await prisma.studyArticle.update({ where: { id: input.id }, data });
      } else {
        await prisma.studyArticle.create({ data });
      }
    } else if (input.module === "education" || input.module === "pmb") {
      const educationData = { ...data, module: input.module };
      if (input.id) {
        const existing = await prisma.educationInformation.findUnique({
          where: { id: input.id },
        });
        if (
          !existing
          || existing.module !== input.module
          || !canEditSection(session, existing.module, existing.section)
        ) {
          throw new Error("Konten tidak ditemukan atau tidak dapat diubah.");
        }
        await prisma.educationInformation.update({
          where: { id: input.id },
          data: educationData,
        });
      } else {
        await prisma.educationInformation.create({ data: educationData });
      }
    } else {
      const genericData = { ...data, module: input.module };
      if (input.id) {
        const existing = await prisma.contentItem.findUnique({ where: { id: input.id } });
        if (!existing || !canEditModule(session.role, existing.module)) {
          throw new Error("Konten tidak ditemukan atau tidak dapat diubah.");
        }
        await prisma.contentItem.update({ where: { id: input.id }, data: genericData });
      } else {
        await prisma.contentItem.create({ data: genericData });
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("tidak ditemukan")) {
      throw error;
    }
    throw new Error("Database konten belum terhubung. Pastikan MySQL sedang berjalan.");
  }

  revalidatePublicContent();
  revalidatePath(roleHomePaths[session.role]);
}

export async function deleteContentItem(id: number, module: string) {
  const session = await getSession();
  if (!session || !canEditModule(session.role, module)) {
    throw new Error("Anda tidak memiliki akses untuk menghapus konten ini.");
  }

  try {
    if (module === "website") {
      await prisma.news.delete({ where: { id } });
    } else if (module === "kajian") {
      await prisma.studyArticle.delete({ where: { id } });
    } else if (module === "education" || module === "pmb") {
      const existing = await prisma.educationInformation.findUnique({
        where: { id },
      });
      if (
        !existing
        || existing.module !== module
        || !canEditSection(session, existing.module, existing.section)
      ) {
        throw new Error("Konten tidak ditemukan atau tidak dapat dihapus.");
      }
      await prisma.educationInformation.delete({ where: { id } });
    } else {
      const existing = await prisma.contentItem.findUnique({ where: { id } });
      if (!existing || existing.module !== module) {
        throw new Error("Konten tidak ditemukan atau tidak dapat dihapus.");
      }
      await prisma.contentItem.delete({ where: { id } });
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("tidak ditemukan")) {
      throw error;
    }
    throw new Error("Database konten belum terhubung. Pastikan MySQL sedang berjalan.");
  }
  revalidatePublicContent();
  revalidatePath(roleHomePaths[session.role]);
}

export async function saveFinanceTransaction(input: FinanceInput) {
  const session = await getSession();
  if (!session || session.role !== "bendahara") {
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
  revalidatePath(roleHomePaths[session.role]);
}

export async function deleteFinanceTransaction(id: number) {
  const session = await getSession();
  if (!session || session.role !== "bendahara") {
    throw new Error("Anda tidak memiliki akses ke transaksi keuangan.");
  }

  try {
    await prisma.financeTransaction.delete({ where: { id } });
  } catch {
    throw new Error("Database keuangan belum terhubung. Pastikan MySQL sedang berjalan.");
  }
  revalidatePath("/");
  revalidatePath(roleHomePaths[session.role]);
}

export async function createEducationAdmin(
  _previousState: CreateAdminState,
  formData: FormData,
): Promise<CreateAdminState> {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    return {
      message: "Hanya Super Admin yang dapat menambahkan admin pendidikan.",
      success: false,
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const institution = String(formData.get("institution") ?? "");

  if (name.length < 3 || name.length > 100) {
    return { message: "Nama admin harus terdiri dari 3-100 karakter.", success: false };
  }
  if (!/^[a-z0-9._-]{3,50}$/.test(username)) {
    return {
      message: "Username harus 3-50 karakter dan hanya memakai huruf kecil, angka, titik, garis bawah, atau tanda hubung.",
      success: false,
    };
  }
  if (password.length < 8) {
    return { message: "Password minimal 8 karakter.", success: false };
  }
  if (!isEducationInstitution(institution)) {
    return {
      message: `Pendidikan harus salah satu dari: ${educationInstitutions.join(", ")}.`,
      success: false,
    };
  }

  try {
    await prisma.user.create({
      data: {
        institution,
        name,
        password: hashPassword(password),
        role: "admin",
        username,
      },
    });
  } catch {
    return {
      message: "Username sudah digunakan atau database belum dapat diakses.",
      success: false,
    };
  }

  revalidatePath("/super-admin");
  return {
    message: `Admin ${name} berhasil ditambahkan.`,
    success: true,
  };
}
