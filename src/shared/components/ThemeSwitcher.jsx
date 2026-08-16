import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X, ChevronUp, ChevronDown } from "lucide-react";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { useModal } from "@/shared/hooks/useModal.js";
import { useLenisLock } from "@/shared/hooks/useLenisLock.js";
import { radialThemeTransition, crossesLightDarkBoundary, warmIsLightCache } from "@/shared/lib/viewTransition.js";

const VISIBLE_COUNT = 3;
const RADIUS = 160;
const ITEM_WIDTH = 104;
const ITEM_HEIGHT = 44;

const START_ANGLE = 70;
const END_ANGLE = 240;

const ITEM_START_ANGLE = 112;
const ITEM_END_ANGLE = 186;

const toRad = (deg) => (deg * Math.PI) / 180;

const describeArc = (cx, cy, r, startAngle, endAngle) => {
  const start = { x: cx + r * Math.cos(toRad(startAngle)), y: cy + r * Math.sin(toRad(startAngle)) };
  const end = { x: cx + r * Math.cos(toRad(endAngle)), y: cy + r * Math.sin(toRad(endAngle)) };
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

const PANEL_CLIP =
  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";

const slotAngleStep = VISIBLE_COUNT > 1 ? (ITEM_END_ANGLE - ITEM_START_ANGLE) / (VISIBLE_COUNT - 1) : 0;
const SLOT_ANGLES = Array.from({ length: VISIBLE_COUNT }, (_, i) => ITEM_START_ANGLE + slotAngleStep * i);

const PRE_ANGLE = ITEM_START_ANGLE - slotAngleStep;
const POST_ANGLE = ITEM_END_ANGLE + slotAngleStep;

export const ThemeSwitcher = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const panel = useModal();
  const rootRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const wheelLockRef = useRef(false);
  const touchStartYRef = useRef(null);

  const count = availableThemes.length;
  const activeIndex = availableThemes.findIndex(
    (t) => theme.type === t.type && (t.type === "preset" ? theme.name === t.name : theme.id === t.id)
  );

  // Pre-resolves every theme's light/dark-ness while the panel is open and
  // idle, so handleThemeChange's click handler never has to touch the DOM
  // itself — see warmIsLightCache's comment for why that matters.
  useEffect(() => {
    if (panel.isOpen) warmIsLightCache(availableThemes);
  }, [panel.isOpen, availableThemes]);

  // Holds the swap to run once the panel's close animation genuinely
  // finishes (fired from AnimatePresence's onExitComplete below) — used
  // only for same-kind switches, where the panel's own fade-out is worth
  // protecting. Crossing switches apply immediately since the panel is
  // hidden under the radial wipe either way.
  const pendingSwapRef = useRef(null);

  const handleThemeChange = (t, event) => {
    const origin = event ? { x: event.clientX, y: event.clientY } : undefined;
    const willCross = crossesLightDarkBoundary(theme, t);
    const applySwap = () => radialThemeTransition(() => setTheme(t), { origin, fromTheme: theme, toTheme: t });

    if (willCross) {
      panel.close();
      applySwap();
    } else {
      pendingSwapRef.current = applySwap;
      panel.close();
    }
  };

  const handlePanelExitComplete = () => {
    const swap = pendingSwapRef.current;
    if (swap) {
      pendingSwapRef.current = null;
      swap();
    }
  };

  const step = (dir) => {
    if (count === 0) return;
    setOffset((o) => (o + dir + count) % count);
  };

  useEffect(() => {
    if (panel.isOpen) {
      const initialOffset = activeIndex >= 0 ? (activeIndex - 1 + count) % count : 0;
      setOffset(initialOffset);
    }
  }, [panel.isOpen, activeIndex, count]);

  useLenisLock(panel.isOpen);

  useEffect(() => {
    if (!panel.isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") panel.close();
      else if (e.key === "ArrowDown") step(1);
      else if (e.key === "ArrowUp") step(-1);
    };

    const handleWheel = (e) => {
      e.preventDefault();
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      step(e.deltaY > 0 ? 1 : -1);
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 180);
    };

    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (touchStartYRef.current === null || e.touches.length === 0) return;
      
      const touchCurrentY = e.touches[0].clientY;
      // Inverted calculation to align natural swipe direction with carousel rotation
      const deltaY = touchCurrentY - touchStartYRef.current;

      if (Math.abs(deltaY) > 30) {
        if (!wheelLockRef.current) {
          wheelLockRef.current = true;
          step(deltaY > 0 ? 1 : -1);
          touchStartYRef.current = touchCurrentY;

          setTimeout(() => {
            wheelLockRef.current = false;
          }, 180);
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [panel.isOpen, count]);

  return (
    <>
      <AnimatePresence onExitComplete={handlePanelExitComplete}>
        {panel.isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={panel.close}
            className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-sm pointer-events-auto"
          />
        )}
      </AnimatePresence>

      <div ref={rootRef} className="fixed top-4 right-4 lg:top-6 lg:right-6 z-[9999] pointer-events-auto">
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
            <motion.div
              key="carousel-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <svg
                width="380"
                height="380"
                viewBox="0 0 380 380"
                className="absolute top-1/2 left-1/2 pointer-events-none overflow-visible"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                <motion.path
                  d={describeArc(190, 190, RADIUS, START_ANGLE, END_ANGLE)}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  strokeOpacity="0.45"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                />
              </svg>

              {count > VISIBLE_COUNT && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-1 z-20"
                  style={{ right: 56 }}
                >
                  <button
                    onClick={() => step(-1)}
                    aria-label="Previous theme"
                    className="interactive w-6 h-6 rounded-full border border-accent/40 text-accent bg-surface flex items-center justify-center hover:border-accent/80"
                  >
                    <ChevronUp size={13} />
                  </button>
                  <button
                    onClick={() => step(1)}
                    aria-label="Next theme"
                    className="interactive w-6 h-6 rounded-full border border-accent/40 text-accent bg-surface flex items-center justify-center hover:border-accent/80"
                  >
                    <ChevronDown size={13} />
                  </button>
                </motion.div>
              )}

              {availableThemes.map((t, i) => {
                const slot = (i - offset + count) % count;
                let angle;
                let visible;
                if (slot < VISIBLE_COUNT) {
                  angle = SLOT_ANGLES[slot];
                  visible = true;
                } else if (slot === count - 1) {
                  angle = PRE_ANGLE;
                  visible = false;
                } else {
                  angle = POST_ANGLE;
                  visible = false;
                }

                const rad = toRad(angle);
                const dx = RADIUS * Math.cos(rad) - ITEM_WIDTH / 2;
                const dy = RADIUS * Math.sin(rad) - ITEM_HEIGHT / 2;
                const isActive = i === activeIndex;

                return (
                  <motion.button
                    key={t.type === "preset" ? t.name : t.id}
                    onClick={(e) => handleThemeChange(t, e)}
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6, x: dx, y: dy }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                    whileHover={visible ? { scale: 1.08, zIndex: 40 } : undefined}
                    whileFocus={visible ? { scale: 1.08, zIndex: 40 } : undefined}
                    tabIndex={visible ? 0 : -1}
                    aria-hidden={visible ? undefined : true}
                    className={`interactive absolute top-1/2 left-1/2 flex items-center justify-between px-2.5 border z-20 ${
                      isActive
                        ? "bg-accent text-bg border-accent"
                        : "bg-surface text-primary border-accent/30 hover:border-accent/70"
                    }`}
                    style={{
                      width: ITEM_WIDTH,
                      height: ITEM_HEIGHT,
                      clipPath: PANEL_CLIP,
                      pointerEvents: visible ? "auto" : "none",
                      boxShadow: isActive ? "0 0 16px var(--accent-glow)" : "0 2px 10px rgba(0,0,0,0.45)",
                    }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-tight leading-tight truncate">
                        {t.label}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono opacity-60 ml-1 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};