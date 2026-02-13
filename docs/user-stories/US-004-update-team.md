# US-004: Update Team Information

## Story

As a **tournament organizer**,
I want to update a team's information (e.g., name),
so that the tournament data stays accurate if corrections or changes are needed.

## Context

- Builds on US-002 — a team must exist before it can be updated.
- Common use case: correcting a misspelled team name.
- Group assignment is handled separately in US-017.
- Name uniqueness must still be enforced after an update.

## Acceptance criteria

- [ ] Given a team exists, when I update its name, then the changes are persisted and visible when viewing the team.
- [ ] Given I try to rename a team to a name already taken by another team, when I submit the update, then I receive a clear error.
- [ ] Given the identifier does not match any team, when I try to update it, then I receive a "not found" response.
- [ ] Given I submit an update with invalid or missing required fields, when I try to update, then I receive a validation error.

## Notes

- No authentication enforcement in this story (see US-015).
