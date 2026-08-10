import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// How much scroll distance the approach/hold/pass-by curve plays out over.
// `position: sticky` only actually holds a child in place for
// (containerHeight - viewportHeight) of scroll — the container needs to be
// taller than the viewport by exactly this much, not equal to it, or the
// depth curve finishes (and the section fades out) long before the sticky
// pin actually releases, leaving a blank gap before the next section's own
// pin begins.
const PIN_VH = 50;
const CONTAINER_VH = 100 + PIN_VH;

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
      const viewportH = window.innerHeight;
      setFitScale(Math.min(1, (viewportH * 0.94) / naturalHeight));
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

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const scaleStops = isFirst ? [1, 1, 1, 1.3] : [0.55, 1, 1, isLast ? 1 : 1.3];
  const opacityStops = isFirst ? [1, 1, 1, isLast ? 1 : 0] : [0, 1, 1, isLast ? 1 : 0];
  const blurStops = isFirst ? [0, 0, 0, isLast ? 0 : 14] : [16, 0, 0, isLast ? 0 : 14];
  // Fade-in/out windows kept tight (vs. the old 0.28) so sections snap into
  // focus within ~24vh of scroll instead of ~56vh — scrolling should read as
  // visible change almost immediately, not a long blurry dead zone before
  // anything sharpens up.
  const stopTimes = [0, 0.12, 0.88, 1];

  const depthScale = useTransform(scrollYProgress, stopTimes, scaleStops);
  const opacity = useTransform(scrollYProgress, stopTimes, opacityStops);
  const blur = useTransform(scrollYProgress, stopTimes, blurStops);
  const blurFilter = useTransform(blur, (b) => `blur(${b.toFixed(1)}px)`);
  const scale = useTransform([depthScale], ([d]) => d * fitScale);

  // How far past this element's natural top the depth curve actually
  // settles to full focus — nav clicks (scrollToSection) read this back so
  // clicking "About" etc. lands on the sharp, settled frame instead of the
  // still-fading-in start of the pin range.
  const settleVh = isFirst ? 0 : PIN_VH * 0.12;

  return (
    <div
      ref={outerRef}
      className="relative"
      data-scroll-settle-vh={settleVh}
      style={{ height: `${CONTAINER_VH}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
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
