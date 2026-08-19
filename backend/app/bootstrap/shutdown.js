// Centralized graceful shutdown. Only DB is wired at this stage — this stays
// a single orchestration point so adding a new resource later (a cache, a
// queue) means adding one step here, not hunting through server.js.
export function registerShutdown({ server, dbConnection }) {
  let shuttingDown = false;

  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[shutdown] received ${signal}, closing gracefully...`);

    await new Promise((resolve) => server.close(resolve));

    if (dbConnection) await dbConnection.close();

    console.log("[shutdown] complete");
    process.exit(0);
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("unhandledRejection", (reason) => {
    console.error("[fatal] unhandled rejection:", reason);
    shutdown("unhandledRejection");
  });
}
