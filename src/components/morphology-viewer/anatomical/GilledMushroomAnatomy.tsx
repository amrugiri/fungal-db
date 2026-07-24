"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { ClippedMaterial } from "@/components/morphology-viewer/anatomical/ClippedMaterial";

const STIPE_HEIGHT = 0.64;
const STIPE_RADIUS = 0.095;
const GILL_PLANE_Y = 0.62;
const ANNULUS_Y = 0.5;
const CAP_RADIUS = 0.48;

function Lamellae({
  clippingPlanes,
  count = 48,
}: {
  clippingPlanes: THREE.Plane[];
  count?: number;
}) {
  return (
    <group position={[0, GILL_PLANE_Y, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const innerGap = 0.055;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * (innerGap + 0.14), 0, Math.sin(angle) * (innerGap + 0.14)]}
            rotation={[0, angle, Math.PI / 2]}
          >
            <boxGeometry args={[CAP_RADIUS * 1.55, 0.004, 0.088]} />
            <ClippedMaterial color="#6b3f2a" clippingPlanes={clippingPlanes} roughness={0.9} clearcoat={0} />
          </mesh>
        );
      })}
    </group>
  );
}

function MycelialThreads({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  const threads = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2 + 0.2;
        const length = 0.14 + (i % 3) * 0.04;
        return {
          angle,
          length,
          x: Math.cos(angle) * 0.08,
          z: Math.sin(angle) * 0.08,
        };
      }),
    [],
  );

  return (
    <group position={[0, -0.01, 0]}>
      {threads.map((thread, i) => (
        <mesh
          key={i}
          position={[thread.x, -thread.length / 2, thread.z]}
          rotation={[0.4, thread.angle, 0.25]}
        >
          <cylinderGeometry args={[0.003, 0.0015, thread.length, 6]} />
          <ClippedMaterial color="#e8e4dc" clippingPlanes={clippingPlanes} roughness={0.85} clearcoat={0} />
        </mesh>
      ))}
    </group>
  );
}

function MushroomEnvironment({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[0.75, 48]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} metalness={0} />
      </mesh>
      <MycelialThreads clippingPlanes={clippingPlanes} />
    </group>
  );
}

export function GilledMushroomAnatomy({
  sectionOffset,
  showSection,
  capColor = "#ddd2bc",
  showAnnulus = true,
  showVolva = true,
}: {
  sectionOffset: number;
  showSection: boolean;
  capColor?: string;
  showAnnulus?: boolean;
  showVolva?: boolean;
}) {
  const clippingPlanes = useMemo(() => {
    if (!showSection) return [] as THREE.Plane[];
    return [new THREE.Plane(new THREE.Vector3(1, 0, 0), sectionOffset)];
  }, [sectionOffset, showSection]);

  const capProfile = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(CAP_RADIUS * 0.9, 0));
    points.push(new THREE.Vector2(CAP_RADIUS * 0.97, 0.035));
    points.push(new THREE.Vector2(CAP_RADIUS, 0.11));
    points.push(new THREE.Vector2(CAP_RADIUS * 0.95, 0.19));
    points.push(new THREE.Vector2(CAP_RADIUS * 0.62, 0.245));
    points.push(new THREE.Vector2(0, 0.245));
    return points;
  }, []);

  const capGeometry = useMemo(() => {
    const geo = new THREE.LatheGeometry(capProfile, 72);
    geo.computeVertexNormals();
    return geo;
  }, [capProfile]);

  return (
    <group>
      <MushroomEnvironment clippingPlanes={clippingPlanes} />

      {showVolva && (
        <>
          <mesh position={[0, 0.035, 0]}>
            <cylinderGeometry args={[STIPE_RADIUS * 1.75, STIPE_RADIUS * 2.1, 0.09, 20]} />
            <ClippedMaterial color="#6b5344" clippingPlanes={clippingPlanes} roughness={0.95} clearcoat={0} />
          </mesh>
          <mesh position={[0, 0.055, 0]}>
            <cylinderGeometry args={[STIPE_RADIUS * 1.45, STIPE_RADIUS * 1.1, 0.07, 18]} />
            <ClippedMaterial color="#9a7b5f" clippingPlanes={clippingPlanes} roughness={0.92} clearcoat={0} />
          </mesh>
        </>
      )}

      <mesh position={[0, STIPE_HEIGHT / 2 + 0.02, 0]}>
        <cylinderGeometry args={[STIPE_RADIUS, STIPE_RADIUS * 1.08, STIPE_HEIGHT, 28]} />
        <ClippedMaterial color="#ede8df" clippingPlanes={clippingPlanes} roughness={0.62} clearcoat={0.1} />
      </mesh>

      <mesh position={[0, STIPE_HEIGHT / 2 + 0.02, 0]}>
        <cylinderGeometry args={[STIPE_RADIUS * 0.7, STIPE_RADIUS * 0.76, STIPE_HEIGHT * 0.98, 22]} />
        <ClippedMaterial color="#f8f4ec" clippingPlanes={clippingPlanes} roughness={0.7} />
      </mesh>

      {showAnnulus && (
        <>
          <mesh position={[0, ANNULUS_Y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[STIPE_RADIUS * 1.24, 0.013, 14, 32]} />
            <ClippedMaterial color="#f5f0e8" clippingPlanes={clippingPlanes} roughness={0.65} clearcoat={0.15} />
          </mesh>
          <mesh position={[0, ANNULUS_Y - 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[STIPE_RADIUS * 1.38, 0.007, 10, 28]} />
            <ClippedMaterial color="#ddd4c8" clippingPlanes={clippingPlanes} roughness={0.82} />
          </mesh>
        </>
      )}

      <Lamellae clippingPlanes={clippingPlanes} />

      <mesh position={[0, GILL_PLANE_Y + 0.032, 0]}>
        <cylinderGeometry args={[CAP_RADIUS * 0.86, CAP_RADIUS * 0.9, 0.065, 44]} />
        <ClippedMaterial color="#e5ddd0" clippingPlanes={clippingPlanes} roughness={0.76} />
      </mesh>

      <mesh position={[0, GILL_PLANE_Y + 0.068, 0]} geometry={capGeometry}>
        <ClippedMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.48} clearcoat={0.28} />
      </mesh>

      {showSection && (
        <mesh position={[sectionOffset, STIPE_HEIGHT * 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[STIPE_HEIGHT * 1.35, CAP_RADIUS * 2.4]} />
          <meshBasicMaterial color="#c8bfb3" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

export const GILLED_SECTION_RANGE = CAP_RADIUS * 2.2;
