import type { MorphologyParameters } from "@/lib/types";

export type MorphologyFeature = {
  id: number;
  title: string;
  position: readonly [number, number, number];
};

export type SpeciesMorphologyConfig = {
  description: string;
  features: MorphologyFeature[];
  /** Use high-detail gilled basidiocarp geometry (Agaricus-style). */
  detailedGilledModel?: boolean;
};

const GILLED_MUSHROOM_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Pileus (Cap)", position: [0.42, 0.78, 0.02] },
  { id: 2, title: "Lamellae (Gills)", position: [0.38, 0.6, 0.08] },
  { id: 3, title: "Stipe (Stem)", position: [0.14, 0.28, 0.14] },
  { id: 4, title: "Annulus (Ring)", position: [0.2, 0.5, 0.18] },
  { id: 5, title: "Mycelial Threads (Hyphae)", position: [0.22, -0.02, 0.2] },
];

const OYSTER_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Pileus (Shelf Cap)", position: [0.35, 0.22, 0.1] },
  { id: 2, title: "Lamellae (Gills)", position: [0.28, 0.08, 0.12] },
  { id: 3, title: "Stipe (Lateral Stem)", position: [0.08, -0.02, 0.06] },
  { id: 4, title: "Basidiocarp Cluster", position: [0.4, 0.18, -0.08] },
  { id: 5, title: "Substrate Attachment", position: [0.1, -0.08, 0.15] },
];

const KING_OYSTER_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Pileus (Cap)", position: [0.32, 0.72, 0.04] },
  { id: 2, title: "Lamellae (Gills)", position: [0.3, 0.58, 0.1] },
  { id: 3, title: "Stipe (Thick Stem)", position: [0.12, 0.32, 0.12] },
  { id: 4, title: "Context (Flesh)", position: [0.25, 0.45, 0.15] },
  { id: 5, title: "Base (Rhizomorphs)", position: [0.1, 0.02, 0.1] },
];

const LIONS_MANE_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Central Mass (Cap)", position: [0.2, 0.28, 0.1] },
  { id: 2, title: "Icicle Spines (Hymenium)", position: [0.35, 0.12, 0.15] },
  { id: 3, title: "Spine Cluster", position: [-0.25, 0.1, 0.12] },
  { id: 4, title: "Attachment Point", position: [0.05, 0.22, -0.08] },
  { id: 5, title: "Branching Hymenophore", position: [0.3, -0.02, -0.1] },
];

const MAITAKE_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Central Stipe", position: [0.1, -0.02, 0.08] },
  { id: 2, title: "Overlapping Caps", position: [0.38, 0.22, 0.1] },
  { id: 3, title: "Pore Surface (Hymenium)", position: [0.28, 0.08, 0.18] },
  { id: 4, title: "Frond Cluster", position: [-0.3, 0.15, -0.05] },
  { id: 5, title: "Wood Substrate", position: [0.15, -0.1, 0.2] },
];

const JELLY_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Gelatinous Fruiting Body", position: [0.3, 0.2, 0.08] },
  { id: 2, title: "Translucent Context", position: [0.15, 0.08, 0.15] },
  { id: 3, title: "Hymenial Surface", position: [-0.2, 0.12, 0.1] },
  { id: 4, title: "Basidiocarp Lobes", position: [0.35, -0.02, -0.08] },
  { id: 5, title: "Substrate Attachment", position: [0.08, -0.08, 0.12] },
];

const BRACKET_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Pileus (Lacquered Cap)", position: [0.32, 0.22, 0.1] },
  { id: 2, title: "Hymenophore (Pore Surface)", position: [0.28, 0.1, 0.12] },
  { id: 3, title: "Stipe (Lateral Stalk)", position: [-0.2, 0.05, 0.08] },
  { id: 4, title: "Context (Flesh)", position: [0.15, 0.16, 0.15] },
  { id: 5, title: "Wood Substrate", position: [0.1, -0.1, 0.12] },
];

const MOREL_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Pileus (Cap)", position: [0.3, 0.38, 0.08] },
  { id: 2, title: "Pits & Ridges (Hymenium)", position: [0.22, 0.32, 0.12] },
  { id: 3, title: "Stipe (Stem)", position: [0.1, 0.08, 0.1] },
  { id: 4, title: "Ascocarp Cavity", position: [0.28, 0.28, -0.05] },
  { id: 5, title: "Base (Mycelial Cord)", position: [0.08, -0.05, 0.08] },
];

