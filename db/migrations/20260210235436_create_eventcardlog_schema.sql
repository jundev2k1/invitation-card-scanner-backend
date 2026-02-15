-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: event_card_logs
CREATE TABLE IF NOT EXISTS event_card_logs
(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES event_cards(id) ON DELETE CASCADE,
  scanned_by UUID NOT NULL REFERENCES users(id),
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_event_card_logs_card ON event_card_logs(card_id);
CREATE INDEX IF NOT EXISTS idx_event_card_logs_scanned_by ON event_card_logs(scanned_by);
CREATE INDEX IF NOT EXISTS idx_event_card_logs_scanned_at ON event_card_logs(scanned_at);

-- Function
CREATE OR REPLACE FUNCTION get_event_card_logs_by_criteria
(
  p_card_id UUID,
  p_scanned_by UUID,
  p_scanned_from TIMESTAMPTZ,
  p_scanned_to TIMESTAMPTZ,
  p_offset INT,
  p_limit INT
)
RETURNS TABLE
(
  id UUID,
  card_id UUID,
  scanned_by UUID,
  scanned_by_nickname VARCHAR,
  scanned_by_email VARCHAR,
  scanned_by_phone VARCHAR,
  scanned_by_status SMALLINT,
  scanned_at TIMESTAMPTZ,
  notes TEXT,
  total_count INT
) 
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT  ecl.id,
          ecl.card_id,
          ecl.scanned_by,
          u.nickname,
          u.email,
          u.phone_number,
          u.status,
          ecl.scanned_at,
          ecl.notes,
          COUNT(*) OVER () AS total_count
    FROM  event_card_logs ecl
    JOIN  users u ON u.id = scanned_by
   WHERE  (
            p_card_id IS NULL
            OR
            card_id = p_card_id
          )
     AND  (
            p_scanned_by IS NULL
            OR
            scanned_by = p_scanned_by
          )
     AND  (
            p_scanned_from IS NULL
            OR
            p_scanned_from <= scanned_at
          )
     AND  (
            p_scanned_to IS NULL
            OR
            p_scanned_to >= scanned_at
          )
  ORDER BY scanned_at DESC
   LIMIT  p_limit
  OFFSET  p_offset;
END;
$$;

CREATE OR REPLACE FUNCTION create_event_card_log
(
  p_id UUID,
  p_card_id UUID,
  p_scanned_by UUID,
  p_notes TEXT,
  p_scanned_at TIMESTAMPTZ
)
RETURNS UUID
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO event_card_logs
  (
    id,
    card_id,
    scanned_by,
    notes,
    scanned_at
  )
  VALUES
  (
    p_id,
    p_card_id,
    p_scanned_by,
    p_notes,
    p_scanned_at
  );
END;
$$;

CREATE OR REPLACE FUNCTION update_event_card_log
(
  p_id UUID,
  p_notes TEXT
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE  event_card_logs
     SET  notes = p_notes
   WHERE  id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_event_card_log
(
  p_id UUID
)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM event_card_logs WHERE id = p_id;
END;
$$;

-- migrate:down
DROP TABLE IF EXISTS event_card_logs CASCADE;

DROP INDEX IF EXISTS idx_event_card_logs_card;
DROP INDEX IF EXISTS idx_event_card_logs_scanned_by;
DROP INDEX IF EXISTS idx_event_card_logs_scanned_at;

DROP FUNCTION IF EXISTS get_event_card_logs_by_criteria;
DROP FUNCTION IF EXISTS create_event_card_log;
DROP FUNCTION IF EXISTS update_event_card_log;
DROP FUNCTION IF EXISTS delete_event_card_log;
