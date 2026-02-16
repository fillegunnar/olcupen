import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the db/teams module before importing app
vi.mock("../db/teams.js", () => ({
  getAllTeams: vi.fn(),
  getTeamById: vi.fn(),
  createTeam: vi.fn(),
  updateTeam: vi.fn(),
  deleteTeam: vi.fn(),
  countTeamDependencies: vi.fn(),
}));

import app from "../app.js";
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  countTeamDependencies,
} from "../db/teams.js";

const mockedGetAllTeams = vi.mocked(getAllTeams);
const mockedGetTeamById = vi.mocked(getTeamById);
const mockedCreateTeam = vi.mocked(createTeam);
const mockedUpdateTeam = vi.mocked(updateTeam);
const mockedDeleteTeam = vi.mocked(deleteTeam);
const mockedCountTeamDependencies = vi.mocked(countTeamDependencies);

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

describe("GET /api/teams/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a team when it exists", async () => {
    const team = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockedGetTeamById.mockResolvedValue(team);

    const res = await request(app).get("/api/teams/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(team);
    expect(mockedGetTeamById).toHaveBeenCalledWith(1);
  });

  it("returns 404 when team does not exist", async () => {
    mockedGetTeamById.mockResolvedValue(null);

    const res = await request(app).get("/api/teams/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Team not found" });
  });

  it("returns 400 when id is not a valid number", async () => {
    const res = await request(app).get("/api/teams/invalid");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid team ID" });
    expect(mockedGetTeamById).not.toHaveBeenCalled();
  });

  it("returns 500 on database error", async () => {
    mockedGetTeamById.mockRejectedValue(new Error("connection refused"));

    const res = await request(app).get("/api/teams/1");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});

describe("POST /api/teams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a team and returns 201", async () => {
    const team = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
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
    const team = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockedCreateTeam.mockResolvedValue(team);

    const res = await request(app)
      .post("/api/teams")
      .send({ name: "  Ansen  " });

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

describe("PUT /api/teams/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a team's name and returns updated team", async () => {
    const oldTeam = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    const updatedTeam = {
      id: 1,
      name: "Ansen FC",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockedGetTeamById.mockResolvedValue(oldTeam);
    mockedUpdateTeam.mockResolvedValue(updatedTeam);

    const res = await request(app)
      .put("/api/teams/1")
      .send({ name: "Ansen FC" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedTeam);
    expect(mockedGetTeamById).toHaveBeenCalledWith(1);
    expect(mockedUpdateTeam).toHaveBeenCalledWith(1, "Ansen FC");
  });

  it("returns 404 when team does not exist", async () => {
    mockedGetTeamById.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/teams/999")
      .send({ name: "Ansen FC" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Team not found" });
    expect(mockedUpdateTeam).not.toHaveBeenCalled();
  });

  it("returns 400 when id is not a valid number", async () => {
    const res = await request(app)
      .put("/api/teams/invalid")
      .send({ name: "Ansen FC" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid team ID" });
    expect(mockedGetTeamById).not.toHaveBeenCalled();
    expect(mockedUpdateTeam).not.toHaveBeenCalled();
  });

  it("returns 400 when name is missing", async () => {
    const team = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockedGetTeamById.mockResolvedValue(team);

    const res = await request(app).put("/api/teams/1").send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Team name is required" });
    expect(mockedUpdateTeam).not.toHaveBeenCalled();
  });

  it("returns 400 when name is empty string", async () => {
    const team = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockedGetTeamById.mockResolvedValue(team);

    const res = await request(app).put("/api/teams/1").send({ name: "  " });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Team name is required" });
    expect(mockedUpdateTeam).not.toHaveBeenCalled();
  });

  it("returns 409 when new name already exists", async () => {
    const team = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockedGetTeamById.mockResolvedValue(team);
    const dbError = new Error("duplicate key") as any;
    dbError.code = "23505";
    mockedUpdateTeam.mockRejectedValue(dbError);

    const res = await request(app)
      .put("/api/teams/1")
      .send({ name: "Båansen" });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: "A team with that name already exists" });
  });

  it("trims whitespace from team name", async () => {
    const team = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    const updatedTeam = {
      id: 1,
      name: "Ansen FC",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockedGetTeamById.mockResolvedValue(team);
    mockedUpdateTeam.mockResolvedValue(updatedTeam);

    const res = await request(app)
      .put("/api/teams/1")
      .send({ name: "  Ansen FC  " });

    expect(res.status).toBe(200);
    expect(mockedUpdateTeam).toHaveBeenCalledWith(1, "Ansen FC");
  });

  it("returns 500 on unexpected database error", async () => {
    const team = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockedGetTeamById.mockResolvedValue(team);
    mockedUpdateTeam.mockRejectedValue(new Error("connection refused"));

    const res = await request(app)
      .put("/api/teams/1")
      .send({ name: "Ansen FC" });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});

describe("DELETE /api/teams/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes a team when it has no dependencies and returns 204", async () => {
    const team = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockedGetTeamById.mockResolvedValue(team);
    mockedCountTeamDependencies.mockResolvedValue(0);
    mockedDeleteTeam.mockResolvedValue(true);

    const res = await request(app).delete("/api/teams/1");

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
    expect(mockedGetTeamById).toHaveBeenCalledWith(1);
    expect(mockedCountTeamDependencies).toHaveBeenCalledWith(1);
    expect(mockedDeleteTeam).toHaveBeenCalledWith(1);
  });

  it("returns 404 when team does not exist", async () => {
    mockedGetTeamById.mockResolvedValue(null);

    const res = await request(app).delete("/api/teams/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Team not found" });
    expect(mockedDeleteTeam).not.toHaveBeenCalled();
  });

  it("returns 400 when id is not a valid number", async () => {
    const res = await request(app).delete("/api/teams/invalid");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid team ID" });
    expect(mockedGetTeamById).not.toHaveBeenCalled();
    expect(mockedDeleteTeam).not.toHaveBeenCalled();
  });

  it("returns 409 when team has players", async () => {
    const team = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockedGetTeamById.mockResolvedValue(team);
    mockedCountTeamDependencies.mockResolvedValue(2);

    const res = await request(app).delete("/api/teams/1");

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      error: "Cannot remove team with existing players or scheduled matches",
    });
    expect(mockedDeleteTeam).not.toHaveBeenCalled();
  });

  it("returns 409 when team has scheduled matches", async () => {
    const team = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockedGetTeamById.mockResolvedValue(team);
    mockedCountTeamDependencies.mockResolvedValue(1);

    const res = await request(app).delete("/api/teams/1");

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      error: "Cannot remove team with existing players or scheduled matches",
    });
    expect(mockedDeleteTeam).not.toHaveBeenCalled();
  });

  it("returns 500 on unexpected database error", async () => {
    const team = {
      id: 1,
      name: "Ansen",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockedGetTeamById.mockResolvedValue(team);
    mockedCountTeamDependencies.mockRejectedValue(
      new Error("connection refused"),
    );

    const res = await request(app).delete("/api/teams/1");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});
