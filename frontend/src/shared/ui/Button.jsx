import React from "react";
import { motion } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

export const buttonVariants = cva(
  "interactive inline-flex items-center font-black uppercase tracking-widest transition-colors duration-300",
  {
    variants: {
      variant: {
        primary: "fill-accent-glossy text-bg shadow-accent hover:shadow-accent/40 btn-swipe btn-swipe-shine",
        // Outlined + faintly filled at once — visible tint at rest, not just on hover.
        secondary: "border border-accent/40 text-accent glass-card btn-swipe btn-swipe-fill hover:text-bg",
        ghost: "border border-accent/40 bg-accent/10 text-accent btn-swipe btn-swipe-fill hover:text-bg",
      },
      size: {
        sm: "px-5 py-2.5 text-[11px] gap-1.5 rounded-sm",
        md: "px-7 py-4 text-xs gap-2 rounded-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

/**
 * Shared CTA styling — every button-shaped call to action on the site
 * should go through this instead of hand-rolling className combinations.
 *
 * `as="button"|"a"` (existing prop, unchanged) picks the rendered/motion
 * tag. `asChild` is new and additive: it renders via Radix's Slot, merging
 * these classes onto whatever single child you pass instead of wrapping it
 * — useful for e.g. a react-router `<Link>` that needs to stay the actual
 * DOM node. Slot doesn't do animation, so the `whileTap` micro-interaction
 * only applies to the default (non-asChild) path; animate the child
 * yourself if you need it under asChild.
 */
export const Button = ({
  as = "button",
  asChild = false,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  className = "",
  children,
  ...props
}) => {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {children}
      </Slot>
    );
  }

  const MotionTag = as === "a" ? motion.a : motion.button;

  return (
    <MotionTag whileTap={{ scale: 0.96 }} className={classes} {...props}>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </MotionTag>
  );
};
