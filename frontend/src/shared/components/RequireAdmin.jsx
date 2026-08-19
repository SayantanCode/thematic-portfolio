import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "@/services/authService";
import { ROUTES } from "@/routes/routeRegistry.js";

/**
 * Route guard for /admin/*. Only checks token presence — the real
 * enforcement happens server-side on every admin API call via requireAdmin
 * middleware. A stale/expired token still gets you past this guard, but the
 * first API call 401s, apiClient.js clears it, and the next navigation
 * bounces back here.
 */
export const RequireAdmin = () => {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
