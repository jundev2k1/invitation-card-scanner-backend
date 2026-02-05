-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users("status");

CREATE OR REPLACE FUNCTION search_users_by_criteria(
  p_keyword VARCHAR,
  p_offset INT,
  p_limit INT
)
RETURNS TABLE (
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
            p_keyword IS NULL
            OR p_keyword = ''
            OR (u.username ILIKE '%' || p_keyword || '%'
            OR u.email ILIKE '%' || p_keyword || '%')
          )
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

CREATE OR REPLACE FUNCTION check_user_exists_by_email(p_email VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM users WHERE email = p_email);
END;
$$;

CREATE OR REPLACE FUNCTION create_user(
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
  p_role VARCHAR)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO users (
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
    updated_at)
  VALUES (
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
    CURRENT_TIMESTAMP);
END;
$$;

CREATE OR REPLACE FUNCTION update_user(
  p_id UUID,
  p_email VARCHAR,
  p_nickname VARCHAR,
  p_phone_number VARCHAR,
  p_password_hash VARCHAR,
  p_sex CHAR,
  p_bio VARCHAR,
  p_avatar_url VARCHAR,
  p_status SMALLINT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
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
DROP FUNCTION IF EXISTS check_user_exists_by_username;
DROP FUNCTION IF EXISTS check_user_exists_by_email;