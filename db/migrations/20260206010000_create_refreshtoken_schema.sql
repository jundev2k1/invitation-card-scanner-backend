-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  jwt_id UUID NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  replaced_by_token_id UUID REFERENCES refresh_tokens (id),
  ip_address TEXT,
  user_agent TEXT,
  device_name TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens (token_hash);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);

CREATE OR REPLACE FUNCTION get_refresh_tokens_by_user_id_with_pagination(
  p_user_id UUID,
  p_offset INT,
  p_limit INT
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  token_hash TEXT,
  jwt_id UUID,
  is_revoked BOOLEAN,
  expires_at TIMESTAMPTZ,
  replaced_by_token_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  device_name TEXT,
  created_at TIMESTAMPTZ,
  total_count INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT  *, (COUNT(*) OVER())::int AS total_count
    FROM  refresh_tokens
   WHERE  user_id = p_user_id
  ORDER BY created_at DESC
   LIMIT  p_limit OFFSET p_offset;
END;
$$;

CREATE OR REPLACE FUNCTION get_refresh_tokens_by_user_id(p_user_id UUID)
RETURNS SETOF refresh_tokens
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT  *
    FROM  refresh_tokens
   WHERE  user_id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_refresh_token_by_token_hash(p_token_hash TEXT)
RETURNS SETOF refresh_tokens
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT  *
    FROM  refresh_tokens
   WHERE  token_hash = p_token_hash;
END;
$$;

CREATE OR REPLACE FUNCTION get_active_refresh_tokens_by_user_id(p_id UUID)
RETURNS SETOF refresh_tokens
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT  *
    FROM  refresh_tokens
   WHERE  user_id = p_id
     AND  is_revoked = FALSE
     AND  expires_at > CURRENT_TIMESTAMP;
END;
$$;

CREATE OR REPLACE FUNCTION create_refresh_token(
  p_id UUID,
  p_user_id UUID,
  p_token_hash TEXT,
  p_jwt_id UUID,
  p_is_revoked BOOLEAN,
  p_expires_at TIMESTAMPTZ,
  p_replaced_by_token_id UUID,
  p_ip_address TEXT,
  p_user_agent TEXT,
  p_device_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO refresh_tokens (
    id,
    user_id,
    token_hash,
    jwt_id,
    is_revoked,
    expires_at,
    replaced_by_token_id,
    ip_address,
    user_agent,
    device_name,
    created_at)
  VALUES (
    p_id,
    p_user_id,
    p_token_hash,
    p_jwt_id,
    p_is_revoked,
    p_expires_at,
    p_replaced_by_token_id,
    p_ip_address,
    p_user_agent,
    p_device_name,
    CURRENT_TIMESTAMP);
END;
$$;

CREATE OR REPLACE FUNCTION replace_refresh_token(
  p_id UUID,
  p_replaced_by_token_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE  refresh_tokens
     SET  replaced_by_token_id = p_replaced_by_token_id,
          is_revoked = TRUE
   WHERE  id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION revoke_refresh_token(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE  refresh_tokens
     SET  is_revoked = TRUE
   WHERE  id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION mark_all_expired_refresh_tokens_as_revoked()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE  refresh_tokens
     SET  is_revoked = TRUE
   WHERE  expires_at < CURRENT_TIMESTAMP;
END;
$$;

-- migrate:down
DROP TABLE IF EXISTS refresh_tokens CASCADE;

DROP INDEX IF EXISTS idx_refresh_tokens_token_hash;
DROP INDEX IF EXISTS idx_refresh_tokens_user_id;

DROP FUNCTION IF EXISTS get_refresh_tokens_by_user_id_with_pagination;
DROP FUNCTION IF EXISTS get_refresh_tokens_by_user_id;
DROP FUNCTION IF EXISTS get_refresh_token_by_token_hash;
DROP FUNCTION IF EXISTS get_active_refresh_tokens_by_user_id;
DROP FUNCTION IF EXISTS create_refresh_token;
DROP FUNCTION IF EXISTS replace_refresh_token;
DROP FUNCTION IF EXISTS revoke_refresh_token;
DROP FUNCTION IF EXISTS mark_all_expired_refresh_tokens_as_revoked;
