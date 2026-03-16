# User Stories — Phase 2a (Frontend Styling) & Phase 2b (Backend API Development)

## Problem Summary

Ölcupen (loaolcup.se) is a Swedish football/beer cup tournament site currently built with static HTML, hardcoded data, and Google Sheets embeds. The transformation happens in two phases:

- **Phase 2a:** Improve the existing static frontend with modern styling (TailwindCSS), responsive design, and new content pages (Hall of Fame, History, Do You Know?).
- **Phase 2b:** Build a backend API so organizers can manage teams, players, matches, and standings dynamically — replacing hardcoded data and external services.

## User Personas

| Persona                  | Description                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| **Visitor**              | A fan, friend, or curious person who visits the site to check teams, schedules, and standings. |
| **Team Captain**         | A player who leads a team, registers for the tournament, and manages their own team's roster.  |
| **Tournament Organizer** | An admin who sets up the tournament: creates teams, schedules matches, and records results.    |

## Prioritized User Stories

Stories are ordered by dependency and incremental value delivery. Each story is a thin vertical slice that can be developed and shipped independently.

### Frontend Styling & Content (Phase 2a)

| ID     | Title                               | Persona | Priority |
| ------ | ----------------------------------- | ------- | -------- |
| US-021 | Improve responsive design & styling | Visitor | 1        |
| US-022 | Hall of Fame                        | Visitor | 2        |
| US-023 | Tournament History                  | Visitor | 3        |
| US-024 | Do You Know? Trivia & Facts         | Visitor | 4        |

### Performance & User Experience

| ID     | Title                                   | Persona | Priority |
| ------ | --------------------------------------- | ------- | -------- |
| US-025 | Fast load times & support slow networks | All     | 5        |

### Teams (Foundation)

| ID     | Title                   | Persona              | Priority |
| ------ | ----------------------- | -------------------- | -------- |
| US-001 | View all teams          | Visitor              | 6        |
| US-002 | Add a team              | Tournament Organizer | 7        |
| US-003 | View team details       | Visitor              | 8        |
| US-004 | Update team information | Tournament Organizer | 9        |
| US-005 | Remove a team           | Tournament Organizer | 10       |

### Groups

| ID     | Title                    | Persona                        | Priority |
| ------ | ------------------------ | ------------------------------ | -------- |
| US-016 | Create and view groups   | Tournament Organizer / Visitor | 11       |
| US-017 | Assign a team to a group | Tournament Organizer           | 12       |

### Players

| ID     | Title                  | Persona                             | Priority |
| ------ | ---------------------- | ----------------------------------- | -------- |
| US-006 | View team roster       | Visitor                             | 13       |
| US-007 | Add a player to a team | Tournament Organizer / Team Captain | 14       |
| US-008 | Update player details  | Tournament Organizer / Team Captain | 15       |
| US-009 | Remove a player        | Tournament Organizer / Team Captain | 16       |

### Matches & Schedule

| ID     | Title                    | Persona              | Priority |
| ------ | ------------------------ | -------------------- | -------- |
| US-010 | View tournament schedule | Visitor              | 17       |
| US-011 | Schedule a match         | Tournament Organizer | 18       |
| US-012 | Record match result      | Tournament Organizer | 19       |

### Standings

| ID     | Title                | Persona | Priority |
| ------ | -------------------- | ------- | -------- |
| US-013 | View group standings | Visitor | 20       |

### Finals Bracket

| ID     | Title                                   | Persona              | Priority |
| ------ | --------------------------------------- | -------------------- | -------- |
| US-018 | Create finals bracket                   | Tournament Organizer | 21       |
| US-019 | View finals bracket                     | Visitor              | 22       |
| US-020 | Seed bracket and record bracket results | Tournament Organizer | 23       |

### Registration

| ID     | Title                              | Persona      | Priority |
| ------ | ---------------------------------- | ------------ | -------- |
| US-014 | Register a team for the tournament | Team Captain | 24       |

### Authentication

| ID     | Title                            | Persona                             | Priority |
| ------ | -------------------------------- | ----------------------------------- | -------- |
| US-015 | Authentication and authorization | Tournament Organizer / Team Captain | 25       |

## Decomposition Rationale

The stories follow the **Elephant Carpaccio** technique — each one is the thinnest possible vertical slice that still delivers end-to-end value:

### Phase 2a: Frontend Styling & Content

1. **US-021 (Responsive Design).** Before adding new pages and content, establish a modern, responsive design system using TailwindCSS. This creates a consistent foundation for the pages that follow.

2. **US-022, US-023, US-024 (Content Pages).** These three stories add new static pages that enhance visitor engagement and preserve tournament history. They can be built in parallel after the design system is in place, and require no backend integration initially (data is hardcoded).

3. **US-025 (Performance & Slow Networks).** A cross-cutting concern that applies throughout Phase 2a and Phase 2b. The tournament venue has poor network coverage, so all pages must load quickly and provide clear feedback during slow loads. This includes loading indicators, skeleton screens, optimized asset delivery, and support for slow 3G connections. Should be prioritized early and integrated into all frontend development.

### Phase 2b: Backend API Development

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

**Phase 2a** improves the visitor experience with modern styling and engaging content about the tournament's history and achievements — keeping the site fresh and appealing.

**Phase 2b** together, the 20 backend stories replace the hardcoded HTML and Google Sheets with a fully dynamic system:

Each story delivers a working increment that can be demonstrated, tested, and deployed independently, enabling rapid feedback and iterative refinement.
