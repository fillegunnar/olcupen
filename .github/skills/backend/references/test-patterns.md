# Test Patterns

## Unit Tests (mocked DB)

File: `backend/src/tests/<entity>.test.ts`

### Setup

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Mock the DB module BEFORE importing the app
vi.mock("../db/teams", () => ({
  getAllTeams: vi.fn(),
  getTeamById: vi.fn(),
  createTeam: vi.fn(),
  updateTeam: vi.fn(),
  deleteTeam: vi.fn(),
  countTeamDependencies: vi.fn(),
}));

import app from "../app.js";
import { getAllTeams, getTeamById, createTeam } from "../db/teams.js";
```

### Builder Functions

```typescript
function buildTeam(overrides: Partial<Team> = {}): Team {
  return {
    id: 1,
    name: "Test Team",
    created_at: new Date("2025-01-01"),
    ...overrides,
  };
}
```

### Test Structure

```typescript
describe("GET /api/teams", () => {
  beforeEach(() => {
    vi.mocked(getAllTeams).mockReset();
  });

  it("returns all teams", async () => {
    const teams = [
      buildTeam({ id: 1, name: "A" }),
      buildTeam({ id: 2, name: "B" }),
    ];
    vi.mocked(getAllTeams).mockResolvedValue(teams);

    const res = await request(app).get("/api/teams");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("returns 500 on DB error", async () => {
    vi.mocked(getAllTeams).mockRejectedValue(new Error("DB down"));

    const res = await request(app).get("/api/teams");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Internal server error");
  });
});
```

### Testing Validation

```typescript
it("returns 400 when name is missing", async () => {
  const res = await request(app).post("/api/teams").send({});
  expect(res.status).toBe(400);
});

it("returns 400 when name is empty string", async () => {
  const res = await request(app).post("/api/teams").send({ name: "   " });
  expect(res.status).toBe(400);
});
```

### Testing Conflict (23505)

```typescript
it("returns 409 on duplicate name", async () => {
  const pgError: any = new Error("duplicate");
  pgError.code = "23505";
  vi.mocked(createTeam).mockRejectedValue(pgError);

  const res = await request(app).post("/api/teams").send({ name: "Existing" });

  expect(res.status).toBe(409);
});
```

## Integration Tests (real DB)

File: `backend/src/tests/<entity>.integration.test.ts`

### Setup

```typescript
import { describe, it, expect } from "vitest";
import request from "supertest";
import {
  describeIfDatabase,
  setupIntegrationDatabase,
} from "./utils/integration-db.js";
import app from "../app.js";

describeIfDatabase("Teams Integration", () => {
  setupIntegrationDatabase();

  describe.sequential("POST /api/teams", () => {
    it("creates a team", async () => {
      const res = await request(app)
        .post("/api/teams")
        .send({ name: "Integration Team" });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Integration Team");
      expect(res.body.id).toBeDefined();
    });

    it("rejects duplicate team name", async () => {
      await request(app).post("/api/teams").send({ name: "Dup Team" });
      const res = await request(app)
        .post("/api/teams")
        .send({ name: "Dup Team" });

      expect(res.status).toBe(409);
    });
  });
});
```

### Key Points

- `describeIfDatabase()` — skips all tests if `DATABASE_URL` is not set
- `setupIntegrationDatabase()` — truncates tables + runs migrations in `beforeAll`, closes pool in `afterAll`
- `describe.sequential` — prevents parallel test execution (avoids race conditions)
- Tests interact with a real PostgreSQL database

## Running Tests

```bash
# Unit tests (mocked, fast)
cd backend && npx vitest --run

# Integration tests via Podman (real DB)
cd /home/gun/repos/olcupen && npm run test:backend:podman
```

Both suites must pass after every change.
