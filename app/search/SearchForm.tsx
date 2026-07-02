"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 3.5 3.5" />
    </svg>
  );
}

export default function SearchForm({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  return (
    <form
      className="searchPageForm"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = value.trim();
        if (trimmed) {
          router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        }
      }}
    >
      <input
        type="search"
        name="q"
        placeholder="Cari berita, kajian, halaman..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoFocus
      />
      <button type="submit" aria-label="Cari">
        <SearchIcon />
      </button>
    </form>
  );
}
