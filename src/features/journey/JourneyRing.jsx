import React from "react";
import { motion, useTransform } from "framer-motion";

// Ellipse lives in a 0-100 percentage viewBox so node positions can be
// reused directly as CSS left/top percentages.
export const RING_RX = 46;
export const RING_RY = 30;

// Sweep 270° (not a full 360°) so scroll 0→1 maps linearly onto it with
// no dead zone, leaving a deliberate gap at the top near the section
// header instead of closing the loop back onto itself.
const START_ANGLE = 225;
const SWEEP = -270;

export const pointAt = (deg, rx = RING_RX, ry = RING_RY, cx = 50, cy = 50) => {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + rx * Math.cos(rad), y: cy + ry * Math.sin(rad) };
};

// One evenly-spaced angle per node, in scroll order.
export const ringNodeAngle = (index, count) =>
  START_ANGLE + (SWEEP * index) / Math.max(count - 1, 1);

export const JourneyRing = ({ scrollYProgress }) => {
  const fillPathD = useTransform(scrollYProgress, (raw) => {
    const p = Math.max(0, Math.min(1, raw));
    const sweptDeg = Math.abs(SWEEP * p);

    if (sweptDeg < 0.5) return "";

    const start = pointAt(START_ANGLE);
    const end = pointAt(START_ANGLE + SWEEP * p);
    const largeArcFlag = sweptDeg > 180 ? 1 : 0;

    return `M ${start.x} ${start.y} A ${RING_RX} ${RING_RY} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
    >
      <ellipse
        cx="50"
        cy="50"
        rx={RING_RX}
        ry={RING_RY}
        fill="none"
        stroke="var(--glass-border)"
        strokeWidth="0.35"
        opacity="0.5"
      />
      <motion.path
        d={fillPathD}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.45"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px var(--accent-glow))" }}
      />
    </svg>
  );
};
