import { Router } from "express";
import { getAllTeams } from "../db/teams.js";

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

export default router;
