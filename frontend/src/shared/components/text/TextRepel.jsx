import React, { useRef, useEffect, useLayoutEffect } from "react";

// text: a string, OR an array of { text, className } segments that get
// concatenated into one continuous, uniformly-interactive line of characters.
const flatten = (input) => {
  const segments = typeof input === "string" ? [{ text: input }] : input;
  const chars = [];
  segments.forEach((seg) => {
    seg.text.split("").forEach((char) => {
      chars.push({ char, className: seg.className || "" });
    });
  });
  return chars;
};

/**
 * Letters displace away from (or toward) the cursor within `radius`, eased
 * back to rest with a damped-spring simulation driven by rAF + direct DOM
 * transforms (no React state per frame, no framer-motion — plain physics).
 */
export const TextRepel = ({
  text,
  as: Tag = "span",
  className = "",
  letterClassName = "",
  radius = 120,
  strength = 45,
  mode = "repel",
  stiffness = 180,
  damping = 14,
  mass = 0.4,
}) => {
  const containerRef = useRef(null);
  const letterEls = useRef([]);
  const particles = useRef([]);
  const mouse = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(null);

  const chars = flatten(text);
  const textKey = chars.map((c) => c.char).join("");

  const measure = () => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    particles.current = letterEls.current.map((el, i) => {
      const prev = particles.current[i];
      if (!el) return { cx: 0, cy: 0, x: 0, y: 0, vx: 0, vy: 0 };
      const r = el.getBoundingClientRect();
      return {
        cx: r.left + r.width / 2 - containerRect.left,
        cy: r.top + r.height / 2 - containerRect.top,
        x: prev?.x || 0,
        y: prev?.y || 0,
        vx: prev?.vx || 0,
        vy: prev?.vy || 0,
      };
    });
  };

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      mouse.current.active = true;
    };
    const handleLeave = () => {
      mouse.current.active = false;
    };

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerleave", handleLeave);

    let lastTime = performance.now();
    const sign = mode === "attract" ? -1 : 1;
    // Fixed-size sub-steps keep the spring integration stable even when a real
    // frame gap is large (tab throttling, dropped frames) — one big dt would
    // otherwise overshoot and diverge instead of converging on the target.
    const STEP = 1 / 120;
    const MAX_CATCH_UP = 0.1;

    const integrate = (dt) => {
      const m = mouse.current;
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        if (!p) continue;

        let targetX = 0;
        let targetY = 0;

        if (m.active) {
          const dx = p.cx - m.x;
          const dy = p.cy - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist < radius) {
            const falloff = 1 - dist / radius;
            const force = falloff * strength * sign;
            targetX = (dx / dist) * force;
            targetY = (dy / dist) * force;
          }
        }

        const ax = (-stiffness * (p.x - targetX) - damping * p.vx) / mass;
        const ay = (-stiffness * (p.y - targetY) - damping * p.vy) / mass;
        p.vx += ax * dt;
        p.vy += ay * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    };

    const tick = (now) => {
      let remaining = Math.min((now - lastTime) / 1000, MAX_CATCH_UP);
      lastTime = now;

      while (remaining > 0) {
        const dt = Math.min(remaining, STEP);
        integrate(dt);
        remaining -= dt;
      }

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        const el = letterEls.current[i];
        if (!p || !el) continue;
        el.style.transform = `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [radius, strength, mode, stiffness, damping, mass]);

  letterEls.current = [];

  return (
    <Tag ref={containerRef} className={className}>
      {chars.map(({ char, className: segClassName }, i) => {
        const isSpace = char === " ";
        return (
          <span
            key={i}
            ref={(el) => (letterEls.current[i] = el)}
            className={`inline-block will-change-transform ${letterClassName} ${segClassName}`}
            style={isSpace ? { width: "0.28em" } : undefined}
          >
            {isSpace ? " " : char}
          </span>
        );
      })}
    </Tag>
  );
};
