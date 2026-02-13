# US-009: Remove a Player from a Team

## Story

As a **tournament organizer**,
I want to remove a player from a team's roster,
so that players who have dropped out are no longer listed.

## Context

- Builds on US-007.
- Simpler than removing a team — players typically have no downstream dependencies at this stage.

## Acceptance criteria

- [ ] Given a player exists on a team, when I remove them, then they no longer appear in the team's roster.
- [ ] Given the player does not exist, when I try to remove them, then I receive a "not found" response.

## Notes

- No authentication enforcement in this story (see US-015).
