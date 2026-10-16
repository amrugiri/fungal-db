"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { BodyMaterial } from "@/components/morphology-viewer/anatomical/ClippedMaterial";

type Segment = {
  from: [number, number, number];
  to: [number, number, number];
  radius: number;
};

function cylinderProps(from: [number, number, number], to: [number, number, number]) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const dir = end.clone().sub(start);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize(),
  );
  const euler = new THREE.Euler().setFromQuaternion(quaternion);
  return {
    position: [mid.x, mid.y, mid.z] as [number, number, number],
    rotation: [euler.x, euler.y, euler.z] as [number, number, number],
    length: Math.max(dir.length(), 0.001),
  };
}

function meshFor(seg: Segment, color: string, clippingPlanes: THREE.Plane[], key: string) {
  const { position, rotation, length } = cylinderProps(seg.from, seg.to);
  return (
    <mesh key={key} position={position} rotation={rotation}>
      <cylinderGeometry args={[seg.radius * 0.88, seg.radius, length, 12]} />
      <BodyMaterial color={color} clippingPlanes={clippingPlanes} roughness={0.45} metalness={0.04} />
    </mesh>
  );
}

/** Continuous conidiophore axis — stipe and head are one shaft, not two pieces. */
const AXIS: Segment = { from: [0, -0.52, 0], to: [0, 0.5, 0], radius: 0.042 };

const AXIS_SPHERES: [number, number, number][] = Array.from({ length: 18 }, (_, i) => [
  0,
  -0.5 + i * (1.0 / 17),
  0,
]);

const BRANCHES: Segment[] = [
  { from: [0, 0.16, 0], to: [0.22, 0.3, 0.06], radius: 0.018 },
  { from: [0, 0.16, 0], to: [-0.2, 0.3, -0.05], radius: 0.018 },
  { from: [0, 0.28, 0], to: [0.08, 0.4, 0.2], radius: 0.016 },
  { from: [0, 0.28, 0], to: [-0.06, 0.38, -0.2], radius: 0.016 },
  { from: [0, 0.4, 0], to: [0.16, 0.52, 0.04], radius: 0.014 },
  { from: [0, 0.4, 0], to: [-0.14, 0.52, -0.04], radius: 0.014 },
  { from: [0.22, 0.3, 0.06], to: [0.34, 0.44, 0.1], radius: 0.012 },
  { from: [0.22, 0.3, 0.06], to: [0.32, 0.42, -0.04], radius: 0.012 },
  { from: [-0.2, 0.3, -0.05], to: [-0.34, 0.44, -0.02], radius: 0.012 },
  { from: [-0.2, 0.3, -0.05], to: [-0.3, 0.42, -0.16], radius: 0.012 },
  { from: [0.08, 0.4, 0.2], to: [0.12, 0.54, 0.28], radius: 0.011 },
  { from: [-0.06, 0.38, -0.2], to: [-0.1, 0.52, -0.3], radius: 0.011 },
];

const PHIALIDES: Segment[] = [
  { from: [0.34, 0.44, 0.1], to: [0.4, 0.56, 0.13], radius: 0.009 },
  { from: [0.32, 0.42, -0.04], to: [0.38, 0.54, -0.06], radius: 0.009 },
  { from: [-0.34, 0.44, -0.02], to: [-0.4, 0.56, 0], radius: 0.009 },
  { from: [-0.3, 0.42, -0.16], to: [-0.34, 0.54, -0.2], radius: 0.009 },
  { from: [0.12, 0.54, 0.28], to: [0.14, 0.66, 0.34], radius: 0.008 },
  { from: [-0.1, 0.52, -0.3], to: [-0.12, 0.64, -0.36], radius: 0.008 },
  { from: [0.16, 0.52, 0.04], to: [0.2, 0.64, 0.06], radius: 0.008 },
  { from: [-0.14, 0.52, -0.04], to: [-0.18, 0.64, -0.06], radius: 0.008 },
];

const JOINTS: [number, number, number][] = [
  [0, 0.16, 0],
  [0, 0.28, 0],
  [0, 0.4, 0],
  [0, 0.5, 0],
  [0.22, 0.3, 0.06],
  [-0.2, 0.3, -0.05],
  [0.08, 0.4, 0.2],
  [-0.06, 0.38, -0.2],
];

function chainFromTip(tip: [number, number, number], dir: [number, number, number]): [number, number, number][] {
  return [0.018, 0.048, 0.078].map((t) => [
    tip[0] + dir[0] * t,
    tip[1] + dir[1] * t,
    tip[2] + dir[2] * t,
  ]);
}

const CONIDIA = PHIALIDES.flatMap((p) => {
  const dir: [number, number, number] = [p.to[0] - p.from[0], p.to[1] - p.from[1], p.to[2] - p.from[2]];
  const len = Math.hypot(...dir) || 1;
  return chainFromTip(p.to, [dir[0] / len, dir[1] / len, dir[2] / len]);
});

export function PaecilomycesAnatomy({
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
      {meshFor(AXIS, stipeColor, clippingPlanes, "axis")}
      {AXIS_SPHERES.map((pos, i) => (
        <mesh key={`ax-${i}`} position={pos}>
          <sphereGeometry args={[0.04, 12, 10]} />
          <BodyMaterial color={stipeColor} clippingPlanes={clippingPlanes} roughness={0.45} metalness={0.04} />
        </mesh>
      ))}
      {BRANCHES.map((seg, i) => meshFor(seg, stipeColor, clippingPlanes, `b-${i}`))}
      {JOINTS.map((pos, i) => (
        <mesh key={`j-${i}`} position={pos}>
          <sphereGeometry args={[i < 4 ? 0.03 : 0.016, 12, 10]} />
          <BodyMaterial color={stipeColor} clippingPlanes={clippingPlanes} roughness={0.45} metalness={0.04} />
        </mesh>
      ))}
      {PHIALIDES.map((seg, i) => {
        const { position, rotation, length } = cylinderProps(seg.from, seg.to);
        return (
          <mesh key={`p-${i}`} position={position} rotation={rotation}>
            <coneGeometry args={[seg.radius, length, 8]} />
            <BodyMaterial color={stipeColor} clippingPlanes={clippingPlanes} roughness={0.42} metalness={0.03} />
          </mesh>
        );
      })}
      {CONIDIA.map((pos, i) => (
        <mesh key={`c-${i}`} position={pos}>
          <sphereGeometry args={[0.02, 12, 10]} />
          <BodyMaterial color={conidiaColor} clippingPlanes={clippingPlanes} roughness={0.4} metalness={0.03} />
        </mesh>
      ))}
      {showSection && (
        <mesh position={[sectionOffset, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[1.3, 1.3]} />
          <meshBasicMaterial color="#c8bfb3" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
