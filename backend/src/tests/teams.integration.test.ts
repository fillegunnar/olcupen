import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../app.js";
import { runMigrations } from "../db/migrate.js";
import pool from "../db/pool.js";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const describeIfDatabase = hasDatabaseUrl ? describe.sequential : describe.skip;

const teamName = "Kung FC";
const newTeamName = "Kung Fu FC";
describeIfDatabase("Teams API integration tests (real database)", () => {
  beforeAll(async () => {
    await runMigrations();
  });

  beforeEach(async () => {
    await pool.query("TRUNCATE TABLE teams RESTART IDENTITY CASCADE");
  });

  afterAll(async () => {
    await pool.end();
  });

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

  it("returns 409 when creating duplicate team names", async () => {
    await request(app).post("/api/teams").send({ name: teamName });

    const duplicateRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body).toEqual({
      error: "A team with that name already exists",
    });
  });

  it("updates an existing team and returns persisted value", async () => {
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

  it("deletes an existing team and removes it from database", async () => {
    const createRes = await request(app)
      .post("/api/teams")
      .send({ name: teamName });

    const deleteRes = await request(app).delete(`/api/teams/${createRes.body.id}`);

    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/teams/${createRes.body.id}`);

    expect(getRes.status).toBe(404);
    expect(getRes.body).toEqual({ error: "Team not found" });
  });
});
