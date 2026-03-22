import request from "supertest";
import { expect, it } from "vitest";
import app from "../app.js";
import pool from "../db/pool.js";
import {
  describeIfDatabase,
  setupIntegrationDatabase,
} from "./utils/integration-db.js";

describeIfDatabase("Matches API integration tests", () => {
  setupIntegrationDatabase(["matches", "players", "teams"]);

  it("returns an empty list when no matches exist", async () => {
    const res = await request(app).get("/api/matches");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns matches in chronological order with team names", async () => {
    // Create teams
    const team1 = await request(app)
      .post("/api/teams")
      .send({ name: "Alpha FC" });
    const team2 = await request(app)
      .post("/api/teams")
      .send({ name: "Beta United" });
    const team3 = await request(app)
      .post("/api/teams")
      .send({ name: "Gamma City" });

    // Insert matches out of chronological order
    await pool.query(
      "INSERT INTO matches (team_a_id, team_b_id, match_date, group_name, location) VALUES ($1, $2, $3, $4, $5)",
      [
        team1.body.id,
        team2.body.id,
        "2026-06-15T14:00:00Z",
        "Group A",
        "Pitch 2",
      ],
    );
    await pool.query(
      "INSERT INTO matches (team_a_id, team_b_id, match_date, group_name, location) VALUES ($1, $2, $3, $4, $5)",
      [
        team2.body.id,
        team3.body.id,
        "2026-06-15T10:00:00Z",
        "Group A",
        "Pitch 1",
      ],
    );
    await pool.query(
      "INSERT INTO matches (team_a_id, team_b_id, match_date, group_name) VALUES ($1, $2, $3, $4)",
      [team1.body.id, team3.body.id, "2026-06-16T10:00:00Z", "Group B"],
    );

    const res = await request(app).get("/api/matches");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);

    // Chronological order
    expect(res.body[0].team_a_name).toBe("Beta United");
    expect(res.body[0].team_b_name).toBe("Gamma City");
    expect(res.body[0].group_name).toBe("Group A");
    expect(res.body[0].location).toBe("Pitch 1");

    expect(res.body[1].team_a_name).toBe("Alpha FC");
    expect(res.body[1].team_b_name).toBe("Beta United");
    expect(res.body[1].group_name).toBe("Group A");
    expect(res.body[1].location).toBe("Pitch 2");

    expect(res.body[2].team_a_name).toBe("Alpha FC");
    expect(res.body[2].team_b_name).toBe("Gamma City");
    expect(res.body[2].group_name).toBe("Group B");
    expect(res.body[2].location).toBeNull();
  });

  it("returns match fields with correct types", async () => {
    const team1 = await request(app)
      .post("/api/teams")
      .send({ name: "Alpha FC" });
    const team2 = await request(app)
      .post("/api/teams")
      .send({ name: "Beta United" });

    await pool.query(
      "INSERT INTO matches (team_a_id, team_b_id, match_date, group_name, location) VALUES ($1, $2, $3, $4, $5)",
      [
        team1.body.id,
        team2.body.id,
        "2026-06-15T10:00:00Z",
        "Group A",
        "Pitch 1",
      ],
    );

    const res = await request(app).get("/api/matches");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);

    const match = res.body[0];
    expect(match.id).toBeTruthy();
    expect(match.team_a_id).toBe(team1.body.id);
    expect(match.team_a_name).toBe("Alpha FC");
    expect(match.team_b_id).toBe(team2.body.id);
    expect(match.team_b_name).toBe("Beta United");
    expect(match.match_date).toBeTruthy();
    expect(match.group_name).toBe("Group A");
    expect(match.location).toBe("Pitch 1");
    expect(match.created_at).toBeTruthy();
  });
});
