import LoginForm from "./LoginForm";
import Image from "next/image";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = params?.error === "1";

  return (
    <main className="authPage loginPage">
      <section className="loginShell">
        <div className="loginBrandPanel">
          <Image
            src="/logo.png"
            alt="Dewan Da'wah Kota Semarang"
            width={320}
            height={120}
            priority
          />
          <div>
            <p className="loginBrandEyebrow">Sistem Informasi Terpadu</p>
            <h1 id="login-title">Kelola pelayanan dakwah dalam satu tempat.</h1>
            <p>
              Portal internal untuk pengelolaan konten, pendidikan, kajian,
              konsultasi, dan keuangan Dewan Da&apos;wah Kota Semarang.
            </p>
          </div>
          <div className="loginBrandFooter">
            <span>DDI Kota Semarang</span>
            <span>Portal Internal</span>
          </div>
        </div>

        <section className="loginFormPanel" aria-labelledby="login-form-title">
          <div className="loginFormHeading">
            <div className="loginIcon" aria-hidden="true">
              <svg viewBox="0 0 32 32" role="img">
                <path d="M6 16h13" />
                <path d="m15 10 6 6-6 6" />
                <path d="M19 6h5a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-5" />
              </svg>
            </div>
            <p>Selamat datang kembali</p>
            <h2 id="login-form-title">Masuk ke Sistem</h2>
            <span>Pilih peran dan masukkan password akun Anda.</span>
          </div>
          <div className="loginFormWrap" aria-label="Form login internal">
            <LoginForm hasError={hasError} />
          </div>
        </section>
      </section>
    </main>
  );
}
