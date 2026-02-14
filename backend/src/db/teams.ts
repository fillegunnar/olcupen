import pool from "./pool.js";

export interface Team {
  id: number;
  name: string;
  created_at: string;
}

export async function getAllTeams(): Promise<Team[]> {
    const result = await pool.query<Team>("SELECT id, name, created_at FROM teams ORDER BY name");
  return result.rows;
}
