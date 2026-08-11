"use client";

import { useLayoutEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { SpeciesMorphologyModel } from "@/lib/species-morphology-models";
import {
  createPlaneStencilGroup,
  SectionCap,
} from "@/components/morphology-viewer/anatomical/CappedClipping";

const DEFAULT_TARGET_SIZE = 1.15;
const DEFAULT_FLESH_COLOR = "#f2ece0";

/** Draw order: stencil masks, then the cut face, then the model itself. */
const STENCIL_ORDER = 1;
const CAP_ORDER = 2;
const MODEL_ORDER = 3;

/** Sagittal slider travel — a little wider than the model so the cut can clear it. */
export function glbSectionRange(model: SpeciesMorphologyModel): number {
  return (model.targetSize ?? DEFAULT_TARGET_SIZE) * 1.2;
}

/**
 * Renders a real .glb mesh: normalised to the scene's scale, seated on y=0,
 * and wired to the viewer's sagittal clipping plane with filled cut faces.
 */
export function GlbAnatomy({
  model,
  clippingPlanes,
  showSection,
}: {
  model: SpeciesMorphologyModel;
  clippingPlanes: THREE.Plane[];
  showSection: boolean;
}) {
  const { scene } = useGLTF(model.url);

  const { object, stencilGroups, fittedCenter, fittedSpan } = useMemo(() => {
    // useGLTF caches by URL, so the loaded scene is shared across every viewer
    // on the page. Clone it (materials included) before touching anything —
    // clipping planes and side are per-material state.
    const root = scene.clone(true);
    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material.clone();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });

    // Blender/trimesh write Z-up; three.js is Y-up. Rotating -90 deg about X
    // sends +Z to +Y, standing the mushroom upright.
    if (model.upAxis === "z") root.rotation.x = -Math.PI / 2;
    root.updateMatrixWorld(true);

    // Fit by longest axis (not height) so wide-capped species stay inside the
    // camera frustum while keeping their true cap-to-stipe proportions.
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const longest = Math.max(size.x, size.y, size.z) || 1;
    const scale = (model.targetSize ?? DEFAULT_TARGET_SIZE) / longest;

    // Uniform scale commutes with rotation, so the fitted box is just box * scale.
    root.scale.setScalar(scale);
    root.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
    root.updateMatrixWorld(true);

    // Attach a stencil twin to each closed part. Parenting it to the part means
    // it inherits that part's world transform exactly, with no matrix bookkeeping.
    const stencilGroups: THREE.Group[] = [];
    const solidParts = model.solidParts ?? [];
    if (solidParts.length > 0) {
      const parts: THREE.Mesh[] = [];
      root.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh && solidParts.includes(mesh.name)) parts.push(mesh);
      });
      for (const part of parts) {
        const group = createPlaneStencilGroup(part.geometry, [], STENCIL_ORDER);
        part.add(group);
        stencilGroups.push(group);
      }
    }

    const fitted = new THREE.Box3().setFromObject(root);
    const fittedCenter = fitted.getCenter(new THREE.Vector3());
    const fittedSpan = fitted.getSize(new THREE.Vector3()).length();

    return { object: root, stencilGroups, fittedCenter, fittedSpan };
  }, [scene, model]);

  useLayoutEffect(() => {
    const solidParts = model.solidParts ?? [];

    object.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh || mesh.userData.isStencilMask) return;

      mesh.renderOrder = MODEL_ORDER;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        const mat = material as THREE.MeshStandardMaterial;
        mat.clippingPlanes = clippingPlanes;
        mat.clipShadows = true;
        // Capped parts get a filled cut face, so front faces are enough. Open
        // geometry (gill ribbons) has no cap and would vanish when cut, so it
        // renders double-sided to stay visible edge-on in section.
        mat.side =
          showSection && !solidParts.includes(mesh.name)
            ? THREE.DoubleSide
            : THREE.FrontSide;
        mat.needsUpdate = true;
      }
    });

    for (const group of stencilGroups) {
      group.visible = showSection;
      group.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        (mesh.material as THREE.Material).clippingPlanes = clippingPlanes;
      });
    }
  }, [object, stencilGroups, clippingPlanes, showSection, model]);

  const sectionPlane = clippingPlanes[0];
  // Sized from the specimen, not a fixed constant: a tall narrow species needs a
  // taller quad than a squat one, and an oversized quad distorts nothing only
  // because it is excluded from framing.
  const capSize = fittedSpan * 1.15;

  return (
    <group>
      <primitive object={object} />
      {showSection && sectionPlane && stencilGroups.length > 0 && (
        <SectionCap
          plane={sectionPlane}
          size={capSize}
          center={fittedCenter}
          color={model.sectionFleshColor ?? DEFAULT_FLESH_COLOR}
          renderOrder={CAP_ORDER}
        />
      )}
    </group>
  );
}
