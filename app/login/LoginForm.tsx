"use client";

import Link from "next/link";
import { loginAction } from "./actions";

type LoginFormProps = {
  hasError: boolean;
};

export default function LoginForm({ hasError }: LoginFormProps) {
  return (
    <form action={loginAction} className="loginCard">
      {hasError ? (
        <p className="loginError">
          Username atau password belum sesuai. Silakan coba lagi.
        </p>
      ) : null}

      <div className="loginField">
        <label htmlFor="login-username">Username</label>
        <div className="passwordInputWrap">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <input
            id="login-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Masukkan username"
            required
          />
        </div>
      </div>

      <div className="loginField">
        <div className="passwordLabelRow">
          <label htmlFor="login-password">Password</label>
        </div>
        <div className="passwordInputWrap">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="........"
            required
          />
        </div>
      </div>

      <button type="submit" className="loginSubmitButton">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
        Masuk
      </button>

      <Link href="/" className="loginBackButton">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Kembali ke beranda
      </Link>
    </form>
  );
}
