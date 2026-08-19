import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { Button } from "@/shared/ui/Button.jsx";
import { ROUTES } from "@/routes/routeRegistry.js";

const NAV_ITEMS = [
  { to: ROUTES.ADMIN, label: "Dashboard", end: true },
  { to: ROUTES.ADMIN_SITE_CONTENT, label: "Site Content" },
  { to: ROUTES.ADMIN_BLOG, label: "Blog" },
  { to: ROUTES.ADMIN_PROJECTS, label: "Projects" },
];

export const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.clearToken();
    navigate(ROUTES.ADMIN_LOGIN, { replace: true });
  };

  return (
    <div className="cursor-restore min-h-screen bg-bg text-text">
      <header className="flex items-center justify-between border-b border-glass-border px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="text-xs font-black uppercase tracking-widest text-accent">
            Admin
          </span>
          <nav className="flex items-center gap-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-widest transition-colors ${
                    isActive ? "text-accent" : "text-text-muted hover:text-text"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Log Out
        </Button>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};
