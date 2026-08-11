import React from "react";
import { Dialog } from "./Dialog.jsx";
import { Drawer } from "./Drawer.jsx";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

/**
 * Reusable responsive modal — picks Dialog (centered, desktop) or Drawer
 * (bottom sheet, mobile) at the same breakpoint Sidebar.jsx uses for its own
 * desktop/mobile split, so both stay in sync as one visual language. Same
 * public API as before (isOpen/onClose/children/className), plus a new
 * optional `title` for screen readers — the old version had none at all.
 *
 * Dialog.jsx and Drawer.jsx are each independently importable too, for any
 * future spot that specifically wants "always a dialog" or "always a
 * drawer" instead of this breakpoint-driven choice.
 */
export const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const Variant = isMobile ? Drawer : Dialog;

  return (
    <Variant open={isOpen} onClose={onClose} title={title} className={className}>
      {children}
    </Variant>
  );
};
