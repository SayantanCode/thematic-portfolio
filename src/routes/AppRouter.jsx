import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { HomePage } from "@/pages/HomePage.jsx";
import { ROUTES } from "./routeRegistry.js";

/**
 * Single "/" route today (the portfolio, unchanged). Future routed areas —
 * a blog, games — get their own <Route> here under the same MainLayout (or
 * their own layout, if their chrome needs differ), each with an entry in
 * routeRegistry.js.
 */
export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
