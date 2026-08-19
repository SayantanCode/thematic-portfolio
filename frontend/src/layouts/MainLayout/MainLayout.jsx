import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSmoothScroll } from "@/shared/lib/smoothScroll.js";
import { ThemeSwitcher } from "@/shared/components/ThemeSwitcher.jsx";
import { LiquidCursor } from "@/shared/components/LiquidCursor.jsx";
import { InteractiveBackground } from "@/shared/components/InteractiveBackground.jsx";
import SplashCursor from "@/shared/components/SplashCursor.jsx";
import { Sidebar } from "./Sidebar.jsx";

/**
 * The site shell every route renders inside: persistent nav (Sidebar),
 * ambient chrome (theme switcher, custom cursor, WebGL background/splash
 * effects), the mount/preloader screen, and Lenis smooth-scroll — all of
 * this used to live directly in App.jsx.
 */
export const MainLayout = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useSmoothScroll();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-accent selection:text-[var(--bg)]">
      <ThemeSwitcher />
      <LiquidCursor />
      <InteractiveBackground />
      {/* enableTouch off for now while testing on touch devices — flip
          back on (or make it conditional) here later without touching
          SplashCursor.jsx itself. */}
      <SplashCursor enableTouch={false} />
      <Sidebar />

      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="preloader"
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[var(--bg)] flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                repeatType: "reverse",
              }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-1 bg-accent/10 rounded-full mb-4 overflow-hidden relative">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="absolute top-0 bottom-0 w-1/2 bg-accent shadow-accent"
                />
              </div>
              <span className="font-mono text-accent tracking-tighter text-sm uppercase">
                ...Mounting Your Mind...
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* pb-24 clears the fixed mobile bottom tab bar (~64px bar + 16px
          margin + breathing room) so it never overlaps page content —
          Footer especially, since nothing follows it to push it clear. */}
      <main className="relative z-10 pb-24 lg:pb-0 lg:pl-20">
        <Outlet />
      </main>
    </div>
  );
};
