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

  it("adds a player to a team", async () => {
    const teamRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });
    const teamId = teamRes.body.id;

    const playerRes = await request(app)
      .post(`/api/teams/${teamId}/players`)
      .send({ name: "John Doe", number: 10, age: 25 });

    expect(playerRes.status).toBe(201);
    expect(playerRes.body.name).toBe("John Doe");
    expect(playerRes.body.number).toBe(10);
    expect(playerRes.body.age).toBe(25);
    expect(playerRes.body.team_id).toBe(teamId);
    expect(playerRes.body.id).toBeTruthy();
    expect(playerRes.body.created_at).toBeTruthy();

    const rosterRes = await request(app).get(`/api/teams/${teamId}/players`);
    expect(rosterRes.status).toBe(200);
    expect(rosterRes.body).toHaveLength(1);
    expect(rosterRes.body[0].name).toBe("John Doe");
  });

  it("returns 404 when adding a player to a non-existent team", async () => {
    const res = await request(app)
      .post("/api/teams/99999/players")
      .send({ name: "John Doe", number: 10, age: 25 });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Team not found" });
  });

  it("returns 400 when adding a player without a name", async () => {
    const teamRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });

    const res = await request(app)
      .post(`/api/teams/${teamRes.body.id}/players`)
      .send({ number: 10, age: 25 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Player name is required" });
  });

  it("returns 400 when adding a player under 18", async () => {
    const teamRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });

    const res = await request(app)
      .post(`/api/teams/${teamRes.body.id}/players`)
      .send({ name: "Young Player", number: 10, age: 17 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Player must be older than 17" });
  });

  it("returns 409 when adding a player with a duplicate number on same team", async () => {
    const teamRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });
    const teamId = teamRes.body.id;

    await request(app)
      .post(`/api/teams/${teamId}/players`)
      .send({ name: "John Doe", number: 10, age: 25 });

    const res = await request(app)
      .post(`/api/teams/${teamId}/players`)
      .send({ name: "Jane Smith", number: 10, age: 22 });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      error: "A player with that number already exists on this team",
    });
  });

  it("updates a player's details", async () => {
    const teamRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });
    const teamId = teamRes.body.id;

    const playerRes = await request(app)
      .post(`/api/teams/${teamId}/players`)
      .send({ name: "John Doe", number: 10, age: 25 });
    const playerId = playerRes.body.id;

    const updateRes = await request(app)
      .put(`/api/teams/${teamId}/players/${playerId}`)
      .send({ name: "John Smith", number: 7, age: 26 });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe("John Smith");
    expect(updateRes.body.number).toBe(7);
    expect(updateRes.body.age).toBe(26);
    expect(updateRes.body.team_id).toBe(teamId);
    expect(updateRes.body.id).toBe(playerId);

    const rosterRes = await request(app).get(`/api/teams/${teamId}/players`);
    expect(rosterRes.status).toBe(200);
    expect(rosterRes.body).toHaveLength(1);
    expect(rosterRes.body[0].name).toBe("John Smith");
    expect(rosterRes.body[0].number).toBe(7);
  });

  it("returns 404 when updating a non-existent player", async () => {
    const teamRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });
    const teamId = teamRes.body.id;

    const res = await request(app)
      .put(`/api/teams/${teamId}/players/99999`)
      .send({ name: "John Smith", number: 7, age: 26 });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Player not found" });
  });

  it("returns 404 when updating a player on wrong team", async () => {
    const team1Res = await request(app)
      .post("/api/teams")
      .send({ name: teamName });
    const team2Res = await request(app)
      .post("/api/teams")
      .send({ name: "Other FC" });

    const playerRes = await request(app)
      .post(`/api/teams/${team1Res.body.id}/players`)
      .send({ name: "John Doe", number: 10, age: 25 });

    const res = await request(app)
      .put(`/api/teams/${team2Res.body.id}/players/${playerRes.body.id}`)
      .send({ name: "John Smith", number: 7, age: 26 });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Player not found on this team" });
  });

  it("returns 400 when updating a player with empty name", async () => {
    const teamRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });
    const teamId = teamRes.body.id;

    const playerRes = await request(app)
      .post(`/api/teams/${teamId}/players`)
      .send({ name: "John Doe", number: 10, age: 25 });

    const res = await request(app)
      .put(`/api/teams/${teamId}/players/${playerRes.body.id}`)
      .send({ name: "", number: 7, age: 26 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Player name is required" });
  });

  it("returns 409 when updating player number to duplicate on same team", async () => {
    const teamRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });
    const teamId = teamRes.body.id;

    await request(app)
      .post(`/api/teams/${teamId}/players`)
      .send({ name: "John Doe", number: 10, age: 25 });

    const player2Res = await request(app)
      .post(`/api/teams/${teamId}/players`)
      .send({ name: "Jane Smith", number: 7, age: 22 });

    const res = await request(app)
      .put(`/api/teams/${teamId}/players/${player2Res.body.id}`)
      .send({ name: "Jane Smith", number: 10, age: 22 });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      error: "A player with that number already exists on this team",
    });
  });
});
