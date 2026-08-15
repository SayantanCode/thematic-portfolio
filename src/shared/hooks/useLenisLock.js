import { useEffect } from "react";
import { getLenis } from "@/shared/lib/smoothScroll.js";

// Lenis is a virtual scroller — native body overflow locks (Radix, vaul,
// or a plain overflow:hidden) don't stop it, so anything that opens over
// the page needs to stop/start it explicitly to actually freeze scroll.
export const useLenisLock = (isLocked, { lockBody = true } = {}) => {
  useEffect(() => {
    const lenis = getLenis();
    if (isLocked) {
      if (lenis) lenis.stop();
      if (lockBody) document.body.style.overflow = "hidden";
    } else {
      if (lenis) lenis.start();
      if (lockBody) document.body.style.overflow = "";
    }
    return () => {
      if (lenis) lenis.start();
      if (lockBody) document.body.style.overflow = "";
    };
  }, [isLocked, lockBody]);
};
