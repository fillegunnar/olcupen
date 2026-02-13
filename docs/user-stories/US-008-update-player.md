# US-008: Update Player Details

## Story

As a **tournament organizer** or **team captain**,
I want to update a player's information (e.g., name, jersey number),
so that roster data remains accurate if corrections are needed.

## Context

- Builds on US-007 — a player must exist before being updated.
- Common use case: correcting a misspelled name or updating a jersey number.
- A team captain can only update players on their own team. A tournament organizer can update any player.

## Acceptance criteria

- [ ] Given a player exists, when I update their information, then the changes are persisted and visible when viewing the team roster.
- [ ] Given the player does not exist, when I try to update them, then I receive a "not found" response.
- [ ] Given I submit invalid data (e.g., empty name), when I try to update, then I receive a validation error.
- [ ] Given I am a team captain, when I try to update a player on a team that is not mine, then my request is rejected.

## Notes

- No authentication enforcement in this story (see US-015 for auth and authorization rules).
