import http from "http";
import { buildApp } from "./app.js";
import { runBootstrap } from "./app/bootstrap/index.js";
import { registerShutdown } from "./app/bootstrap/shutdown.js";
import { env } from "./config/index.js";

// This file does exactly one thing: start the process. If you're hunting
// for "where does Mongo connect", it's not here — see app/bootstrap/*, and
// middleware ordering lives in app.js.
async function start() {
  const app = buildApp();
  const server = http.createServer(app);

  const resources = await runBootstrap();

  server.listen(env.port, () => {
    console.log(`[api] listening on port ${env.port} (${env.nodeEnv})`);
  });

  registerShutdown({ server, ...resources });
}

start().catch((err) => {
  console.error("[api] fatal startup error:", err);
  process.exit(1);
});
