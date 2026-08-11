import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Code2, Briefcase, Clock, Mail, Menu, X } from "lucide-react";
import { scrollToSection } from "@/shared/hooks/useSectionScroll.js";
import { useActiveSection } from "@/shared/hooks/useActiveSection.js";

const NAV_ITEMS = [
  { id: "home", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "skills", label: "Skills", Icon: Code2 },
  { id: "projects", label: "Projects", Icon: Briefcase },
  { id: "journey", label: "Journey", Icon: Clock },
  { id: "contact", label: "Contact", Icon: Mail },
];

const NavIcon = ({ id, label, Icon, onNavigate, isActive, vertical = true }) => (
  <button
    onClick={() => onNavigate(id)}
    aria-label={label}
    aria-current={isActive ? "true" : undefined}
    className={`interactive group relative flex items-center justify-center ${
      vertical ? "w-11 h-11" : "w-full gap-4 px-4 py-3"
    } rounded-xl transition-colors duration-300 ${
      isActive
        ? "text-accent bg-accent/10 shadow-[0_0_16px_var(--accent-glow)]"
        : "text-muted hover:text-accent hover:bg-accent/10"
    }`}
  >
    {vertical && (
      <span
        className={`absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        style={{ boxShadow: "6px 0 16px 2px var(--accent-glow)" }}
      />
    )}
    <Icon size={vertical ? 20 : 18} />
    {vertical ? (
      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-surface border border-glass-border px-2.5 py-1 text-xs font-mono text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
        {label}
      </span>
    ) : (
      <span className="font-mono text-sm uppercase tracking-widest">{label}</span>
    )}
  </button>
);

export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useActiveSection(NAV_ITEMS.map((item) => item.id));

  const handleNavigate = (id) => {
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      {/* DESKTOP: fixed left icon rail */}
      <aside className="hidden lg:flex fixed left-0 top-4 bottom-4 w-20 z-40 flex-col items-center py-8 rounded-r-3xl border border-l-0 border-accent/15 bg-surface/50 backdrop-blur-xl shadow-[8px_0_40px_-12px_var(--accent-glow)]">
        <button
          onClick={() => handleNavigate("home")}
          aria-label="Scroll to top"
          className="interactive mb-10 w-11 h-11 rounded-xl bg-accent/10 border border-accent/30 text-accent font-header font-black flex items-center justify-center shadow-[0_0_16px_var(--accent-glow)]"
        >
          SC
        </button>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavIcon
              key={item.id}
              {...item}
              isActive={item.id === activeId}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>
      </aside>

      {/* MOBILE: slim top bar + overlay menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 border-b border-glass-border bg-surface/70 backdrop-blur-md">
        <button
          onClick={() => handleNavigate("home")}
          className="interactive w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 text-accent font-header font-black flex items-center justify-center text-sm"
        >
          SC
        </button>

        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="interactive text-primary"
        >
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-bg/95 backdrop-blur-md flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-glass-border">
              <span className="font-header font-black text-accent">SC</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="interactive text-primary"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center gap-2 px-6">
              {NAV_ITEMS.map((item) => (
                <NavIcon
                  key={item.id}
                  {...item}
                  isActive={item.id === activeId}
                  onNavigate={handleNavigate}
                  vertical={false}
                />
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
