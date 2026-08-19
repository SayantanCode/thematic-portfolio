import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MODEL_PATH = "/jellyfish.glb";

const SWARM_SIZE = 6;
// The raw model is ~5 units tall (its own bounding box, unscaled) — these
// factors bring it down to a small drifting background creature.
const SCALE_MIN = 0.12;
const SCALE_MAX = 0.28;
const DEPTH_MIN = -4;
const DEPTH_MAX = 1;
const SPEED_MIN = 0.55;
const SPEED_MAX = 1.2;
const DELAY_MIN = 0.5;
const DELAY_MAX = 6;
const SPAWN_MARGIN = 2.5;
const TENTACLE_WAVE_AMPLITUDE = 0.16;
// The GLB's own bell "pulse" morph target is real, but its authored 0-1
// range barely deforms the shape — at swarm scale that reads as flat/static
// rather than a jellyfish actually swimming. Amplifying it well past 1
// (three.js has no issue extrapolating a morph target's blend beyond its
// authored range) turns the same underlying sculpt into a real contraction.
const BELL_PULSE_AMPLIFY = 2.6;
const BELL_PULSE_MAX = 1.4;
// A real jellyfish's tentacles trail and whip *because* the bell just
// contracted and pushed water past them — tying tentacle sway amplitude to
// the bell's current pulse (instead of a constant) is what sells the
// "swimming" read instead of "independently wiggling strands."
const TENTACLE_PULSE_REACTIVITY = 1.8;
// The GLB's own emissiveIntensity (~1.9 bell, ~7.6 tentacles) was tuned for
// a different renderer/exposure setup — under this project's ACES tone
// mapping, retinting that with fully-saturated hues just blows every
// channel out to white. These replacement values keep the "tentacles glow
// hotter than the bell" character the source model intended, at a strength
// that survives tone mapping with the hue still visible.
const BELL_EMISSIVE_INTENSITY = 1.1;
const TENTACLE_EMISSIVE_INTENSITY = 2.2;

const randomRange = (min, max) => THREE.MathUtils.lerp(min, max, Math.random());

// The same vivid, full-saturation "random hue" palette SplashCursor's
// RAINBOW_MODE paints into the mouse trail (HSVtoRGB(Math.random(), 1, 1)) —
// reused here so the jellyfish glow reads as part of the same visual family.
const randomVividHue = () => Math.random();

/**
 * Clones a mesh's material once per swarm instance so each jellyfish can
 * carry its own glow color and animation phase. Tentacle meshes additionally
 * get a wave displacement injected into the compiled vertex shader — three.js
 * has no built-in bone/skeleton here, so swaying the dangling strands means
 * patching `<begin_vertex>` directly (the same technique as the reference
 * snippet), driven by a per-instance uTime/uPhase uniform pair so every
 * jellyfish in the swarm sways out of sync with the others.
 */
const cloneInstanceMaterial = (sourceMaterial, { isTentacle, tipY, attachY }) => {
  const material = sourceMaterial.clone();
  material.emissiveIntensity = isTentacle ? TENTACLE_EMISSIVE_INTENSITY : BELL_EMISSIVE_INTENSITY;
  // The source model's transmission (0.95, near-pure glass) mostly shows a
  // refraction of the scene lights' white specular highlight rather than
  // its own color — great for a realistic glass bell, bad for a clearly
  // colorful swarm. Dialing it down keeps some of that soft translucency
  // while letting the per-instance emissive hue actually read as that hue.
  material.transmission = isTentacle ? 0.25 : 0.35;
  material.roughness = 0.4;

  if (isTentacle) {
    const span = Math.max(attachY - tipY, 0.0001);
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uPhase = { value: Math.random() * Math.PI * 2 };
      shader.uniforms.uAttachY = { value: attachY };
      shader.uniforms.uSpan = { value: span };
      shader.uniforms.uAmplitude = { value: TENTACLE_WAVE_AMPLITUDE };
      material.userData.shader = shader;

      shader.vertexShader = `
        uniform float uTime;
        uniform float uPhase;
        uniform float uAttachY;
        uniform float uSpan;
        uniform float uAmplitude;
      ${shader.vertexShader}`;

      shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        `
        #include <begin_vertex>
        float hang = clamp((uAttachY - transformed.y) / uSpan, 0.0, 1.0);
        float sway = hang * hang * uAmplitude;
        transformed.x += sin(uTime * 3.0 + uPhase + transformed.y * 5.0) * sway;
        transformed.z += cos(uTime * 2.4 + uPhase + transformed.y * 4.0) * sway;
        `
      );
    };
  }

  return material;
};

