"use client";

import dynamic from "next/dynamic";
import type { MorphologyParameters } from "@/lib/types";

const InteractiveMorphologyViewer = dynamic(
  () =>
    import("@/components/morphology-viewer/InteractiveMorphologyViewer").then(
      (m) => m.InteractiveMorphologyViewer,
    ),
  { ssr: false, loading: () => <div className="h-[34rem] animate-pulse rounded-xl bg-zinc-900" /> },
);

/** @deprecated Use InteractiveMorphologyViewerLazy with slug and parameters instead. */
export function AgaricusBisporusViewerLazy({
  compact,
  heightClass,
  showHeader,
}: {
  compact?: boolean;
  heightClass?: string;
  showHeader?: boolean;
}) {
  const parameters: MorphologyParameters = {
    visualizationStyle: "macroscopic",
    hyphaeBranchAngle: 45,
    hyphaeThickness: 0.02,
    hyphaeColor: "#e8dcc8",
    hyphaeDensity: 8,
    fruitingBodyType: "mushroom",
    capDiameter: 7,
    stipeLength: 5,
    capColor: "#e8e0d4",
    showMycelium: false,
    showFruitingBody: true,
  };

  return (
    <InteractiveMorphologyViewer
      slug="agaricus-bisporus"
      scientificName="Agaricus bisporus"
      commonNames={["button mushroom", "portobello", "cremini"]}
      parameters={parameters}
      compact={compact}
      heightClass={heightClass}
      showHeader={showHeader}
    />
  );
}
