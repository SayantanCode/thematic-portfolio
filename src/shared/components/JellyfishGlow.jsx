import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCssVarColor } from "@/shared/hooks/useCssVarColor";

// Fully procedural — no GLB, no sprite/trail layering. The whole creature
// (glowing bell + undulating tentacles + fade lifecycle) is drawn per-pixel
// by a single GLSL fragment shader on one billboard quad, additively
// blended for the volumetric, light-based nebula look. Deliberately sparse
// and soft — this is ambient background texture, not a focal point that
// competes with the actual portfolio content.
const JELLY_COUNT = 5;
const SPAWN_DELAY_MIN = 0.8;
const SPAWN_DELAY_MAX = 3.5;
const LIFESPAN_MIN = 13;
const LIFESPAN_MAX = 21;
const SPAWN_X = 6.5;
const SPAWN_Y = 4;
const SPAWN_Z = 2.5;
// Smaller overall — biased toward small/medium via a power curve, so a big
// one is a rare treat, not the norm.
const SCALE_MIN = 0.28;
const SCALE_MAX = 1.6;
const SCALE_BIAS_POWER = 2;
// Once one active jellyfish rolls above this, every other one that spawns
// while it's still alive is forced into the small end instead of rolling
// freely — "one big, the rest tiny" instead of several big ones at once.
const BIG_THRESHOLD = 1.05;
const FORCED_SMALL_MAX = 0.55;

// Wandering direction: each jellyfish picks a new random heading every few
// seconds and eases toward it, rather than only ever drifting upward — some
// go up, some sideways, some suddenly reverse and exit a completely
// different edge than where they started.
const TURN_INTERVAL_MIN = 2.5;
const TURN_INTERVAL_MAX = 6;
const TURN_RATE = 1.1; // higher = snappier turns, lower = lazier drift
const SPEED_MIN = 0.13;
const SPEED_MAX = 0.34;

// Pairwise repulsion so jellyfish usually keep some distance instead of
// overlapping — but each one has a chance to ignore it entirely for its
// whole life, so a close pass isn't forbidden, just uncommon.
const REPULSION_RADIUS = 3.2;
const REPULSION_STRENGTH = 1.1;
const REPULSION_SKIP_CHANCE = 0.25;

// How strongly the bell tilts to face its direction of travel — 0 would
// stay perfectly upright while sliding sideways (unconvincing as a living
// thing), 1 would fully point sideways when moving sideways (too literal).
// A partial lean reads as steering into the direction it's heading, like an
// actual swimming creature rather than a sprite being dragged around.
const HEADING_LEAN = 0.4;

const jellyfishVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const jellyfishFragmentShader = `
  uniform float uTime;
  uniform float uProgress; // 0..1 across the whole lifespan
  uniform float uSeed;
  uniform float uLightTheme; // 0 = dark bg (additive glow), 1 = light bg (flat alpha color)
  uniform vec3 uColorHead;
  uniform vec3 uColorTail;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    // Remap UV so the bell sits near the top of the quad and the
    // tentacles hang down through the rest of it.
    vec2 uv = (vUv - vec2(0.5, 0.7)) * 2.0;

    // Breathing pulse (fast, small) layered with a slower soft-body sway
    // (bigger, gentler) — the combination is what reads as "squishy jelly"
    // instead of a mechanical uniform pulse.
    float pulse = sin(uTime * 3.0 + uSeed) * 0.08 + 1.0;
    float sway = sin(uTime * 0.6 + uSeed * 1.3) * 0.07;
    uv.x = uv.x * pulse + sway;
    uv.y *= 1.0 + sway * 0.4;

    // Bell (head): a soft disc, clipped to an umbrella dome shape.
    // (GLSL's smoothstep is spec'd undefined when edge0 > edge1 — written
    // as 1.0 - smoothstep(loEdge, hiEdge, x) instead, the same
    // reversed-ramp shape with edges in defined ascending order.)
    float dist = length(uv);
    float headMask = 1.0 - smoothstep(0.1, 0.6, dist);
    headMask *= smoothstep(-0.2, 0.1, uv.y);

    // An off-center hot spot inside the bell — breaks up the flat disc into
    // something with a bit of internal depth, closer to how a real glowing,
    // translucent bell catches light unevenly rather than glowing flat.
    vec2 highlightPos = vec2(-0.16, 0.18);
    float highlightDist = length(uv - highlightPos);
    float highlight = (1.0 - smoothstep(0.0, 0.32, highlightDist)) * headMask;

    // Tentacles: sine + noise waves stretching down from the bell.
    float tentacleMask = 0.0;
    if (uv.y < 0.0) {
      float wave1 = sin(uv.y * 8.0 - uTime * 4.0 + noise(vec2(uv.y * 2.0, uTime))) * 0.1;
      float wave2 = cos(uv.y * 12.0 - uTime * 3.0) * 0.05;
      float tentacleDist = abs(uv.x + wave1 + wave2);
      float fadeAlongLength = smoothstep(-2.0, 0.0, uv.y);
      tentacleMask = (1.0 - smoothstep(0.0, 0.18, tentacleDist)) * fadeAlongLength;
    }

    // Lifecycle fade — a single smooth bell curve over uProgress handles
    // both fade-in and fade-out from one value.
    float lifeOpacity = sin(uProgress * 3.14159);

    vec3 finalColor = mix(uColorTail, uColorHead, smoothstep(-0.5, 0.3, uv.y));
    // Softer overall — this is ambient background glow, not a spotlight.
    float intensity = (headMask * 1.15 + tentacleMask * 0.9 + highlight * 0.55) * lifeOpacity;

    // Additive blending (dark backgrounds) needs the RGB itself to fade
    // toward black at low intensity, since black adds nothing — that's the
    // "glow". Normal alpha blending (light backgrounds) needs the opposite:
    // full-strength color with intensity carried entirely in alpha, or the
    // edges read as a muddy grey smudge instead of fading to transparent.
    vec3 outColor = finalColor * mix(intensity, 1.0, uLightTheme);
    gl_FragColor = vec4(outColor, intensity * 0.68);
  }
`;

