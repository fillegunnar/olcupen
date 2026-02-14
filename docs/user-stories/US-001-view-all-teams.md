# US-001: View All Teams

## Story

As a **visitor**,
I want to see a list of all teams participating in the tournament,
so that I can quickly find out which teams are playing.

## Context

- This is the foundational story — it establishes the database connection, teams table, and first API endpoint.
- The current site has team information hardcoded in HTML. This story replaces that with dynamic data.
- The list should return basic team information (name) without full roster details. Group assignment, if present, is managed through US-017.

## Acceptance criteria

- [x] Given the tournament has registered teams, when I request the list of teams, then I receive all teams with their name.
- [x] Given no teams have been registered yet, when I request the list of teams, then I receive an empty list (not an error).
- [x] Given the service is running, when I request the list of teams, then the response is returned in a structured, consistent format.

## Notes

- This story drives the creation of the database schema for teams and the first migration.
- No authentication required — this is a public read endpoint.
