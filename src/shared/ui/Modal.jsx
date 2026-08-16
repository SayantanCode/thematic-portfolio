import React, { useEffect } from "react";
import { Dialog } from "./Dialog.jsx";
import { Drawer } from "./Drawer.jsx";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useLenisLock } from "@/shared/hooks/useLenisLock.js";

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

  // Radix/vaul own their own scroll-event locking (wheel/touch/key), but
  // neither stops a scrollbar-thumb drag — that fires a native `scroll`
  // event with nothing cancelable to intercept, so the only real fix is
  // removing the scrollbar itself. useLenisLock's html+body overflow lock
  // does that; let it run here instead of relying on Radix/vaul alone.
  useLenisLock(isOpen);

  // With Lenis stopped, native hover-to-scroll only works while the cursor
  // sits directly over .modal-scroll. Capture wheel anywhere on the page
  // and redirect it there instead — same "scroll from anywhere" behavior
  // ThemeSwitcher.jsx gives its own panel via a window-level listener.
  useEffect(() => {
    if (!isOpen) return;

    const handleWheel = (e) => {
      const scrollEl = document.querySelector(".modal-scroll");
      if (!scrollEl) return;
      e.preventDefault();
      scrollEl.scrollTop += e.deltaY;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isOpen]);

  return (
    <Variant open={isOpen} onClose={onClose} title={title} className={className}>
      {children}
    </Variant>
  );
};
