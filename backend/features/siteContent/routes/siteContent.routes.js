import { Router } from "express";
import { siteContentController } from "../controllers/siteContent.controller.js";
import { asyncHandler } from "express-unified-response";
import { requireAdmin } from "../../../platform/auth/requireAdmin.js";

const router = Router();

router.get("/:key", asyncHandler(siteContentController.getByKey));
router.put("/:key", requireAdmin, asyncHandler(siteContentController.updateByKey));

export const siteContentRoutes = router;
