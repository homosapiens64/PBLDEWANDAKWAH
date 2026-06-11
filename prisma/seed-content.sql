INSERT INTO content_items
  (module, section, title, summary, body, image_url, status, author_role, author_name, published_at, created_at, updated_at)
SELECT
  'website', 'berita', 'Program Dakwah Semarang Terus Bertumbuh',
  'Informasi kegiatan dan layanan terbaru Dewan Da''wah Kota Semarang.',
  'Dewan Da''wah Kota Semarang terus mengembangkan kegiatan dakwah, pendidikan, dan layanan sosial yang dapat diikuti masyarakat.',
  NULL, 'published', 'admin', 'Ahmad Hasan', NOW(), NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM content_items WHERE module = 'website' AND section = 'berita'
);

INSERT INTO content_items
  (module, section, title, summary, body, image_url, status, author_role, author_name, published_at, created_at, updated_at)
SELECT
  'kajian', 'artikel-kajian', 'Menjaga Keikhlasan dalam Berdakwah',
  'Catatan singkat tentang niat, adab, dan konsistensi dalam menyampaikan kebaikan.',
  'Dakwah dimulai dari niat yang lurus, ilmu yang benar, dan akhlak yang baik. Setiap muslim perlu menjaga keikhlasan agar pesan kebaikan memberi manfaat.',
  NULL, 'published', 'ustadz', 'Ustadz Konsultasi', NOW(), NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM content_items WHERE module = 'kajian' AND section = 'artikel-kajian'
);

INSERT INTO finance_transactions
  (type, date, category, detail, note, amount, author_role, author_name, created_at, updated_at)
SELECT 'pemasukan', '2025-05-20', 'Donasi', 'Jemaah Masjid Al-Amin', 'Donasi bulanan', 2500000, 'bendahara', 'Bendahara', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM finance_transactions);

INSERT INTO finance_transactions
  (type, date, category, detail, note, amount, author_role, author_name, created_at, updated_at)
SELECT 'pengeluaran', '2025-05-19', 'Konsumsi', 'Peserta Kajian Ahad', 'Snack dan air mineral', 450000, 'bendahara', 'Bendahara', NOW(), NOW()
WHERE (SELECT COUNT(*) FROM finance_transactions) = 1;
