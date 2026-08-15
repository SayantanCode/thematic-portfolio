import React from "react";
import { motion, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";

/*
 * Blurred/dim by default; sharpens to full color and clarity once the
 * ring-fill reaches this entry's node (`active` is a 0→1 MotionValue
 * driven by scroll — see JourneyTimeline).
 */
export const JourneyCard = ({ entry, active, widthClassName = "w-48 sm:w-64" }) => {
  const opacity = useTransform(active, [0, 1], [0.32, 1]);
  const blurPx = useTransform(active, [0, 1], [5, 0]);
  const saturatePct = useTransform(active, [0, 1], [15, 100]);
  const filter = useTransform(
    [blurPx, saturatePct],
    ([b, s]) => `blur(${b}px) saturate(${s}%)`
  );

  return (
    <motion.div
      style={{ opacity, filter }}
      className={`pointer-events-auto text-left ${widthClassName}`}
    >
      <span
        className="
          text-accent
          font-mono
          text-[10px]
          uppercase
          tracking-widest
        "
      >
        {entry.period}
      </span>

      <h3
        className="
          font-header
          font-bold
          text-base
          sm:text-lg
          text-primary
          mt-1
          mb-1
        "
      >
        {entry.title}
      </h3>

      <p
        className="
          text-muted
          text-xs
          font-mono
          mb-2
        "
      >
        {entry.org}
      </p>

      <p
        className="
          hidden
          sm:block
          text-muted
          text-xs
          leading-relaxed
          mb-3
        "
      >
        {entry.description}
      </p>

      {entry.tags?.length > 0 && (
        <div className="hidden sm:flex flex-wrap gap-1.5 mb-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="
                px-2
                py-0.5
                rounded-full
                border
                border-glass-border
                bg-surface/50
                text-accent/80
                text-[9px]
                font-mono
              "
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
          className="
            interactive
            hidden
            sm:inline-flex
            items-center
            gap-1.5
            text-primary
            text-[10px]
            font-mono
            uppercase
            tracking-widest
            border-b
            border-glass-border
            pb-1
            hover:text-accent
            hover:border-accent
            transition
          "
        >
          View Credential
          <ExternalLink size={10} />
        </a>
      )}
    </motion.div>
  );
};
