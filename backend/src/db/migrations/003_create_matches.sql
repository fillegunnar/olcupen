CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  team_a_id INTEGER NOT NULL REFERENCES teams(id),
  team_b_id INTEGER NOT NULL REFERENCES teams(id),
  match_date TIMESTAMPTZ NOT NULL,
  group_name TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