const PUFFBALL_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Gleba (Spore Mass)", position: [0.25, 0.28, 0.1] },
  { id: 2, title: "Peridium (Outer Wall)", position: [0.38, 0.35, 0.05] },
  { id: 3, title: "Exoperidium", position: [-0.3, 0.25, 0.08] },
  { id: 4, title: "Subgleba", position: [0.12, 0.05, 0.12] },
  { id: 5, title: "Rhizomorph Base", position: [0.1, -0.02, 0.1] },
];

const SMUT_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Smut Gall (Tumor)", position: [0.32, 0.22, 0.1] },
  { id: 2, title: "Host Tissue (Corn)", position: [0.12, -0.08, 0.08] },
  { id: 3, title: "Teliosporangia", position: [0.25, 0.15, 0.15] },
  { id: 4, title: "Gall Cluster", position: [-0.28, 0.18, -0.05] },
  { id: 5, title: "Infection Zone", position: [0.15, 0.05, -0.1] },
];

const MICROSCOPY_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Septate Hyphae", position: [0.3, 0.35, 0.1] },
  { id: 2, title: "Branching Mycelium", position: [0.15, 0.15, 0.15] },
  { id: 3, title: "Hyphal Tip", position: [-0.25, 0.42, 0.08] },
  { id: 4, title: "Cross-Wall (Septum)", position: [0.08, 0.22, 0.12] },
  { id: 5, title: "Substrate Hyphae", position: [0.2, -0.15, 0.1] },
];

export const speciesMorphologyConfig: Record<string, SpeciesMorphologyConfig> = {
  "agaricus-bisporus": {
    description:
      "Interactive anatomical model of the button mushroom — the most widely cultivated basidiomycete for food and meat-analog applications.",
    features: [
      { id: 1, title: "Pileus (Cap)", position: [0.42, 0.78, 0.02] },
      { id: 2, title: "Lamellae (Gills)", position: [0.38, 0.6, 0.08] },
      { id: 3, title: "Annulus (Ring)", position: [0.2, 0.5, 0.18] },
      { id: 4, title: "Stipe (Stem)", position: [0.14, 0.28, 0.14] },
      { id: 5, title: "Volva (Universal Veil Remnant)", position: [0.1, 0.06, 0.12] },
      { id: 6, title: "Mycelial Threads (Hyphae)", position: [0.22, -0.02, 0.2] },
    ],
    detailedGilledModel: true,
  },
  "fusarium-venenatum": {
    description:
      "Septate hyphal network of the Quorn mycoprotein producer — submerged fermentation biomass with branching aerial and substrate mycelium.",
    features: MICROSCOPY_FEATURES,
  },
  "pleurotus-ostreatus": {
    description:
      "Shelf-like basidiocarps of the oyster mushroom — lateral stipe with decurrent gills, widely cultivated for fresh market and meat-analog shredding.",
    features: OYSTER_FEATURES,
  },
  "pleurotus-eryngii": {
    description:
      "King oyster morphology — thick central stipe with a small lateral cap, prized for dense texture in scallop and chicken-style analogs.",
    features: KING_OYSTER_FEATURES,
  },
  "hericium-erinaceus": {
    description:
      "Lion's mane bears pendant icicle spines instead of gills — a tooth hymenophore studied for fibrous, seafood-like texture.",
    features: LIONS_MANE_FEATURES,
  },
  "lentinula-edodes": {
    description:
      "Shiitake basidiocarp with convex pileus, decurrent to notched gills, and tough stipe — a staple cultivated edible mushroom.",
    features: GILLED_MUSHROOM_FEATURES,
    detailedGilledModel: true,
  },
  "ganoderma-lucidum": {
    description:
      "Bracket-like polypore fruiting body with a varnished pileus and pore hymenium — used medicinally, not as a meat analog.",
    features: BRACKET_FEATURES,
  },
  "tremella-fuciformis": {
    description:
      "Gelatinous tremelloid fruiting body — translucent lobes with a jelly-like context, cultivated for desserts and soups.",
    features: JELLY_FEATURES,
  },
  "grifola-frondosa": {
    description:
      "Maitake forms overlapping fan-shaped caps from a shared stipe — a polypore cluster valued for umami rather than fibrous analog texture.",
    features: MAITAKE_FEATURES,
  },
  "volvariella-volvacea": {
    description:
      "Straw mushroom with prominent volva at the stipe base — tropical cultivated species with pink-to-brown gills at maturity.",
    features: [
      { id: 1, title: "Pileus (Cap)", position: [0.42, 0.78, 0.02] },
      { id: 2, title: "Lamellae (Gills)", position: [0.38, 0.6, 0.08] },
      { id: 3, title: "Stipe (Stem)", position: [0.14, 0.28, 0.14] },
      { id: 4, title: "Volva (Egg Sac Remnant)", position: [0.1, 0.06, 0.12] },
      { id: 5, title: "Mycelial Threads", position: [0.22, -0.02, 0.2] },
    ],
    detailedGilledModel: true,
  },
  "auricularia-auricula-judae": {
    description:
      "Ear-shaped gelatinous basidiocarp — thin rubbery context with abhymenial and hymenial surfaces, sold dried and rehydrated.",
    features: JELLY_FEATURES,
  },
  "aspergillus-oryzae": {
    description:
      "Koji mold mycelium — septate hyphae with characteristic conidial heads (not shown) used to saccharify starches in miso, sake, and soy sauce.",
    features: MICROSCOPY_FEATURES,
  },
  "rhizopus-oligosporus": {
    description:
      "Tempeh mold — fast-growing rhizoidal mycelium that binds soybean cotyledons into a cohesive fermented cake.",
    features: MICROSCOPY_FEATURES,
  },
  "neurospora-intermedia": {
    description:
      "Oncom mold — orange-pigmented Neurospora mycelium fermenting peanut or okara press cake in West Javanese tradition.",
    features: MICROSCOPY_FEATURES,
  },
  "trichoderma-reesei": {
    description:
      "Industrial cellulase producer — highly branched septate hyphae used for enzyme manufacturing, not direct food biomass.",
    features: MICROSCOPY_FEATURES,
  },
  "ustilago-maydis": {
    description:
      "Corn smut galls — tumor-like fruiting bodies replacing host kernels with dark teliospore-filled tissue (huitlacoche).",
    features: SMUT_FEATURES,
  },
  "morchella-spp": {
    description:
      "Morel ascocarp — pitted-ridged pileus on a hollow stipe; prized gourmet mushroom with distinctive honeycomb hymenium.",
    features: MOREL_FEATURES,
  },
  "calvatia-gigantea": {
    description:
      "Giant puffball — large globose basidiocarp with internal gleba that matures into a powdery spore mass.",
    features: PUFFBALL_FEATURES,
  },
  "coprinus-comatus": {
    description:
      "Shaggy mane with elongated conical cap and free gills that autodigest into black ink — deliquescent basidiomycete.",
    features: [
      { id: 1, title: "Pileus (Conical Cap)", position: [0.35, 0.85, 0.04] },
      { id: 2, title: "Lamellae (Free Gills)", position: [0.32, 0.55, 0.1] },
      { id: 3, title: "Stipe (Hollow Stem)", position: [0.12, 0.3, 0.12] },
      { id: 4, title: "Universal Veil Remnants", position: [0.28, 0.7, 0.15] },
      { id: 5, title: "Mycelial Base", position: [0.1, 0.02, 0.1] },
    ],
    detailedGilledModel: true,
  },
};

