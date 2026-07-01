"use client";

import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  CreditCard,
  FileText,
  Hash,
  Loader2,
  LogOut,
  RefreshCw,
  Upload,
  User,
  XCircle,
} from "lucide-react";

type PmbSession = {
  email: string;
  fullName: string;
  id: number;
  institution: string;
  institutionId: string;
  institutionName: string;
  institutionShort: string;
  nisn: string;
};

type PmbApplication = {
  admin_note: string | null;
  billing_amount: number;
  billing_code: string;
  created_at: string;
  doc_photo_url: string | null;
  email: string;
  full_name: string;
  id: number;
  institution: string;
  institution_name: string;
  institution_short: string;
  jalur_name: string | null;
  jurusan_name: string | null;
  nisn: string | null;
  payment_proof_url: string | null;
  phone: string | null;
  registration_number: string;
  status: string;
  updated_at: string;
};

type DashboardData = {
  account: {
    email: string;
    full_name: string;
    id: number;
    institution: string;
    institution_id: string;
    institution_name: string;
    institution_short: string;
    nisn: string;
  };
  application: PmbApplication | null;
};

const STEPS = [
  {
    desc: "Formulir belum selesai. Lengkapi semua data pendaftaran.",
    key: "draft",
    label: "Draft",
  },
  {
    desc: "Formulir sudah dikirim dan menunggu diperiksa admin.",
    key: "menunggu_verifikasi",
    label: "Verifikasi",
  },
  {
    desc: "Dokumen sedang dalam proses verifikasi administrasi.",
    key: "verifikasi_adm",
    label: "Administrasi",
  },
  {
    desc: "Silakan lakukan pembayaran sesuai instruksi.",
    key: "menunggu_bayar",
    label: "Pembayaran",
  },
  {
    desc: "Bukti pembayaran dikirim dan menunggu konfirmasi admin.",
    key: "sudah_bayar",
    label: "Konfirmasi Bayar",
  },
  {
    desc: "Selamat, Anda dinyatakan diterima.",
    key: "diterima",
    label: "Diterima",
  },
];

const STATUS_ALIAS: Record<string, string> = {
  draf: "draft",
  draft: "draft",
  menunggu_bayar: "menunggu_bayar",
  menunggu_pembayaran: "menunggu_bayar",
  verifikasi_adm: "verifikasi_adm",
  verifikasi_administrasi: "verifikasi_adm",
};

const STATUS_META = {
  daftar_ulang: {
    badge: "bg-purple-100 text-purple-700",
    bar: "#A855F7",
    icon: RefreshCw,
  },
  diterima: {
    badge: "bg-emerald-100 text-emerald-700",
    bar: "#168453",
    icon: CheckCircle2,
  },
  ditolak: {
    badge: "bg-red-100 text-red-700",
    bar: "#EF4444",
    icon: XCircle,
  },
  draft: {
    badge: "bg-gray-100 text-gray-600",
    bar: "#9CA3AF",
    icon: Clock,
  },
  menunggu_bayar: {
    badge: "bg-orange-100 text-orange-700",
    bar: "#F97316",
    icon: CreditCard,
  },
  menunggu_verifikasi: {
    badge: "bg-yellow-100 text-yellow-700",
    bar: "#F59E0B",
    icon: Clock,
  },
  sudah_bayar: {
    badge: "bg-teal-100 text-teal-700",
    bar: "#14B8A6",
    icon: CheckCircle2,
  },
  verifikasi_adm: {
    badge: "bg-blue-100 text-blue-700",
    bar: "#3B82F6",
    icon: AlertCircle,
  },
};

