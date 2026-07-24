"use client";

import dynamic from "next/dynamic";
import type { MorphologyParameters } from "@/lib/types";

const MorphologyViewer = dynamic(
  () =>
    import("@/components/morphology-viewer/MorphologyViewer").then(
      (m) => m.MorphologyViewer,
    ),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-lg bg-zinc-100" /> },
);

type MorphologyPreviewProps = {
  parameters: MorphologyParameters;
  referenceImageUrl?: string | null;
  referenceCaption?: string | null;
  referenceAlt?: string;
  compact?: boolean;
  heightClass?: string;
  showCaption?: boolean;
};

export function MorphologyPreview({
  parameters,
  referenceImageUrl,
  compact = false,
  heightClass,
  showCaption = true,
}: MorphologyPreviewProps) {
  return (
    <MorphologyViewer
      parameters={parameters}
      referenceTextureUrl={referenceImageUrl}
      compact={compact}
      heightClass={heightClass}
      showCaption={showCaption}
    />
  );
}
