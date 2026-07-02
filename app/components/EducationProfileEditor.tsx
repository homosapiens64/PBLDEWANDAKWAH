"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  saveEducationProfile,
  type EducationProfileInput,
} from "../dashboard-actions";
import type { EducationProfile, EducationView } from "../lib/education-profile";
import ImageUploadField from "./ImageUploadField";

type EducationProfileForm = Omit<EducationProfileInput, "section">;

function EditorIcon({ name }: { name: "save" | "x" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "save" ? (
        <>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
          <path d="M17 21v-8H7v8M7 3v5h8" />
        </>
      ) : (
        <path d="M18 6 6 18M6 6l12 12" />
      )}
    </svg>
  );
}

export default function EducationProfileEditor({
  cancelHref,
  profile,
  view,
}: {
  cancelHref: string;
  profile: EducationProfile;
  view: EducationView;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<EducationProfileForm>({
    description: profile.description,
    fields: profile.fields.map((field) => ({
      name: field.name,
      value: field.value,
    })),
    imageUrl: profile.imageUrl,
    institutionName: profile.institutionName,
    tagline: profile.tagline,
  });

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      fields: current.fields.map((field) => (
        field.name === name ? { ...field, value } : field
      )),
    }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        await saveEducationProfile({
          ...form,
          section: view,
        });
        setMessage("Profil lembaga berhasil disimpan dan halaman publik telah diperbarui.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Profil lembaga gagal disimpan.");
      }
    });
  }

  return (
    <form className="educationEditForm" onSubmit={submit}>
      <div className="educationEditHeading">
        <div>
          <h2>{profile.editTitle}</h2>
        </div>
      </div>

      {message ? <p className="dashboardActionMessage">{message}</p> : null}

      <label>
        <span>Nama Lembaga</span>
        <input
          name="institutionName"
          onChange={(event) => setForm((current) => ({ ...current, institutionName: event.target.value }))}
          required
          value={form.institutionName}
        />
      </label>
      <label>
        <span>Tagline</span>
        <input
          name="tagline"
          onChange={(event) => setForm((current) => ({ ...current, tagline: event.target.value }))}
          value={form.tagline}
        />
      </label>
      <label>
        <span>Deskripsi</span>
        <textarea
          name="description"
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          required
          value={form.description}
        />
      </label>

      <ImageUploadField
        label="Gambar lembaga"
        onUploaded={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))}
        value={form.imageUrl}
      />

      <div className="educationEditGrid educationContactFields">
        {profile.fields.map((field) => (
          <label key={field.name}>
            <span>{field.label}</span>
            <input
              name={field.name}
              onChange={(event) => updateField(field.name, event.target.value)}
              value={form.fields.find((item) => item.name === field.name)?.value ?? ""}
            />
          </label>
        ))}
      </div>
      <div className="educationFormActions">
        <button type="submit" className="educationSaveButton" disabled={isPending}>
          <EditorIcon name="save" />
          <span>{isPending ? "Menyimpan..." : "Simpan"}</span>
        </button>
        <a href={cancelHref} className="educationCancelButton">
          <EditorIcon name="x" />
          <span>Batal</span>
        </a>
      </div>
    </form>
  );
}
