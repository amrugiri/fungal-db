import type { AminoAcids } from "../../src/lib/types";
import type { ProductionProcessStep } from "../../src/lib/types";

/** Typical essential + non-essential amino acids as % of total protein (cultivated basidiomycete baseline). */
const MUSHROOM_BASE: AminoAcids = {
  histidine: 2.7,
  isoleucine: 4.2,
  leucine: 6.8,
  lysine: 5.9,
  methionine: 1.6,
  cystine: 0.9,
  phenylalanine: 3.9,
  threonine: 4.3,
  tryptophan: 1.1,
  valine: 4.8,
  alanine: 4.1,
  arginine: 3.7,
  aspartic_acid: 5.2,
  glutamic_acid: 6.4,
  glycine: 3.2,
  proline: 2.5,
  serine: 3.6,
  tyrosine: 2.9,
};

type AminoAcidOverlay = {
  aminoAcidBasis: "percent_of_protein";
  aminoAcids: AminoAcids;
  limitingAminoAcids?: string;
};

export const speciesAminoAcidOverlays: Record<string, AminoAcidOverlay> = {
  "pleurotus-ostreatus": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, lysine: 6.2, methionine: 1.4 },
    limitingAminoAcids: "Methionine + cysteine",
  },
  "pleurotus-eryngii": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, leucine: 7.1, lysine: 6.0 },
    limitingAminoAcids: "Methionine + cysteine",
  },
  "hericium-erinaceus": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, glutamic_acid: 7.0, phenylalanine: 4.2 },
    limitingAminoAcids: "Methionine + cysteine",
  },
  "agaricus-bisporus": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: {
      ...MUSHROOM_BASE,
      lysine: 6.4,
      methionine: 1.5,
      glutamic_acid: 6.8,
    },
    limitingAminoAcids: "Methionine + cysteine",
  },
  "lentinula-edodes": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, leucine: 7.0, threonine: 4.6 },
    limitingAminoAcids: "Methionine + cysteine",
  },
  "ganoderma-lucidum": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, phenylalanine: 4.1, arginine: 4.0 },
    limitingAminoAcids: "Methionine + cysteine; often consumed as extract rather than whole biomass",
  },
  "tremella-fuciformis": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, proline: 3.1, glycine: 3.6 },
    limitingAminoAcids: "Methionine + cysteine; low total protein in fresh fruiting body",
  },
  "grifola-frondosa": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, leucine: 7.2, valine: 5.1 },
    limitingAminoAcids: "Methionine + cysteine",
  },
  "volvariella-volvacea": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, lysine: 6.6, isoleucine: 4.5 },
    limitingAminoAcids: "Methionine + cysteine",
  },
  "auricularia-auricula-judae": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, proline: 3.0, hydroxyproline: 1.2 } as AminoAcids,
    limitingAminoAcids: "Methionine + cysteine",
  },
  "aspergillus-oryzae": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: {
      histidine: 2.4,
      isoleucine: 4.8,
      leucine: 7.6,
      lysine: 5.2,
      methionine: 2.0,
      cystine: 1.1,
      phenylalanine: 4.4,
      threonine: 4.6,
      tryptophan: 1.3,
      valine: 5.4,
      alanine: 5.0,
      arginine: 4.2,
      aspartic_acid: 6.8,
      glutamic_acid: 9.2,
      glycine: 3.8,
      proline: 3.0,
      serine: 4.0,
      tyrosine: 3.4,
    },
    limitingAminoAcids: "Lysine (koji consumed as condiment, not sole protein source)",
  },
  "rhizopus-oligosporus": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: {
      histidine: 2.9,
      isoleucine: 4.6,
      leucine: 7.4,
      lysine: 5.6,
      methionine: 1.8,
      cystine: 1.0,
      phenylalanine: 4.2,
      threonine: 4.4,
      tryptophan: 1.2,
      valine: 5.0,
      alanine: 4.5,
      arginine: 4.8,
      aspartic_acid: 7.0,
      glutamic_acid: 8.5,
      glycine: 3.5,
      proline: 2.8,
      serine: 3.9,
      tyrosine: 3.2,
    },
    limitingAminoAcids: "Methionine + cysteine (tempeh often combined with cereal grains)",
  },
  "neurospora-intermedia": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: {
      histidine: 2.6,
      isoleucine: 4.4,
      leucine: 7.0,
      lysine: 5.4,
      methionine: 1.7,
      cystine: 0.9,
      phenylalanine: 4.0,
      threonine: 4.2,
      tryptophan: 1.0,
      valine: 4.9,
      alanine: 4.3,
      arginine: 4.1,
      aspartic_acid: 6.2,
      glutamic_acid: 7.8,
      glycine: 3.4,
      proline: 2.6,
      serine: 3.7,
      tyrosine: 3.0,
    },
    limitingAminoAcids: "Methionine + cysteine",
  },
  "trichoderma-reesei": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: {
      histidine: 2.2,
      isoleucine: 3.8,
      leucine: 6.2,
      lysine: 4.8,
      methionine: 1.4,
      cystine: 0.8,
      phenylalanine: 3.6,
      threonine: 4.0,
      tryptophan: 0.9,
      valine: 4.4,
      alanine: 5.2,
      arginine: 3.5,
      aspartic_acid: 6.0,
      glutamic_acid: 7.2,
      glycine: 3.0,
      proline: 2.2,
      serine: 3.4,
      tyrosine: 2.6,
    },
    limitingAminoAcids: "Primarily enzyme producer; biomass not a primary food protein",
  },
  "ustilago-maydis": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, lysine: 6.1, leucine: 7.3 },
    limitingAminoAcids: "Methionine + cysteine",
  },
  "morchella-spp": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, leucine: 7.5, phenylalanine: 4.3 },
    limitingAminoAcids: "Methionine + cysteine",
  },
  "calvatia-gigantea": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, lysine: 6.3, valine: 5.0 },
    limitingAminoAcids: "Methionine + cysteine",
  },
  "coprinus-comatus": {
    aminoAcidBasis: "percent_of_protein",
    aminoAcids: { ...MUSHROOM_BASE, glutamic_acid: 6.9, lysine: 6.0 },
    limitingAminoAcids: "Methionine + cysteine",
  },
};

