# DB Query Patterns

## Interface Definition

```typescript
interface Team {
  id: number;
  name: string;
  created_at: Date;
}
```

- Define interfaces in the same file as the queries
- Match column names exactly (snake_case)

## Query Functions

```typescript
import pool from "./pool.js";

// List all
export async function getAllTeams(): Promise<Team[]> {
  const result = await pool.query<Team>(
    "SELECT * FROM teams ORDER BY name ASC",
  );
  return result.rows;
}

// Get by ID (nullable)
export async function getTeamById(id: number): Promise<Team | null> {
  const result = await pool.query<Team>("SELECT * FROM teams WHERE id = $1", [
    id,
  ]);
  return result.rows[0] || null;
}

// Create (return created row)
export async function createTeam(name: string): Promise<Team> {
  const result = await pool.query<Team>(
    "INSERT INTO teams (name) VALUES ($1) RETURNING *",
    [name],
  );
  return result.rows[0];
}

// Update (return updated row, nullable)
export async function updateTeam(
  id: number,
  name: string,
): Promise<Team | null> {
  const result = await pool.query<Team>(
    "UPDATE teams SET name = $1 WHERE id = $2 RETURNING *",
    [name, id],
  );
  return result.rows[0] || null;
}

// Delete (return boolean)
export async function deleteTeam(id: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM teams WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}
```

## Dependency Counting (for safe deletes)

```typescript
export async function countTeamDependencies(teamId: number): Promise<number> {
  let count = 0;
  const playerResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*) as count FROM players WHERE team_id = $1",
    [teamId],
  );
  count += parseInt(playerResult.rows[0].count, 10);

  // Gracefully handle tables that don't exist yet
  try {
    const matchResult = await pool.query<{ count: string }>(
      "SELECT COUNT(*) as count FROM matches WHERE home_team_id = $1 OR away_team_id = $1",
      [teamId],
    );
    count += parseInt(matchResult.rows[0].count, 10);
  } catch {
    // Table doesn't exist yet — no dependencies
  }
  return count;
}
```

## Rules

- Always use parameterized queries (`$1`, `$2`, ...) — never string interpolation
- Use `RETURNING *` for INSERT/UPDATE to get the created/updated row
- Import pool from `./pool.js` (with .js extension for NodeNext resolution)
- Use `pool.query<T>()` generic for type-safe results
- Return `null` for single-item queries when not found
- Use `ORDER BY` for list queries to ensure deterministic ordering
