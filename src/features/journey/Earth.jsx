import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

const EARTH_RADIUS = 1.75;

export default function Earth({ progressRef, accentColor = "#5ec8ff" }) {
  const [dayMap, lightsMap, cloudsMap] = useTexture([
    "/textures/earth_daymap.jpg",
    "/textures/earth_lights.png",
    "/textures/earth_clouds.png",
  ]);

  const earthRef = useRef();
  const cloudsRef = useRef();

  useFrame((_, delta) => {
    const p = THREE.MathUtils.clamp(progressRef.current, 0, 1);

    if (earthRef.current) {
      // Slow ambient spin, plus scroll drives it forward through "years".
      earthRef.current.rotation.y += delta * 0.04;
      earthRef.current.rotation.y += delta * p * 0.4;
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.06;
      cloudsRef.current.rotation.y += delta * p * 0.4;
    }
  });

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshPhongMaterial
          map={dayMap}
          emissiveMap={lightsMap}
          emissive={new THREE.Color(0xffffff)}
          emissiveIntensity={0.7}
          specular={new THREE.Color("#333")}
          shininess={6}
        />
      </mesh>

      <mesh ref={cloudsRef} scale={1.015}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Faint atmosphere rim — tinted to the active theme's accent so the
          globe reads as part of the same palette instead of a fixed blue. */}
      <mesh scale={1.04}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export { EARTH_RADIUS };
