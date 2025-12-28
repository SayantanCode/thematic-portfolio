import React from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import {
  Download,
  ExternalLink,
  Code2,
  Database,
  Shield,
  Zap,
  Activity,
  Cpu,
  Briefcase,
  MapPin,
} from "lucide-react";

export const AboutMe = () => {
  const ReactIcon = (...props) => {
    const { size = 14, color } = props;
    return (
      <i
        className="fa-brands fa-react"
        style={{ fontSize: size, color: color }}
      ></i>
    );
  };
  const ExpressIcon = (...props) => {
    const { size = 14, color } = props;
    return (
      <i
        className="fa-solid fa-server"
        style={{ fontSize: size, color: color }}
      ></i>
    );
  };
  const skills = [
    { name: "Node.js (Runtime)", icon: <Zap size={14} /> },
    { name: "TypeScript (Logic)", icon: <Code2 size={14} /> },
    { name: "Redis (Cache Layer)", icon: <Activity size={14} /> },
    { name: "MongoDB (Store)", icon: <Database size={14} /> },
    { name: "Express.js (Web Framework)", icon: <ExpressIcon size={14} /> },
    { name: "React.js (Frontend Framework)", icon: <ReactIcon size={14} /> },
  ];

  return (
    <section
      id="about-me"
      className="container mx-auto px-6 md:px-12 pt-12 pb-12 md:pb-24 min-h-screen relative overflow-hidden text-primary border-b border-glass-border"
    >
      <SectionHeader
        title="About Me"
        subtitle="The Architect behind the algorithms — focused on reliability and horizontal scalability."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Profile Photo Side */}
        <div className="lg:col-span-5 relative flex flex-col justify-center items-center lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full max-w-md lg:max-w-none"
          >
            {/* Added 'group' class here to fix the image hover scale */}
            <div className="group relative z-10 rounded-2xl overflow-hidden glass-card p-2 border-accent/20">
              <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] xl:aspect-[4/3] rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img
                  src="https://xsgames.co/randomusers/assets/avatars/male/20.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover object-top scale-110 group-hover:scale-100 transition-transform duration-700"
                />
              </div>

              {/* Overlay Stats */}
              <div className="absolute bottom-6 left-6 right-6 p-4 glass-card rounded-lg border-accent/30 flex justify-between items-center backdrop-blur-md">
                <div className="font-mono text-right w-full">
                  <p className="text-[10px] text-muted uppercase tracking-widest">
                    Myself
                  </p>
                  <p className="text-accent font-bold">Sayantan Chakraborty</p>
                </div>
              </div>
            </div>

            {/* Decorative Spinners - Hidden on extra small mobile to prevent overflow issues */}
            <div className="absolute -inset-4 border border-accent rounded-full animate-spin-slow opacity-20 pointer-events-none hidden sm:block" />
          </motion.div>

          {/* Action Button */}
          <div className="flex flex-wrap gap-4 pt-8 justify-center lg:justify-start w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-accent text-bg font-black rounded-sm flex items-center justify-center gap-3 shadow-accent border border-accent hover:bg-transparent hover:text-accent text-xs uppercase tracking-widest"
            >
              Download Resume <Download size={16} />
            </motion.button>
          </div>
        </div>

        {/* Bio and Skills Side */}
        <motion.div
          className="lg:col-span-7 relative z-10"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="space-y-6 flex flex-col items-center lg:items-start">
            {/* Designation Badge - Flex Wrap for mobile */}
            <motion.div className="inline-flex flex-wrap items-center gap-4 lg:gap-2 xl:gap-4 px-4 py-3 sm:py-2 glass-card rounded-lg border-accent/20 mb-4 sm:mb-8">
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[12px] font-mono text-accent uppercase tracking-widest mb-0.5">
                  Current DESIGNATION
                </span>
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-accent" />
                  <span className="text-[11px] sm:text-xs font-bold text-primary uppercase tracking-widest">
                    MERN STACK DEVELOPER @ HIH7 WEBTECH
                  </span>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-accent/20 mx-2" />
              <div className="flex items-center gap-1.5 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-accent/10">
                <MapPin size={12} className="text-muted" />
                <span className="text-[10px] font-mono text-muted uppercase">
                  ON SITE // KOLKATA
                </span>
              </div>
            </motion.div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-header text-primary uppercase tracking-tight leading-tight">
              Bridging the gap between{" "}
              <span className="text-accent">complex logic</span> and user
              demand.
            </h3>

            <p className="text-muted leading-relaxed font-light text-base sm:text-lg">
              With over 1+ years of experience in the MERN stack ecosystem, I've
              transitioned from simple development to deep backend architectural
              design. My passion lies in solving "impossible" bottlenecks.
            </p>

            {/* Skills Grid - Adjusted for Mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4">
              {skills.map((skill, i) => (
                <div
                  key={i}
                  className="p-3 border border-glass-border bg-surface/50 rounded-lg flex items-center gap-3 hover:border-accent/40 transition-colors group cursor-default"
                >
                  <span className="text-accent opacity-50 group-hover:opacity-100 transition-opacity">
                    {skill.icon}
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs text-primary truncate">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Global CSS for Animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
    </section>
  );
};
