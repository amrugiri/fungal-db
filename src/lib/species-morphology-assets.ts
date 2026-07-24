/** Locally hosted reference imagery for image-guided 3D morphology viewers. */
export type MorphologyReferenceAssets = {
  exteriorImageUrl: string;
  crossSectionImageUrl: string;
  attribution: string;
};

export const speciesMorphologyAssets: Partial<Record<string, MorphologyReferenceAssets>> = {
  "morchella-spp": {
    exteriorImageUrl: "/morphology/morchella-spp/external-3d.jpg",
    crossSectionImageUrl: "/morphology/morchella-spp/cross-section-reference.png",
    attribution:
      "Exterior 3D render and cross-section reference photos (user-provided); hollow anatomy per Morchella esculenta morphology.",
  },
};

export function getMorphologyReferenceAssets(slug: string): MorphologyReferenceAssets | null {
  return speciesMorphologyAssets[slug] ?? null;
}
