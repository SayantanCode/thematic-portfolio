import express from "express";
import { registerPreRouteMiddlewares, registerErrorHandling } from "./app/middlewares/index.js";
import { registerRoutes } from "./app/routes/index.js";

// Builds and returns the Express app. Does NOT listen — server.js does that.
// Splitting these lets tests import buildApp() and hit it with supertest
// without ever binding a real port.
//
// Order matters and is deliberately explicit here rather than hidden inside
// one "registerMiddlewares" call: body parsing/security/response-helpers must
// come BEFORE routes, and the centralized error handler must come AFTER —
// Express dispatches error middleware by argument count (err, req, res, next),
// and it only catches errors from handlers registered before it.
export function buildApp() {
  const app = express();

  registerPreRouteMiddlewares(app); // body parsing, security, request-id, res.success/created/...
  registerRoutes(app);              // health check + versioned feature routers
  registerErrorHandling(app);       // must be last — see comment above

  return app;
}
