-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table Schema
CREATE TABLE IF NOT EXISTS event_categories
(
  id VARCHAR(20) PRIMARY KEY, 
  parent_id VARCHAR(20),
  "name" VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  "description" VARCHAR(500) NOT NULL DEFAULT '',
  image_url VARCHAR(255) NOT NULL DEFAULT '',
  "status" SMALLINT DEFAULT 1,
  sort_order INT DEFAULT 0,
  "level" INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  search_vector tsvector
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_event_categories_parent ON event_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_event_categories_status ON event_categories("status");
CREATE INDEX IF NOT EXISTS idx_event_categories_search_vector ON event_categories USING GIN(search_vector);

CREATE OR REPLACE FUNCTION event_categories_search_vector_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_event_categories_search_update
BEFORE INSERT OR UPDATE ON event_categories
FOR EACH ROW EXECUTE FUNCTION event_categories_search_vector_trigger();

-- 4. Functions
CREATE OR REPLACE FUNCTION search_event_categories
(
  p_id VARCHAR,
  p_parent_id VARCHAR,
  p_keyword VARCHAR
)
RETURNS SETOF event_categories
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  WITH searchResult AS
  (
    SELECT  ec.id
      FROM  event_categories AS ec
     WHERE  id <> '' AND id LIKE p_id || '%'
        OR  parent_id <> '' AND parent_id = p_id
        OR  p_keyword = '' OR ec.search_vector @@ plainto_tsquery('simple', p_keyword)
  )
  SELECT  *
    FROM  event_categories ec
   WHERE  EXISTS
          (
            SELECT 1
              FROM searchResult
             WHERE ec.id LIKE p_id || '%'
          );
END;
$$;

CREATE OR REPLACE FUNCTION get_all_active_event_categories()
RETURNS SETOF event_categories
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT  *
    FROM  event_categories AS ec
   WHERE  "status" = 1
     AND  NOT EXISTS
          (
            SELECT 1
            FROM categories parent
            WHERE parent.status = 0
              AND parent.id <> c.id
              AND LENGTH(c.id) > LENGTH(parent.id)
              AND (LENGTH(c.id) - LENGTH(parent.id)) % 3 = 0
              AND c.id LIKE parent.id || '%'
          );
END;
$$;

CREATE OR REPLACE FUNCTION get_event_category_by_id
(
  p_id VARCHAR
)
RETURNS SETOF event_categories 
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT  *
    FROM  event_categories
   WHERE  id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION is_exist_parent_category
(
  p_parent_id VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM event_categories WHERE id = p_parent_id);
END;
$$;

CREATE OR REPLACE FUNCTION is_exist_category
(
  p_id VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM event_categories WHERE id = p_id);
END;
$$;

CREATE OR REPLACE FUNCTION is_exist_category_by_slug
(
  p_slug VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM event_categories WHERE slug = p_slug);
END;
$$;

CREATE OR REPLACE FUNCTION create_event_category
(
  p_id VARCHAR,
  p_parent_id VARCHAR,
  p_name VARCHAR,
  p_slug VARCHAR,
  p_description VARCHAR,
  p_image_url VARCHAR,
  p_status SMALLINT,
  p_sort_order INT,
  p_level INT
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO event_categories
  (
    id,
    parent_id,
    "name",
    slug,
    "description",
    image_url,
    "status",
    sort_order,
    "level"
  )
  VALUES
  (
    p_id, 
    p_parent_id, 
    p_name, 
    p_slug, 
    p_description, 
    p_image_url, 
    p_status, 
    p_sort_order,
    p_level
  );
END;
$$;

CREATE OR REPLACE FUNCTION update_event_category
(
  p_id VARCHAR,
  p_name VARCHAR,
  p_slug VARCHAR,
  p_description VARCHAR,
  p_image_url VARCHAR,
  p_status SMALLINT,
  p_sort_order INT
)
RETURNS VOID 
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE  event_categories
     SET  name = p_name,
          slug = p_slug,
          "description" = p_description,
          image_url = p_image_url,
          "status" = p_status,
          sort_order = p_sort_order,
          updated_at = CURRENT_TIMESTAMP
   WHERE  id = p_id;

  IF p_status = 0 THEN
    UPDATE  event_categories
       SET  "status" = 0,
            updated_at = CURRENT_TIMESTAMP
     WHERE  id LIKE p_id || '%';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION delete_event_category
(
  p_id VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM event_categories WHERE id LIKE p_id || '%';
END;
$$;

-- migrate:down
DROP TABLE IF EXISTS event_categories CASCADE;
DROP INDEX IF EXISTS idx_event_categories_parent;
DROP INDEX IF EXISTS idx_event_categories_status;
DROP INDEX IF EXISTS idx_event_categories_search_vector;

DROP FUNCTION IF EXISTS search_event_categories;
DROP FUNCTION IF EXISTS get_all_active_event_categories;
DROP FUNCTION IF EXISTS get_event_category_by_id;
DROP FUNCTION IF EXISTS create_event_category;
DROP FUNCTION IF EXISTS update_event_category;
DROP FUNCTION IF EXISTS delete_event_category;
