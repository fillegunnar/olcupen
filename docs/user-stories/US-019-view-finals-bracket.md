# US-019: View Finals Bracket

## Story

As a **visitor**,
I want to see the finals bracket,
so that I can follow which teams are competing in the knockout rounds and who is advancing toward the final.

## Context

- Builds on US-018 (bracket must exist).
- The bracket should show all rounds, with matchups, scores (if played), and which team advanced.
- Slots that have not yet been filled (waiting for a feeder match result) should be clearly indicated as TBD.

## Acceptance criteria

- [ ] Given a bracket exists with seeded teams and some results, when I view the bracket, then I see all rounds with matchups, scores, and advancing teams.
- [ ] Given a bracket exists but no teams have been seeded yet, when I view the bracket, then I see the bracket structure with all slots shown as TBD.
- [ ] Given bracket matches have been played, when I view the bracket, then I can see which team won each match and advanced to the next round.
- [ ] Given no bracket exists for the tournament, when I try to view it, then I receive a "not found" response.

## Notes

- Public endpoint — no authentication required.
