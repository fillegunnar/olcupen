# US-005: Remove a Team

## Story

As a **tournament organizer**,
I want to remove a team from the tournament,
so that teams that have withdrawn or were added by mistake are no longer listed.

## Context

- Builds on US-002.
- Removing a team that has players or scheduled matches is a potentially destructive action. This story should address what happens in those cases.
- Consider soft-delete vs. hard-delete depending on whether historical data matters at this stage.

## Acceptance criteria

- [ ] Given a team exists and has no players or scheduled matches, when I remove it, then it no longer appears in the team list.
- [ ] Given a team has players or scheduled matches, when I try to remove it, then I receive a clear error explaining the team cannot be removed until its dependencies are resolved.
- [ ] Given the identifier does not match any team, when I try to remove it, then I receive a "not found" response.

## Notes

- The dependency check protects data integrity. An organizer must first remove players and cancel matches before deleting a team.
- No authentication enforcement in this story (see US-015).
