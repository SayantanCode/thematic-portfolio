import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * The non-pinned sibling of ScrollDissolve — for sections too content-dense
 * to shrink onto one screen without hurting legibility (Skills, Featured
 * Projects, Journey). These scroll normally, full size — but still fade/blur
 * in as they enter from below and back out as they finally scroll past the
 * top, so the depth language stays consistent with the pinned sections on
 * either side of them instead of abruptly switching to a plain cut.
 *
 * Drives that off ONE continuous scroll progress spanning the section's
 * entire pass-through (top hits viewport bottom -> bottom hits viewport
 * top), the same pattern ScrollDissolve uses — not two independently
 * tracked enter/exit progresses. Two independent trackers meant that for
 * any section shorter than one viewport (routine on mobile, where a section
 * comfortably taller than a wide desktop viewport can still end up shorter
 * than a phone's viewport height), the exit fade started advancing before
 * the enter fade had finished; the min()/max() combinator then fought
 * between them and the section could never reach full clarity — just a
 * partial, muddy peak before blurring back out.
 *
 * Deliberately opacity/blur only, no scale: SkillsGrid draws its circuit
 * wires by measuring each card's exact getBoundingClientRect() once on
 * mount and never re-measuring. A `transform: scale()` on an ancestor
 * changes that measured geometry (mount happens off-screen, at this
 * component's *initial* — smallest — scale, since every section mounts
 * immediately regardless of scroll position), so the wires would get baked
 * in at the wrong size and never catch up as the section scales back to
 * full size. Blur and opacity don't affect layout geometry, so they're safe.
 *
 * `isLast` mirrors ScrollDissolve's own isLast: progress only reaches 1 once
 * this section's *bottom* edge reaches the viewport top, which needs more
 * scroll room below it than a page actually has once nothing follows it —
 * the browser hits max scroll first, permanently stranding the last section
 * mid-blur-out instead of ever reaching the sharp hold. Skip that exit fade
 * entirely for whichever section is genuinely last on the page.
 */
export const ScrollFade = ({ children, className = "", isLast = false }) => {
  const ref = useRef(null);
  const [stopTimes, setStopTimes] = useState([0, 0.25, 0.75, 1]);

  useEffect(() => {
    if (!ref.current) return;

    const measure = () => {
      if (!ref.current) return;
      const sectionHeight = ref.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const totalSpan = sectionHeight + viewportHeight;
      // Each of the enter/exit transitions should cost about one viewport
      // height of scroll regardless of how tall the section itself is;
      // clamp to 0.5 so a section shorter than one viewport still resolves
      // to a valid (if brief) hold instead of inverted stop times.
      const edge = Math.min(0.5, viewportHeight / totalSpan);
      setStopTimes([0, edge, 1 - edge, 1]);
    };

    measure();
    window.addEventListener("resize", measure);

    // A fixed settle timeout isn't enough for content that loads
    // asynchronously (e.g. a section whose children fetch from an API and
    // render nothing until the response lands) — if that takes longer than
    // the timeout, stop times get permanently locked in against a ~0px
    // measurement, and the section renders stuck at its "not yet visible"
    // opacity/blur forever once real content finally arrives. A
    // ResizeObserver reacts to the actual height change whenever it
    // happens, however long that takes.
    const observer = new ResizeObserver(measure);
    observer.observe(ref.current);

    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, stopTimes, [0, 1, 1, isLast ? 1 : 0]);
  const blur = useTransform(scrollYProgress, stopTimes, [10, 0, 0, isLast ? 0 : 10]);
  const filter = useTransform(blur, (b) => `blur(${b.toFixed(1)}px)`);

  return (
    <motion.div ref={ref} style={{ opacity, filter, willChange: "opacity, filter" }} className={className}>
      {children}
    </motion.div>
  );
};
