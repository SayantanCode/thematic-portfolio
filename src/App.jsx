import { useEffect, useState } from "react";
import "./App.css";
import { motion, AnimatePresence } from "framer-motion";
import { useSmoothScroll } from "./lib/smoothScroll.js";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ModalProvider } from "./context/ModalContext.jsx";
import { ThemeSwitcher } from "./components/ThemeSwitcher.jsx";
import { LiquidCursor } from "./components/LiquidCursor.jsx";
import { InteractiveBackground } from "./components/InteractiveBackground.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { Hero } from "./components/Hero.jsx";
import { StatsBar } from "./components/StatsBar.jsx";
import { SkillsGrid } from "./components/SkillsGrid.jsx";
import { FeaturedProjects } from "./components/FeaturedProjects.jsx";
import { JourneyTimeline } from "./components/JourneyTimeline.jsx";
import { GlobalCollab } from "./components/GlobalCollab.jsx";
import { GitHubFootprint } from "./components/GitHubFootprint.jsx";
import { Footer } from "./components/Footer.jsx";
import { ScrollDissolve } from "./components/ScrollDissolve.jsx";
import { ScrollFade } from "./components/ScrollFade.jsx";
function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  useSmoothScroll();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <ThemeProvider>
      <ModalProvider>
        <div className="relative min-h-screen selection:bg-accent selection:text-[var(--bg)]">
          <ThemeSwitcher />
          <LiquidCursor />
          <InteractiveBackground />
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

          <main className="relative z-10 lg:pl-20">
            <ScrollDissolve isFirst>
              <Hero />
            </ScrollDissolve>
            <ScrollDissolve>
              <StatsBar />
            </ScrollDissolve>
            <ScrollFade>
              <SkillsGrid />
            </ScrollFade>
            <ScrollFade>
              <FeaturedProjects />
            </ScrollFade>
            <ScrollFade>
              <JourneyTimeline />
            </ScrollFade>
            <ScrollFade>
              <GlobalCollab />
            </ScrollFade>
            <ScrollDissolve>
              <GitHubFootprint />
            </ScrollDissolve>
            <ScrollFade>
              <Footer />
            </ScrollFade>
          </main>
        </div>
      </ModalProvider>
    </ThemeProvider>
  );
}

export default App;
