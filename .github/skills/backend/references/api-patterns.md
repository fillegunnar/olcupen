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
