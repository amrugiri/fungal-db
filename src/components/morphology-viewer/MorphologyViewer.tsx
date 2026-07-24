"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls } from "@react-three/drei";
import type { Group, Vector3Tuple } from "three";
import * as THREE from "three";
import type { MorphologyParameters } from "@/lib/types";
import { MacroscopicFruitingBody } from "@/components/morphology-viewer/macroscopic-fruiting-body";

type MorphologyViewerProps = {
  parameters: MorphologyParameters;
  referenceTextureUrl?: string | null;
  compact?: boolean;
  heightClass?: string;
  showCaption?: boolean;
};

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

function rotateAroundAxis(
  dir: Vector3Tuple,
  axis: Vector3Tuple,
  angleRad: number,
): Vector3Tuple {
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
}: HyphaSegment & { color: string }) {
  const { position, rotation, scale } = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
    const dir = endVec.clone().sub(startVec);
    const length = dir.length();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
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
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.05} />
    </mesh>
  );
}

function MicroscopyHyphae({ params }: { params: MorphologyParameters }) {
  const groupRef = useRef<Group>(null);
  const stain = params.stainColor ?? params.hyphaeColor;
  const maxDepth = Math.min(5, Math.max(3, Math.round(params.hyphaeDensity / 4)));

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

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  if (!params.showMycelium) return null;

  return (
    <group ref={groupRef}>
      {segments.map((seg, i) => (
        <HyphaCylinder key={`h-${i}`} {...seg} color={stain} />
      ))}
      {septa.map((point, i) => (
        <mesh key={`s-${i}`} position={point}>
          <sphereGeometry args={[params.hyphaeThickness * 1.35, 8, 8]} />
          <meshStandardMaterial color={stain} emissive={stain} emissiveIntensity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ parameters, referenceTextureUrl, compact = false }: MorphologyViewerProps) {
  const bg = parameters.backgroundColor ?? "#f4f1ea";
  const isMicroscopy = parameters.visualizationStyle === "microscopy";

  return (
    <>
      <color attach="background" args={[bg]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 5]} intensity={1} />
      <directionalLight position={[-3, 2, -2]} intensity={0.45} />
      <hemisphereLight args={["#ffffff", "#d8d0c4", 0.35]} />
      <Center>
        {isMicroscopy ? (
          <MicroscopyHyphae params={parameters} />
        ) : (
          <Suspense fallback={null}>
            <MacroscopicFruitingBody
              params={parameters}
              referenceTextureUrl={referenceTextureUrl}
            />
          </Suspense>
        )}
      </Center>
      <OrbitControls
        target={[0, 0, 0]}
        enablePan={!compact}
        enableZoom={!compact}
        enableRotate
      />
    </>
  );
}

export function MorphologyViewer({
  parameters,
  referenceTextureUrl,
  compact = false,
  heightClass,
  showCaption = true,
}: MorphologyViewerProps) {
  const isMicroscopy = parameters.visualizationStyle === "microscopy";
  const height = heightClass ?? (compact ? "h-28" : "h-80");

  const viewer = (
    <Canvas camera={{ position: [0, 0, compact ? 2.6 : 2.35], fov: compact ? 36 : 40 }}>
      <Scene parameters={parameters} referenceTextureUrl={referenceTextureUrl} compact={compact} />
    </Canvas>
  );

  if (compact) {
    return (
      <div
        className={`w-full overflow-hidden rounded-full border-2 border-zinc-200 bg-white ${height} aspect-square`}
      >
        {viewer}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-zinc-200">
      <div className={`${height} w-full`}>{viewer}</div>
      {showCaption && (
        <p className="border-t border-zinc-200 bg-white px-3 py-2 text-xs text-black">
          {isMicroscopy
            ? "Stained hyphal schematic (lactophenol cotton blue style) — septate branching mycelium. Drag to rotate, scroll to zoom."
            : "Textured 3D fruiting-body model based on reference morphology. Drag to rotate, scroll to zoom."}
        </p>
      )}
    </div>
  );
}
