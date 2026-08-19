export { env } from "./env.js";

// Response/error-format config for express-unified-response.
// Passed identically to createResponseMiddleware AND createErrorMiddleware —
// skipping this for either one makes success and error payloads drift out
// of shape with each other.
export const responseConfig = {
  restDefaults: {
    deleteReturnsNoContent: true,
    updateReturnsBody: true,
    nonPaginatedMaxItems: 1000,
  },
  pagination: {
    defaults: { page: 1, limit: 20, maxLimit: 100 },
  },
  logger: {
    logLevel: process.env.NODE_ENV === "production" ? "error" : "all",
  },
  error: {
    exposeStack: process.env.NODE_ENV !== "production",
    exposeErrorName: false,
  },
  routeNotFound: true,
};
