import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotionOrLowPower } from "@/shared/hooks/usePrefersReducedMotionOrLowPower";

// Weighted toward plain letters so it reads as "unresolved text", not pure
// symbol noise — a handful of code-flavored characters mixed in is enough
// to read as terminal/compiler output rather than random static.
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const SYMBOLS = "{}<>/;#01$%&*";
const GLYPHS = LETTERS + LETTERS + SYMBOLS;
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

const LOCK_DURATION_MS = 900; // how long each character scrambles before settling
const TICK_MS = 40; // glyph-swap rate — fast enough to read as digital noise
const FLASH_MS = 260; // brief brightness pulse when a character resolves
const REPLAY_DELAY_MS = 150; // beat before re-decoding on repeat entries

/**
 * Renders `text` as a terminal-style decode: every character starts as a
 * random glyph (letters + a few code symbols) cycling rapidly, then locks
 * into its real character one at a time, left to right, like a name being
 * resolved/compiled rather than drawn. A blinking cursor trails the
 * scramble and disappears once fully settled; each character gets a brief
 * brightness "spark" the instant it locks in.
 *
 * Replays every time the element re-enters the viewport (not just once) —
 * scroll away from the hero and back and it re-decodes. Deliberately *not*
 * a true repeating strobe across the whole word: rapid whole-element
 * brightness flashing is a real photosensitivity risk (WCAG flags >3
 * flashes/sec), so only one freshly-resolved character flashes at a time,
 * once, for a fixed 260ms — a spark, not a strobe.
 *
 * `delay`/`stagger` are in seconds, matching this component's previous
 * (LowPolyName) call-site convention, even though the internal timers are ms.
 * `delay` only applies to the very first reveal (e.g. to outlast a
 * preloader) — replays on later re-entries use a short fixed beat instead,
 * so scrolling back up doesn't feel sluggish.
 */
export const ScrambleText = ({
  text,
  color = "#d4af37",
  fontSize,
  delay = 0,
  stagger = 0.09,
  className = "",
}) => {
  const chars = text.split("");
  const reduceMotion = usePrefersReducedMotionOrLowPower();
  const [display, setDisplay] = useState(() =>
    reduceMotion ? chars.map((c) => ({ char: c, flashing: false })) : chars.map((c) => ({ char: c === " " ? " " : randomGlyph(), flashing: false }))
  );
  const [settled, setSettled] = useState(reduceMotion);
  const intervalRef = useRef(null);
  const hasRevealedOnceRef = useRef(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (reduceMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const runReveal = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      const isFirstReveal = !hasRevealedOnceRef.current;
      hasRevealedOnceRef.current = true;
      const revealDelayMs = isFirstReveal ? delay * 1000 : REPLAY_DELAY_MS;
      const staggerMs = stagger * 1000;
      const totalMs = chars.length * staggerMs + LOCK_DURATION_MS;
      const startedAt = performance.now() + revealDelayMs;

      setSettled(false);
      setDisplay(chars.map((c) => ({ char: c === " " ? " " : randomGlyph(), flashing: false })));

      intervalRef.current = setInterval(() => {
        const elapsed = performance.now() - startedAt;
        if (elapsed < 0) return;

        setDisplay(
          chars.map((char, i) => {
            if (char === " ") return { char: " ", flashing: false };
            const lockAt = i * staggerMs + LOCK_DURATION_MS;
            const locked = elapsed >= lockAt;
            const flashing = locked && elapsed < lockAt + FLASH_MS;
            return { char: locked ? char : randomGlyph(), flashing };
          })
        );

        if (elapsed >= totalMs + FLASH_MS) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setDisplay(chars.map((c) => ({ char: c, flashing: false })));
          setSettled(true);
        }
      }, TICK_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) runReveal();
      },
      { threshold: 0.6 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  return (
    <span
      ref={containerRef}
      aria-label={text}
      className={className}
      style={{
        color,
        fontSize: fontSize ? `${fontSize}px` : undefined,
        textShadow: `0 0 12px ${color}66`,
        display: "inline-flex",
      }}
    >
      <span aria-hidden="true" style={{ display: "inline-flex" }}>
        {display.map((d, i) => (
          <span
            key={i}
            className={d.flashing ? "scramble-flash" : undefined}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {d.char}
          </span>
        ))}
      </span>
      {!settled && (
        <span aria-hidden="true" className="animate-pulse" style={{ marginLeft: "0.05em" }}>
          _
        </span>
      )}
    </span>
  );
};
