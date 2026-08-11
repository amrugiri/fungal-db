"use client";

import { useTexture } from "@react-three/drei";
import type { MorphologyParameters } from "@/lib/types";
import type { MorphologyReferenceAssets } from "@/lib/species-morphology-assets";

type ReferenceImageAnatomyProps = {
  params: MorphologyParameters;
  assets: MorphologyReferenceAssets;
  showSection?: boolean;
};

/**
 * Image-guided morphology panel: exterior render by default,
 * swaps to cross-section when the viewer section toggle is on.
 */
export function ReferenceImageAnatomy({
  params,
  assets,
  showSection = false,
}: ReferenceImageAnatomyProps) {
  const capScale = Math.max(params.capDiameter / 10, 0.45);
  const [exterior, crossSection] = useTexture([
    assets.exteriorImageUrl,
    assets.crossSectionImageUrl,
  ]);
  exterior.colorSpace = "srgb";
  crossSection.colorSpace = "srgb";

  const width = capScale * 1.15;
  const height = capScale * 0.95;

  return (
    <group>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.28, 28]} />
        <meshStandardMaterial color="#eceae6" roughness={1} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={showSection ? crossSection : exterior}
          transparent
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
