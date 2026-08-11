"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Capped clipping — the trick that makes a sliced mesh look like cut flesh
 * instead of a hollow shell.
 *
 * A clipping plane only discards fragments; it never creates the surface where
 * the cut happened, so a hollow model reads as an empty shell. The fix (the
 * standard three.js `webgl_clipping_stencil` technique) is a two-pass stencil:
 *
 *  1. Re-render the solid geometry twice with no colour and no depth test —
 *     back faces incrementing the stencil buffer, front faces decrementing it.
 *     Along any view ray the counts cancel except where the ray is genuinely
 *     inside solid material beyond the cut, which lands on a non-zero value.
 *  2. Draw a flesh-coloured quad on the plane, masked to stencil != 0. It fills
 *     exactly the cut cross-section and nothing else.
 *
 * Counting only works on *closed* geometry. Open surfaces (the zero-thickness
 * gill ribbons) have no inside to count and must be left out of the group.
 */

/** Invisible stencil-writing twin of `geometry`, to be added under the same transform. */
export function createPlaneStencilGroup(
  geometry: THREE.BufferGeometry,
  planes: THREE.Plane[],
  renderOrder: number,
): THREE.Group {
  const group = new THREE.Group();

  const base = new THREE.MeshBasicMaterial();
  base.depthWrite = false;
  // Depth testing off: every face has to be counted, including occluded ones.
  base.depthTest = false;
  base.colorWrite = false;
  base.stencilWrite = true;
  base.stencilFunc = THREE.AlwaysStencilFunc;

  const backMat = base.clone();
  backMat.side = THREE.BackSide;
  backMat.clippingPlanes = planes;
  backMat.stencilFail = THREE.IncrementWrapStencilOp;
  backMat.stencilZFail = THREE.IncrementWrapStencilOp;
  backMat.stencilZPass = THREE.IncrementWrapStencilOp;

  const frontMat = base.clone();
  frontMat.side = THREE.FrontSide;
  frontMat.clippingPlanes = planes;
  frontMat.stencilFail = THREE.DecrementWrapStencilOp;
  frontMat.stencilZFail = THREE.DecrementWrapStencilOp;
  frontMat.stencilZPass = THREE.DecrementWrapStencilOp;

  for (const material of [backMat, frontMat]) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = renderOrder;
    // Flagged so the caller's material pass skips these when it traverses the
    // model — they are parented to the very meshes it is walking.
    mesh.userData.isStencilMask = true;
    group.add(mesh);
  }

  return group;
}

/**
 * The cut face itself: a quad lying on `plane`, painted only where the stencil
 * buffer says we're inside solid material.
 */
export function SectionCap({
  plane,
  size,
  center,
  color,
  renderOrder,
}: {
  plane: THREE.Plane;
  size: number;
  /** Centre of the specimen, so the quad is placed over it rather than the origin. */
  center: THREE.Vector3;
  color: string;
  renderOrder: number;
}) {
  const { position, quaternion } = useMemo(() => {
    const normal = plane.normal.clone().normalize();
    // Sit the quad on the plane directly over the specimen: project its centre
    // onto the plane. Anchoring at -normal*constant instead puts the quad at the
    // scene origin, which on a tall specimen leaves the top of the cut unfilled.
    const d = normal.dot(center) + plane.constant;
    return {
      position: center.clone().sub(normal.clone().multiplyScalar(d)),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal,
      ),
    };
  }, [plane, center]);

  return (
    <mesh
      position={position}
      quaternion={quaternion}
      renderOrder={renderOrder}
      // Kept out of the camera-framing measurement: it is a viewing aid sized to
      // cover the cut, not part of the specimen, and including it drags the
      // framing centre away and pushes tall species out of frame.
      userData={{ noFrame: true }}
      // Hand the stencil buffer back clean, or the next frame starts dirty.
      onAfterRender={(renderer) => renderer.clearStencil()}
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial
        color={color}
        roughness={0.95}
        metalness={0}
        // The cut face always points along -normal, away from the scene's key
        // light, so lit purely by ambient it reads as grey rather than flesh.
        // A low emissive floor keeps it legible from whatever angle it is viewed.
        emissive={color}
        emissiveIntensity={0.42}
        side={THREE.DoubleSide}
        stencilWrite
        stencilRef={0}
        stencilFunc={THREE.NotEqualStencilFunc}
        stencilFail={THREE.ReplaceStencilOp}
        stencilZFail={THREE.ReplaceStencilOp}
        stencilZPass={THREE.ReplaceStencilOp}
        // The quad is coplanar with the cut edges of the clipped mesh.
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );
}
