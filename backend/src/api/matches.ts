import { Router } from "express";
import { getAllMatches } from "../db/matches.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const matches = await getAllMatches();
    res.json(matches);
  } catch (err) {
    console.error("Failed to fetch matches:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
