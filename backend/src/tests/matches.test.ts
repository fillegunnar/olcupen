import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../db/matches.js", () => ({
  getAllMatches: vi.fn(),
}));

import app from "../app.js";
import { getAllMatches } from "../db/matches.js";

const DEFAULT_CREATED_AT = "2026-01-01T00:00:00.000Z";

function buildMatch(
  overrides: Partial<{
    id: number;
    team_a_id: number;
    team_a_name: string;
    team_b_id: number;
    team_b_name: string;
    match_date: string;
    group_name: string | null;
    location: string | null;
    created_at: string;
  }> = {},
) {
  return {
    id: 1,
    team_a_id: 1,
    team_a_name: "Ansen",
    team_b_id: 2,
    team_b_name: "Båansen",
    match_date: "2026-06-15T10:00:00.000Z",
    group_name: "Group A",
    location: "Pitch 1",
    created_at: DEFAULT_CREATED_AT,
    ...overrides,
  };
}

const mockedGetAllMatches = vi.mocked(getAllMatches);

describe("Matches API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/matches", () => {
    it("returns all matches when matches exist", async () => {
      const matches = [
        buildMatch(),
        buildMatch({
          id: 2,
          team_a_id: 3,
          team_a_name: "Team C",
          team_b_id: 4,
          team_b_name: "Team D",
          match_date: "2026-06-15T12:00:00.000Z",
          group_name: "Group B",
          location: "Pitch 2",
        }),
      ];
      mockedGetAllMatches.mockResolvedValue(matches);

      const res = await request(app).get("/api/matches");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(matches);
    });

    it("returns an empty list when no matches exist", async () => {
      mockedGetAllMatches.mockResolvedValue([]);

      const res = await request(app).get("/api/matches");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("returns a structured JSON response", async () => {
      mockedGetAllMatches.mockResolvedValue([buildMatch()]);

      const res = await request(app).get("/api/matches");

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("team_a_id");
      expect(res.body[0]).toHaveProperty("team_a_name");
      expect(res.body[0]).toHaveProperty("team_b_id");
      expect(res.body[0]).toHaveProperty("team_b_name");
      expect(res.body[0]).toHaveProperty("match_date");
      expect(res.body[0]).toHaveProperty("group_name");
      expect(res.body[0]).toHaveProperty("location");
      expect(res.body[0]).toHaveProperty("created_at");
    });

    it("returns 500 when the database query fails", async () => {
      mockedGetAllMatches.mockRejectedValue(new Error("connection refused"));

      const res = await request(app).get("/api/matches");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error" });
    });
  });
});