function featuresForArchetype(params: MorphologyParameters): MorphologyFeature[] {
  if (params.visualizationStyle === "microscopy") return MICROSCOPY_FEATURES;

  switch (params.fruitingBodyType) {
    case "oyster":
      return OYSTER_FEATURES;
    case "king_oyster":
      return KING_OYSTER_FEATURES;
    case "lions_mane":
    case "coral":
      return LIONS_MANE_FEATURES;
    case "maitake":
      return MAITAKE_FEATURES;
    case "jelly":
      return JELLY_FEATURES;
    case "morel":
      return MOREL_FEATURES;
    case "bracket":
      return BRACKET_FEATURES;
    case "puffball":
      return PUFFBALL_FEATURES;
    case "smut":
      return SMUT_FEATURES;
    case "mushroom":
      return GILLED_MUSHROOM_FEATURES;
    case "none":
      return GILLED_MUSHROOM_FEATURES;
    default: {
      const unhandled: never = params.fruitingBodyType;
      throw new Error(`Unhandled fruiting body type: ${unhandled}`);
    }
  }
}

export function getSpeciesMorphologyConfig(
  slug: string,
  parameters: MorphologyParameters,
): SpeciesMorphologyConfig {
  const known = speciesMorphologyConfig[slug];
  if (known) return known;

  const isMicroscopy = parameters.visualizationStyle === "microscopy";
  return {
    description: isMicroscopy
      ? "Interactive 3D hyphal morphology — septate branching mycelium schematic based on reference microscopy."
      : "Interactive 3D fruiting-body morphology based on reference anatomy and cultivation morphology.",
    features: featuresForArchetype(parameters),
  };
}
