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

// Positioned against the mesh in public/models/auricularia-auricula-judae.glb.
// Auricularia has no cap/stipe/gills, so the generic jelly labels above point at
// nothing on it; these anchor to the real surfaces and are spaced in y so the
// leader lines (which always run +0.28 in x) don't collide.
const WOOD_EAR_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Hymenial Surface (Fertile)", position: [0.06, 0.66, 0.16] },
  // Anchored on the pale band along the lower rim, the only place the sterile
  // outer face is visible from the default view.
  { id: 2, title: "Abhymenial Surface (Downy)", position: [-0.16, 0.06, 0.16] },
  { id: 3, title: "Undulating Lobed Margin", position: [0.48, 0.55, 0.14] },
  { id: 4, title: "Gelatinous Context", position: [0.46, 0.28, 0.2] },
  { id: 5, title: "Sessile Attachment", position: [-0.52, 0.45, 0.02] },
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

// ---------------------------------------------------------------------------
// Species whose anatomy has no matching archetype above. Without these the
// fallback would label a Cordyceps stroma with "Lamellae (Gills)", a sessile
// polypore with a lateral stalk, and — worst — a coenocytic Rhizopus with
// septa and cross-walls, which is factually wrong for the genus.
// ---------------------------------------------------------------------------
const SPLIT_GILL_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Sessile Fan-Shaped Pileus", position: [0.3, 0.5, 0.14] },
  { id: 2, title: "Longitudinally Split Folds", position: [0.24, 0.16, 0.2] },
  { id: 3, title: "Fold Halves (Not True Gills)", position: [-0.3, 0.28, 0.16] },
  { id: 4, title: "Hairy Upper Surface", position: [0.1, 0.62, 0.06] },
  { id: 5, title: "Substrate Attachment", position: [-0.45, 0.38, 0.02] },
];

const CAULIFLOWER_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Crisped Flattened Lobes", position: [0.3, 0.68, 0.16] },
  { id: 2, title: "Branched Lobe Cluster", position: [-0.3, 0.5, 0.14] },
  { id: 3, title: "Fertile Lobe Underside", position: [0.34, 0.34, 0.2] },
  { id: 4, title: "Rooting Base", position: [0.12, 0.06, 0.12] },
  { id: 5, title: "No Pileus or Hymenophore", position: [-0.34, 0.2, 0.08] },
];

const SESSILE_SHELF_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Imbricate Shelves", position: [0.34, 0.62, 0.16] },
  { id: 2, title: "Poroid Hymenium", position: [0.2, 0.28, 0.22] },
  { id: 3, title: "Upper Surface", position: [-0.3, 0.5, 0.12] },
  { id: 4, title: "Context (Flesh)", position: [0.44, 0.44, 0.14] },
  { id: 5, title: "Sessile Attachment", position: [-0.5, 0.2, 0.04] },
];

const CONIDIAL_HEAD_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Conidial Chains", position: [0.34, 0.78, 0.14] },
  { id: 2, title: "Phialides", position: [0.28, 0.6, 0.18] },
  { id: 3, title: "Vesicle (Swollen Apex)", position: [-0.22, 0.58, 0.12] },
  { id: 4, title: "Conidiophore Stipe", position: [0.08, 0.28, 0.12] },
  { id: 5, title: "Foot Cell", position: [0.14, 0.04, 0.14] },
];

const SPORANGIUM_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Sporangium", position: [0.24, 0.74, 0.12] },
  { id: 2, title: "Columella", position: [-0.22, 0.62, 0.14] },
  { id: 3, title: "Sporangiophore", position: [0.12, 0.36, 0.14] },
  { id: 4, title: "Stolon", position: [0.4, 0.12, 0.16] },
  { id: 5, title: "Rhizoids (Nodal Tuft)", position: [-0.36, 0.04, 0.1] },
  { id: 6, title: "Coenocytic — No Septa", position: [0.46, 0.5, 0.06] },
];

// Exannulate clustered agarics: the generic gilled set labels an "Annulus"
// these species do not have, and misses the caespitose habit that is their
// most recognisable feature.
const CLUSTERED_EXANNULATE_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Pileus (Cap)", position: [0.42, 0.78, 0.02] },
  { id: 2, title: "Lamellae (Gills)", position: [0.38, 0.6, 0.08] },
  { id: 3, title: "Stipe (Stem)", position: [0.14, 0.34, 0.14] },
  { id: 4, title: "Caespitose Cluster", position: [0.3, 0.16, 0.12] },
  { id: 5, title: "Shared Basal Mycelium", position: [0.22, -0.02, 0.2] },
];

const EXANNULATE_GILLED_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Pileus (Cap)", position: [0.42, 0.78, 0.02] },
  { id: 2, title: "Lamellae (Gills)", position: [0.38, 0.6, 0.08] },
  { id: 3, title: "Stipe (Stem)", position: [0.14, 0.28, 0.14] },
  { id: 4, title: "Context (Flesh)", position: [0.26, 0.5, 0.16] },
  { id: 5, title: "Mycelial Threads (Hyphae)", position: [0.22, -0.02, 0.2] },
];

