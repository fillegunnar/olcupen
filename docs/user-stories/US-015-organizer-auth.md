# US-015: Authentication and Authorization

## Story

As a **tournament organizer** or **team captain**,
I want to log in to the system with my credentials,
so that only authorized people can perform actions they are allowed to do.

## Context

- This is a cross-cutting story that secures all write operations introduced in earlier stories.
- The current site has no admin functionality — everything is edited manually. This story enables secure access for both organizers and team captains.
- Two roles exist with different permissions:
  - **Tournament organizer:** full access to manage teams, groups, players, matches, and results.
  - **Team captain:** can manage the roster (add, update, remove players) for their own team only.
- Session or token-based authentication is expected.
- Captain accounts are created as a result of team registration (US-014) being approved.
- Only a small number of organizers need access (not a public sign-up flow).

## Acceptance criteria

- [ ] Given I am a registered organizer, when I provide valid credentials, then I receive a session or token that grants access to organizer operations.
- [ ] Given I am a team captain with an approved registration, when I provide valid credentials, then I receive a session or token that grants access to manage my own team's roster.
- [ ] Given I provide invalid credentials, when I try to log in, then I receive an "unauthorized" error and no access is granted.
- [ ] Given I am not authenticated, when I try to perform a protected operation, then my request is rejected with an appropriate error.
- [ ] Given I am a team captain, when I try to perform an organizer-only operation (e.g., creating a team, scheduling a match), then my request is rejected.
- [ ] Given I am a team captain, when I try to manage another team's roster, then my request is rejected.
- [ ] Given my session or token has expired, when I try to perform a protected operation, then my request is rejected and I must log in again.

## Notes

- Once this story is implemented, all write endpoints from previous stories should be protected behind authentication and role-based authorization.
- Organizer accounts can be seeded or created manually — no self-registration for admins is needed.
- Captain accounts are tied to the team registration flow (US-014).
