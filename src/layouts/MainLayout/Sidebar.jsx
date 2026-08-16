import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimate, useMotionValue, animate as animateValue } from "framer-motion";
import { Home, User, Code2, Briefcase, Clock, Mail } from "lucide-react";
import { scrollToSection } from "@/shared/hooks/useSectionScroll.js";
import { useActiveSection } from "@/shared/hooks/useActiveSection.js";

const NAV_ITEMS = [
  { id: "home", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "skills", label: "Skills", Icon: Code2 },
  { id: "projects", label: "Projects", Icon: Briefcase },
  { id: "journey", label: "Journey", Icon: Clock },
  { id: "contact", label: "Contact", Icon: Mail },
];

const ORBIT_DOT = "absolute w-1 h-1 rounded-full bg-accent shadow-[0_0_6px_var(--accent-glow)]";

// Desktop rail only now — mobile uses MobileTabBar below instead.
const NavIcon = ({ id, label, Icon, onNavigate, isActive }) => {
  const [scope, animate] = useAnimate();
  const wasActiveRef = useRef(isActive);

  useEffect(() => {
    if (isActive && !wasActiveRef.current && scope.current) {
      // One-shot morph, played on the icon box itself: a quick Y-axis twist
      // (perspective set via style below, so it actually foreshortens
      // instead of just squishing), then an elastic squash/stretch wobble
      // that overshoots and decays back to rest — two chained tweens rather
      // than a plain spring, since a spring transition only interpolates a
      // single target value and can't author distinct twist→wobble phases.
      const sequence = async () => {
        await animate(scope.current, { rotateY: [0, 55, -28, 0] }, { duration: 0.32, ease: [0.22, 1, 0.36, 1] });
        await animate(
          scope.current,
          { scaleX: [1, 1.34, 0.86, 1.1, 0.97, 1], scaleY: [1, 0.76, 1.16, 0.94, 1.02, 1] },
          { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
        );
      };
      sequence();
    }
    wasActiveRef.current = isActive;
  }, [isActive, animate, scope]);

  return (
    <button
      onClick={() => onNavigate(id)}
      aria-label={label}
      aria-current={isActive ? "true" : undefined}
      className={`interactive group relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-300 ${
        isActive
          ? "text-accent bg-accent/10 shadow-[0_0_16px_var(--accent-glow)]"
          : "text-muted hover:text-accent hover:bg-accent/10"
      }`}
    >
      {/* Icon-sized box — everything active-state-specific (ring/orbit) is
          scoped to this rather than the whole button. */}
      <span className="relative w-9 h-9 flex items-center justify-center shrink-0">
        {isActive && (
          <>
            {/* Breathing ring */}
            <motion.span
              className="absolute inset-0 rounded-full border border-accent/40 pointer-events-none"
              animate={{ opacity: [0.35, 0.75, 0.35], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Two dots orbiting the ring */}
            <motion.span
              className="absolute inset-0 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            >
              <span className={`${ORBIT_DOT} top-0 left-1/2 -translate-x-1/2`} />
              <span className={`${ORBIT_DOT} bottom-0 left-1/2 -translate-x-1/2`} />
            </motion.span>
          </>
        )}

        <motion.span
          ref={scope}
          style={{ transformPerspective: 220 }}
          className="relative z-10 flex items-center justify-center"
        >
          <Icon size={20} />
        </motion.span>
      </span>

      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-surface border border-glass-border px-2.5 py-1 text-xs font-mono text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
        {label}
      </span>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* MOBILE: floating bottom tab bar with a curved notch + popped-up bubble     */
/* -------------------------------------------------------------------------- */

const BAR_HEIGHT = 64; // px
const BAR_SIDE_MARGIN = 16; // px — matches the outer wrapper's left-4/right-4
const BUBBLE_SIZE = 48; // px — matches the bubble's w-12 h-12 below
const BUBBLE_RADIUS = BUBBLE_SIZE / 2;
// How far the flat-to-curve transition sits from center — just past the
// bubble's own edge, so the cut visibly hugs the circle instead of being a
// separate, disconnected-looking dip.
const NOTCH_RADIUS = BUBBLE_RADIUS + 20;
const NOTCH_DEPTH = 28; // px — close to BUBBLE_RADIUS, sized for that circle
// Circle-approximation bezier constant — control points at this fraction of
// the radius make the dip read as genuinely rounded/circular rather than an
// arbitrary shallow curve.
const NOTCH_BEZIER_K = 0.552;

// All in real px, not a percentage viewBox — a percentage notch has no idea
// how big the bubble actually is in pixels, so depending on the phone's
// width it either swallows the bubble's curvature (too wide) or flares out
// disconnected from it (too narrow). Real units let the notch be sized
// directly off BUBBLE_RADIUS so it always matches. Corners are still
// clipped via the wrapper's own CSS border-radius, not arcs here.
const buildNotchedBarPath = (cx, barWidth) => {
  const nx1 = cx - NOTCH_RADIUS;
  const nx2 = cx - NOTCH_RADIUS * NOTCH_BEZIER_K;
  const nx3 = cx + NOTCH_RADIUS * NOTCH_BEZIER_K;
  const nx4 = cx + NOTCH_RADIUS;
  return `M 0 0 L ${nx1} 0 C ${nx2} 0 ${nx2} ${NOTCH_DEPTH} ${cx} ${NOTCH_DEPTH} C ${nx3} ${NOTCH_DEPTH} ${nx3} 0 ${nx4} 0 L ${barWidth} 0 L ${barWidth} ${BAR_HEIGHT} L 0 ${BAR_HEIGHT} Z`;
};

const MobileTabBar = ({ activeId, onNavigate }) => {
  const activeIndex = Math.max(NAV_ITEMS.findIndex((item) => item.id === activeId), 0);

  // Bar width is deterministic from the viewport (fixed, left-4/right-4),
  // so this reads real geometry without needing a ref + ResizeObserver.
  const [barWidth, setBarWidth] = useState(() =>
    typeof window === "undefined" ? 360 : window.innerWidth - BAR_SIDE_MARGIN * 2
  );

  useEffect(() => {
    const measure = () => setBarWidth(window.innerWidth - BAR_SIDE_MARGIN * 2);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const segment = barWidth / NAV_ITEMS.length;
  const targetCx = segment * activeIndex + segment / 2;

  const cx = useMotionValue(targetCx);
  const [pathD, setPathD] = useState(() => buildNotchedBarPath(targetCx, barWidth));

  useEffect(() => {
    const controls = animateValue(cx, targetCx, {
      type: "spring",
      stiffness: 260,
      damping: 26,
      onUpdate: (v) => setPathD(buildNotchedBarPath(v, barWidth)),
    });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetCx, barWidth]);

  const ActiveIcon = NAV_ITEMS[activeIndex]?.Icon;

  return (
    <div className="lg:hidden fixed left-4 right-4 bottom-4 z-40">
      {/* Outer wrapper has no overflow clip, so the bubble below can poke
          above the bar; the bar's own rounded corners are clipped one level
          in instead. */}
      <div className="relative">
        <div className="relative rounded-[28px] overflow-hidden backdrop-blur-xl shadow-[0_8px_40px_-12px_var(--accent-glow)]">
          <svg
            viewBox={`0 0 ${barWidth} ${BAR_HEIGHT}`}
            className="block w-full"
            style={{
              height: BAR_HEIGHT,
              // Real px viewBox now (matches rendered width 1:1), so this
              // drop-shadow renders undistorted and traces the notch's
              // actual curve — what makes it read as a distinct cut instead
              // of blending into the page background behind it.
              filter: "drop-shadow(0 0 10px var(--accent-glow)) drop-shadow(0 2px 10px rgba(0,0,0,0.5))",
            }}
          >
            <path d={pathD} fill="color-mix(in srgb, var(--surface), white 6%)" fillOpacity="0.96" />
          </svg>

          <div className="absolute inset-0 flex items-stretch">
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  aria-label={item.label}
                  aria-current={isActive ? "true" : undefined}
                  className="interactive relative flex-1 flex items-center justify-center"
                >
                  {!isActive && <item.Icon size={20} className="text-muted" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Popped-up active bubble — position tracks the same spring-driven
            cx (now real px, matching the notch's own coordinate space) as
            the notch, so they never drift out of sync. Sized/lifted so its
            bottom edge clears NOTCH_DEPTH with a few px to spare — otherwise
            it sinks past the dip and just overlaps the bar flush, with no
            visible gap reading as "floating". */}
        <motion.div
          className="absolute w-12 h-12 rounded-full bg-accent text-bg flex items-center justify-center shadow-[0_6px_20px_var(--accent-glow)] pointer-events-none"
          style={{ left: cx, top: -28, x: "-50%" }}
        >
          {ActiveIcon && (
            <motion.span
              key={activeId}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
              className="flex items-center justify-center"
            >
              <ActiveIcon size={20} />
            </motion.span>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const activeId = useActiveSection(NAV_ITEMS.map((item) => item.id));

  return (
    <>
      {/* DESKTOP: fixed left icon rail */}
      <aside className="hidden lg:flex fixed left-0 top-4 bottom-4 w-20 z-40 flex-col items-center py-8 rounded-r-3xl border border-l-0 border-accent/15 bg-surface/50 backdrop-blur-xl shadow-[8px_0_40px_-12px_var(--accent-glow)]">
        <button
          onClick={() => scrollToSection("home")}
          aria-label="Scroll to top"
          className="interactive mb-10 w-11 h-11 rounded-xl bg-accent/10 border border-accent/30 text-accent font-header font-black flex items-center justify-center shadow-[0_0_16px_var(--accent-glow)]"
        >
          SC
        </button>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavIcon
              key={item.id}
              {...item}
              isActive={item.id === activeId}
              onNavigate={scrollToSection}
            />
          ))}
        </nav>
      </aside>

      {/* MOBILE: floating bottom tab bar */}
      <MobileTabBar activeId={activeId} onNavigate={scrollToSection} />
    </>
  );
};
