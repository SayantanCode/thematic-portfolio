import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authController } from "../controllers/auth.controller.js";
import { asyncHandler, RateLimitError } from "express-unified-response";
import { requireAdmin } from "../../../platform/auth/requireAdmin.js";
import { requirePreAuth } from "../../../platform/auth/requirePreAuth.js";

const router = Router();

// Tighter than the global limiter (app/middlewares/security.js) — these are
// the public write-ish/brute-forceable endpoints worth guarding.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new RateLimitError("Too many attempts — try again later"));
  },
});

// asyncHandler wraps handlers so thrown/rejected errors reach
// createErrorMiddleware automatically (required on Express 4).

// Step 1: username + password -> preAuthToken + whether TOTP is enrolled yet.
router.post("/login", authLimiter, asyncHandler(authController.login));

// Step 2a (first login only): generate/re-generate a pending secret + QR.
router.get("/totp/setup", authLimiter, requirePreAuth, asyncHandler(authController.getTotpSetup));
// Step 2a confirm: first code against the freshly-scanned secret enables it.
router.post("/totp/confirm", authLimiter, requirePreAuth, asyncHandler(authController.confirmTotpSetup));

// Step 2b (every login after enrollment): code against the stored secret.
router.post("/totp/verify", authLimiter, requirePreAuth, asyncHandler(authController.verifyTotp));

// Lets the frontend guard confirm a stored session token is still valid.
router.get("/me", requireAdmin, (req, res) => res.success({ role: req.admin.role }, "OK"));

export const authRoutes = router;