const BAG_CULTIVATION: ProductionProcessStep[] = [
  {
    title: "Spawn Production",
    description:
      "Grain or sawdust spawn multiplied on sterile substrate under controlled conditions.",
  },
  {
    title: "Substrate Preparation",
    description:
      "Lignocellulosic substrate (straw, sawdust, or supplement blend) pasteurized or sterilized.",
  },
  {
    title: "Inoculation & Colonization",
    description: "Spawn mixed into bags or blocks; mycelium colonizes substrate in climate-controlled rooms.",
  },
  {
    title: "Fruiting Induction",
    description:
      "Environmental triggers (fresh air, humidity, temperature shift) initiate primordia and fruiting-body development.",
  },
  {
    title: "Harvest & Grading",
    description: "Fruiting bodies harvested at optimal maturity; sorted for fresh sale or further processing.",
  },
  {
    title: "Post-Harvest Processing",
    description:
      "Fresh packing, drying, blanching, or formulation into meat-analog or hybrid protein products.",
  },
];

const COMPOST_CULTIVATION: ProductionProcessStep[] = [
  {
    title: "Phase I Composting",
    description: "Straw, manure, and supplements composted with turning to build selective substrate.",
  },
  {
    title: "Phase II Pasteurization",
    description: "Compost pasteurized and conditioned to eliminate competitors and optimize nutrition.",
  },
  {
    title: "Spawn Run",
    description: "Grain spawn inoculated into trays; mycelium fully colonizes compost.",
  },
  {
    title: "Casing & Pinning",
    description: "Casing layer applied; humidity and CO₂ managed to initiate mushroom pins.",
  },
  {
    title: "Harvest (Multiple Flushes)",
    description: "Buttons or cups harvested in successive flushes over several weeks.",
  },
  {
    title: "Processing & Distribution",
    description: "Cool-chain packing for fresh market or processing into value-added protein ingredients.",
  },
];

