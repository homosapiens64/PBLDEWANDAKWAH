"use client";

import Link from "next/link";
import { useState } from "react";
import { loginAction } from "./actions";

const loginRoles = [
  { label: "Admin", value: "admin" },
  { label: "Pengurus", value: "pengurus" },
  { label: "Bendahara", value: "bendahara" },
  { label: "Ustadz", value: "ustadz" },
];

type LoginFormProps = {
  hasError: boolean;
};

export default function LoginForm({ hasError }: LoginFormProps) {
  const [selectedRole, setSelectedRole] = useState(loginRoles[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <form action={loginAction} className="loginCard">
      {hasError ? (
        <p className="loginError">
          Role atau password belum sesuai. Coba gunakan akun demo yang tersedia.
        </p>
      ) : null}

      <input type="hidden" name="username" value={selectedRole.value} />

      <div className="loginField">
        <label htmlFor="login-role">Masuk sebagai</label>
        <div className="roleSelect" data-open={isOpen}>
          <button
            id="login-role"
            type="button"
            className="roleSelectTrigger"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span>{selectedRole.label}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {isOpen ? (
            <div className="roleSelectMenu" role="listbox" aria-label="Masuk sebagai">
              {loginRoles.map((role) => {
                const isSelected = role.value === selectedRole.value;

                return (
                  <button
                    key={role.value}
                    type="button"
                    className={isSelected ? "roleOption roleOptionActive" : "roleOption"}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSelectedRole(role);
                      setIsOpen(false);
                    }}
                  >
                    <span>{role.label}</span>
                    {isSelected ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m20 6-11 11-5-5" />
                      </svg>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="loginField">
        <div className="passwordLabelRow">
          <label htmlFor="login-password">Password</label>
          <span className="passwordHint">Demo: {selectedRole.value}123</span>
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
