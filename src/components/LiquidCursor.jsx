import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const DOT_SIZE = 5;
const RING_SIZE = 26;
const LOCK_SIZE = 38;

/**
 * Custom cursor — a compact HUD reticle instead of the old 80–120px
 * magnifying lens, which was large enough that people would rest it near a
 * clickable element without being centered on it and assume hover state
 * had already registered. Idle state is a small dot inside a slowly
 * rotating dashed ring (a quiet "scanning" read that suits the starfield
 * background); hovering an interactive element swaps it for four corner
 * brackets — the same bracket-corner motif used on the skill chip cards
 * (SkillsGrid.jsx) — reading as a deliberate "target lock" rather than a
 * generic pointer.
 */
export const LiquidCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 30, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 400 });

  useEffect(() => {
    const moveMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHover = (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('.interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleHover);
    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  const sharedPosition = {
    x: springX,
    y: springY,
    translateX: '-50%',
    translateY: '-50%',
  };

  return (
    <div className="hidden lg:block">
      {/* Center dot — collapses away once locked on, so it doesn't sit
          inside the brackets looking like a leftover. The extra 0 0 0 2px
          ring in --bg (the page's own background, always the opposite of
          --accent by theme design) stops it from disappearing when it sits
          over an accent-filled surface, like the primary button. */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-10051 bg-accent"
        style={{
          ...sharedPosition,
          width: DOT_SIZE,
          height: DOT_SIZE,
          boxShadow: '0 0 0 2px var(--bg), 0 0 8px var(--accent-glow)',
        }}
        animate={{ scale: isHovering ? 0 : 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Idle reticle — same --bg halo, via drop-shadow since it's a stroke,
          not a fill, so a box-shadow ring wouldn't trace its shape */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-10050"
        style={{
          ...sharedPosition,
          width: RING_SIZE,
          height: RING_SIZE,
          border: '1px dashed var(--accent)',
          filter: 'drop-shadow(0 0 1.5px var(--bg)) drop-shadow(0 0 1.5px var(--bg))',
        }}
        animate={{
          scale: isHovering ? 0.4 : 1,
          opacity: isHovering ? 0 : 0.55,
          rotate: 360,
        }}
        transition={{
          scale: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.2 },
          rotate: { duration: 9, repeat: Infinity, ease: 'linear' },
        }}
      />

      {/* Lock-on brackets, over interactive elements — same --bg halo */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-10050"
        style={{
          ...sharedPosition,
          width: LOCK_SIZE,
          height: LOCK_SIZE,
          filter: 'drop-shadow(0 0 1.5px var(--bg)) drop-shadow(0 0 1.5px var(--bg))',
        }}
        animate={{ scale: isHovering ? 1 : 1.35, opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="absolute -top-px -left-px w-2.5 h-2.5 border-t-2 border-l-2 border-accent rounded-tl-sm" />
        <span className="absolute -top-px -right-px w-2.5 h-2.5 border-t-2 border-r-2 border-accent rounded-tr-sm" />
        <span className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b-2 border-l-2 border-accent rounded-bl-sm" />
        <span className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b-2 border-r-2 border-accent rounded-br-sm" />
      </motion.div>
    </div>
  );
};
