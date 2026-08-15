import React from "react";
import { motion } from "framer-motion";
import { Clock, GitBranch, Star, Package, ArrowRight, ZoomIn, MapPin, Briefcase, Download } from "lucide-react";
import { SectionHeader } from "@/shared/components/SectionHeader.jsx";
import { Button } from "@/shared/ui/Button.jsx";
import { Modal } from "@/shared/ui/Modal.jsx";
import { CardContent, CardTitle, CardDescription } from "@/shared/ui/Card.jsx";
import { useModal } from "@/shared/hooks/useModal.js";
import { getYearsOfExperience } from "./experience.util.js";
import { GITHUB_STATS } from "@/constants/githubStats.constants.js";
import { scrollToSection } from "@/shared/hooks/useSectionScroll.js";
import profilePhoto from "@/assets/images/me.jpg";

const STATS = [
  { label: "of Experience", value: getYearsOfExperience(), icon: <Clock size={20} /> },
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
          className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start border border-glass-border"
        >
          <div className="relative shrink-0 mb-3">
            <button
              onClick={photoModal.open}
              aria-label="Enlarge profile photo"
              className="interactive group relative block"
            >
              <img
                src={profilePhoto}
                alt="Sayantan Chakraborty"
                className="w-32 sm:w-36 aspect-3/4 rounded-2xl object-cover border border-accent/30 grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <span className="absolute inset-0 rounded-2xl bg-bg/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <ZoomIn size={20} className="text-accent" />
              </span>
              {/* Persistent affordance so it reads as clickable before hover */}
              <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-accent text-bg flex items-center justify-center shadow-[0_0_12px_var(--accent-glow)]">
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex"
                >
                  <ZoomIn size={12} />
                </motion.span>
              </span>
            </button>

            {/* Download CV — a labeled plate hanging off the bottom of the
                frame, like a nameplate, so it actually reads as "download
                my resume" instead of being an unlabeled icon nobody would
                click. Source TBD (static asset, external link, or jsPDF);
                points at the conventional /resume.pdf public-asset path for
                now, so dropping a file there works with no code change. */}
            <a
              href="/resume.pdf"
              download
              aria-label="Download CV"
              className="interactive absolute inset-x-2 -bottom-3 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-accent text-bg text-[10px] font-black uppercase tracking-widest shadow-[0_4px_10px_var(--accent-glow)] hover:brightness-110 transition-[filter]"
            >
              <Download size={12} />
              Download CV
            </a>
          </div>

          <CardContent className="flex-1">
            <CardTitle className="mb-1">Backend Developer</CardTitle>
            <CardDescription className="mb-4">
              Loves clean code and solving real-world problems — a career
              switcher who traded the classroom for backend architecture.
            </CardDescription>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection("journey")}
              icon={<ArrowRight size={14} />}
            >
              Discover My Journey
            </Button>
          </CardContent>
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

      <Modal
        isOpen={photoModal.isOpen}
        onClose={photoModal.close}
        title="Profile photo and details"
      >
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
