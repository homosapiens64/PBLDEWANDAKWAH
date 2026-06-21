CREATE TABLE IF NOT EXISTS pmb_applicant_accounts (
  id INT NOT NULL AUTO_INCREMENT,
  institution VARCHAR(30) NOT NULL,
  institution_id VARCHAR(30) NOT NULL,
  institution_name VARCHAR(120) NOT NULL,
  institution_short VARCHAR(40) NOT NULL,
  full_name VARCHAR(140) NOT NULL,
  nisn VARCHAR(40) NOT NULL,
  email VARCHAR(120) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY pmb_applicant_accounts_institution_nisn_key (institution, nisn),
  UNIQUE KEY pmb_applicant_accounts_nisn_email_key (nisn, email),
  KEY pmb_applicant_accounts_institution_email_idx (institution, email)
);