// Each palette's head/tail hues are chosen far enough apart on the wheel to
// read as clearly two-toned (the original red-to-orange pair sat right next
// to each other in hue and read as "just red"). Dark-bg glow wants vivid,
// near-saturated colors; a light bg needs deeper/more saturated ones or
// they wash out against white/near-white instead of standing on it.
const DARK_PALETTES = [
  { head: new THREE.Color(0x0088ff), tail: new THREE.Color(0x00ff88) },
  { head: new THREE.Color(0x9900ff), tail: new THREE.Color(0x00ffff) },
  { head: new THREE.Color(0xff0055), tail: new THREE.Color(0x00ffaa) },
];
const LIGHT_PALETTES = [
  { head: new THREE.Color(0x0055cc), tail: new THREE.Color(0x009944) },
  { head: new THREE.Color(0x7700cc), tail: new THREE.Color(0x008080) },
  { head: new THREE.Color(0xcc0044), tail: new THREE.Color(0x00806a) },
];

const randomRange = (min, max) => THREE.MathUtils.lerp(min, max, Math.random());
const randomAngle = () => Math.random() * Math.PI * 2;

const spawnJelly = (registry, self, isLight) => {
  const anyBigActive = registry.some((r) => r !== self && r.active && r.scale > BIG_THRESHOLD);
  const scale = anyBigActive
    ? randomRange(SCALE_MIN, FORCED_SMALL_MAX)
    : THREE.MathUtils.lerp(SCALE_MIN, SCALE_MAX, Math.pow(Math.random(), SCALE_BIAS_POWER));

  const palettes = isLight ? LIGHT_PALETTES : DARK_PALETTES;
  const angle = randomAngle();
  return {
    position: new THREE.Vector3(
      (Math.random() * 2 - 1) * SPAWN_X,
      (Math.random() * 2 - 1) * SPAWN_Y,
      (Math.random() * 2 - 1) * SPAWN_Z
    ),
    palette: palettes[Math.floor(Math.random() * palettes.length)],
    lifespan: randomRange(LIFESPAN_MIN, LIFESPAN_MAX),
    age: 0,
    scale,
    timeOffset: Math.random() * 100,
    seed: Math.random() * 10,
    // Movement: a heading that eases toward a fresh random target angle
    // every few seconds, so the path wanders and occasionally makes a hard
    // turn instead of always drifting the same way.
    angle,
    targetAngle: angle,
    nextTurnAt: randomRange(TURN_INTERVAL_MIN, TURN_INTERVAL_MAX),
    speed: randomRange(SPEED_MIN, SPEED_MAX),
    repulsionDisabled: Math.random() < REPULSION_SKIP_CHANCE,
  };
};

