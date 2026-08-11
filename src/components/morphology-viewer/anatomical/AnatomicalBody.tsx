"use client";

import { Suspense, useMemo, type RefObject } from "react";
import { Center } from "@react-three/drei";
import * as THREE from "three";
import type { MorphologyParameters } from "@/lib/types";
import type { SpeciesMorphologyConfig } from "@/lib/species-morphology-config";
import {
  GilledMushroomAnatomy,
  GILLED_SECTION_RANGE,
} from "@/components/morphology-viewer/anatomical/GilledMushroomAnatomy";
import {
  MicroscopyAnatomy,
  MICROSCOPY_SECTION_RANGE,
} from "@/components/morphology-viewer/anatomical/MicroscopyAnatomy";
import { AnatomicalFruitingBody } from "@/components/morphology-viewer/anatomical/AnatomicalFruitingBodies";
import {
  GlbAnatomy,
  glbSectionRange,
} from "@/components/morphology-viewer/anatomical/GlbAnatomy";
import { getMorphologyReferenceAssets } from "@/lib/species-morphology-assets";
import { getSpeciesMorphologyModel } from "@/lib/species-morphology-models";

export function getSectionRange(
  slug: string,
  parameters: MorphologyParameters,
  config: SpeciesMorphologyConfig,
): number {
  const model = getSpeciesMorphologyModel(slug);
  if (model) return glbSectionRange(model);
  if (parameters.visualizationStyle === "microscopy") return MICROSCOPY_SECTION_RANGE;
  if (config.detailedGilledModel) return GILLED_SECTION_RANGE;
  return 1.4;
}

export function AnatomicalBody({
  slug,
  parameters,
  referenceTextureUrl,
  config,
  sectionOffset,
  showSection,
}: {
  slug: string;
  parameters: MorphologyParameters;
  referenceTextureUrl?: string | null;
  config: SpeciesMorphologyConfig;
  sectionOffset: number;
  showSection: boolean;
}) {
  const clippingPlanes = useMemo(() => {
    if (!showSection) return [] as THREE.Plane[];
    return [new THREE.Plane(new THREE.Vector3(1, 0, 0), sectionOffset)];
  }, [sectionOffset, showSection]);

  const isMicroscopy = parameters.visualizationStyle === "microscopy";
  const hasReferenceAssets = getMorphologyReferenceAssets(slug) != null;
  const glbModel = getSpeciesMorphologyModel(slug);

  // A real mesh always wins over the parametric primitives and the reference
  // image planes — those exist only for species that don't have one yet.
  if (glbModel) {
    return (
      <Suspense fallback={null}>
        <GlbAnatomy
          model={glbModel}
          clippingPlanes={clippingPlanes}
          showSection={showSection}
        />
      </Suspense>
    );
  }

  if (isMicroscopy) {
    return (
      <MicroscopyAnatomy params={parameters} sectionOffset={sectionOffset} showSection={showSection} />
    );
  }

  if (config.detailedGilledModel) {
    return (
      <GilledMushroomAnatomy
        sectionOffset={sectionOffset}
        showSection={showSection}
        capColor={parameters.capColor}
        showAnnulus={!["volvariella-volvacea", "coprinus-comatus", "lentinula-edodes"].includes(slug)}
        showVolva={slug === "volvariella-volvacea" || slug === "agaricus-bisporus"}
      />
    );
  }

  return (
    <Suspense fallback={null}>
      <Center>
        <AnatomicalFruitingBody
          slug={slug}
          params={parameters}
          clippingPlanes={clippingPlanes}
          sectionOffset={sectionOffset}
          showSection={showSection}
        />
      </Center>
      {showSection && !hasReferenceAssets && (
        <mesh position={[sectionOffset, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[1.6, 1.6]} />
          <meshBasicMaterial color="#c8bfb3" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      )}
    </Suspense>
  );
}

export function getDefaultSectionOffset(
  slug: string,
  parameters: MorphologyParameters,
  config: SpeciesMorphologyConfig,
): number {
  const range = getSectionRange(slug, parameters, config);
  return showSectionMidpoint(range);
}

function showSectionMidpoint(range: number): number {
  return -range * 0.5 + range * 0.55;
}

/** Compute section slider offset from 0–1 position. */
export function sectionOffsetFromT(
  t: number,
  slug: string,
  parameters: MorphologyParameters,
  config: SpeciesMorphologyConfig,
): number {
  const range = getSectionRange(slug, parameters, config);
  return -range * 0.5 + t * range;
}

export type AnatomicalSceneRefs = {
  bodyGroupRef: RefObject<THREE.Group | null>;
};
