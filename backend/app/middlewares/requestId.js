import requestId from "express-request-id";

// Attaches req.id to every request. Threaded through logger hooks in
// index.js so every log line (success or error) is correlatable to one
// request.
export function applyRequestId(app) {
  app.use(requestId());
}
