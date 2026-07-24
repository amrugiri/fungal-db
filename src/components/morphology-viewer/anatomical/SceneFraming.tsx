"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
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

export function SceneFraming({
  groupRef,
  controlsRef,
  presetIndex,
  frameKey,
  focalY = 0.32,
}: {
  groupRef: RefObject<THREE.Group | null>;
  controlsRef: RefObject<OrbitControlsImpl | null>;
  presetIndex: number;
  frameKey: number;
  focalY?: number;
}) {
  const { camera } = useThree();
  const focalPoint = useRef(new THREE.Vector3(0, focalY, 0));

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    center.y += FOCAL_BIAS_Y;
    focalPoint.current.copy(center);

    const offset = VIEW_PRESET_OFFSETS[presetIndex] ?? VIEW_PRESET_OFFSETS[0]!;
    camera.position.set(center.x + offset[0], center.y + offset[1], center.z + offset[2]);
    camera.lookAt(center);

    if (controlsRef.current) {
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }
  }, [camera, controlsRef, focalY, frameKey, groupRef, presetIndex]);

  return null;
}
