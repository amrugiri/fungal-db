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
  SECTION_VIEW_OFFSET,
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
import {
  getSpeciesMorphologyModel,
  PROVENANCE_LABELS,
} from "@/lib/species-morphology-models";

function hexLuminance(hex: string): number {
  const c = hex.replace("#", "");
  if (c.length !== 6) return 1;
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

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
  viewOffset,
  interactionMode,
  controlsRef,
  bodyGroupRef,
  lightBackground,
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
  viewOffset: readonly [number, number, number] | null;
  interactionMode: InteractionMode;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  bodyGroupRef: React.RefObject<THREE.Group | null>;
  lightBackground: boolean;
}) {
  const config = useMemo(
    () => ({ ...getSpeciesMorphologyConfig(slug, parameters), detailedGilledModel }),
    [slug, parameters, detailedGilledModel],
  );

  const isMicroscopy = parameters.visualizationStyle === "microscopy";
  const focalY = isMicroscopy ? 0.1 : 0.32;
  const bg = lightBackground ? "#ffffff" : "#050505";
  const fogFar = lightBackground ? 14 : 9;

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, lightBackground ? 10 : 4, fogFar]} />
      <ambientLight intensity={lightBackground ? 0.72 : 0.28} />
      <directionalLight
        position={[2.8, 5.5, 3.2]}
        intensity={lightBackground ? 0.95 : 1.4}
        color="#fffaf3"
      />
      <directionalLight
        position={[-3.5, 2.5, -1.5]}
        intensity={lightBackground ? 0.35 : 0.35}
        color="#e8eef8"
      />
      <spotLight position={[0, 4, 1.5]} intensity={0.4} angle={0.5} penumbra={0.75} color="#ffffff" />
      <hemisphereLight
        args={[lightBackground ? "#ffffff" : "#f5f0ea", lightBackground ? "#e8e4dc" : "#1a1410", lightBackground ? 0.7 : 0.35]}
      />

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
        offsetOverride={viewOffset}
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
  const glbModel = getSpeciesMorphologyModel(slug);
  const [sectionT, setSectionT] = useState(0.55);
  const [showSection, setShowSection] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>("rotate");
  const [activePreset, setActivePreset] = useState(0);
  const [frameKey, setFrameKey] = useState(0);
  // Non-null only while we are holding the camera on the cut face; any preset
  // click clears it and hands control back to the thumbnails.
  const [viewOffset, setViewOffset] = useState<readonly [number, number, number] | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const bodyGroupRef = useRef<THREE.Group | null>(null);

  const height = heightClass ?? (compact ? "h-28" : "h-[34rem]");
  const commonNameLabel = commonNames[0] ? `(${commonNames[0]})` : "";
  const lightBackground = hexLuminance(parameters.capColor) < 0.42;

  const sectionOffset = useMemo(
    () => sectionOffsetFromT(sectionT, slug, parameters, morphologyConfig),
    [sectionT, slug, parameters, morphologyConfig],
  );

  const resetView = () => {
    setActivePreset(0);
    setInteractionMode("rotate");
    setViewOffset(null);
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
      viewOffset={viewOffset}
      interactionMode={interactionMode}
      controlsRef={controlsRef}
      bodyGroupRef={bodyGroupRef}
      lightBackground={lightBackground}
    />
  );

  const canvas = (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0.32, CAMERA_DISTANCE], fov: 36 }}
      // stencil: the cross-section's filled cut faces are stencil-masked.
      gl={{ localClippingEnabled: true, antialias: true, stencil: true }}
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
      <div
        className={`relative w-full overflow-hidden rounded-xl shadow-2xl ${
          lightBackground ? "bg-white text-black" : "bg-black text-white"
        }`}
      >
      <div className={`relative ${height} w-full`}>
        <div className="absolute inset-0">{canvas}</div>

        {showHeader && (
          <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-xs">
            <p
              className={`text-2xl font-bold italic tracking-tight ${
                lightBackground ? "text-black" : "text-white"
              }`}
            >
              {scientificName}
            </p>
            {commonNameLabel && (
              <p className={`text-sm ${lightBackground ? "text-zinc-600" : "text-zinc-300"}`}>
                {commonNameLabel}
              </p>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-xs text-zinc-500">3D Structure</p>
              {glbModel && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    glbModel.provenance === "photogrammetry"
                      ? "bg-emerald-500/15 text-emerald-600"
                      : glbModel.provenance === "literature-modelled"
                        ? "bg-sky-500/15 text-sky-600"
                        : "bg-amber-500/15 text-amber-600"
                  }`}
                >
                  {PROVENANCE_LABELS[glbModel.provenance]}
                </span>
              )}
            </div>
          </div>
        )}

        {showInfo && (
          <div
            className={`absolute right-5 top-5 z-10 w-64 rounded-xl border p-4 backdrop-blur-md ${
              lightBackground
                ? "border-zinc-200 bg-white/90"
                : "border-white/10 bg-zinc-900/80"
            }`}
          >
            <p
              className={`text-sm leading-relaxed ${
                lightBackground ? "text-zinc-700" : "text-zinc-300"
              }`}
            >
              {morphologyConfig.description}
            </p>
            <p className="mt-4 text-sm font-semibold text-emerald-600">Key Features</p>
            <ol className="mt-2 space-y-1.5">
              {morphologyConfig.features.map((feature) => (
                <li
                  key={feature.id}
                  className={`flex items-start gap-2 text-sm ${
                    lightBackground ? "text-zinc-800" : "text-zinc-200"
                  }`}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                    {feature.id}
                  </span>
                  <span>{feature.title}</span>
                </li>
              ))}
            </ol>
            {glbModel && (
              <>
                <p className="mt-4 text-sm font-semibold text-emerald-600">Model Source</p>
                <p
                  className={`mt-1 text-xs leading-relaxed ${
                    lightBackground ? "text-zinc-600" : "text-zinc-400"
                  }`}
                >
                  {glbModel.sourceNote}
                </p>
              </>
            )}
            <p className={`mt-4 text-xs ${lightBackground ? "text-zinc-500" : "text-zinc-500"}`}>
              Drag to rotate · Scroll to zoom
            </p>
          </div>
        )}
      </div>

      <div
        className={`border-t px-4 py-2 ${
          lightBackground ? "border-zinc-200 bg-zinc-50" : "border-zinc-800 bg-zinc-950/95"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <ToolbarIcon
              label="Rotate"
              active={interactionMode === "rotate"}
              onClick={() => setInteractionMode("rotate")}
              light={lightBackground}
            >
              <RotateIcon />
            </ToolbarIcon>
            <ToolbarIcon
              label="Zoom"
              active={interactionMode === "zoom"}
              onClick={() => setInteractionMode("zoom")}
              light={lightBackground}
            >
              <ZoomIcon />
            </ToolbarIcon>
            <ToolbarIcon label="Reset" onClick={resetView} light={lightBackground}>
              <ResetIcon />
            </ToolbarIcon>
          </div>

          <div className="flex items-center gap-2">
            {VIEW_PRESETS.map((preset, index) => (
              <ViewThumbnail
                key={preset.id}
                active={activePreset === index}
                rotation={preset.rotation}
                light={lightBackground}
                onClick={() => {
                  setActivePreset(index);
                  setViewOffset(null);
                  setFrameKey((k) => k + 1);
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <ToolbarIcon
              label="Info"
              active={showInfo}
              onClick={() => setShowInfo((v) => !v)}
              light={lightBackground}
            >
              <InfoIcon />
            </ToolbarIcon>
            <ToolbarIcon
              label="Cross Section"
              active={showSection}
              light={lightBackground}
              onClick={() => {
                setShowSection((prev) => {
                  const next = !prev;
                  setShowAnnotations(!next);
                  // Swing round to face the cut, otherwise the section opens
                  // on the far side of the model and looks like a no-op.
                  setViewOffset(next ? SECTION_VIEW_OFFSET : null);
                  setFrameKey((k) => k + 1);
                  return next;
                });
              }}
            >
              <CrossSectionIcon />
            </ToolbarIcon>
          </div>
        </div>

        {showSection && (
          <div
            className={`mt-3 border-t pt-3 ${
              lightBackground ? "border-zinc-200" : "border-zinc-800"
            }`}
          >
            <label
              className={`mb-1 block text-xs ${
                lightBackground ? "text-zinc-600" : "text-zinc-400"
              }`}
            >
              Section position (sagittal plane)
            </label>
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
