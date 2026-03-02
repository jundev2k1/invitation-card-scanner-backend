-- migrate:up
CREATE OR REPLACE FUNCTION get_general_statistics(
  p_start_date TIMESTAMP,
  p_end_date TIMESTAMP
)
RETURNS TABLE (
  -- User statistics output
  total_user_count BIGINT,
  unapproved_user_count BIGINT,
  active_user_count BIGINT,
  new_users_in_period BIGINT,
  user_growth_rate_pct NUMERIC,
  
  -- Event statistics output
  total_events_all_time BIGINT,
  period_published_events BIGINT,
  period_completed_events BIGINT,
  event_published_growth_pct NUMERIC,
  
  -- Card statistics output
  total_cards_all_time BIGINT,
  total_used_cards_all_time BIGINT,
  period_active_cards BIGINT,
  period_used_cards BIGINT,
  card_active_growth_pct NUMERIC
) 
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  /* 
    USER MODULE: Calculates user acquisition and status distribution.
    Scans the 'users' table once using aggregate filters.
  */
  WITH user_module AS (
    SELECT  COUNT(*) AS total_user_count,
            COUNT(*) FILTER (WHERE u.status = 1) AS unapproved_user_count,
            COUNT(*) FILTER (WHERE u.status != 0) AS active_user_count,
            -- New users registered between X and Y
            COUNT(*) FILTER (WHERE u.created_at BETWEEN p_start_date AND p_end_date) AS new_users_in_period,
            -- Baseline: Total users existing before date X
            COUNT(*) FILTER (WHERE u.created_at < p_start_date) AS users_before_period
      FROM  users u
  ),

  /* 
    EVENT MODULE: Statistics based on event status and 'start_at' time.
    Excludes DELETED events (status = 0).
  */
  event_module AS (
    SELECT  COUNT(*) AS total_all_time,
            -- Events that started within the specific period
            COUNT(*) FILTER (WHERE status = 2 AND e.start_at BETWEEN p_start_date AND p_end_date) AS period_published,
            COUNT(*) FILTER (WHERE status = 3 AND e.start_at BETWEEN p_start_date AND p_end_date) AS period_completed,
            -- Baseline: Published events that started before date X
            COUNT(*) FILTER (WHERE status = 2 AND e.start_at < p_start_date) AS before_published
      FROM  events e
     WHERE  e.status != 0
  ),

  /* 
    CARD MODULE: Calculates card inventory and usage.
    Joined with 'events' to filter by event start time (start_at).
  */
  card_module AS (
    SELECT  COUNT(ec.id) AS total_cards,
            COUNT(ec.id) FILTER (WHERE ec.is_used = true) AS total_used,
            -- Active cards belonging to events starting in the period
            COUNT(ec.id) FILTER (WHERE ec.status = 1 AND e.start_at BETWEEN p_start_date AND p_end_date) AS period_active,
            -- Used cards belonging to events starting in the period
            COUNT(ec.id) FILTER (WHERE ec.is_used = true AND e.start_at BETWEEN p_start_date AND p_end_date) AS period_used,
            -- Baseline: Active cards before date X
            COUNT(ec.id) FILTER (WHERE ec.status = 1 AND e.start_at < p_start_date) AS before_active
      FROM  event_cards ec
            INNER JOIN events e ON ec.event_id = e.id
     WHERE  e.status != 0
  )

  /* 
    FINAL MERGE: Combines all modules using CROSS JOIN.
    Calculates growth percentages and handles 'division by zero' cases.
  */
  SELECT  -- User Results
          u.total_user_count, 
          u.unapproved_user_count, 
          u.active_user_count, 
          u.new_users_in_period,
          CASE WHEN u.users_before_period = 0 THEN 100.0 
            ELSE ROUND((u.new_users_in_period::NUMERIC / u.users_before_period) * 100, 2) END AS user_growth_rate_pct,

          -- Event Results
          e.total_all_time, 
          e.period_published, 
          e.period_completed,
          CASE WHEN e.before_published = 0 THEN 100.0 
            ELSE ROUND((e.period_published::NUMERIC / e.before_published) * 100, 2) END AS event_published_growth_pct,

          -- Card Results
          c.total_cards, 
          c.total_used, 
          c.period_active, 
          c.period_used,
          CASE WHEN c.before_active = 0 THEN 100.0 
            ELSE ROUND((c.period_active::NUMERIC / c.before_active) * 100, 2) END AS card_active_growth_pct

    FROM  user_module u
          CROSS JOIN event_module e
          CROSS JOIN card_module c;
END;
$$;

-- migrate:down
DROP FUNCTION IF EXISTS get_statistics_by_period;