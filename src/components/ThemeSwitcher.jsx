import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export const ThemeSwitcher = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (t) => {
    setTheme(t);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 glass-card rounded-full text-accent interactive border-accent shadow-accent flex items-center justify-center bg-surface"
      >
        <Palette size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="glass-card p-4 rounded-xl flex flex-col gap-3 min-w-45 border-accent bg-surface/90 backdrop-blur-md"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
              Select Environment
            </p>

            {availableThemes.map((t) => {
              const isActive =
                theme.type === t.type &&
                (t.type === "preset"
                  ? theme.name === t.name
                  : theme.id === t.id);

              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t)}
                  className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all interactive group ${
                    isActive
                      ? "bg-accent text-bg"
                      : "hover:bg-accent/10 text-primary"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: t.color }}
                  />

                  <span className="text-xs font-mono font-bold tracking-tight">
                    {t.label}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-bg"
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
