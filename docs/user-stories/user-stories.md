# User Stories — Phase 2: Backend API Development

## Problem Summary

Ölcupen (loaolcup.se) is a Swedish football/beer cup tournament site currently built with static HTML, hardcoded data, and Google Sheets embeds. The tournament needs a proper backend API so that organizers can manage teams, players, matches, and standings dynamically — and visitors can browse up-to-date tournament information without relying on external services.

## User Personas

| Persona                  | Description                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| **Visitor**              | A fan, friend, or curious person who visits the site to check teams, schedules, and standings. |
| **Team Captain**         | A player who leads a team, registers for the tournament, and manages their own team's roster.  |
| **Tournament Organizer** | An admin who sets up the tournament: creates teams, schedules matches, and records results.    |

## Prioritized User Stories

Stories are ordered by dependency and incremental value delivery. Each story is a thin vertical slice that can be developed and shipped independently.

### Teams (Foundation)

| ID     | Title                   | Persona              | Priority |
| ------ | ----------------------- | -------------------- | -------- |
| US-001 | View all teams          | Visitor              | 1        |
| US-002 | Add a team              | Tournament Organizer | 2        |
| US-003 | View team details       | Visitor              | 3        |
| US-004 | Update team information | Tournament Organizer | 4        |
| US-005 | Remove a team           | Tournament Organizer | 5        |

### Groups

| ID     | Title                    | Persona                        | Priority |
| ------ | ------------------------ | ------------------------------ | -------- |
| US-016 | Create and view groups   | Tournament Organizer / Visitor | 6        |
| US-017 | Assign a team to a group | Tournament Organizer           | 7        |

### Players

| ID     | Title                  | Persona                             | Priority |
| ------ | ---------------------- | ----------------------------------- | -------- |
| US-006 | View team roster       | Visitor                             | 8        |
| US-007 | Add a player to a team | Tournament Organizer / Team Captain | 9        |
| US-008 | Update player details  | Tournament Organizer / Team Captain | 10       |
| US-009 | Remove a player        | Tournament Organizer / Team Captain | 11       |

### Matches & Schedule

| ID     | Title                    | Persona              | Priority |
| ------ | ------------------------ | -------------------- | -------- |
| US-010 | View tournament schedule | Visitor              | 12       |
| US-011 | Schedule a match         | Tournament Organizer | 13       |
| US-012 | Record match result      | Tournament Organizer | 14       |

### Standings

| ID     | Title                | Persona | Priority |
| ------ | -------------------- | ------- | -------- |
| US-013 | View group standings | Visitor | 15       |

### Finals Bracket

| ID     | Title                                   | Persona              | Priority |
| ------ | --------------------------------------- | -------------------- | -------- |
| US-018 | Create finals bracket                   | Tournament Organizer | 16       |
| US-019 | View finals bracket                     | Visitor              | 17       |
| US-020 | Seed bracket and record bracket results | Tournament Organizer | 18       |

### Registration

| ID     | Title                              | Persona      | Priority |
| ------ | ---------------------------------- | ------------ | -------- |
| US-014 | Register a team for the tournament | Team Captain | 19       |

### Authentication

| ID     | Title                            | Persona                             | Priority |
| ------ | -------------------------------- | ----------------------------------- | -------- |
| US-015 | Authentication and authorization | Tournament Organizer / Team Captain | 20       |

## Decomposition Rationale

The stories follow the **Elephant Carpaccio** technique — each one is the thinnest possible vertical slice that still delivers end-to-end value:

1. **Teams first.** Teams are the foundational entity. US-001 (view teams) is the natural starting point because it forces establishing the database connection, schema, and first API endpoint — the minimum infrastructure needed for everything else.

2. **Read before write.** Within each domain (teams, players, matches), the "view" story comes before the "create/update/delete" stories. This ensures the data model is validated by a consumer perspective before we build mutation capabilities.

3. **Groups depend on teams.** Groups are a first-class entity that teams are assigned to. US-016 creates the group structure, US-017 assigns teams to groups. This must happen before matches can be scheduled within a group and before standings can be computed per group.

4. **Players depend on teams.** A player belongs to a team, so the players block starts after the teams and groups blocks are in place.

5. **Matches depend on teams and groups.** Matches are played between two teams within a group, so they come after teams exist and groups are established.

6. **Standings depend on match results.** Group standings are computed from match outcomes, making US-013 a natural successor to US-012.

7. **Finals bracket depends on standings.** The knockout stage (US-018–US-020) follows the group stage. The bracket structure is created first, then teams are seeded based on group standings, and bracket results advance winners through rounds to the final.

8. **Registration is independent.** Team registration (US-014) is a self-service flow for team captains. It can be built in parallel with admin CRUD, but is sequenced later because the organizer workflow has higher initial priority for tournament setup.

9. **Authentication is cross-cutting.** Admin auth (US-015) is deliberately placed last. The admin CRUD stories can be developed and tested without authentication first, and auth is then layered on as a security concern. This avoids blocking progress on business logic while the auth mechanism is designed.

## How These Stories Solve the Problem

Together, these 20 stories replace the hardcoded HTML and Google Sheets with a fully dynamic backend:

- **Visitors** get live, always-current team rosters, match schedules, and standings — no more stale data or Google Sheets embeds.
- **Team Captains** can self-register their teams through the site instead of an external Google Form, and manage their own team's roster once approved.
- **Tournament Organizers** can manage the entire tournament lifecycle (teams → groups → players → matches → results → standings → finals bracket) through authenticated admin operations.

Each story delivers a working increment that can be demonstrated, tested, and deployed independently, enabling rapid feedback and iterative refinement.
