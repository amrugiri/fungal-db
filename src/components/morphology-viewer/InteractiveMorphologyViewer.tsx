"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import type { MorphologyParameters } from "@/lib/types";
import {
  getSpeciesMorphologyConfig,
  type MorphologyFeature,
} from "@/lib/species-morphology-config";
import {
  AnatomicalBody,
  sectionOffsetFromT,
} from "@/components/morphology-viewer/anatomical/AnatomicalBody";
import { FeatureAnnotation } from "@/components/morphology-viewer/anatomical/FeatureAnnotation";
import {
  CAMERA_DISTANCE,
  MODEL_OFFSET_Y,
  SceneFraming,
} from "@/components/morphology-viewer/anatomical/SceneFraming";
import {
  CrossSectionIcon,
  InfoIcon,
  ResetIcon,
  RotateIcon,
  ToolbarIcon,
  ViewThumbnail,
  VIEW_PRESETS,
  ZoomIcon,
  type InteractionMode,
} from "@/components/morphology-viewer/anatomical/ViewerToolbar";
import { ViewerErrorBoundary } from "@/components/morphology-viewer/ViewerErrorBoundary";

function AnatomicalScene({
  slug,
  parameters,
  referenceTextureUrl,
  features,
  detailedGilledModel,
  sectionOffset,
  showSection,
  showAnnotations,
  presetIndex,
  frameKey,
  interactionMode,
  controlsRef,
  bodyGroupRef,
}: {
  slug: string;
  parameters: MorphologyParameters;
  referenceTextureUrl?: string | null;
  features: MorphologyFeature[];
  detailedGilledModel?: boolean;
  sectionOffset: number;
  showSection: boolean;
  showAnnotations: boolean;
  presetIndex: number;
  frameKey: number;
  interactionMode: InteractionMode;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  bodyGroupRef: React.RefObject<THREE.Group | null>;
}) {
  const config = useMemo(
    () => ({ ...getSpeciesMorphologyConfig(slug, parameters), detailedGilledModel }),
    [slug, parameters, detailedGilledModel],
  );

  const isMicroscopy = parameters.visualizationStyle === "microscopy";
  const focalY = isMicroscopy ? 0.1 : 0.32;

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 4, 9]} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[3, 6, 4]} intensity={1.4} color="#fff8f0" />
      <directionalLight position={[-4, 3, -2]} intensity={0.35} color="#c8d8ff" />
      <spotLight position={[0, 3, 2]} intensity={0.55} angle={0.45} penumbra={0.6} color="#ffffff" />
      <pointLight position={[1.5, 0.5, 2]} intensity={0.25} color="#ffe8d0" />
      <hemisphereLight args={["#f5f0ea", "#1a1410", 0.35]} />

      <group ref={bodyGroupRef} position={[0, MODEL_OFFSET_Y, 0]}>
        <AnatomicalBody
          slug={slug}
          parameters={parameters}
          referenceTextureUrl={referenceTextureUrl}
          config={config}
          sectionOffset={sectionOffset}
          showSection={showSection}
        />
        {features.map((feature) => (
          <FeatureAnnotation
            key={feature.id}
            id={feature.id}
            title={feature.title}
            position={feature.position}
            show={showAnnotations}
          />
        ))}
      </group>

      <SceneFraming
        groupRef={bodyGroupRef}
        controlsRef={controlsRef}
        presetIndex={presetIndex}
        frameKey={frameKey}
        focalY={focalY}
      />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableRotate={interactionMode === "rotate"}
        enableZoom
        minDistance={1.4}
        maxDistance={4.8}
      />
    </>
  );
}

export type InteractiveMorphologyViewerProps = {
  slug: string;
  scientificName: string;
  commonNames?: string[];
  parameters: MorphologyParameters;
  referenceTextureUrl?: string | null;
  compact?: boolean;
  heightClass?: string;
  showHeader?: boolean;
};

