import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, ChevronUp } from 'lucide-react';
import { KineticText } from '@/shared/components/text/KineticText.jsx';
import { ParticleTypography } from '@/shared/components/text/ParticleTypography.jsx';
import { FlipWords } from '@/shared/components/text/FlipWords.jsx';
import { usePrefersReducedMotionOrLowPower } from '@/shared/hooks/usePrefersReducedMotionOrLowPower';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { scrollToSection } from '@/shared/hooks/useSectionScroll.js';
import { Button } from '@/shared/ui/Button.jsx';

const SOCIALS = [
  { Icon: Github, href: "https://github.com/SayantanCode", label: "GitHub" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/sayantan-chakraborty-code", label: "LinkedIn" },
  { Icon: Mail, href: "mailto:sayantan648@gmail.com", label: "Email" },
];

const FLIP_WORDS = ["SCALABLE", "RELIABLE", "SECURE", "REAL-TIME"];

const QUICK_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "journey", label: "Journey" },
];

export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const reduceMotion = usePrefersReducedMotionOrLowPower();
  // Particle typography needs real horizontal room to stay legible — the font
  // has to shrink so much on narrow screens that individual letters blur
  // together, so narrow viewports get the plain kinetic-text treatment too.
  const isNarrowViewport = useMediaQuery('(max-width: 639px)');
  const useParticles = !reduceMotion && !isNarrowViewport;

  return (
    <footer id="contact" className="relative pt-24 pb-8 overflow-hidden border-t border-glass-border">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          {/* text-primary for theme-aware heading */}
          {!useParticles ? (
            <h2 className="text-4xl md:text-6xl font-header font-black text-primary mb-6 uppercase tracking-tighter">
              <KineticText as="span" text="Let's build" trigger="inView" once={false} />
              <br />
              <KineticText as="span" text="something" trigger="inView" once={false} delay={0.25} />{" "}
              <FlipWords
                words={FLIP_WORDS}
                disabled={reduceMotion}
                className="text-accent drop-shadow-[0_0_10px_var(--accent-glow)]"
              />
            </h2>
          ) : (
            <div className="mb-6 -mx-6">
              <ParticleTypography
                text="LET'S BUILD"
                colorVar="--text"
                fontSize={90}
                height={110}
              />
              <ParticleTypography
                text="SOMETHING"
                colorVar="--accent"
                fontSize={64}
                height={100}
                glow
              />
              <div className="flex justify-center font-header font-black uppercase tracking-tighter text-accent text-5xl md:text-[64px] drop-shadow-[0_0_20px_var(--accent-glow)] -mt-4">
                <FlipWords words={FLIP_WORDS} disabled={reduceMotion} />
              </div>
            </div>
          )}

          <p className="text-muted mb-8 font-mono text-sm max-w-md mx-auto">
            Currently available for specialized backend consulting & contract roles.
          </p>

          <Button
            as="a"
            href="mailto:sayantan648@gmail.com"
            icon={<Mail size={20} />}
            className="px-10 py-5 text-lg"
          >
            Hire Me
          </Button>
        </motion.div>

        {/* 4-column info grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 text-left mb-16 pt-12 border-t border-glass-border">
          <div>
            <h3 className="font-header font-black text-primary text-lg mb-2">
              Sayantan Chakraborty
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              Backend-focused MERN stack developer, building scalable and
              real-time web applications.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="interactive text-muted hover:text-accent text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-4">
              Connect With Me
            </h4>
            <ul className="space-y-2 text-muted text-sm">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-accent shrink-0" />
                <a href="mailto:sayantan648@gmail.com" className="interactive hover:text-accent transition-colors">
                  sayantan648@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-accent shrink-0" />
                Kolkata, West Bengal, India
              </li>
              <li className="flex items-center gap-2">
                <Github size={14} className="text-accent shrink-0" />
                <a href="https://github.com/SayantanCode" target="_blank" rel="noreferrer" className="interactive hover:text-accent transition-colors">
                  github.com/SayantanCode
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-4">
              Follow Me
            </h4>
            <div className="flex gap-4">
              {SOCIALS.map(({ Icon, href, label }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={label}
                  whileHover={{ y: -4 }}
                  className="w-10 h-10 rounded-lg bg-surface/50 border border-glass-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-colors duration-300"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Sayantan Chakraborty — Built with precision
          </p>

          <button
            onClick={scrollToTop}
            className="p-3 border border-glass-border rounded-full text-muted hover:text-accent hover:border-accent transition-all shadow-sm"
          >
            <ChevronUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};