const TEMPEH_PROCESS: ProductionProcessStep[] = [
  {
    title: "Soaking & Dehulling",
    description: "Legume or cereal substrate soaked, dehulled, and split to expose endosperm.",
  },
  {
    title: "Cooking & Acidification",
    description: "Substrate cooked, drained, and acidified to favour Rhizopus growth.",
  },
  {
    title: "Inoculation",
    description: "Rhizopus oligosporus spores or starter culture mixed into cooled substrate.",
  },
  {
    title: "Solid-State Incubation",
    description: "Packed and incubated 24–48 h at ~30 °C until mycelium binds substrate into a firm cake.",
  },
  {
    title: "Cooling & Packaging",
    description: "Tempeh chilled or briefly blanched; sold fresh or frozen for food or analog applications.",
  },
];

const KOJI_PROCESS: ProductionProcessStep[] = [
  {
    title: "Substrate Steaming",
    description: "Polished rice, barley, or soy steamed to target moisture for mold growth.",
  },
  {
    title: "Inoculation (Tané)",
    description: "Aspergillus oryzae spores applied to cooled grain in controlled inoculation rooms.",
  },
  {
    title: "Solid-State Incubation",
    description: "Koji incubated with temperature and humidity control; enzymes develop over 36–72 h.",
  },
  {
    title: "Harvest & Use",
    description:
      "Koji used directly or as starter for miso, sake, and soy sauce — protein-rich biomass for fermentation-derived ingredients.",
  },
];

const FERMENTATION_BIOMASS: ProductionProcessStep[] = [
  {
    title: "Seed Culture & Inoculum",
    description: "Working seed culture scaled in sterile flasks or seed fermenters.",
  },
  {
    title: "Submerged Fermentation",
    description: "Aerobic stirred-tank fermentation on defined carbon and nitrogen sources.",
  },
  {
    title: "Biomass Harvest",
    description: "Mycelial biomass separated by centrifugation or filtration.",
  },
  {
    title: "Downstream Processing",
    description: "Heat treatment, drying, or enzyme recovery depending on product target.",
  },
];

/** Default templates for scaffolding new species (not yet in slug-specific maps). */
export const productionTemplates = {
  bag_cultivation: BAG_CULTIVATION,
  compost_cultivation: COMPOST_CULTIVATION,
  tempeh: TEMPEH_PROCESS,
  koji: KOJI_PROCESS,
  fermentation_biomass: FERMENTATION_BIOMASS,
} as const;

export const defaultMushroomAminoAcids: AminoAcidOverlay = {
  aminoAcidBasis: "percent_of_protein",
  aminoAcids: { ...MUSHROOM_BASE },
  limitingAminoAcids: "Methionine + cysteine",
};

