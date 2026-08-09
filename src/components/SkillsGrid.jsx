import React, { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SKILL_CATEGORIES, TOOLS } from "../constants/Skills.jsx";
import { useAccentColor } from "../hooks/useAccentColor.js";
import { Tooltip } from "./ui/Tooltip.jsx";

const [FRONTEND, BACKEND, DATA] = SKILL_CATEGORIES;

const orthogonalPath = (a, b) => {
  const midY = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
};

const CornerBrackets = ({ color }) => (
  <>
    <span
      className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 rounded-tl-md pointer-events-none"
      style={{ borderColor: color }}
    />
    <span
      className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 rounded-tr-md pointer-events-none"
      style={{ borderColor: color }}
    />
    <span
      className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 rounded-bl-md pointer-events-none"
      style={{ borderColor: color }}
    />
    <span
      className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 rounded-br-md pointer-events-none"
      style={{ borderColor: color }}
    />
  </>
);

const ChipCard = forwardRef(({ name, description, icon, color, core = false, index = 0 }, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div
        ref={ref}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={isHovered ? { y: 0 } : { y: [0, -6, 0] }}
        transition={
          isHovered
            ? { duration: 0.3 }
            : { duration: 3 + (index % 3) * 0.4, repeat: Infinity, ease: "easeInOut" }
        }
        className={`interactive relative flex items-center gap-3 rounded-xl border bg-surface/60 backdrop-blur-sm transition-shadow duration-300 ${
          core ? "px-6 py-5 sm:px-9 sm:py-7 gap-4" : "px-4 py-3"
        }`}
        style={{
          borderColor: `${color}55`,
          boxShadow: isHovered
            ? `0 0 28px ${color}77, inset 0 0 24px ${color}22`
            : `0 0 12px ${color}33`,
        }}
      >
        <CornerBrackets color={color} />

        {/* IC pin ticks */}
        <span
          className="absolute -top-1 left-4 right-4 h-px opacity-70"
          style={{ background: `repeating-linear-gradient(90deg, ${color} 0 2px, transparent 2px 9px)` }}
        />
        <span
          className="absolute -bottom-1 left-4 right-4 h-px opacity-70"
          style={{ background: `repeating-linear-gradient(90deg, ${color} 0 2px, transparent 2px 9px)` }}
        />

        <div
          className={`rounded-lg flex items-center justify-center shrink-0 ${core ? "w-14 h-14 sm:w-16 sm:h-16" : "w-11 h-11"}`}
          style={{ color, background: `${color}1a`, border: `1px solid ${color}44` }}
        >
          {icon}
        </div>
        <div>
          <h3 className={`font-header font-bold text-primary ${core ? "text-lg sm:text-xl" : "text-sm"}`}>
            {name}
          </h3>
          <p className={`text-muted font-mono ${core ? "text-xs sm:text-sm" : "text-[10px]"}`}>
            {description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
});
ChipCard.displayName = "ChipCard";

const CategoryLabel = ({ label, color }) => (
  <p
    className="text-center font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4"
    style={{ color }}
  >
    {label}
  </p>
);

export const SkillsGrid = () => {
  const accent = useAccentColor();
  const containerRef = useRef(null);
  const frontendRefs = useRef([]);
  const coreRef = useRef(null);
  const dataRefs = useRef([]);
  const [wires, setWires] = useState([]);

  useLayoutEffect(() => {
    const compute = () => {
      const container = containerRef.current;
      if (!container || !coreRef.current) return;
      const cRect = container.getBoundingClientRect();

      const centerOf = (el, edge) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - cRect.left,
          y: (edge === "bottom" ? r.bottom : r.top) - cRect.top,
        };
      };

      const coreTop = centerOf(coreRef.current, "top");
      const coreBottom = centerOf(coreRef.current, "bottom");

      const next = [];
      frontendRefs.current.forEach((el) => {
        if (!el) return;
        next.push({ d: orthogonalPath(centerOf(el, "bottom"), coreTop), color: FRONTEND.color });
      });
      dataRefs.current.forEach((el, i) => {
        if (!el) return;
        const item = DATA.items[i];
        next.push({ d: orthogonalPath(coreBottom, centerOf(el, "top")), color: item.color });
      });
      setWires(next);
    };

    compute();
    window.addEventListener("resize", compute);
    const timeout = setTimeout(compute, 400);
    return () => {
      window.removeEventListener("resize", compute);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section
      id="skills"
      className="container mx-auto px-6 md:px-12 py-12 md:py-24 text-primary border-b border-glass-border overflow-hidden"
    >
      <div className="mb-12 md:mb-16 text-center">
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <span className="hidden sm:block h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-accent/50" />
          <h2
            className="font-header font-black text-2xl sm:text-4xl md:text-5xl text-primary uppercase tracking-tight sm:whitespace-nowrap"
            style={{
              filter: `drop-shadow(0 0 6px ${accent}) drop-shadow(0 0 22px ${accent}99)`,
            }}
          >
            Skills &amp; Technologies
          </h2>
          <span className="hidden sm:block h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-accent/50" />
        </div>
        <p className="text-muted font-mono text-xs sm:text-sm mt-5 italic">
          The stack I reach for when building high-concurrency, real-time systems.
        </p>
      </div>

      <div ref={containerRef} className="relative max-w-4xl mx-auto">
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
          {wires.map((w, i) => (
            <g key={i}>
              <path d={w.d} fill="none" stroke={w.color} strokeWidth="1.5" opacity="0.2" />
              <path
                d={w.d}
                fill="none"
                stroke={w.color}
                strokeWidth="1.5"
                strokeDasharray="4 10"
                className="wire-flow"
                style={{ filter: `drop-shadow(0 0 4px ${w.color})` }}
              />
              <circle r="3" fill={w.color} style={{ filter: `drop-shadow(0 0 6px ${w.color})` }}>
                <animateMotion dur="2.4s" repeatCount="indefinite" path={w.d} />
              </circle>
            </g>
          ))}
        </svg>

        <div className="relative z-10 flex flex-col items-center gap-10 md:gap-14">
          <div>
            <CategoryLabel label={FRONTEND.label} color={FRONTEND.color} />
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {FRONTEND.items.map((item, i) => (
                <ChipCard
                  key={item.name}
                  {...item}
                  index={i}
                  ref={(el) => (frontendRefs.current[i] = el)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <CategoryLabel label={BACKEND.label} color={BACKEND.color} />
            <ChipCard
              name="Node.js + Express.js"
              description="Runtime & Web Framework"
              icon={BACKEND.items[0].icon}
              color={BACKEND.color}
              core
              ref={coreRef}
            />
          </div>

          <div>
            <CategoryLabel label={DATA.label} color={DATA.color} />
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {DATA.items.map((item, i) => (
                <ChipCard
                  key={item.name}
                  {...item}
                  index={i}
                  ref={(el) => (dataRefs.current[i] = el)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-14 md:mt-20 rounded-2xl border border-glass-border bg-surface/30 p-6">
        <p className="text-center font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-accent mb-6">
          Tools &amp; Workflow
        </p>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {TOOLS.map((tool) => (
            <Tooltip key={tool.name} label={tool.name}>
              <div
                className="w-11 h-11 rounded-lg bg-surface/60 border border-glass-border flex items-center justify-center hover:scale-110 transition-transform duration-300"
                style={{ color: tool.color }}
              >
                {tool.icon}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </section>
  );
};
