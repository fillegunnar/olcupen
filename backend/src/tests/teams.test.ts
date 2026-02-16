import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the db/teams module before importing app
vi.mock("../db/teams.js", () => ({
  getAllTeams: vi.fn(),
  createTeam: vi.fn(),
}));

import app from "../app.js";
import { createTeam, getAllTeams } from "../db/teams.js";

const mockedGetAllTeams = vi.mocked(getAllTeams);
const mockedCreateTeam = vi.mocked(createTeam);

describe("GET /api/teams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all teams when teams exist", async () => {
    const teams = [
      { id: 1, name: "Ansen", created_at: "2026-01-01T00:00:00.000Z" },
      { id: 2, name: "Båansen", created_at: "2026-01-02T00:00:00.000Z" },
    ];
    mockedGetAllTeams.mockResolvedValue(teams);

    const res = await request(app).get("/api/teams");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(teams);
  });

  it("returns an empty list when no teams exist", async () => {
    mockedGetAllTeams.mockResolvedValue([]);

    const res = await request(app).get("/api/teams");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns a structured JSON response", async () => {
    mockedGetAllTeams.mockResolvedValue([
      { id: 1, name: "Ansen", created_at: "2026-01-01T00:00:00.000Z" },
    ]);

    const res = await request(app).get("/api/teams");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("created_at");
  });

  it("returns 500 when the database query fails", async () => {
    mockedGetAllTeams.mockRejectedValue(new Error("connection refused"));

    const res = await request(app).get("/api/teams");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});

describe("POST /api/teams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a team and returns 201", async () => {
    const team = { id: 1, name: "Ansen", created_at: "2026-01-01T00:00:00.000Z" };
    mockedCreateTeam.mockResolvedValue(team);

    const res = await request(app).post("/api/teams").send({ name: "Ansen" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(team);
    expect(mockedCreateTeam).toHaveBeenCalledWith("Ansen");
  });

  it("returns 400 when name is missing", async () => {
    const res = await request(app).post("/api/teams").send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Team name is required" });
    expect(mockedCreateTeam).not.toHaveBeenCalled();
  });

  it("returns 400 when name is empty string", async () => {
    const res = await request(app).post("/api/teams").send({ name: "  " });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Team name is required" });
    expect(mockedCreateTeam).not.toHaveBeenCalled();
  });

  it("returns 409 when team name already exists", async () => {
    const dbError = new Error("duplicate key") as any;
    dbError.code = "23505";
    mockedCreateTeam.mockRejectedValue(dbError);

    const res = await request(app).post("/api/teams").send({ name: "Ansen" });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: "A team with that name already exists" });
  });

  it("trims whitespace from team name", async () => {
    const team = { id: 1, name: "Ansen", created_at: "2026-01-01T00:00:00.000Z" };
    mockedCreateTeam.mockResolvedValue(team);

    const res = await request(app).post("/api/teams").send({ name: "  Ansen  " });

    expect(res.status).toBe(201);
    expect(mockedCreateTeam).toHaveBeenCalledWith("Ansen");
  });

  it("returns 500 on unexpected database error", async () => {
    mockedCreateTeam.mockRejectedValue(new Error("connection refused"));

    const res = await request(app).post("/api/teams").send({ name: "Ansen" });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});
