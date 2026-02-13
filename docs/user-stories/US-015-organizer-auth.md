# US-015: Organizer Authentication

## Story

As a **tournament organizer**,
I want to log in to the system with my credentials,
so that only authorized people can manage teams, players, matches, and results.

## Context

- This is a cross-cutting story that secures all admin/write operations introduced in earlier stories (US-002, US-004, US-005, US-007–US-009, US-011–US-012).
- The current site has no admin functionality — everything is edited manually. This story enables secure admin access.
- Only a small number of organizers need access (not a public sign-up flow).
- Session or token-based authentication is expected.

## Acceptance criteria

- [ ] Given I am a registered organizer, when I provide valid credentials, then I receive a session or token that grants access to admin operations.
- [ ] Given I provide invalid credentials, when I try to log in, then I receive an "unauthorized" error and no access is granted.
- [ ] Given I am not authenticated, when I try to perform an admin operation (e.g., adding a team, recording a result), then my request is rejected with an appropriate error.
- [ ] Given I have a valid session or token, when I perform an admin operation, then it succeeds as expected.
- [ ] Given my session or token has expired, when I try to perform an admin operation, then my request is rejected and I must log in again.

## Notes

- Once this story is implemented, all admin endpoints from previous stories should be protected behind authentication.
- Organizer accounts can be seeded or created manually — no self-registration for admins is needed.