function normalizeStatus(status?: string | null) {
  if (!status) return "draft";
  return STATUS_ALIAS[status] || status;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

function StepCircle({
  active,
  done,
  idx,
  isLast,
  step,
}: {
  active: boolean;
  done: boolean;
  idx: number;
  isLast: boolean;
  step: { label: string };
}) {
  return (
    <div className="relative flex flex-1 flex-col items-center">
      {!isLast ? (
        <div
          className="absolute left-1/2 top-3.5 h-0.5 w-full"
          style={{ background: done ? "#168453" : "#E4E7EC" }}
        />
      ) : null}
      <div
        className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{
          background: done || active ? "#168453" : "#E4E7EC",
          boxShadow: active ? "0 0 0 4px #D1FAE5" : "none",
          color: done || active ? "#FFFFFF" : "#667085",
        }}
      >
        {done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
      </div>
      <p
        className="mt-2 text-center text-[11px] font-medium leading-tight"
        style={{ color: active ? "#168453" : done ? "#667085" : "#9CA3AF" }}
      >
        {step.label}
      </p>
    </div>
  );
}

export default function PmbDashboardPage() {
  const router = useRouter();
  const [session] = useState<PmbSession | null>(() => {
    if (typeof window === "undefined") return null;

    const raw = sessionStorage.getItem("pmb_session");
    if (!raw) return null;

    try {
      return JSON.parse(raw) as PmbSession;
    } catch {
      sessionStorage.removeItem("pmb_session");
      return null;
    }
  });
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const application = data?.application || null;
  const status = normalizeStatus(application?.status);
  const currentIdx = STEPS.findIndex((step) => step.key === status);
  const currentStep = currentIdx >= 0 ? STEPS[currentIdx] : null;
  const isRejected = status === "ditolak";
  const isDaftarUlang = status === "daftar_ulang";
  const meta = STATUS_META[status as keyof typeof STATUS_META] || STATUS_META.draft;
  const StatusIcon = meta.icon;

  const formHref = useMemo(() => {
    if (!session) return "/Pendidikan/pmb/login";
    const params = new URLSearchParams({
      email: session.email,
      institution: session.institutionId,
      institution_slug: session.institution,
      name: session.fullName,
      nisn: session.nisn,
    });
    return `/Pendidikan/pendaftaran?${params.toString()}`;
  }, [session]);

  const loadData = useCallback(async (activeSession: PmbSession) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/pendaftar/me", {
        body: JSON.stringify(activeSession),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const nextData = await response.json();

      if (!response.ok) {
        throw new Error(nextData?.message || "Gagal mengambil data dashboard.");
      }

      setData(nextData);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) {
      router.replace("/Pendidikan/pmb/login");
      return;
    }

    const timer = window.setTimeout(() => {
      void loadData(session);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadData, router, session]);

  function logout() {
    sessionStorage.removeItem("pmb_session");
    router.replace("/Pendidikan/pmb/login");
  }

  async function handleUploadBukti(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !application) return;

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        body: formData,
        method: "POST",
      });
      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData?.message || "Upload bukti pembayaran gagal.");
      }

      const saveResponse = await fetch("/api/pendaftaran/payment-proof", {
        body: JSON.stringify({
          email: application.email,
          id: application.id,
          nisn: application.nisn,
          payment_proof_url: uploadData.file_url,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saveData?.message || "Gagal menyimpan bukti pembayaran.");
      }

      setMessage("Bukti pembayaran berhasil dikirim.");
      if (session) await loadData(session);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengirim bukti pembayaran.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#E6F9EF]">
        <Loader2 className="h-8 w-8 animate-spin text-[#168453]" />
      </main>
    );
  }

  if (!session || message && !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#E6F9EF] px-4">
        <section className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm">
          <AlertCircle className="mx-auto h-8 w-8 text-amber-500" />
          <h1 className="mt-3 text-lg font-bold text-[#0F4E35]">Dashboard belum bisa dibuka</h1>
          <p className="mt-2 text-sm text-[#667085]">{message || "Silakan login ulang."}</p>
          <Link
            className="mt-5 inline-flex rounded-lg bg-[#168453] px-4 py-2 text-sm font-semibold text-white"
            href="/Pendidikan/pmb/login"
          >
            Login PMB
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#E6F9EF] px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-5">
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#168453] text-sm font-bold text-white shadow">
              DD
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#0F4E35]">Portal PMB DDI Semarang</p>
              <p className="truncate text-xs text-[#667085]">
                Dashboard Pendaftaran - {application?.institution_short || session.institutionShort} - 2026
              </p>
            </div>
          </div>
          <button
            className="inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#667085] hover:bg-white/70 hover:text-[#0F4E35]"
            onClick={logout}
            type="button"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </header>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="h-1" style={{ background: meta.bar }} />
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#D1FAE5]">
                  {application?.doc_photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={`Foto ${application.full_name}`}
                      className="h-12 w-12 object-cover"
                      src={application.doc_photo_url}
                    />
                  ) : (
                    <User className="h-6 w-6 text-[#168453]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#0F4E35]">
                    {application?.full_name || session.fullName}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-[#667085]">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {application?.nisn || session.nisn}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(application?.created_at)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#667085]">
                    No. Daftar: {application?.registration_number || "Belum mengirim formulir"}
                  </p>
                </div>
              </div>
              <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${meta.badge}`}>
                <StatusIcon className="h-3 w-3" />
                {currentStep?.label || (isRejected ? "Ditolak" : isDaftarUlang ? "Daftar Ulang" : status)}
              </span>
            </div>
          </div>
        </section>

        {!isRejected ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-[#0F4E35]">Tahapan Pendaftaran</p>
            <div className="hidden items-start sm:flex">
              {STEPS.map((step, idx) => (
                <StepCircle
                  active={idx === currentIdx}
                  done={idx < currentIdx || (isDaftarUlang && idx <= 5)}
                  idx={idx}
                  isLast={idx === STEPS.length - 1}
                  key={step.key}
                  step={step}
                />
              ))}
            </div>
            <div className="space-y-3 sm:hidden">
              {STEPS.map((step, idx) => {
                const done = idx < currentIdx || (isDaftarUlang && idx <= 5);
                const active = idx === currentIdx;

                return (
                  <div className="flex items-start gap-3" key={step.key}>
                    <div className="flex flex-col items-center">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{
                          background: done || active ? "#168453" : "#E4E7EC",
                          boxShadow: active ? "0 0 0 4px #D1FAE5" : "none",
                          color: done || active ? "#FFFFFF" : "#667085",
                        }}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                      </div>
                      {idx < STEPS.length - 1 ? (
                        <div className="mt-1 h-6 w-0.5" style={{ background: done ? "#168453" : "#E4E7EC" }} />
                      ) : null}
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-medium" style={{ color: active ? "#168453" : done ? "#667085" : "#9CA3AF" }}>
                        {step.label}
                      </p>
                      {active ? <p className="mt-0.5 text-xs text-[#667085]">{step.desc}</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>
            {currentStep ? (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] p-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#168453] text-xs font-bold text-white">
                  {currentIdx + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F4E35]">{currentStep.label}</p>
                  <p className="mt-0.5 text-xs text-[#667085]">{currentStep.desc}</p>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#F2F4F7] p-5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#168453]">
              <StatusIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F4E35]">
                {isRejected ? "Status Pendaftaran" : isDaftarUlang ? "Daftar Ulang" : currentStep?.label || "Status"}
              </p>
              <p className="text-xs text-[#667085]">
                {isRejected ? "Pendaftaran ditolak" : application ? `Langkah ${Math.max(currentIdx + 1, 1)} dari ${STEPS.length}` : "Formulir belum dikirim"}
              </p>
            </div>
          </div>

          <div className="space-y-4 p-5">
            {!application ? (
              <>
                <div className="rounded-lg border border-[#FDE68A] bg-[#FEF3C7] p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#92400E]">
                    <AlertCircle className="h-4 w-4" />
                    Formulir Belum Dikirim
                  </p>
                  <p className="mt-1 text-sm text-[#78350F]">
                    Akun sudah login. Lanjutkan pengisian formulir agar admin bisa memproses pendaftaran.
                  </p>
                </div>
                <Link
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#168453] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0F4E35]"
                  href={formHref}
                >
                  Lanjutkan Formulir
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </>
            ) : null}

            {application && status === "draft" ? (
              <>
                <div className="rounded-lg border border-[#FDE68A] bg-[#FEF3C7] p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#92400E]">
                    <AlertCircle className="h-4 w-4" />
                    Formulir Belum Selesai
                  </p>
                  <p className="mt-1 text-sm text-[#78350F]">
                    Lengkapi formulir pendaftaran agar bisa diproses admin.
                  </p>
                </div>
                <Link
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#168453] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0F4E35]"
                  href={formHref}
                >
                  Lanjutkan Formulir
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </>
            ) : null}

            {["menunggu_verifikasi", "verifikasi_adm"].includes(status) ? (
              <div className="flex items-start gap-3 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#2563EB]" />
                <div>
                  <p className="text-sm font-semibold text-[#1E40AF]">Sedang Diproses</p>
                  <p className="mt-0.5 text-sm text-[#1E3A8A]">
                    Formulir Anda sedang diverifikasi oleh admin. Mohon tunggu konfirmasi selanjutnya.
                  </p>
                </div>
              </div>
            ) : null}

            {application && status === "menunggu_bayar" ? (
              <div className="space-y-3">
                <div className="space-y-2 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#C2410C]">
                    <CreditCard className="h-4 w-4" />
                    Informasi Pembayaran
                  </p>
                  <div className="rounded-lg bg-white p-3 text-sm text-[#0F4E35]">
                    <p>Kode Tagihan: <strong>{application.billing_code}</strong></p>
                    <p>No. Pendaftaran: <strong>{application.registration_number}</strong></p>
                    <p className="mt-2 text-xl font-bold text-[#C2410C]">
                      {formatCurrency(application.billing_amount)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-[#0F4E35]">Upload Bukti Pembayaran</p>
                  <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#FDBA74] py-3 text-sm font-medium text-[#C2410C] transition-colors hover:bg-orange-50">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading ? "Mengupload..." : "Pilih File Bukti Bayar"}
                    <input
                      accept="image/*,.pdf"
                      className="hidden"
                      disabled={uploading}
                      onChange={handleUploadBukti}
                      type="file"
                    />
                  </label>
                  <p className="mt-1 text-center text-xs text-[#667085]">Format: JPG, PNG, WEBP, atau PDF. Maksimal 5 MB.</p>
                </div>
              </div>
            ) : null}

            {application && status === "sudah_bayar" ? (
              <div className="space-y-1 rounded-lg border border-[#99F6E4] bg-[#F0FDFA] p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#0F766E]">
                  <CheckCircle2 className="h-4 w-4" />
                  Bukti Bayar Terkirim
                </p>
                <p className="text-sm text-[#115E59]">
                  Pembayaran sedang diverifikasi admin. Mohon tunggu konfirmasi selanjutnya.
                </p>
                {application.payment_proof_url ? (
                  <a
                    className="mt-1 flex items-center gap-1 text-xs text-[#0F766E]"
                    href={application.payment_proof_url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FileText className="h-3 w-3" />
                    Lihat bukti yang dikirim
                  </a>
                ) : null}
              </div>
            ) : null}

            {status === "diterima" ? (
              <div className="rounded-xl bg-gradient-to-br from-[#168453] to-[#0F4E35] p-5 text-white">
                <p className="text-xl font-bold">Selamat!</p>
                <p className="mt-1 text-sm opacity-90">
                  Anda dinyatakan diterima di {application?.institution_short || session.institutionShort}.
                </p>
              </div>
            ) : null}

            {status === "daftar_ulang" ? (
              <div className="rounded-xl bg-gradient-to-br from-[#A855F7] to-[#7E22CE] p-5 text-white">
                <p className="text-xl font-bold">Anda Diterima!</p>
                <p className="mt-1 text-sm opacity-90">Segera lakukan daftar ulang sesuai jadwal yang ditentukan.</p>
              </div>
            ) : null}

            {isRejected ? (
              <div className="space-y-1 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#991B1B]">
                  <XCircle className="h-4 w-4" />
                  Mohon Maaf
                </p>
                <p className="text-sm text-[#7F1D1D]">
                  Pendaftaran Anda belum dapat kami terima pada tahun ini.
                </p>
              </div>
            ) : null}

            {application?.admin_note ? (
              <div className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-3">
                <p className="mb-0.5 text-xs font-semibold text-[#92400E]">Pesan dari Admin</p>
                <p className="text-sm text-[#78350F]">{application.admin_note}</p>
              </div>
            ) : null}

            {message ? (
              <p className="rounded-lg bg-[#F8FAFC] px-3 py-2 text-center text-xs text-[#667085]">
                {message}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#F2F4F7] px-5 py-4">
            <Link
              className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              href="/Pendidikan/pmb"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Portal
            </Link>
            <button
              className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              onClick={() => session && loadData(session)}
              type="button"
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              Perbarui
            </button>
          </div>
        </section>

        <p className="text-center text-xs text-[#667085]">
          &copy; {new Date().getFullYear()} DDI Semarang - Portal Penerimaan Peserta Didik Baru
        </p>
      </div>
    </main>
  );
}
