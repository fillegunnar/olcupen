import cors from "cors";
import express from "express";
import teamsRouter from "./api/teams.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/teams", teamsRouter);

export default app;
