import jwt from "jsonwebtoken";
import { env } from "../../config/index.js";

// Single-admin setup: no user table, no roles beyond "admin". The token's
// only claim is role, matched by requireAdmin.js on every protected request.
export function issueAdminToken() {
  return jwt.sign({ role: "admin" }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}
