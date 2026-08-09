import React from "react";
import { motion } from "framer-motion";

const VARIANT_CLASSES = {
  primary:
    "fill-accent-glossy text-bg shadow-accent hover:shadow-accent/40 btn-swipe btn-swipe-shine",
  secondary:
    "border border-accent/40 text-accent glass-card btn-swipe btn-swipe-fill hover:text-bg",
  // Outlined + faintly filled at once — visible tint at rest, not just on hover.
  ghost:
    "border border-accent/40 bg-accent/10 text-accent btn-swipe btn-swipe-fill hover:text-bg",
};

const SIZE_CLASSES = {
  sm: "px-5 py-2.5 text-[11px] gap-1.5 rounded-sm",
  md: "px-7 py-4 text-xs gap-2 rounded-sm",
};

/**
 * Shared CTA styling — every button-shaped call to action on the site
 * (primary solid / secondary outline, two sizes) should go through this
 * instead of hand-rolling className combinations per component.
 */
export const Button = ({
  as = "button",
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  className = "",
  children,
  ...props
}) => {
  const MotionTag = as === "a" ? motion.a : motion.button;

  return (
    <MotionTag
      whileTap={{ scale: 0.96 }}
      className={`interactive inline-flex items-center font-black uppercase tracking-widest transition-colors duration-300 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </MotionTag>
  );
};
