# US-003: View Team Details

## Story

As a **visitor**,
I want to view the details of a specific team,
so that I can learn more about that team (e.g., name, group, and any other team-level information).

## Context

- Builds on US-001 — the team must already exist in the database.
- This is a single-team view, providing more detail than the list endpoint.
- Roster information is handled in US-006; this story covers team-level data only.

## Acceptance criteria

- [ ] Given a team exists, when I request its details by identifier, then I receive the team's full information.
- [ ] Given the identifier does not match any team, when I request its details, then I receive a clear "not found" response.

## Notes

- Public endpoint — no authentication required.
