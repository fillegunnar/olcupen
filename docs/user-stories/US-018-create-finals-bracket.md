# US-018: Create Finals Bracket

## Story

As a **tournament organizer**,
I want to create a finals bracket (knockout stage) for the tournament,
so that the elimination rounds are structured and visible after the group stage concludes.

## Context

- The finals bracket is a knockout structure that follows the group stage (e.g., quarterfinals → semifinals → final).
- The organizer defines how many rounds the bracket has, which depends on how many teams advance from the groups.
- Bracket matches initially have empty/TBD team slots that are filled as teams are seeded (US-020).
- This is a separate structure from group matches — it has rounds and positions rather than group assignments.

## Acceptance criteria

- [ ] Given the organizer specifies a bracket size (e.g., 8 teams = quarterfinals → semifinals → final), when they create the bracket, then the bracket structure is persisted with the correct number of rounds and matches per round.
- [ ] Given a bracket already exists for the tournament, when the organizer tries to create another one, then they receive a clear error (one bracket per tournament).
- [ ] Given invalid input (e.g., bracket size that is not a power of 2), when the organizer tries to create a bracket, then they receive a validation error.

## Notes

- This story introduces the bracket and bracket matches tables/schema.
- No authentication enforcement in this story (see US-015).