const SingleJelly = ({ slot, registry, isLight }) => {
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const jelly = useRef(null);
  const nextSpawnAt = useRef(randomRange(0, SPAWN_DELAY_MAX));
  const drift = useRef(new THREE.Vector3());

  // Initial values only — R3F clones the object passed as the `uniforms`
  // prop rather than binding it by reference, so all per-frame updates
  // below go through materialRef.current.uniforms (the material's real,
  // live uniforms object) instead of mutating this one, which would
  // silently never reach the shader.
  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSeed: { value: 0 },
      uLightTheme: { value: isLight ? 1 : 0 },
      uColorHead: { value: new THREE.Color() },
      uColorTail: { value: new THREE.Color() },
    }),
    // Only the initial value matters here — see the per-frame update below
    // for why this object isn't the one actually read by the shader.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const uniforms = materialRef.current?.uniforms;
    if (!uniforms) return;
    uniforms.uLightTheme.value = isLight ? 1 : 0;

    if (!jelly.current) {
      slot.active = false;
      if (t >= nextSpawnAt.current) {
        const j = spawnJelly(registry, slot, isLight);
        jelly.current = j;
        // Set immediately (not deferred to next frame) so any sibling
        // spawning in this same frame sees accurate big/small state.
        slot.active = true;
        slot.scale = j.scale;
        slot.repulsionDisabled = j.repulsionDisabled;
        uniforms.uColorHead.value.copy(j.palette.head);
        uniforms.uColorTail.value.copy(j.palette.tail);
        uniforms.uSeed.value = j.seed;
        drift.current.set(0, 0, 0);
        if (meshRef.current) {
          meshRef.current.position.copy(j.position);
          meshRef.current.scale.setScalar(j.scale);
        }
        slot.position.copy(j.position);
        slot.radius = 1.2 * j.scale;
      }
      if (meshRef.current) meshRef.current.visible = false;
      return;
    }

    const j = jelly.current;
    j.age += delta;
    const progress = j.age / j.lifespan;

    if (progress >= 1) {
      jelly.current = null;
      slot.active = false;
      nextSpawnAt.current = t + randomRange(SPAWN_DELAY_MIN, SPAWN_DELAY_MAX);
      if (meshRef.current) meshRef.current.visible = false;
      return;
    }

    uniforms.uTime.value = j.timeOffset + j.age;
    uniforms.uProgress.value = progress;

    if (meshRef.current) {
      meshRef.current.visible = true;

      // Wandering heading: pick a fresh random target every so often and
      // ease the current angle toward it — most of the time a gentle
      // curve, but a target far from the current heading reads as a
      // sudden turn, and since the target is a full random angle each
      // time, the exit direction is never the same pattern twice.
      if (j.age >= j.nextTurnAt) {
        j.targetAngle = randomAngle();
        j.nextTurnAt = j.age + randomRange(TURN_INTERVAL_MIN, TURN_INTERVAL_MAX);
      }
      let angleDiff = j.targetAngle - j.angle;
      angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
      j.angle += angleDiff * Math.min(1, delta * TURN_RATE);
      j.position.x += Math.cos(j.angle) * j.speed * delta;
      j.position.y += Math.sin(j.angle) * j.speed * delta;

      // Repulsion: gently pushed away from any other active jellyfish
      // that's drifted too close, instead of overlapping — but skipped
      // entirely for jellyfish that rolled "sociable" at spawn, so a close
      // pass happens sometimes rather than never.
      const push = new THREE.Vector3();
      if (!j.repulsionDisabled) {
        for (let i = 0; i < registry.length; i++) {
          const other = registry[i];
          if (other === slot || !other.active || other.repulsionDisabled) continue;
          const dx = j.position.x + drift.current.x - other.position.x;
          const dy = j.position.y + drift.current.y - other.position.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0.0001 && distSq < REPULSION_RADIUS * REPULSION_RADIUS) {
            const dist = Math.sqrt(distSq);
            const force = ((REPULSION_RADIUS - dist) / REPULSION_RADIUS) * REPULSION_STRENGTH;
            push.x += (dx / dist) * force;
            push.y += (dy / dist) * force;
          }
        }
      }
      drift.current.addScaledVector(push, delta).multiplyScalar(0.9);

      meshRef.current.position.x = j.position.x + drift.current.x;
      meshRef.current.position.y = j.position.y + drift.current.y;
      meshRef.current.position.z = j.position.z;

      // Lean the bell to face its current heading (derived from j.angle,
      // which is already eased toward its target, so this tilts smoothly
      // in step with the turn instead of snapping) — a life form steering
      // itself rather than a decal sliding around the screen.
      meshRef.current.rotation.z = (j.angle - Math.PI / 2) * HEADING_LEAN;

      slot.active = true;
      slot.position.copy(meshRef.current.position);
      slot.radius = 1.2 * j.scale;
    }
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <planeGeometry args={[2.6, 3.4]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={jellyfishVertexShader}
        fragmentShader={jellyfishFragmentShader}
        uniforms={initialUniforms}
        transparent
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Relative luminance of a "#rrggbb" string — good enough for a light/dark
// split, not aiming for perceptual accuracy.
const hexLuminance = (hex) => {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return 0;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const JellyfishGlow = () => {
  // Two of this project's themes (Monochrome, Nordic Frost) use a white or
  // near-white page background — additive blending onto white adds nothing
  // visible, so the whole compositing approach has to switch per-theme, not
  // just the color palette.
  const bg = useCssVarColor("--bg", "#020c1b");
  const isLight = hexLuminance(bg) > 0.5;

  const registry = useMemo(
    () =>
      Array.from({ length: JELLY_COUNT }, () => ({
        active: false,
        position: new THREE.Vector3(),
        radius: 1,
        scale: 1,
        repulsionDisabled: false,
      })),
    []
  );

  return (
    <>
      {registry.map((slot, i) => (
        <SingleJelly key={i} slot={slot} registry={registry} isLight={isLight} />
      ))}
    </>
  );
};

export default JellyfishGlow;
