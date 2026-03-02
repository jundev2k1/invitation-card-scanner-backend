-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users
(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  phone_number VARCHAR(50) NOT NULL DEFAULT '',
  nickname VARCHAR(100) NOT NULL DEFAULT '',
  password_hash VARCHAR(255) NOT NULL,
  sex CHAR(1) CHECK (sex IN ('M', 'F', 'O')) DEFAULT 'O',
  bio VARCHAR(4000) NOT NULL DEFAULT '',
  avatar_url VARCHAR(255) NOT NULL DEFAULT '',
  "status" SMALLINT DEFAULT 0,
  "role" VARCHAR(20) CHECK ("role" IN ('ROOT', 'ADMIN', 'STAFF')) NOT NULL DEFAULT 'STAFF',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  search_vector tsvector
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users("status");
CREATE INDEX IF NOT EXISTS idx_search_vector ON users USING gin (search_vector);

-- Search Vector
CREATE OR REPLACE FUNCTION users_search_vector_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.username, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.nickname, '')), 'B') ||
    setweight(to_tsvector('simple', replace(coalesce(NEW.email, ''), '@', ' ')), 'C') ||
    setweight(to_tsvector('simple', regexp_replace(coalesce(NEW.phone_number, ''), '\D', '', 'g')), 'D');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_search_update ON users;
CREATE TRIGGER trg_users_search_update
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION users_search_vector_trigger();

-- Function
CREATE OR REPLACE FUNCTION search_users_by_criteria
(
  p_keyword VARCHAR,
  p_statuses SMALLINT[],
  p_order_by VARCHAR,
  p_order_direction VARCHAR,
  p_offset INT,
  p_limit INT
)
RETURNS TABLE
(
  id UUID,
  username VARCHAR,
  email VARCHAR,
  nickname VARCHAR,
  phone_number VARCHAR,
  sex CHAR(1),
  avatar_url VARCHAR,
  "status" SMALLINT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  total_count INT
) 
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT  u.id,
          u.username,
          u.email,
          u.nickname,
          u.phone_number,
          u.sex,
          u.avatar_url,
          u.status,
          u.created_at,
          u.updated_at,
          (COUNT(*) OVER())::int AS total_count
    FROM  users u
   WHERE  u.role <> 'ROOT'
     AND  (
            cardinality(p_statuses) = 0
            OR
            u.status = ANY(p_statuses)
          )
     AND  (
            p_keyword IS NULL
            OR
            p_keyword = ''
            OR 
            u.search_vector @@ websearch_to_tsquery('simple', p_keyword)
          )
  ORDER BY  CASE WHEN p_order_by = 'nickname' AND p_order_direction = 'desc' THEN u.nickname END DESC,
            CASE WHEN p_order_by = 'nickname' AND p_order_direction = 'asc' THEN u.nickname END ASC,
            CASE WHEN p_order_by = 'created_at' AND p_order_direction = 'desc' THEN u.created_at END DESC,
            CASE WHEN p_order_by = 'created_at' AND p_order_direction = 'asc' THEN u.created_at END ASC,
            CASE WHEN p_order_by = 'status' AND p_order_direction = 'desc' THEN u.status END DESC,
            CASE WHEN p_order_by = 'status' AND p_order_direction = 'asc' THEN u.status END ASC,
            CASE WHEN p_order_by NOT IN ('nickname', 'created_at', 'status') THEN u.created_at END DESC
   LIMIT  p_limit OFFSET p_offset;
END;
$$;

CREATE OR REPLACE FUNCTION search_users_suggestions
(
  p_keyword VARCHAR,
  p_roles VARCHAR[],
  p_limit INT
)
RETURNS TABLE
(
  id UUID,
  email VARCHAR,
  nickname VARCHAR,
  phone_number VARCHAR,
  avatar_url VARCHAR
) 
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT  u.id,
          u.email,
          u.nickname,
          u.phone_number,
          u.avatar_url
    FROM  users u
   WHERE  u.role <> 'ROOT'
     AND  u.status = 2
     AND  (
            cardinality(p_roles) = 0
            OR
            u.role = ANY(p_roles)
          )
     AND  (
            p_keyword IS NULL
            OR
            p_keyword = ''
            OR 
            u.search_vector @@ websearch_to_tsquery('simple', p_keyword)
          )
   LIMIT  p_limit;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_status_count()
RETURNS TABLE
(
  "status" SMALLINT,
  "count" INT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY

  SELECT  users.status, count(*)::INT AS "count"
    FROM  users
  GROUP BY users.status;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_by_email
(
  p_email VARCHAR
)
RETURNS SETOF users
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY

  SELECT  *
    FROM  users
   WHERE  email = p_email;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_by_username
(
  p_username VARCHAR
)
RETURNS SETOF users
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY

  SELECT  *
    FROM  users
   WHERE  username = p_username;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_by_id
(
  p_id UUID
)
RETURNS SETOF users
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY

  SELECT  *
    FROM  users
   WHERE  id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION check_user_exists_by_username
(
  p_username VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM users WHERE username = p_username);
END;
$$;

CREATE OR REPLACE FUNCTION check_user_exists_by_email
(
  p_email VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM users WHERE email = p_email);
END;
$$;

CREATE OR REPLACE FUNCTION create_user
(
  p_id UUID,
  p_username VARCHAR,
  p_email VARCHAR,
  p_nickname VARCHAR,
  p_phone_number VARCHAR,
  p_password_hash VARCHAR,
  p_sex CHAR,
  p_bio VARCHAR,
  p_avatar_url VARCHAR,
  p_status SMALLINT,
  p_role VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO users
  (
    id,
    username,
    email,
    nickname,
    phone_number,
    password_hash,
    sex,
    bio,
    avatar_url,
    "status",
    "role",
    created_at,
    updated_at
  )
  VALUES
  (
    p_id,
    p_username,
    p_email,
    p_nickname,
    p_phone_number,
    p_password_hash,
    p_sex,
    p_bio,
    p_avatar_url,
    p_status,
    p_role,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );
END;
$$;

CREATE OR REPLACE FUNCTION update_user
(
  p_id UUID,
  p_email VARCHAR,
  p_nickname VARCHAR,
  p_phone_number VARCHAR,
  p_password_hash VARCHAR,
  p_sex CHAR,
  p_bio VARCHAR,
  p_avatar_url VARCHAR,
  p_status SMALLINT
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE  users
     SET  nickname = p_nickname,
          phone_number = p_phone_number,
          password_hash = p_password_hash,
          sex = p_sex,
          bio = p_bio,
          avatar_url = p_avatar_url,
          "status" = p_status,
          updated_at = CURRENT_TIMESTAMP
   WHERE  id = p_id;
END;
$$;

-- migrate:down
DROP TABLE IF EXISTS users CASCADE;

DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_is_active;

DROP FUNCTION IF EXISTS create_user;
DROP FUNCTION IF EXISTS update_user;

DROP FUNCTION IF EXISTS get_user_by_id;
DROP FUNCTION IF EXISTS get_user_by_username;
DROP FUNCTION IF EXISTS get_user_by_email;
DROP FUNCTION IF EXISTS search_users_by_criteria;
DROP FUNCTION IF EXISTS search_users_suggestions;
DROP FUNCTION IF EXISTS get_user_status_count;
DROP FUNCTION IF EXISTS check_user_exists_by_username;
DROP FUNCTION IF EXISTS check_user_exists_by_email;

DROP TRIGGER IF EXISTS trg_users_search_update ON users;
