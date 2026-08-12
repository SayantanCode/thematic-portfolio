import React, { useMemo, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAccentColor } from "@/shared/hooks/useAccentColor";
// GLB-based swarm — parked in favor of a fully procedural glow+trail
// jellyfish (JellyfishGlow.jsx) per direct request; re-enable by swapping
// the import and the usage below back.
// import JellyfishSwarm from "./JellyfishSwarm.jsx";
import JellyfishGlow from "./JellyfishGlow.jsx";

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

// One shooting star at a time, rarely. Comets (a distinct icy head + a
// separately-styled tail) would need a whole new visual language; a
// shooting star is just this same field's existing circular sprite moving
// fast with a fading trail behind it, so it reads as part of the same
// system instead of a bolted-on effect.
const TRAIL_POINTS = 18;
// The trail spans a fixed *time* window of recent travel, not a fixed
// distance — so it's computed directly from velocity each frame (no history
// buffer needed, since the path is a straight line) and a faster star
// naturally stretches its own trail further behind it, a slower one gets a
// shorter one, for free from the physics rather than a hand-tuned length.
const TRAIL_SECONDS = 0.22;
const SPEED_MIN = 10;
const SPEED_MAX = 16;
const LIFE_MIN = 0.7;
const LIFE_MAX = 1.3;
// "Rare" — a real wait, not a slot machine. Roughly one every 16-42s.
const DELAY_MIN = 16;
const DELAY_MAX = 42;
const HEAD_SIZE = 0.09;

const randomDelay = () => THREE.MathUtils.lerp(DELAY_MIN, DELAY_MAX, Math.random());

const spawnShootingStar = (elapsedTime) => {
  const angle = Math.random() * Math.PI * 2;
  const speed = THREE.MathUtils.lerp(SPEED_MIN, SPEED_MAX, Math.random());
  // Mostly-lateral direction (small z drift) — a real shooting star sweeps
  // across the sky rather than straight toward/away from the viewer.
  const dz = (Math.random() * 2 - 1) * 0.35;
  const velocity = new THREE.Vector3(Math.cos(angle), Math.sin(angle), dz).normalize().multiplyScalar(speed);
  return {
    position: new THREE.Vector3((Math.random() * 2 - 1) * 5.5, (Math.random() * 2 - 1) * 3.5, (Math.random() * 2 - 1) * 3),
    velocity,
    spawnedAt: elapsedTime,
    life: THREE.MathUtils.lerp(LIFE_MIN, LIFE_MAX, Math.random()),
  };
};

const ShootingStar = () => {
  const pointsRef = useRef(null);
  const geometryRef = useRef(null);
  const accent = useAccentColor();
  const accentColorRef = useRef(new THREE.Color(accent));
  const starRef = useRef(null);
  const nextSpawnAtRef = useRef(randomDelay());
  const circleTexture = useMemo(() => getCircleTexture(), []);
  const positions = useMemo(() => new Float32Array(TRAIL_POINTS * 3), []);
  const colors = useMemo(() => new Float32Array(TRAIL_POINTS * 3), []);

  useEffect(() => {
    accentColorRef.current.set(accent);
  }, [accent]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const points = pointsRef.current;
    const geometry = geometryRef.current;
    if (!points || !geometry) return;

    if (!starRef.current && t >= nextSpawnAtRef.current) {
      starRef.current = spawnShootingStar(t);
    }

    const star = starRef.current;
    if (!star) {
      points.visible = false;
      return;
    }

    const age = t - star.spawnedAt;
    if (age >= star.life) {
      starRef.current = null;
      nextSpawnAtRef.current = t + randomDelay();
      points.visible = false;
      return;
    }

    points.visible = true;
    star.position.addScaledVector(star.velocity, delta);

    const { r, g, b } = accentColorRef.current;
    const stepTime = TRAIL_SECONDS / TRAIL_POINTS;
    // Soft despawn: fade the whole trail out over the last 0.25s of its
    // life instead of popping off abruptly once it reaches its lifespan.
    const lifeFade = Math.max(0, Math.min(1, (star.life - age) / 0.25));
    for (let i = 0; i < TRAIL_POINTS; i++) {
      const backTime = i * stepTime;
      positions[i * 3] = star.position.x - star.velocity.x * backTime;
      positions[i * 3 + 1] = star.position.y - star.velocity.y * backTime;
      positions[i * 3 + 2] = star.position.z - star.velocity.z * backTime;

      const fade = Math.pow(1 - i / (TRAIL_POINTS - 1), 1.6) * lifeFade;
      colors[i * 3] = r * fade;
      colors[i * 3 + 1] = g * fade;
      colors[i * 3 + 2] = b * fade;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} visible={false}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" count={TRAIL_POINTS} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={TRAIL_POINTS} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        map={circleTexture}
        vertexColors
        size={HEAD_SIZE}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
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
      <ShootingStar />
    </group>
  );
};

// The GLB swarm's PBR material needed real scene lights (it renders pure
// black otherwise) — parked alongside JellyfishSwarm above; JellyfishGlow is
// additive-blended sprites/points, which self-illuminate regardless of
// scene lighting, so this isn't needed for the current effect.
// const JellyfishLighting = () => (
//   <>
//     <ambientLight intensity={0.4} />
//     <pointLight position={[0, 0, 6]} intensity={2.5} />
//   </>
// );

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
      <Suspense fallback={null}>
        <JellyfishGlow />
      </Suspense>
    </Canvas>
  );
};

export default SceneBackground;
