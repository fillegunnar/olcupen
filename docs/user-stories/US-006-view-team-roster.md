# US-006: View Team Roster

## Story

As a **visitor**,
I want to see all players on a specific team,
so that I can check who is playing for that team.

## Context

- Builds on US-001/US-003 (teams) — this story introduces the players table and the relationship between players and teams.
- The current site has player rosters hardcoded in HTML. This story replaces that with dynamic data.
- Players should be listed with their name and optionally a jersey number or role.

## Acceptance criteria

- [ ] Given a team has players, when I view its roster, then I see all players with their name listed.
- [ ] Given a team exists but has no players yet, when I view its roster, then I receive an empty list (not an error).
- [ ] Given the team does not exist, when I try to view its roster, then I receive a "not found" response.

## Notes

- This story drives the creation of the players table schema and migration.
- Public endpoint — no authentication required.
