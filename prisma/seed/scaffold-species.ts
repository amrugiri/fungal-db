import { lineageToTaxonomy, lookupTaxonomy } from "../../src/lib/taxonomy/ncbi";
import type { AltProteinResearchSeed } from "./alt-protein-research";
import type { SpeciesBundle } from "./species-bundle";
import type { SpeciesSeed } from "./species-data";
import {
  defaultMushroomAminoAcids,
  productionTemplates,
  speciesAminoAcidOverlays,
} from "./species-enrichment";

export type CultivationType =
  | "mushroom"
  | "compost_mushroom"
  | "fermentation"
  | "tempeh"
  | "koji";

export type MinimalSpeciesInput = {
  genus: string;
  speciesEpithet: string;
  scientificName?: string;
  slug?: string;
  commonNames: string | string[];
  ncbiTaxonomyId?: string;
  cultivationType?: CultivationType;
  meatAlternativeUse?: boolean;
  meatAnalogPotential?: SpeciesSeed["sensory"]["meatAnalogPotential"];
};

function slugify(scientificName: string): string {
  return scientificName
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeCommonNames(value: string | string[]): string[] {
  if (Array.isArray(value)) return value.map((s) => s.trim()).filter(Boolean);
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function productionForType(type: CultivationType) {
  switch (type) {
    case "compost_mushroom":
      return productionTemplates.compost_cultivation;
    case "fermentation":
      return productionTemplates.fermentation_biomass;
    case "tempeh":
      return productionTemplates.tempeh;
    case "koji":
      return productionTemplates.koji;
    default:
      return productionTemplates.bag_cultivation;
  }
}

function defaultMorphology3D(type: CultivationType): SpeciesSeed["morphology3D"] {
  if (type === "fermentation" || type === "koji" || type === "tempeh") {
    return {
      visualizationStyle: "microscopy",
      stainColor: "#3b6ea8",
      backgroundColor: "#f4f1ea",
      hyphaeBranchAngle: 45,
      hyphaeThickness: 0.02,
      hyphaeColor: "#e8dcc8",
      hyphaeDensity: 8,
      fruitingBodyType: "none",
      capDiameter: 0,
      stipeLength: 0,
      capColor: "#e8dcc8",
      showMycelium: true,
      showFruitingBody: false,
    };
  }

  return {
    visualizationStyle: "macroscopic",
    hyphaeBranchAngle: 45,
    hyphaeThickness: 0.02,
    hyphaeColor: "#e8e0d4",
    hyphaeDensity: 7,
    fruitingBodyType: "mushroom",
    capDiameter: 6,
    stipeLength: 5,
    capColor: "#f5f0e0",
    showMycelium: true,
    showFruitingBody: true,
  };
}

function defaultResearch(
  scientificName: string,
  slug: string,
): AltProteinResearchSeed[] {
  return [
    {
      title: `Protein and sensory properties of ${scientificName} for alternative protein applications`,
      authors: "Literature review (curated placeholder)",
      journal: "To be verified",
      year: new Date().getFullYear(),
      summary: `Placeholder alt-protein research entry for ${scientificName}. Replace with a verified DOI and summary via prisma/seed/species/${slug}.json.`,
    },
  ];
}

export async function scaffoldSpeciesBundle(input: MinimalSpeciesInput): Promise<SpeciesBundle> {
  const scientificName =
    input.scientificName?.trim() || `${input.genus.trim()} ${input.speciesEpithet.trim()}`;
  const slug = input.slug?.trim() || slugify(scientificName);
  const commonNames = normalizeCommonNames(input.commonNames);
  const cultivationType = input.cultivationType ?? "mushroom";
  const meatAlternativeUse = input.meatAlternativeUse ?? false;
  const meatAnalogPotential: SpeciesSeed["sensory"]["meatAnalogPotential"] =
    input.meatAnalogPotential ?? (meatAlternativeUse ? "moderate" : "low");

  let ncbiTaxonomyId = input.ncbiTaxonomyId ?? "";
  let taxonomy: SpeciesSeed["taxonomy"] = {
    phylum: "Basidiomycota",
    class: "Agaricomycetes",
    order: "Agaricales",
    family: "Unknown",
    genus: input.genus,
  };

  if (!ncbiTaxonomyId || !taxonomy.family || taxonomy.family === "Unknown") {
    const ncbi = await lookupTaxonomy(scientificName);
    if (ncbi) {
      ncbiTaxonomyId = ncbi.taxId;
      const mapped = lineageToTaxonomy(ncbi.lineage, ncbi.ranks);
      taxonomy = {
        kingdom: mapped.kingdom ?? "Fungi",
        phylum: mapped.phylum ?? taxonomy.phylum,
        class: mapped["class"] ?? taxonomy.class,
        order: mapped.order ?? taxonomy.order,
        family: mapped.family ?? taxonomy.family,
        genus: mapped.genus ?? input.genus,
      };
    }
  }

  const amino =
    speciesAminoAcidOverlays[slug] ?? defaultMushroomAminoAcids;
  const production = productionForType(cultivationType);
  const isWholeFoodMushroom =
    cultivationType === "mushroom" || cultivationType === "compost_mushroom";

  const species: SpeciesSeed = {
    slug,
    genus: input.genus,
    speciesEpithet: input.speciesEpithet,
    scientificName,
    commonNames,
    ncbiTaxonomyId: ncbiTaxonomyId || "000000",
    taxonomy,
    sensory: {
      tasteAxes: { umami: 3, earthy: 2 },
      textureAxes: { tender: 3, firm: 2 },
      aromaNotes: `Characteristic aroma of ${scientificName}; update after sensory panel review.`,
      meatAnalogPotential,
      meatAnalogRationale: meatAlternativeUse
        ? `Candidate for hybrid or blended meat-analog formulations using ${scientificName} biomass.`
        : `Primarily used as ${isWholeFoodMushroom ? "whole food" : "processed ingredient"}; limited standalone meat-analog potential.`,
      preparationContext: isWholeFoodMushroom
        ? "Fresh fruiting body, cooked or dried"
        : "Processed biomass or fermented product",
      confidenceNotes: "Scaffolded defaults — replace with cited values.",
      citationKeys: ["shah2014"],
    },
    morphology: {
      hyphalType: "septate",
      cellWallComposition: "Chitin, beta-glucans, mannoproteins",
      fruitingBodyStructure:
        cultivationType === "mushroom" || cultivationType === "compost_mushroom"
          ? "Basidiocarp with pileus and stipe"
          : "Filamentous mycelium in submerged or solid-state culture",
      microscopyNotes: `Update with species-specific microscopy notes for ${scientificName}.`,
    },
    nutrition: {
      proteinPercent: isWholeFoodMushroom ? 30 : 40,
      fiberPercent: isWholeFoodMushroom ? 10 : 15,
      fatPercent: 2,
      moisturePercent: isWholeFoodMushroom ? 90 : 75,
      aminoAcidBasis: amino.aminoAcidBasis,
      aminoAcids: amino.aminoAcids,
      limitingAminoAcids: amino.limitingAminoAcids,
      preparationContext: "Dry matter or fresh weight basis — verify against primary source.",
      confidenceNotes: "Scaffolded nutrition profile — replace with cited analysis.",
      citationKeys: ["shah2014", "valverde2015"],
    },
    geographic: {
      nativeRange: `Native range of ${scientificName} — update from GBIF or primary literature.`,
      cultivatedRegions: "Update with commercial cultivation regions.",
      habitat: "Update with habitat description.",
      gbifUrl: `https://www.gbif.org/species/search?q=${encodeURIComponent(scientificName)}`,
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "TBD",
        catalogUrl: "https://www.atcc.org/",
        availabilityNotes: `Add verified culture collection strain for ${scientificName}.`,
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Agaricus_bisporus_01.jpg/640px-Agaricus_bisporus_01.jpg",
        caption: `${scientificName} — replace with species-specific Wikimedia Commons image`,
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons (placeholder)",
        imageCategory: "organism",
      },
    ],
    commercialUse: {
      meatAlternativeUse,
      commercialStatus: meatAlternativeUse
        ? "commercial_food"
        : isWholeFoodMushroom
          ? "commercial_food"
          : "research_only",
      applicationSummary: isWholeFoodMushroom
        ? `${scientificName} is consumed as whole mushroom (fresh, cooked, or dried) and may be used in hybrid alt-protein products.`
        : `${scientificName} alt-protein applications — update with commercial context.`,
      companies: [],
      productionProcess: production,
      confidenceNotes: "Scaffolded commercial summary — add companies and citations.",
      citationKeys: ["shah2014"],
    },
    morphology3D: defaultMorphology3D(cultivationType),
    regulatory: {
      fda: isWholeFoodMushroom ? "traditional_food" : "not_evaluated",
      efsa: isWholeFoodMushroom ? "approved_safe" : "not_evaluated",
      notes: `Regulatory status for ${scientificName} — verify FDA/EFSA classification.`,
    },
    speciesCitationKeys: ["shah2014", "valverde2015"],
  };

  return {
    species,
    altProteinResearch: defaultResearch(scientificName, slug),
  };
}
