"use client";
import { useState, useEffect, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, ChevronLeft, BookOpen, Loader2, Copy, Mail, AlertCircle, Upload, X, Check } from "lucide-react";

// ============================================================
// STATIC DATA
// ============================================================
const JURUSAN_PER_LEMBAGA: Record<string, { id: string; name: string }[]> = {
  ADI: [
    { id: "adi-kpi", name: "Komunikasi dan Penyiaran Islam" },
    { id: "adi-md", name: "Manajemen Dakwah" },
  ],
  "Ponpes Suruh": [
    { id: "suruh-smp1", name: "SMP Kelas 1" },
    { id: "suruh-smp2", name: "SMP Kelas 2" },
    { id: "suruh-smp3", name: "SMP Kelas 3" },
    { id: "suruh-sma1", name: "SMA Kelas 1" },
    { id: "suruh-sma2", name: "SMA Kelas 2" },
    { id: "suruh-sma3", name: "SMA Kelas 3" },
  ],
  "Al Khawarizmi": [
    { id: "kh-sd1", name: "SD Kelas 1" },
    { id: "kh-sd2", name: "SD Kelas 2" },
    { id: "kh-sd3", name: "SD Kelas 3" },
    { id: "kh-sd4", name: "SD Kelas 4" },
    { id: "kh-sd5", name: "SD Kelas 5" },
    { id: "kh-sd6", name: "SD Kelas 6" },
  ],
};

const AGAMA = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];
const PENDIDIKAN = ["SD/Sederajat", "SMP/Sederajat", "SMA/Sederajat", "D3", "S1", "S2", "S3", "Lainnya"];
const STEPS = ["Program", "Data Diri", "Alamat", "Orang Tua", "Dokumen", "Konfirmasi"];
const STEP_ICONS = ["🏫", "👤", "📍", "👨‍👩‍👧", "📄", "✅"];

const INSTITUTIONS = [
  { id: "inst-1", name: "Akademi Dakwah Indonesia", short_name: "ADI" },
  { id: "inst-2", name: "Pondok Pesantren Suruh", short_name: "Ponpes Suruh" },
  { id: "inst-3", name: "Sekolah Al Khawarizmi", short_name: "Al Khawarizmi" },
];
const JALUR = [
  { id: "jalur-1", name: "Reguler" },
  { id: "jalur-2", name: "Beasiswa" },
  { id: "jalur-3", name: "Prestasi" },
];

const emptyForm = {
  institution_id: "", institution_name: "", institution_short: "",
  jalur_id: "", jalur_name: "", jurusan_id: "", jurusan_name: "",
  full_name: "", nisn: "", gender: "", birth_place: "", birth_date: "",
  citizenship: "WNI", religion: "", phone: "", email: "",
  address: "", rt: "", rw: "",
  provinsi_id: "", provinsi: "", kota_id: "", kota: "",
  kecamatan_id: "", kecamatan: "", kelurahan_id: "", kelurahan: "",
  school_status: "", school_name: "", school_kecamatan: "", graduation_year: "", certificate_number: "",
  father_name: "", father_education: "", father_occupation: "",
  mother_name: "", mother_education: "", mother_occupation: "",
  guardian_name: "", guardian_occupation: "", parent_income: "",
  doc_photo_url: "", doc_ijazah_url: "", doc_ktp_url: "", doc_kk_url: "",
  payment_proof_url: "",
};

// ============================================================
// WILAYAH API
// ============================================================
const BASE_WILAYAH = "https://www.emsifa.com/api-wilayah-indonesia/api";
async function getProvinsi() { return fetch(`${BASE_WILAYAH}/provinces.json`).then(r => r.json()); }
async function getKabupaten(id: string) { return fetch(`${BASE_WILAYAH}/regencies/${id}.json`).then(r => r.json()); }
async function getKecamatan(id: string) { return fetch(`${BASE_WILAYAH}/districts/${id}.json`).then(r => r.json()); }
async function getKelurahan(id: string) { return fetch(`${BASE_WILAYAH}/villages/${id}.json`).then(r => r.json()); }

// ============================================================
// MINI COMPONENTS
// ============================================================
function FInput({ label, required, className = "", ...props }: any) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <input className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50" {...props} />
    </div>
  );
}

function FSelect({ label, required, value, onChange, options, placeholder, disabled = false, className = "" }: any) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <select
        className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50"
        value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder || `Pilih ${label}`}</option>
        {options.map((o: any) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  );
}

