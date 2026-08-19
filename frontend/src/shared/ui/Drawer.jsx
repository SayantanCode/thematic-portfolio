import React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/**
 * Mobile half of the responsive Modal (see ./Modal.jsx) — a bottom sheet
 * built on vaul, which owns its own drag/spring animation natively (no
 * Framer Motion needed here, unlike ./Dialog.jsx). Same visual language
 * (glass-card, accent border/glow) as the desktop Dialog for consistency.
 */
export const Drawer = ({ open, onClose, title, className = "", children }) => {
  return (
    <DrawerPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-10000 bg-black/40 backdrop-blur-sm" />
        <DrawerPrimitive.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-10000 flex flex-col glass-card rounded-t-2xl border border-b-0 border-accent/20 shadow-[0_0_60px_var(--accent-glow)] max-h-[88vh] outline-none",
            className
          )}
        >
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-glass-border" />

          <DrawerPrimitive.Title className="sr-only">{title || "Dialog"}</DrawerPrimitive.Title>

          <DrawerPrimitive.Close
            aria-label="Close"
            className="interactive absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface/80 border border-glass-border text-muted hover:text-accent hover:border-accent/40 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </DrawerPrimitive.Close>

          <div data-lenis-prevent className="modal-scroll flex-1 overflow-y-auto px-1 pb-6">
            {children}
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
};
