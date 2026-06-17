CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  institution VARCHAR(30) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_username_key (username),
  KEY users_role_institution_idx (role, institution)
);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS institution VARCHAR(30) NULL AFTER role;

INSERT INTO users (username, password, name, role, institution)
VALUES
  ('superadmin', 'scrypt$86465a422dc20d6a3989ff7c5529d6b4$405eeb3e5501efaa3826f6b828a50729792f9d02b5d2b12e57b550a46e0ab64d8d46fab7449d845dc85e6d9e7d4cf6352f9a4e78108855c0194a7777667fb6d4', 'Super Admin', 'super_admin', NULL),
  ('admin.adi', 'scrypt$093fdc2ab873b3365062777682429f3f$a01c4437d24f9f70ac9648f1cccf90d38599bd6d9344b49bba8c3d023a3880834459ff0f4e1d27b765eee3f24fc8248f7bec8a21b282ad27fadc4ff1fab6b066', 'Admin ADI', 'admin', 'adi'),
  ('admin.alkhawarizmi', 'scrypt$6cbc5b897b960b00a71c27f90fa5864b$b2c335c8f95005875ec6e09742446eb91043d8a0b6726f03b7eb5b21af94a2457ad7e714e10d417f7618367cf14ed5ceee6b4de71feb73e01b99761b19eae98d', 'Admin Al Khawarizmi', 'admin', 'al-khawarizmi'),
  ('admin.ponpes', 'scrypt$209bd4b4fb340922932c34a91d141173$d3902e30e76b85326f9e90a2f53b00ccc22f53aea341531fd611760c31e8a20dec960b3c884089b6660650954c4f0e2c7bf36fc288ad2784e2a96b751f9592c5', 'Admin Ponpes Suruh', 'admin', 'ponpes-suruh'),
  ('pengurus', 'scrypt$0ff118e065056f5342243c3844c9bba8$9f38141724af309b421700e004394ca3c3a093827a30580878ea9646df562b9c583327898100d47822693838c4e3875dfa1f91754e563a8442c8b2f1b7f00399', 'Pengurus Harian', 'pengurus', NULL),
  ('bendahara', 'scrypt$ced87e81cf41e1bb713bb989ff5b1714$ebeb34e8fab77fbbcb6f9f20d04c5eb5b7757f57e889b0138e96f6cbe7428ba52c902ca9a5d32c90900f09d37d419d0db23afb8ca6ce1b54eb407ddc37caec34', 'Bendahara', 'bendahara', NULL),
  ('ustadz', 'scrypt$4d16cddbab72f2afb10f2e89c948e844$4cb2e5837f37602d5b85d24e9d2fb05e991468e4f7f6eed65b53cf00ecb3254ab40d32337764e039994872649a0b6ac6a6d2a572587471ed850a0caca00b54bf', 'Ustadz Konsultasi', 'ustadz', NULL)
ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  name = VALUES(name),
  role = VALUES(role),
  institution = VALUES(institution);
