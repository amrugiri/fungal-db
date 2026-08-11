"use client";

import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

export const CAMERA_DISTANCE = 2.65;
export const MODEL_OFFSET_Y = -0.1;
export const FOCAL_BIAS_Y = 0.05;

export const VIEW_PRESET_OFFSETS: readonly (readonly [number, number, number])[] = [
  [0, 0, CAMERA_DISTANCE],
  [CAMERA_DISTANCE, 0, 0],
  [0, 0, -CAMERA_DISTANCE],
  [0.15, CAMERA_DISTANCE * 0.9, 0.15],
  [0.8, 0.15, 1.9],
  [1.9, 0.12, 1.4],
];

/**
 * Three-quarter view from -x. The sagittal clipping plane keeps the +x half, so
 * the cut face points -x: from any of the presets above it is edge-on or hidden
 * behind the model, and enabling the cross-section looks like it did nothing.
 */
export const SECTION_VIEW_OFFSET: readonly [number, number, number] = [
  -CAMERA_DISTANCE * 0.72,
  CAMERA_DISTANCE * 0.28,
  CAMERA_DISTANCE * 0.63,
];

export function SceneFraming({
  groupRef,
  controlsRef,
  presetIndex,
  frameKey,
  focalY = 0.32,
  offsetOverride = null,
}: {
  groupRef: RefObject<THREE.Group | null>;
  controlsRef: RefObject<OrbitControlsImpl | null>;
  presetIndex: number;
  frameKey: number;
  focalY?: number;
  /** Wins over the preset when set — used to face the cross-section. */
  offsetOverride?: readonly [number, number, number] | null;
}) {
  const { camera } = useThree();
  const focalPoint = useRef(new THREE.Vector3(0, focalY, 0));
  /** Diagonal of the box we last framed on, so we can notice it growing. */
  const framedSize = useRef(-1);
  /** Frames since the box last changed; caps the cost of re-measuring. */
  const settled = useRef(0);

  const measure = useCallback(() => {
    const group = groupRef.current;
    if (!group) return null;
    // Measure the specimen only. Annotation markers and the cross-section fill
    // quad are viewing aids: letting them into the box pulls the framing centre
    // off the specimen, and the markers alone make the box non-empty before the
    // mesh has loaded, which defeats the load-retry below.
    const box = new THREE.Box3();
    const b = new THREE.Box3();
    group.updateWorldMatrix(true, true);
    group.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || mesh.userData.noFrame) return;
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      b.copy(mesh.geometry.boundingBox!).applyMatrix4(mesh.matrixWorld);
      box.union(b);
    });
    return box.isEmpty() ? null : box;
  }, [groupRef]);

  const frame = useCallback(() => {
    const box = measure();
    if (!box) return false;

    const center = new THREE.Vector3();
    box.getCenter(center);
    center.y += FOCAL_BIAS_Y;
    focalPoint.current.copy(center);

    const offset =
      offsetOverride ?? VIEW_PRESET_OFFSETS[presetIndex] ?? VIEW_PRESET_OFFSETS[0]!;
    camera.position.set(center.x + offset[0], center.y + offset[1], center.z + offset[2]);
    camera.lookAt(center);

    if (controlsRef.current) {
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }
    framedSize.current = box.getSize(new THREE.Vector3()).length();
    return true;
  }, [camera, controlsRef, measure, presetIndex, offsetOverride]);

  useLayoutEffect(() => {
    framedSize.current = -1;
    settled.current = 0;
    frame();
  }, [frame, focalY, frameKey]);

  // Mesh-backed species load their .glb through Suspense, so the first layout
  // pass sees only the annotation markers -- a box that is not empty but is
  // nothing like the model's. Framing on it leaves tall species (a shaggy ink
  // cap, a king oyster) hanging out of the top of the frame. Watch for the box
  // changing and re-frame, then stop measuring once it holds still.
  useFrame(() => {
    if (settled.current > 20) return;
    const box = measure();
    if (!box) return;
    const size = box.getSize(new THREE.Vector3()).length();
    if (Math.abs(size - framedSize.current) > Math.max(size, 1e-6) * 0.02) {
      frame();
      settled.current = 0;
    } else {
      settled.current += 1;
    }
  });

  return null;
}
