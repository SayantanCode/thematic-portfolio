import React from "react";

/**
 * Wraps any element with a small accent-bordered label that fades in above
 * it on hover — used instead of the native `title` attribute so it matches
 * the site's visual language.
 */
export const Tooltip = ({ label, children, className = "" }) => (
  <div className={`group relative inline-flex ${className}`}>
    {children}
    <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface border border-glass-border px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-primary opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-20 shadow-lg">
      {label}
    </span>
  </div>
);
