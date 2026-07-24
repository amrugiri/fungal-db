import * as THREE from "three";

type ClippedMaterialProps = {
  color: string;
  clippingPlanes: THREE.Plane[];
  roughness?: number;
  clearcoat?: number;
  side?: THREE.Side;
  transparent?: boolean;
  opacity?: number;
};

export function ClippedMaterial({
  color,
  clippingPlanes,
  roughness = 0.72,
  clearcoat = 0.12,
  side = THREE.FrontSide,
  transparent,
  opacity,
}: ClippedMaterialProps) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      metalness={0.03}
      clearcoat={clearcoat}
      clearcoatRoughness={0.32}
      clippingPlanes={clippingPlanes}
      clipIntersection
      clipShadows
      side={side}
      transparent={transparent}
      opacity={opacity}
    />
  );
}

export function BodyMaterial({
  color,
  clippingPlanes = [],
  roughness = 0.78,
  metalness = 0.02,
  transparent,
  opacity,
}: {
  color: string;
  clippingPlanes?: THREE.Plane[];
  roughness?: number;
  metalness?: number;
  transparent?: boolean;
  opacity?: number;
}) {
  if (clippingPlanes.length > 0) {
    return (
      <ClippedMaterial
        color={color}
        clippingPlanes={clippingPlanes}
        roughness={roughness}
        clearcoat={0.08}
        transparent={transparent}
        opacity={opacity}
      />
    );
  }

  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      transparent={transparent}
      opacity={opacity}
    />
  );
}
