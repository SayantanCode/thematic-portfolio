import React from "react";
import { motion, useTransform } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";

/*
 * The icon badge that sits directly on the ring. Dim/gray until the
 * ring-fill reaches it, then lights up in the accent color — same
 * `active` MotionValue that drives the paired JourneyCard.
 *
 * Colors are built with color-mix() (the pattern already used in
 * globals.css) rather than handing framer-motion a `var(--accent)`
 * string to interpolate — it can't resolve CSS custom properties into
 * channel values, so animating "toward" one would silently no-op.
 */
export const JourneyNode = ({ entry, active }) => {
  const scale = useTransform(active, [0, 1], [0.82, 1]);
  const pct = useTransform(active, [0, 1], [0, 100]);

  const borderColor = useTransform(
    pct,
    (v) => `color-mix(in srgb, var(--accent) ${v * 0.5}%, transparent)`
  );
  const background = useTransform(
    pct,
    (v) => `color-mix(in srgb, var(--accent) ${v * 0.12}%, transparent)`
  );
  const iconColor = useTransform(
    pct,
    (v) => `color-mix(in srgb, var(--accent) ${v}%, #8a8a8a)`
  );
  const iconOpacity = useTransform(active, [0, 1], [0.5, 1]);
  const boxShadowBlur = useTransform(active, [0, 1], [0, 18]);
  const boxShadow = useTransform(
    boxShadowBlur,
    (b) => `0 0 ${b}px var(--accent-glow)`
  );

  const Icon = entry.type === "education" ? GraduationCap : Briefcase;

  return (
    <motion.div
      style={{
        scale,
        boxShadow,
        background,
        borderColor,
        borderWidth: 1,
        borderStyle: "solid",
      }}
      className="
        pointer-events-none
        w-9
        h-9
        sm:w-11
        sm:h-11
        rounded-full
        flex
        items-center
        justify-center
      "
    >
      <motion.div style={{ opacity: iconOpacity, color: iconColor }}>
        <Icon size={16} />
      </motion.div>
    </motion.div>
  );
};
