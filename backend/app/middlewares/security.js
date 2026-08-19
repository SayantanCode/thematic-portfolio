import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { RateLimitError } from "express-unified-response";
import { env } from "../../config/index.js";

// All the "every Express app needs this" security wiring, centralized so
// no individual feature has to remember to add helmet/cors/rate-limiting.
export function applySecurityMiddlewares(app) {
  app.use(helmet());
  app.use(cors({ origin: env.cors.origin, credentials: true }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    // Without this handler, express-rate-limit sends its own plain response
    // that bypasses createErrorMiddleware and looks inconsistent with every
    // other error in the API.
    handler: (req, res, next) => {
      next(new RateLimitError("Too many requests — please slow down"));
    },
  });
  app.use(limiter);
}
