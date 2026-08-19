import { Router } from "express";
import rateLimit from "express-rate-limit";
import { themeController } from "../controllers/theme.controller.js";
import { asyncHandler, RateLimitError } from "express-unified-response";

const router = Router();

// The one genuinely public write surface in this backend (every other
// mutation route is requireAdmin-gated) — any visitor can save/overwrite
// the shared custom theme, by explicit product decision. Rate-limited
// against abuse of that open door; reads stay unlimited.
const publicWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new RateLimitError("Too many theme updates — try again later"));
  },
});

router.get("/", asyncHandler(themeController.list));
router.post("/", publicWriteLimiter, asyncHandler(themeController.create));
router.put("/", publicWriteLimiter, asyncHandler(themeController.update));
router.delete("/:id", publicWriteLimiter, asyncHandler(themeController.remove));

export const themeRoutes = router;
