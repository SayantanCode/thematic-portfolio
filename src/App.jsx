import { useEffect, useState } from "react";
import "./App.css";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ThemeSwitcher } from "./components/ThemeSwitcher.jsx";
import { LiquidCursor } from "./components/LiquidCursor.jsx";
import { InteractiveBackground } from "./components/InteractiveBackground.jsx";
import { Hero } from "./components/Hero.jsx";
import { AboutMe } from "./components/AboutMe.jsx";
import { CoreSystems } from "./components/CoreSystems.jsx";
import { TerminalCLI } from "./components/TerminalCLI.jsx";
import { CodeLab } from "./components/CodeLab.jsx";
import { Insights } from "./components/Insights.jsx";
import { Footer } from "./components/Footer.jsx";
function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <ThemeProvider>
      <div className="relative min-h-screen selection:bg-accent selection:text-[var(--bg)]">
        <ThemeSwitcher />
        <LiquidCursor />
        <InteractiveBackground />

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

        <main className="relative z-10">
          <Hero />
          <AboutMe />
          <CoreSystems />
          <TerminalCLI />
          <CodeLab />
          <Insights />
          <Footer />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