function FTextarea({ label, required, className = "", ...props }: any) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <textarea className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50" {...props} />
    </div>
  );
}

function UploadBox({ label, description, value, onChange, required }: any) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Ganti URL ini dengan endpoint upload Anda
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const { file_url } = await res.json();
      onChange(file_url);
    } catch { alert("Upload gagal, coba lagi"); }
    setUploading(false);
  };
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {description && <p className="text-xs text-gray-400">{description}</p>}
      <div className={`border-2 border-dashed rounded-xl transition-all ${value ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-gray-50"}`}>
        {value ? (
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">File berhasil diupload</span>
            </div>
            <button type="button" onClick={() => onChange("")} className="text-gray-400 hover:text-red-500 p-1"><X className="w-4 h-4" /></button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-2 py-6 px-4">
            {uploading
              ? <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              : <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><Upload className="w-5 h-5 text-green-600" /></div>}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">{uploading ? "Mengupload..." : "Klik untuk pilih file"}</p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, atau PDF</p>
            </div>
            <input type="file" accept="image/*,.pdf" className="hidden" disabled={uploading} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        )}
      </div>
    </div>
  );
}

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between overflow-x-auto pb-1">
      {STEPS.map((label, idx) => {
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={idx} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${done ? "bg-green-600 border-green-600 text-white" : active ? "border-green-600 text-green-600 bg-green-50" : "border-gray-300 text-gray-400 bg-gray-100"}`}>
                {done ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-[10px] text-center leading-tight max-w-[56px] ${active ? "text-green-600 font-semibold" : "text-gray-400"}`}>{label}</span>
            </div>
            {idx < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-1 mb-4 ${done ? "bg-green-600" : "bg-gray-200"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-3 py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-gray-400 text-xs w-36 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm font-medium flex-1">{value || <span className="text-gray-300 italic">—</span>}</span>
    </div>
  );
}

// ============================================================
// WILAYAH SELECT COMPONENT
// ============================================================
function WSelect({ label, value, onChange, options, disabled, loading }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label} <span className="text-red-500">*</span></label>
      <select
        className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50"
        value={value} disabled={disabled || loading} onChange={onChange}>
        <option value="">— Pilih {label} —</option>
        {options.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function PendaftaranPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [provinsiList, setProvinsiList] = useState<any[]>([]);
  const [kotaList, setKotaList] = useState<any[]>([]);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [kelurahanList, setKelurahanList] = useState<any[]>([]);
  const [loadingWilayah, setLoadingWilayah] = useState(false);

  const sf = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const jurusanOptions = form.institution_short ? (JURUSAN_PER_LEMBAGA[form.institution_short] || []) : [];

  useEffect(() => { getProvinsi().then(setProvinsiList).catch(() => {}); }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const institutionId = searchParams.get("institution") || searchParams.get("institusi") || "";
    const institution = INSTITUTIONS.find((item) => item.id === institutionId);
    const nisn = searchParams.get("nisn") || "";
    const name = searchParams.get("name") || "";
    const email = searchParams.get("email") || "";

    if (!institution || !nisn || !name || !email) {
      router.replace("/Pendidikan/pmb/login");
      return;
    }

    setForm((current) => ({
      ...current,
      email: email || current.email,
      full_name: name || current.full_name,
      institution_id: institution?.id || current.institution_id,
      institution_name: institution?.name || current.institution_name,
      institution_short: institution?.short_name || current.institution_short,
      nisn: nisn || current.nisn,
    }));
  }, [router]);

  const onProvinsi = async (id: string) => {
    const name = provinsiList.find(p => p.id === id)?.name || "";
    setForm(p => ({ ...p, provinsi_id: id, provinsi: name, kota_id: "", kota: "", kecamatan_id: "", kecamatan: "", kelurahan_id: "", kelurahan: "" }));
    setKotaList([]); setKecamatanList([]); setKelurahanList([]);
    setLoadingWilayah(true);
    setKotaList(await getKabupaten(id).catch(() => []));
    setLoadingWilayah(false);
  };
  const onKota = async (id: string) => {
    const name = kotaList.find(k => k.id === id)?.name || "";
    setForm(p => ({ ...p, kota_id: id, kota: name, kecamatan_id: "", kecamatan: "", kelurahan_id: "", kelurahan: "" }));
    setKecamatanList([]); setKelurahanList([]);
    setLoadingWilayah(true);
    setKecamatanList(await getKecamatan(id).catch(() => []));
    setLoadingWilayah(false);
  };
  const onKecamatan = async (id: string) => {
    const name = kecamatanList.find(k => k.id === id)?.name || "";
    setForm(p => ({ ...p, kecamatan_id: id, kecamatan: name, kelurahan_id: "", kelurahan: "" }));
    setKelurahanList([]);
    setLoadingWilayah(true);
    setKelurahanList(await getKelurahan(id).catch(() => []));
    setLoadingWilayah(false);
  };

  const canNext = () => {
    if (step === 0) return form.institution_id && form.jalur_id && form.jurusan_id;
    if (step === 1) return form.full_name && form.gender && form.religion && form.phone;
    if (step === 2) return form.provinsi && form.kota && form.kecamatan && form.kelurahan;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const reg_no = `PMB-${Date.now().toString().slice(-8)}`;
      const billing_code = `BILL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      // Ganti dengan POST ke API/database Anda
      const res = await fetch("/api/pendaftaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, registration_number: reg_no, billing_code, billing_amount: 150000, status: "menunggu_verifikasi" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Gagal mengirim pendaftaran.");
      }
      setSubmitted({ ...form, registration_number: reg_no, billing_code, billing_amount: 150000, ...data });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal mengirim pendaftaran. Coba lagi.");
    }
    setSubmitting(false);
  };

  const sendEmail = async () => {
    if (!submitted?.email) return alert("Email tidak tersedia");
    setSendingEmail(true);
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: submitted.email,
          subject: `Kode Tagihan PMB DDI Semarang - ${submitted.registration_number}`,
          body: `Yth. ${submitted.full_name},\n\nNomor Registrasi: ${submitted.registration_number}\nKode Tagihan: ${submitted.billing_code}\nJumlah: Rp 150.000\n\nSalam,\nAdmin PMB DDI Semarang`,
        }),
      });
      alert("Email berhasil dikirim!");
    } catch { alert("Gagal mengirim email"); }
    setSendingEmail(false);
  };

  const savePaymentProof = async (fileUrl: string) => {
    if (!submitted?.id) {
      alert("Data pendaftaran belum tersedia.");
      return;
    }

    setPaymentMessage("Menyimpan bukti pembayaran...");
    try {
      const response = await fetch("/api/pendaftaran/payment-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: submitted.email,
          id: submitted.id,
          nisn: submitted.nisn,
          payment_proof_url: fileUrl,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menyimpan bukti pembayaran.");
      }

      setSubmitted((current: any) => ({
        ...current,
        payment_proof_url: data.payment_proof_url,
      }));
      setPaymentMessage("Bukti pembayaran tersimpan. Admin dapat melihatnya di dashboard PMB.");
    } catch (error) {
      setPaymentMessage("");
      alert(error instanceof Error ? error.message : "Gagal menyimpan bukti pembayaran.");
    }
  };

  // ===== SUCCESS =====
  if (submitted) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Pendaftaran Terkirim!</h2>
          <p className="text-gray-500 mt-1">Selamat, {submitted.full_name?.split(" ")[0]}!</p>
        </div>
        <div className="space-y-3 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Nomor Registrasi</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-700 font-mono">{submitted.registration_number}</span>
              <button onClick={() => navigator.clipboard.writeText(submitted.registration_number)} className="p-1.5 hover:bg-gray-200 rounded-lg"><Copy className="w-4 h-4 text-gray-400" /></button>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Kode Tagihan Pembayaran</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-yellow-700 font-mono">{submitted.billing_code}</span>
              <button onClick={() => navigator.clipboard.writeText(submitted.billing_code)} className="p-1.5 hover:bg-gray-200 rounded-lg"><Copy className="w-4 h-4 text-gray-400" /></button>
            </div>
            <p className="text-sm font-semibold mt-2">Total: <span className="text-green-700">Rp 150.000</span></p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 flex gap-2">
          <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700">Simpan nomor registrasi & kode tagihan. Lakukan pembayaran lalu hubungi admin PMB. Verifikasi 1–3 hari kerja.</p>
        </div>
        <div className="mb-6">
          <UploadBox
            label="Bukti Pembayaran"
            description="Upload bukti transfer setelah melakukan pembayaran"
            value={submitted.payment_proof_url}
            onChange={savePaymentProof}
          />
          {paymentMessage && <p className="text-xs text-green-700 mt-2">{paymentMessage}</p>}
        </div>
        <div className="space-y-2">
          {submitted.email && (
            <button onClick={sendEmail} disabled={sendingEmail} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">
              {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} Kirim ke Email
            </button>
          )}
          <button onClick={() => { setSubmitted(null); setForm(emptyForm); setStep(0); }} className="w-full px-4 py-2 text-sm text-gray-400 hover:text-gray-600">
            Daftar Lagi
          </button>
        </div>
      </div>
    </div>
  );

  // ===== FORM =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <div className="bg-green-800 text-white">
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Portal PMB DDI Semarang</h1>
            <p className="text-white/70 text-xs">Formulir Pendaftaran Peserta Didik Baru</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4">
          <StepBar current={step} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-lg">{STEP_ICONS[step]}</div>
              <div>
                <h2 className="font-semibold text-base">{["Pilihan Program","Data Pribadi","Data Alamat","Data Orang Tua","Upload Dokumen","Konfirmasi Data"][step]}</h2>
                <p className="text-xs text-gray-400">Langkah {step + 1} dari {STEPS.length}</p>
              </div>
            </div>
          </div>

          <div className="p-6">

            {/* STEP 0 */}
            {step === 0 && (
              <div className="space-y-5">
                <FSelect label="Lembaga Tujuan" required value={form.institution_id}
                  onChange={(v: string) => {
                    const inst = INSTITUTIONS.find(i => i.id === v);
                    setForm(p => ({ ...p, institution_id: v, institution_name: inst?.name || "", institution_short: inst?.short_name || "", jurusan_id: "", jurusan_name: "" }));
                  }}
                  options={INSTITUTIONS.map(i => ({ value: i.id, label: `${i.short_name} — ${i.name}` }))}
                  placeholder="Pilih lembaga yang dituju" />
                <FSelect label="Jalur Masuk" required value={form.jalur_id}
                  onChange={(v: string) => { const j = JALUR.find(x => x.id === v); setForm(p => ({ ...p, jalur_id: v, jalur_name: j?.name || "" })); }}
                  options={JALUR.map(j => ({ value: j.id, label: j.name }))}
                  placeholder="Pilih jalur pendaftaran" />
                <FSelect label={form.institution_short === "ADI" ? "Program Studi" : "Tingkat Kelas"} required
                  value={form.jurusan_id} disabled={!form.institution_id}
                  onChange={(v: string) => { const j = jurusanOptions.find(x => x.id === v); setForm(p => ({ ...p, jurusan_id: v, jurusan_name: j?.name || "" })); }}
                  options={jurusanOptions.map(j => ({ value: j.id, label: j.name }))}
                  placeholder={form.institution_id ? "Pilih program / kelas" : "Pilih lembaga dulu"} />
                {form.institution_id && jurusanOptions.length === 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">Belum ada program tersedia.</div>
                )}
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <FInput label="Nama Lengkap" required value={form.full_name} onChange={(e: any) => sf("full_name", e.target.value)} placeholder="Sesuai KTP / Ijazah / Akta Lahir" />
                <FInput label="NISN / NIK" value={form.nisn} onChange={(e: ChangeEvent<HTMLInputElement>) => sf("nisn", e.target.value)} placeholder="Nomor induk siswa atau identitas" />
                <div className="grid grid-cols-2 gap-4">
                  <FSelect label="Jenis Kelamin" required value={form.gender} onChange={(v: string) => sf("gender", v)}
                    options={[{ value: "Laki-laki", label: "Laki-laki" }, { value: "Perempuan", label: "Perempuan" }]} placeholder="— Pilih —" />
                  <FSelect label="Agama" required value={form.religion} onChange={(v: string) => sf("religion", v)} options={AGAMA} placeholder="— Pilih —" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FInput label="Tempat Lahir" value={form.birth_place} onChange={(e: any) => sf("birth_place", e.target.value)} placeholder="Kota" />
                  <FInput label="Tanggal Lahir" type="date" value={form.birth_date} onChange={(e: any) => sf("birth_date", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FSelect label="Kewarganegaraan" value={form.citizenship} onChange={(v: string) => sf("citizenship", v)}
                    options={[{ value: "WNI", label: "WNI" }, { value: "WNA", label: "WNA" }]} />
                  <FInput label="No. Telepon / WA" required value={form.phone} onChange={(e: any) => sf("phone", e.target.value)} placeholder="08xx-xxxx-xxxx" />
                </div>
                <FInput label="Email" type="email" value={form.email} onChange={(e: any) => sf("email", e.target.value)} placeholder="contoh@email.com" />
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <FTextarea label="Alamat Lengkap" required value={form.address} onChange={(e: any) => sf("address", e.target.value)} rows={2} placeholder="Nama jalan, nomor rumah..." />
                <div className="grid grid-cols-2 gap-4">
                  <FInput label="RT" value={form.rt} onChange={(e: any) => sf("rt", e.target.value)} placeholder="001" />
                  <FInput label="RW" value={form.rw} onChange={(e: any) => sf("rw", e.target.value)} placeholder="002" />
                </div>
                <WSelect label="Provinsi" value={form.provinsi_id} options={provinsiList} loading={loadingWilayah}
                  onChange={(e: any) => onProvinsi(e.target.value)} disabled={provinsiList.length === 0} />
                <WSelect label="Kota / Kabupaten" value={form.kota_id} options={kotaList} loading={loadingWilayah}
                  onChange={(e: any) => onKota(e.target.value)} disabled={!form.provinsi_id} />
                <WSelect label="Kecamatan" value={form.kecamatan_id} options={kecamatanList} loading={loadingWilayah}
                  onChange={(e: any) => onKecamatan(e.target.value)} disabled={!form.kota_id} />
                <WSelect label="Kelurahan / Desa" value={form.kelurahan_id} options={kelurahanList} loading={loadingWilayah}
                  onChange={(e: any) => { const n = kelurahanList.find((k: any) => k.id === e.target.value)?.name || ""; setForm(p => ({ ...p, kelurahan_id: e.target.value, kelurahan: n })); }}
                  disabled={!form.kecamatan_id} />
                {loadingWilayah && <div className="flex items-center gap-2 text-xs text-gray-400"><Loader2 className="w-3 h-3 animate-spin" /> Memuat...</div>}
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6">
                {[
                  { num: "1", color: "bg-green-100 text-green-700", title: "Data Sekolah Asal", content: (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <FSelect label="Status Sekolah" value={form.school_status} onChange={(v: string) => sf("school_status", v)} options={[{ value: "Negeri", label: "Negeri" }, { value: "Swasta", label: "Swasta" }]} />
                        <FInput label="Tahun Lulus" value={form.graduation_year} onChange={(e: any) => sf("graduation_year", e.target.value)} placeholder="2024" />
                      </div>
                      <FInput label="Nama Sekolah" value={form.school_name} onChange={(e: any) => sf("school_name", e.target.value)} placeholder="SMA/MTs/SD..." />
                      <FInput label="Nomor Ijazah" value={form.certificate_number} onChange={(e: any) => sf("certificate_number", e.target.value)} placeholder="Nomor ijazah/SKHU" />
                      <FInput label="Kecamatan Sekolah" value={form.school_kecamatan} onChange={(e: any) => sf("school_kecamatan", e.target.value)} />
                    </div>
                  )},
                  { num: "2", color: "bg-blue-100 text-blue-700", title: "Data Ayah", content: (
                    <div className="space-y-3">
                      <FInput label="Nama Ayah" value={form.father_name} onChange={(e: any) => sf("father_name", e.target.value)} />
                      <div className="grid grid-cols-2 gap-3">
                        <FSelect label="Pendidikan Terakhir" value={form.father_education} onChange={(v: string) => sf("father_education", v)} options={PENDIDIKAN} placeholder="Pilih" />
                        <FInput label="Pekerjaan" value={form.father_occupation} onChange={(e: any) => sf("father_occupation", e.target.value)} />
                      </div>
                    </div>
                  )},
                  { num: "3", color: "bg-pink-100 text-pink-700", title: "Data Ibu", content: (
                    <div className="space-y-3">
                      <FInput label="Nama Ibu" value={form.mother_name} onChange={(e: any) => sf("mother_name", e.target.value)} />
                      <div className="grid grid-cols-2 gap-3">
                        <FSelect label="Pendidikan Terakhir" value={form.mother_education} onChange={(v: string) => sf("mother_education", v)} options={PENDIDIKAN} placeholder="Pilih" />
                        <FInput label="Pekerjaan" value={form.mother_occupation} onChange={(e: any) => sf("mother_occupation", e.target.value)} />
                      </div>
                    </div>
                  )},
                  { num: "4", color: "bg-gray-100 text-gray-500", title: "Data Wali (jika ada)", content: (
                    <div className="grid grid-cols-2 gap-3">
                      <FInput label="Nama Wali" value={form.guardian_name} onChange={(e: any) => sf("guardian_name", e.target.value)} />
                      <FInput label="Pekerjaan Wali" value={form.guardian_occupation} onChange={(e: any) => sf("guardian_occupation", e.target.value)} />
                    </div>
                  )},
                  { num: "5", color: "bg-green-100 text-green-700", title: "Penghasilan Gabungan Orang Tua", content: (
                    <FSelect label="Total per Bulan" value={form.parent_income} onChange={(v: string) => sf("parent_income", v)}
                      options={["< Rp 1.000.000","Rp 1.000.000 – Rp 2.000.000","Rp 2.000.000 – Rp 3.500.000","Rp 3.500.000 – Rp 5.000.000","> Rp 5.000.000"]}
                      placeholder="Pilih rentang" />
                  )},
                ].map((sec, i, arr) => (
                  <div key={sec.num}>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${sec.color}`}>{sec.num}</span>
                      {sec.title}
                    </h3>
                    <div className="pl-8">{sec.content}</div>
                    {i < arr.length - 1 && <hr className="border-gray-100 mt-6" />}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> Upload JPG, PNG, atau PDF. Pastikan file jelas.
                </div>
                <UploadBox label="Foto Calon Peserta Didik" required description="Foto terbaru, latar belakang putih/merah" value={form.doc_photo_url} onChange={(v: string) => sf("doc_photo_url", v)} />
                <UploadBox label="Ijazah atau SKHU" required description="Scan atau foto yang jelas" value={form.doc_ijazah_url} onChange={(v: string) => sf("doc_ijazah_url", v)} />
                <UploadBox label="KTP atau Akta Lahir" required description="KTP orang tua atau akta lahir" value={form.doc_ktp_url} onChange={(v: string) => sf("doc_ktp_url", v)} />
                <UploadBox label="Kartu Keluarga (KK)" required description="Scan KK yang masih berlaku" value={form.doc_kk_url} onChange={(v: string) => sf("doc_kk_url", v)} />
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                  Periksa kembali semua data sebelum mengirim.
                </div>
                {[
                  { title: "Program", rows: [["Lembaga", form.institution_name], ["Jalur Masuk", form.jalur_name], ["Program/Kelas", form.jurusan_name]] },
                  { title: "Data Pribadi", rows: [["Nama Lengkap", form.full_name], ["NISN / NIK", form.nisn], ["Jenis Kelamin", form.gender], ["Agama", form.religion], ["Tempat/Tgl Lahir", `${form.birth_place || "-"}, ${form.birth_date || "-"}`], ["No. Telepon", form.phone], ["Email", form.email]] },
                  { title: "Alamat", rows: [["Alamat", form.address], ["RT/RW", `${form.rt || "-"}/${form.rw || "-"}`], ["Kelurahan", form.kelurahan], ["Kecamatan", form.kecamatan], ["Kota/Kab", form.kota], ["Provinsi", form.provinsi]] },
                  { title: "Sekolah & Orang Tua", rows: [["Asal Sekolah", form.school_name], ["Nomor Ijazah", form.certificate_number], ["Nama Ayah", form.father_name], ["Nama Ibu", form.mother_name], ["Wali", form.guardian_name], ["Penghasilan", form.parent_income]] },
                  { title: "Dokumen", rows: [["Foto", form.doc_photo_url ? "✓ Terupload" : "✗ Belum"], ["Ijazah/SKHU", form.doc_ijazah_url ? "✓ Terupload" : "✗ Belum"], ["KTP/Akta", form.doc_ktp_url ? "✓ Terupload" : "✗ Belum"], ["Kartu Keluarga", form.doc_kk_url ? "✓ Terupload" : "✗ Belum"]] },
                ].map(sec => (
                  <div key={sec.title} className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{sec.title}</p>
                    {sec.rows.map(([label, value]) => <SummaryRow key={label} label={label} value={value} />)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between px-6 pb-6 pt-2 border-t border-gray-100 mt-2">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none">
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800 disabled:opacity-30 disabled:pointer-events-none">
                Selanjutnya <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800 disabled:opacity-50">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</> : <><CheckCircle2 className="w-4 h-4" /> Kirim Pendaftaran</>}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">© 2025 DDI Semarang · Portal Penerimaan Peserta Didik Baru</p>
      </div>
    </div>
  );
}
