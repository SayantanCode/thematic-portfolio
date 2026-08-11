import React from "react";
import { cn } from "@/shared/lib/utils";

/**
 * shadcn's compound Card API, restyled onto this project's existing
 * `.glass-card` look (bg/blur/border/hover-lift/shadow, defined once in
 * index.css) instead of shadcn's stock bg-card/border/shadow-sm. Every
 * sub-component just merges its own default classes with whatever the call
 * site passes via `className` (cn() lets the caller's classes win), so each
 * usage site can still fully customize layout/spacing per its own needs.
 */
export const Card = ({ className = "", ...props }) => (
  <div data-slot="card" className={cn("glass-card rounded-2xl", className)} {...props} />
);

export const CardHeader = ({ className = "", ...props }) => (
  <div data-slot="card-header" className={cn("flex flex-col gap-1.5", className)} {...props} />
);

export const CardTitle = ({ className = "", ...props }) => (
  <h3 data-slot="card-title" className={cn("font-header font-bold text-lg text-primary", className)} {...props} />
);

export const CardDescription = ({ className = "", ...props }) => (
  <p data-slot="card-description" className={cn("text-muted text-sm leading-relaxed", className)} {...props} />
);

export const CardAction = ({ className = "", ...props }) => (
  <div data-slot="card-action" className={cn("ml-auto", className)} {...props} />
);

export const CardContent = ({ className = "", ...props }) => (
  <div data-slot="card-content" className={cn("", className)} {...props} />
);

export const CardFooter = ({ className = "", ...props }) => (
  <div data-slot="card-footer" className={cn("flex items-center", className)} {...props} />
);
