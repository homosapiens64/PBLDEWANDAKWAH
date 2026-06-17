ALTER TABLE users
  ADD COLUMN IF NOT EXISTS institution VARCHAR(30) NULL AFTER role;

UPDATE users
SET role = 'super_admin',
    username = 'superadmin',
    name = 'Super Admin',
    institution = NULL
WHERE role = 'admin'
  AND institution IS NULL;

ALTER TABLE education_information
  ADD COLUMN IF NOT EXISTS module VARCHAR(20) NOT NULL DEFAULT 'education' AFTER id;

UPDATE education_information
SET module = 'education'
WHERE module IS NULL OR module = '';

CREATE INDEX IF NOT EXISTS users_role_institution_idx
  ON users (role, institution);

CREATE INDEX IF NOT EXISTS education_information_module_section_status_idx
  ON education_information (module, section, status);
