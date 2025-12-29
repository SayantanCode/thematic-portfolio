import React from "react";
import { motion } from "framer-motion";
import { Github, ChevronRight, Cpu, Briefcase, ChevronUp } from "lucide-react";

export const Hero = () => {
  const scrollToSection = (sectionName) => {
    const section = document.getElementById(sectionName);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="
        relative
        min-h-[100svh]
        flex
        items-center
        justify-center
        overflow-hidden
        px-6
        lg:px-12
      "
    >
      {/* MAIN CONTENT */}
      <div
        className="
          container
          mx-auto
          grid
          gap-12
          items-center
          lg:grid-cols-2
          text-center
          lg:text-left
        "
      >
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="
            relative
            z-10
            flex
            flex-col
            items-center
            lg:items-start
          "
        >
          {/* STATUS CHIP */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
              <Briefcase size={14} className="text-accent" />
              <span className="text-[10px] text-accent font-mono uppercase tracking-widest">
                Open to Opportunities
              </span>
            </div>
          </div>

          {/* HEADING */}
          <h1
            className="
              font-header
              font-black
              leading-tight
              mb-6
              text-[2.2rem]
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
            "
          >
            Backend-Heavy <br />
            <span className="text-accent underline decoration-accent/30">
              Architectural
            </span>{" "}
            Design.
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              max-w-lg
              mb-10
              text-sm
              sm:text-base
              md:text-lg
              opacity-80
              leading-relaxed
              font-light
            "
          >
            Architecting high-concurrency SaaS solutions, complex scheduling
            engines, and robust API ecosystems that scale with demand.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                px-7
                py-4
                bg-accent
                text-bg
                font-black
                rounded-sm
                flex
                items-center
                gap-2
                shadow-accent
                uppercase
                tracking-widest
                text-xs
              "
            >
              Examine Systems <ChevronRight size={18} />
            </motion.button>

            <motion.a
              href="https://github.com/SayantanCode/thematic-portfolio"
              target="_blank"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                px-7
                py-4
                border
                border-accent/40
                text-accent
                font-bold
                rounded-sm
                flex
                items-center
                gap-2
                glass-card
                uppercase
                tracking-widest
                text-xs
              "
            >
              <Github size={18} /> Source Access
            </motion.a>
          </div>
        </motion.div>

        {/* RIGHT VISUAL (DESKTOP ONLY) */}
        <div className="hidden lg:block relative h-[32rem]">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              rotateY: [0, 20, 0],
              rotateX: [0, 10, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="relative w-full h-full">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="
                    absolute
                    w-32
                    h-32
                    rounded-xl
                    glass-card
                    border-accent/20
                    flex
                    items-center
                    justify-center
                    shadow-accent/10
                  "
                  style={{
                    top: `${20 + i * 10}%`,
                    left: `${20 + i * 8}%`,
                    zIndex: 10 - i,
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    delay: i * 0.2,
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <Cpu className="text-accent opacity-40" size={32} />
                </motion.div>
              ))}

              <svg
                className="absolute inset-0 w-full h-full opacity-20"
                viewBox="0 0 500 500"
              >
                <path
                  d="M100,100 L400,400"
                  stroke="var(--accent)"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M400,100 L100,400"
                  stroke="var(--accent)"
                  strokeWidth="1"
                  fill="none"
                />
                <circle
                  cx="250"
                  cy="250"
                  r="50"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        onClick={() => scrollToSection("about-me")}
        className="
          absolute
          bottom-6
          left-1/2
          -translate-x-1/2
          hidden
          md:flex
          flex-col
          items-center
          gap-2
          opacity-40
          cursor-pointer
        "
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