export function InteractiveMorphologyViewer({
  slug,
  scientificName,
  commonNames = [],
  parameters,
  referenceTextureUrl,
  compact = false,
  heightClass,
  showHeader = true,
}: InteractiveMorphologyViewerProps) {
  const morphologyConfig = getSpeciesMorphologyConfig(slug, parameters);
  const [sectionT, setSectionT] = useState(0.55);
  const [showSection, setShowSection] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>("rotate");
  const [activePreset, setActivePreset] = useState(0);
  const [frameKey, setFrameKey] = useState(0);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const bodyGroupRef = useRef<THREE.Group | null>(null);

  const height = heightClass ?? (compact ? "h-28" : "h-[34rem]");
  const commonNameLabel = commonNames[0] ? `(${commonNames[0]})` : "";

  const sectionOffset = useMemo(
    () => sectionOffsetFromT(sectionT, parameters, morphologyConfig),
    [sectionT, parameters, morphologyConfig],
  );

  const resetView = () => {
    setActivePreset(0);
    setInteractionMode("rotate");
    setFrameKey((k) => k + 1);
    controlsRef.current?.reset();
  };

  const scene = (
    <AnatomicalScene
      slug={slug}
      parameters={parameters}
      referenceTextureUrl={referenceTextureUrl}
      features={morphologyConfig.features}
      detailedGilledModel={morphologyConfig.detailedGilledModel}
      sectionOffset={sectionOffset}
      showSection={showSection}
      showAnnotations={showAnnotations && !compact}
      presetIndex={activePreset}
      frameKey={frameKey}
      interactionMode={interactionMode}
      controlsRef={controlsRef}
      bodyGroupRef={bodyGroupRef}
    />
  );

  const canvas = (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0.32, CAMERA_DISTANCE], fov: 36 }}
      gl={{ localClippingEnabled: true, antialias: true }}
      style={{ display: "block" }}
    >
      {scene}
    </Canvas>
  );

  if (compact) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-full border-2 border-zinc-800 bg-black ${height} aspect-square`}
      >
        {canvas}
      </div>
    );
  }

  return (
    <ViewerErrorBoundary>
      <div className="relative w-full overflow-hidden rounded-xl bg-black text-white shadow-2xl">
      <div className={`relative ${height} w-full`}>
        <div className="absolute inset-0">{canvas}</div>

        {showHeader && (
          <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-xs">
            <p className="text-2xl font-bold italic tracking-tight text-white">{scientificName}</p>
            {commonNameLabel && <p className="text-sm text-zinc-300">{commonNameLabel}</p>}
            <p className="mt-1 text-xs text-zinc-500">3D Structure</p>
          </div>
        )}

        {showInfo && (
          <div className="absolute right-5 top-5 z-10 w-64 rounded-xl border border-white/10 bg-zinc-900/80 p-4 backdrop-blur-md">
            <p className="text-sm leading-relaxed text-zinc-300">{morphologyConfig.description}</p>
            <p className="mt-4 text-sm font-semibold text-emerald-400">Key Features</p>
            <ol className="mt-2 space-y-1.5">
              {morphologyConfig.features.map((feature) => (
                <li key={feature.id} className="flex items-start gap-2 text-sm text-zinc-200">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                    {feature.id}
                  </span>
                  <span>{feature.title}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-zinc-500">Drag to rotate · Scroll to zoom</p>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800 bg-zinc-950/95 px-4 py-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <ToolbarIcon
              label="Rotate"
              active={interactionMode === "rotate"}
              onClick={() => setInteractionMode("rotate")}
            >
              <RotateIcon />
            </ToolbarIcon>
            <ToolbarIcon
              label="Zoom"
              active={interactionMode === "zoom"}
              onClick={() => setInteractionMode("zoom")}
            >
              <ZoomIcon />
            </ToolbarIcon>
            <ToolbarIcon label="Reset" onClick={resetView}>
              <ResetIcon />
            </ToolbarIcon>
          </div>

          <div className="flex items-center gap-2">
            {VIEW_PRESETS.map((preset, index) => (
              <ViewThumbnail
                key={preset.id}
                active={activePreset === index}
                rotation={preset.rotation}
                onClick={() => {
                  setActivePreset(index);
                  setFrameKey((k) => k + 1);
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <ToolbarIcon label="Info" active={showInfo} onClick={() => setShowInfo((v) => !v)}>
              <InfoIcon />
            </ToolbarIcon>
            <ToolbarIcon
              label="Cross Section"
              active={showSection}
              onClick={() => {
                setShowSection((prev) => {
                  const next = !prev;
                  setShowAnnotations(!next);
                  return next;
                });
              }}
            >
              <CrossSectionIcon />
            </ToolbarIcon>
          </div>
        </div>

        {showSection && (
          <div className="mt-3 border-t border-zinc-800 pt-3">
            <label className="mb-1 block text-xs text-zinc-400">Section position (sagittal plane)</label>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(sectionT * 100)}
              onChange={(e) => setSectionT(Number(e.target.value) / 100)}
              className="w-full accent-emerald-500"
            />
          </div>
        )}
      </div>
      </div>
    </ViewerErrorBoundary>
  );
}
