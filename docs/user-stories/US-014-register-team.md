# US-014: Register a Team for the Tournament

## Story

As a **team captain**,
I want to register my team for the tournament,
so that we are signed up to participate without needing to use an external form.

## Context

- This replaces the current Google Forms registration workflow.
- Registration is a self-service action by the team captain — it does not require admin privileges.
- A registration should capture the team name, captain's name, and contact information (e.g., email or phone).
- Registration establishes the link between the captain and their team — once approved, the captain can manage their own roster (US-007–US-009).
- Registered teams are not immediately added to the active tournament — an organizer reviews and approves them (approval could be a follow-up story).

## Acceptance criteria

- [ ] Given I provide a valid team name, captain name, and contact information, when I submit the registration, then it is recorded and I receive a confirmation.
- [ ] Given I omit required fields (e.g., team name, contact info), when I try to register, then I receive a validation error describing what is missing.
- [ ] Given a registration with the same team name already exists, when I try to register again, then I receive a clear message that the name is already taken.
- [ ] Given I have submitted a registration, when I check back, then my registration is in a "pending" state awaiting organizer review.

## Notes

- This story introduces a registrations table, separate from the teams table. Teams are only created in the tournament by the organizer after reviewing registrations.
- No authentication required — this is a public-facing form.
