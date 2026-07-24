"use client";

import dynamic from "next/dynamic";
import type { InteractiveMorphologyViewerProps } from "@/components/morphology-viewer/InteractiveMorphologyViewer";

const InteractiveMorphologyViewer = dynamic(
  () =>
    import("@/components/morphology-viewer/InteractiveMorphologyViewer").then(
      (m) => m.InteractiveMorphologyViewer,
    ),
  { ssr: false, loading: () => <div className="h-[34rem] animate-pulse rounded-xl bg-zinc-900" /> },
);

export function InteractiveMorphologyViewerLazy(props: InteractiveMorphologyViewerProps) {
  return <InteractiveMorphologyViewer {...props} />;
}
