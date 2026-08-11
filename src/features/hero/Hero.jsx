import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Mail, Briefcase, ChevronUp } from "lucide-react";
import { scrollToSection } from "@/shared/hooks/useSectionScroll.js";
import { ScrambleText } from "@/shared/components/text/ScrambleText.jsx";
import { Tooltip } from "@/shared/ui/Tooltip.jsx";
import { Button } from "@/shared/ui/Button.jsx";
import { SKILLS } from "@/constants/skills.constants.jsx";
import { useAccentColor } from "@/shared/hooks/useAccentColor.js";
import { useCssVarColor } from "@/shared/hooks/useCssVarColor.js";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery.js";
import { hexToHsl } from "@/shared/utils/color.js";
import heroDeveloperPng from "@/assets/images/hero-developer.png";
import heroDeveloperMask from "@/assets/images/hero-developer-mask.svg";
import heroDeveloperLightPng from "@/assets/images/hero-developer-light.png";
import heroDeveloperLightMask from "@/assets/images/hero-developer-light-mask.svg";

// The hue *both* illustrations were actually painted in (the same warm
// gold ambient glow — see #d4af37, the default "Midnight Gold" accent —
// carried through intentionally so one rotation formula covers both).
const IMAGE_BASE_HUE = 46;

export const Hero = () => {
  const accent = useAccentColor();
  // `--is-light` is the same signal the theme system itself already uses
  // per-preset: picks which of the two illustrations (and its matching
  // face/hand mask — the light version's pose sits a little differently,
  // so the mask coordinates differ too) to use as the base, before the
  // hue-rotate below nudges it toward the current theme's actual accent.
  const isLightTheme = useCssVarColor("--is-light", "0") === "1";
  const heroImageSrc = isLightTheme ? heroDeveloperLightPng : heroDeveloperPng;
  const heroImageMask = isLightTheme ? heroDeveloperLightMask : heroDeveloperMask;

  const imageFilter = useMemo(() => {
    const { h, s } = hexToHsl(accent);
    if (s < 0.15) return "grayscale(0.7) brightness(1.05)"; // near-neutral accent (e.g. a custom black/white theme)
    // Full, undamped rotation to the exact accent hue — skin is protected
    // separately by the face/hand mask (see faceMaskStyle below), so there's
    // no need to also blunt the rotation amount here. An earlier version
    // damped this to ~40% (capped at 55°) specifically to protect skin
    // before the mask existed; once the mask took over that job, the same
    // cap became actively wrong — themes needing very different rotations
    // (Cyber +137°, Emerald +114°) were both getting crushed down to
    // ~45-55°, landing in nearly the same yellow-green zone instead of
    // their actual target hues.
    let rotation = h - IMAGE_BASE_HUE;
    rotation = ((rotation + 180) % 360 + 360) % 360 - 180; // normalize to [-180, 180]
    return `hue-rotate(${rotation.toFixed(0)}deg) saturate(1.08)`;
  }, [accent]);

  // `mask-size: contain` fits the mask using its own intrinsic aspect ratio
  // (the SVG's viewBox is 1536x1024, matching the photo exactly) the same
  // way `object-fit: contain` fits the photo — so this stays pixel-aligned
  // with the layer below it at any box size, no extra positioning math.
  const faceMaskStyle = {
    maskImage: `url(${heroImageMask})`,
    WebkitMaskImage: `url(${heroImageMask})`,
    // Explicit, even though the mask's transparent background already makes
    // it correct under alpha OR luminance masking — no reason to depend on
    // a browser default that's genuinely inconsistent across engines.
    maskMode: "alpha",
    WebkitMaskMode: "alpha",
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  };

  // Mirrors the h1's own text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl —
  // ScrambleText needs an actual pixel size since it renders real text at a
  // fixed font-size rather than inheriting the heading's responsive classes.
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
            {/* delay outlasts MainLayout's 2000ms preloader (+ its own fade-out) —
                only applies to the very first reveal; replays triggered by
                scrolling back into view later use a short fixed beat instead
                (see ScrambleText.jsx). Hero mounts immediately under that
                opaque overlay, so without this the scramble plays out fully
                hidden and only the settled text is ever visible once the
                preloader clears. */}
            <ScrambleText text="Chakraborty" color={accent} fontSize={nameFontSize} delay={2.4} />
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
                  tabIndex={0}
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
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
            >
              {/* Base layer: hue-nudged toward the theme's accent — touches
                  every pixel, including skin. */}
              <img
                src={heroImageSrc}
                alt="Illustration of Sayantan coding at a desk, surrounded by floating code editor and terminal windows"
                style={{ filter: imageFilter }}
                className="absolute inset-0 w-full h-full object-contain"
              />
              {/* Untouched natural-color layer on top, masked (see
                  hero-developer-mask.svg / hero-developer-light-mask.svg) to
                  only show through over the face/neck and the visible hand —
                  same source image and fit, so it lines up with the layer
                  below automatically. */}
              <img
                src={heroImageSrc}
                alt=""
                aria-hidden="true"
                style={faceMaskStyle}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </motion.div>
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
