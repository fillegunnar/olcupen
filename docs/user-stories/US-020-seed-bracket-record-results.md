# US-020: Seed Bracket and Record Bracket Results

## Story

As a **tournament organizer**,
I want to seed teams into the finals bracket and record knockout match results,
so that the bracket progresses and visitors can follow the elimination rounds to the final.

## Context

- Builds on US-018 (bracket must exist) and US-013 (group standings determine which teams advance).
- Seeding places teams into bracket slots based on their group stage finish (e.g., 1st in Group A vs. 2nd in Group B).
- Recording a bracket match result should automatically advance the winner to the next round's corresponding slot.
- The organizer may need to manually assign bracket slots if the seeding rules are non-standard.

## Acceptance criteria

- [ ] Given group standings are available and the bracket exists, when the organizer seeds teams into bracket slots, then each specified slot is filled with the correct team.
- [ ] Given a bracket match has both teams assigned, when the organizer records the result, then the winner automatically advances to the next round's corresponding match slot.
- [ ] Given a bracket match result has already been recorded, when the organizer records a corrected result, then the winner is updated and advancement is adjusted accordingly.
- [ ] Given a bracket match does not have both teams assigned yet (TBD slot), when the organizer tries to record a result, then they receive a validation error.
- [ ] Given the organizer tries to seed a team into a slot that is already occupied, when they submit, then they receive a clear error or the existing assignment is replaced.
- [ ] Given the bracket final has a result recorded, when a visitor views the bracket, then the tournament winner is clearly identifiable.

## Notes

- Advancement logic: the winner of match N in round R fills a specific slot in round R+1. This mapping is determined by the bracket structure created in US-018.
- No authentication enforcement in this story (see US-015).
