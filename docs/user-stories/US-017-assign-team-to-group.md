# US-017: Assign a Team to a Group

## Story

As a **tournament organizer**,
I want to assign a team to a group,
so that the team is part of the correct group for scheduling and standings.

## Context

- Builds on US-016 (groups must exist) and US-002 (teams must exist).
- This is the "draw" step — after teams and groups are created, the organizer assigns each team to a group.
- A team belongs to exactly one group. Reassignment (moving a team from one group to another) should also be supported.
- There may be a practical limit on how many teams fit in a group, but this can be left flexible for now.

## Acceptance criteria

- [ ] Given a team and a group both exist, when the organizer assigns the team to the group, then the team is associated with that group and this is visible when viewing the team or the group.
- [ ] Given a team is already in a group, when the organizer assigns it to a different group, then the team moves to the new group and is no longer in the old one.
- [ ] Given the team does not exist, when the organizer tries to assign it to a group, then they receive a "not found" response.
- [ ] Given the group does not exist, when the organizer tries to assign a team to it, then they receive a "not found" response.
- [ ] Given a group has teams assigned, when a visitor views the group, then they can see which teams belong to it.

## Notes

- This story bridges teams and groups. Once it's in place, match scheduling (US-011) and standings (US-013) can properly reference validated groups.
- No authentication enforcement in this story (see US-015).
