import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Mock the db/teams module before importing app
vi.mock("../db/teams.js", () => ({
  getAllTeams: vi.fn(),
}));

import app from "../app.js";
import { getAllTeams } from "../db/teams.js";

const mockedGetAllTeams = vi.mocked(getAllTeams);

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
