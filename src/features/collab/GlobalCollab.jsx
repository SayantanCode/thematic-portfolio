import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DottedMap from "dotted-map/without-countries";
import { MapPin } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import worldMapData from "../constants/worldMapData.json";

const PINS = [
  { id: "kolkata", lat: 22.5726, lng: 88.3639, label: "Kolkata, India", sublabel: "Hih7 Webtech — my team" },
  { id: "iowa", lat: 41.5868, lng: -93.625, label: "Iowa, USA", sublabel: "Client — Golf POS project" },
];

const VIEW_W = 91;
const VIEW_H = 46;
// Matches the .golfer-swing keyframe duration in index.css — impact happens
// at 40% of that cycle, which is exactly when the ball starts moving below.
const BALL_DURATION = "2.5s";

export const GlobalCollab = () => {
  const [hovered, setHovered] = useState(null);

  const { dots, pins, arcPath, from, to } = useMemo(() => {
    const map = new DottedMap({ map: worldMapData });
    PINS.forEach((p) => map.addPin({ lat: p.lat, lng: p.lng, data: { id: p.id } }));
    const all = map.getPoints();
    const pinPoints = PINS.map((p) => {
      const found = all.find((pt) => pt.data?.id === p.id);
      return { ...p, x: found.x, y: found.y };
    });
    const [fromPin, toPin] = pinPoints;
    const midX = (fromPin.x + toPin.x) / 2;
    const midY = Math.min(fromPin.y, toPin.y) - 10;
    return {
      dots: all.filter((pt) => !pt.data),
      pins: pinPoints,
      arcPath: `M ${fromPin.x} ${fromPin.y} Q ${midX} ${midY} ${toPin.x} ${toPin.y}`,
      from: fromPin,
      to: toPin,
    };
  }, []);

  const hoveredPin = pins.find((p) => p.id === hovered);

  return (
    <section className="container mx-auto px-6 md:px-12 py-12 md:py-24 text-primary border-b border-glass-border">
      <SectionHeader
        title="Working Across Borders"
        subtitle="My team at Hih7 Webtech, based in Kolkata, is building Golf POS — a real-time, multi-tenant SaaS platform — for a client in Iowa, USA."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="glass-card rounded-2xl p-4 sm:p-8 border border-glass-border max-w-4xl mx-auto"
      >
        <div className="relative">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="block w-full h-auto"
            role="img"
            aria-label="Map showing collaboration between Kolkata, India and Iowa, USA"
          >
            {dots.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={0.35} style={{ fill: "var(--text-muted)", opacity: 0.25 }} />
            ))}

            <path d={arcPath} fill="none" stroke="var(--accent)" strokeWidth={0.3} strokeLinecap="round" style={{ opacity: 0.3 }} />
            <path
              d={arcPath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={0.3}
              strokeLinecap="round"
              strokeDasharray="1.2 1.8"
              className="wire-flow"
              style={{ opacity: 0.6 }}
            />

            {/* Origin — Kolkata: a golfer teeing off toward Iowa */}
            <g
              onMouseEnter={() => setHovered(from.id)}
              onMouseLeave={() => setHovered((h) => (h === from.id ? null : h))}
              style={{ cursor: "pointer" }}
            >
              <circle cx={from.x + 0.35} cy={from.y} r={2.6} fill="transparent" />

              {/* Impact flash — a quick burst right as the club meets the ball,
                  timed to the same 40% mark as the swing's impact keyframe */}
              <circle cx={from.x} cy={from.y} r={0.3} style={{ fill: "var(--accent)" }}>
                <animate attributeName="r" values="0.3;1.3;0.3;0.3" keyTimes="0;0.4;0.5;1" dur={BALL_DURATION} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.55;0;0" keyTimes="0;0.4;0.5;1" dur={BALL_DURATION} repeatCount="indefinite" />
              </circle>
              <circle cx={from.x} cy={from.y} r={0.32} style={{ fill: "var(--accent)", filter: "drop-shadow(0 0 2px var(--accent-glow))" }} />

              {/* Golfer silhouette — static legs/torso/head, with the arm+club
                  swinging around the shoulder pivot (see .golfer-swing) */}
              <g transform={`translate(${from.x + 0.6}, ${from.y})`}>
                {/* back leg */}
                <line x1="0.0" y1="-1.0" x2="0.35" y2="0" stroke="var(--text-muted)" strokeWidth={0.16} strokeLinecap="round" />
                {/* front leg, closest to the ball */}
                <line x1="0.0" y1="-1.0" x2="-0.3" y2="0.02" stroke="var(--text-muted)" strokeWidth={0.16} strokeLinecap="round" />
                {/* torso */}
                <line x1="0.05" y1="-1.9" x2="0.0" y2="-1.0" stroke="var(--text-muted)" strokeWidth={0.19} strokeLinecap="round" />
                {/* head */}
                <circle cx="0.08" cy="-2.22" r="0.28" fill="var(--text-muted)" />
                {/* arm + club, rotating around the shoulder to swing — pivoted via
                    a plain SVG translate to the shoulder point. The rotation
                    itself uses SMIL (animateTransform), not a CSS animation,
                    because CSS and SMIL run on separate clocks that drift
                    apart over time even with matching durations — SMIL shares
                    the exact same timeline as the ball's animateMotion below,
                    so impact and the ball's departure never fall out of sync. */}
                <g transform="translate(0.02, -1.75)">
                  <g stroke="var(--text-muted)" strokeWidth={0.14} strokeLinecap="round" fill="none">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0;70;73;0;-78;0;0"
                      keyTimes="0;0.2;0.25;0.4;0.65;0.85;1"
                      dur={BALL_DURATION}
                      repeatCount="indefinite"
                    />
                    <line x1="0" y1="0" x2="-0.37" y2="0.9" />
                    <line x1="-0.37" y1="0.9" x2="-0.62" y2="1.75" stroke="var(--accent)" strokeWidth={0.1} />
                  </g>
                </g>
              </g>
            </g>

            {/* Destination — golf hole + flag, Iowa */}
            <g
              onMouseEnter={() => setHovered(to.id)}
              onMouseLeave={() => setHovered((h) => (h === to.id ? null : h))}
              style={{ cursor: "pointer" }}
            >
              <circle cx={to.x} cy={to.y} r={2.6} fill="transparent" />
              <ellipse cx={to.x} cy={to.y} rx={0.85} ry={0.45} fill="#050505" stroke="rgba(255,255,255,0.2)" strokeWidth={0.06} />
              <line x1={to.x} y1={to.y - 0.3} x2={to.x} y2={to.y - 3.4} stroke="var(--text-muted)" strokeWidth={0.1} />
              <path
                d={`M ${to.x} ${to.y - 3.4} L ${to.x + 1.5} ${to.y - 2.85} L ${to.x} ${to.y - 2.3} Z`}
                style={{ fill: "var(--accent)", filter: "drop-shadow(0 0 2px var(--accent-glow))" }}
              />
            </g>

            {/* Golf ball flying from Kolkata and dropping into the Iowa hole, on loop */}
            <circle
              r={0.5}
              fill="#f8fafc"
              stroke="rgba(0,0,0,0.35)"
              strokeWidth={0.05}
              style={{ filter: "drop-shadow(0 0.2px 1px rgba(0,0,0,0.5))" }}
            >
              <animateMotion
                dur={BALL_DURATION}
                repeatCount="indefinite"
                path={arcPath}
                calcMode="spline"
                keyTimes="0;0.4;1"
                keyPoints="0;0;1"
                keySplines="0 0 1 1;0 0 0.2 1"
              />
              {/* Fully visible for the entire flight — only fades in the last
                  sliver as it drops into the hole, so the shot reads as one
                  continuous hit rather than stopping partway */}
              <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.94;1" dur={BALL_DURATION} repeatCount="indefinite" />
              <animate attributeName="r" values="0.5;0.5;0.15" keyTimes="0;0.94;1" dur={BALL_DURATION} repeatCount="indefinite" />
            </circle>
          </svg>

          <AnimatePresence>
            {hoveredPin && (
              <motion.div
                initial={{ opacity: 0, y: 4, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 4, x: "-50%" }}
                transition={{ duration: 0.15 }}
                className="absolute pointer-events-none whitespace-nowrap rounded-md bg-surface border border-accent/40 px-2.5 py-1 text-[11px] font-mono font-bold text-accent shadow-[0_0_12px_var(--accent-glow)]"
                style={{
                  left: `${(hoveredPin.x / VIEW_W) * 100}%`,
                  top: `${(hoveredPin.y / VIEW_H) * 100}%`,
                  transform: "translate(-50%, -140%)",
                }}
              >
                {hoveredPin.label}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {pins.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface/40 border border-glass-border">
              <span className="text-accent shrink-0">
                <MapPin size={16} />
              </span>
              <div>
                <p className="text-primary text-sm font-bold">{p.label}</p>
                <p className="text-muted text-xs font-mono">{p.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
