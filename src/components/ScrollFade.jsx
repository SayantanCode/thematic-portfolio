import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * The non-pinned sibling of ScrollDissolve — for sections too content-dense
 * to shrink onto one screen without hurting legibility (Skills, Featured
 * Projects, Journey). These scroll normally, full size — but still fade/blur
 * in as they enter from below and back out as they finally scroll past the
 * top, so the depth language stays consistent with the pinned sections on
 * either side of them instead of abruptly switching to a plain cut.
 *
 * Deliberately opacity/blur only, no scale: SkillsGrid draws its circuit
 * wires by measuring each card's exact getBoundingClientRect() once on
 * mount and never re-measuring. A `transform: scale()` on an ancestor
 * changes that measured geometry (mount happens off-screen, at this
 * component's *initial* — smallest — scale, since every section mounts
 * immediately regardless of scroll position), so the wires would get baked
 * in at the wrong size and never catch up as the section scales back to
 * full size. Blur and opacity don't affect layout geometry, so they're safe.
 */
export const ScrollFade = ({ children, className = "" }) => {
  const ref = useRef(null);

  const { scrollYProgress: enter } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const { scrollYProgress: exit } = useScroll({
    target: ref,
    offset: ["end end", "end start"],
  });

  const enterOpacity = useTransform(enter, [0, 1], [0, 1]);
  const enterBlur = useTransform(enter, [0, 1], [10, 0]);

  const exitOpacity = useTransform(exit, [0, 1], [1, 0]);
  const exitBlur = useTransform(exit, [0, 1], [0, 10]);

  const opacity = useTransform([enterOpacity, exitOpacity], ([a, b]) => Math.min(a, b));
  const blurPx = useTransform([enterBlur, exitBlur], ([a, b]) => Math.max(a, b));
  const filter = useTransform(blurPx, (b) => `blur(${b.toFixed(1)}px)`);

  return (
    <motion.div ref={ref} style={{ opacity, filter, willChange: "opacity, filter" }} className={className}>
      {children}
    </motion.div>
  );
};
