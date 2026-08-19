// Thin re-export. Every feature imports its error classes from HERE
// (shared/errors), not from express-unified-response directly — so if the
// underlying package ever changes, only this one file changes.
export {
  AppError,
  BadRequestError,
  ValidationError,
  NotFoundError,
  MethodNotAllowedError,
  PayloadTooLargeError,
  RateLimitError,
  UnauthorizedError,
  ForbiddenError,
  TokenExpiredError,
  InvalidTokenError,
  ExternalServiceError,
  DatabaseError,
  createAppError,
} from "express-unified-response";