const NEUROSPORA_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Macroconidial Chains", position: [0.36, 0.68, 0.14] },
  { id: 2, title: "Septate Hyphae", position: [0.16, 0.5, 0.16] },
  { id: 3, title: "Branching Mycelium", position: [-0.3, 0.34, 0.12] },
  { id: 4, title: "Hyphal Tip", position: [0.28, 0.22, 0.1] },
  { id: 5, title: "Cross-Wall (Septum)", position: [-0.1, 0.2, 0.14] },
];

const TRICHODERMA_FEATURES: MorphologyFeature[] = [
  { id: 1, title: "Conidial Heads", position: [0.34, 0.76, 0.12] },
  { id: 2, title: "Phialide Whorls", position: [0.26, 0.58, 0.16] },
  { id: 3, title: "Branched Conidiophore", position: [-0.26, 0.44, 0.12] },
  { id: 4, title: "Main Stipe", position: [0.06, 0.24, 0.14] },
  { id: 5, title: "No Vesicle (cf. Aspergillus)", position: [0.4, 0.34, 0.06] },
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
    features: WOOD_EAR_FEATURES,
  },
  "aspergillus-oryzae": {
    description:
      "Rice koji — large yellow-green aspergillum: tall stipe, broad vesicle, long bright conidial chains. Distinct from the compact brown A. sojae head.",
    features: CONIDIAL_HEAD_FEATURES,
  },
  "rhizopus-oligosporus": {
    description:
      "Tempeh mold — fast-growing rhizoidal mycelium that binds soybean cotyledons into a cohesive fermented cake.",
    features: SPORANGIUM_FEATURES,
  },
  "neurospora-intermedia": {
    description:
      "Oncom mold — orange-pigmented Neurospora mycelium fermenting peanut or okara press cake in West Javanese tradition.",
    features: NEUROSPORA_FEATURES,
  },
  "trichoderma-reesei": {
    description:
      "Industrial cellulase producer — highly branched septate hyphae used for enzyme manufacturing, not direct food biomass.",
    features: TRICHODERMA_FEATURES,
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
  "flammulina-velutipes": {
    description:
      "Enokitake — elongated creamy pileus on slender stipe clusters; cultivated form has tiny caps and long stems used as noodle-like meat extenders.",
    features: CLUSTERED_EXANNULATE_FEATURES,
    detailedGilledModel: true,
  },
  "hypsizygus-marmoreus": {
    description:
      "Beech mushroom — small mottled pilei on firm clustered stipes; dense flesh suited to sauté and meat-analog blends.",
    features: CLUSTERED_EXANNULATE_FEATURES,
    detailedGilledModel: true,
  },
  "pleurotus-citrinopileatus": {
    description:
      "Golden oyster — bright yellow clustered shelves with short eccentric stipes; shreds like chicken when sautéed.",
    features: OYSTER_FEATURES,
  },
  "pleurotus-djamor": {
    description:
      "Pink oyster — rose to salmon fan-shaped caps in dense clusters; fibrous flesh for bacon/chicken-style shreds.",
    features: OYSTER_FEATURES,
  },
  "cyclocybe-aegerita": {
    description:
      "Pioppino — tawny convex pileus on slender fibrous stipe; firm flesh prized in Mediterranean cooking.",
    features: GILLED_MUSHROOM_FEATURES,
    detailedGilledModel: true,
  },
  "pholiota-nameko": {
    description:
      "Nameko — small amber pilei with gelatinous pellicle on clustered stipes; glossy coat used in Japanese cuisine.",
    features: CLUSTERED_EXANNULATE_FEATURES,
    detailedGilledModel: true,
  },
  "calocybe-indica": {
    description:
      "Milky mushroom — large white convex pileus on stout stipe; tropical commercial agaric with dense flesh.",
    features: EXANNULATE_GILLED_FEATURES,
    detailedGilledModel: true,
  },
  "stropharia-rugosoannulata": {
    description:
      "Wine cap — large burgundy pileus with prominent ring on thick stipe; garden-cultivated fleshy agaric.",
    features: GILLED_MUSHROOM_FEATURES,
    detailedGilledModel: true,
  },
  "laetiporus-sulphureus": {
    description:
      "Chicken of the woods — bright orange-yellow bracket shelves without a true stipe; fibrous flesh famed as chicken analog.",
    features: SESSILE_SHELF_FEATURES,
  },
  "sparassis-crispa": {
    description:
      "Cauliflower mushroom — densely folded cream fronds without a classic gilled cap; coral-like mass.",
    features: CAULIFLOWER_FEATURES,
  },
  "schizophyllum-commune": {
    description:
      "Split-gill — thin fan-shaped fruiting bodies with longitudinally split gills; also grown as submerged mycoprotein biomass.",
    features: SPLIT_GILL_FEATURES,
  },
  "aspergillus-sojae": {
    description:
      "Soy koji — compact brown-olive aspergillum: shorter stipe, smaller vesicle, dark conidial chains. Distinct from the larger yellow-green A. oryzae head.",
    features: CONIDIAL_HEAD_FEATURES,
  },
  "rhizopus-oryzae": {
    description:
      "Tempeh mold — coenocytic zygomycete hyphae binding soybeans into a dense meaty cake (distinct from R. oligosporus).",
    features: SPORANGIUM_FEATURES,
  },
  "cordyceps-militaris": {
    description:
      "Cordyceps militaris — orange club-shaped stromata; cultivated fruiting bodies used as food/functional ingredient.",
    features: [
      { id: 1, title: "Stromatal Head", position: [0.2, 0.75, 0.04] },
      { id: 2, title: "Perithecia Zone", position: [0.28, 0.62, 0.08] },
      { id: 3, title: "Stipe (Club)", position: [0.12, 0.35, 0.1] },
      { id: 4, title: "Mycelial Base", position: [0.1, 0.02, 0.1] },
      { id: 5, title: "Substrate Interface", position: [0.22, 0.05, 0.15] },
    ],
  },
  "agaricus-subrufescens": {
    description:
      "Almond mushroom — robust brown-capped agaric on thick stipe; compost-cultivated like button mushrooms.",
    features: GILLED_MUSHROOM_FEATURES,
    detailedGilledModel: true,
  },
  "pleurotus-pulmonarius": {
    description:
      "Phoenix oyster — pale cream to tan shelves with eccentric stipe and decurrent gills; warmer-weather oyster used as shredded meat analog.",
    features: OYSTER_FEATURES,
  },
  "fusarium-sp-flavolapis": {
    description:
      "Fusarium strain flavolapis — septate branching mycelium of the Fy Protein organism. Same genus body plan as F. venenatum (canoe-shaped macroconidia in culture). Not Paecilomyces.",
    features: MICROSCOPY_FEATURES,
  },
  "paecilomyces-variotii": {
    description:
      "Paecilomyces variotii (Pekilo) — irregularly branched conidiophores with elongated tapering phialides and chains of conidia. No vesicle (unlike Aspergillus) and no Fusarium-type macroconidia.",
    features: [
      { id: 1, title: "Conidial Chains", position: [0.4, 0.58, 0.13] },
      { id: 2, title: "Tapering Phialides", position: [0.34, 0.46, 0.1] },
      { id: 3, title: "Branched Conidiophore", position: [0.2, 0.32, 0.06] },
      { id: 4, title: "Main Stipe", position: [0.06, -0.2, 0.04] },
      { id: 5, title: "No Vesicle / Not Fusarium Macroconidia", position: [0.08, 0.16, 0.04] },
    ],
  },
  "cyberlindnera-jadinii": {
    description:
      "Unicellular budding yeast (torula / Candida utilis). No hyphae — ovoid mother cells with smaller daughter buds. Schematic of the food organism, not a filamentous mould.",
    features: [
      { id: 1, title: "Mother Cell", position: [0.02, 0.02, 0.08] },
      { id: 2, title: "Daughter Bud", position: [0.16, 0.24, 0.06] },
      { id: 3, title: "Bud Neck", position: [0.1, 0.14, 0.04] },
      { id: 4, title: "Cell Cluster", position: [-0.28, 0.08, -0.08] },
      { id: 5, title: "No Hyphae", position: [0.36, 0.28, 0.02] },
    ],
  },
  "tuber-borchii": {
    description:
      "Ectomycorrhizal mycelium schematic — septate branching hyphae. Published alt-protein work on this species is axenic mycelium aroma, not a fruiting-body model.",
    features: MICROSCOPY_FEATURES,
  },
  "cantharellus-cibarius": {
    description:
      "Chanterelle — funnel pileus with a wavy margin, continuous with a downward-tapering stipe. Blunt forked ridges (false gills), not true lamellae.",
    features: [
      { id: 1, title: "Funnel Pileus", position: [0.42, 0.55, 0.06] },
      { id: 2, title: "Ridges (False Gills)", position: [0.34, 0.22, 0.14] },
      { id: 3, title: "Solid Stipe", position: [0.12, -0.15, 0.1] },
      { id: 4, title: "Forked Ridges", position: [0.38, 0.36, 0.12] },
      { id: 5, title: "Depressed Centre", position: [0.08, 0.48, 0.04] },
    ],
  },
  "tricholoma-matsutake": {
    description:
      "Matsutake — convex pileus, true gills, thick fibrous stipe. No species-specific mesh; schematic gilled agaric only, not a scan.",
    features: EXANNULATE_GILLED_FEATURES,
  },
  "aspergillus-niger": {
    description:
      "Black aspergillum: unbranched stipe, globose vesicle, phialides, dark conidia. Same body plan as koji, but not a yellow-green A. oryzae / A. sojae mesh.",
    features: [
      { id: 1, title: "Conidial Chains", position: [0.22, 0.52, 0.12] },
      { id: 2, title: "Phialides", position: [0.16, 0.42, 0.1] },
      { id: 3, title: "Vesicle (Swollen Apex)", position: [0.12, 0.36, 0.08] },
      { id: 4, title: "Conidiophore Stipe", position: [0.06, 0.0, 0.06] },
      { id: 5, title: "Foot Cell", position: [0.1, -0.48, 0.06] },
    ],
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
