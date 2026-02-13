# US-013: View Group Standings

## Story

As a **visitor**,
I want to see the current standings for each group,
so that I can follow which teams are leading and how the tournament is progressing.

## Context

- Builds on US-012 — standings are computed from recorded match results.
- The current site uses Google Sheets embeds for standings tables. This story replaces that with dynamically calculated data.
- Standard football standings include: matches played, wins, draws, losses, goals for, goals against, goal difference, and points (3 for a win, 1 for a draw, 0 for a loss).
- Teams within a group should be ranked by points, then goal difference, then goals scored.

## Acceptance criteria

- [ ] Given a group has teams with recorded match results, when I view the group standings, then I see each team's matches played, wins, draws, losses, goals for, goals against, goal difference, and points.
- [ ] Given a group has teams but no matches have been played yet, when I view the standings, then all teams appear with zero values across all columns.
- [ ] Given a group has results, when I view the standings, then teams are ranked by points (descending), then goal difference (descending), then goals scored (descending).
- [ ] Given the group does not exist, when I try to view its standings, then I receive a "not found" response.

## Notes

- Standings should be computed on-the-fly from match results, not stored separately. This avoids data synchronization issues.
