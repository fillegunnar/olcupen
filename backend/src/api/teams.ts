import { Request, Response, Router } from "express";
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  countTeamDependencies,
  getPlayersByTeamId,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../db/teams.js";

const router = Router();

const POSTGRES_DUPLICATE_ERROR_CODE = "23505";

/** Parse and validate team ID from params; sends 400 and returns null on failure. */
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

/** Validate player body fields; returns parsed fields or sends 400 and returns null. */
function validatePlayerBody(
  body: any,
  res: Response,
): { name: string; number: number; age: number } | null {
  const { name, number, age } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "Player name is required" });
    return null;
  }

  if (number === undefined || number === null || !Number.isInteger(number)) {
    res
      .status(400)
      .json({ error: "Player number is required and must be an integer" });
    return null;
  }

  if (age === undefined || age === null || !Number.isInteger(age)) {
    res
      .status(400)
      .json({ error: "Player age is required and must be an integer" });
    return null;
  }

  if (age < 18) {
    res.status(400).json({ error: "Player must be older than 17" });
    return null;
  }

  return { name: name.trim(), number, age };
}

router.get("/", async (_req, res) => {
  try {
    const teams = await getAllTeams();
    res.json(teams);
  } catch (err) {
    console.error("Failed to fetch teams:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const resolved = await resolveTeam(req, res);
    if (!resolved) return;

    res.json(resolved.team);
  } catch (err) {
    console.error("Failed to fetch team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
    if (err?.code === POSTGRES_DUPLICATE_ERROR_CODE) {
      res.status(409).json({ error: "A team with that name already exists" });
      return;
    }
    console.error("Failed to create team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "Team name is required" });
    return;
  }

  try {
    const resolved = await resolveTeam(req, res);
    if (!resolved) return;

    const team = await updateTeam(resolved.id, name.trim());
    res.json(team);
  } catch (err: any) {
    if (err?.code === POSTGRES_DUPLICATE_ERROR_CODE) {
      res.status(409).json({ error: "A team with that name already exists" });
      return;
    }
    console.error("Failed to update team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const resolved = await resolveTeam(req, res);
    if (!resolved) return;

    const dependencyCount = await countTeamDependencies(resolved.id);
    if (dependencyCount > 0) {
      res.status(409).json({
        error: "Cannot remove team with existing players or scheduled matches",
      });
      return;
    }

    await deleteTeam(resolved.id);
    res.status(204).send();
  } catch (err) {
    console.error("Failed to delete team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/players", async (req, res) => {
  try {
    const resolved = await resolveTeam(req, res);
    if (!resolved) return;

    const players = await getPlayersByTeamId(resolved.id);
    res.json(players);
  } catch (err) {
    console.error("Failed to fetch players for team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/players", async (req, res) => {
  const fields = validatePlayerBody(req.body, res);
  if (!fields) return;

  try {
    const resolved = await resolveTeam(req, res);
    if (!resolved) return;

    const player = await createPlayer(
      resolved.id,
      fields.name,
      fields.number,
      fields.age,
    );
    res.status(201).json(player);
  } catch (err: any) {
    if (err?.code === POSTGRES_DUPLICATE_ERROR_CODE) {
      res.status(409).json({
        error: "A player with that number already exists on this team",
      });
      return;
    }
    console.error("Failed to add player to team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/players/:playerId", async (req, res) => {
  const playerId = parseInt(req.params.playerId, 10);
  if (isNaN(playerId)) {
    res.status(400).json({ error: "Invalid player ID" });
    return;
  }

  const fields = validatePlayerBody(req.body, res);
  if (!fields) return;

  try {
    const resolved = await resolveTeam(req, res);
    if (!resolved) return;

    const existingPlayer = await getPlayerById(playerId);
    if (!existingPlayer) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    if (existingPlayer.team_id !== resolved.id) {
      res.status(404).json({ error: "Player not found on this team" });
      return;
    }

    const player = await updatePlayer(
      playerId,
      fields.name,
      fields.number,
      fields.age,
    );
    res.json(player);
  } catch (err: any) {
    if (err?.code === POSTGRES_DUPLICATE_ERROR_CODE) {
      res.status(409).json({
        error: "A player with that number already exists on this team",
      });
      return;
    }
    console.error("Failed to update player:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id/players/:playerId", async (req, res) => {
  const playerId = parseInt(req.params.playerId, 10);
  if (isNaN(playerId)) {
    res.status(400).json({ error: "Invalid player ID" });
    return;
  }

  try {
    const resolved = await resolveTeam(req, res);
    if (!resolved) return;

    const existingPlayer = await getPlayerById(playerId);
    if (!existingPlayer) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    if (existingPlayer.team_id !== resolved.id) {
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

export default router;
