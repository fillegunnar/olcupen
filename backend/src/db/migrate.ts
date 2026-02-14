import fs from "node:fs";
import path from "node:path";
import pool from "./pool.js";

const migrationsDir = path.join(__dirname, "./migrations");
console.log("Migrations directory:", migrationsDir);    

export async function runMigrations(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const applied = await pool.query<{ name: string }>("SELECT name FROM migrations");
  const appliedSet = new Set(applied.rows.map((r) => r.name));

  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
  console.log("Migration files found:", files);

  for (const file of files) {
    if (appliedSet.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    await pool.query(sql);
    await pool.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
    console.log(`Migration applied: ${file}`);
  }
}
