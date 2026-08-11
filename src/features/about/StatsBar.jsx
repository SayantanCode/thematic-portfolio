import React from "react";
import { motion } from "framer-motion";
import { Clock, GitBranch, Star, Package, ArrowRight, ZoomIn, MapPin, Briefcase } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Button } from "./ui/Button.jsx";
import { Modal } from "./ui/Modal.jsx";
import { useModal } from "../hooks/useModal.js";
import { getYearsOfExperience } from "../utils/experience.js";
import { GITHUB_STATS } from "../constants/GitHubStats.js";
import { scrollToSection } from "../hooks/useSectionScroll.js";
import profilePhoto from "../assets/me.jpg";

const STATS = [
  { label: "Years Experience", value: getYearsOfExperience(), icon: <Clock size={20} /> },
  { label: "Public Repos", value: `${GITHUB_STATS.repoCount}+`, icon: <GitBranch size={20} /> },
  { label: "GitHub Stars", value: `${GITHUB_STATS.totalStars}`, icon: <Star size={20} /> },
  { label: "OSS Packages", value: `${GITHUB_STATS.npmPackages}`, icon: <Package size={20} /> },
];

const DETAIL_ROWS = [
  { label: "Name", value: "Sayantan Chakraborty", icon: <Briefcase size={14} /> },
  { label: "Role", value: "Backend-Focused MERN Stack Developer", icon: <Briefcase size={14} /> },
  { label: "Location", value: "Kolkata, West Bengal, India", icon: <MapPin size={14} /> },
];

export const StatsBar = () => {
  const photoModal = useModal();

  return (
    <section id="about" className="container mx-auto px-6 md:px-12 pt-24 pb-12 md:pb-24 text-primary border-b border-glass-border">
      <SectionHeader
        title="About Me"
        subtitle="Backend developer who traded a classroom for a codebase — and loves clean, real-world solutions."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_2fr] items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row lg:flex-col gap-5 items-center sm:items-start lg:items-start border border-glass-border"
        >
          <button
            onClick={photoModal.open}
            aria-label="Enlarge profile photo"
            className="interactive group relative shrink-0"
          >
            <img
              src={profilePhoto}
              alt="Sayantan Chakraborty"
              className="w-24 h-24 rounded-2xl object-cover border border-accent/30 grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            <span className="absolute inset-0 rounded-2xl bg-bg/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <ZoomIn size={20} className="text-accent" />
            </span>
            {/* Persistent affordance so it reads as clickable before hover */}
            <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-accent text-bg flex items-center justify-center shadow-[0_0_12px_var(--accent-glow)]">
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex"
              >
                <ZoomIn size={12} />
              </motion.span>
            </span>
          </button>

          <div className="flex-1">
            <h3 className="font-header font-bold text-lg text-primary mb-1">
              Backend Developer
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Loves clean code and solving real-world problems — a career
              switcher who traded the classroom for backend architecture.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection("journey")}
              icon={<ArrowRight size={14} />}
            >
              More About Me
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-center border border-glass-border hover:border-accent/30 transition-colors"
            >
              <div className="text-accent mb-3">{stat.icon}</div>
              <span className="font-header font-black text-2xl sm:text-3xl text-primary">
                {stat.value}
              </span>
              <span className="text-muted font-mono text-[10px] sm:text-xs uppercase tracking-widest mt-1">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal isOpen={photoModal.isOpen} onClose={photoModal.close}>
        <img
          src={profilePhoto}
          alt="Sayantan Chakraborty"
          className="w-full aspect-square object-cover"
        />
        <div className="p-6">
          {DETAIL_ROWS.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
              className="flex items-start gap-3 py-2.5 border-b border-glass-border last:border-b-0"
            >
              <span className="text-accent mt-0.5">{row.icon}</span>
              <div>
                <p className="text-muted text-[10px] font-mono uppercase tracking-widest">
                  {row.label}
                </p>
                <p className="text-primary text-sm font-bold">{row.value}</p>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + DETAIL_ROWS.length * 0.1, duration: 0.4 }}
            className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-glass-border"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-header font-black text-accent text-lg">
                  {stat.value}
                </p>
                <p className="text-muted text-[8px] font-mono uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </Modal>
    </section>
  );
};
