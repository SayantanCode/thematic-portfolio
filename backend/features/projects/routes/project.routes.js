import { Router } from "express";
import { projectController } from "../controllers/project.controller.js";
import { asyncHandler } from "express-unified-response";
import { requireAdmin } from "../../../platform/auth/requireAdmin.js";

const router = Router();

router.get("/", asyncHandler(projectController.listPublished));

router.get("/admin/all", requireAdmin, asyncHandler(projectController.listAllAdmin));
router.get("/admin/:id", requireAdmin, asyncHandler(projectController.getByIdAdmin));
router.post("/", requireAdmin, asyncHandler(projectController.create));
router.put("/:id", requireAdmin, asyncHandler(projectController.update));
router.delete("/:id", requireAdmin, asyncHandler(projectController.remove));

export const projectRoutes = router;
