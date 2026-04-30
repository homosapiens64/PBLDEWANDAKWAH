
'use client'

import React, { useState } from 'react'

type KajianItem = {
  id: number
  title: string
  author: string
  date: string
  excerpt: string
}

function Card({ item }: { item: KajianItem }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
      <div style={{ width: '100%', height: 160, background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ color: '#bbb' }}>Gambar</span>
        <span style={{ position: 'absolute', top: 12, left: 12, background: '#333', color: '#fff', padding: '2px 8px', fontSize: 12, borderRadius: 4 }}>Resensi</span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, background: '#e0e0e0', borderRadius: '50%' }}></div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{item.author}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{item.date}</div>
          </div>
        </div>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 8 }}>{item.title}</h4>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>{item.excerpt}</p>
        <button style={{ background: '#333', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}>Selengkapnya</button>
      </div>
    </div>
  )
}

function SectionPager({
  items,
  pageSize = 3,
}: {
  items: KajianItem[]
  pageSize?: number
}) {
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const start = page * pageSize
  const visible = items.slice(start, start + pageSize)

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(pageSize, visible.length)}, 1fr)`, gap: 28, marginBottom: 20 }}>
        {visible.map((it) => (
          <div key={it.id}>
            <Card item={it} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          style={{
            background: page === 0 ? '#eee' : '#333',
            color: page === 0 ? '#999' : '#fff',
            border: 'none',
            padding: '8px 14px',
            borderRadius: 6,
            cursor: page === 0 ? 'default' : 'pointer',
          }}
        >
          ← Back
        </button>

        <div style={{ fontSize: 13, color: '#666' }}>
          Halaman {page + 1} dari {totalPages}
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          style={{
            background: page >= totalPages - 1 ? '#eee' : '#333',
            color: page >= totalPages - 1 ? '#999' : '#fff',
            border: 'none',
            padding: '8px 14px',
            borderRadius: 6,
            cursor: page >= totalPages - 1 ? 'default' : 'pointer',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  // sample data to replace the previous [1,2,3] maps
  const tauhid = [
    { id: 1, title: 'Perumahan Tauhid & Bahaya Syrik', author: 'Jaka SKB', date: 'Juli 2023', excerpt: 'This article was written by Jake Williams from HealthlineSlam. Strength is fundamental part of one\'s overall health.' },
    { id: 2, title: 'Pemurnian Tauhid', author: 'Fran Lareza', date: 'Juli 2023', excerpt: 'The Vegas Golden Knights will play the Florida Panthers in the Stanley Cup Final beginning Saturday.' },
    { id: 3, title: 'Tauhid Praktis', author: 'King Locado', date: 'Juli 2023', excerpt: 'An Badminton and the country\'s governing body, Philippine Badminton Association.' },
    { id: 4, title: 'Tauhid Lanjutan', author: 'Penulis X', date: 'Agustus 2023', excerpt: 'Contoh artikel tambahan untuk halaman kedua.' },
    { id: 5, title: 'Tauhid untuk Keluarga', author: 'Penulis Y', date: 'September 2023', excerpt: 'Pembahasan ringkas tentang penerapan tauhid dalam keluarga.' },
  ]

  const ekonomi = [
    { id: 1, title: 'Golden Knights out to fulfill owner\'s quest', author: 'Fran Lareza', date: 'Juli 2023', excerpt: 'The Vegas Golden Knights will play the Florida Panthers in the Stanley Cup Final beginning Saturday.' },
    { id: 2, title: 'Ekonomi Islam Dasar', author: 'Jaka SKB', date: 'Juli 2023', excerpt: 'This article was written by Jake Williams from HealthlineSlam.' },
    { id: 3, title: 'Zakat dan Investasi', author: 'King Locado', date: 'Juli 2023', excerpt: 'Pembahasan singkat tentang zakat dan investasi syariah.' },
    { id: 4, title: 'Keuangan Syariah', author: 'Penulis Y', date: 'Agustus 2023', excerpt: 'Contoh artikel tambahan untuk halaman kedua.' },
  ]

  const tazkiyah = [
    { id: 1, title: 'Tazkiyah Jiwa', author: 'Jaka SKB', date: 'Juli 2023', excerpt: 'This article was written by Jake Williams.' },
    { id: 2, title: 'Tazkiyah Praktis', author: 'Fran Lareza', date: 'Juli 2023', excerpt: 'Praktik tazkiyah sehari-hari untuk remaja.' },
    { id: 3, title: 'Tazkiyah untuk Remaja', author: 'King Locado', date: 'Juli 2023', excerpt: 'Panduan singkat tazkiyah untuk pelajar.' },
    { id: 4, title: 'Tazkiyah Lanjutan', author: 'Penulis Z', date: 'Agustus 2023', excerpt: 'Materi lanjutan tazkiyah.' },
  ]

  const khutbah = [
    { id: 1, title: 'Khutbah Jumat: Tema 1', author: 'Jaka SKB', date: 'Juli 2023', excerpt: 'This article was written by Jake Williams from HealthlineSlam.' },
    { id: 2, title: 'Khutbah Idul Fitri', author: 'Fran Lareza', date: 'Juli 2023', excerpt: 'Khutbah singkat untuk Idul Fitri.' },
    { id: 3, title: 'Khutbah Pendidikan', author: 'King Locado', date: 'Juli 2023', excerpt: 'Khutbah bertema pendidikan dan akhlak.' },
    { id: 4, title: 'Khutbah Keluarga', author: 'Penulis A', date: 'Agustus 2023', excerpt: 'Khutbah tentang peran keluarga dalam pendidikan agama.' },
  ]

  return (
    <>
      {/* ARTIKEL ISLAMI */}
      <section style={{ background: '#fff', padding: '48px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 16, color: '#888', letterSpacing: 2, marginBottom: 8 }}>ARTIKEL ISLAMI</div>
            <div style={{ fontSize: 38, fontWeight: 700, color: '#F9A826', marginBottom: 8 }}>Kajian & Materi Dakwah</div>
          </div>

          {/* Featured Article */}
          <div style={{ display: 'flex', gap: 40, marginBottom: 60, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 28, fontWeight: 700, color: '#333', marginBottom: 16 }}>Puasa Investasi Tak Terlihat, Keuntungan Tak Terbatas</h3>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Penulis • Tanggal</div>
              <p style={{ fontSize: 15, color: '#555', lineHeight: 1.6, marginBottom: 16 }}>Puasa adalah investasi tak terlihat, istigal keuntungannya tak terbatas. Tanya agak pasti, tempa halasan ilumina. Belumannya ilunya bain ogling biaia dengan-Nya cantuk kebahagian ahir?</p>
              <p style={{ fontSize: 15, color: '#555', lineHeight: 1.6, marginBottom: 20 }}>Puasa adalah investasi tak terlihat, istigal keuntungannya tak terbatas. Tanya agak pasti, tempa halasan ilumina. Belumannya ilunya bain ogling biaia dengan-Nya cantuk kebahagian ahir?</p>
            </div>
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ width: '100%', height: 280, background: '#e0e0e0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <span style={{ color: '#bbb' }}>Gambar</span>
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>Makna Puasa sebagai Tramadol dengan Allah</div>
              <div style={{ fontSize: 12, color: '#bbb' }}>Penulis • Tgl, 2025</div>
            </div>
          </div>

          {/* Materi Tauhid with pager */}
          <div style={{ marginBottom: 60 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#333', marginBottom: 24 }}>Materi Tauhid</h3>
            <SectionPager items={tauhid} pageSize={3} />
          </div>

          {/* Materi Ekonomi Islam with pager */}
          <div style={{ marginBottom: 60 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#333', marginBottom: 24 }}>Materi Ekonomi Islam</h3>
            <SectionPager items={ekonomi} pageSize={3} />
          </div>

          {/* Materi Tazkiyah with pager */}
          <div style={{ marginBottom: 60 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#333', marginBottom: 24 }}>Materi Tazkiyah</h3>
            <SectionPager items={tazkiyah} pageSize={3} />
          </div>

          {/* Materi Khutbah with pager */}
          <div style={{ marginBottom: 60 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#333', marginBottom: 24 }}>Materi Khutbah</h3>
            <SectionPager items={khutbah} pageSize={3} />
          </div>
        </div>
      </section>
    </>
  )
}
