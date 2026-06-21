"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, GraduationCap, School, Search } from "lucide-react";

type InstitutionSlug = "adi" | "al-khawarizmi" | "ponpes-suruh";

const institutionMeta: Record<
  InstitutionSlug,
  {
    description: string;
    icon: typeof GraduationCap;
    id: string;
    name: string;
    shortName: string;
    tone: "blue" | "green" | "teal";
  }
> = {
  adi: {
    description: "Program Diploma Da'wah & Kepemimpinan Islam",
    icon: GraduationCap,
    id: "inst-1",
    name: "ADI (Akademi Da'wah Indonesia)",
    shortName: "ADI",
    tone: "green",
  },
  "ponpes-suruh": {
    description: "Pondok Pesantren Terpadu",
    icon: School,
    id: "inst-2",
    name: "Ponpes Suruh",
    shortName: "Ponpes Suruh",
    tone: "teal",
  },
  "al-khawarizmi": {
    description: "Sekolah Islam Terpadu",
    icon: Building2,
    id: "inst-3",
    name: "Al Khawarizmi",
    shortName: "Al Khawarizmi",
    tone: "blue",
  },
};

export default function PmbRegisterClient({ institution }: { institution: InstitutionSlug }) {
  const router = useRouter();
  const meta = institutionMeta[institution];
  const Icon = meta.icon;
  const [nisn, setNisn] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lookup, setLookup] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(() => (
    nisn.trim().length > 0 && name.trim().length > 0 && email.trim().length > 0
  ), [email, name, nisn]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/pendaftar/register", {
        body: JSON.stringify({
          email,
          full_name: name,
          institution,
          nisn,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal membuat akun pendaftar.");
      }

      const params = new URLSearchParams({
        email: data.email,
        institution,
        nisn: data.nisn,
        registered: "1",
      });

      router.push(`/Pendidikan/pmb/login?${params.toString()}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal membuat akun pendaftar.");
    } finally {
      setIsLoading(false);
    }
  }

  function findExisting() {
    if (!lookup.trim()) return;
    const params = new URLSearchParams({
      institution,
      nisn: lookup.trim(),
    });
    router.push(`/Pendidikan/pmb/login?${params.toString()}`);
  }

  return (
    <main className="pmbAuthPage">
      <section className="pmbRegisterShell">
        <header className={`pmbRegisterHero ${meta.tone}`}>
          <div className="pmbRegisterInstitution">
            <span>
              <Icon aria-hidden="true" />
            </span>
            <div>
              <strong>{meta.name}</strong>
              <small>{meta.description}</small>
            </div>
          </div>
          <h1>Portal PMB 2026</h1>
          <p>Dewan Da&apos;wah Semarang</p>
        </header>

        <form className="pmbRegisterCard" onSubmit={submit}>
          <div className="pmbAuthCardHead">
            <h2>Daftar Akun Pendaftar</h2>
            <p>Buat akun terlebih dahulu sebelum mengisi formulir</p>
          </div>

          <label className="pmbAuthField">
            <span>NISN *</span>
            <input
              onChange={(event) => setNisn(event.target.value)}
              placeholder="10 digit NISN"
              required
              value={nisn}
            />
            <small>Nomor Induk Siswa Nasional dari sekolah asal</small>
          </label>

          <label className="pmbAuthField">
            <span>Nama Lengkap *</span>
            <input
              onChange={(event) => setName(event.target.value)}
              placeholder="Sesuai ijazah / akta lahir"
              required
              value={name}
            />
          </label>

          <label className="pmbAuthField">
            <span>Email *</span>
            <input
              onChange={(event) => setEmail(event.target.value)}
              placeholder="contoh@email.com"
              required
              type="email"
              value={email}
            />
          </label>

          {message ? <p className="pmbAuthMessage">{message}</p> : null}

          <button className="pmbAuthPrimary" disabled={!canSubmit || isLoading} type="submit">
            {isLoading ? "Membuat akun..." : "Daftar Akun"}
            <span aria-hidden="true">-&gt;</span>
          </button>

          <div className="pmbAuthDivider" />

          <div className="pmbLookup">
            <p>Sudah pernah mendaftar?</p>
            <div>
              <input
                onChange={(event) => setLookup(event.target.value)}
                placeholder="Masukkan NISN"
                value={lookup}
              />
              <button aria-label="Cari pendaftaran" onClick={findExisting} type="button">
                <Search aria-hidden="true" />
              </button>
            </div>
          </div>

          <Link className="pmbAuthSubtleLink" href="/Pendidikan/pmb">
            &lt;- Pilih sekolah lain
          </Link>
        </form>

        <p className="pmbAuthFooter">&copy; 2026 DDI Semarang &middot; Portal PMB</p>
      </section>
    </main>
  );
}
