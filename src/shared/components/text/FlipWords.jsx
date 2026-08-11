import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const charVariants = {
  initial: { rotateX: 90, opacity: 0 },
  animate: { rotateX: 0, opacity: 1 },
  exit: { rotateX: -90, opacity: 0 },
};

/**
 * Auto-cycling headline word with a per-character 3D flip transition —
 * each character rotates out/in on its own stagger, cascading across the
 * word rather than swapping it as a flat block.
 */
export const FlipWords = ({ words, duration = 2600, className = "", disabled = false }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (disabled || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), duration);
    return () => clearInterval(id);
  }, [words.length, duration, disabled]);

  const word = words[index];

  if (disabled) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={`inline-flex ${className}`} style={{ perspective: "300px" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          className="inline-flex"
          aria-label={word}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {word.split("").map((char, i) => {
            const isSpace = char === " ";
            return (
              <motion.span
                key={i}
                variants={charVariants}
                transition={{ duration: 0.4, delay: i * 0.035, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "inline-block",
                  transformOrigin: "50% 100%",
                  ...(isSpace ? { width: "0.3em" } : null),
                }}
              >
                {isSpace ? "" : char}
              </motion.span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
