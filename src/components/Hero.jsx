import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Mail, Briefcase, ChevronUp } from "lucide-react";
import { scrollToSection } from "../hooks/useSectionScroll.js";
import { LowPolyName } from "./text/LowPolyName.jsx";
import { Tooltip } from "./ui/Tooltip.jsx";
import { Button } from "./ui/Button.jsx";
import { SKILLS } from "../constants/Skills.jsx";
import { useAccentColor } from "../hooks/useAccentColor.js";
import { useMediaQuery } from "../hooks/useMediaQuery.js";
import heroIllustration from "../assets/hero-illustration.svg";

export const Hero = () => {
  const accent = useAccentColor();
  // Mirrors the h1's own text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl —
  // LowPolyName needs an actual pixel size to size its canvas/SVG output.
  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const nameFontSize = isLg ? 60 : isMd ? 48 : isSm ? 36 : 32;

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden px-6 lg:px-12 pt-20 lg:pt-0"
    >
      <div className="container mx-auto grid gap-12 items-center lg:grid-cols-2 text-center lg:text-left">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center lg:items-start"
        >
          <span className="text-muted font-mono text-xs uppercase tracking-widest mb-3">
            Hello, I'm 👋
          </span>

          <h1 className="font-header font-black leading-tight mb-4 text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl flex flex-wrap items-end justify-center lg:justify-start gap-x-3">
            <span>Sayantan</span>
            <LowPolyName text="Chakraborty" color={accent} fontSize={nameFontSize} delay={0.2} stagger={0.045} />
          </h1>

          <p className="text-primary font-bold text-base sm:text-lg md:text-xl mb-6">
            Backend-Focused MERN Stack Developer
          </p>

          <p className="max-w-lg mb-8 text-sm sm:text-base opacity-80 leading-relaxed font-light">
            I build scalable, secure and real-time web applications with
            modern technologies — architecting high-concurrency SaaS
            solutions, complex scheduling engines, and robust API ecosystems.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
            <Button onClick={() => scrollToSection("projects")} icon={<ChevronRight size={18} />}>
              View My Work
            </Button>

            <Button as="a" href="mailto:sayantan648@gmail.com" variant="secondary" icon={<Mail size={18} />}>
              Get In Touch
            </Button>
          </div>

          {/* TECH STACK ROW */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {SKILLS.map((skill) => (
              <Tooltip key={skill.name} label={skill.name}>
                <div
                  className="w-10 h-10 rounded-lg bg-surface/50 border border-glass-border flex items-center justify-center hover:border-accent/40 hover:scale-110 transition-all duration-300"
                  style={{ color: skill.color }}
                >
                  {skill.icon}
                </div>
              </Tooltip>
            ))}
          </div>
        </motion.div>

        {/* RIGHT VISUAL (DESKTOP ONLY) */}
        <div className="hidden lg:block relative h-[32rem]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.img
              src={heroIllustration}
              alt="Illustration of a developer working at a desk"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 glass-card border-accent/30 rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <Briefcase size={14} className="text-accent" />
            <span className="text-[10px] text-accent font-mono uppercase tracking-widest">
              Open to Opportunities
            </span>
          </motion.div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        onClick={() => scrollToSection("about")}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-40 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-px h-12 bg-linear-to-b from-(--accent) to-transparent" />
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase">
          Explore My World
        </span>
        <ChevronUp size={14} />
      </motion.div>
    </section>
  );
};
