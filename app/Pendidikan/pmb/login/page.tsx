"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PmbLoginPage() {
  const router = useRouter();

  const [institution] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("institution") || "";
  });

  const [nisn, setNisn] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("nisn") || "";
  });

  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("email") || "";
  });

  const [message, setMessage] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("registered")
      ? "Akun berhasil dibuat. Silakan login untuk melanjutkan ke formulir."
      : "";
  });

  const registerHref = (
    institution === "adi"
    || institution === "ponpes-suruh"
    || institution === "al-khawarizmi"
  )
    ? `/Pendidikan/pmb/daftar/${institution}`
    : "/Pendidikan/pmb";

  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/pendaftar/login", {
        body: JSON.stringify({ email, institution, nisn }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal masuk ke akun pendaftaran.");
      }

      const params = new URLSearchParams({
        email: data.email,
        institution: data.institution_id,
        institution_slug: data.institution,
        name: data.full_name,
        nisn: data.nisn,
      });

      sessionStorage.setItem(
        "pmb_session",
        JSON.stringify({
          email: data.email,
          fullName: data.full_name,
          id: data.id,
          institution: data.institution,
          institutionId: data.institution_id,
          institutionName: data.institution_name,
          institutionShort: data.institution_short,
          nisn: data.nisn,
        }),
      );

      router.push(`/Pendidikan/pmb/dashboard?${params.toString()}`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal masuk ke akun pendaftaran."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="pmbAuthPage">
      <section className="pmbLoginShell">
        <div className="pmbAuthBrand compact">
          <span>DD</span>
          <h1>Login & Cek Status</h1>
          <p>Portal PMB DDI Semarang 2026</p>
        </div>

        <form className="pmbAuthCard" onSubmit={submit}>
          <div className="pmbAuthCardHead">
            <h2>Login Pendaftar</h2>
            <p>Gunakan email dan NISN yang digunakan saat mendaftar.</p>
          </div>

          <label className="pmbAuthField">
            <span>NISN</span>
            <input
              name="nisn"
              value={nisn}
              onChange={(event) => setNisn(event.target.value)}
              placeholder="10 digit NISN"
              required
            />
          </label>

          <label className="pmbAuthField">
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email yang didaftarkan"
              required
            />
          </label>

          {message ? <p className="pmbAuthMessage">{message}</p> : null}

          <button
            className="pmbAuthPrimary"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Memeriksa..." : "Masuk"}
            <span aria-hidden="true">-&gt;</span>
          </button>

          <div className="pmbAuthDivider" />

          <Link className="pmbAuthSubtleLink" href={registerHref}>
            Belum punya akun? Daftar akun -&gt;
          </Link>
        </form>

        <p className="pmbAuthFooter">
          &copy; 2026 DDI Semarang &middot; Portal PMB
        </p>
      </section>
    </main>
  );
}
