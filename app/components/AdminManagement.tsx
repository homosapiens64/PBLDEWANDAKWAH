"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createEducationAdmin,
  type CreateAdminState,
} from "../dashboard-actions";
import {
  institutionLabels,
  type EducationInstitution,
} from "../lib/roles";

export type EducationAdminRow = {
  createdAt: string;
  id: number;
  institution: EducationInstitution;
  name: string;
  username: string;
};

const initialState: CreateAdminState = {
  message: "",
  success: false,
};

export default function AdminManagement({
  admins,
}: {
  admins: EducationAdminRow[];
}) {
  const [state, action, pending] = useActionState(
    createEducationAdmin,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section className="adminManagement">
      <header className="adminManagementHeader">
        <span>Manajemen Akses</span>
        <h1>Admin Pendidikan</h1>
        <p>
          Super Admin hanya dapat menambahkan akun admin dan menentukan
          pendidikan yang menjadi tanggung jawabnya.
        </p>
      </header>

      <div className="adminManagementGrid">
        <form ref={formRef} action={action} className="adminCreateCard">
          <div>
            <h2>Tambah Admin</h2>
            <p>Setiap akun hanya memiliki akses ke satu pendidikan dan PMB-nya.</p>
          </div>

          <label>
            <span>Nama Lengkap</span>
            <input name="name" minLength={3} maxLength={100} required />
          </label>
          <label>
            <span>Username</span>
            <input
              name="username"
              minLength={3}
              maxLength={50}
              pattern="[a-z0-9._-]+"
              autoComplete="off"
              required
            />
          </label>
          <label>
            <span>Password Awal</span>
            <input
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              required
            />
          </label>
          <label>
            <span>Pendidikan</span>
            <select name="institution" defaultValue="adi" required>
              {Object.entries(institutionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {state.message ? (
            <p
              className={state.success ? "adminFormMessage success" : "adminFormMessage error"}
              aria-live="polite"
            >
              {state.message}
            </p>
          ) : null}

          <button type="submit" disabled={pending}>
            {pending ? "Menambahkan..." : "Tambah Admin"}
          </button>
        </form>

        <article className="adminListCard">
          <div className="adminListHeading">
            <h2>Daftar Admin Aktif</h2>
            <p>{admins.length} akun admin pendidikan</p>
          </div>

          <div className="adminTableWrap">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Username</th>
                  <th>Pendidikan</th>
                  <th>Dibuat</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td><strong>{admin.name}</strong></td>
                    <td>{admin.username}</td>
                    <td>
                      <span className="adminInstitutionBadge">
                        {institutionLabels[admin.institution]}
                      </span>
                    </td>
                    <td>{admin.createdAt}</td>
                  </tr>
                ))}
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="financeEmptyState">
                      Belum ada admin pendidikan.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