const JellyfishInstance = ({ scene, animations }) => {
  const outer = useRef(null);
  const pivot = useRef(null);
  const flight = useRef({ phase: "waiting", readyAt: Math.random() * DELAY_MAX });

  // Materials live inside this same memoized value (rather than a separate
  // ref assigned as a side effect) so they can never desync from the scene
  // graph actually being rendered — React's dev-mode StrictMode invokes
  // useMemo factories twice, and a side-effect ref write there can end up
  // pointing at a clone that isn't the one `<primitive>` below renders.
  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());

    const materials = [];
    const tentacleMaterials = [];
    let bellMesh = null;
    clone.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const isTentacle = child.name.toLowerCase().includes("tentacle");
      if (child.name === "Jellyfish_Bell") bellMesh = child;
      let tipY = 0;
      let attachY = 0;
      if (isTentacle) {
        child.geometry.computeBoundingBox();
        attachY = child.geometry.boundingBox.max.y;
        tipY = child.geometry.boundingBox.min.y;
      }
      const material = cloneInstanceMaterial(child.material, { isTentacle, tipY, attachY });
      child.material = material;
      materials.push(material);
      if (isTentacle) tentacleMaterials.push(material);
    });

    return { object: clone, center, materials, tentacleMaterials, bellMesh };
  }, [scene]);

  const { actions } = useAnimations(animations, pivot);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      action.reset();
      action.time = Math.random() * action.getClip().duration;
      action.timeScale = randomRange(0.85, 1.15);
      action.play();
    });
  }, [actions]);

  const startFlight = (state) => {
    const camera = state.camera;
    const aspect = state.size.width / state.size.height;
    const z = randomRange(DEPTH_MIN, DEPTH_MAX);
    const distance = camera.position.z - z;
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance;
    const halfWidth = halfHeight * aspect;
    const w = halfWidth + SPAWN_MARGIN;
    const h = halfHeight + SPAWN_MARGIN;

    // A straight chord across the bounding circle of the visible rect: start
    // and end are both guaranteed offscreen, and the random perpendicular
    // offset means paths cut through different parts of the screen — some
    // through the center, some grazing an edge — instead of always crossing
    // dead-center.
    const radius = Math.sqrt(w * w + h * h);
    const theta = Math.random() * Math.PI * 2;
    const dir = new THREE.Vector2(Math.cos(theta), Math.sin(theta));
    const perp = new THREE.Vector2(-dir.y, dir.x);
    const closestApproach = (Math.random() - 0.5) * 2 * Math.max(w, h) * 0.7;

    const start2D = dir.clone().multiplyScalar(-radius).add(perp.clone().multiplyScalar(closestApproach));
    const end2D = dir.clone().multiplyScalar(radius).add(perp.clone().multiplyScalar(closestApproach));

    const speed = randomRange(SPEED_MIN, SPEED_MAX);
    const duration = (radius * 2) / speed;

    flight.current = {
      phase: "flying",
      start: new THREE.Vector3(start2D.x, start2D.y, z),
      end: new THREE.Vector3(end2D.x, end2D.y, z),
      startTime: state.clock.elapsedTime,
      duration,
      bobPhase: Math.random() * Math.PI * 2,
      rotSpeed: randomRange(-0.15, 0.15),
      scale: randomRange(SCALE_MIN, SCALE_MAX),
      hue: randomVividHue(),
    };

    cloned.materials.forEach((material) => {
      const glow = new THREE.Color().setHSL(flight.current.hue, 1, 0.55);
      const tint = new THREE.Color().setHSL(flight.current.hue, 0.8, 0.72);
      material.emissive?.set(glow);
      material.color?.set(tint);
    });

    if (outer.current) outer.current.scale.setScalar(flight.current.scale);
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const f = flight.current;

    // useAnimations' own useFrame (registered above, earlier in the
    // component) already advanced the mixer and wrote this frame's bell
    // morphTargetInfluences by the time this callback runs — amplifying it
    // here, in place, exaggerates the same authored contraction rather than
    // replacing it, and reading it back gives a 0..~1.4 "pulse" value the
    // tentacles can react to below.
    let pulse = 0;
    const bell = cloned.bellMesh;
    if (bell?.morphTargetInfluences?.length) {
      const influences = bell.morphTargetInfluences;
      for (let i = 0; i < influences.length; i++) {
        influences[i] = Math.min(influences[i] * BELL_PULSE_AMPLIFY, BELL_PULSE_MAX);
      }
      pulse = influences[0];
    }

    cloned.tentacleMaterials.forEach((material) => {
      const shader = material.userData.shader;
      if (!shader) return;
      shader.uniforms.uTime.value = t;
      shader.uniforms.uAmplitude.value = TENTACLE_WAVE_AMPLITUDE * (1 + pulse * TENTACLE_PULSE_REACTIVITY);
    });

    if (f.phase === "waiting") {
      if (outer.current) outer.current.visible = false;
      if (t >= f.readyAt) startFlight(state);
      return;
    }

    const elapsed = t - f.startTime;
    const progress = elapsed / f.duration;
    if (progress >= 1) {
      flight.current = { phase: "waiting", readyAt: t + randomRange(DELAY_MIN, DELAY_MAX) };
      if (outer.current) outer.current.visible = false;
      return;
    }

    if (!outer.current) return;
    outer.current.visible = true;
    outer.current.position.lerpVectors(f.start, f.end, progress);
    outer.current.position.y += Math.sin(elapsed * 1.4 + f.bobPhase) * 0.3;
    outer.current.rotation.y = elapsed * f.rotSpeed + f.bobPhase;
    outer.current.rotation.z = Math.sin(elapsed * 0.7 + f.bobPhase) * 0.06;
  });

  return (
    <group ref={outer} visible={false}>
      <group ref={pivot} position={[-cloned.center.x, -cloned.center.y, -cloned.center.z]}>
        <primitive object={cloned.object} />
      </group>
    </group>
  );
};

const JellyfishSwarm = () => {
  const { scene, animations } = useGLTF(MODEL_PATH);

  return (
    <>
      {Array.from({ length: SWARM_SIZE }).map((_, i) => (
        <JellyfishInstance key={i} scene={scene} animations={animations} />
      ))}
    </>
  );
};

useGLTF.preload(MODEL_PATH);

export default JellyfishSwarm;
