import { afterAll, beforeAll, beforeEach, describe } from "vitest";
import { runMigrations } from "../../db/migrate.js";
import pool from "../../db/pool.js";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export function describeIfDatabase(
  title: string,
  suite: () => void | Promise<void>,
): void {
  if (hasDatabaseUrl) {
    describe.sequential(title, suite);
    return;
  }

  describe.skip(title, suite);
}

let isPoolClosed = false;

export function setupIntegrationDatabase(
  tablesToTruncate: string[] = ["teams"],
): void {
  beforeAll(async () => {
    await runMigrations();
  });

  beforeEach(async () => {
    const joinedTables = tablesToTruncate.join(", ");
    await pool.query(`TRUNCATE TABLE ${joinedTables} RESTART IDENTITY CASCADE`);
  });

  afterAll(async () => {
    if (isPoolClosed) return;
    isPoolClosed = true;
    await pool.end();
  });
}
