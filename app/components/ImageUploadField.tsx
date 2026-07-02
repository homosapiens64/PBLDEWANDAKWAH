"use client";

import { useId, useState, type ChangeEvent } from "react";

const MAX_IMAGE_SIZE = 50 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUploadField({
  label = "Gambar",
  onUploaded,
  value,
}: {
  label?: string;
  onUploaded: (url: string) => void;
  value: string;
}) {
  const inputId = useId();
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setMessage("Format gambar harus JPG, PNG, atau WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setMessage("Ukuran gambar maksimal 50 MB.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok || !payload?.file_url) {
        throw new Error(payload?.message || "Upload gambar gagal.");
      }

      onUploaded(payload.file_url);
      setMessage(`Gambar siap disimpan: ${file.name}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload gambar gagal.");
      event.target.value = "";
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="financeFormField imageUploadField">
      <span>{label}</span>
      <input
        accept="image/jpeg,image/png,image/webp"
        className="imageUploadInput"
        disabled={uploading}
        id={inputId}
        type="file"
        onChange={upload}
      />
      <label className="imageUploadButton" htmlFor={inputId}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>{uploading ? "Mengunggah..." : value ? "Ganti Gambar" : "Pilih Gambar"}</span>
      </label>
      <small className="imageUploadHint">JPG, PNG, atau WEBP. Maksimal 50 MB.</small>
      {value ? (
        <div className="imageUploadPreview">
          <span style={{ backgroundImage: `url("${value.replaceAll('"', "%22")}")` }} />
          <small>{value}</small>
        </div>
      ) : null}
      {uploading || message ? (
        <small className="imageUploadMessage">{uploading ? "Mengunggah..." : message}</small>
      ) : null}
    </div>
  );
}
