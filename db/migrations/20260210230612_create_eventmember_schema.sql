-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS event_members
(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_role VARCHAR(50) DEFAULT '',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_members_event_id ON event_members(event_id);
CREATE INDEX IF NOT EXISTS idx_event_members_user_id ON event_members(user_id);

CREATE OR REPLACE FUNCTION get_event_members_by_event_id
(
  p_event_id UUID,
  p_keyword VARCHAR,
  p_limit INT,
  p_offset INT
)
RETURNS TABLE (
  id UUID,
  event_id UUID,
  user_id UUID,
  nickname VARCHAR,
  email VARCHAR,
  phone_number VARCHAR,
  profile_image VARCHAR,
  assigned_role VARCHAR,
  assigned_at TIMESTAMP WITH TIME ZONE,
  total_count INT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT  em.id,
          em.event_id,
          em.user_id,
          u.nickname,
          u.email,
          u.phone_number,
          u.avatar_url,
          em.assigned_role,
          em.assigned_at,
          (COUNT(*) OVER())::int AS total_count
    FROM  event_members em
    JOIN  users u ON
          (
            em.user_id = u.id
            AND
            u.role <> 'ROOT'
            AND
            u.status = 'ACTIVE'
          )
   WHERE  event_id = p_event_id
     AND  (
            p_keyword IS NULL
            OR
            p_keyword = ''
            OR
            u.search_vector @@ websearch_to_tsquery('simple', p_keyword)
            OR
            em.assigned_role ILIKE '%' || p_keyword || '%'
            OR
            em.user_id LIKE p_keyword || '%'
          )
   LIMIT  p_limit OFFSET p_offset;
END;
$$;

CREATE OR REPLACE FUNCTION is_exist_event_member
(
  p_event_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM event_members
    WHERE event_id = p_event_id
      AND user_id = p_user_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION create_event_member
(
  p_event_id UUID,
  p_user_id UUID,
  p_assigned_role VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO  event_members
  (
    event_id,
    user_id,
    assigned_role
  )
  VALUES
  (
    p_event_id,
    p_user_id,
    p_assigned_role
  );
END;
$$;

CREATE OR REPLACE FUNCTION update_event_member
(
  p_id UUID,
  p_assigned_role VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE  event_members
     SET  assigned_role = p_assigned_role
   WHERE  id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_event_member
(
  p_id UUID
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM event_members WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION remove_all_event_members_in_event
(
  p_event_id UUID
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM event_members WHERE event_id = p_event_id;
END;
$$;

-- migrate:down
DROP TABLE IF EXISTS event_members CASCADE;
DROP INDEX IF EXISTS idx_event_members_event_id;
DROP INDEX IF EXISTS idx_event_members_user_id;

DROP FUNCTION IF EXISTS get_event_members_by_event_id;
DROP FUNCTION IF EXISTS create_event_member;
DROP FUNCTION IF EXISTS update_event_member;
DROP FUNCTION IF EXISTS delete_event_member;
DROP FUNCTION IF EXISTS remove_all_event_members_in_event;
