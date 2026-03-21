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
  getPlayersByTeamId: vi.fn(),
  getPlayerById: vi.fn(),
  createPlayer: vi.fn(),
  updatePlayer: vi.fn(),
  deletePlayer: vi.fn(),
}));

import app from "../app.js";
import {
  countTeamDependencies,
  createPlayer,
  createTeam,
  deletePlayer,
  deleteTeam,
  getAllTeams,
  getPlayerById,
  getPlayersByTeamId,
  getTeamById,
  updatePlayer,
  updateTeam,
} from "../db/teams.js";

const DEFAULT_CREATED_AT = "2026-01-01T00:00:00.000Z";

function buildTeam(
  overrides: Partial<{ id: number; name: string; created_at: string }> = {},
) {
  return {
    id: 1,
    name: "Ansen",
    created_at: DEFAULT_CREATED_AT,
    ...overrides,
  };
}

function buildPlayer(
  overrides: Partial<{
    id: number;
    name: string;
    number: number;
    age: number;
    team_id: number;
    created_at: string;
  }> = {},
) {
  return {
    id: 1,
    name: "Player One",
    number: 10,
    age: 25,
    team_id: 1,
    created_at: "2026-01-02T00:00:00.000Z",
    ...overrides,
  };
}

const mockedGetAllTeams = vi.mocked(getAllTeams);
const mockedGetTeamById = vi.mocked(getTeamById);
const mockedCreateTeam = vi.mocked(createTeam);
const mockedUpdateTeam = vi.mocked(updateTeam);
const mockedDeleteTeam = vi.mocked(deleteTeam);
const mockedCountTeamDependencies = vi.mocked(countTeamDependencies);
const mockedGetPlayersByTeamId = vi.mocked(getPlayersByTeamId);
const mockedGetPlayerById = vi.mocked(getPlayerById);
const mockedCreatePlayer = vi.mocked(createPlayer);
const mockedUpdatePlayer = vi.mocked(updatePlayer);
const mockedDeletePlayer = vi.mocked(deletePlayer);

