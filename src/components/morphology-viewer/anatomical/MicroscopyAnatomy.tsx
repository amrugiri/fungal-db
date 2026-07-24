"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { MorphologyParameters } from "@/lib/types";
import { BodyMaterial } from "@/components/morphology-viewer/anatomical/ClippedMaterial";

type Vector3Tuple = [number, number, number];

type HyphaSegment = {
  start: Vector3Tuple;
  end: Vector3Tuple;
  radius: number;
};

type SeptumPoint = Vector3Tuple;

function normalize(v: Vector3Tuple): Vector3Tuple {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function rotateAroundAxis(dir: Vector3Tuple, axis: Vector3Tuple, angleRad: number): Vector3Tuple {
  const v = new THREE.Vector3(...dir);
  const a = new THREE.Vector3(...axis).normalize();
  v.applyAxisAngle(a, angleRad);
  return [v.x, v.y, v.z];
}

function buildHyphalTree(
  origin: Vector3Tuple,
  direction: Vector3Tuple,
  length: number,
  depth: number,
  maxDepth: number,
  branchAngleDeg: number,
  segments: HyphaSegment[],
  septa: SeptumPoint[],
  radius: number,
): void {
  if (depth > maxDepth || length < 0.08) return;

  const dir = normalize(direction);
  const end: Vector3Tuple = [
    origin[0] + dir[0] * length,
    origin[1] + dir[1] * length,
    origin[2] + dir[2] * length,
  ];

  segments.push({ start: origin, end, radius });

  const septumCount = Math.max(2, Math.floor(length / 0.18));
  for (let s = 1; s < septumCount; s++) {
    const t = s / septumCount;
    septa.push([
      origin[0] + dir[0] * length * t,
      origin[1] + dir[1] * length * t,
      origin[2] + dir[2] * length * t,
    ]);
  }

  const branchAngle = (branchAngleDeg * Math.PI) / 180;
  const up: Vector3Tuple = [0, 1, 0];
  const branches =
    depth < maxDepth - 1
      ? [
          rotateAroundAxis(dir, up, branchAngle),
          rotateAroundAxis(dir, up, -branchAngle),
          rotateAroundAxis(dir, [1, 0, 0], branchAngle * 0.7),
        ]
      : [rotateAroundAxis(dir, up, branchAngle * 0.8)];

  for (const branchDir of branches) {
    buildHyphalTree(
      end,
      branchDir,
      length * 0.82,
      depth + 1,
      maxDepth,
      branchAngleDeg,
      segments,
      septa,
      radius * 0.92,
    );
  }
}

function HyphaCylinder({
  start,
  end,
  radius,
  color,
  clippingPlanes,
}: HyphaSegment & { color: string; clippingPlanes: THREE.Plane[] }) {
  const { position, rotation, scale } = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
    const dir = endVec.clone().sub(startVec);
    const length = dir.length();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    return {
      position: [mid.x, mid.y, mid.z] as Vector3Tuple,
      rotation: [euler.x, euler.y, euler.z] as Vector3Tuple,
      scale: length,
    };
  }, [start, end]);

  return (
    <mesh position={position} rotation={rotation} scale={[1, scale, 1]}>
      <cylinderGeometry args={[radius, radius * 0.95, 1, 8]} />
      <BodyMaterial color={color} clippingPlanes={clippingPlanes} roughness={0.45} metalness={0.05} />
    </mesh>
  );
}

export function MicroscopyAnatomy({
  params,
  sectionOffset,
  showSection,
}: {
  params: MorphologyParameters;
  sectionOffset: number;
  showSection: boolean;
}) {
  const stain = params.stainColor ?? params.hyphaeColor;
  const maxDepth = Math.min(5, Math.max(3, Math.round(params.hyphaeDensity / 4)));

  const clippingPlanes = useMemo(() => {
    if (!showSection) return [] as THREE.Plane[];
    return [new THREE.Plane(new THREE.Vector3(1, 0, 0), sectionOffset)];
  }, [sectionOffset, showSection]);

  const { segments, septa } = useMemo(() => {
    const segs: HyphaSegment[] = [];
    const sept: SeptumPoint[] = [];
    const roots: Vector3Tuple[] = [
      [0, -0.4, 0],
      [0.15, -0.35, 0.1],
      [-0.12, -0.38, -0.08],
    ];
    const directions: Vector3Tuple[] = [
      [0.2, 0.9, 0.1],
      [-0.15, 0.85, 0.2],
      [0.1, 0.88, -0.15],
    ];
    roots.forEach((origin, i) => {
      buildHyphalTree(
        origin,
        directions[i],
        0.55,
        0,
        maxDepth,
        params.hyphaeBranchAngle,
        segs,
        sept,
        params.hyphaeThickness,
      );
    });
    return { segments: segs, septa: sept };
  }, [maxDepth, params.hyphaeBranchAngle, params.hyphaeThickness]);

  if (!params.showMycelium) return null;

  return (
    <group>
      {segments.map((seg, i) => (
        <HyphaCylinder key={`h-${i}`} {...seg} color={stain} clippingPlanes={clippingPlanes} />
      ))}
      {septa.map((point, i) => (
        <mesh key={`s-${i}`} position={point}>
          <sphereGeometry args={[params.hyphaeThickness * 1.35, 8, 8]} />
          <BodyMaterial
            color={stain}
            clippingPlanes={clippingPlanes}
            roughness={0.45}
            metalness={0.05}
          />
        </mesh>
      ))}
      {showSection && (
        <mesh position={[sectionOffset, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial color="#c8bfb3" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

export const MICROSCOPY_SECTION_RANGE = 1.1;
