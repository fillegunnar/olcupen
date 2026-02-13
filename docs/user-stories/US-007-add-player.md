# US-007: Add a Player to a Team

## Story

As a **tournament organizer** or **team captain**,
I want to add a player to a team's roster,
so that the team's lineup is recorded and visible to visitors.

## Context

- Builds on US-006 (players table must exist).
- A player belongs to exactly one team.
- The minimum required information for a player is their name.
- A team captain can only add players to their own team. A tournament organizer can add players to any team.

## Acceptance criteria

- [ ] Given a team exists, when I add a player with a valid name, then the player is persisted and appears in the team's roster.
- [ ] Given the team does not exist, when I try to add a player to it, then I receive a "not found" response.
- [ ] Given I omit the player's name, when I try to add the player, then I receive a validation error.
- [ ] Given I am a team captain, when I try to add a player to a team that is not mine, then my request is rejected.

## Notes

- No authentication enforcement in this story (see US-015 for auth and authorization rules).
