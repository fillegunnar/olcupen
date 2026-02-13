# US-002: Add a Team

## Story

As a **tournament organizer**,
I want to add a new team to the tournament,
so that the team appears in the public team list and can be assigned players and matches.

## Context

- Builds on US-001 (teams table and read endpoint must exist).
- Team names should be unique within a tournament to avoid confusion.
- A team needs at minimum a name. Group assignment is handled separately in US-017.

## Acceptance criteria

- [ ] Given I provide a valid team name, when I add the team, then it is persisted and appears in the team list.
- [ ] Given I provide a team name that already exists, when I try to add it, then I receive a clear error indicating the name is taken.
- [ ] Given I omit the team name, when I try to add a team, then I receive a validation error describing what is missing.

## Notes

- No authentication enforcement in this story (see US-015 for auth layer).
