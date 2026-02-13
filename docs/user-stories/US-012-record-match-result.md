# US-012: Record Match Result

## Story

As a **tournament organizer**,
I want to record the result (score) of a played match,
so that standings are updated and visitors can see the outcome.

## Context

- Builds on US-011 — a match must be scheduled before its result can be recorded.
- The result is the final score for each team (e.g., 3–1).
- Recording a result should be idempotent — an organizer may need to correct a previously entered score.

## Acceptance criteria

- [ ] Given a scheduled match exists, when I record its result with scores for both teams, then the result is persisted and visible in the schedule.
- [ ] Given a match already has a result, when I record a new result, then the previous result is replaced with the updated score.
- [ ] Given the match does not exist, when I try to record a result, then I receive a "not found" response.
- [ ] Given I provide invalid score data (e.g., negative numbers, missing scores), when I try to record a result, then I receive a validation error.

## Notes

- This story is a prerequisite for US-013 (standings), since standings are computed from match results.
- No authentication enforcement in this story (see US-015).
