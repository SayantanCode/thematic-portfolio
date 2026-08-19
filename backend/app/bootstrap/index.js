import { bootstrapDatabase } from "./databaseBootstrap.js";
import { bootstrapAdmin } from "./adminBootstrap.js";

// Single orchestration point for startup order. This project only needs a
// database connection (+ the admin seed that depends on it) right now — no
// Redis/queues/sockets/scheduler — but this stays the one place that
// sequence is defined, so adding a new piece of infrastructure later is one
// step here, not a hunt through server.js.
export async function runBootstrap() {
  const dbConnection = await bootstrapDatabase();
  await bootstrapAdmin();
  return { dbConnection };
}
