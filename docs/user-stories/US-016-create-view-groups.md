# US-016: Create and View Groups

## Story

As a **tournament organizer**,
I want to create groups for the tournament (e.g., Group A, Group B) and as a **visitor** see which groups exist,
so that the tournament structure is defined and visible before teams are assigned or matches scheduled.

## Context

- Groups are a foundational tournament concept — matches are played within a group, and standings are calculated per group.
- Currently, "group" was treated as a free-text label on a team. This story promotes groups to a first-class entity with their own identity and name.
- The organizer decides how many groups the tournament will have based on the number of teams registered.
- Group names are typically short labels (e.g., "A", "B", "C" or "Group A", "Group B").

## Acceptance criteria

- [ ] Given the organizer provides a valid group name, when they create a group, then it is persisted and appears in the list of groups.
- [ ] Given groups exist, when a visitor views the list of groups, then all groups are returned with their name.
- [ ] Given no groups have been created yet, when a visitor views the list of groups, then they receive an empty list (not an error).
- [ ] Given a group with the same name already exists, when the organizer tries to create a duplicate, then they receive a clear error.

## Notes

- This story introduces the groups table and migration.
- Viewing groups is a public read endpoint; creating groups is an admin operation.
- This should be done before teams are assigned to groups (US-017) and before matches are scheduled (US-011).
