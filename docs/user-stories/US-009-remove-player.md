# US-009: Remove a Player from a Team

## Story

As a **tournament organizer** or **team captain**,
I want to remove a player from a team's roster,
so that players who have dropped out are no longer listed.

## Context

- Builds on US-007.
- Simpler than removing a team — players typically have no downstream dependencies at this stage.
- A team captain can only remove players from their own team. A tournament organizer can remove any player.

## Acceptance criteria

- [ ] Given a player exists on a team, when I remove them, then they no longer appear in the team's roster.
- [ ] Given the player does not exist, when I try to remove them, then I receive a "not found" response.
- [ ] Given I am a team captain, when I try to remove a player from a team that is not mine, then my request is rejected.

## Notes

- No authentication enforcement in this story (see US-015 for auth and authorization rules).
