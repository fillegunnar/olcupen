import app from "./app.js";
import { runMigrations } from "./db/migrate.js";

const PORT = process.env.PORT || 3001;

async function start() {
  await runMigrations();
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
