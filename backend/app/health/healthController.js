import { checkHealth } from "./healthService.js";

// No try/catch needed — createErrorMiddleware catches anything thrown here.
export async function getHealth(req, res) {
  const result = checkHealth();
  if (!result.healthy) {
    return res.status(503).json({ success: false, data: result });
  }
  res.success(result, "OK");
}
