"use client";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { MorphologyParameters } from "@/lib/types";
import type { MorphologyReferenceAssets } from "@/lib/species-morphology-assets";
import { BodyMaterial, ClippedMaterial } from "@/components/morphology-viewer/anatomical/ClippedMaterial";

type ReferenceMorelProps = {
  params: MorphologyParameters;
  assets: MorphologyReferenceAssets;
  clippingPlanes?: THREE.Plane[];
  sectionOffset?: number;
  showSection?: boolean;
};

function useMorelTextures(assets: MorphologyReferenceAssets) {
  const [exterior, crossSection] = useTexture([
    assets.exteriorImageUrl,
    assets.crossSectionImageUrl,
  ]);
  exterior.colorSpace = THREE.SRGBColorSpace;
  crossSection.colorSpace = THREE.SRGBColorSpace;
  return { exterior, crossSection };
}

/**
 * Image-guided morel viewer: exterior 3D render + cross-section reference
 * on interactive planes, with a hollow cream stipe for depth.
 */
export function ReferenceMorelAnatomy({
  params,
  clippingPlanes = [],
  sectionOffset = 0,
  showSection = false,
  assets,
}: ReferenceMorelProps) {
  const capScale = params.capDiameter / 10;
  const stipeScale = Math.max(params.stipeLength, 5) / 10;
  const { exterior, crossSection } = useMorelTextures(assets);

  const stipeBaseY = stipeScale * 0.22;
  const capCenterY = stipeBaseY + capScale * 0.42;
  const stipeRadius = 0.05 * capScale;

  return (
    <group>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 28]} />
        <meshStandardMaterial color="#f5f3ef" roughness={1} />
      </mesh>

      <mesh position={[0, stipeBaseY, 0]} scale={[stipeRadius, stipeScale * 0.62, stipeRadius]}>
        <cylinderGeometry args={[1, 1.1, 1, 20]} />
        <BodyMaterial color="#f4efe4" clippingPlanes={clippingPlanes} roughness={0.82} />
      </mesh>

      <mesh position={[0, stipeBaseY, 0]} scale={[stipeRadius * 0.65, stipeScale * 0.58, stipeRadius * 0.65]}>
        <cylinderGeometry args={[1, 1, 1, 16]} />
        <ClippedMaterial
          color="#faf8f4"
          clippingPlanes={clippingPlanes}
          roughness={0.9}
          clearcoat={0}
          side={THREE.BackSide}
        />
      </mesh>

      {!showSection && (
        <mesh position={[0, capCenterY, 0]}>
          <planeGeometry args={[capScale * 0.62, capScale * 0.82]} />
          <meshBasicMaterial map={exterior} transparent toneMapped={false} />
        </mesh>
      )}

      {showSection && (
        <mesh position={[0, capCenterY * 0.95, 0]}>
          <planeGeometry args={[capScale * 1.05, capScale * 0.82]} />
          <meshBasicMaterial map={crossSection} transparent toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
