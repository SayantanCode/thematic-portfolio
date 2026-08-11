import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAccentColor } from "../hooks/useAccentColor";

const PARTICLE_COUNT = 2800;
const FIELD_RADIUS = 9;

/**
 * A simple, theme-reactive dust field with a slow constant rotation —
 * deliberately not tied to scroll position or velocity in any way. Scroll-
 * linked camera movement/recycling was tried and repeatedly caused either
 * visual clutter or particles vanishing over time; this fixed-camera,
 * always-the-same-motion version is the stable baseline to build up from
 * again, carefully, if that's wanted later.
 */
const ParticleField = () => {
  const pointsRef = useRef(null);
  const materialRef = useRef(null);
  const accent = useAccentColor();

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = FIELD_RADIUS * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, []);

  useEffect(() => {
    materialRef.current?.color.set(accent);
  }, [accent]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += delta * 0.006;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={accent}
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
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
