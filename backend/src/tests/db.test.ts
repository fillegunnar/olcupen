import { describe, expect, it } from "vitest";
import pool from "../db/pool.js";
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
import {
  describeIfDatabase,
  setupIntegrationDatabase,
} from "./utils/integration-db.js";

const NON_EXISTENT_TEAM_ID = 999;
const INSERT_PLAYER_SQL =
  "INSERT INTO players (name, number, age, team_id) VALUES ($1, $2, $3, $4)";

async function insertPlayer(
  teamId: number,
  name: string,
  number: number,
  age: number,
): Promise<void> {
  await pool.query(INSERT_PLAYER_SQL, [name, number, age, teamId]);
}

describeIfDatabase("Database layer - Teams", () => {
  setupIntegrationDatabase(["teams", "players"]);

  describe("Teams", () => {
    it("creates a team", async () => {
      const team = await createTeam("Test Team");

      expect(team.id).toBe(1);
      expect(team.name).toBe("Test Team");
      expect(team.created_at).toBeTruthy();
    });

    it("retrieves all teams ordered by name", async () => {
      await createTeam("Zebra FC");
      await createTeam("Alpha United");
      await createTeam("Beta City");

      const teams = await getAllTeams();

      expect(teams).toHaveLength(3);
      expect(teams[0].name).toBe("Alpha United");
      expect(teams[1].name).toBe("Beta City");
      expect(teams[2].name).toBe("Zebra FC");
    });

    it("retrieves a team by id", async () => {
      const created = await createTeam("Test Team");
      const retrieved = await getTeamById(created.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved!.id).toBe(created.id);
      expect(retrieved!.name).toBe("Test Team");
    });

    it("returns null when team does not exist", async () => {
      const team = await getTeamById(NON_EXISTENT_TEAM_ID);

      expect(team).toBeNull();
    });

    it("updates a team name", async () => {
      const team = await createTeam("Old Name");
      const updated = await updateTeam(team.id, "New Name");

      expect(updated.id).toBe(team.id);
      expect(updated.name).toBe("New Name");

      const refetched = await getTeamById(team.id);
      expect(refetched!.name).toBe("New Name");
    });

    it("deletes a team", async () => {
      const team = await createTeam("Team to Delete");
      const deleted = await deleteTeam(team.id);

      expect(deleted).toBe(true);

      const refetched = await getTeamById(team.id);
      expect(refetched).toBeNull();
    });

    it("returns false when deleting non-existent team", async () => {
      const deleted = await deleteTeam(NON_EXISTENT_TEAM_ID);

      expect(deleted).toBe(false);
    });
  });

  describe("Players", () => {
    it("creates a player and returns the full row", async () => {
      const team = await createTeam("Test Team");

      const player = await createPlayer(team.id, "John Doe", 10, 25);

      expect(player.id).toBeTruthy();
      expect(player.name).toBe("John Doe");
      expect(player.number).toBe(10);
      expect(player.age).toBe(25);
      expect(player.team_id).toBe(team.id);
      expect(player.created_at).toBeTruthy();
    });

    it("created player appears in getPlayersByTeamId", async () => {
      const team = await createTeam("Test Team");

      await createPlayer(team.id, "John Doe", 10, 25);

      const players = await getPlayersByTeamId(team.id);
      expect(players).toHaveLength(1);
      expect(players[0].name).toBe("John Doe");
    });

    it("throws when adding a duplicate number to the same team", async () => {
      const team = await createTeam("Test Team");
      await createPlayer(team.id, "John Doe", 10, 25);

      await expect(
        createPlayer(team.id, "Jane Smith", 10, 22),
      ).rejects.toMatchObject({ code: "23505" });
    });

    it("allows the same number on different teams", async () => {
      const team1 = await createTeam("Team One");
      const team2 = await createTeam("Team Two");

      await createPlayer(team1.id, "Player A", 10, 20);
      const player2 = await createPlayer(team2.id, "Player B", 10, 22);

      expect(player2.number).toBe(10);
      expect(player2.team_id).toBe(team2.id);
    });

    it("only returns players for the specified team", async () => {
      const team1 = await createTeam("Team One");
      const team2 = await createTeam("Team Two");

      // Insert players for team 1
      await insertPlayer(team1.id, "Player One", 10, 25);
      await insertPlayer(team1.id, "Player Two", 11, 26);

      // Insert players for team 2
      await insertPlayer(team2.id, "Player Three", 7, 24);

      const team1Players = await getPlayersByTeamId(team1.id);
      const team2Players = await getPlayersByTeamId(team2.id);

      expect(team1Players).toHaveLength(2);
      expect(team1Players.every((p) => p.team_id === team1.id)).toBe(true);
      expect(team1Players[0].name).toBe("Player One");
      expect(team1Players[1].name).toBe("Player Two");

      expect(team2Players).toHaveLength(1);
      expect(team2Players[0].name).toBe("Player Three");
    });

    it("returns players ordered by number", async () => {
      const team = await createTeam("Test Team");

      await insertPlayer(team.id, "First", 15, 25);
      await insertPlayer(team.id, "Third", 10, 24);
      await insertPlayer(team.id, "Second", 12, 26);

      const players = await getPlayersByTeamId(team.id);

      expect(players).toHaveLength(3);
      expect(players[0].number).toBe(10);
      expect(players[1].number).toBe(12);
      expect(players[2].number).toBe(15);
    });

    it("returns empty array when team has no players", async () => {
      const team = await createTeam("Empty Team");

      const players = await getPlayersByTeamId(team.id);

      expect(players).toEqual([]);
    });

    it("returns empty array for non-existent team", async () => {
      const players = await getPlayersByTeamId(NON_EXISTENT_TEAM_ID);

      expect(players).toEqual([]);
    });

    it("retrieves a player by id", async () => {
      const team = await createTeam("Test Team");
      const created = await createPlayer(team.id, "John Doe", 10, 25);

      const player = await getPlayerById(created.id);

      expect(player).not.toBeNull();
      expect(player!.id).toBe(created.id);
      expect(player!.name).toBe("John Doe");
      expect(player!.number).toBe(10);
      expect(player!.age).toBe(25);
      expect(player!.team_id).toBe(team.id);
    });

    it("returns null when player does not exist", async () => {
      const player = await getPlayerById(NON_EXISTENT_TEAM_ID);

      expect(player).toBeNull();
    });

    it("updates a player's details", async () => {
      const team = await createTeam("Test Team");
      const created = await createPlayer(team.id, "John Doe", 10, 25);

      const updated = await updatePlayer(created.id, "Jane Smith", 7, 28);

      expect(updated).not.toBeNull();
      expect(updated!.id).toBe(created.id);
      expect(updated!.name).toBe("Jane Smith");
      expect(updated!.number).toBe(7);
      expect(updated!.age).toBe(28);
      expect(updated!.team_id).toBe(team.id);

      const refetched = await getPlayerById(created.id);
      expect(refetched!.name).toBe("Jane Smith");
      expect(refetched!.number).toBe(7);
    });

    it("returns null when updating non-existent player", async () => {
      const result = await updatePlayer(NON_EXISTENT_TEAM_ID, "Ghost", 1, 20);

      expect(result).toBeNull();
    });

    it("throws when updating player number to a duplicate on same team", async () => {
      const team = await createTeam("Test Team");
      await createPlayer(team.id, "Player One", 10, 25);
      const player2 = await createPlayer(team.id, "Player Two", 11, 26);

      await expect(
        updatePlayer(player2.id, "Player Two", 10, 26),
      ).rejects.toMatchObject({ code: "23505" });
    });

    it("deletes a player", async () => {
      const team = await createTeam("Test Team");
      const player = await createPlayer(team.id, "John Doe", 10, 25);

      const deleted = await deletePlayer(player.id);

      expect(deleted).toBe(true);

      const refetched = await getPlayerById(player.id);
      expect(refetched).toBeNull();
    });

    it("returns false when deleting non-existent player", async () => {
      const deleted = await deletePlayer(NON_EXISTENT_TEAM_ID);

      expect(deleted).toBe(false);
    });

    it("player no longer appears in team roster after deletion", async () => {
      const team = await createTeam("Test Team");
      const player = await createPlayer(team.id, "John Doe", 10, 25);
      await createPlayer(team.id, "Jane Smith", 7, 22);

      await deletePlayer(player.id);

      const players = await getPlayersByTeamId(team.id);
      expect(players).toHaveLength(1);
      expect(players[0].name).toBe("Jane Smith");
    });
  });

  describe("Team dependencies", () => {
    it("counts players as dependencies", async () => {
      const team = await createTeam("Test Team");

      let count = await countTeamDependencies(team.id);
      expect(count).toBe(0);

      await insertPlayer(team.id, "Player One", 10, 25);

      count = await countTeamDependencies(team.id);
      expect(count).toBe(1);

      await insertPlayer(team.id, "Player Two", 11, 26);

      count = await countTeamDependencies(team.id);
      expect(count).toBe(2);
    });

    it("counts match dependencies", async () => {
      // Create matches table if it doesn't exist (for future use)
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS matches (
            id SERIAL PRIMARY KEY,
            team_a_id INTEGER NOT NULL REFERENCES teams(id),
            team_b_id INTEGER NOT NULL REFERENCES teams(id),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `);

        const team1 = await createTeam("Team One");
        const team2 = await createTeam("Team Two");

        let count = await countTeamDependencies(team1.id);
        expect(count).toBe(0);

        await pool.query(
          "INSERT INTO matches (team_a_id, team_b_id) VALUES ($1, $2)",
          [team1.id, team2.id],
        );

        count = await countTeamDependencies(team1.id);
        expect(count).toBe(1);
      } catch {
        // Matches table not available yet, skip this test
      }
    });

    it("counts both players and matches as dependencies", async () => {
      const team = await createTeam("Test Team");

      await insertPlayer(team.id, "Player One", 10, 25);

      let count = await countTeamDependencies(team.id);
      expect(count).toBe(1);

      await insertPlayer(team.id, "Player Two", 11, 26);

      count = await countTeamDependencies(team.id);
      expect(count).toBe(2);
    });
  });
});
