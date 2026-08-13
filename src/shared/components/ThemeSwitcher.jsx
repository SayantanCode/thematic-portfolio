import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X } from "lucide-react";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { useModal } from "@/shared/hooks/useModal.js";

// A radial "gaming HUD" fan instead of a dropdown: theme options are
// angular panels that pop out from the trigger along an arc, staggered so
// they visibly grow from one point to all of them, not a plain list fade.
//
// The arc opens toward the left but isn't a full symmetric 180° — the
// trigger sits close to the viewport's top edge (lg:top-6), so sweeping
// upward past ~200° would push panels above y=0, off-screen and
// unreachable. Biased downward-left instead: still clearly "opens left",
// never clips.
const RADIUS = 118;
const ITEM_WIDTH = 108;
const ITEM_HEIGHT = 50;
// 95° (near-straight-down) put the first panel almost directly under the
// trigger with barely any leftward offset — since the trigger sits close to
// the right edge, the panel's own width then overflowed past it. Starting
// further round the arc guarantees real clearance from frame one.
const START_ANGLE = 110;
// 200° let the last panel's top edge land ~18px above the viewport (verified
// via getBoundingClientRect, not just eyeballed) — the trigger sits only
// ~47px below the top edge, so anything much past straight-left runs out of
// room. 185° keeps a small positive margin on every panel.
const END_ANGLE = 185;

const toRad = (deg) => (deg * Math.PI) / 180;

const describeArc = (cx, cy, r, startAngle, endAngle) => {
  const start = { x: cx + r * Math.cos(toRad(startAngle)), y: cy + r * Math.sin(toRad(startAngle)) };
  const end = { x: cx + r * Math.cos(toRad(endAngle)), y: cy + r * Math.sin(toRad(endAngle)) };
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

// Cut-corner "cyber panel" outline — the same angular-HUD-block language as
// the rest of this site's futuristic styling, instead of a plain rounded
// dropdown row.
const PANEL_CLIP =
  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";

export const ThemeSwitcher = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const panel = useModal();
  const rootRef = useRef(null);

  const handleThemeChange = (t) => {
    setTheme(t);
    panel.close();
  };

  useEffect(() => {
    if (!panel.isOpen) return;

    const handlePointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) panel.close();
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") panel.close();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [panel.isOpen, panel.close]);

  const count = availableThemes.length;
  const angleStep = count > 1 ? (END_ANGLE - START_ANGLE) / (count - 1) : 0;

  return (
    <div ref={rootRef} className="fixed top-20 right-4 lg:top-6 lg:right-6 z-9999 pointer-events-auto">
      <motion.button
        onClick={panel.toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={panel.isOpen ? "Close theme menu" : "Open theme menu"}
        aria-expanded={panel.isOpen}
        className="relative z-10 p-3 glass-card rounded-full text-accent interactive border-accent shadow-accent flex items-center justify-center bg-surface"
      >
        <AnimatePresence mode="wait" initial={false}>
          {panel.isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              <X size={20} />
            </motion.span>
          ) : (
            <motion.span
              key="palette"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              <Palette size={20} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {panel.isOpen && (
          <>
            {/* Decorative connecting arc, sitting behind the panels — draws
                in as the fan opens rather than just appearing. */}
            <svg
              width="300"
              height="300"
              viewBox="0 0 300 300"
              className="absolute top-1/2 left-1/2 pointer-events-none overflow-visible"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <motion.path
                d={describeArc(150, 150, RADIUS, START_ANGLE, END_ANGLE)}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1"
                strokeDasharray="3 6"
                strokeOpacity="0.35"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            </svg>

            {availableThemes.map((t, i) => {
              const angle = START_ANGLE + angleStep * i;
              const rad = toRad(angle);
              const dx = RADIUS * Math.cos(rad) - ITEM_WIDTH / 2;
              const dy = RADIUS * Math.sin(rad) - ITEM_HEIGHT / 2;
              const isActive =
                theme.type === t.type && (t.type === "preset" ? theme.name === t.name : theme.id === t.id);

              return (
                <motion.button
                  key={t.type === "preset" ? t.name : t.id}
                  onClick={() => handleThemeChange(t)}
                  initial={{ opacity: 0, scale: 0, x: -ITEM_WIDTH / 2, y: -ITEM_HEIGHT / 2 }}
                  animate={{ opacity: 1, scale: 1, x: dx, y: dy }}
                  exit={{ opacity: 0, scale: 0, x: -ITEM_WIDTH / 2, y: -ITEM_HEIGHT / 2 }}
                  transition={{ delay: i * 0.055, type: "spring", stiffness: 320, damping: 24 }}
                  className={`interactive absolute top-1/2 left-1/2 flex items-center gap-2 px-3 border ${
                    isActive
                      ? "bg-accent text-bg border-accent"
                      : "bg-surface/95 text-primary border-accent/30 hover:border-accent/70"
                  }`}
                  style={{
                    width: ITEM_WIDTH,
                    height: ITEM_HEIGHT,
                    clipPath: PANEL_CLIP,
                    boxShadow: isActive ? "0 0 16px var(--accent-glow)" : undefined,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-tight leading-tight text-left">
                    {t.label}
                  </span>
                </motion.button>
              );
            })}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
