"use client";

import { useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

const CAMERA_DISTANCE = 2.65;
/** Nudge model down in world space so cap sits upper-mid frame like reference. */
const MODEL_OFFSET_Y = -0.1;
/** Raise orbit focal point slightly above bbox centre so roots sit toward bottom of frame. */
const FOCAL_BIAS_Y = 0.05;

const VIEW_PRESET_OFFSETS: readonly (readonly [number, number, number])[] = [
  [0, 0, CAMERA_DISTANCE],
  [CAMERA_DISTANCE, 0, 0],
  [0, 0, -CAMERA_DISTANCE],
  [0.15, CAMERA_DISTANCE * 0.9, 0.15],
  [0.8, 0.15, 1.9],
  [1.9, 0.12, 1.4],
];
const STIPE_HEIGHT = 0.64;
const STIPE_RADIUS = 0.095;
const GILL_PLANE_Y = 0.62;
const ANNULUS_Y = 0.5;

const KEY_FEATURES = [
  { id: 1, title: "Pileus (Cap)", position: [0.42, 0.78, 0.02] as const },
  { id: 2, title: "Lamellae (Gills)", position: [0.38, 0.6, 0.08] as const },
  { id: 3, title: "Annulus (Ring)", position: [0.2, 0.5, 0.18] as const },
  { id: 4, title: "Stipe (Stem)", position: [0.14, 0.28, 0.14] as const },
  { id: 5, title: "Volva (Universal Veil Remnant)", position: [0.1, 0.06, 0.12] as const },
  { id: 6, title: "Mycelial Threads (Hyphae)", position: [0.22, -0.02, 0.2] as const },
] as const;

const CAP_RADIUS = 0.48;

const VIEW_PRESETS = [
  { id: "front", rotation: 0 },
  { id: "side", rotation: 90 },
  { id: "back", rotation: 180 },
  { id: "top", rotation: 0 },
  { id: "gills", rotation: 0 },
  { id: "low", rotation: 45 },
] as const;

type InteractionMode = "rotate" | "zoom";

type ClippedMaterialProps = {
  color: string;
  clippingPlanes: THREE.Plane[];
  roughness?: number;
  clearcoat?: number;
  side?: THREE.Side;
};

function ClippedMaterial({
  color,
  clippingPlanes,
  roughness = 0.72,
  clearcoat = 0.12,
  side = THREE.FrontSide,
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
    />
  );
}

function Lamellae({
  clippingPlanes,
  count = 48,
}: {
  clippingPlanes: THREE.Plane[];
  count?: number;
}) {
  return (
    <group position={[0, GILL_PLANE_Y, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const innerGap = 0.055;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * (innerGap + 0.14), 0, Math.sin(angle) * (innerGap + 0.14)]}
            rotation={[0, angle, Math.PI / 2]}
          >
            <boxGeometry args={[CAP_RADIUS * 1.55, 0.004, 0.088]} />
            <ClippedMaterial color="#6b3f2a" clippingPlanes={clippingPlanes} roughness={0.9} clearcoat={0} />
          </mesh>
        );
      })}
    </group>
  );
}

function MycelialThreads({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  const threads = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2 + 0.2;
        const length = 0.14 + (i % 3) * 0.04;
        return {
          angle,
          length,
          x: Math.cos(angle) * 0.08,
          z: Math.sin(angle) * 0.08,
        };
      }),
    [],
  );

  return (
    <group position={[0, -0.01, 0]}>
      {threads.map((thread, i) => (
        <mesh
          key={i}
          position={[thread.x, -thread.length / 2, thread.z]}
          rotation={[0.4, thread.angle, 0.25]}
        >
          <cylinderGeometry args={[0.003, 0.0015, thread.length, 6]} />
          <ClippedMaterial color="#e8e4dc" clippingPlanes={clippingPlanes} roughness={0.85} clearcoat={0} />
        </mesh>
      ))}
    </group>
  );
}

function MushroomEnvironment({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[0.75, 48]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} metalness={0} />
      </mesh>
      <MycelialThreads clippingPlanes={clippingPlanes} />
    </group>
  );
}

