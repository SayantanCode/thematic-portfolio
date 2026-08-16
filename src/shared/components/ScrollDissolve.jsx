import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// How much scroll distance the approach/hold/pass-by curve plays out over.
// `position: sticky` only actually holds a child in place for
// (containerHeight - viewportHeight) of scroll — the container needs to be
// taller than the viewport by exactly this much, not equal to it, or the
// depth curve finishes (and the section fades out) long before the sticky
// pin actually releases, leaving a blank gap before the next section's own
// pin begins.
const PIN_VH = 30;
const CONTAINER_VH = 100 + PIN_VH;

// With offset ["start start", "end end"], scrollYProgress only spans the
// PIN_VH pin range — but the section's own box is a full CONTAINER_VH
// (100 + PIN_VH) tall, so after progress hits 1 there's still 100vh of dead
// box left to scroll through before the *next* section's box even begins,
// and that next section sits frozen at progress 0 (invisible) the whole
// time it's scrolling up from below, since its own progress hasn't started
// yet either. Two invisible sections back to back = a ~100vh dead zone.
// offset ["start end", "end end"] instead starts progress the moment the
// section's top enters the viewport from the bottom, so non-first sections
// fade in *while* scrolling into place instead of sitting invisible through
// it. Under that offset the full CONTAINER_VH is in play, so this is the
// fraction of it spent in that "still entering, not yet pinned" phase.
const ENTER_FRACTION = 100 / CONTAINER_VH;

// Below lg (Tailwind's 1024px breakpoint — matches the fixed bottom tab bar's
// own `lg:hidden`), that bar covers the last ~80px (64px bar + 16px margin)
// of the viewport. Pinned content here centers against the *true* 100vh via
// `h-screen`, with no awareness that the bar is sitting on top of the bottom
// of it — so on mobile it needs to fit and center within (100vh - 80px)
// instead, or its bottom edge renders straight under the bar.
const MOBILE_BAR_CLEARANCE = 80;
const MOBILE_BREAKPOINT = 1024;

/**
 * Pins a section in place — position:sticky, so it never translates on the
 * Y axis — for a fixed scroll distance, and drives scale/opacity/blur
 * continuously off scroll progress through that pinned range: the section
 * approaches from small, blurred and dim (as if still distant), sharpens
 * into full focus and holds there, then grows larger and blurs out again as
 * if rushing past the viewer into the depths behind. Because the section
 * itself never moves vertically, the only thing that changes is depth —
 * everything happens "in the same spot on screen", one section handing off
 * to the next as you keep scrolling.
 *
 * isFirst/isLast skip the approach or pass-by half of that curve for the
 * page's first and last section — Hero has nothing to approach *from* (it's
 * what's on screen at load), and Footer shouldn't rush away right as its
 * contact links are what the user scrolled all this way to reach.
 *
 * Sections taller than one viewport are scaled down to fit entirely inside
 * the pinned frame (measured from the content's natural height), so the
 * "stays in place" illusion holds even for the longest sections — see the
 * `maxScale` prop.
 */
export const ScrollDissolve = ({ children, className = "", isFirst = false, isLast = false }) => {
  const outerRef = useRef(null);
  const contentRef = useRef(null);
  const [fitScale, setFitScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (!contentRef.current) return;
      const naturalHeight = contentRef.current.scrollHeight;
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const availableH = window.innerHeight - (isMobile ? MOBILE_BAR_CLEARANCE : 0);
      setFitScale(Math.min(1, (availableH * 0.94) / naturalHeight));
    };
    measure();
    window.addEventListener("resize", measure);
    // Late-loading images/fonts can still shift content height after mount.
    const settle = setTimeout(measure, 600);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(settle);
    };
  }, []);

  // Hero (isFirst) is already fully on screen at load — there's nothing
  // below the fold for it to scroll up *from*, so it keeps the old offset
  // (progress starts right as its own pin engages). Every other section
  // uses the wider offset so its fade-in plays out during the scroll that
  // brings it into view, instead of after — see ENTER_FRACTION above.
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: isFirst ? ["start start", "end end"] : ["start end", "end end"],
  });

  const scaleStops = isFirst ? [1, 1, 1, 1.3] : [0.55, 1, 1, isLast ? 1 : 1.3];
  const opacityStops = isFirst ? [1, 1, 1, isLast ? 1 : 0] : [0, 1, 1, isLast ? 1 : 0];
  const blurStops = isFirst ? [0, 0, 0, isLast ? 0 : 14] : [16, 0, 0, isLast ? 0 : 14];
  // For isFirst, stops 0-2 are identical anyway (nothing to approach from),
  // so these three fractions only matter for where the pass-by starts.
  // For everyone else, the entering-from-below phase (0 → ENTER_FRACTION)
  // now carries the full fade-in, arriving fully sharp exactly when the
  // section's natural top reaches the viewport top (matching where the
  // sticky pin itself engages) — then a short hold, then pass-by.
  const stopTimes = isFirst
    ? [0, 0.15, 0.45, 1]
    : [0, ENTER_FRACTION, ENTER_FRACTION + (0.3 * PIN_VH) / CONTAINER_VH, 1];

  const depthScale = useTransform(scrollYProgress, stopTimes, scaleStops);
  const opacity = useTransform(scrollYProgress, stopTimes, opacityStops);
  const blur = useTransform(scrollYProgress, stopTimes, blurStops);
  const blurFilter = useTransform(blur, (b) => `blur(${b.toFixed(1)}px)`);
  const scale = useTransform([depthScale], ([d]) => d * fitScale);

  // How far past this element's natural top the depth curve actually
  // settles to full focus — nav clicks (scrollToSection) read this back so
  // clicking "About" etc. lands on the sharp, settled frame instead of the
  // still-fading-in start of the pin range. Always 0 now: isFirst is
  // settled from progress 0, and everyone else's hold begins exactly at
  // ENTER_FRACTION, which by construction lands at scrollY === this
  // element's own natural top.
  const settleVh = 0;

  return (
    <div
      ref={outerRef}
      className="relative"
      data-scroll-settle-vh={settleVh}
      style={{ height: `${CONTAINER_VH}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center pb-20 lg:pb-0">
        <motion.div
          ref={contentRef}
          style={{ scale, opacity, filter: blurFilter, willChange: "transform, opacity, filter" }}
          className={`w-full ${className}`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
