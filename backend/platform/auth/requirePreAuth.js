import jwt from "jsonwebtoken";
import { env } from "../../config/index.js";
import { UnauthorizedError, TokenExpiredError, InvalidTokenError } from "../../shared/errors/index.js";

// Gates /auth/totp/* — the narrow window between "password verified" and
// "TOTP verified". Mirrors requireAdmin.js's shape but checks stage instead
// of role, so the two token types can never be used interchangeably.
export function requirePreAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new UnauthorizedError("Missing pre-auth token");
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwt.secret);
  } catch (err) {
    if (err.name === "TokenExpiredError") throw new TokenExpiredError("Login expired, please start over");
    throw new InvalidTokenError("Invalid pre-auth token");
  }

  if (payload.stage !== "password_verified") {
    throw new UnauthorizedError("Invalid pre-auth token");
  }

  req.adminId = payload.sub;
  next();
}
