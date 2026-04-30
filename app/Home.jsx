"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const beritaUtama = [
  {
    id: 1,
    image: "/images/berita1.jpg",
    title: "Kunjungan Asatidzah Dewan Da'wah Magetan ke Kampus IDDC",
    author: "Drs. Ust. M. Alim, Pengurus DDI Kab. Magetan",
    source: "Dewandakwahsatjim.com, Magetan...",
    date: "27 Mei 2025",
  },
  {
    id: 2,
    image: "/images/berita2.jpg",
    title: "Kunjungan Asatidzah Dewan Da'wah Magetan ke Kampus IDDC",
    author: "Drs. Ust. M. Alim, Pengurus DDI Kab. Magetan",
    source: "Dewandakwahsatjim.com, Magetan...",
    date: "27 Mei 2025",
  },
];

const beritaSamping = [
  {
    id: 1,
    image: "/images/bs1.jpg",
    title: "Cahaya Ilmu dari Pesantren: Menyinari Jiwa dan Peradaban",
    location: "Semarang",
    date: "27 Mei 2025",
  },
  {
    id: 2,
    image: "/images/bs2.jpg",
    title: "Puasa Investasi Tak Terlihat, Keuntungan Tak Terbatas",
    location: "Bekasi",
    date: "27 Mei 2025",
  },
  {
    id: 3,
    image: "/images/bs3.jpg",
    title: "Cahaya Ilmu dari Pesantren: Menyinari Jiwa dan Peradaban",
    location: "Semarang",
    date: "27 Mei 2025",
  },
  {
    id: 4,
    image: "/images/bs4.jpg",
    title: "Puasa Investasi Tak Terlihat, Keuntungan Tak Terbatas",
    location: "Semarang",
    date: "27 Mei 2025",
  },
];

const kajianTabs = ["Semua", "Tauhid", "Ekonomi Islam", "Tarbiyah", "Khutbah"];

const kajianData = [
  {
    id: 1,
    image: "/images/kajian1.jpg",
    title: "Pengaruh Komunikasi Intrapersonal antara Hamba dengan Allah",
    author: "Sudono Syafi",
    date: "April 22, 2026",
    readTime: "8 menit baca",
    tag: "Tauhid",
  },
  {
    id: 2,
    image: "/images/kajian2.jpg",
    title: "Pengaruh Komunikasi Intrapersonal antara Hamba dengan Allah",
    author: "Sudono Syafi",
    date: "April 22, 2026",
    readTime: "8 menit baca",
    tag: "Sejarah",
  },
  {
    id: 3,
    image: "/images/kajian3.jpg",
    title: "Pengaruh Komunikasi Intrapersonal antara Hamba dengan Allah",
    author: "Sudono Syafi",
    date: "April 22, 2026",
    readTime: "8 menit baca",
    tag: "Hikmah",
  },
];

const programData = [
  {
    id: 1,
    badge: "URGENT",
    badgeColor: "bg-red-600",
    image: "/images/program1.jpg",
    title: "Zakat untuk Muallaf Pedalaman bersama Koh Dondy Tan",
    org: "LAZNAS Dewan Dakwah",
    sisaWaktu: "3 Bulan",
    terkumpul: "Rp 135.199.400",
    progress: 45,
  },
  {
    id: 2,
    badge: "URGENT",
    badgeColor: "bg-red-600",
    image: "/images/program2.jpg",
    title: "Beasiswa untuk Santri Penghafal Quran di Depok",
    org: "LAZNAS Dewan Dakwah",
    sisaWaktu: "9 Bulan",
    terkumpul: "Rp 146.000",
    progress: 10,
  },
  {
    id: 3,
    badge: "OPEN DONASI",
    badgeColor: "bg-green-600",
    image: "/images/program3.jpg",
    title: "Pembebasan Lahan Ponthok Tahfidz Darul Qur'an - Bedugul, Bali",
    org: "LAZNAS Dewan Dakwah",
    sisaWaktu: "2 Bulan",
    terkumpul: "Rp 1.000.225",
    progress: 30,
  },
];

// ─── SECTION 1: HERO ─────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="w-full">
      <div className="relative w-full" style={{ height: "480px" }}>
        <Image
          src="/images/natsir.png"
          alt="Banner Mohammad Natsir"
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
        />
      </div>
    </section>
  );
}

// ─── SECTION 2: BERITA & KEGIATAN ────────────────────────────────────────────

function BeritaSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading row */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p
              className="text-gray-500 uppercase tracking-widest font-semibold mb-1"
              style={{ fontSize: "0.75rem" }}
            >
              INFORMASI TERKINI
            </p>
            <h2
              className="font-extrabold leading-none"
              style={{
                fontSize: "2rem",
                color: "#d4890a",
                fontFamily: "'Georgia', serif",
              }}
            >
              BERITA &amp; KEGIATAN
            </h2>
          </div>
          <Link
            href="/berita"
            className="flex items-center gap-2 border px-4 py-2 font-semibold text-sm hover:bg-orange-50 transition-colors"
            style={{
              borderColor: "#d4890a",
              color: "#d4890a",
              borderRadius: "2px",
            }}
          >
            SELENGKAPNYA{" "}
            <span>↗</span>
          </Link>
        </div>

        <div className="flex gap-6">
          {/* Left: 2 main image cards */}
          <div className="flex gap-4 flex-1">
            {beritaUtama.map((item) => (
              <div
                key={item.id}
                className="flex-1 rounded overflow-hidden shadow-sm border border-gray-100 group cursor-pointer"
              >
                <div className="bg-gray-200" style={{ height: 160 }} />
                <div className="p-3">
                  <h3
                    className="font-semibold leading-snug mb-2 group-hover:text-teal-700 transition-colors"
                    style={{ fontSize: "0.88rem", color: "#1a1a1a" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-gray-500 leading-snug"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {item.author}
                    <br />
                    {item.source}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: list items */}
          <div className="flex flex-col gap-3" style={{ width: 280 }}>
            {beritaSamping.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 items-start cursor-pointer group"
              >
                <div
                  className="flex-shrink-0 rounded bg-gray-200"
                  style={{ width: 72, height: 56 }}
                />
                <div className="flex-1">
                  <p
                    className="text-gray-400 mb-0.5"
                    style={{ fontSize: "0.68rem" }}
                  >
                    {item.location} · {item.date}
                  </p>
                  <p
                    className="font-semibold leading-snug group-hover:text-teal-700 transition-colors"
                    style={{ fontSize: "0.8rem", color: "#1a1a1a" }}
                  >
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 3: KAJIAN & MATERI DAKWAH ───────────────────────────────────────

function KajianSection() {
  const [activeTab, setActiveTab] = useState("Semua");

  return (
    <section
      className="py-12"
      style={{ background: "linear-gradient(180deg, #e8f5f1 0%, #d4ede6 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Label */}
        <p
          className="text-center tracking-[0.25em] uppercase font-medium mb-1"
          style={{ fontSize: "0.72rem", color: "#2d8f76" }}
        >
          ARTIKEL ISLAMI
        </p>

        {/* Heading */}
        <h2
          className="text-center font-bold mb-6"
          style={{
            fontSize: "1.8rem",
            color: "#1a4a3f",
            fontFamily: "'Georgia', serif",
          }}
        >
          Kajian &amp; Materi Dakwah
        </h2>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {kajianTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-full font-semibold transition-all duration-150 text-sm"
              style={
                activeTab === tab
                  ? {
                      background: "#2d8f76",
                      color: "#ffffff",
                      border: "1px solid #2d8f76",
                    }
                  : {
                      background: "transparent",
                      color: "#2d8f76",
                      border: "1px solid #2d8f76",
                    }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Article list */}
        <div className="flex flex-col gap-4 mb-8">
          {kajianData.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm group cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div
                className="flex-shrink-0 rounded bg-gray-200"
                style={{ width: 90, height: 68 }}
              />
              {/* Info */}
              <div className="flex-1">
                <h3
                  className="font-semibold leading-snug mb-1 group-hover:text-teal-700 transition-colors"
                  style={{ fontSize: "0.9rem", color: "#1a1a1a" }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                  {item.author} &nbsp;·&nbsp; {item.date} &nbsp;·&nbsp;{" "}
                  {item.readTime}
                </p>
              </div>
              {/* Tag */}
              <div className="flex-shrink-0">
                <span
                  className="inline-block px-3 py-1 rounded font-semibold text-white"
                  style={{
                    background: "#2d8f76",
                    fontSize: "0.75rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* SELENGKAPNYA button */}
        <div className="flex justify-center">
          <Link
            href="/kajian"
            className="flex items-center gap-2 border px-6 py-2.5 font-semibold text-sm hover:bg-teal-700 hover:text-white transition-colors"
            style={{
              borderColor: "#2d8f76",
              color: "#2d8f76",
              borderRadius: "2px",
            }}
          >
            SELENGKAPNYA <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 4: KONSULTASI AGAMA ─────────────────────────────────────────────

function KonsultasiSection() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left: image */}
          <div className="relative flex-shrink-0" style={{ width: 420 }}>
            {/* Decorative dot grid */}
            <div
              className="absolute"
              style={{
                top: -16,
                left: -16,
                width: 100,
                height: 100,
                backgroundImage:
                  "radial-gradient(circle, #2d8f76 1.5px, transparent 1.5px)",
                backgroundSize: "12px 12px",
                zIndex: 0,
                opacity: 0.4,
              }}
            />
            <div
              className="absolute"
              style={{
                bottom: -16,
                right: -16,
                width: 80,
                height: 80,
                backgroundImage:
                  "radial-gradient(circle, #2d8f76 1.5px, transparent 1.5px)",
                backgroundSize: "12px 12px",
                zIndex: 0,
                opacity: 0.4,
              }}
            />
            <div
              className="relative z-10 rounded overflow-hidden shadow-md bg-gray-200"
              style={{ height: 300 }}
            >
              {/* Green badge overlay */}
              <div
                className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded text-white font-semibold"
                style={{ background: "#2d8f76", fontSize: "0.8rem" }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full bg-white opacity-80"
                />
                Konsultasi Gratis
                <br />
                <span className="font-normal opacity-80" style={{ fontSize: "0.7rem" }}>
                  bersama ustadz terpercaya
                </span>
              </div>
            </div>
          </div>

          {/* Right: text */}
          <div className="flex-1">
            <p
              className="uppercase tracking-widest font-semibold mb-2"
              style={{ fontSize: "0.72rem", color: "#2d8f76" }}
            >
              Layanan Islam Terpercaya
            </p>
            <h2
              className="font-bold mb-4 leading-tight"
              style={{
                fontSize: "2rem",
                color: "#1a4a3f",
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
              }}
            >
              Konsultasi{" "}
              <span style={{ color: "#2d8f76" }}>Agama</span>
            </h2>
            <p
              className="text-gray-600 mb-6 leading-relaxed"
              style={{ fontSize: "0.9rem" }}
            >
              Tim ustadz Dewan Da&apos;wah siap menjawab pertanyaan seputar
              hukum Islam dan keluarga kalian secara gratis, terpercaya, dan
              berlandaskan Al-Qur&apos;an &amp; Sunnah.
            </p>

            {/* Checklist */}
            <ul className="flex flex-col gap-3">
              {[
                "Tanya Hukum Alam",
                "Jawaban Termotivasi via Email & WA",
                "Chat Langsung: Jam Kerja",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "#2d8f76" }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="#fff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    className="font-medium"
                    style={{ fontSize: "0.9rem", color: "#1a1a1a" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 5: PROGRAM KEBAIKAN ─────────────────────────────────────────────

function ProgramSection() {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Label */}
        <p
          className="font-bold uppercase tracking-widest mb-1"
          style={{ fontSize: "0.72rem", color: "#2d8f76" }}
        >
          LAZNAS SEMARANG
        </p>

        {/* Heading */}
        <h2
          className="font-extrabold mb-8"
          style={{
            fontSize: "2rem",
            color: "#111111",
            fontFamily: "'Georgia', serif",
          }}
        >
          Program Kebaikan
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programData.map((item) => (
            <div
              key={item.id}
              className="rounded-lg overflow-hidden shadow-md border border-gray-100 flex flex-col group hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative bg-gray-200" style={{ height: 180 }}>
                {/* Badge */}
                <span
                  className="absolute top-2 left-2 text-white font-bold px-2 py-0.5 rounded text-xs"
                  style={{ background: item.badgeColor, letterSpacing: "0.05em" }}
                >
                  {item.badge}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3
                  className="font-semibold leading-snug mb-2 flex-1"
                  style={{ fontSize: "0.88rem", color: "#1a1a1a" }}
                >
                  {item.title}
                </h3>

                {/* Org */}
                <div className="flex items-center gap-1 mb-3">
                  <span
                    className="inline-block w-4 h-4 rounded-full flex-shrink-0"
                    style={{ background: "#2d8f76" }}
                  />
                  <span
                    className="text-gray-500 font-medium"
                    style={{ fontSize: "0.72rem" }}
                  >
                    {item.org} ✓
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  className="w-full rounded-full mb-3 overflow-hidden"
                  style={{ height: 6, background: "#e5e7eb" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.progress}%`,
                      background: "linear-gradient(90deg, #e8a020, #d4890a)",
                    }}
                  />
                </div>

                {/* Info row */}
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-gray-400"
                      style={{ fontSize: "0.68rem" }}
                    >
                      Sisa Waktu
                    </p>
                    <p
                      className="font-bold"
                      style={{ fontSize: "0.8rem", color: "#1a1a1a" }}
                    >
                      {item.sisaWaktu}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-gray-400"
                      style={{ fontSize: "0.68rem" }}
                    >
                      Terkumpul
                    </p>
                    <p
                      className="font-bold"
                      style={{ fontSize: "0.8rem", color: "#2d8f76" }}
                    >
                      {item.terkumpul}
                    </p>
                  </div>
                  {/* Arrow button */}
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 hover:brightness-110 transition-all"
                    style={{ background: "linear-gradient(135deg, #e8a020, #d4890a)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M8 3l5 5-5 5"
                        stroke="#fff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <BeritaSection />
      <KajianSection />
      <KonsultasiSection />
      <ProgramSection />
    </main>
  );
}
