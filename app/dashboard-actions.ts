"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export type PmbStatusInput = {
  id: number;
  note: string;
  status: string;
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
      && Boolean(session.institution)
      && (session.institution === section || section.startsWith(`${session.institution}-`))
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
  revalidatePath("/Pendidikan");
  revalidatePath("/Pendidikan/ADI");
  revalidatePath("/Pendidikan/AlKhawarizmi");
  revalidatePath("/Pendidikan/Institusi");
  revalidatePath("/Pendidikan/pendaftaran");
  revalidatePath("/Pendidikan/PonpesSuruh");
  revalidatePath("/TentangKami/Profile");
  revalidatePath("/TentangKami/AdDanArt");
  revalidatePath("/TentangKami/StrukturKepengurusan");
  revalidatePath("/TentangKami/Program");
}

function capitalizeSegment(segment: string) {
  return segment
    .split(/[- _]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ")
    .replace(/\s+/g, "");
}

function getPublicPath(module: string, section: string) {
  const educationPaths: Record<string, string> = {
    adi: "/Pendidikan/ADI",
    "al-khawarizmi": "/Pendidikan/AlKhawarizmi",
    "ponpes-suruh": "/Pendidikan/PonpesSuruh",
  };

  if (module === "website") {
    return section ? `/Berita/${capitalizeSegment(section)}` : "/Berita";
  }
  if (module === "beranda") return "/";
  if (module === "kajian") return "/Kajian";
  if (module === "education") return educationPaths[section] ?? "/Pendidikan/Institusi";
  if (module === "pmb") return "/Pendidikan/pendaftaran";
  if (module === "tentang-kami") return section ? `/TentangKami/${capitalizeSegment(section)}` : "/TentangKami";
  return "/";
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
  const publicPath = getPublicPath(input.module, input.section);
  try { revalidatePath(publicPath); } catch {}
  redirect(publicPath);
}

export async function deleteContentItem(id: number, module: string) {
  const session = await getSession();
  if (!session || !canEditModule(session.role, module)) {
    throw new Error("Anda tidak memiliki akses untuk menghapus konten ini.");
  }
  let publicPath = "/";
  try {
    if (module === "website") {
      const existing = await prisma.news.findUnique({ where: { id } });
      publicPath = existing ? `/Berita/${capitalizeSegment(existing.section)}` : "/Berita";
      await prisma.news.delete({ where: { id } });
    } else if (module === "kajian") {
      const existing = await prisma.studyArticle.findUnique({ where: { id } });
      publicPath = "/Kajian";
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
      publicPath = `/Pendidikan/${capitalizeSegment(existing.section)}`;
      await prisma.educationInformation.delete({ where: { id } });
    } else {
      const existing = await prisma.contentItem.findUnique({ where: { id } });
      if (!existing || existing.module !== module) {
        throw new Error("Konten tidak ditemukan atau tidak dapat dihapus.");
      }
      publicPath = getPublicPath(existing.module, existing.section);
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
  try { revalidatePath(publicPath); } catch {}
  redirect(publicPath);
}

export async function saveFinanceTransaction(input: FinanceInput) {
  const session = await getSession();
  if (!session || (session.role !== "bendahara" && session.role !== "super_admin")) {
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

export async function updatePmbApplicationStatus(input: PmbStatusInput) {
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "admin")) {
    throw new Error("Anda tidak memiliki akses untuk mengubah status PMB.");
  }

  const allowedStatuses = [
    "draft",
    "menunggu_verifikasi",
    "verifikasi_adm",
    "menunggu_bayar",
    "sudah_bayar",
    "diterima",
    "ditolak",
    "daftar_ulang",
  ];
  if (!allowedStatuses.includes(input.status)) {
    throw new Error("Status PMB tidak valid.");
  }

  const application = await prisma.pmbApplication.findUnique({
    where: { id: input.id },
    select: { institution: true },
  });

  if (!application) {
    throw new Error("Data pendaftar tidak ditemukan.");
  }

  if (session.role === "admin" && session.institution !== application.institution) {
    throw new Error("Anda tidak memiliki akses ke pendaftar lembaga ini.");
  }

  await prisma.pmbApplication.update({
    where: { id: input.id },
    data: {
      adminNote: input.note.trim() || null,
      status: input.status,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/super-admin");
  revalidatePath(roleHomePaths[session.role]);
}

export async function deleteFinanceTransaction(id: number) {
  const session = await getSession();
  if (!session || (session.role !== "bendahara" && session.role !== "super_admin")) {
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
