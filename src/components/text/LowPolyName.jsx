import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Delaunator from "delaunator";

// Canvas sampling resolution — generous enough for clean triangulation,
// independent of the actual rendered font-size (the SVG scales down via CSS).
const CANVAS_W = 160;
const CANVAS_H = 160;
const BASELINE_Y = 122; // leaves room above for ascenders/caps, below for descenders
const SAMPLE_FONT_SIZE = 130;
const ALPHA_THRESHOLD = 128;

let sharedCanvas = null;
const getCanvas = () => {
  if (!sharedCanvas) {
    sharedCanvas = document.createElement("canvas");
    sharedCanvas.width = CANVAS_W;
    sharedCanvas.height = CANVAS_H;
  }
  return sharedCanvas;
};

// Target point counts per glyph — this is what actually controls how
// "low poly" the result reads as. Delaunay triangulation produces roughly
// 2x as many triangles as input points, so ~16 points gives a genuinely
// chunky, individually-visible-facet mesh (matching the reference image)
// instead of a mesh so fine it just reads as solid fill again from normal
// viewing distance — and keeps the animated element count sane.
const TARGET_EDGE_POINTS = 26;
const TARGET_INTERIOR_POINTS = 9;

/** Picks at most one point per grid cell instead of thinning by raw pixel
 * count. Multi-stroke letters like "k", "y", "x" have thin diagonal limbs
 * that contribute far fewer raw edge pixels than a tall vertical stem —
 * thinning by count alone starves those limbs of points entirely, and
 * Delaunay bridges the gap into a blobby wedge instead of following the
 * stroke. Spreading picks across a spatial grid guarantees every region of
 * the glyph gets representation regardless of how few pixels it has. */
const thinSpatially = (list, target, minX, minY, w, h) => {
  if (list.length <= target) return list;
  const cols = Math.max(1, Math.round(Math.sqrt((target * w) / h)));
  const rows = Math.max(1, Math.ceil(target / cols));
  const cellW = w / cols;
  const cellH = h / rows;
  const buckets = new Map();
  for (const p of list) {
    const cx = Math.min(cols - 1, Math.floor((p[0] - minX) / cellW));
    const cy = Math.min(rows - 1, Math.floor((p[1] - minY) / cellH));
    const key = cy * cols + cx;
    if (!buckets.has(key)) buckets.set(key, p);
  }
  return Array.from(buckets.values());
};

/** Samples boundary + sparse interior points from a rendered glyph, so the
 * resulting mesh hugs the letterform instead of a generic bounding box. */
const sampleGlyphPoints = (imageData) => {
  const alphaAt = (x, y) => {
    if (x < 0 || x >= CANVAS_W || y < 0 || y >= CANVAS_H) return 0;
    return imageData.data[(y * CANVAS_W + x) * 4 + 3];
  };

  const edgeCandidates = [];
  const interiorCandidates = [];
  let minX = CANVAS_W;
  let minY = CANVAS_H;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < CANVAS_H; y++) {
    for (let x = 0; x < CANVAS_W; x++) {
      if (alphaAt(x, y) <= ALPHA_THRESHOLD) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      const isEdge =
        alphaAt(x - 1, y) <= ALPHA_THRESHOLD ||
        alphaAt(x + 1, y) <= ALPHA_THRESHOLD ||
        alphaAt(x, y - 1) <= ALPHA_THRESHOLD ||
        alphaAt(x, y + 1) <= ALPHA_THRESHOLD;
      (isEdge ? edgeCandidates : interiorCandidates).push([x, y]);
    }
  }

  const boxW = Math.max(1, maxX - minX);
  const boxH = Math.max(1, maxY - minY);
  const thinTo = (list, target) => thinSpatially(list, target, minX, minY, boxW, boxH);

  return [...thinTo(edgeCandidates, TARGET_EDGE_POINTS), ...thinTo(interiorCandidates, TARGET_INTERIOR_POINTS)];
};

/** Renders one character to the shared canvas, triangulates its ink, and
 * discards any triangle whose centroid lands outside the glyph (the holes
 * in "a"/"o"/"e", the gap in "i") so the mesh doesn't bridge across them. */
