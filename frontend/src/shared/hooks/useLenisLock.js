import { useEffect } from "react";
import { getLenis } from "@/shared/lib/smoothScroll.js";

// Lenis is a virtual scroller — native body overflow locks (Radix, vaul,
// or a plain overflow:hidden) don't stop it, so anything that opens over
// the page needs to stop/start it explicitly to actually freeze scroll.
//
// Locking only `document.body` isn't enough on its own: Lenis has no
// wrapper/content here, so it hijacks native window scroll, and the real
// scroll container ends up being `document.documentElement` (<html>) —
// body's overflow only propagates to the viewport while it's left at its
// default `visible`, so once we set it explicitly, `html` keeps scrolling
// (and the native scrollbar keeps dragging it) unless it's locked too.
export const useLenisLock = (isLocked, { lockBody = true } = {}) => {
  useEffect(() => {
    const lenis = getLenis();
    if (isLocked) {
      if (lenis) lenis.stop();
      if (lockBody) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      }
    } else {
      if (lenis) lenis.start();
      if (lockBody) {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
    }
    return () => {
      if (lenis) lenis.start();
      if (lockBody) {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
    };
  }, [isLocked, lockBody]);
};
