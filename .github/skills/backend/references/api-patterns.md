# API Route Patterns

## Router Setup

```typescript
import { Router } from "express";
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../db/teams.js";

const router = Router();
export default router;
```

## GET (list)

```typescript
router.get("/", async (_req, res) => {
  try {
    const teams = await getAllTeams();
    res.json(teams);
  } catch (err) {
    console.error("Failed to fetch teams:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## GET (by ID)

```typescript
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid team ID" });
    return;
  }
  try {
    const team = await getTeamById(id);
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }
    res.json(team);
  } catch (err) {
    console.error("Failed to fetch team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## POST (create)

```typescript
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "Team name is required" });
    return;
  }
  try {
    const team = await createTeam(name.trim());
    res.status(201).json(team);
  } catch (err: any) {
    if (err?.code === "23505") {
      res.status(409).json({ error: "A team with that name already exists" });
      return;
    }
    console.error("Failed to create team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## PUT (update)

```typescript
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid team ID" });
    return;
  }
  const { name } = req.body;
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "Team name is required" });
    return;
  }
  try {
    const team = await updateTeam(id, name.trim());
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }
    res.json(team);
  } catch (err: any) {
    if (err?.code === "23505") {
      res.status(409).json({ error: "A team with that name already exists" });
      return;
    }
    console.error("Failed to update team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## DELETE (with dependency check)

```typescript
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid team ID" });
    return;
  }
  try {
    const team = await getTeamById(id);
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }
    const deps = await countTeamDependencies(id);
    if (deps > 0) {
      res
        .status(409)
        .json({ error: "Cannot delete team with existing players or matches" });
      return;
    }
    await deleteTeam(id);
    res.status(204).send();
  } catch (err) {
    console.error("Failed to delete team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## DELETE (child resource with ownership check)

For nested resources (e.g., players under teams), verify the child belongs to the parent before deleting:

```typescript
router.delete("/:id/players/:playerId", async (req, res) => {
  const playerId = parseInt(req.params.playerId, 10);
  if (isNaN(playerId)) {
    res.status(400).json({ error: "Invalid player ID" });
    return;
  }

  try {
    // resolveTeam validates the parent ID and checks existence
    const resolved = await resolveTeam(req, res);
    if (!resolved) return;

    const player = await getPlayerById(playerId);
    if (!player) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    // Ownership check: player must belong to this team
    if (player.team_id !== resolved.id) {
      res.status(404).json({ error: "Player not found on this team" });
      return;
    }

    await deletePlayer(playerId);
    res.status(204).send();
  } catch (err) {
    console.error("Failed to delete player:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## Nested Resource Helpers

When a router has nested child resources, extract common validation into helpers:

```typescript
/** Parse and validate parent ID; sends 400/404 and returns null on failure. */
async function resolveTeam(req: Request<{ id: string }>, res: Response) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid team ID" });
    return null;
  }
  const team = await getTeamById(id);
  if (!team) {
    res.status(404).json({ error: "Team not found" });
    return null;
  }
  return { id, team };
}

/** Validate child resource body fields; sends 400 and returns null on failure. */
function validatePlayerBody(
  body: any,
  res: Response,
): { name: string; number: number; age: number } | null {
  // ... field checks, return null + send 400 on failure
  return { name: name.trim(), number, age };
}
```

Child resource routes always: resolve the parent first, then look up the child, then verify ownership (`child.parent_id === resolved.id`).

## Mounting in app.ts

```typescript
import teamsRouter from "./api/teams.js";
app.use("/api/teams", teamsRouter);
```

## Rules

- Always validate `req.params` and `req.body` before DB calls
- `Number(req.params.id)` + `isNaN()` check for numeric IDs
- Trim string inputs: `name.trim()`
- Use early `return` after sending responses — no `else` chains
- Log with `console.error("Failed to <action>:", err)` before 500 responses
- PostgreSQL error code `23505` → 409 Conflict for unique constraint violations
- `204` with `.send()` (no body) for successful deletes
- `201` for successful creates
