import React from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/shared/components/SectionHeader.jsx";
import { GraduationCap, Briefcase, ExternalLink } from "lucide-react";
import { TIMELINE } from "@/constants/timeline.constants.js";

const TimelineEntry = ({ entry, index, isLast }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true, margin: "-50px" }}
    className="relative pl-12 sm:pl-16 pb-10 last:pb-0"
  >
    {!isLast && (
      <span className="absolute left-[15px] sm:left-[19px] top-9 bottom-0 w-px bg-glass-border" />
    )}
    <span className="absolute left-0 top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center">
      {entry.type === "education" ? <GraduationCap size={16} /> : <Briefcase size={16} />}
    </span>

    <span className="text-accent font-mono text-xs uppercase tracking-widest">
      {entry.period}
    </span>
    <h3 className="font-header font-bold text-lg sm:text-xl text-primary mt-1 mb-1">
      {entry.title}
    </h3>
    <p className="text-muted text-sm font-mono mb-3">{entry.org}</p>
    <p className="text-muted text-sm sm:text-base leading-relaxed mb-4 max-w-2xl">
      {entry.description}
    </p>

    {entry.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-3">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-surface/50 border border-glass-border rounded-full text-[10px] sm:text-xs font-mono text-accent/80"
          >
            {tag}
          </span>
        ))}
      </div>
    )}

    {entry.credentialUrl && (
      <a
        href={entry.credentialUrl}
        target="_blank"
        rel="noreferrer"
        className="interactive inline-flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-widest border-b border-glass-border pb-1 hover:border-accent hover:text-accent transition-all"
      >
        View Credential <ExternalLink size={12} />
      </a>
    )}
  </motion.div>
);

export const JourneyTimeline = () => {
  return (
    <section id="journey" className="container mx-auto px-6 md:px-12 py-12 md:py-24 text-primary border-b border-glass-border">
      <SectionHeader
        title="My Journey"
        subtitle="From the classroom to backend architecture — the real timeline."
      />

      <div className="max-w-3xl mx-auto">
        {TIMELINE.map((entry, i) => (
          <TimelineEntry
            key={entry.id}
            entry={entry}
            index={i}
            isLast={i === TIMELINE.length - 1}
          />
        ))}
      </div>
    </section>
  );
};
