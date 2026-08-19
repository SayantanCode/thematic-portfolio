import mongoose from "mongoose";

// Checked by the /health endpoint.
export function checkHealth() {
  const checks = {
    mongo: mongoose.connection.readyState === 1 ? "up" : "down",
  };
  const healthy = Object.values(checks).every((v) => v === "up");
  return { healthy, checks };
}
