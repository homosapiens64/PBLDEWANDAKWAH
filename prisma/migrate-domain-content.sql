INSERT INTO news
  (id, section, title, summary, body, image_url, tags, status, author_role, author_name, published_at, created_at, updated_at)
SELECT
  id, section, title, summary, body, image_url, tags, status, author_role, author_name, published_at, created_at, updated_at
FROM content_items
WHERE module = 'website'
ON DUPLICATE KEY UPDATE
  section = VALUES(section),
  title = VALUES(title),
  summary = VALUES(summary),
  body = VALUES(body),
  image_url = VALUES(image_url),
  tags = VALUES(tags),
  status = VALUES(status),
  author_role = VALUES(author_role),
  author_name = VALUES(author_name),
  published_at = VALUES(published_at),
  updated_at = VALUES(updated_at);

INSERT INTO study_articles
  (id, section, title, summary, body, image_url, tags, status, author_role, author_name, published_at, created_at, updated_at)
SELECT
  id, section, title, summary, body, image_url, tags, status, author_role, author_name, published_at, created_at, updated_at
FROM content_items
WHERE module = 'kajian'
ON DUPLICATE KEY UPDATE
  section = VALUES(section),
  title = VALUES(title),
  summary = VALUES(summary),
  body = VALUES(body),
  image_url = VALUES(image_url),
  tags = VALUES(tags),
  status = VALUES(status),
  author_role = VALUES(author_role),
  author_name = VALUES(author_name),
  published_at = VALUES(published_at),
  updated_at = VALUES(updated_at);

INSERT INTO education_information
  (id, module, section, title, summary, body, image_url, tags, status, author_role, author_name, published_at, created_at, updated_at)
SELECT
  id, module, section, title, summary, body, image_url, tags, status, author_role, author_name, published_at, created_at, updated_at
FROM content_items
WHERE module IN ('education', 'pmb')
ON DUPLICATE KEY UPDATE
  module = VALUES(module),
  section = VALUES(section),
  title = VALUES(title),
  summary = VALUES(summary),
  body = VALUES(body),
  image_url = VALUES(image_url),
  tags = VALUES(tags),
  status = VALUES(status),
  author_role = VALUES(author_role),
  author_name = VALUES(author_name),
  published_at = VALUES(published_at),
  updated_at = VALUES(updated_at);

DELETE FROM content_items
WHERE module IN ('website', 'kajian', 'education', 'pmb');
