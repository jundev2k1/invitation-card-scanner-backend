-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Events Table
CREATE TABLE IF NOT EXISTS events
(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id VARCHAR(20) REFERENCES event_categories(id),
  title VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL DEFAULT '' ,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE,
  location_name VARCHAR(255),
  "address" VARCHAR(512) DEFAULT '',
  map_url VARCHAR(4000) DEFAULT '',
  thumbnail_url VARCHAR(255),
  settings JSONB DEFAULT '{}',
  "status" SMALLINT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  search_vector tsvector
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_events_category_id ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_search_vector ON events USING GIN(search_vector);

-- 3. Trigger for Search
CREATE OR REPLACE FUNCTION events_search_vector_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.location_name, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_events_search_update
BEFORE INSERT OR UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION events_search_vector_trigger();

-- 4. Functions
CREATE OR REPLACE FUNCTION search_events_by_criteria
(
  p_keyword VARCHAR,
  p_offset INT,
  p_limit INT
)
RETURNS TABLE
(
  id UUID,
  category_id VARCHAR,
  title VARCHAR,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  location_name VARCHAR,
  "address" VARCHAR,
  map_url VARCHAR,
  thumbnail_url VARCHAR,
  "status" SMALLINT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  total_count INT
) 
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT  e.id,
          e.category_id,
          e.title,
          e.start_at,
          e.end_at,
          e.location_name,
          e.address,
          e.map_url,
          e.thumbnail_url,
          e.status,
          e.created_at,
          e.updated_at,
          (COUNT(*) OVER ())::int AS total_count
    FROM  events AS e
   WHERE  e.status <> 0
     AND  (
            p_keyword = ''
            OR
            e.search_vector @@ plainto_tsquery('simple', p_keyword)
          )
   LIMIT  p_limit OFFSET p_offset;
END
$$;

CREATE OR REPLACE FUNCTION search_events_by_category
(
  p_category_id VARCHAR,
  p_offset INT,
  p_limit INT
)
RETURNS TABLE
(
  id UUID,
  category_id VARCHAR,
  title VARCHAR,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  location_name VARCHAR,
  "address" VARCHAR,
  map_url VARCHAR,
  thumbnail_url VARCHAR,
  "status" SMALLINT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  total_count INT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT  e.id,
          e.category_id,
          e.title,
          e.start_at,
          e.end_at,
          e.location_name,
          e.address,
          e.map_url,
          e.thumbnail_url,
          e.status,
          e.created_at,
          e.updated_at,
          (COUNT(*) OVER ())::int AS total_count
    FROM  events AS e
   WHERE  e.category_id = p_category_id
     AND  "status" <> 0
   LIMIT  p_limit OFFSET p_offset;
END
$$;

CREATE OR REPLACE FUNCTION get_event_by_id
(
  p_id UUID
)
RETURNS SETOF events
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT  *
    FROM  events
   WHERE  id = p_id
     AND  "status" <> 0;
END;
$$;

CREATE OR REPLACE FUNCTION create_event
(
  p_id UUID,
  p_category_id VARCHAR,
  p_title VARCHAR,
  p_description TEXT,
  p_start_at TIMESTAMPTZ,
  p_end_at TIMESTAMPTZ,
  p_location_name VARCHAR,
  p_address VARCHAR,
  p_map_url VARCHAR,
  p_thumbnail_url VARCHAR,
  p_settings JSONB,
  p_status SMALLINT
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO events
  (
    id,
    category_id,
    title,
    "description",
    start_at,
    end_at,
    location_name,
    "address",
    map_url,
    thumbnail_url,
    settings,
    "status",
    created_at,
    updated_at
  )
  VALUES
  (
    p_id,
    p_category_id,
    p_title,
    p_description,
    p_start_at,
    p_end_at,
    p_location_name,
    p_address,
    p_map_url,
    p_thumbnail_url,
    p_settings,
    p_status,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );
END;
$$;

CREATE OR REPLACE FUNCTION update_event
(
  p_id UUID,
  p_category_id VARCHAR,
  p_title VARCHAR,
  p_description TEXT,
  p_start_at TIMESTAMPTZ,
  p_end_at TIMESTAMPTZ,
  p_location_name VARCHAR,
  p_address VARCHAR,
  p_map_url VARCHAR,
  p_thumbnail_url VARCHAR,
  p_settings JSONB,
  p_status SMALLINT,
  p_updated_at TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE  events
     SET  category_id = p_category_id,
          title = p_title,
          "description" = p_description,
          start_at = p_start_at,
          end_at = p_end_at,
          location_name = p_location_name,
          "address" = p_address,
          map_url = p_map_url,
          thumbnail_url = p_thumbnail_url,
          settings = p_settings,
          "status" = p_status,
          updated_at = CURRENT_TIMESTAMP
   WHERE  id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_event_status
(
  p_id UUID,
  p_status SMALLINT
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE  events
     SET  "status" = p_status,
          updated_at = CURRENT_TIMESTAMP
   WHERE  id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_event
(
  p_id UUID
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE  events
     SET  "status" = 0,
          updated_at = CURRENT_TIMESTAMP
   WHERE  id = p_id;
END;
$$;

-- migrate:down
DROP TABLE IF EXISTS events CASCADE;
DROP INDEX IF EXISTS idx_events_category_id;
DROP INDEX IF EXISTS idx_events_search_vector;

DROP FUNCTION IF EXISTS events_search_vector_trigger;
DROP TRIGGER IF EXISTS trg_events_search_update;

DROP FUNCTION IF EXISTS search_events_by_keyword;
DROP FUNCTION IF EXISTS search_events_by_category;
DROP FUNCTION IF EXISTS get_event_by_id;
DROP FUNCTION IF EXISTS create_event;
DROP FUNCTION IF EXISTS update_event;
DROP FUNCTION IF EXISTS update_event_status;
DROP FUNCTION IF EXISTS delete_event;
