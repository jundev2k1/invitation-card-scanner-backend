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
  p_event_id UUID
)
RETURNS SETOF event_members
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT  *
    FROM  event_members
   WHERE  event_id = p_event_id;
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

-- migrate:down
DROP TABLE IF EXISTS event_members CASCADE;
DROP INDEX IF EXISTS idx_event_members_event_id;
DROP INDEX IF EXISTS idx_event_members_user_id;

DROP FUNCTION IF EXISTS get_event_members_by_event_id;
DROP FUNCTION IF EXISTS create_event_member;
DROP FUNCTION IF EXISTS update_event_member;
DROP FUNCTION IF EXISTS delete_event_member;