function MushroomFruitingBody({
  sectionOffset,
  showSection,
}: {
  sectionOffset: number;
  showSection: boolean;
}) {
  const clippingPlanes = useMemo(() => {
    if (!showSection) return [] as THREE.Plane[];
    return [new THREE.Plane(new THREE.Vector3(1, 0, 0), sectionOffset)];
  }, [sectionOffset, showSection]);

  const capProfile = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(CAP_RADIUS * 0.9, 0));
    points.push(new THREE.Vector2(CAP_RADIUS * 0.97, 0.035));
    points.push(new THREE.Vector2(CAP_RADIUS, 0.11));
    points.push(new THREE.Vector2(CAP_RADIUS * 0.95, 0.19));
    points.push(new THREE.Vector2(CAP_RADIUS * 0.62, 0.245));
    points.push(new THREE.Vector2(0, 0.245));
    return points;
  }, []);

  const capGeometry = useMemo(() => {
    const geo = new THREE.LatheGeometry(capProfile, 72);
    geo.computeVertexNormals();
    return geo;
  }, [capProfile]);

  return (
    <group>
      <MushroomEnvironment clippingPlanes={clippingPlanes} />

      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[STIPE_RADIUS * 1.75, STIPE_RADIUS * 2.1, 0.09, 20]} />
        <ClippedMaterial color="#6b5344" clippingPlanes={clippingPlanes} roughness={0.95} clearcoat={0} />
      </mesh>

      <mesh position={[0, 0.055, 0]}>
        <cylinderGeometry args={[STIPE_RADIUS * 1.45, STIPE_RADIUS * 1.1, 0.07, 18]} />
        <ClippedMaterial color="#9a7b5f" clippingPlanes={clippingPlanes} roughness={0.92} clearcoat={0} />
      </mesh>

      <mesh position={[0, STIPE_HEIGHT / 2 + 0.02, 0]}>
        <cylinderGeometry args={[STIPE_RADIUS, STIPE_RADIUS * 1.08, STIPE_HEIGHT, 28]} />
        <ClippedMaterial color="#ede8df" clippingPlanes={clippingPlanes} roughness={0.62} clearcoat={0.1} />
      </mesh>

      <mesh position={[0, STIPE_HEIGHT / 2 + 0.02, 0]}>
        <cylinderGeometry args={[STIPE_RADIUS * 0.7, STIPE_RADIUS * 0.76, STIPE_HEIGHT * 0.98, 22]} />
        <ClippedMaterial color="#f8f4ec" clippingPlanes={clippingPlanes} roughness={0.7} />
      </mesh>

      <mesh position={[0, ANNULUS_Y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[STIPE_RADIUS * 1.24, 0.013, 14, 32]} />
        <ClippedMaterial color="#f5f0e8" clippingPlanes={clippingPlanes} roughness={0.65} clearcoat={0.15} />
      </mesh>

      <mesh position={[0, ANNULUS_Y - 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[STIPE_RADIUS * 1.38, 0.007, 10, 28]} />
        <ClippedMaterial color="#ddd4c8" clippingPlanes={clippingPlanes} roughness={0.82} />
      </mesh>

      <Lamellae clippingPlanes={clippingPlanes} />

      <mesh position={[0, GILL_PLANE_Y + 0.032, 0]}>
        <cylinderGeometry args={[CAP_RADIUS * 0.86, CAP_RADIUS * 0.9, 0.065, 44]} />
        <ClippedMaterial color="#e5ddd0" clippingPlanes={clippingPlanes} roughness={0.76} />
      </mesh>

      <mesh position={[0, GILL_PLANE_Y + 0.068, 0]} geometry={capGeometry}>
        <ClippedMaterial color="#ddd2bc" clippingPlanes={clippingPlanes} roughness={0.48} clearcoat={0.28} />
      </mesh>

      {showSection && (
        <mesh position={[sectionOffset, STIPE_HEIGHT * 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[STIPE_HEIGHT * 1.35, CAP_RADIUS * 2.4]} />
          <meshBasicMaterial color="#c8bfb3" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function FeatureAnnotation({
  id,
  title,
  position,
  show,
}: {
  id: number;
  title: string;
  position: readonly [number, number, number];
  show: boolean;
}) {
  if (!show) return null;

  const lineEnd: [number, number, number] = [position[0] + 0.28, position[1], position[2]];

  return (
    <group>
      <Line points={[position, lineEnd]} color="#ffffff" lineWidth={1} transparent opacity={0.85} />
      <mesh position={position}>
        <sphereGeometry args={[0.012, 10, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Html position={lineEnd} center zIndexRange={[40, 0]} style={{ pointerEvents: "none" }}>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-lg">
            {id}
          </span>
          <span className="text-sm font-medium text-white drop-shadow-md">{title}</span>
        </div>
      </Html>
    </group>
  );
}

function SceneFraming({
  groupRef,
  controlsRef,
  presetIndex,
  frameKey,
}: {
  groupRef: RefObject<THREE.Group | null>;
  controlsRef: RefObject<OrbitControlsImpl | null>;
  presetIndex: number;
  frameKey: number;
}) {
  const { camera } = useThree();
  const focalPoint = useRef(new THREE.Vector3(0, 0.32, 0));

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    center.y += FOCAL_BIAS_Y;
    focalPoint.current.copy(center);

    const offset = VIEW_PRESET_OFFSETS[presetIndex] ?? VIEW_PRESET_OFFSETS[0]!;
    camera.position.set(
      center.x + offset[0],
      center.y + offset[1],
      center.z + offset[2],
    );
    camera.lookAt(center);

    if (controlsRef.current) {
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }
  }, [camera, controlsRef, frameKey, groupRef, presetIndex]);

  return null;
}

function Scene({
  sectionOffset,
  showSection,
  showAnnotations,
  presetIndex,
  frameKey,
  interactionMode,
  controlsRef,
  mushroomGroupRef,
}: {
  sectionOffset: number;
  showSection: boolean;
  showAnnotations: boolean;
  presetIndex: number;
  frameKey: number;
  interactionMode: InteractionMode;
  controlsRef: RefObject<OrbitControlsImpl | null>;
  mushroomGroupRef: RefObject<THREE.Group | null>;
}) {
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

      <group ref={mushroomGroupRef} position={[0, MODEL_OFFSET_Y, 0]}>
        <MushroomFruitingBody sectionOffset={sectionOffset} showSection={showSection} />
        {KEY_FEATURES.map((feature) => (
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
        groupRef={mushroomGroupRef}
        controlsRef={controlsRef}
        presetIndex={presetIndex}
        frameKey={frameKey}
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

function ToolbarIcon({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex flex-col items-center gap-1 px-3 py-2 text-xs transition ${
        active ? "text-emerald-400" : "text-zinc-400 hover:text-white"
      }`}
    >
      {children}
      <span className={active ? "border-b-2 border-emerald-400 pb-0.5" : ""}>{label}</span>
    </button>
  );
}

function ViewThumbnail({
  active,
  rotation,
  onClick,
}: {
  active: boolean;
  rotation: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-md border bg-zinc-900 transition ${
        active ? "border-emerald-500 ring-1 ring-emerald-500/50" : "border-zinc-700 hover:border-zinc-500"
      }`}
      aria-label="Change camera view"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 text-zinc-300"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <ellipse cx="16" cy="11" rx="9" ry="5" fill="currentColor" opacity="0.9" />
        <rect x="14" y="14" width="4" height="12" rx="1.5" fill="currentColor" opacity="0.85" />
        <ellipse cx="16" cy="27" rx="5" ry="2" fill="#6b5344" opacity="0.7" />
      </svg>
    </button>
  );
}

function RotateIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12a8 8 0 0 1 13.5-5.7M20 7V3m0 0h-4m4 0-2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12a8 8 0 0 1-13.5 5.7M4 17v4m0 0h4M4 21l2.5-2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l4 4" strokeLinecap="round" />
      <path d="M11 8v6M8 11h6" strokeLinecap="round" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12a8 8 0 0 1 14-5.5" strokeLinecap="round" />
      <path d="M18 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" strokeLinecap="round" />
    </svg>
  );
}

function CrossSectionIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" strokeLinecap="round" />
      <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" fillOpacity="0.25" stroke="none" />
    </svg>
  );
}

export function AgaricusBisporusViewer({
  compact = false,
  heightClass,
  showHeader = true,
}: {
  compact?: boolean;
  heightClass?: string;
  showHeader?: boolean;
}) {
  const [sectionT, setSectionT] = useState(0.55);
  const [showSection, setShowSection] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>("rotate");
  const [activePreset, setActivePreset] = useState(0);
  const [frameKey, setFrameKey] = useState(0);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const mushroomGroupRef = useRef<THREE.Group | null>(null);

  const height = heightClass ?? (compact ? "h-28" : "h-[34rem]");

  const sectionOffset = useMemo(() => {
    const t = sectionT;
    return -CAP_RADIUS * 1.1 + t * CAP_RADIUS * 2.2;
  }, [sectionT]);

  const resetView = () => {
    setActivePreset(0);
    setInteractionMode("rotate");
    setFrameKey((k) => k + 1);
    controlsRef.current?.reset();
  };

  const scene = (
    <Scene
      sectionOffset={sectionOffset}
      showSection={showSection}
      showAnnotations={showAnnotations && !compact}
      presetIndex={activePreset}
      frameKey={frameKey}
      interactionMode={interactionMode}
      controlsRef={controlsRef}
      mushroomGroupRef={mushroomGroupRef}
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
    <div className="relative w-full overflow-hidden rounded-xl bg-black text-white shadow-2xl">
      <div className={`relative ${height} w-full`}>
        <div className="absolute inset-0">{canvas}</div>

        {showHeader && (
          <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-xs">
            <p className="text-2xl font-bold italic tracking-tight text-white">Agaricus bisporus</p>
            <p className="text-sm text-zinc-300">(Button Mushroom)</p>
            <p className="mt-1 text-xs text-zinc-500">3D Structure</p>
          </div>
        )}

        {showInfo && (
          <div className="absolute right-5 top-5 z-10 w-64 rounded-xl border border-white/10 bg-zinc-900/80 p-4 backdrop-blur-md">
            <p className="text-sm leading-relaxed text-zinc-300">
              Interactive anatomical model of the button mushroom — the most widely cultivated
              basidiomycete for food and meat-analog applications.
            </p>
            <p className="mt-4 text-sm font-semibold text-emerald-400">Key Features</p>
            <ol className="mt-2 space-y-1.5">
              {KEY_FEATURES.map((feature) => (
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
  );
}
