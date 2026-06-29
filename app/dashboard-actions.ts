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
import { sendConsultationEmailNotification } from "./lib/consultation-notifications";
import { canEditModule } from "./lib/content";
import { ensureDonationCampaignsTable } from "./lib/donation-campaigns";
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

export type CertifiedUstadzInput = {
  id?: number;
  isActive: boolean;
  name: string;
  sortOrder: number;
  specialization: string;
};

export type ConsultationAnswerInput = {
  answer: string;
  id: number;
  summary: string;
  title: string;
};

export type DonationCampaignInput = {
  id?: number;
  badge: string;
  collectedAmount: number;
  href: string;
  imageUrl: string;
  org: string;
  progress: number;
  remainingTime: string;
  sortOrder: number;
  status: "draft" | "published";
  summary: string;
  targetAmount?: number | null;
  title: string;
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
  if (module === "konsultasi") return "/Konsultasi";
  if (module === "education") return educationPaths[section] ?? "/Pendidikan/Institusi";
  if (module === "pmb") return "/Pendidikan/pendaftaran";
  if (module === "tentang-kami") return section ? `/TentangKami/${capitalizeSegment(section)}` : "/TentangKami";
  return "/";
}

function extractSubmittedQuestion(body: string) {
  const normalized = body.replace(/\r\n/g, "\n").trim();
  const lines = normalized.split("\n");
  const blankIndex = lines.findIndex((line) => line.trim() === "");
  const rest = blankIndex >= 0 ? lines.slice(blankIndex + 1).join("\n") : "";

  if (rest.trim()) {
    return rest.trim();
  }

  return lines
    .filter((line) => !/^(Nama|Email|WhatsApp|Sub-topik|Lampiran):/i.test(line.trim()))
    .join("\n")
    .trim();
}

function extractPublishedQuestion(body: string) {
  const normalized = body.replace(/\r\n/g, "\n").trim();
  const questionMarker = "Pertanyaan:";
  const answerMarker = "Jawaban:";
  const questionIndex = normalized.indexOf(questionMarker);
  const answerIndex = normalized.indexOf(answerMarker);

  if (questionIndex >= 0 && answerIndex > questionIndex) {
    return normalized.slice(questionIndex + questionMarker.length, answerIndex).trim();
  }

  return extractSubmittedQuestion(body);
}

function extractSubmittedEmail(body: string) {
  const line = body
    .replace(/\r\n/g, "\n")
    .split("\n")
    .find((item) => /^Email:/i.test(item.trim()));

  return line ? line.slice(line.indexOf(":") + 1).trim() : "";
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

export async function saveDonationCampaign(input: DonationCampaignInput) {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    throw new Error("Hanya Super Admin yang dapat mengubah program donasi.");
  }

  const title = input.title.trim();
  const href = input.href.trim();
  const remainingTime = input.remainingTime.trim();
  const collectedAmount = Math.max(0, Math.round(input.collectedAmount || 0));
  const targetAmount = input.targetAmount
    ? Math.max(0, Math.round(input.targetAmount))
    : null;
  const calculatedProgress = targetAmount && targetAmount > 0
    ? Math.round((collectedAmount / targetAmount) * 100)
    : Math.round(input.progress || 0);
  const progress = Math.min(100, Math.max(0, calculatedProgress));

  if (!title || !href || !remainingTime) {
    throw new Error("Judul, link donasi, dan sisa waktu wajib diisi.");
  }

  try {
    await ensureDonationCampaignsTable();

    const data = {
      badge: input.badge.trim() || "OPEN DONASI",
      collectedAmount,
      href,
      imageUrl: input.imageUrl.trim() || null,
      org: input.org.trim() || "LAZNAS Dewan Dakwah Jawa Tengah",
      progress,
      remainingTime,
      sortOrder: Math.max(0, Math.round(input.sortOrder || 0)),
      status: input.status,
      summary: input.summary.trim() || null,
      targetAmount,
      title,
      authorRole: session.role,
      authorName: session.name,
    };

    if (input.id) {
      await prisma.donationCampaign.update({ where: { id: input.id }, data });
    } else {
      await prisma.donationCampaign.create({ data });
    }
  } catch {
    throw new Error("Database donasi belum terhubung. Pastikan MySQL sedang berjalan, database ddi tersedia, dan tabel donation_campaigns sudah dibuat.");
  }

  revalidatePath("/");
  revalidatePath("/super-admin");
}

export async function deleteDonationCampaign(id: number) {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    throw new Error("Hanya Super Admin yang dapat menghapus program donasi.");
  }

  try {
    await ensureDonationCampaignsTable();
    await prisma.donationCampaign.delete({ where: { id } });
  } catch {
    throw new Error("Database donasi belum terhubung. Pastikan MySQL sedang berjalan dan database ddi tersedia.");
  }

  revalidatePath("/");
  revalidatePath("/super-admin");
}

