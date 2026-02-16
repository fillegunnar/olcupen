import { Router } from "express";
import { getAllTeams, createTeam } from "../db/teams.js";

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

export default router;
