import React, { Suspense, lazy } from "react";
import { usePrefersReducedMotionOrLowPower } from "@/shared/hooks/usePrefersReducedMotionOrLowPower";

const SceneBackground = lazy(() => import("./SceneBackground.jsx"));

export const InteractiveBackground = () => {
  const reduceMotion = usePrefersReducedMotionOrLowPower();

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-bg transition-colors duration-500">
      {/* Base gradient: theme-aware depth via var(--surface) / var(--bg) */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-40"
        style={{
          background: `linear-gradient(to bottom right, var(--surface), var(--bg))`,
        }}
      />

      {/* Theme-reactive WebGL particle field; skipped on reduced-motion/low-power devices */}
      {!reduceMotion && (
        <Suspense fallback={null}>
          <SceneBackground />
        </Suspense>
      )}

      {/* Grid Pattern: uses 'var(--accent)' for the dots */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(var(--accent) 1px, transparent 10px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
};
