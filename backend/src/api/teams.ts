import { Router } from "express";
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  countTeamDependencies,
  getPlayersByTeamId,
  createPlayer,
} from "../db/teams.js";

const router = Router();

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
  const id = parseInt(req.params.id, 10);

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
    const postgresDuplicateErrorCode = "23505";
    if (err?.code === postgresDuplicateErrorCode) {
      res.status(409).json({ error: "A team with that name already exists" });
      return;
    }
    console.error("Failed to create team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid team ID" });
    return;
  }

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "Team name is required" });
    return;
  }

  try {
    const existingTeam = await getTeamById(id);
    if (!existingTeam) {
      res.status(404).json({ error: "Team not found" });
      return;
    }

    const team = await updateTeam(id, name.trim());
    res.json(team);
  } catch (err: any) {
    const postgresDuplicateErrorCode = "23505";
    if (err?.code === postgresDuplicateErrorCode) {
      res.status(409).json({ error: "A team with that name already exists" });
      return;
    }
    console.error("Failed to update team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid team ID" });
    return;
  }

  try {
    const existingTeam = await getTeamById(id);
    if (!existingTeam) {
      res.status(404).json({ error: "Team not found" });
      return;
    }

    const dependencyCount = await countTeamDependencies(id);
    if (dependencyCount > 0) {
      res.status(409).json({
        error: "Cannot remove team with existing players or scheduled matches",
      });
      return;
    }

    await deleteTeam(id);
    res.status(204).send();
  } catch (err) {
    console.error("Failed to delete team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/players", async (req, res) => {
  const id = parseInt(req.params.id, 10);

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

    const players = await getPlayersByTeamId(id);
    res.json(players);
  } catch (err) {
    console.error("Failed to fetch players for team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/players", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid team ID" });
    return;
  }

  const { name, number, age } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "Player name is required" });
    return;
  }

  if (number === undefined || number === null || !Number.isInteger(number)) {
    res.status(400).json({ error: "Player number is required and must be an integer" });
    return;
  }

  if (age === undefined || age === null || !Number.isInteger(age)) {
    res.status(400).json({ error: "Player age is required and must be an integer" });
    return;
  }

  if (age < 18) {
    res.status(400).json({ error: "Player must be older than 17" });
    return;
  }

  try {
    const team = await getTeamById(id);
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }

    const player = await createPlayer(id, name.trim(), number, age);
    res.status(201).json(player);
  } catch (err: any) {
    const postgresDuplicateErrorCode = "23505";
    if (err?.code === postgresDuplicateErrorCode) {
      res.status(409).json({ error: "A player with that number already exists on this team" });
      return;
    }
    console.error("Failed to add player to team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
