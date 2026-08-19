// Public surface of the auth feature. Other features/routes import from
// HERE, never by reaching into features/auth/services/... directly.
export { authService } from "./services/auth.service.js";
export { authRoutes } from "./routes/auth.routes.js";
