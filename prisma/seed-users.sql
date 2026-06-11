CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_username_key (username)
);

INSERT INTO users (username, password, name, role)
VALUES
  ('admin', 'admin123', 'Ahmad Hasan', 'admin'),
  ('pengurus', 'pengurus123', 'Pengurus Harian', 'pengurus'),
  ('bendahara', 'bendahara123', 'Bendahara', 'bendahara'),
  ('ustadz', 'ustadz123', 'Ustadz Konsultasi', 'ustadz')
ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  name = VALUES(name),
  role = VALUES(role);
