CREATE TABLE IF NOT EXISTS certified_ustadz (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  specialization VARCHAR(180) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  INDEX certified_ustadz_is_active_sort_order_idx (is_active, sort_order)
);

INSERT INTO certified_ustadz
  (name, specialization, sort_order, is_active, created_at, updated_at)
SELECT 'Dr. Ahmad Hadi, Lc', 'Spesialis fikih dan pembinaan keluarga', 1, TRUE, NOW(3), NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM certified_ustadz WHERE name = 'Dr. Ahmad Hadi, Lc');

INSERT INTO certified_ustadz
  (name, specialization, sort_order, is_active, created_at, updated_at)
SELECT 'Dr. Saiful Rahman, M.A', 'Spesialis fikih dan pembinaan keluarga', 2, TRUE, NOW(3), NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM certified_ustadz WHERE name = 'Dr. Saiful Rahman, M.A');

INSERT INTO certified_ustadz
  (name, specialization, sort_order, is_active, created_at, updated_at)
SELECT 'Dr. Fathur Rahman, Lc', 'Spesialis fikih dan pembinaan keluarga', 3, TRUE, NOW(3), NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM certified_ustadz WHERE name = 'Dr. Fathur Rahman, Lc');

INSERT INTO certified_ustadz
  (name, specialization, sort_order, is_active, created_at, updated_at)
SELECT 'Ust. Hasan Sabil, M.Ag', 'Spesialis fikih dan pembinaan keluarga', 4, TRUE, NOW(3), NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM certified_ustadz WHERE name = 'Ust. Hasan Sabil, M.Ag');
