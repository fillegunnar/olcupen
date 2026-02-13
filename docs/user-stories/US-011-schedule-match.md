# US-011: Schedule a Match

## Story

As a **tournament organizer**,
I want to schedule a match between two teams,
so that the match appears in the public tournament schedule.

## Context

- Builds on US-010 (matches table), US-002 (teams must exist), and US-016/US-017 (groups and team-group assignments must exist).
- A match requires two distinct teams, a date/time, and a reference to an existing group.
- Both teams should belong to the specified group.
- A team should not be scheduled to play itself.

## Acceptance criteria

- [ ] Given two valid teams exist and belong to the same group, when I schedule a match with a date/time and group, then the match is persisted and appears in the schedule.
- [ ] Given I try to schedule a match where both sides are the same team, when I submit it, then I receive a validation error.
- [ ] Given one or both team identifiers do not exist, when I try to schedule a match, then I receive a clear error.
- [ ] Given the specified group does not exist, when I try to schedule a match, then I receive a clear error.
- [ ] Given I omit required fields (e.g., date/time, teams, group), when I try to schedule a match, then I receive a validation error.

## Notes

- No authentication enforcement in this story (see US-015).
