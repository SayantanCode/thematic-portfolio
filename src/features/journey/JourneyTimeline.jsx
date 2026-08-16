import React, { useEffect, useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import { SectionHeader } from "@/shared/components/SectionHeader.jsx";
import { useAccentColor } from "@/shared/hooks/useAccentColor.js";
import { TIMELINE } from "@/constants/timeline.constants.js";

import Earth from "./Earth.jsx";
import { JourneyRing, pointAt, ringNodeAngle } from "./JourneyRing.jsx";
import { JourneyNode } from "./JourneyNode.jsx";
import { JourneyCard } from "./JourneyCard.jsx";

const timeValue = (iso) =>
  iso ? new Date(iso).getTime() : -Infinity;

// Chronological order — the ring fills forward through time as you
// scroll, and the Earth spins to match ("the years passing").
const TIMELINE_ASC = [...TIMELINE].sort(
  (a, b) => timeValue(a.start) - timeValue(b.start)
);

// How much of the scroll range each node's reveal ramps over.
const ACTIVATION_WIDTH = 0.15;

const useNodeActive = (scrollYProgress, index, count) => {
  const threshold = index / Math.max(count - 1, 1);
  return useTransform(
    scrollYProgress,
    [threshold - ACTIVATION_WIDTH, threshold],
    [0, 1]
  );
};

/*
 * Desktop/tablet: icon sits on the ring, card floats outward from it in
 * the same direction — anchored on the card's edge nearest the ring so
 * it grows away from the globe instead of over it.
 */
const JourneyStageNode = ({ entry, index, count, scrollYProgress }) => {
  const active = useNodeActive(scrollYProgress, index, count);

  const angle = ringNodeAngle(index, count);
  const iconPos = pointAt(angle);
  const textPos = pointAt(angle, 68, 32);
  const isLeft = textPos.x < 50;

  return (
    <>
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${iconPos.x}%`, top: `${iconPos.y}%` }}
      >
        <JourneyNode entry={entry} active={active} />
      </div>

      <div
        className="hidden sm:block absolute -translate-y-1/2"
        style={
          isLeft
            ? { right: `${100 - textPos.x}%`, top: `${textPos.y}%` }
            : { left: `${textPos.x}%`, top: `${textPos.y}%` }
        }
      >
        <JourneyCard entry={entry} active={active} />
      </div>
    </>
  );
};

// Mobile: the quadrant layout has nowhere to put a card that extends
// sideways from a point near the screen edge, so it gets a plain
// stacked row instead — same activation, different layout.
const JourneyMobileRow = ({ entry, index, count, scrollYProgress }) => {
  const active = useNodeActive(scrollYProgress, index, count);

  return (
    <div className="flex items-start gap-3">
      <JourneyNode entry={entry} active={active} />
      <JourneyCard entry={entry} active={active} widthClassName="w-full pt-1" />
    </div>
  );
};

export const JourneyTimeline = () => {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const accent = useAccentColor();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /*
   * Keep Three.js animation off React state.
   * This is important for performance.
   */
  useEffect(() => {
    return scrollYProgress.on("change", (value) => {
      progressRef.current = value;
    });
  }, [scrollYProgress]);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="
        relative
        h-[380vh]
        border-b
        border-glass-border
      "
    >
      {/* -------------------------------------------------- */}
      {/* STICKY VIEWPORT                                    */}
      {/* -------------------------------------------------- */}

      <div
        className="
          sticky
          top-0
          h-screen
          overflow-hidden
          flex
          flex-col
        "
      >
        {/* Header */}

        <div
          className="
            relative
            z-20
            container
            mx-auto
            px-6
            md:px-12
            pt-16
            lg:pt-10
          "
        >
          <SectionHeader
            compact
            title="My Journey"
            subtitle="From the classroom to backend architecture — the real timeline."
          />
        </div>

        {/* Stage — Earth, ring, and the four orbit nodes (cards attach
            here on sm+ only; see the mobile list below) */}

        <div className="relative h-46 sm:h-auto sm:flex-1 sm:min-h-0">
          <div className="absolute inset-0 flex items-center justify-center px-4 sm:pb-10">
            <div className="relative w-full max-w-3xl aspect-16/11">
              <div className="absolute inset-0 pointer-events-none">
                <Canvas
                  dpr={[1, 1.5]}
                  gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                  }}
                >
                  <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={42} />

                  <ambientLight intensity={0.65} />
                  <directionalLight position={[5, 3, 5]} intensity={1.4} />
                  <pointLight
                    position={[-5, -2, -3]}
                    intensity={0.5}
                    color={accent}
                  />

                  <Earth progressRef={progressRef} accentColor={accent} />
                </Canvas>
              </div>

              <JourneyRing scrollYProgress={scrollYProgress} />

              {TIMELINE_ASC.map((entry, index) => (
                <JourneyStageNode
                  key={entry.id}
                  entry={entry}
                  index={index}
                  count={TIMELINE_ASC.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile card list */}

        <div className="sm:hidden flex-1 min-h-0 px-6 flex flex-col justify-center gap-2 pb-2">
          {TIMELINE_ASC.map((entry, index) => (
            <JourneyMobileRow
              key={entry.id}
              entry={entry}
              index={index}
              count={TIMELINE_ASC.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Scroll hint */}

        <div
          className="
            relative
            z-20
            pb-3
            sm:pb-8
            text-center
            text-muted
            text-[10px]
            font-mono
            uppercase
            tracking-[0.35em]
            opacity-60
          "
        >
          Scroll through my journey
        </div>
      </div>
    </section>
  );
};
