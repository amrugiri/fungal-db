"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { MorphologyParameters } from "@/lib/types";
import { BodyMaterial } from "@/components/morphology-viewer/anatomical/ClippedMaterial";
import { MacroscopicFruitingBody } from "@/components/morphology-viewer/macroscopic-fruiting-body";
import { getMorphologyReferenceAssets } from "@/lib/species-morphology-assets";
import { ReferenceMorelAnatomy } from "@/components/morphology-viewer/anatomical/ReferenceMorelAnatomy";

type AnatomicalFruitingProps = {
  slug?: string;
  params: MorphologyParameters;
  clippingPlanes?: THREE.Plane[];
  sectionOffset?: number;
  showSection?: boolean;
};

function darkenHex(hex: string, amount = 0.28): string {
  const c = hex.replace("#", "");
  if (c.length !== 6) return hex;
  const r = Math.max(0, Math.round(parseInt(c.slice(0, 2), 16) * (1 - amount)));
  const g = Math.max(0, Math.round(parseInt(c.slice(2, 4), 16) * (1 - amount)));
  const b = Math.max(0, Math.round(parseInt(c.slice(4, 6), 16) * (1 - amount)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/** Yellow morel — honeycomb-pitted ascocarp on hollow stipe. */
export function MorelHoneycombAnatomy({ params, clippingPlanes = [] }: AnatomicalFruitingProps) {
  const capScale = params.capDiameter / 10;
  const stipeScale = Math.max(params.stipeLength, 5) / 10;
  const capColor = params.capColor;
  const pitColor = darkenHex(capColor, 0.35);
  const ridgeColor = darkenHex(capColor, 0.12);
  const stipeColor = "#f2ead8";

  const pits = useMemo(() => {
    const items: {
      x: number;
      y: number;
      z: number;
      w: number;
      h: number;
      rot: number;
    }[] = [];

    for (let row = 0; row < 9; row++) {
      const t = row / 8;
      const y = 0.06 + t * 0.42 * capScale;
      const maxR = (1 - t * 0.88) * 0.4 * capScale;
      const count = Math.max(6, Math.round(7 + row * 1.1));
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + row * 0.62;
        const r = maxR * (0.5 + ((i + row) % 4) * 0.12);
        items.push({
          x: Math.cos(angle) * r,
          y,
          z: Math.sin(angle) * r,
          w: 0.032 * capScale * (1 - t * 0.25),
          h: 0.018 * capScale,
          rot: angle,
        });
      }
    }
    return items;
  }, [capScale]);

  const stipeBaseY = stipeScale * 0.34;
  const capBaseY = stipeBaseY + stipeScale * 0.36;

  return (
    <group>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 24]} />
        <meshStandardMaterial color="#1a1410" roughness={1} />
      </mesh>

      <mesh position={[0, stipeBaseY, 0]} scale={[0.075 * capScale, stipeScale * 0.68, 0.075 * capScale]}>
        <cylinderGeometry args={[1, 1.2, 1, 18]} />
        <BodyMaterial color={stipeColor} clippingPlanes={clippingPlanes} roughness={0.8} />
      </mesh>

      <mesh position={[0, stipeBaseY, 0]} scale={[0.045 * capScale, stipeScale * 0.64, 0.045 * capScale]}>
        <cylinderGeometry args={[1, 1, 1, 14]} />
        <BodyMaterial color="#0a0a0a" clippingPlanes={clippingPlanes} roughness={1} />
      </mesh>

      <mesh
        position={[0, capBaseY + capScale * 0.18, 0]}
        scale={[capScale * 0.44, capScale * 0.52, capScale * 0.4]}
      >
        <sphereGeometry args={[0.5, 24, 18]} />
        <BodyMaterial color={ridgeColor} clippingPlanes={clippingPlanes} roughness={0.86} />
      </mesh>

      {pits.map((pit, i) => (
        <mesh
          key={i}
          position={[pit.x, pit.y + capBaseY, pit.z]}
          rotation={[0, pit.rot, 0]}
          scale={[pit.w, pit.h, pit.w * 0.85]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <BodyMaterial color={pitColor} clippingPlanes={clippingPlanes} roughness={0.94} />
        </mesh>
      ))}

      {pits.map((pit, i) => (
        <mesh
          key={`ridge-${i}`}
          position={[pit.x * 1.04, pit.y + capBaseY + pit.h * 0.35, pit.z * 1.04]}
          scale={[pit.w * 0.55, pit.h * 0.35, pit.w * 0.45]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Reishi / Ganoderma — kidney-shaped lacquered bracket on wood. */
export function BracketPolyporeAnatomy({ params, clippingPlanes = [] }: AnatomicalFruitingProps) {
  const capScale = params.capDiameter / 10;
  const capColor = params.capColor;
  const poreColor = "#e8dcc8";
  const stipeColor = "#c9b896";

  const capProfile = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0, 0));
    pts.push(new THREE.Vector2(0.42, 0));
    pts.push(new THREE.Vector2(0.48, 0.06));
    pts.push(new THREE.Vector2(0.46, 0.14));
    pts.push(new THREE.Vector2(0.32, 0.18));
    pts.push(new THREE.Vector2(0.12, 0.16));
    pts.push(new THREE.Vector2(0, 0.1));
    return pts;
  }, []);

  const capGeometry = useMemo(() => {
    const geo = new THREE.LatheGeometry(capProfile, 32);
    geo.computeVertexNormals();
    return geo;
  }, [capProfile]);

  return (
    <group rotation={[0.12, 0.45, 0]}>
      <mesh position={[0, -0.1, 0]} scale={[0.55, 0.08, 0.22]}>
        <boxGeometry args={[1, 1, 1]} />
        <BodyMaterial color="#4a3528" clippingPlanes={clippingPlanes} roughness={0.95} />
      </mesh>

      <mesh position={[-0.14, 0.02, 0]} rotation={[0, 0, 0.35]} scale={[0.05, 0.14, 0.05]}>
        <cylinderGeometry args={[1, 1.15, 1, 12]} />
        <BodyMaterial color={stipeColor} clippingPlanes={clippingPlanes} roughness={0.85} />
      </mesh>

      <mesh
        position={[0.06, 0.14, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[capScale * 1.05, capScale * 1.05, capScale * 0.22]}
        geometry={capGeometry}
      >
        <BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.35} metalness={0.08} />
      </mesh>

      <mesh position={[0.06, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[capScale * 0.88, capScale * 0.88, 0.01]}>
        <circleGeometry args={[0.42, 28]} />
        <BodyMaterial color={poreColor} clippingPlanes={clippingPlanes} roughness={0.92} />
      </mesh>

      <mesh position={[0.2, 0.16, 0.04]} scale={[capScale * 0.35, capScale * 0.08, capScale * 0.25]}>
        <sphereGeometry args={[0.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <BodyMaterial color={darkenHex(capColor, 0.15)} clippingPlanes={clippingPlanes} roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  );
}

function lightenHex(hex: string, amount = 0.18): string {
  const c = hex.replace("#", "");
  if (c.length !== 6) return hex;
  const r = Math.min(255, Math.round(parseInt(c.slice(0, 2), 16) + 255 * amount));
  const g = Math.min(255, Math.round(parseInt(c.slice(2, 4), 16) + 255 * amount));
  const b = Math.min(255, Math.round(parseInt(c.slice(4, 6), 16) + 255 * amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function isDarkCap(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length !== 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r + g + b) / 3 < 110;
}

function DecurrentGills({
  radius,
  y,
  spread = Math.PI,
  count = 28,
  color = "#e8ddd0",
  clippingPlanes = [],
}: {
  radius: number;
  y: number;
  spread?: number;
  count?: number;
  color?: string;
  clippingPlanes?: THREE.Plane[];
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / (count - 1) - 0.5) * spread;
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * radius * 0.35, y, Math.cos(angle) * radius * 0.2]}
            rotation={[0.15, angle, Math.PI / 2]}
          >
            <boxGeometry args={[radius * 0.9, 0.005, 0.08]} />
            <BodyMaterial color={color} clippingPlanes={clippingPlanes} roughness={0.92} />
          </mesh>
        );
      })}
    </>
  );
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
            <boxGeometry args={[radius * 0.88, 0.005, 0.09]} />
            <BodyMaterial color={color} clippingPlanes={clippingPlanes} roughness={0.92} />
          </mesh>
        );
      })}
    </>
  );
}

