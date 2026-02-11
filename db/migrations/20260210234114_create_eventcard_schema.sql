-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: event_cards
CREATE TABLE IF NOT EXISTS event_cards
(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  access_token UUID DEFAULT uuid_generate_v4() UNIQUE,
  is_used BOOLEAN DEFAULT FALSE,
  first_scanned_at TIMESTAMP WITH TIME ZONE,
  "status" SMALLINT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_cards_token ON event_cards(access_token);
CREATE INDEX IF NOT EXISTS idx_event_cards_event ON event_cards(event_id);

-- Trigger for Search
CREATE OR REPLACE FUNCTION event_cards_search_vector_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := setweight(to_tsvector('simple', coalesce(NEW.guest_name, '')), 'A');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_event_cards_search_update
BEFORE INSERT OR UPDATE
ON event_cards
FOR EACH ROW EXECUTE PROCEDURE event_cards_search_vector_trigger();

-- Function: get_event_cards_by_event_id
CREATE OR REPLACE FUNCTION get_event_cards_by_event_id
(
  p_event_id UUID
)
RETURNS SETOF event_cards
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT  *
    FROM  event_cards
   WHERE  event_id = p_event_id;
END;
$$;

-- Function: create_event_card
CREATE OR REPLACE FUNCTION create_event_card
(
  p_event_id UUID,
  p_guest_name VARCHAR,
  p_access_token UUID
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO  event_cards
  (
    event_id,
    guest_name,
    access_token
  )
  VALUES
  (
    p_event_id,
    p_guest_name,
    p_access_token
  );
END;
$$;

-- Function: update_event_card
CREATE OR REPLACE FUNCTION update_event_card
(
  p_id UUID,
  p_event_id UUID,
  p_guest_name VARCHAR,
  p_access_token UUID
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE  event_cards
     SET  event_id = p_event_id,
          guest_name = p_guest_name,
          access_token = p_access_token
   WHERE  id = p_id;
END;
$$;

-- Function: delete_event_card
CREATE OR REPLACE FUNCTION delete_event_card
(
  p_id UUID
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM event_cards WHERE id = p_id;
END;
$$;

-- migrate:down
DROP TABLE IF EXISTS event_cards CASCADE;
DROP INDEX IF EXISTS idx_event_cards_token;
DROP INDEX IF EXISTS idx_event_cards_event;

DROP FUNCTION IF EXISTS get_event_cards_by_event_id;
DROP FUNCTION IF EXISTS create_event_card;
DROP FUNCTION IF EXISTS update_event_card;
DROP FUNCTION IF EXISTS delete_event_card;

DROP TRIGGER IF EXISTS trg_event_cards_search_update;
DROP FUNCTION IF EXISTS event_cards_search_vector_trigger;
