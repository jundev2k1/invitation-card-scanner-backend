-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  nickname VARCHAR(100) NOT NULL DEFAULT '',
  password_hash VARCHAR(255) NOT NULL,
  sex CHAR(1) CHECK (sex IN ('M', 'F', 'O')) DEFAULT 'O',
  bio TEXT DEFAULT '',
  avatar_url VARCHAR(255) DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

CREATE OR REPLACE FUNCTION search_users_by_criteria(
  p_keyword VARCHAR,
  p_limit INT,
  p_offset INT
)
RETURNS TABLE (
  id UUID, username VARCHAR,
  email VARCHAR,
  nickname VARCHAR, 
  sex CHAR(1),
  bio TEXT,
  avatar_url VARCHAR,
  is_active BOOLEAN, 
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  total_count BIGINT
) 
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT  u.id,
          u.username,
          u.email,
          u.nickname,
          u.sex,
          u.bio,
          u.avatar_url,
          u.is_active,
          u.created_at,
          u.updated_at,
          COUNT(*) OVER() AS total_count
    FROM  users u
   WHERE  (u.username ILIKE '%' || p_keyword || '%' OR u.email ILIKE '%' || p_keyword || '%')
     AND  u.is_active = TRUE
  ORDER BY u.created_at DESC
   LIMIT  p_limit OFFSET p_offset;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_by_email(p_email VARCHAR)
RETURNS SETOF users
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY

  SELECT  *
    FROM  users
   WHERE  email = p_email;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_by_username(p_username VARCHAR)
RETURNS SETOF users
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY

  SELECT  *
    FROM  users
   WHERE  username = p_username;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_by_id(p_id UUID)
RETURNS SETOF users
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY

  SELECT  *
    FROM  users
   WHERE  id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION check_user_exists_by_username(p_username VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM users WHERE username = p_username);
END;
$$;

CREATE OR REPLACE FUNCTION create_user(
  p_id UUID,
  p_username VARCHAR,
  p_email VARCHAR,
  p_nickname VARCHAR,
  p_password_hash VARCHAR,
  p_sex CHAR,
  p_bio VARCHAR)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO users (
    id,
    username,
    email,
    nickname,
    password_hash,
    sex,
    bio,
    created_at,
    updated_at)
  VALUES (
    p_id,
    p_username,
    p_email,
    p_nickname,
    p_password_hash,
    p_sex,
    p_bio,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP);
END;
$$;

CREATE OR REPLACE FUNCTION update_user(
  p_id UUID,
  p_nickname VARCHAR,
  p_bio VARCHAR,
  p_avatar_url VARCHAR,
  p_is_active BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE users
  SET nickname = p_nickname,
    bio = p_bio,
    avatar_url = p_avatar_url,
    is_active = p_is_active,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = p_id;
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
DROP FUNCTION IF EXISTS check_user_exists_by_username;
