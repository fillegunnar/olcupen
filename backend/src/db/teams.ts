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

export async function countTeamDependencies(id: number): Promise<number> {
  let dependencyCount = 0;

  // Check for players (if players table exists)
  try {
    const playersResult = await pool.query<{ count: number }>(
      "SELECT COUNT(*) as count FROM players WHERE team_id = $1",
      [id],
    );
    dependencyCount += parseInt(playersResult.rows[0].count as any, 10) || 0;
  } catch {
    // Table doesn't exist yet, ignore
  }

  // Check for scheduled matches (if matches table exists)
  try {
    const matchesResult = await pool.query<{ count: number }>(
      "SELECT COUNT(*) as count FROM matches WHERE team_a_id = $1 OR team_b_id = $1",
      [id],
    );
    dependencyCount += parseInt(matchesResult.rows[0].count as any, 10) || 0;
  } catch {
    // Table doesn't exist yet, ignore
  }

  return dependencyCount;
}

export async function deleteTeam(id: number): Promise<boolean> {
  const result = await pool.query<{ id: number }>(
    "DELETE FROM teams WHERE id = $1 RETURNING id",
    [id],
  );

  return result.rows.length > 0;
}
