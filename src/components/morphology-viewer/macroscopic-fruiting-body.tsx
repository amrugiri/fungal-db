"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import type { Group, Vector3Tuple } from "three";
import * as THREE from "three";
import type { MorphologyParameters } from "@/lib/types";
import { BodyMaterial } from "@/components/morphology-viewer/anatomical/ClippedMaterial";

type MacroscopicProps = {
  params: MorphologyParameters;
  referenceTextureUrl?: string | null;
  clippingPlanes?: THREE.Plane[];
  autoRotate?: boolean;
};

function stemMaterial(color = "#f2ebe0", clippingPlanes: THREE.Plane[] = []) {
  return <BodyMaterial color={color} clippingPlanes={clippingPlanes} roughness={0.78} metalness={0.02} />;
}

function CapSurface({
  color,
  roughness = 0.72,
  clippingPlanes = [],
}: {
  color: string;
  textureUrl?: string | null;
  roughness?: number;
  clippingPlanes?: THREE.Plane[];
}) {
  return <BodyMaterial color={color} clippingPlanes={clippingPlanes} roughness={roughness} metalness={0.02} />;
}

function TexturedCapMaterial({
  url,
  color,
  roughness,
}: {
  url: string;
  color: string;
  roughness: number;
}) {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return <meshStandardMaterial map={texture} color={color} roughness={roughness} metalness={0.02} />;
}

function RadialGills({
  radius,
  y,
  count = 32,
  color = "#c9a89a",
  clippingPlanes = [],
}: {
  radius: number;
  y: number;
  count?: number;
  color?: string;
  clippingPlanes?: THREE.Plane[];
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius * 0.22, y, Math.sin(angle) * radius * 0.22]}
            rotation={[0, angle, Math.PI / 2]}
          >
            <boxGeometry args={[radius * 0.88, 0.006, 0.1]} />
            <BodyMaterial color={color} clippingPlanes={clippingPlanes} roughness={0.92} />
          </mesh>
        );
      })}
    </>
  );
}

