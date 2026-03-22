import cors from "cors";
import express from "express";
import matchesRouter from "./api/matches.js";
import teamsRouter from "./api/teams.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/teams", teamsRouter);
app.use("/api/matches", matchesRouter);

export default app;
