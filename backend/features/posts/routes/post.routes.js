import { Router } from "express";
import rateLimit from "express-rate-limit";
import { postController } from "../controllers/post.controller.js";
import { asyncHandler, RateLimitError } from "express-unified-response";
import { requireAdmin } from "../../../platform/auth/requireAdmin.js";

const router = Router();

// Public write endpoints (view/like, no auth) — same "guard the open door"
// reasoning as theme.routes.js's publicWriteLimiter. More generous than
// that one since normal reading/liking across several posts in a session
// is expected, benign traffic.
const engagementLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new RateLimitError("Too many requests — try again later"));
  },
});

// Public — published only.
router.get("/", asyncHandler(postController.listPublished));

// Admin — mounted before the public "/:slug" so "admin" as a slug segment
// never gets swallowed by it (segment count already prevents the collision,
// but registering these first is the defensive, unambiguous choice).
router.get("/admin/all", requireAdmin, asyncHandler(postController.listAllAdmin));
router.get("/admin/:id", requireAdmin, asyncHandler(postController.getByIdAdmin));
router.post("/", requireAdmin, asyncHandler(postController.create));
router.put("/:id", requireAdmin, asyncHandler(postController.update));
router.delete("/:id", requireAdmin, asyncHandler(postController.remove));

// Public — single published post by slug. Registered last among GETs.
router.get("/:slug", asyncHandler(postController.getBySlugPublished));

// Public — anonymous view/like, dedup'd by client-generated id (see
// postInteraction.model.js). Different segment count than "/:slug" above so
// registration order relative to it doesn't matter for route matching.
router.post("/:slug/view", engagementLimiter, asyncHandler(postController.trackView));
router.post("/:slug/like", engagementLimiter, asyncHandler(postController.toggleLike));

export const postRoutes = router;
