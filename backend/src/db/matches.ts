import pool from "./pool.js";

export interface Match {
  id: number;
  team_a_id: number;
  team_a_name: string;
  team_b_id: number;
  team_b_name: string;
  match_date: string;
  group_name: string | null;
  location: string | null;
  created_at: string;
}

export async function getAllMatches(): Promise<Match[]> {
  const result = await pool.query<Match>(
    `SELECT m.id, m.team_a_id, ta.name AS team_a_name, m.team_b_id, tb.name AS team_b_name,
            m.match_date, m.group_name, m.location, m.created_at
     FROM matches m
     JOIN teams ta ON ta.id = m.team_a_id
     JOIN teams tb ON tb.id = m.team_b_id
     ORDER BY m.match_date ASC`,
  );
  return result.rows;
}
