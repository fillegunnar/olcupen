import pool from "./pool.js";

export interface Team {
  id: number;
  name: string;
  created_at: string;
}

export async function getAllTeams(): Promise<Team[]> {
  const result = await pool.query<Team>(
    "SELECT id, name, created_at FROM teams ORDER BY name",
  );
  return result.rows;
}

export async function getTeamById(id: number): Promise<Team | null> {
  const result = await pool.query<Team>("SELECT * FROM teams WHERE id = $1", [
    id,
  ]);

  return result.rows[0] || null;
}

export async function createTeam(name: string): Promise<Team> {
  const result = await pool.query<Team>(
    "INSERT INTO teams (name) VALUES ($1) RETURNING id, name, created_at",
    [name],
  );

  return result.rows[0];
}

export async function updateTeam(id: number, name: string): Promise<Team> {
  const result = await pool.query<Team>(
    "UPDATE teams SET name = $1 WHERE id = $2 RETURNING id, name, created_at",
    [name, id],
  );

  return result.rows[0];
}
