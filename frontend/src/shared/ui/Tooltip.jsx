import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/shared/lib/utils";

/** Wrap the app root once — see App.jsx. */
export const TooltipProvider = ({ children, ...props }) => (
  <TooltipPrimitive.Provider delayDuration={150} skipDelayDuration={300} {...props}>
    {children}
  </TooltipPrimitive.Provider>
);

/**
 * Same public API as before (`<Tooltip label="...">{children}</Tooltip>`,
 * used unchanged in Hero.jsx/SkillsGrid.jsx), now backed by Radix instead of
 * a pure-CSS `group-hover` trick. Same pill styling, but gains real
 * collision-aware positioning (the old version was hardcoded `-top-10`,
 * which just clips near a viewport edge) and keyboard/focus triggering,
 * which a CSS-only hover state has no way to provide.
 */
export const Tooltip = ({ label, children, className = "", side = "top" }) => (
  <TooltipPrimitive.Root>
    <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        sideOffset={8}
        collisionPadding={8}
        className={cn(
          "z-20 whitespace-nowrap rounded-md bg-surface border border-glass-border px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-primary shadow-lg",
          className
        )}
      >
        {label}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  </TooltipPrimitive.Root>
);