function ClassicMushroom({
  params,
  referenceTextureUrl,
  clippingPlanes = [],
  conicalCap = false,
}: MacroscopicProps & { conicalCap?: boolean }) {
  const capScale = params.capDiameter / 10;
  const stipeScale = params.stipeLength / 10;
  const capColor = params.capColor;
  const stemHeight = stipeScale * 0.92;
  const stemRadius = 0.11 * Math.max(capScale, 0.45);
  const junctionY = stemHeight;
  const fleshHeight = capScale * 0.06;
  const capBaseY = junctionY + fleshHeight;
  const capFlatten = conicalCap ? 0.75 : 0.52;

  return (
    <group>
      <mesh position={[0, stemHeight / 2, 0]} scale={[stemRadius, stemHeight, stemRadius]}>
        <cylinderGeometry args={[1, 1.08, 1, 16]} />
        {stemMaterial(undefined, clippingPlanes)}
      </mesh>
      <mesh position={[0, junctionY * 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[stemRadius * 1.2, 0.016, 8, 20]} />
        <BodyMaterial color="#faf6ef" clippingPlanes={clippingPlanes} roughness={0.82} />
      </mesh>
      <RadialGills clippingPlanes={clippingPlanes} radius={capScale * 0.5} y={junctionY + 0.008} />
      <mesh position={[0, junctionY + fleshHeight / 2, 0]} scale={[capScale * 0.84, fleshHeight, capScale * 0.84]}>
        <cylinderGeometry args={[0.5, 0.52, 1, 20]} />
        <Suspense fallback={<BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.68} />}>
          <CapSurface color={capColor} textureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />
        </Suspense>
      </mesh>
      <mesh position={[0, capBaseY, 0]} scale={[capScale, capScale * capFlatten, capScale]}>
        <sphereGeometry args={[0.55, 28, 22, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Suspense fallback={<BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.68} />}>
          <CapSurface color={capColor} textureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />
        </Suspense>
      </mesh>
    </group>
  );
}

function OysterCluster({ params, referenceTextureUrl, clippingPlanes = [] }: MacroscopicProps) {
  const capScale = params.capDiameter / 10;
  const capColor = params.capColor;
  const caps: { pos: Vector3Tuple; rot: Vector3Tuple; scale: number }[] = [
    { pos: [0, 0.08, 0], rot: [0, 0, -0.15], scale: 1 },
    { pos: [-0.22 * capScale, 0.02, 0.08], rot: [0.1, 0.4, -0.25], scale: 0.75 },
    { pos: [0.18 * capScale, 0.04, -0.1], rot: [-0.05, -0.35, -0.2], scale: 0.68 },
  ];

  return (
    <group>
      <mesh position={[0, -0.04, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.035, 0.05, 0.12, 8]} />
        {stemMaterial("#d8ccb8", clippingPlanes)}
      </mesh>
      {caps.map((cap, i) => (
        <group key={i} position={cap.pos} rotation={cap.rot as Vector3Tuple}>
          <mesh scale={[capScale * 1.1 * cap.scale, capScale * 0.22 * cap.scale, capScale * 0.75 * cap.scale]}>
            <boxGeometry args={[1, 1, 1]} />
            <Suspense fallback={<BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.7} />}>
              <CapSurface color={capColor} textureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />
            </Suspense>
          </mesh>
          <mesh position={[0, -capScale * 0.1 * cap.scale, 0]} scale={[capScale * 0.95 * cap.scale, 0.01, capScale * 0.65 * cap.scale]}>
            <boxGeometry args={[1, 1, 1]} />
            <BodyMaterial color="#e8ddd0" clippingPlanes={clippingPlanes} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function KingOyster({ params, referenceTextureUrl, clippingPlanes = [] }: MacroscopicProps) {
  const capScale = params.capDiameter / 10;
  const stipeScale = params.stipeLength / 10;
  const capColor = params.capColor;
  const stemH = stipeScale * 0.95;

  return (
    <group>
      <mesh position={[0, stemH / 2, 0]} scale={[0.2, stemH, 0.2]}>
        <cylinderGeometry args={[1, 1.04, 1, 14]} />
        {stemMaterial("#f0e6d2", clippingPlanes)}
      </mesh>
      <RadialGills clippingPlanes={clippingPlanes} radius={capScale * 0.28} y={stemH + 0.01} count={20} />
      <mesh position={[0, stemH + 0.03, 0]} scale={[capScale * 0.62, capScale * 0.14, capScale * 0.62]}>
        <cylinderGeometry args={[0.5, 0.52, 1, 16]} />
        <Suspense fallback={<BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.7} />}>
          <CapSurface color={capColor} textureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />
        </Suspense>
      </mesh>
      <mesh position={[0, stemH + 0.06, 0]} scale={[capScale * 0.58, capScale * 0.22, capScale * 0.58]}>
        <sphereGeometry args={[0.55, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Suspense fallback={<BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.7} />}>
          <CapSurface color={capColor} textureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />
        </Suspense>
      </mesh>
    </group>
  );
}

function LionsMane({ params, referenceTextureUrl, clippingPlanes = [] }: MacroscopicProps) {
  const capScale = params.capDiameter / 10;
  const capColor = params.capColor;
  const spines = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => {
      const angle = (i / 48) * Math.PI * 2;
      const ring = i % 3;
      const r = 0.08 + ring * 0.07;
      const len = 0.28 + (i % 5) * 0.06;
      return {
        angle,
        r,
        len,
        tilt: 0.15 + (i % 4) * 0.08,
        y: 0.12 - ring * 0.04,
      };
    });
  }, []);

  return (
    <group>
      <mesh position={[0, 0.08, 0]} scale={[capScale * 0.35, capScale * 0.28, capScale * 0.35]}>
        <sphereGeometry args={[0.55, 20, 16]} />
        <Suspense fallback={<BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.75} />}>
          <CapSurface color={capColor} textureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />
        </Suspense>
      </mesh>
      {spines.map((s, i) => (
        <mesh
          key={i}
          position={[Math.cos(s.angle) * s.r * capScale, s.y, Math.sin(s.angle) * s.r * capScale]}
          rotation={[s.tilt, s.angle, 0]}
        >
          <cylinderGeometry args={[0.018, 0.032, s.len * capScale, 6]} />
          <BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.68} />
        </mesh>
      ))}
    </group>
  );
}

function MaitakeCluster({ params, referenceTextureUrl, clippingPlanes = [] }: MacroscopicProps) {
  const capScale = params.capDiameter / 10;
  const capColor = params.capColor;
  const fronds = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * Math.PI * 2;
      const layer = Math.floor(i / 5);
      return {
        angle,
        y: layer * 0.06,
        r: 0.12 + layer * 0.08,
        scale: 0.55 + (i % 3) * 0.15,
        tilt: 0.4 + layer * 0.15,
      };
    });
  }, []);

  return (
    <group>
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 0.14, 10]} />
        {stemMaterial("#e8dcc8", clippingPlanes)}
      </mesh>
      {fronds.map((f, i) => (
        <mesh
          key={i}
          position={[Math.cos(f.angle) * f.r * capScale, f.y, Math.sin(f.angle) * f.r * capScale]}
          rotation={[f.tilt, f.angle, 0]}
          scale={[capScale * f.scale, capScale * 0.12, capScale * 0.42]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <Suspense fallback={<BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.75} />}>
            <CapSurface color={capColor} textureUrl={referenceTextureUrl} roughness={0.78} />
          </Suspense>
        </mesh>
      ))}
    </group>
  );
}

function JellyEarFungus({ params, referenceTextureUrl, clippingPlanes = [] }: MacroscopicProps) {
  const capScale = params.capDiameter / 10;
  const capColor = params.capColor;

  return (
    <group>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={i}
          position={[Math.sin(i * 1.4) * 0.12, i * 0.04, Math.cos(i * 1.4) * 0.08]}
          rotation={[0.2, i * 0.5, 0]}
          scale={[capScale * 0.55, capScale * 0.75, capScale * 0.12]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <Suspense fallback={<BodyMaterial color={capColor} clippingPlanes={clippingPlanes} transparent opacity={0.85} roughness={0.25} />}>
            <CapSurface color={capColor} textureUrl={referenceTextureUrl} roughness={0.22} />
          </Suspense>
        </mesh>
      ))}
    </group>
  );
}

