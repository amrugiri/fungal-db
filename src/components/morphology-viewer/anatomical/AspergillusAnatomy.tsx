"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { BodyMaterial } from "@/components/morphology-viewer/anatomical/ClippedMaterial";

const VESICLE: [number, number, number] = [0, 0.36, 0];
const VESICLE_R = 0.11;

function fibonacciOnSphere(count: number, radius: number): [number, number, number][] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return points;
}

const PHIALIDE_DIRS = fibonacciOnSphere(22, 1);

export function AspergillusAnatomy({
  stipeColor,
  conidiaColor,
  sectionOffset,
  showSection,
}: {
  stipeColor: string;
  conidiaColor: string;
  sectionOffset: number;
  showSection: boolean;
}) {
  const clippingPlanes = useMemo(() => {
    if (!showSection) return [] as THREE.Plane[];
    return [new THREE.Plane(new THREE.Vector3(1, 0, 0), sectionOffset)];
  }, [sectionOffset, showSection]);

  return (
    <group>
      <mesh position={[0.02, -0.5, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.06, 0.16, 0.06]}>
        <sphereGeometry args={[1, 14, 10]} />
        <BodyMaterial color={stipeColor} clippingPlanes={clippingPlanes} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.02, 0.026, 0.84, 12]} />
        <BodyMaterial color={stipeColor} clippingPlanes={clippingPlanes} roughness={0.48} />
      </mesh>
      <mesh position={VESICLE}>
        <sphereGeometry args={[VESICLE_R, 20, 16]} />
        <BodyMaterial color={stipeColor} clippingPlanes={clippingPlanes} roughness={0.42} />
      </mesh>
      {PHIALIDE_DIRS.map((dir, i) => {
        const len = 0.07;
        const from: [number, number, number] = [
          VESICLE[0] + dir[0] * VESICLE_R,
          VESICLE[1] + dir[1] * VESICLE_R,
          VESICLE[2] + dir[2] * VESICLE_R,
        ];
        const to: [number, number, number] = [
          from[0] + dir[0] * len,
          from[1] + dir[1] * len,
          from[2] + dir[2] * len,
        ];
        const mid: [number, number, number] = [
          (from[0] + to[0]) / 2,
          (from[1] + to[1]) / 2,
          (from[2] + to[2]) / 2,
        ];
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(...dir),
        );
        const euler = new THREE.Euler().setFromQuaternion(quaternion);
        return (
          <group key={`p-${i}`}>
            <mesh position={mid} rotation={[euler.x, euler.y, euler.z]}>
              <coneGeometry args={[0.012, len, 7]} />
              <BodyMaterial color={stipeColor} clippingPlanes={clippingPlanes} roughness={0.42} />
            </mesh>
            {[0.02, 0.045, 0.07].map((t, j) => (
              <mesh
                key={`c-${i}-${j}`}
                position={[to[0] + dir[0] * t, to[1] + dir[1] * t, to[2] + dir[2] * t]}
              >
                <sphereGeometry args={[0.016, 10, 8]} />
                <BodyMaterial color={conidiaColor} clippingPlanes={clippingPlanes} roughness={0.55} />
              </mesh>
            ))}
          </group>
        );
      })}
      {showSection && (
        <mesh position={[sectionOffset, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[1.3, 1.3]} />
          <meshBasicMaterial color="#c8bfb3" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