/** Oyster mushroom — overlapping shelf caps with decurrent gills on wood. */
export function OysterShelfAnatomy({ params, clippingPlanes = [] }: AnatomicalFruitingProps) {
  const capScale = params.capDiameter / 10;
  const capColor = params.capColor;
  const gillColor = lightenHex(capColor, 0.12);

  const caps = useMemo(
    () => [
      { pos: [0, 0.14, 0] as const, rot: [0, 0, -0.12] as const, scale: 1 },
      { pos: [-0.24 * capScale, 0.07, 0.06] as const, rot: [0.08, 0.42, -0.22] as const, scale: 0.78 },
      { pos: [0.2 * capScale, 0.09, -0.08] as const, rot: [-0.05, -0.38, -0.18] as const, scale: 0.72 },
      { pos: [-0.1 * capScale, 0.02, -0.12] as const, rot: [0.12, 0.15, -0.28] as const, scale: 0.58 },
    ],
    [capScale],
  );

  return (
    <group rotation={[0, 0.35, 0]}>
      <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.55, 0.14, 0.2]}>
        <cylinderGeometry args={[1, 1.05, 1, 14]} />
        <BodyMaterial color="#4a3528" clippingPlanes={clippingPlanes} roughness={0.95} />
      </mesh>

      <mesh position={[-0.1, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.035, 0.16, 0.035]}>
        <cylinderGeometry args={[1, 1.1, 1, 10]} />
        <BodyMaterial color="#d8ccb8" clippingPlanes={clippingPlanes} roughness={0.82} />
      </mesh>

      {caps.map((cap, i) => (
        <group key={i} position={cap.pos} rotation={cap.rot}>
          <mesh scale={[capScale * 1.05 * cap.scale, capScale * 0.2 * cap.scale, capScale * 0.72 * cap.scale]}>
            <sphereGeometry args={[0.5, 22, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.74} />
          </mesh>
          <mesh
            position={[0, -capScale * 0.06 * cap.scale, capScale * 0.05 * cap.scale]}
            rotation={[0.35, 0, 0]}
          >
            <DecurrentGills
              radius={capScale * cap.scale}
              y={0}
              count={22}
              color={gillColor}
              clippingPlanes={clippingPlanes}
            />
          </mesh>
          <mesh
            position={[0, -capScale * 0.04 * cap.scale, 0]}
            scale={[capScale * 0.55 * cap.scale, 0.008, capScale * 0.42 * cap.scale]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <BodyMaterial color={darkenHex(capColor, 0.08)} clippingPlanes={clippingPlanes} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** King oyster — thick central stipe with small tan cap. */
export function KingOysterAnatomy({ params, clippingPlanes = [] }: AnatomicalFruitingProps) {
  const capScale = params.capDiameter / 10;
  const stipeScale = Math.max(params.stipeLength, 8) / 10;
  const capColor = params.capColor;
  const stemH = stipeScale * 0.92;
  const stemR = 0.18 * capScale;

  return (
    <group>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 24]} />
        <meshStandardMaterial color="#1a1410" roughness={1} />
      </mesh>

      <mesh position={[0, stemH / 2, 0]} scale={[stemR, stemH, stemR]}>
        <cylinderGeometry args={[1, 1.06, 1, 18]} />
        <BodyMaterial color="#f0e6d2" clippingPlanes={clippingPlanes} roughness={0.8} />
      </mesh>

      <mesh position={[0, stemH * 0.35, 0]} scale={[stemR * 1.15, stemH * 0.08, stemR * 1.15]}>
        <cylinderGeometry args={[1, 1, 1, 16]} />
        <BodyMaterial color="#e8dcc8" clippingPlanes={clippingPlanes} roughness={0.85} />
      </mesh>

      <RadialGills radius={capScale * 0.32} y={stemH + 0.01} count={24} clippingPlanes={clippingPlanes} />

      <mesh position={[0, stemH + 0.025, 0]} scale={[capScale * 0.68, capScale * 0.12, capScale * 0.68]}>
        <cylinderGeometry args={[0.5, 0.52, 1, 18]} />
        <BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.72} />
      </mesh>

      <mesh position={[0, stemH + 0.055, 0]} scale={[capScale * 0.62, capScale * 0.2, capScale * 0.62]}>
        <sphereGeometry args={[0.5, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <BodyMaterial color={darkenHex(capColor, 0.06)} clippingPlanes={clippingPlanes} roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Lion's mane — central mass with cascading icicle spines. */
export function LionsManeIcicleAnatomy({ params, clippingPlanes = [] }: AnatomicalFruitingProps) {
  const capScale = params.capDiameter / 10;
  const capColor = params.capColor;
  const spineColor = darkenHex(capColor, 0.08);

  const spines = useMemo(() => {
    const items: { x: number; y: number; z: number; len: number; r: number; tilt: number }[] = [];
    for (let ring = 0; ring < 5; ring++) {
      const count = 14 + ring * 4;
      const baseY = 0.18 - ring * 0.05;
      const baseR = 0.06 + ring * 0.065;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + ring * 0.4;
        items.push({
          x: Math.cos(angle) * baseR * capScale,
          y: baseY,
          z: Math.sin(angle) * baseR * capScale,
          len: (0.22 + (i % 4) * 0.05 + ring * 0.04) * capScale,
          r: 0.014 + (i % 3) * 0.004,
          tilt: 0.25 + ring * 0.12 + (i % 5) * 0.04,
        });
      }
    }
    return items;
  }, [capScale]);

  return (
    <group>
      <mesh position={[0, 0.22, 0]} scale={[capScale * 0.38, capScale * 0.32, capScale * 0.38]}>
        <sphereGeometry args={[0.5, 22, 18]} />
        <BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.76} />
      </mesh>

      <mesh position={[0, 0.28, 0]} scale={[capScale * 0.22, capScale * 0.14, capScale * 0.22]}>
        <sphereGeometry args={[0.5, 16, 12]} />
        <BodyMaterial color={lightenHex(capColor, 0.06)} clippingPlanes={clippingPlanes} roughness={0.74} />
      </mesh>

      {spines.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, s.y - s.len * 0.45, s.z]}
          rotation={[s.tilt, Math.atan2(s.x, s.z), 0]}
        >
          <cylinderGeometry args={[s.r, s.r * 1.6, s.len, 7]} />
          <BodyMaterial color={spineColor} clippingPlanes={clippingPlanes} roughness={0.68} />
        </mesh>
      ))}
    </group>
  );
}

