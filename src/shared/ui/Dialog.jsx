import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/**
 * Desktop half of the responsive Modal (see ./Modal.jsx). Radix owns
 * accessibility/behavior (focus trap, Escape, outside-click, ARIA); the
 * `open && (...)` gate wrapped in AnimatePresence — combined with
 * `forceMount` on Overlay/Content so Radix doesn't rip the DOM node out
 * before the exit animation finishes — reproduces the exact fade/scale
 * transition the old hand-rolled Modal used.
 *
 * Content's asChild target is split into two nested elements on purpose:
 * an outer plain div doing the fixed/centered positioning via a static CSS
 * transform, and an inner motion.div doing the scale/opacity/y animation.
 * Framer Motion writes its own inline `transform`, which would silently
 * clobber a static Tailwind translate-centering class on the same element —
 * splitting them avoids that fight. Content's DOM footprint is also kept to
 * just the card itself (not full-screen) so Radix's outside-click detection
 * still treats a click on the Overlay backdrop as "outside" and closes it.
 */
export const Dialog = ({ open, onClose, title, className = "", children }) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-10000 bg-bg/95 backdrop-blur-md"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
              <div className="fixed left-1/2 top-1/2 z-10000 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-3rem)] max-w-lg">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative glass-card rounded-2xl border border-accent/20 shadow-[0_0_60px_var(--accent-glow)] max-h-[85vh] overflow-hidden",
                    className
                  )}
                >
                  <DialogPrimitive.Title className="sr-only">
                    {title || "Dialog"}
                  </DialogPrimitive.Title>

                  <DialogPrimitive.Close
                    aria-label="Close"
                    className="interactive absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface/80 border border-glass-border text-muted hover:text-accent hover:border-accent/40 flex items-center justify-center transition-colors"
                  >
                    <X size={18} />
                  </DialogPrimitive.Close>

                  <div data-lenis-prevent className="modal-scroll max-h-[85vh] overflow-y-auto">
                    {children}
                  </div>
                </motion.div>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};