function JellyFungus({ params, referenceTextureUrl, clippingPlanes = [] }: MacroscopicProps) {
  const capScale = params.capDiameter / 10;
  const capColor = params.capColor;
  const isEar = capColor.toLowerCase() < "#666666";

  if (isEar) {
    return <JellyEarFungus params={params} referenceTextureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />;
  }

  return (
    <group>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          position={[Math.sin(i * 1.1) * 0.18, i * 0.05 - 0.08, Math.cos(i * 1.1) * 0.14]}
          rotation={[0.25, i * 0.35, 0]}
          scale={[capScale * 0.75, capScale * 0.1, capScale * 0.45]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <BodyMaterial color={capColor} clippingPlanes={clippingPlanes} transparent opacity={0.7} roughness={0.18} />
        </mesh>
      ))}
    </group>
  );
}

function MorelBody({ params, clippingPlanes = [] }: MacroscopicProps) {
  const capScale = params.capDiameter / 10;
  const stipeScale = params.stipeLength / 10;
  const capColor = params.capColor;

  return (
    <group>
      <mesh position={[0, -0.02, 0]} scale={[0.1, stipeScale * 0.55, 0.1]}>
        <cylinderGeometry args={[1, 1.1, 1, 10]} />
        {stemMaterial(undefined, clippingPlanes)}
      </mesh>
      {Array.from({ length: 24 }).map((_, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        return (
          <mesh
            key={i}
            position={[(col - 3.5) * 0.08 * capScale, 0.14 + row * 0.07, (row - 1) * 0.05]}
            scale={[0.05 * capScale, 0.12 * capScale, 0.05 * capScale]}
          >
            <coneGeometry args={[1, 1.3, 6]} />
            <BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.92} />
          </mesh>
        );
      })}
    </group>
  );
}

function PuffballBody({ params, clippingPlanes = [] }: MacroscopicProps) {
  const capScale = params.capDiameter / 10;
  return (
    <group>
      <mesh position={[0, 0.12, 0]} scale={capScale * 1.05}>
        <sphereGeometry args={[0.72, 28, 24]} />
        <BodyMaterial color="#f5f0e6" clippingPlanes={clippingPlanes} roughness={0.88} />
      </mesh>
      <mesh position={[0, -0.02, 0]} scale={[0.08, 0.06, 0.08]}>
        <cylinderGeometry args={[1, 1.2, 1, 8]} />
        {stemMaterial("#e8e0d4", clippingPlanes)}
      </mesh>
    </group>
  );
}

function SmutGalls({ params, clippingPlanes = [] }: MacroscopicProps) {
  const capScale = params.capDiameter / 10;
  return (
    <group rotation={[0.15, 0.35, 0]}>
      <mesh position={[0, -0.12, 0]} scale={[0.32, 0.95, 0.32]}>
        <cylinderGeometry args={[0.5, 0.42, 1, 12]} />
        <BodyMaterial color="#e8c84a" clippingPlanes={clippingPlanes} roughness={0.82} />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const r = 0.12 + (i % 3) * 0.05;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, 0.12 + (i % 2) * 0.06, Math.sin(angle) * r]}
            scale={[0.1 + (i % 2) * 0.03, 0.16, 0.09]}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <BodyMaterial color="#5a4a3a" clippingPlanes={clippingPlanes} roughness={0.92} />
          </mesh>
        );
      })}
    </group>
  );
}

function MacroscopicFruitingBodyInner({ params, referenceTextureUrl, clippingPlanes = [] }: MacroscopicProps) {
  if (!params.showFruitingBody || params.fruitingBodyType === "none") return null;

  const conicalCap = params.fruitingBodyType === "mushroom" && params.stipeLength > params.capDiameter;

  switch (params.fruitingBodyType) {
    case "puffball":
      return <PuffballBody params={params} referenceTextureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />;
    case "smut":
      return <SmutGalls params={params} referenceTextureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />;
    case "jelly":
      return <JellyFungus params={params} referenceTextureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />;
    case "lions_mane":
    case "coral":
      return <LionsMane params={params} referenceTextureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />;
    case "maitake":
      return <MaitakeCluster params={params} referenceTextureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />;
    case "morel":
      return <MorelBody params={params} referenceTextureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />;
    case "oyster":
      return <OysterCluster params={params} referenceTextureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />;
    case "king_oyster":
      return <KingOyster params={params} referenceTextureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />;
    case "mushroom":
    default:
      return (
        <ClassicMushroom
          params={params}
          referenceTextureUrl={referenceTextureUrl}
          conicalCap={conicalCap}
        />
      );
  }
}

export function MacroscopicFruitingBody({ params, referenceTextureUrl, clippingPlanes = [], autoRotate = true }: MacroscopicProps) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      if (autoRotate) groupRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      <MacroscopicFruitingBodyInner params={params} referenceTextureUrl={referenceTextureUrl} clippingPlanes={clippingPlanes} />
    </group>
  );
}
