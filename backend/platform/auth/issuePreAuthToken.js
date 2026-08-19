import jwt from "jsonwebtoken";
import { env } from "../../config/index.js";

// Issued after password verification, before TOTP. Deliberately NOT a
// role:"admin" token — requireAdmin.js rejects it, so a pre-auth token alone
// can't reach any protected data route, only the /auth/totp/* steps.
export function issuePreAuthToken(adminId) {
  return jwt.sign({ stage: "password_verified", sub: String(adminId) }, env.jwt.secret, {
    expiresIn: env.jwt.preAuthExpiresIn,
  });
}
