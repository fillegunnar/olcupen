import pool from "./pool.js";

export interface Team {
  id: number;
  name: string;
  created_at: string;
}

export interface Player {
  id: number;
  name: string;
  number: number;
  age: number;
  team_id: number;
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

export async function getPlayersByTeamId(teamId: number): Promise<Player[]> {
  const result = await pool.query<Player>(
    "SELECT id, name, number, age, team_id, created_at FROM players WHERE team_id = $1 ORDER BY number",
    [teamId],
  );
  return result.rows;
}

export async function getPlayerById(id: number): Promise<Player | null> {
  const result = await pool.query<Player>(
    "SELECT id, name, number, age, team_id, created_at FROM players WHERE id = $1",
    [id],
  );
  return result.rows[0] || null;
}

export async function createPlayer(
  teamId: number,
  name: string,
  number: number,
  age: number,
): Promise<Player> {
  const result = await pool.query<Player>(
    "INSERT INTO players (team_id, name, number, age) VALUES ($1, $2, $3, $4) RETURNING id, name, number, age, team_id, created_at",
    [teamId, name, number, age],
  );
  return result.rows[0];
}

export async function updatePlayer(
  id: number,
  name: string,
  number: number,
  age: number,
): Promise<Player | null> {
  const result = await pool.query<Player>(
    "UPDATE players SET name = $1, number = $2, age = $3 WHERE id = $4 RETURNING id, name, number, age, team_id, created_at",
    [name, number, age, id],
  );
  return result.rows[0] || null;
}
