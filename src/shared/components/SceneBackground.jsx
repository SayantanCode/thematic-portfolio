import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAccentColor } from "@/shared/hooks/useAccentColor";

// Most of the field: circular dust motes, filling the space the way the
// original uniform field did. A gradient-textured sprite always reads as
// smaller/fainter than a flat-color square of the same nominal size (the
// soft edge eats into the visible area), so size/opacity here are bumped
// *above* the pre-sprite values (was 2800 @ 0.028 fully opaque) to land at
// the same actual on-screen density, not just the same particle count.
const DUST_COUNT = 2500;
const DUST_SIZE = 0.034;
// A sparse minority: bigger, sparkly 4-point "star" glints for visual
// variety — deliberately few, so they read as occasional highlights, not
// as the dominant look.
const STAR_COUNT = 500;
const STAR_SIZE = 0.065;
const FIELD_RADIUS = 9;

const randomSpherePositions = (count) => {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = FIELD_RADIUS * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = radius * Math.cos(phi);
  }
  return arr;
};

// A soft radial-gradient dot — this is what actually fixes the "boxy"
// look: THREE.PointsMaterial with no `map` renders every particle as a
// hard-edged square sprite (the default GL_POINTS quad). Built once and
// shared, same pattern as the shared-canvas trick in LowPolyName.jsx.
let sharedCircleTexture = null;
const getCircleTexture = () => {
  if (sharedCircleTexture) return sharedCircleTexture;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  // Mostly-solid disc that only falls off right at the rim — a soft-centered
  // gradient (fading from the very middle) looked nicer up close but reads
  // as a faint haze at field scale, which is what thinned the whole look out.
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.65, "rgba(255,255,255,0.95)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  sharedCircleTexture = new THREE.CanvasTexture(canvas);
  return sharedCircleTexture;
};

// A glow core with 4 tapering rays — a simple twinkling-star sprite.
let sharedStarTexture = null;
const getStarTexture = () => {
  if (sharedStarTexture) return sharedStarTexture;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const cx = size / 2;
  const cy = size / 2;

  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.22);
  core.addColorStop(0, "rgba(255,255,255,1)");
  core.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, size, size);

  ctx.globalCompositeOperation = "lighter";
  [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach((angle) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    const ray = ctx.createLinearGradient(0, 0, size / 2, 0);
    ray.addColorStop(0, "rgba(255,255,255,0.9)");
    ray.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = ray;
    ctx.fillRect(0, -1, size / 2, 2);
    ctx.restore();
  });

  sharedStarTexture = new THREE.CanvasTexture(canvas);
  return sharedStarTexture;
};

/**
 * A simple, theme-reactive dust field with a slow constant rotation —
 * deliberately not tied to scroll position or velocity in any way. Scroll-
 * linked camera movement/recycling was tried and repeatedly caused either
 * visual clutter or particles vanishing over time; this fixed-camera,
 * always-the-same-motion version is the stable baseline to build up from
 * again, carefully, if that's wanted later.
 */
const ParticleField = () => {
  const groupRef = useRef(null);
  const dustMaterialRef = useRef(null);
  const starMaterialRef = useRef(null);
  const accent = useAccentColor();

  const dustPositions = useMemo(() => randomSpherePositions(DUST_COUNT), []);
  const starPositions = useMemo(() => randomSpherePositions(STAR_COUNT), []);
  const circleTexture = useMemo(() => getCircleTexture(), []);
  const starTexture = useMemo(() => getStarTexture(), []);

  useEffect(() => {
    dustMaterialRef.current?.color.set(accent);
    starMaterialRef.current?.color.set(accent);
  }, [accent]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.02;
    groupRef.current.rotation.x += delta * 0.006;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={DUST_COUNT}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={dustMaterialRef}
          map={circleTexture}
          color={accent}
          size={DUST_SIZE}
          sizeAttenuation
          transparent
          opacity={0.65}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={STAR_COUNT}
            array={starPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={starMaterialRef}
          map={starTexture}
          color={accent}
          size={STAR_SIZE}
          sizeAttenuation
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

const SceneBackground = () => {
  return (
    <Canvas
      className="!fixed !inset-0"
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ParticleField />
    </Canvas>
  );
};

export default SceneBackground;
