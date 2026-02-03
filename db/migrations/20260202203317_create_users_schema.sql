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

CREATE OR REPLACE PROCEDURE search_users_by_criteria(
    p_keyword VARCHAR,
    p_limit INT,
    p_offset INT,
    OUT o_id UUID,
    OUT o_username VARCHAR,
    OUT o_email VARCHAR,
    OUT o_nickname VARCHAR,
    OUT o_sex CHAR(1),
    OUT o_bio TEXT,
    OUT o_avatar_url VARCHAR(255),
    OUT o_is_active BOOLEAN,
    OUT o_created_at TIMESTAMP WITH TIME ZONE,
    OUT o_updated_at TIMESTAMP WITH TIME ZONE,
    OUT o_total_count INT)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT  u.id, u.username, u.email, u.nickname, u.sex, u.bio, u.avatar_url, u.is_active, u.created_at, u.updated_at, COUNT(*) OVER() AS total_count
      INTO  o_id, o_username, o_email, o_nickname, o_sex, o_bio, o_avatar_url, o_is_active, o_created_at, o_updated_at, o_total_count
      FROM  users u
     WHERE  (u.username ILIKE '%' || p_keyword || '%' OR u.email ILIKE '%' || p_keyword || '%')
       AND  u.is_active = TRUE
    ORDER BY  u.created_at DESC
     LIMIT  p_limit OFFSET p_offset;
END;
$$;

CREATE OR REPLACE PROCEDURE get_user_by_email(
    p_email VARCHAR,
    OUT o_id UUID,
    OUT o_username VARCHAR,
    OUT o_email VARCHAR,
    OUT o_nickname VARCHAR,
    OUT o_password_hash VARCHAR,
    OUT o_sex CHAR,
    OUT o_bio VARCHAR,
    OUT o_avatar_url VARCHAR,
    OUT o_is_active BOOLEAN,
    OUT o_created_at TIMESTAMP WITH TIME ZONE,
    OUT o_updated_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT  id, username, email, nickname, password_hash, sex, bio, avatar_url, is_active, created_at, updated_at
      INTO  o_id, o_username, o_email, o_nickname, o_password_hash, o_sex, o_bio, o_avatar_url, o_is_active, o_created_at, o_updated_at
      FROM  users
     WHERE  email = p_email;
END;
$$;

CREATE OR REPLACE PROCEDURE get_user_by_username(
    p_username VARCHAR,
    OUT o_id UUID,
    OUT o_username VARCHAR,
    OUT o_email VARCHAR,
    OUT o_nickname VARCHAR,
    OUT o_password_hash VARCHAR,
    OUT o_sex CHAR,
    OUT o_bio VARCHAR,
    OUT o_avatar_url VARCHAR,
    OUT o_is_active BOOLEAN,
    OUT o_created_at TIMESTAMP WITH TIME ZONE,
    OUT o_updated_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT  id, username, email, nickname, password_hash, sex, bio, avatar_url, is_active, created_at, updated_at
      INTO  o_id, o_username, o_email, o_nickname, o_password_hash, o_sex, o_bio, o_avatar_url, o_is_active, o_created_at, o_updated_at
      FROM  users
     WHERE  username = p_username;
END;
$$;

CREATE OR REPLACE PROCEDURE get_user_by_id(
    p_id UUID,
    OUT o_id UUID,
    OUT o_username VARCHAR,
    OUT o_email VARCHAR,
    OUT o_nickname VARCHAR,
    OUT o_sex CHAR,
    OUT o_bio VARCHAR,
    OUT o_avatar_url VARCHAR,
    OUT o_is_active BOOLEAN,
    OUT o_created_at TIMESTAMP WITH TIME ZONE,
    OUT o_updated_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT  id, username, email, nickname, sex, bio, avatar_url, is_active, created_at, updated_at
      INTO  o_id, o_username, o_email, o_nickname, o_sex, o_bio, o_avatar_url, o_is_active, o_created_at, o_updated_at
      FROM  users
     WHERE  id = p_id;
END;
$$;

CREATE OR REPLACE PROCEDURE check_user_exists_by_username(
    p_username VARCHAR,
    OUT o_exists BOOLEAN)
LANGUAGE plpgsql
AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM users WHERE username = p_username) INTO v_exists;
    o_exists := v_exists;
END;
$$;

CREATE OR REPLACE PROCEDURE create_user(
    p_id UUID,
    p_username VARCHAR,
    p_email VARCHAR,
    p_nickname VARCHAR,
    p_password_hash VARCHAR,
    p_sex CHAR,
    p_bio VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO users (username, email, nickname, password_hash, sex, bio, created_at, updated_at)
    VALUES (p_username, p_email, p_nickname, p_password_hash, p_sex, p_bio, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
END;
$$;

CREATE OR REPLACE PROCEDURE update_user(
    p_id UUID,
    p_nickname VARCHAR,
    p_bio VARCHAR,
    p_avatar_url VARCHAR,
    p_is_active BOOLEAN)
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

DROP PROCEDURE IF EXISTS create_user;
DROP PROCEDURE IF EXISTS update_user;

DROP PROCEDURE IF EXISTS get_user_by_id;
DROP PROCEDURE IF EXISTS get_user_by_username;
DROP PROCEDURE IF EXISTS get_user_by_email;
DROP PROCEDURE IF EXISTS search_users_by_criteria;
DROP PROCEDURE IF EXISTS check_user_exists_by_username;