const buildGlyphMesh = (char, fontFamily, fontWeight) => {
  const canvas = getCanvas();
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `${fontWeight} ${SAMPLE_FONT_SIZE}px ${fontFamily}`;
  ctx.fillText(char, 10, BASELINE_Y);

  const imageData = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
  const alphaAt = (x, y) => {
    if (x < 0 || x >= CANVAS_W || y < 0 || y >= CANVAS_H) return 0;
    return imageData.data[(y * CANVAS_W + x) * 4 + 3];
  };

  const points = sampleGlyphPoints(imageData);
  if (points.length < 3) return null;

  const flat = points.flat();
  const delaunay = new Delaunator(flat);
  const triangles = [];

  for (let i = 0; i < delaunay.triangles.length; i += 3) {
    const a = points[delaunay.triangles[i]];
    const b = points[delaunay.triangles[i + 1]];
    const c = points[delaunay.triangles[i + 2]];
    const cx = (a[0] + b[0] + c[0]) / 3;
    const cy = (a[1] + b[1] + c[1]) / 3;
    if (alphaAt(Math.round(cx), Math.round(cy)) <= ALPHA_THRESHOLD) continue;
    triangles.push({ a, b, c });
  }

  // Trim horizontally to the glyph's own ink so characters sit close
  // together; keep the full vertical range so every character shares the
  // same baseline when laid out in a row.
  let minX = CANVAS_W;
  let maxX = 0;
  for (let x = 0; x < CANVAS_W; x++) {
    for (let y = 0; y < CANVAS_H; y++) {
      if (alphaAt(x, y) > ALPHA_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }
  if (maxX < minX) return null;

  return { triangles, minX, maxX };
};

const CharMesh = ({ char, color, fontFamily, fontWeight, fontSize, delay, seed }) => {
  const mesh = useMemo(() => buildGlyphMesh(char, fontFamily, fontWeight), [char, fontFamily, fontWeight]);

  if (char === " " || !mesh) {
    return <span style={{ display: "inline-block", width: fontSize * 0.28 }} />;
  }

  const { triangles, minX, maxX } = mesh;
  const width = maxX - minX + 4;
  const svgWidth = (width / CANVAS_H) * fontSize;

  // Stable per-triangle "scattered" starting transform, seeded off the
  // character so it doesn't re-randomize on every re-render.
  const rand = (i, salt) => {
    const n = Math.sin(seed * 12.9898 + i * 78.233 + salt * 37.719) * 43758.5453;
    return n - Math.floor(n);
  };

  return (
    <svg
      viewBox={`${minX - 2} 0 ${width} ${CANVAS_H}`}
      width={svgWidth}
      height={fontSize}
      style={{ display: "inline-block", overflow: "visible", filter: `drop-shadow(0 0 5px ${color}55)` }}
    >
      <g>
        {triangles.map((t, i) => {
          const points = `${t.a[0]},${t.a[1]} ${t.b[0]},${t.b[1]} ${t.c[0]},${t.c[1]}`;
          const fillOpacity = 0.1 + rand(i, 1) * 0.16;
          const scatterX = (rand(i, 2) - 0.5) * 90;
          const scatterY = (rand(i, 3) - 0.5) * 90;
          const scatterRotate = (rand(i, 4) - 0.5) * 160;
          const triDelay = delay + rand(i, 5) * 0.35;

          return (
            <motion.polygon
              key={i}
              points={points}
              fill={color}
              fillOpacity={fillOpacity}
              stroke={color}
              strokeOpacity={0.85}
              strokeWidth={1.1}
              strokeLinejoin="round"
              initial={{ x: scatterX, y: scatterY, rotate: scatterRotate, scale: 0.3, opacity: 0 }}
              whileInView={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: triDelay, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}
      </g>
    </svg>
  );
};

/**
 * Renders `text` as a low-poly wireframe mesh, per character — each
 * triangular facet starts scattered (offset, rotated, faded) and flies into
 * place on scroll-into-view, "assembling" the name out of glowing,
 * semi-transparent fragments. Glyph shapes are sampled from a real canvas
 * render of the font (same technique as ParticleTypography) and triangulated
 * with Delaunay, so the mesh follows the actual letterforms rather than a
 * generic block.
 */
export const LowPolyName = ({
  text,
  color = "#d4af37",
  fontFamily = "Montserrat, sans-serif",
  fontWeight = 900,
  fontSize = 64,
  delay = 0,
  stagger = 0.05,
  className = "",
}) => {
  const chars = text.split("");
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "flex-end" }}>
      {chars.map((char, i) => (
        <CharMesh
          key={i}
          char={char}
          color={color}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          fontSize={fontSize}
          delay={delay + i * stagger}
          seed={i + 1}
        />
      ))}
    </span>
  );
};
