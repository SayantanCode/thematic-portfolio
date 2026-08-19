import jwt from "jsonwebtoken";
import { env } from "../../config/index.js";
import { UnauthorizedError, TokenExpiredError, InvalidTokenError } from "../../shared/errors/index.js";

// Verifies the same "Authorization: Bearer <jwt>" header the frontend's
// apiClient.js already sends on every request via the `api` (authed) client.
// Synchronous throws here are caught by Express 4's own try/catch around
// middleware — no asyncHandler needed.
export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new UnauthorizedError("Missing authentication token");
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwt.secret);
  } catch (err) {
    if (err.name === "TokenExpiredError") throw new TokenExpiredError("Session expired, please log in again");
    throw new InvalidTokenError("Invalid authentication token");
  }

  if (payload.role !== "admin") {
    throw new UnauthorizedError("Admin access required");
  }

  req.admin = payload;
  next();
}
