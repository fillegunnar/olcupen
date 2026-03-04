import request from "supertest";
import { expect, it } from "vitest";
import app from "../app.js";
import pool from "../db/pool.js";
import {
  describeIfDatabase,
  setupIntegrationDatabase,
} from "./utils/integration-db.js";

const teamName = "Kung FC";
const newTeamName = "Kung Fu FC";

describeIfDatabase("Teams API integration tests (happy path)", () => {
  setupIntegrationDatabase(["teams", "players"]);

  it("creates and fetches teams with persisted data", async () => {
    const createRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });

    expect(createRes.status).toBe(201);
    expect(createRes.body.id).toBe(1);
    expect(createRes.body.name).toBe(teamName);
    expect(createRes.body.created_at).toBeTruthy();

    const listRes = await request(app).get("/api/teams");

    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].id).toBe(1);
    expect(listRes.body[0].name).toBe(teamName);
  });

  it("updates an existing team", async () => {
    const createRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });

    const updateRes = await request(app)
      .put(`/api/teams/${createRes.body.id}`)
      .send({ name: newTeamName });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe(newTeamName);

    const getRes = await request(app).get(`/api/teams/${createRes.body.id}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe(newTeamName);
  });

  it("fetches players for a team", async () => {
    const teamRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });
    const teamId = teamRes.body.id;

    // Insert players directly into database
    await pool.query(
      "INSERT INTO players (name, number, age, team_id) VALUES ($1, $2, $3, $4)",
      ["John Doe", 10, 25, teamId],
    );
    await pool.query(
      "INSERT INTO players (name, number, age, team_id) VALUES ($1, $2, $3, $4)",
      ["Jane Smith", 7, 24, teamId],
    );

    const playersRes = await request(app).get(`/api/teams/${teamId}/players`);

    expect(playersRes.status).toBe(200);
    expect(playersRes.body).toHaveLength(2);
    expect(playersRes.body[0].name).toBe("Jane Smith"); // Ordered by number (7 < 10)
    expect(playersRes.body[1].name).toBe("John Doe");
  });

  it("deletes a team without dependencies", async () => {
    const createRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });

    const deleteRes = await request(app).delete(
      `/api/teams/${createRes.body.id}`,
    );

    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/teams/${createRes.body.id}`);

    expect(getRes.status).toBe(404);
    expect(getRes.body).toEqual({ error: "Team not found" });
  });
});
