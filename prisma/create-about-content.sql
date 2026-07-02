CREATE TABLE IF NOT EXISTS content_items (
  id INT NOT NULL AUTO_INCREMENT,
  module VARCHAR(30) NOT NULL,
  section VARCHAR(50) NOT NULL,
  title VARCHAR(180) NOT NULL,
  summary TEXT NULL,
  body TEXT NOT NULL,
  image_url LONGTEXT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'published',
  author_role VARCHAR(20) NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  published_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  tags VARCHAR(300) NULL,
  PRIMARY KEY (id),
  INDEX content_items_module_section_status_idx (module, section, status)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO content_items
  (module, section, title, summary, body, image_url, status, author_role, author_name, published_at, created_at, updated_at, tags)
SELECT
  'tentang-kami',
  'profil-sejarah',
  'Sejarah Organisasi',
  'Sejarah Organisasi',
  'Dewan Da''wah Islamiyah Indonesia didirikan pada tahun 1967 oleh Mohammad Natsir bersama para ulama dan tokoh dakwah. Organisasi ini lahir untuk memperkuat pembinaan umat, menjaga akidah, dan menghadirkan dakwah yang menjawab kebutuhan masyarakat.',
  NULL,
  'published',
  'super_admin',
  'Super Admin',
  NOW(3),
  NOW(3),
  NOW(3),
  'tentang-kami,profil'
WHERE NOT EXISTS (
  SELECT 1 FROM content_items WHERE module = 'tentang-kami' AND section = 'profil-sejarah'
);

INSERT INTO content_items
  (module, section, title, summary, body, image_url, status, author_role, author_name, published_at, created_at, updated_at, tags)
SELECT
  'tentang-kami',
  'profil-visi-misi',
  'Visi & Misi',
  'Visi & Misi',
  CONCAT(
    'Visi: Terwujudnya masyarakat Kota Semarang yang bertakwa, berakhlak mulia, beradab, dan mandiri melalui dakwah Islam yang berdampak.',
    CHAR(10), CHAR(10),
    'Misi:', CHAR(10),
    '1. Menguatkan dakwah berlandaskan Al-Quran dan As-Sunnah.', CHAR(10),
    '2. Mengembangkan pendidikan Islam berkualitas.', CHAR(10),
    '3. Mendorong kemandirian ekonomi umat.', CHAR(10),
    '4. Memanfaatkan teknologi sebagai sarana dakwah.', CHAR(10),
    '5. Membangun jejaring dan kemitraan strategis.'
  ),
  NULL,
  'published',
  'super_admin',
  'Super Admin',
  NOW(3),
  NOW(3),
  NOW(3),
  'tentang-kami,profil'
WHERE NOT EXISTS (
  SELECT 1 FROM content_items WHERE module = 'tentang-kami' AND section = 'profil-visi-misi'
);

INSERT INTO content_items
  (module, section, title, summary, body, image_url, status, author_role, author_name, published_at, created_at, updated_at, tags)
SELECT
  'tentang-kami',
  'profil-cabang-semarang',
  'Cabang Kota Semarang',
  'Cabang Kota Semarang',
  'Dewan Da''wah Kota Semarang berkomitmen mendukung pembinaan umat di tingkat daerah melalui program dakwah, pendidikan, sosial, ekonomi, serta pemanfaatan teknologi yang berbasis kebutuhan nyata masyarakat.',
  NULL,
  'published',
  'super_admin',
  'Super Admin',
  NOW(3),
  NOW(3),
  NOW(3),
  'tentang-kami,profil'
WHERE NOT EXISTS (
  SELECT 1 FROM content_items WHERE module = 'tentang-kami' AND section = 'profil-cabang-semarang'
);

INSERT INTO content_items
  (module, section, title, summary, body, image_url, status, author_role, author_name, published_at, created_at, updated_at, tags)
SELECT
  'tentang-kami',
  'profil-kontak-lokasi',
  'Kontak & Lokasi',
  'Kontak & Lokasi',
  CONCAT(
    'Kesekretariatan Dewan Da''wah Kota Semarang', CHAR(10),
    'Jl. Wirijan, Semarang Tengah', CHAR(10),
    'Email: info@dewandakwahsemarang.com', CHAR(10),
    'Telepon: (629) 555-0129'
  ),
  NULL,
  'published',
  'super_admin',
  'Super Admin',
  NOW(3),
  NOW(3),
  NOW(3),
  'tentang-kami,profil'
WHERE NOT EXISTS (
  SELECT 1 FROM content_items WHERE module = 'tentang-kami' AND section = 'profil-kontak-lokasi'
);

INSERT INTO content_items
  (module, section, title, summary, body, image_url, status, author_role, author_name, published_at, created_at, updated_at, tags)
SELECT
  'tentang-kami',
  'struktur-unit',
  'Dewan Penasehat',
  '{"unitType":"Dewan Penasehat","order":"1","leader":"Dr. Ir. Achmad Syafi''i, M.Pd.I.","members":"Drs. Muhammad Asrori, M.Si., M.Pd.I.\nDrs. Anwar Cholil"}',
  'Dewan Penasehat Organisasi',
  NULL,
  'published',
  'super_admin',
  'Super Admin',
  NOW(3),
  NOW(3),
  NOW(3),
  'tentang-kami,struktur'
WHERE NOT EXISTS (
  SELECT 1 FROM content_items WHERE module = 'tentang-kami' AND section = 'struktur-unit' AND title = 'Dewan Penasehat'
);

INSERT INTO content_items
  (module, section, title, summary, body, image_url, status, author_role, author_name, published_at, created_at, updated_at, tags)
SELECT
  'tentang-kami',
  'struktur-unit',
  'Pimpinan Harian',
  '{"unitType":"Pimpinan Harian","order":"2","leader":"Prof. Ir. Yusuf Dewantoro Herlambang, S.T., M.T., Ph.D.","members":"Sucipto, S.E., Ak\nSyahid, S.T., M.Eng\nSeptiantar Tebe Nursaputro, S.T., M.Tr.T."}',
  'Pimpinan harian Dewan Da''wah Kota Semarang',
  NULL,
  'published',
  'super_admin',
  'Super Admin',
  NOW(3),
  NOW(3),
  NOW(3),
  'tentang-kami,struktur'
WHERE NOT EXISTS (
  SELECT 1 FROM content_items WHERE module = 'tentang-kami' AND section = 'struktur-unit' AND title = 'Pimpinan Harian'
);

INSERT INTO content_items
  (module, section, title, summary, body, image_url, status, author_role, author_name, published_at, created_at, updated_at, tags)
SELECT
  'tentang-kami',
  'program-kerja',
  'Pembinaan Da''i',
  '{"status":"aktif","startDate":"","endDate":""}',
  'Pelatihan berkala, mentoring lapangan, dan penguatan dakwah digital.',
  NULL,
  'published',
  'super_admin',
  'Super Admin',
  NOW(3),
  NOW(3),
  NOW(3),
  'tentang-kami,program'
WHERE NOT EXISTS (
  SELECT 1 FROM content_items WHERE module = 'tentang-kami' AND section = 'program-kerja' AND title = 'Pembinaan Da''i'
);

INSERT INTO content_items
  (module, section, title, summary, body, image_url, status, author_role, author_name, published_at, created_at, updated_at, tags)
SELECT
  'tentang-kami',
  'program-kerja',
  'Pendidikan Umat',
  '{"status":"aktif","startDate":"","endDate":""}',
  'Kajian rutin, beasiswa santri, dan program literasi Islam.',
  NULL,
  'published',
  'super_admin',
  'Super Admin',
  NOW(3),
  NOW(3),
  NOW(3),
  'tentang-kami,program'
WHERE NOT EXISTS (
  SELECT 1 FROM content_items WHERE module = 'tentang-kami' AND section = 'program-kerja' AND title = 'Pendidikan Umat'
);

INSERT INTO content_items
  (module, section, title, summary, body, image_url, status, author_role, author_name, published_at, created_at, updated_at, tags)
SELECT
  'tentang-kami',
  'program-kerja',
  'Sosial Kemanusiaan',
  '{"status":"aktif","startDate":"","endDate":""}',
  'Bakti sosial, layanan dhuafa, dan penguatan relawan daerah.',
  NULL,
  'published',
  'super_admin',
  'Super Admin',
  NOW(3),
  NOW(3),
  NOW(3),
  'tentang-kami,program'
WHERE NOT EXISTS (
  SELECT 1 FROM content_items WHERE module = 'tentang-kami' AND section = 'program-kerja' AND title = 'Sosial Kemanusiaan'
);
