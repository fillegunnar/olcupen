# US-010: View Tournament Schedule

## Story

As a **visitor**,
I want to see the tournament match schedule,
so that I know when and where each match is being played.

## Context

- Builds on teams (US-001) — matches are played between two teams.
- The current site embeds Google Sheets for schedules. This story replaces that with dynamic data.
- Matches should show the two teams, date/time, and optionally a pitch or location.
- This story introduces the matches table.

## Acceptance criteria

- [ ] Given matches have been scheduled, when I view the schedule, then I see all matches with their teams, date/time, and group.
- [ ] Given no matches have been scheduled yet, when I view the schedule, then I receive an empty list (not an error).
- [ ] Given matches exist, when I view the schedule, then matches are presented in chronological order.

## Notes

- This story drives the creation of the matches table schema and migration.
- Public endpoint — no authentication required.
