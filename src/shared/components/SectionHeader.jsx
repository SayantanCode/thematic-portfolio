import React from 'react';
import { motion } from 'framer-motion';
import { KineticText } from '@/shared/components/text/KineticText.jsx';

export const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-12 md:mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-header font-black text-wrap">
        <KineticText
          text={title}
          splitBy="char"
          trigger="inView"
          once={false}
          stagger={0.03}
          duration={0.6}
          className="text-accent drop-shadow-[0_0_18px_var(--accent-glow)]"
        />

        {/* Animated Underline */}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "circOut" }}
          className="block h-1 md:h-2 w-20 md:w-32 bg-accent mt-4 origin-left rounded-full shadow-[0_0_20px_var(--accent-glow)]"
        />
      </h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-muted font-mono text-xs sm:text-sm md:text-base max-w-2xl border-l-2 border-accent/30 pl-4 md:pl-6 leading-relaxed italic"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