/** Maitake — rosette of overlapping fan fronds with pore surface. */
export function MaitakeRosetteAnatomy({ params, clippingPlanes = [] }: AnatomicalFruitingProps) {
  const capScale = params.capDiameter / 10;
  const capColor = params.capColor;
  const poreColor = lightenHex(capColor, 0.2);

  const fronds = useMemo(() => {
    const items: { angle: number; y: number; r: number; scale: number; tilt: number }[] = [];
    for (let layer = 0; layer < 3; layer++) {
      const count = 6 + layer * 2;
      for (let i = 0; i < count; i++) {
        items.push({
          angle: (i / count) * Math.PI * 2 + layer * 0.35,
          y: layer * 0.055,
          r: 0.1 + layer * 0.09,
          scale: 0.5 + (i % 3) * 0.14 - layer * 0.06,
          tilt: 0.45 + layer * 0.18,
        });
      }
    }
    return items;
  }, []);

  return (
    <group>
      <mesh position={[0, -0.1, 0]} scale={[0.5, 0.1, 0.2]}>
        <boxGeometry args={[1, 1, 1]} />
        <BodyMaterial color="#4a3528" clippingPlanes={clippingPlanes} roughness={0.95} />
      </mesh>

      <mesh position={[0, -0.02, 0]} scale={[0.07, 0.14, 0.07]}>
        <cylinderGeometry args={[1, 1.2, 1, 12]} />
        <BodyMaterial color="#e8dcc8" clippingPlanes={clippingPlanes} roughness={0.85} />
      </mesh>

      {fronds.map((f, i) => (
        <group
          key={i}
          position={[Math.cos(f.angle) * f.r * capScale, f.y, Math.sin(f.angle) * f.r * capScale]}
          rotation={[f.tilt, f.angle, 0]}
        >
          <mesh scale={[capScale * f.scale, capScale * 0.14, capScale * 0.48]}>
            <sphereGeometry args={[0.5, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <BodyMaterial color={capColor} clippingPlanes={clippingPlanes} roughness={0.78} />
          </mesh>
          <mesh position={[0, -capScale * 0.05, 0]} scale={[capScale * f.scale * 0.85, 0.012, capScale * f.scale * 0.38]}>
            <boxGeometry args={[1, 1, 1]} />
            <BodyMaterial color={poreColor} clippingPlanes={clippingPlanes} roughness={0.92} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Wood ear — ear-shaped gelatinous lobes on branch. */
export function WoodEarAnatomy({ params, clippingPlanes = [] }: AnatomicalFruitingProps) {
  const capScale = params.capDiameter / 10;
  const capColor = params.capColor;

  const ears = useMemo(
    () => [
      { pos: [0, 0.12, 0] as const, rot: [0.1, 0, 0.15] as const, scale: 1 },
      { pos: [-0.14 * capScale, 0.06, 0.05] as const, rot: [0.15, 0.4, -0.1] as const, scale: 0.75 },
      { pos: [0.12 * capScale, 0.08, -0.06] as const, rot: [-0.05, -0.35, 0.12] as const, scale: 0.68 },
    ],
    [capScale],
  );

  return (
    <group rotation={[0, 0.25, 0]}>
      <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.45, 0.08, 0.08]}>
        <cylinderGeometry args={[1, 1, 1, 10]} />
        <BodyMaterial color="#3d2817" clippingPlanes={clippingPlanes} roughness={0.9} />
      </mesh>

      {ears.map((ear, i) => (
        <group key={i} position={ear.pos} rotation={ear.rot}>
          <mesh scale={[capScale * 0.5 * ear.scale, capScale * 0.72 * ear.scale, capScale * 0.1 * ear.scale]}>
            <sphereGeometry args={[0.5, 20, 14]} />
            <BodyMaterial
              color={capColor}
              clippingPlanes={clippingPlanes}
              roughness={0.28}
              transparent
              opacity={0.88}
            />
          </mesh>
          <mesh
            position={[0, 0, -capScale * 0.04 * ear.scale]}
            scale={[capScale * 0.42 * ear.scale, capScale * 0.62 * ear.scale, 0.008]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <BodyMaterial
              color={lightenHex(capColor, 0.15)}
              clippingPlanes={clippingPlanes}
              roughness={0.35}
              transparent
              opacity={0.75}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Snow fungus — frilly translucent lobes. */
export function TremellaAnatomy({ params, clippingPlanes = [] }: AnatomicalFruitingProps) {
  const capScale = params.capDiameter / 10;
  const capColor = params.capColor;

  const lobes = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const layer = i % 3;
      return {
        angle,
        y: layer * 0.04 - 0.02,
        r: 0.08 + layer * 0.06,
        wobble: (i % 4) * 0.08,
        scale: 0.55 + (i % 3) * 0.12,
      };
    });
  }, []);

  return (
    <group>
      <mesh position={[0, -0.08, 0]} scale={[0.35, 0.06, 0.2]}>
        <boxGeometry args={[1, 1, 1]} />
        <BodyMaterial color="#6b5344" clippingPlanes={clippingPlanes} roughness={0.9} />
      </mesh>

      {lobes.map((l, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(l.angle) * l.r * capScale,
            l.y + 0.08,
            Math.cos(l.angle) * l.r * capScale,
          ]}
          rotation={[0.3 + l.wobble, l.angle, 0.15]}
          scale={[capScale * l.scale, capScale * 0.55, capScale * 0.14]}
        >
          <sphereGeometry args={[0.5, 16, 12]} />
          <BodyMaterial
            color={capColor}
            clippingPlanes={clippingPlanes}
            roughness={0.15}
            transparent
            opacity={0.72}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Routes jelly fungi to wood ear or tremella based on cap color. */
export function JellyFungusAnatomy({ params, clippingPlanes = [] }: AnatomicalFruitingProps) {
  if (isDarkCap(params.capColor)) {
    return <WoodEarAnatomy params={params} clippingPlanes={clippingPlanes} />;
  }
  return <TremellaAnatomy params={params} clippingPlanes={clippingPlanes} />;
}

/** Giant puffball — globose basidiocarp with gleba interior hint. */
export function PuffballAnatomy({ params, clippingPlanes = [] }: AnatomicalFruitingProps) {
  const capScale = params.capDiameter / 10;
  const outerColor = params.capColor;
  const glebaColor = "#e8dcc8";

  return (
    <group>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.28, 20]} />
        <meshStandardMaterial color="#1a1410" roughness={1} />
      </mesh>

      <mesh position={[0, 0.02, 0]} scale={[0.09, 0.05, 0.09]}>
        <cylinderGeometry args={[1, 1.3, 1, 10]} />
        <BodyMaterial color="#e8e0d4" clippingPlanes={clippingPlanes} roughness={0.88} />
      </mesh>

      <mesh position={[0, 0.22 * capScale + 0.06, 0]} scale={capScale * 1.02}>
        <sphereGeometry args={[0.72, 32, 26]} />
        <BodyMaterial color={outerColor} clippingPlanes={clippingPlanes} roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.22 * capScale + 0.04, 0]} scale={capScale * 0.88}>
        <sphereGeometry args={[0.72, 24, 20]} />
        <BodyMaterial color={glebaColor} clippingPlanes={clippingPlanes} roughness={0.95} />
      </mesh>
    </group>
  );
}

/** Corn smut — teliospore galls on maize cob. */
export function CornSmutAnatomy({ params, clippingPlanes = [] }: AnatomicalFruitingProps) {
  const capScale = params.capDiameter / 10;
  const gallColor = params.capColor;

  const galls = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const row = Math.floor(i / 7);
      const col = i % 7;
      const angle = (col / 6 - 0.5) * 0.9;
      return {
        x: Math.sin(angle) * 0.14 * capScale,
        y: 0.02 + row * 0.1 + (col % 2) * 0.04,
        z: 0.12 + row * 0.02,
        sx: 0.09 + (i % 3) * 0.025,
        sy: 0.14 + (i % 2) * 0.05,
      };
    });
  }, [capScale]);

  return (
    <group rotation={[0.15, 0.4, 0]}>
      <mesh position={[0, -0.14, 0]} scale={[0.28, 0.95, 0.28]}>
        <cylinderGeometry args={[0.5, 0.42, 1, 14]} />
        <BodyMaterial color="#e8c84a" clippingPlanes={clippingPlanes} roughness={0.82} />
      </mesh>

      <mesh position={[0, 0.08, 0.14]} scale={[0.26, 0.55, 0.08]}>
        <boxGeometry args={[1, 1, 1]} />
        <BodyMaterial color="#c9b84a" clippingPlanes={clippingPlanes} roughness={0.78} />
      </mesh>

      {galls.map((g, i) => (
        <mesh
          key={i}
          position={[g.x, g.y, g.z]}
          scale={[g.sx * capScale, g.sy * capScale, g.sx * capScale * 0.85]}
        >
          <sphereGeometry args={[0.5, 14, 12]} />
          <BodyMaterial color={gallColor} clippingPlanes={clippingPlanes} roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

export function AnatomicalFruitingBody({
  slug,
  params,
  clippingPlanes = [],
  sectionOffset = 0,
  showSection = false,
}: AnatomicalFruitingProps) {
  if (!params.showFruitingBody || params.fruitingBodyType === "none") return null;

  const referenceAssets = slug ? getMorphologyReferenceAssets(slug) : null;

  switch (params.fruitingBodyType) {
    case "morel":
      if (referenceAssets) {
        return (
          <ReferenceMorelAnatomy
            params={params}
            assets={referenceAssets}
            clippingPlanes={clippingPlanes}
            sectionOffset={sectionOffset}
            showSection={showSection}
          />
        );
      }
      return <MorelHoneycombAnatomy params={params} clippingPlanes={clippingPlanes} />;
    case "bracket":
      return <BracketPolyporeAnatomy params={params} clippingPlanes={clippingPlanes} />;
    case "oyster":
      return <OysterShelfAnatomy params={params} clippingPlanes={clippingPlanes} />;
    case "king_oyster":
      return <KingOysterAnatomy params={params} clippingPlanes={clippingPlanes} />;
    case "lions_mane":
    case "coral":
      return <LionsManeIcicleAnatomy params={params} clippingPlanes={clippingPlanes} />;
    case "maitake":
      return <MaitakeRosetteAnatomy params={params} clippingPlanes={clippingPlanes} />;
    case "jelly":
      return <JellyFungusAnatomy params={params} clippingPlanes={clippingPlanes} />;
    case "puffball":
      return <PuffballAnatomy params={params} clippingPlanes={clippingPlanes} />;
    case "smut":
      return <CornSmutAnatomy params={params} clippingPlanes={clippingPlanes} />;
    case "mushroom":
    default:
      return (
        <MacroscopicFruitingBody
          params={params}
          clippingPlanes={clippingPlanes}
          autoRotate={false}
        />
      );
  }
}
