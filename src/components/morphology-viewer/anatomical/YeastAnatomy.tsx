"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { BodyMaterial } from "@/components/morphology-viewer/anatomical/ClippedMaterial";

type YeastCell = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

const MOTHER_CELLS: YeastCell[] = [
  { position: [0, 0.02, 0], rotation: [0.2, 0.4, 0.1], scale: [0.22, 0.28, 0.2] },
  { position: [-0.38, -0.12, 0.08], rotation: [0.1, -0.3, 0.2], scale: [0.2, 0.26, 0.18] },
  { position: [0.36, -0.18, -0.06], rotation: [-0.15, 0.5, 0], scale: [0.18, 0.24, 0.17] },
  { position: [0.08, 0.32, 0.14], rotation: [0.3, 0.1, -0.2], scale: [0.16, 0.2, 0.15] },
  { position: [-0.22, 0.22, -0.18], rotation: [0, 0.6, 0.15], scale: [0.17, 0.22, 0.16] },
];

const BUDS: YeastCell[] = [
  { position: [0.14, 0.22, 0.04], rotation: [0.4, 0.2, 0], scale: [0.1, 0.12, 0.1] },
  { position: [-0.5, 0.02, 0.1], rotation: [0.2, -0.4, 0.1], scale: [0.09, 0.11, 0.09] },
  { position: [0.48, -0.08, -0.04], rotation: [-0.2, 0.3, 0], scale: [0.08, 0.1, 0.08] },
  { position: [0.16, 0.44, 0.16], rotation: [0.1, 0, 0.2], scale: [0.07, 0.09, 0.07] },
];

export function YeastAnatomy({
  color,
  sectionOffset,
  showSection,
}: {
  color: string;
  sectionOffset: number;
  showSection: boolean;
}) {
  const clippingPlanes = useMemo(() => {
    if (!showSection) return [] as THREE.Plane[];
    return [new THREE.Plane(new THREE.Vector3(1, 0, 0), sectionOffset)];
  }, [sectionOffset, showSection]);

  return (
    <group>
      {MOTHER_CELLS.map((cell, i) => (
        <mesh key={`m-${i}`} position={cell.position} rotation={cell.rotation} scale={cell.scale}>
          <sphereGeometry args={[1, 24, 18]} />
          <BodyMaterial
            color={color}
            clippingPlanes={clippingPlanes}
            roughness={0.35}
            metalness={0.04}
          />
        </mesh>
      ))}
      {BUDS.map((cell, i) => (
        <mesh key={`b-${i}`} position={cell.position} rotation={cell.rotation} scale={cell.scale}>
          <sphereGeometry args={[1, 20, 16]} />
          <BodyMaterial
            color={color}
            clippingPlanes={clippingPlanes}
            roughness={0.35}
            metalness={0.04}
          />
        </mesh>
      ))}
      {showSection && (
        <mesh position={[sectionOffset, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial color="#c8bfb3" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
