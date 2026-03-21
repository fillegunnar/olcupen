---
name: backend
description: "Backend development for Express/PostgreSQL API. Use when: implementing API endpoints, writing DB queries, creating migrations, adding entity modules, writing unit or integration tests in backend/."
user-invocable: false
---

# Backend Development

## Tech Stack

- **Runtime**: Node.js 22, TypeScript 5.7 (ES2022, NodeNext modules)
- **Framework**: Express 5 with async route handlers
- **Database**: PostgreSQL 16 with `pg` (node-postgres), raw parameterized SQL — no ORM
- **Testing**: Vitest + Supertest (unit), Vitest + real PostgreSQL (integration)
- **Dev**: `tsx` watch mode, Podman Compose for test DB

## Project Layout

```
backend/src/
├── app.ts              # Express app setup (middleware, route mounting)
├── index.ts            # Server startup (migrations, listen)
├── api/
│   └── <entity>.ts     # Express Router with REST endpoints
├── db/
│   ├── pool.ts         # pg Pool singleton
│   ├── <entity>.ts     # Query functions (raw SQL, parameterized)
│   ├── migrate.ts      # Migration runner
│   └── migrations/
│       └── NNN_<name>.sql
└── tests/
    ├── <entity>.test.ts               # Unit tests (mocked DB)
    ├── <entity>.integration.test.ts   # Integration tests (real DB)
    └── utils/
        └── integration-db.ts          # Test DB setup helpers
```

## Procedure: New Entity / Feature

### 1. Migration

Create `backend/src/db/migrations/NNN_<description>.sql`:

- Number sequentially (e.g., `003_create_matches.sql`)
- Use `CREATE TABLE IF NOT EXISTS`
- Define constraints inline (UNIQUE, NOT NULL, FK with ON DELETE CASCADE)
- Migrations run automatically on server start

### 2. DB Module

Create `backend/src/db/<entity>.ts`:

- Define TypeScript interfaces for the entity
- Export async functions that use `pool.query<T>()` with parameterized queries (`$1`, `$2`...)
- Return `result.rows` for lists, `result.rows[0] || null` for single items
- See [DB patterns reference](./references/db-patterns.md)

### 3. API Routes

Create `backend/src/api/<entity>.ts`:

- Export an Express `Router`
- Use async handlers with try/catch
- Validate request body/params at the top of each handler
- Map PostgreSQL error codes to HTTP statuses (23505 → 409, etc.)
- Mount the router in `app.ts` under `/api/<entity>`
- See [API patterns reference](./references/api-patterns.md)

### 4. Unit Tests

Create `backend/src/tests/<entity>.test.ts`:

- Mock the DB module with `vi.mock("../db/<entity>")`
- Import mocked functions and cast with `vi.mocked()`
- Use `supertest(app)` for HTTP assertions
- Create builder functions for test data (`buildEntity()`)
- Reset mocks in `beforeEach`
- See [test patterns reference](./references/test-patterns.md)

### 5. Integration Tests

Create `backend/src/tests/<entity>.integration.test.ts`:

- Use `describeIfDatabase()` from `./utils/integration-db`
- Use `describe.sequential` to avoid race conditions
- Call `setupIntegrationDatabase()` for table truncation + migration
- Test against a real PostgreSQL instance
- See [test patterns reference](./references/test-patterns.md)

### 6. Run Tests

After making changes, always run both test suites:

```bash
# Unit tests (fast, mocked DB)
cd backend && npx vitest --run

# Integration tests (requires Podman)
cd /home/gun/repos/olcupen && npm run test:backend:podman
```

Both must pass before the work is considered complete.

## Key Conventions

- **Parameterized queries only** — never interpolate user input into SQL
- **Validation in route handlers** — check types, trim strings, reject empty values
- **Error codes**: 400 (validation), 404 (not found), 409 (conflict/duplicate), 500 (internal)
- **PostgreSQL error `23505`** → duplicate key → return 409
- **Dependency checks** before delete (count related rows, return 409 if non-zero)
- **Console.error** before returning 500 responses
- **No ORMs or query builders** — raw SQL with `pg`
- **Interfaces** defined in the DB module, co-located with queries
- **Express 5** — async errors propagate automatically (no need for `next(err)`)
