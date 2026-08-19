import express from "express";
import {
  createResponseMiddleware,
  createErrorMiddleware,
} from "express-unified-response";
import { applySecurityMiddlewares } from "./security.js";
import { applyRequestId } from "./requestId.js";
import { responseConfig } from "../../config/index.js";

// IMPORTANT: this exact config object is passed to BOTH middlewares below.
// Passing different configs to each would let success and error payloads
// silently drift out of shape.
const sharedConfig = {
  ...responseConfig,
  logger: {
    ...responseConfig.logger,
    onSuccess: (req, status, duration) => {
      console.log(`[${req.id}] ${req.method} ${req.originalUrl} ${status} (${duration}ms)`);
    },
    onError: (req, err, status, duration) => {
      console.error(`[${req.id}] ${req.method} ${req.originalUrl} ${status} ${err?.code} (${duration}ms)`);
    },
    onWarn: (msg, context) => console.warn(`[express-unified-response] ${msg}`, context ?? ""),
  },
};

// Everything that must run BEFORE routes: body parsing, security headers,
// request correlation IDs, and res.success()/res.created()/... helpers.
export function registerPreRouteMiddlewares(app) {
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  applyRequestId(app);
  applySecurityMiddlewares(app);

  // Attaches res.success/created/updated/deleted/list/paginateQuery/... to
  // every response object.
  app.use(createResponseMiddleware(sharedConfig));
}

// Must run AFTER routes are registered — Express identifies error-handling
// middleware by its 4-argument signature (err, req, res, next), and it only
// catches errors from handlers registered earlier in the stack.
export function registerErrorHandling(app) {
  app.use(createErrorMiddleware(sharedConfig));
}
