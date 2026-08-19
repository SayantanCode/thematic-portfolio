import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { HomePage } from "@/pages/HomePage.jsx";
import { BlogListPage } from "@/pages/BlogListPage.jsx";
import { BlogPostPage } from "@/pages/BlogPostPage.jsx";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage.jsx";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage.jsx";
import { AdminSiteContentPage } from "@/pages/admin/AdminSiteContentPage.jsx";
import { AdminBlogListPage } from "@/pages/admin/AdminBlogListPage.jsx";
import { AdminBlogEditorPage } from "@/pages/admin/AdminBlogEditorPage.jsx";
import { AdminProjectsListPage } from "@/pages/admin/AdminProjectsListPage.jsx";
import { AdminProjectEditorPage } from "@/pages/admin/AdminProjectEditorPage.jsx";
import { RequireAdmin } from "@/shared/components/RequireAdmin.jsx";
import { ROUTES } from "./routeRegistry.js";

/**
 * "/" is the portfolio (unchanged). "/blog" and "/blog/:slug" share the same
 * MainLayout chrome (cursor, theme switcher, nav) since they're part of the
 * public site, just routed instead of scrolled to. "/admin/*" is a separate
 * routed area with its own chrome (AdminLayout, not MainLayout) and its own
 * auth guard.
 */
export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.BLOG} element={<BlogListPage />} />
        <Route path={`${ROUTES.BLOG}/:slug`} element={<BlogPostPage />} />
      </Route>

      <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
          <Route path={ROUTES.ADMIN_SITE_CONTENT} element={<AdminSiteContentPage />} />
          <Route path={ROUTES.ADMIN_BLOG} element={<AdminBlogListPage />} />
          <Route path={ROUTES.ADMIN_BLOG_NEW} element={<AdminBlogEditorPage />} />
          <Route path={`${ROUTES.ADMIN_BLOG}/:id/edit`} element={<AdminBlogEditorPage />} />
          <Route path={ROUTES.ADMIN_PROJECTS} element={<AdminProjectsListPage />} />
          <Route path={ROUTES.ADMIN_PROJECTS_NEW} element={<AdminProjectEditorPage />} />
          <Route path={`${ROUTES.ADMIN_PROJECTS}/:id/edit`} element={<AdminProjectEditorPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  </BrowserRouter>
);
