import { getHealth } from "../health/healthController.js";
import { authRoutes } from "../../features/auth/routes/auth.routes.js";
import { siteContentRoutes } from "../../features/siteContent/routes/siteContent.routes.js";
import { postRoutes } from "../../features/posts/routes/post.routes.js";
import { projectRoutes } from "../../features/projects/routes/project.routes.js";
import { themeRoutes } from "../../features/theme/routes/theme.routes.js";
import { mediaRoutes } from "../../features/media/routes/media.routes.js";
// ...one line per feature. This file's only job is mounting — no logic.

export function registerRoutes(app) {
  app.get("/health", getHealth);

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/site-content", siteContentRoutes);
  app.use("/api/v1/posts", postRoutes);
  app.use("/api/v1/projects", projectRoutes);
  app.use("/api/v1/theme", themeRoutes);
  app.use("/api/v1/media", mediaRoutes);

  // 404 for unmatched routes is handled by createErrorMiddleware's
  // routeNotFound option (app/middlewares/index.js) — no separate
  // notFound.js middleware needed.
}