export const speciesProductionOverlays: Record<string, ProductionProcessStep[]> = {
  "pleurotus-ostreatus": BAG_CULTIVATION,
  "pleurotus-eryngii": [
    ...BAG_CULTIVATION.slice(0, 3),
    {
      title: "Fruiting on Supplemental Blocks",
      description:
        "King oyster grown in high-density sawdust blocks; longer colonization and extended stipe development.",
    },
    ...BAG_CULTIVATION.slice(4),
  ],
  "hericium-erinaceus": [
    BAG_CULTIVATION[0]!,
    {
      title: "Hardwood Substrate Preparation",
      description: "Hardwood sawdust or logs supplemented and sterilized for Hericium colonization.",
    },
    ...BAG_CULTIVATION.slice(2),
  ],
  "agaricus-bisporus": COMPOST_CULTIVATION,
  "lentinula-edodes": [
    BAG_CULTIVATION[0]!,
    {
      title: "Log or Bag Substrate",
      description: "Oak or synthetic logs/bags inoculated; shiitake requires extended colonization.",
    },
    ...BAG_CULTIVATION.slice(2, 4),
    {
      title: "Shock Fruiting",
      description: "Soaking or cold shock triggers flush formation on mature blocks or logs.",
    },
    ...BAG_CULTIVATION.slice(4),
  ],
  "ganoderma-lucidum": [
    BAG_CULTIVATION[0]!,
    {
      title: "Wood-Based Substrate",
      description: "Sawdust or wood segments colonized over several weeks in bags or trays.",
    },
    ...BAG_CULTIVATION.slice(2, 4),
    {
      title: "Antler or Cap Formation",
      description: "High CO₂ promotes antler form; fresh air yields shelf-like basidiocarps.",
    },
    {
      title: "Drying & Extraction",
      description: "Fruiting bodies dried or extracted for functional food and supplement markets.",
    },
  ],
  "tremella-fuciformis": BAG_CULTIVATION,
  "grifola-frondosa": BAG_CULTIVATION,
  "volvariella-volvacea": [
    {
      title: "Substrate Bedding",
      description: "Cotton waste, straw, or paddy straw prepared as heat-tolerant substrate.",
    },
    ...BAG_CULTIVATION.slice(1),
  ],
  "auricularia-auricula-judae": BAG_CULTIVATION,
  "aspergillus-oryzae": KOJI_PROCESS,
  "rhizopus-oligosporus": TEMPEH_PROCESS,
  "neurospora-intermedia": [
    {
      title: "Substrate Preparation",
      description: "Oncom or similar legume/cereal substrate cooked and cooled.",
    },
    ...TEMPEH_PROCESS.slice(1),
  ],
  "trichoderma-reesei": [
    ...FERMENTATION_BIOMASS,
    {
      title: "Enzyme Recovery",
      description: "Cellulase and hemicellulase enzymes recovered for industrial bioprocessing (not primary food biomass).",
    },
  ],
  "ustilago-maydis": [
    {
      title: "Field Inoculation",
      description: "Corn plants infected during silking stage to develop huitlacoche galls.",
    },
    {
      title: "Gall Harvest",
      description: "Immature galls harvested before sporulation; sorted for fresh or frozen sale.",
    },
    {
      title: "Processing",
      description: "Blanched, frozen, or formulated into specialty protein ingredients and analogs.",
    },
  ],
  "morchella-spp": [
    {
      title: "Substrate Inoculation",
      description: "Outdoor beds or controlled indoor systems inoculated with morel spawn.",
    },
    {
      title: "Colonization & Sclerotia",
      description: "Extended colonization phase; sclerotia form as survival structures.",
    },
    {
      title: "Fruiting Trigger",
      description: "Temperature shock and hydration induce ascocarp formation in season.",
    },
    {
      title: "Harvest & Handling",
      description: "Delicate ascocarps hand-harvested; rapid chilling for fresh or dried markets.",
    },
  ],
  "calvatia-gigantea": [
    {
      title: "Outdoor or Indoor Substrate",
      description: "Compost-enriched soil or indoor substrate blocks inoculated with puffball spawn.",
    },
    ...BAG_CULTIVATION.slice(2, 5),
    {
      title: "Young-Gleba Harvest",
      description: "Harvested while interior remains firm and white, before spore maturation.",
    },
  ],
  "coprinus-comatus": [
    {
      title: "Outdoor Bed Cultivation",
      description: "Compost or straw beds inoculated; often grown in seasonal outdoor systems.",
    },
    ...BAG_CULTIVATION.slice(2, 5),
    {
      title: "Rapid Processing",
      description: "Short shelf life requires immediate processing into fresh or dried protein ingredients.",
    },
  ],
};
