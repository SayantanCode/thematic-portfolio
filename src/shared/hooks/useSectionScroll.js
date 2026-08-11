import { getLenis } from "@/shared/lib/smoothScroll.js";

/**
 * Scrolls to a section by id, routed through Lenis when available so it stays
 * in sync with the site's smooth-scroll engine (falls back to native smooth
 * scroll if Lenis hasn't mounted yet).
 */
export const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (!section) return;

  // Sections pinned by ScrollDissolve render fully faded-in/settled partway
  // through their own scroll range, not at their natural top — landing
  // there directly (offset 0) would leave the section still visibly
  // fading/blurred until the user scrolls a bit further themselves. The
  // wrapper records how far past its top that settle point actually is.
  const pinnedWrapper = section.closest("[data-scroll-settle-vh]");
  const settleVh = pinnedWrapper ? Number(pinnedWrapper.dataset.scrollSettleVh) || 0 : 0;
  const offset = (settleVh / 100) * window.innerHeight;

  // Target the wrapper, not the section itself, when pinned: the section
  // sits inside a position:sticky element, whose getBoundingClientRect()
  // reports wildly different things depending on whether it's currently
  // stuck, not-yet-stuck, or already released past its range — it's not a
  // stable reference to scroll toward. The wrapper is plain position:
  // relative, so its rect is always just its true document position.
  const target = pinnedWrapper || section;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.2, offset });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
};

export const useSectionScroll = () => scrollToSection;