describe("Teams API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/teams", () => {
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
    it("returns a team when it exists", async () => {
      const team = buildTeam();
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
    it("creates a team and returns 201", async () => {
      const team = buildTeam();
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
      expect(res.body).toEqual({
        error: "A team with that name already exists",
      });
    });

    it("trims whitespace from team name", async () => {
      const team = buildTeam();
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
    it("updates a team's name and returns updated team", async () => {
      const oldTeam = buildTeam();
      const updatedTeam = buildTeam({ name: "Ansen FC" });
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
      const team = buildTeam();
      mockedGetTeamById.mockResolvedValue(team);

      const res = await request(app).put("/api/teams/1").send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Team name is required" });
      expect(mockedUpdateTeam).not.toHaveBeenCalled();
    });

    it("returns 400 when name is empty string", async () => {
      const team = buildTeam();
      mockedGetTeamById.mockResolvedValue(team);

      const res = await request(app).put("/api/teams/1").send({ name: "  " });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Team name is required" });
      expect(mockedUpdateTeam).not.toHaveBeenCalled();
    });

    it("returns 409 when new name already exists", async () => {
      const team = buildTeam();
      mockedGetTeamById.mockResolvedValue(team);
      const dbError = new Error("duplicate key") as any;
      dbError.code = "23505";
      mockedUpdateTeam.mockRejectedValue(dbError);

      const res = await request(app)
        .put("/api/teams/1")
        .send({ name: "Båansen" });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({
        error: "A team with that name already exists",
      });
    });

    it("trims whitespace from team name", async () => {
      const team = buildTeam();
      const updatedTeam = buildTeam({ name: "Ansen FC" });
      mockedGetTeamById.mockResolvedValue(team);
      mockedUpdateTeam.mockResolvedValue(updatedTeam);

      const res = await request(app)
        .put("/api/teams/1")
        .send({ name: "  Ansen FC  " });

      expect(res.status).toBe(200);
      expect(mockedUpdateTeam).toHaveBeenCalledWith(1, "Ansen FC");
    });

    it("returns 500 on unexpected database error", async () => {
      const team = buildTeam();
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
    it("deletes a team when it has no dependencies and returns 204", async () => {
      const team = buildTeam();
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
      const team = buildTeam();
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
      const team = buildTeam();
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
      const team = buildTeam();
      mockedGetTeamById.mockResolvedValue(team);
      mockedCountTeamDependencies.mockRejectedValue(
        new Error("connection refused"),
      );

      const res = await request(app).delete("/api/teams/1");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error" });
    });
  });

  describe("GET /api/teams/:id/players", () => {
    it("returns players for a team", async () => {
      const team = buildTeam();
      mockedGetTeamById.mockResolvedValue(team);
      const players = [
        buildPlayer(),
        buildPlayer({
          id: 2,
          name: "Player Two",
          number: 11,
          age: 27,
          created_at: "2026-01-03T00:00:00.000Z",
        }),
      ];
      mockedGetPlayersByTeamId.mockResolvedValue(players);

      const res = await request(app).get("/api/teams/1/players");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(players);
      expect(mockedGetPlayersByTeamId).toHaveBeenCalledWith(1);
    });

    it("returns empty list when team exists but has no players", async () => {
      mockedGetTeamById.mockResolvedValue(buildTeam());
      mockedGetPlayersByTeamId.mockResolvedValue([]);

      const res = await request(app).get("/api/teams/1/players");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("returns 404 when team does not exist", async () => {
      mockedGetTeamById.mockResolvedValue(null);

      const res = await request(app).get("/api/teams/999/players");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Team not found" });
    });

    it("returns 400 when id is not a valid number", async () => {
      const res = await request(app).get("/api/teams/invalid/players");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid team ID" });
      expect(mockedGetPlayersByTeamId).not.toHaveBeenCalled();
    });

    it("returns 500 on database error", async () => {
      mockedGetTeamById.mockResolvedValue(buildTeam());
      mockedGetPlayersByTeamId.mockRejectedValue(
        new Error("connection refused"),
      );

      const res = await request(app).get("/api/teams/1/players");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error" });
    });
  });

  describe("POST /api/teams/:id/players", () => {
    it("creates a player and returns 201", async () => {
      const team = buildTeam();
      const player = buildPlayer();
      mockedGetTeamById.mockResolvedValue(team);
      mockedCreatePlayer.mockResolvedValue(player);

      const res = await request(app)
        .post("/api/teams/1/players")
        .send({ name: "Player One", number: 10, age: 25 });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(player);
      expect(mockedGetTeamById).toHaveBeenCalledWith(1);
      expect(mockedCreatePlayer).toHaveBeenCalledWith(1, "Player One", 10, 25);
    });

    it("trims whitespace from player name", async () => {
      const team = buildTeam();
      const player = buildPlayer();
      mockedGetTeamById.mockResolvedValue(team);
      mockedCreatePlayer.mockResolvedValue(player);

      const res = await request(app)
        .post("/api/teams/1/players")
        .send({ name: "  Player One  ", number: 10, age: 25 });

      expect(res.status).toBe(201);
      expect(mockedCreatePlayer).toHaveBeenCalledWith(1, "Player One", 10, 25);
    });

    it("returns 404 when team does not exist", async () => {
      mockedGetTeamById.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/teams/999/players")
        .send({ name: "Player One", number: 10, age: 25 });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Team not found" });
      expect(mockedCreatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when name is missing", async () => {
      const res = await request(app)
        .post("/api/teams/1/players")
        .send({ number: 10, age: 25 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Player name is required" });
      expect(mockedCreatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when name is empty string", async () => {
      const res = await request(app)
        .post("/api/teams/1/players")
        .send({ name: "  ", number: 10, age: 25 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Player name is required" });
      expect(mockedCreatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when number is missing", async () => {
      const res = await request(app)
        .post("/api/teams/1/players")
        .send({ name: "Player One", age: 25 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: "Player number is required and must be an integer",
      });
      expect(mockedCreatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when age is missing", async () => {
      const res = await request(app)
        .post("/api/teams/1/players")
        .send({ name: "Player One", number: 10 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: "Player age is required and must be an integer",
      });
      expect(mockedCreatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when age is not an integer", async () => {
      const res = await request(app)
        .post("/api/teams/1/players")
        .send({ name: "Player One", number: 10, age: "twenty" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: "Player age is required and must be an integer",
      });
      expect(mockedCreatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when age is under 18", async () => {
      const res = await request(app)
        .post("/api/teams/1/players")
        .send({ name: "Player One", number: 10, age: 17 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Player must be older than 17" });
      expect(mockedCreatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when team id is not a valid number", async () => {
      const res = await request(app)
        .post("/api/teams/invalid/players")
        .send({ name: "Player One", number: 10, age: 25 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid team ID" });
      expect(mockedGetTeamById).not.toHaveBeenCalled();
      expect(mockedCreatePlayer).not.toHaveBeenCalled();
    });

    it("returns 409 when player number already exists on team", async () => {
      const team = buildTeam();
      mockedGetTeamById.mockResolvedValue(team);
      const dbError = new Error("duplicate key") as any;
      dbError.code = "23505";
      mockedCreatePlayer.mockRejectedValue(dbError);

      const res = await request(app)
        .post("/api/teams/1/players")
        .send({ name: "Player One", number: 10, age: 25 });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({
        error: "A player with that number already exists on this team",
      });
    });

    it("returns 500 on unexpected database error", async () => {
      mockedGetTeamById.mockResolvedValue(buildTeam());
      mockedCreatePlayer.mockRejectedValue(new Error("connection refused"));

      const res = await request(app)
        .post("/api/teams/1/players")
        .send({ name: "Player One", number: 10, age: 25 });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error" });
    });
  });

  describe("PUT /api/teams/:id/players/:playerId", () => {
    it("updates a player and returns updated player", async () => {
      const team = buildTeam();
      const existingPlayer = buildPlayer();
      const updatedPlayer = buildPlayer({
        name: "Updated Name",
        number: 99,
        age: 30,
      });
      mockedGetTeamById.mockResolvedValue(team);
      mockedGetPlayerById.mockResolvedValue(existingPlayer);
      mockedUpdatePlayer.mockResolvedValue(updatedPlayer);

      const res = await request(app)
        .put("/api/teams/1/players/1")
        .send({ name: "Updated Name", number: 99, age: 30 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedPlayer);
      expect(mockedGetTeamById).toHaveBeenCalledWith(1);
      expect(mockedGetPlayerById).toHaveBeenCalledWith(1);
      expect(mockedUpdatePlayer).toHaveBeenCalledWith(
        1,
        "Updated Name",
        99,
        30,
      );
    });

    it("trims whitespace from player name", async () => {
      const team = buildTeam();
      const existingPlayer = buildPlayer();
      const updatedPlayer = buildPlayer({ name: "Updated Name" });
      mockedGetTeamById.mockResolvedValue(team);
      mockedGetPlayerById.mockResolvedValue(existingPlayer);
      mockedUpdatePlayer.mockResolvedValue(updatedPlayer);

      const res = await request(app)
        .put("/api/teams/1/players/1")
        .send({ name: "  Updated Name  ", number: 10, age: 25 });

      expect(res.status).toBe(200);
      expect(mockedUpdatePlayer).toHaveBeenCalledWith(
        1,
        "Updated Name",
        10,
        25,
      );
    });

    it("returns 404 when team does not exist", async () => {
      mockedGetTeamById.mockResolvedValue(null);

      const res = await request(app)
        .put("/api/teams/999/players/1")
        .send({ name: "Updated Name", number: 99, age: 30 });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Team not found" });
      expect(mockedUpdatePlayer).not.toHaveBeenCalled();
    });

    it("returns 404 when player does not exist", async () => {
      mockedGetTeamById.mockResolvedValue(buildTeam());
      mockedGetPlayerById.mockResolvedValue(null);

      const res = await request(app)
        .put("/api/teams/1/players/999")
        .send({ name: "Updated Name", number: 99, age: 30 });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Player not found" });
      expect(mockedUpdatePlayer).not.toHaveBeenCalled();
    });

    it("returns 404 when player belongs to a different team", async () => {
      mockedGetTeamById.mockResolvedValue(buildTeam());
      mockedGetPlayerById.mockResolvedValue(buildPlayer({ team_id: 2 }));

      const res = await request(app)
        .put("/api/teams/1/players/1")
        .send({ name: "Updated Name", number: 99, age: 30 });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Player not found on this team" });
      expect(mockedUpdatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when team id is not a valid number", async () => {
      const res = await request(app)
        .put("/api/teams/invalid/players/1")
        .send({ name: "Updated Name", number: 99, age: 30 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid team ID" });
      expect(mockedUpdatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when player id is not a valid number", async () => {
      const res = await request(app)
        .put("/api/teams/1/players/invalid")
        .send({ name: "Updated Name", number: 99, age: 30 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid player ID" });
      expect(mockedUpdatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when name is missing", async () => {
      const res = await request(app)
        .put("/api/teams/1/players/1")
        .send({ number: 99, age: 30 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Player name is required" });
      expect(mockedUpdatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when name is empty string", async () => {
      const res = await request(app)
        .put("/api/teams/1/players/1")
        .send({ name: "  ", number: 99, age: 30 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Player name is required" });
      expect(mockedUpdatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when number is missing", async () => {
      const res = await request(app)
        .put("/api/teams/1/players/1")
        .send({ name: "Updated Name", age: 30 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: "Player number is required and must be an integer",
      });
      expect(mockedUpdatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when age is missing", async () => {
      const res = await request(app)
        .put("/api/teams/1/players/1")
        .send({ name: "Updated Name", number: 99 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: "Player age is required and must be an integer",
      });
      expect(mockedUpdatePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when age is under 18", async () => {
      const res = await request(app)
        .put("/api/teams/1/players/1")
        .send({ name: "Updated Name", number: 99, age: 17 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Player must be older than 17" });
      expect(mockedUpdatePlayer).not.toHaveBeenCalled();
    });

    it("returns 409 when updated number already exists on team", async () => {
      mockedGetTeamById.mockResolvedValue(buildTeam());
      mockedGetPlayerById.mockResolvedValue(buildPlayer());
      const dbError = new Error("duplicate key") as any;
      dbError.code = "23505";
      mockedUpdatePlayer.mockRejectedValue(dbError);

      const res = await request(app)
        .put("/api/teams/1/players/1")
        .send({ name: "Updated Name", number: 11, age: 25 });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({
        error: "A player with that number already exists on this team",
      });
    });

    it("returns 500 on unexpected database error", async () => {
      mockedGetTeamById.mockResolvedValue(buildTeam());
      mockedGetPlayerById.mockResolvedValue(buildPlayer());
      mockedUpdatePlayer.mockRejectedValue(new Error("connection refused"));

      const res = await request(app)
        .put("/api/teams/1/players/1")
        .send({ name: "Updated Name", number: 99, age: 30 });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error" });
    });
  });

  describe("DELETE /api/teams/:id/players/:playerId", () => {
    it("deletes a player and returns 204", async () => {
      mockedGetTeamById.mockResolvedValue(buildTeam());
      mockedGetPlayerById.mockResolvedValue(buildPlayer());
      mockedDeletePlayer.mockResolvedValue(true);

      const res = await request(app).delete("/api/teams/1/players/1");

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
      expect(mockedGetTeamById).toHaveBeenCalledWith(1);
      expect(mockedGetPlayerById).toHaveBeenCalledWith(1);
      expect(mockedDeletePlayer).toHaveBeenCalledWith(1);
    });

    it("returns 404 when team does not exist", async () => {
      mockedGetTeamById.mockResolvedValue(null);

      const res = await request(app).delete("/api/teams/999/players/1");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Team not found" });
      expect(mockedDeletePlayer).not.toHaveBeenCalled();
    });

    it("returns 404 when player does not exist", async () => {
      mockedGetTeamById.mockResolvedValue(buildTeam());
      mockedGetPlayerById.mockResolvedValue(null);

      const res = await request(app).delete("/api/teams/1/players/999");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Player not found" });
      expect(mockedDeletePlayer).not.toHaveBeenCalled();
    });

    it("returns 404 when player belongs to a different team", async () => {
      mockedGetTeamById.mockResolvedValue(buildTeam());
      mockedGetPlayerById.mockResolvedValue(buildPlayer({ team_id: 2 }));

      const res = await request(app).delete("/api/teams/1/players/1");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Player not found on this team" });
      expect(mockedDeletePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when team id is not a valid number", async () => {
      const res = await request(app).delete("/api/teams/invalid/players/1");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid team ID" });
      expect(mockedDeletePlayer).not.toHaveBeenCalled();
    });

    it("returns 400 when player id is not a valid number", async () => {
      const res = await request(app).delete("/api/teams/1/players/invalid");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid player ID" });
      expect(mockedDeletePlayer).not.toHaveBeenCalled();
    });

    it("returns 500 on unexpected database error", async () => {
      mockedGetTeamById.mockResolvedValue(buildTeam());
      mockedGetPlayerById.mockResolvedValue(buildPlayer());
      mockedDeletePlayer.mockRejectedValue(new Error("connection refused"));

      const res = await request(app).delete("/api/teams/1/players/1");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error" });
    });
  });
});
