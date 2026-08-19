import React from "react";
import { motion } from "framer-motion";
import { interpolateColor } from "@/shared/utils/color.js";

const splitToTokens = (text, splitBy) => {
  if (splitBy === "char") return text.split("");
  return text.split(" ");
};

const child = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
  },
};

/**
 * Directional blur-reveal text, staggered word-by-word or char-by-char.
 * trigger="mount" plays once on render (above-the-fold headlines);
 * trigger="inView" replays as the element scrolls into view (section headings).
 *
 * Pass gradientFrom/gradientTo (hex) for a real per-character gradient — this
 * interpolates an explicit `color` per character instead of relying on
 * `background-clip: text`, which breaks across many animated inline-block
 * children in some browsers. `glow` adds only a soft, subtle lift — the
 * gradient itself (light-to-dark shades) should carry the visual weight,
 * not a neon halo.
 */
export const KineticText = ({
  text,
  as: Tag = "span",
  splitBy = "word",
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.08,
  duration = 0.9,
  trigger = "mount",
  once = true,
  gradientFrom,
  gradientTo,
  glow = false,
  glowColor,
}) => {
  const tokens = splitToTokens(text, splitBy);
  const hasGradient = Boolean(gradientFrom && gradientTo);

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const motionProps =
    trigger === "inView"
      ? { initial: "hidden", whileInView: "visible", viewport: { once, amount: 0.4 } }
      : { initial: "hidden", animate: "visible" };

  const glowBase = glowColor || gradientTo;
  const outerStyle = glow
    ? { filter: `drop-shadow(0 1px 3px ${glowBase ? `${glowBase}66` : "var(--accent-glow)"})` }
    : undefined;

  return (
    <Tag className={className} style={outerStyle}>
      <motion.span
        variants={container}
        {...motionProps}
        style={{ display: "inline" }}
      >
        {tokens.map((token, i) => {
          const isSpace = splitBy === "char" && token === " ";
          const t = tokens.length > 1 ? i / (tokens.length - 1) : 0;
          const color = hasGradient ? interpolateColor(gradientFrom, gradientTo, t) : undefined;

          return (
            <motion.span
              key={i}
              variants={child}
              transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
              className={`inline-block ${wordClassName}`}
              style={{
                ...(isSpace ? { width: "0.3em" } : null),
                ...(color ? { color } : null),
              }}
            >
              {isSpace ? " " : token}
              {splitBy === "word" && i < tokens.length - 1 ? " " : ""}
            </motion.span>
          );
        })}
      </motion.span>
    </Tag>
  );
};