export async function saveCertifiedUstadz(input: CertifiedUstadzInput) {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    throw new Error("Hanya Super Admin yang dapat mengubah daftar ustadz bersertifikat.");
  }

  const name = input.name.trim();
  const specialization = input.specialization.trim();
  const sortOrder = Number.isFinite(input.sortOrder)
    ? Math.max(0, Math.round(input.sortOrder))
    : 0;

  if (name.length < 3 || name.length > 120) {
    throw new Error("Nama ustadz harus terdiri dari 3-120 karakter.");
  }
  if (specialization.length < 3 || specialization.length > 180) {
    throw new Error("Spesialisasi harus terdiri dari 3-180 karakter.");
  }

  try {
    if (input.id) {
      await prisma.certifiedUstadz.update({
        where: { id: input.id },
        data: {
          isActive: input.isActive,
          name,
          sortOrder,
          specialization,
        },
      });
    } else {
      await prisma.certifiedUstadz.create({
        data: {
          isActive: input.isActive,
          name,
          sortOrder,
          specialization,
        },
      });
    }
  } catch {
    throw new Error("Database ustadz belum terhubung. Pastikan MySQL sedang berjalan.");
  }

  revalidatePath("/Konsultasi");
  revalidatePath("/super-admin");
}

export async function deleteCertifiedUstadz(id: number) {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    throw new Error("Hanya Super Admin yang dapat menghapus ustadz bersertifikat.");
  }

  try {
    await prisma.certifiedUstadz.delete({ where: { id } });
  } catch {
    throw new Error("Database ustadz belum terhubung. Pastikan MySQL sedang berjalan.");
  }

  revalidatePath("/Konsultasi");
  revalidatePath("/super-admin");
}

export async function answerConsultationQuestion(input: ConsultationAnswerInput) {
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "ustadz")) {
    throw new Error("Hanya Super Admin atau Ustadz yang dapat menjawab konsultasi.");
  }

  const answer = input.answer.trim();
  const title = input.title.trim();
  const summary = input.summary.trim();

  if (!title || title.length > 180) {
    throw new Error("Judul jawaban wajib diisi dan maksimal 180 karakter.");
  }

  if (answer.length < 10) {
    throw new Error("Jawaban konsultasi minimal 10 karakter.");
  }

  try {
    const question = await prisma.contentItem.findUnique({
      where: { id: input.id },
    });

    if (
      !question
      || question.module !== "konsultasi"
      || !["pertanyaan-masuk", "jawaban"].includes(question.section)
    ) {
      throw new Error("Pertanyaan konsultasi tidak ditemukan.");
    }

    const isPublishedAnswer = question.section === "jawaban";
    const submittedQuestion = isPublishedAnswer
      ? extractPublishedQuestion(question.body)
      : extractSubmittedQuestion(question.body);
    const submittedEmail = isPublishedAnswer ? "" : extractSubmittedEmail(question.body);
    await prisma.contentItem.update({
      where: { id: input.id },
      data: {
        authorName: session.name,
        authorRole: session.role,
        body: [
          "Pertanyaan:",
          submittedQuestion,
          "",
          "Jawaban:",
          answer,
        ].join("\n"),
        publishedAt: new Date(),
        section: "jawaban",
        status: "published",
        summary: summary || question.summary || submittedQuestion.slice(0, 220),
        title,
      },
    });

    if (submittedEmail) {
      void sendConsultationEmailNotification({
        body: [
          `Assalamu'alaikum, pertanyaan konsultasi Anda sudah dijawab oleh Tim Ustadz Dewan Da'wah Semarang.`,
          `Judul: ${title}`,
          "",
          answer,
          "",
          "Silakan buka halaman Konsultasi untuk melihat jawaban yang sudah diterbitkan.",
        ].join("\n"),
        subject: `Jawaban Konsultasi: ${title}`,
        to: [submittedEmail],
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("tidak ditemukan")) {
      throw error;
    }
    throw new Error("Database konsultasi belum terhubung. Pastikan MySQL sedang berjalan.");
  }

  revalidatePath("/Konsultasi");
  revalidatePath("/super-admin");
  revalidatePath("/ustadz");
}

export async function deleteConsultationQuestion(id: number) {
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "ustadz")) {
    throw new Error("Anda tidak memiliki akses untuk menghapus konsultasi.");
  }

  try {
    const question = await prisma.contentItem.findUnique({ where: { id } });

    if (!question || question.module !== "konsultasi") {
      throw new Error("Pertanyaan konsultasi tidak ditemukan.");
    }

    await prisma.contentItem.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Error && error.message.includes("tidak ditemukan")) {
      throw error;
    }
    throw new Error("Database konsultasi belum terhubung. Pastikan MySQL sedang berjalan.");
  }

  revalidatePath("/Konsultasi");
  revalidatePath("/super-admin");
  revalidatePath("/ustadz");
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
