import type {
  CommercialStatus,
  HyphalType,
  ImageCategory,
  MeatAnalogPotential,
  VerificationStatus,
} from "../../src/generated/prisma/client";
import type { RegulatoryStatus } from "../../src/generated/prisma/client";
import type { AminoAcidBasis, AminoAcids, MorphologyParameters } from "../../src/lib/types";

export type SpeciesSeed = {
  slug: string;
  genus: string;
  speciesEpithet: string;
  scientificName: string;
  commonNames: string[];
  synonyms?: string[];
  mycobankId?: string;
  ncbiTaxonomyId: string;
  taxonomy: {
    kingdom?: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
  };
  sensory: {
    tasteAxes: Record<string, number>;
    textureAxes: Record<string, number>;
    aromaNotes?: string;
    meatAnalogPotential: MeatAnalogPotential;
    meatAnalogRationale?: string;
    preparationContext?: string;
    confidenceNotes?: string;
    citationKeys: string[];
  };
  morphology: {
    hyphalType: HyphalType;
    cellWallComposition?: string;
    fruitingBodyStructure?: string;
    sporeCharacteristics?: string;
    microscopyNotes?: string;
  };
  nutrition: {
    proteinPercent?: number;
    fiberPercent?: number;
    fatPercent?: number;
    moisturePercent?: number;
    aminoAcids?: AminoAcids;
    aminoAcidBasis?: AminoAcidBasis;
    pdcaas?: number;
    diaas?: number;
    limitingAminoAcids?: string;
    preparationContext?: string;
    confidenceNotes?: string;
    citationKeys: string[];
  };
  geographic: {
    nativeRange: string;
    cultivatedRegions?: string;
    habitat?: string;
    gbifUrl?: string;
  };
  strains: {
    collectionName: string;
    strainId: string;
    catalogUrl: string;
    availabilityNotes?: string;
  }[];
  images: {
    url: string;
    caption: string;
    license: string;
    attributionText: string;
    sourceUrl?: string;
    imageCategory?: ImageCategory;
    citationKeys?: string[];
  }[];
  commercialUse?: {
    meatAlternativeUse: boolean;
    applicationSummary: string;
    commercialStatus: CommercialStatus;
    companies: {
      name: string;
      products?: string[];
      website?: string;
      notes?: string;
      region?: string;
    }[];
    productionProcess?: {
      title: string;
      description: string;
      learnMoreUrl?: string;
      learnMoreLabel?: string;
    }[];
    confidenceNotes?: string;
    citationKeys: string[];
  };
  morphology3D: MorphologyParameters;
  regulatory?: {
    fda: RegulatoryStatus;
    efsa: RegulatoryStatus;
    notes?: string;
  };
  speciesCitationKeys: string[];
};

const verified: VerificationStatus = "peer_reviewed";

export const speciesData: SpeciesSeed[] = [
  {
    slug: "fusarium-venenatum",
    genus: "Fusarium",
    speciesEpithet: "venenatum",
    scientificName: "Fusarium venenatum",
    commonNames: ["Quorn fungus", "mycoprotein fungus"],
    ncbiTaxonomyId: "56646",
    mycobankId: "MB361251",
    taxonomy: {
      phylum: "Ascomycota",
      class: "Sordariomycetes",
      order: "Hypocreales",
      family: "Nectriaceae",
      genus: "Fusarium",
    },
    sensory: {
      tasteAxes: { umami: 3, earthy: 2, neutral: 4 },
      textureAxes: { fibrous: 5, chewy: 4, meat_like: 5 },
      aromaNotes: "Mild, neutral aroma after processing; faint fungal note in raw biomass",
      meatAnalogPotential: "high",
      meatAnalogRationale:
        "Commercial Quorn mycoprotein; fibrous hyphal network mimics meat bite after texturization",
      preparationContext: "Submerged fermentation biomass, heat-treated, bound with egg albumen",
      confidenceNotes: "Sensory scores from product literature and review panels cited",
      citationKeys: ["finnigan2018", "quorn_patent"],
    },
    morphology: {
      hyphalType: "septate",
      cellWallComposition: "Chitin, beta-glucans, mannoproteins",
      fruitingBodyStructure: "Not produced in commercial fermentation; filamentous mycelium only",
      sporeCharacteristics: "Macroconidia and microconidia in wild type; not relevant to food product",
      microscopyNotes: "Branching septate hyphae 5-15 um diameter in submerged culture",
    },
    nutrition: {
      proteinPercent: 44,
      fiberPercent: 13,
      fatPercent: 2,
      moisturePercent: 75,
      aminoAcidBasis: "per_100g_protein",
      aminoAcids: {
        histidine: 2.5,
        isoleucine: 4.0,
        leucine: 6.5,
        lysine: 5.8,
        methionine: 1.5,
        cystine: 1.0,
        phenylalanine: 3.8,
        threonine: 4.2,
        tryptophan: 1.1,
        valine: 4.9,
        alanine: 4.3,
        arginine: 3.9,
        aspartic_acid: 5.4,
        glutamic_acid: 6.6,
        glycine: 3.4,
        proline: 2.7,
        serine: 3.8,
        tyrosine: 3.1,
      },
      pdcaas: 0.996,
      limitingAminoAcids: "Methionine + cysteine",
      preparationContext: "As-sold mycoprotein pieces (dry matter basis ~11% protein fresh weight)",
      confidenceNotes:
        "Macros on dry matter basis (Finnigan 2018). Amino acids g/100 g protein from Edwards (1993), cited in Finnigan (2018). PDCAAS 0.996 from ileal digestibility study (Edwards & Cummings 2010). Human DIAAS not yet reported in primary literature.",
      citationKeys: ["finnigan2018", "edwards1993", "edwards2010"],
    },
    geographic: {
      nativeRange:
        "Marlow Bottom, Buckinghamshire, United Kingdom — soil/compost heap isolate (strain A3/5, discovered 1967–1968 by Rank Hovis McDougall screening programme)",
      cultivatedRegions:
        "Industrial submerged fermentation: UK, USA, Netherlands, and other Quorn production facilities worldwide",
      habitat:
        "Soil-dwelling saprotroph in nature; commercial mycoprotein produced in aerobic fermenters (not wild-harvested food)",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "20334",
        catalogUrl: "https://www.atcc.org/products/20334",
        availabilityNotes: "Fusarium venenatum type strain",
      },
      {
        collectionName: "CBS",
        strainId: "130.52",
        catalogUrl: "https://www.westerdijkinstitute.nl/Collections/Details/227484",
        availabilityNotes: "Westerdijk collection",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/8/86/Microconidia_and_conidiophores_of_Fusarium.png",
        caption:
          "Fusarium microconidia and conidiophores (lactophenol cotton blue stain; genus-level morphology representative of F. venenatum)",
        license: "CC BY-SA 4.0",
        attributionText: "Wikimedia Commons",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Microconidia_and_conidiophores_of_Fusarium.png",
        imageCategory: "microscopy",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/d/db/Fusarium_solani_%28257_25%29_Cultured_and_stained_deuteromycetes.jpg",
        caption:
          "Cultured and stained Fusarium hyphae (reference image for septate filamentous morphology; F. solani)",
        license: "Public domain",
        attributionText: "CDC / Wikimedia Commons",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Fusarium_solani_(257_25)_Cultured_and_stained_deuteromycetes.jpg",
        imageCategory: "microscopy",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Quorn-different-forms.jpg",
        caption:
          "Quorn mycoprotein fillets (fried, defrosted, and frozen) — retail meat analog products from F. venenatum biomass",
        license: "CC BY-SA 3.0",
        attributionText: "Jan Ainali / Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Quorn-different-forms.jpg",
        imageCategory: "commercial_product",
        citationKeys: ["finnigan2018"],
      },
    ],
    morphology3D: {
      visualizationStyle: "microscopy",
      stainColor: "#3b6ea8",
      backgroundColor: "#f4f1ea",
      hyphaeBranchAngle: 42,
      hyphaeThickness: 0.012,
      hyphaeColor: "#3b6ea8",
      hyphaeDensity: 16,
      fruitingBodyType: "none",
      capDiameter: 0,
      stipeLength: 0,
      capColor: "#8b7355",
      showMycelium: true,
      showFruitingBody: false,
    },
    speciesCitationKeys: ["finnigan2018", "wardley1977", "quorn_patent"],
  },
  {
    slug: "pleurotus-ostreatus",
    genus: "Pleurotus",
    speciesEpithet: "ostreatus",
    scientificName: "Pleurotus ostreatus",
    commonNames: ["oyster mushroom", "hiratake"],
    ncbiTaxonomyId: "5322",
    mycobankId: "MB300465",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Agaricomycetes",
      order: "Agaricales",
      family: "Pleurotaceae",
      genus: "Pleurotus",
    },
    sensory: {
      tasteAxes: { umami: 4, earthy: 3, sweet: 1 },
      textureAxes: { tender: 3, chewy: 3, fibrous: 2 },
      aromaNotes: "Mild anise-like when fresh; intensifies on cooking",
      meatAnalogPotential: "moderate",
      meatAnalogRationale: "Used in meat analog research; fibrous cap texture when shredded",
      preparationContext: "Fresh fruiting body, sauteed or grilled",
      citationKeys: ["manzi2013", "valverde2015"],
    },
    morphology: {
      hyphalType: "septate",
      cellWallComposition: "Chitin, glucans",
      fruitingBodyStructure: "Shelf-like cap with eccentric stipe; gills decurrent",
      sporeCharacteristics: "White to lilac-gray spore print",
    },
    nutrition: {
      proteinPercent: 27,
      fiberPercent: 22,
      fatPercent: 2,
      moisturePercent: 89,
      preparationContext: "Fresh fruiting bodies, dry weight basis",
      citationKeys: ["manzi2013"],
    },
    geographic: {
      nativeRange: "Temperate and subtropical forests worldwide",
      cultivatedRegions: "Global commercial cultivation",
      habitat: "Saprotrophic on hardwood logs and substrates",
      gbifUrl: "https://www.gbif.org/species/5240498",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "28207",
        catalogUrl: "https://www.atcc.org/products/28207",
      },
      {
        collectionName: "CBS",
        strainId: "144.97",
        catalogUrl: "https://www.westerdijkinstitute.nl/Collections/Details/227484",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Pleurotus_ostreatus_JPG1.jpg/640px-Pleurotus_ostreatus_JPG1.jpg",
        caption: "Oyster mushroom fruiting bodies",
        license: "CC BY-SA 3.0",
        attributionText: "Jean-Pol GRANDMONT",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus_JPG1.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 45,
      hyphaeThickness: 0.02,
      hyphaeColor: "#f0e6d2",
      hyphaeDensity: 8,
      fruitingBodyType: "mushroom",
      capDiameter: 8,
      stipeLength: 2,
      capColor: "#c4b5a0",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["manzi2013", "valverde2015"],
  },
  {
    slug: "pleurotus-eryngii",
    genus: "Pleurotus",
    speciesEpithet: "eryngii",
    scientificName: "Pleurotus eryngii",
    commonNames: ["king oyster", "king trumpet mushroom"],
    ncbiTaxonomyId: "87942",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Agaricomycetes",
      order: "Agaricales",
      family: "Pleurotaceae",
      genus: "Pleurotus",
    },
    sensory: {
      tasteAxes: { umami: 4, earthy: 2, nutty: 2 },
      textureAxes: { firm: 5, chewy: 4, meat_like: 4 },
      meatAnalogPotential: "high",
      meatAnalogRationale: "Dense stipe texture frequently used as scallop/chicken analog",
      preparationContext: "Sliced stipe, grilled or pan-seared",
      citationKeys: ["bao2008", "valverde2015"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Large stipe with small tan cap; gills decurrent",
    },
    nutrition: {
      proteinPercent: 24,
      fiberPercent: 18,
      fatPercent: 2,
      moisturePercent: 88,
      citationKeys: ["bao2008"],
    },
    geographic: {
      nativeRange: "Mediterranean, North Africa, Middle East",
      cultivatedRegions: "East Asia, Europe, North America",
      habitat: "Associated with Eryngium plant roots",
      gbifUrl: "https://www.gbif.org/species/5240501",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "90797",
        catalogUrl: "https://www.atcc.org/products/90797",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Pleurotus_eryngii_01.jpg/640px-Pleurotus_eryngii_01.jpg",
        caption: "King oyster mushroom",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Pleurotus_eryngii_01.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 40,
      hyphaeThickness: 0.025,
      hyphaeColor: "#ede4d3",
      hyphaeDensity: 8,
      fruitingBodyType: "mushroom",
      capDiameter: 4,
      stipeLength: 12,
      capColor: "#d4c4a8",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["bao2008", "valverde2015"],
  },
  {
    slug: "hericium-erinaceus",
    genus: "Hericium",
    speciesEpithet: "erinaceus",
    scientificName: "Hericium erinaceus",
    commonNames: ["lion's mane", "yamabushitake"],
    ncbiTaxonomyId: "91752",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Agaricomycetes",
      order: "Russulales",
      family: "Hericiaceae",
      genus: "Hericium",
    },
    sensory: {
      tasteAxes: { umami: 3, sweet: 1, seafood: 2 },
      textureAxes: { tender: 4, fibrous: 3, flaky: 4, meat_like: 3 },
      aromaNotes: "Crab/lobster-like when cooked per culinary literature",
      meatAnalogPotential: "moderate",
      meatAnalogRationale: "Fibrous icicle-like spines create flaky crab-like texture when sauteed",
      citationKeys: ["wong2018", "valverde2015"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Cascading icicle-like spines; no distinct cap/stipe",
      sporeCharacteristics: "White spore print",
    },
    nutrition: {
      proteinPercent: 22,
      fiberPercent: 35,
      fatPercent: 3,
      moisturePercent: 90,
      citationKeys: ["wong2018"],
    },
    geographic: {
      nativeRange: "North America, Europe, East Asia",
      cultivatedRegions: "China, Japan, USA, Europe",
      habitat: "Hardwood saprotroph",
      gbifUrl: "https://www.gbif.org/species/5245478",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "62337",
        catalogUrl: "https://www.atcc.org/products/62337",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Hericium_erinaceus_1.jpg/640px-Hericium_erinaceus_1.jpg",
        caption: "Lion's mane fruiting body",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Hericium_erinaceus_1.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 25,
      hyphaeThickness: 0.02,
      hyphaeColor: "#faf6f0",
      hyphaeDensity: 10,
      fruitingBodyType: "coral",
      capDiameter: 6,
      stipeLength: 0,
      capColor: "#f5f0e8",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["wong2018"],
  },
  {
    slug: "agaricus-bisporus",
    genus: "Agaricus",
    speciesEpithet: "bisporus",
    scientificName: "Agaricus bisporus",
    commonNames: ["button mushroom", "portobello", "cremini"],
    ncbiTaxonomyId: "5340",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Agaricomycetes",
      order: "Agaricales",
      family: "Agaricaceae",
      genus: "Agaricus",
    },
    sensory: {
      tasteAxes: { umami: 4, earthy: 3 },
      textureAxes: { tender: 3, firm: 3, juicy: 2 },
      meatAnalogPotential: "low",
      meatAnalogRationale: "Baseline culinary mushroom; moderate fiber but soft texture",
      citationKeys: ["shah2014", "valverde2015"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Convex cap with central stipe; pink to dark brown gills",
    },
    nutrition: {
      proteinPercent: 30,
      fiberPercent: 10,
      fatPercent: 1,
      moisturePercent: 92,
      citationKeys: ["shah2014"],
    },
    geographic: {
      nativeRange: "Grasslands of Europe and North America",
      cultivatedRegions: "Worldwide — largest cultivated mushroom species",
      gbifUrl: "https://www.gbif.org/species/5240495",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "62462",
        catalogUrl: "https://www.atcc.org/products/62462",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Agaricus_bisporus_01.jpg/640px-Agaricus_bisporus_01.jpg",
        caption: "Button mushrooms",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Agaricus_bisporus_01.jpg",
      },
    ],
    morphology3D: {
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
    },
    speciesCitationKeys: ["shah2014", "valverde2015"],
  },
  {
    slug: "lentinula-edodes",
    genus: "Lentinula",
    speciesEpithet: "edodes",
    scientificName: "Lentinula edodes",
    commonNames: ["shiitake", "shiitake mushroom"],
    ncbiTaxonomyId: "5353",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Agaricomycetes",
      order: "Agaricales",
      family: "Omphalotaceae",
      genus: "Lentinula",
    },
    sensory: {
      tasteAxes: { umami: 5, smoky: 2, earthy: 3 },
      textureAxes: { chewy: 4, firm: 3, fibrous: 2 },
      aromaNotes: "Sulfur compounds (lentinan, lentinan precursors) contribute to umami",
      meatAnalogPotential: "moderate",
      meatAnalogRationale: "High umami; chewy cap used in plant-forward dishes",
      citationKeys: ["bao2013", "valverde2015"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Brown scaly cap with white gills; tough fibrous stipe",
    },
    nutrition: {
      proteinPercent: 26,
      fiberPercent: 28,
      fatPercent: 1,
      moisturePercent: 90,
      citationKeys: ["bao2013"],
    },
    geographic: {
      nativeRange: "East Asia",
      cultivatedRegions: "Japan, China, Korea, worldwide",
      habitat: "Dead hardwood logs",
      gbifUrl: "https://www.gbif.org/species/5240505",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "58765",
        catalogUrl: "https://www.atcc.org/products/58765",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Shiitakegrowing.jpg/640px-Shiitakegrowing.jpg",
        caption: "Shiitake growing on log",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Shiitakegrowing.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 42,
      hyphaeThickness: 0.022,
      hyphaeColor: "#e6ddd0",
      hyphaeDensity: 8,
      fruitingBodyType: "mushroom",
      capDiameter: 7,
      stipeLength: 4,
      capColor: "#8b6914",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["bao2013"],
  },
  {
    slug: "ganoderma-lucidum",
    genus: "Ganoderma",
    speciesEpithet: "lucidum",
    scientificName: "Ganoderma lucidum",
    commonNames: ["reishi", "lingzhi"],
    ncbiTaxonomyId: "5315",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Agaricomycetes",
      order: "Polyporales",
      family: "Ganodermataceae",
      genus: "Ganoderma",
    },
    sensory: {
      tasteAxes: { bitter: 4, earthy: 3 },
      textureAxes: { woody: 5, tough: 5 },
      meatAnalogPotential: "low",
      meatAnalogRationale: "Woody texture; functional food rather than meat analog",
      citationKeys: ["sanodiya2010"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Kidney-shaped lacquered cap; woody texture",
    },
    nutrition: {
      proteinPercent: 15,
      fiberPercent: 38,
      fatPercent: 2,
      moisturePercent: 85,
      confidenceNotes: "Varies by growth stage; woody fruiting body",
      citationKeys: ["sanodiya2010"],
    },
    geographic: {
      nativeRange: "East Asia",
      cultivatedRegions: "China, Japan, Korea, USA",
      gbifUrl: "https://www.gbif.org/species/5240496",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "52492",
        catalogUrl: "https://www.atcc.org/products/52492",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Ganoderma_lucidum_01.jpg/640px-Ganoderma_lucidum_01.jpg",
        caption: "Reishi fruiting body",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Ganoderma_lucidum_01.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 30,
      hyphaeThickness: 0.025,
      hyphaeColor: "#d4c8b8",
      hyphaeDensity: 6,
      fruitingBodyType: "mushroom",
      capDiameter: 10,
      stipeLength: 1,
      capColor: "#8b2500",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["sanodiya2010"],
  },
  {
    slug: "tremella-fuciformis",
    genus: "Tremella",
    speciesEpithet: "fuciformis",
    scientificName: "Tremella fuciformis",
    commonNames: ["snow fungus", "silver ear mushroom", "white jelly mushroom"],
    ncbiTaxonomyId: "5214",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Tremellomycetes",
      order: "Tremellales",
      family: "Tremellaceae",
      genus: "Tremella",
    },
    sensory: {
      tasteAxes: { neutral: 3, sweet: 1 },
      textureAxes: { gelatinous: 5, slippery: 4, tender: 4 },
      meatAnalogPotential: "low",
      meatAnalogRationale: "Hydrocolloid applications; gelatinous not meat-like",
      citationKeys: ["mao2015"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Translucent gelatinous lobes; brain-like form",
    },
    nutrition: {
      proteinPercent: 5,
      fiberPercent: 45,
      fatPercent: 1,
      moisturePercent: 95,
      citationKeys: ["mao2015"],
    },
    geographic: {
      nativeRange: "Tropics and subtropics; East Asia",
      cultivatedRegions: "China, Taiwan, Southeast Asia",
      gbifUrl: "https://www.gbif.org/species/5240510",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "20432",
        catalogUrl: "https://www.atcc.org/products/20432",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tremella_fuciformis_337693.jpg/640px-Tremella_fuciformis_337693.jpg",
        caption: "Snow fungus",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Tremella_fuciformis_337693.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 20,
      hyphaeThickness: 0.015,
      hyphaeColor: "#f8f4f0",
      hyphaeDensity: 6,
      fruitingBodyType: "jelly",
      capDiameter: 8,
      stipeLength: 0,
      capColor: "#f0ece8",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["mao2015"],
  },
  {
    slug: "grifola-frondosa",
    genus: "Grifola",
    speciesEpithet: "frondosa",
    scientificName: "Grifola frondosa",
    commonNames: ["maitake", "hen of the woods"],
    ncbiTaxonomyId: "5626",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Agaricomycetes",
      order: "Polyporales",
      family: "Meripilaceae",
      genus: "Grifola",
    },
    sensory: {
      tasteAxes: { umami: 4, earthy: 3 },
      textureAxes: { tender: 3, fibrous: 2, layered: 4 },
      meatAnalogPotential: "moderate",
      meatAnalogRationale: "Layered fronds with firm bite when seared",
      citationKeys: ["guo2015", "valverde2015"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Overlapping fan-shaped caps from branched stipe",
    },
    nutrition: {
      proteinPercent: 14,
      fiberPercent: 25,
      fatPercent: 1,
      moisturePercent: 90,
      citationKeys: ["guo2015"],
    },
    geographic: {
      nativeRange: "Northeastern North America, Japan, China",
      cultivatedRegions: "Japan, USA, China",
      gbifUrl: "https://www.gbif.org/species/5240499",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "46506",
        catalogUrl: "https://www.atcc.org/products/46506",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Grifola_frondosa_338983.jpg/640px-Grifola_frondosa_338983.jpg",
        caption: "Maitake cluster",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Grifola_frondosa_338983.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 50,
      hyphaeThickness: 0.02,
      hyphaeColor: "#e0d8cc",
      hyphaeDensity: 9,
      fruitingBodyType: "coral",
      capDiameter: 12,
      stipeLength: 3,
      capColor: "#c8b898",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["guo2015"],
  },
  {
    slug: "volvariella-volvacea",
    genus: "Volvariella",
    speciesEpithet: "volvacea",
    scientificName: "Volvariella volvacea",
    commonNames: ["straw mushroom", "paddy straw mushroom"],
    ncbiTaxonomyId: "71944",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Agaricomycetes",
      order: "Agaricales",
      family: "Pluteaceae",
      genus: "Volvariella",
    },
    sensory: {
      tasteAxes: { umami: 3, earthy: 2 },
      textureAxes: { tender: 4, smooth: 3 },
      meatAnalogPotential: "low",
      citationKeys: ["chang2008", "barros2008"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Egg-shaped volva; gray-pink gills; dark spores",
    },
    nutrition: {
      proteinPercent: 32,
      fiberPercent: 15,
      fatPercent: 2,
      moisturePercent: 90,
      citationKeys: ["barros2008"],
    },
    geographic: {
      nativeRange: "Southeast Asia",
      cultivatedRegions: "Thailand, China, Vietnam, Philippines",
      habitat: "Composted rice straw beds",
      gbifUrl: "https://www.gbif.org/species/5240512",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "27868",
        catalogUrl: "https://www.atcc.org/products/27868",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Volvariella_volvacea_01.jpg/640px-Volvariella_volvacea_01.jpg",
        caption: "Straw mushroom",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Volvariella_volvacea_01.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 45,
      hyphaeThickness: 0.02,
      hyphaeColor: "#ebe4d8",
      hyphaeDensity: 7,
      fruitingBodyType: "mushroom",
      capDiameter: 5,
      stipeLength: 6,
      capColor: "#d8c8a8",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["chang2008"],
  },
  {
    slug: "auricularia-auricula-judae",
    genus: "Auricularia",
    speciesEpithet: "auricula-judae",
    scientificName: "Auricularia auricula-judae",
    commonNames: ["wood ear", "jelly ear", "tree ear"],
    ncbiTaxonomyId: "5217",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Agaricomycetes",
      order: "Auriculariales",
      family: "Auriculariaceae",
      genus: "Auricularia",
    },
    sensory: {
      tasteAxes: { neutral: 3, earthy: 1 },
      textureAxes: { gelatinous: 4, crunchy: 3, chewy: 3 },
      meatAnalogPotential: "low",
      meatAnalogRationale: "Crunchy-gelatinous texture; culinary not meat substitute",
      citationKeys: ["barros2008", "valverde2015"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Ear-shaped rubbery fruiting body; no gills",
    },
    nutrition: {
      proteinPercent: 8,
      fiberPercent: 50,
      fatPercent: 1,
      moisturePercent: 92,
      citationKeys: ["barros2008"],
    },
    geographic: {
      nativeRange: "Worldwide temperate regions",
      cultivatedRegions: "China — major producer",
      gbifUrl: "https://www.gbif.org/species/5240494",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "56479",
        catalogUrl: "https://www.atcc.org/products/56479",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Auricularia_auricula-judae_337693.jpg/640px-Auricularia_auricula-judae_337693.jpg",
        caption: "Wood ear fungus",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Auricularia_auricula-judae_337693.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 35,
      hyphaeThickness: 0.018,
      hyphaeColor: "#3d2817",
      hyphaeDensity: 7,
      fruitingBodyType: "jelly",
      capDiameter: 6,
      stipeLength: 0,
      capColor: "#4a3020",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["barros2008"],
  },
  {
    slug: "aspergillus-oryzae",
    genus: "Aspergillus",
    speciesEpithet: "oryzae",
    scientificName: "Aspergillus oryzae",
    commonNames: ["koji mold", "yellow koji"],
    ncbiTaxonomyId: "5062",
    taxonomy: {
      phylum: "Ascomycota",
      class: "Eurotiomycetes",
      order: "Eurotiales",
      family: "Aspergillaceae",
      genus: "Aspergillus",
    },
    sensory: {
      tasteAxes: { umami: 4, sweet: 2 },
      textureAxes: { powdery: 3 },
      aromaNotes: "Enzyme-rich koji; sweet/nutty aroma during saccharification",
      meatAnalogPotential: "unknown",
      meatAnalogRationale: "Fermentation platform for miso, sake, soy sauce — not direct meat analog",
      preparationContext: "Solid-state fermentation on rice/barley (koji)",
      citationKeys: ["machida2008"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Conidial heads on conidiophores; no mushroom",
      sporeCharacteristics: "Green-yellow conidia",
    },
    nutrition: {
      proteinPercent: 12,
      fiberPercent: 8,
      preparationContext: "Koji-fermented grain substrate",
      confidenceNotes: "Nutrition depends heavily on substrate",
      citationKeys: ["machida2008"],
    },
    geographic: {
      nativeRange: "East Asia",
      cultivatedRegions: "Japan, China, Korea, worldwide for fermentation",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "42149",
        catalogUrl: "https://www.atcc.org/products/42149",
      },
      {
        collectionName: "CBS",
        strainId: "564.65",
        catalogUrl: "https://www.westerdijkinstitute.nl/Collections/Details/227484",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Aspergillus_oryzae_01.jpg/640px-Aspergillus_oryzae_01.jpg",
        caption: "Aspergillus oryzae microscopy/colony",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Aspergillus_oryzae_01.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 40,
      hyphaeThickness: 0.02,
      hyphaeColor: "#f5e6a8",
      hyphaeDensity: 14,
      fruitingBodyType: "none",
      capDiameter: 0,
      stipeLength: 0,
      capColor: "#d4a820",
      showMycelium: true,
      showFruitingBody: false,
    },
    speciesCitationKeys: ["machida2008"],
  },
  {
    slug: "rhizopus-oligosporus",
    genus: "Rhizopus",
    speciesEpithet: "oligosporus",
    scientificName: "Rhizopus oligosporus",
    commonNames: ["tempeh mold", "tempeh starter"],
    ncbiTaxonomyId: "64495",
    taxonomy: {
      phylum: "Mucoromycota",
      class: "Mucoromycetes",
      order: "Mucorales",
      family: "Rhizopodaceae",
      genus: "Rhizopus",
    },
    sensory: {
      tasteAxes: { umami: 3, nutty: 3, earthy: 2 },
      textureAxes: { firm: 4, cohesive: 5 },
      meatAnalogPotential: "moderate",
      meatAnalogRationale: "Mycelium binds soybean matrix into firm sliceable cake",
      preparationContext: "Solid-state fermentation of dehulled soybeans (tempeh)",
      citationKeys: ["nout1987", "nout1994"],
    },
    morphology: {
      hyphalType: "coenocytic",
      cellWallComposition: "Chitin, chitosan",
      fruitingBodyStructure: "Sporangia on sporangiophores; food form is mycelium-bound matrix",
    },
    nutrition: {
      proteinPercent: 19,
      fiberPercent: 9,
      fatPercent: 11,
      preparationContext: "Finished tempeh product",
      citationKeys: ["nout1987"],
    },
    geographic: {
      nativeRange: "Indonesia (traditional origin)",
      cultivatedRegions: "Indonesia, USA, Europe — tempeh production",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "22959",
        catalogUrl: "https://www.atcc.org/products/22959",
      },
      {
        collectionName: "CBS",
        strainId: "810.71",
        catalogUrl: "https://www.westerdijkinstitute.nl/Collections/Details/227484",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Tempeh_001.jpg/640px-Tempeh_001.jpg",
        caption: "Tempeh (Rhizopus-fermented soybeans)",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Tempeh_001.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 55,
      hyphaeThickness: 0.035,
      hyphaeColor: "#f0ebe0",
      hyphaeDensity: 15,
      fruitingBodyType: "none",
      capDiameter: 0,
      stipeLength: 0,
      capColor: "#c8b8a0",
      showMycelium: true,
      showFruitingBody: false,
    },
    speciesCitationKeys: ["nout1987", "nout1994"],
  },
  {
    slug: "neurospora-intermedia",
    genus: "Neurospora",
    speciesEpithet: "intermedia",
    scientificName: "Neurospora intermedia",
    commonNames: ["oncom mold", "orange bread mold"],
    ncbiTaxonomyId: "42034",
    taxonomy: {
      phylum: "Ascomycota",
      class: "Sordariomycetes",
      order: "Sordariales",
      family: "Sordariaceae",
      genus: "Neurospora",
    },
    sensory: {
      tasteAxes: { umami: 2, nutty: 3 },
      textureAxes: { cohesive: 4, crumbly: 2 },
      meatAnalogPotential: "low",
      meatAnalogRationale: "Traditional oncom product; peanut/legume cake not meat analog",
      preparationContext: "Fermented peanut press cake (oncom)",
      citationKeys: ["davis2000"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Perithecia in wild type; food form is mycelium-permeated cake",
    },
    nutrition: {
      proteinPercent: 20,
      preparationContext: "Oncom from peanut press cake",
      confidenceNotes: "Varies with legume substrate",
      citationKeys: ["davis2000"],
    },
    geographic: {
      nativeRange: "West Java, Indonesia",
      cultivatedRegions: "Indonesia (Sundanese cuisine)",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "9635",
        catalogUrl: "https://www.atcc.org/products/9635",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Neurospora_crassa.jpg/640px-Neurospora_crassa.jpg",
        caption: "Neurospora species colony (related N. crassa shown)",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Neurospora_crassa.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 38,
      hyphaeThickness: 0.025,
      hyphaeColor: "#ff8c42",
      hyphaeDensity: 12,
      fruitingBodyType: "none",
      capDiameter: 0,
      stipeLength: 0,
      capColor: "#ff6600",
      showMycelium: true,
      showFruitingBody: false,
    },
    speciesCitationKeys: ["davis2000"],
  },
  {
    slug: "trichoderma-reesei",
    genus: "Trichoderma",
    speciesEpithet: "reesei",
    scientificName: "Trichoderma reesei",
    commonNames: ["industrial cellulase producer"],
    ncbiTaxonomyId: "51453",
    taxonomy: {
      phylum: "Ascomycota",
      class: "Sordariomycetes",
      order: "Hypocreales",
      family: "Hypocreaceae",
      genus: "Trichoderma",
    },
    sensory: {
      tasteAxes: {},
      textureAxes: {},
      meatAnalogPotential: "unknown",
      meatAnalogRationale: "Industrial enzyme production; not a direct food organism",
      confidenceNotes: "Not consumed as food; included for fermentation research context",
      citationKeys: ["martinez2008"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Conidia on branched conidiophores",
    },
    nutrition: {
      confidenceNotes: "Not applicable — industrial fermentation organism",
      citationKeys: ["martinez2008"],
    },
    geographic: {
      nativeRange: "Solomon Islands (original isolate QM6a)",
      cultivatedRegions: "Industrial biotech facilities worldwide",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "13631",
        catalogUrl: "https://www.atcc.org/products/13631",
        availabilityNotes: "QM6a type strain",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Trichoderma_reesei.jpg/640px-Trichoderma_reesei.jpg",
        caption: "Trichoderma reesei culture",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Trichoderma_reesei.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 42,
      hyphaeThickness: 0.022,
      hyphaeColor: "#e8f0e0",
      hyphaeDensity: 13,
      fruitingBodyType: "none",
      capDiameter: 0,
      stipeLength: 0,
      capColor: "#90b060",
      showMycelium: true,
      showFruitingBody: false,
    },
    speciesCitationKeys: ["martinez2008"],
  },
  {
    slug: "ustilago-maydis",
    genus: "Ustilago",
    speciesEpithet: "maydis",
    scientificName: "Ustilago maydis",
    commonNames: ["huitlacoche", "corn smut", "cuitlacoche"],
    ncbiTaxonomyId: "5270",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Ustilaginomycetes",
      order: "Ustilaginales",
      family: "Ustilaginaceae",
      genus: "Ustilago",
    },
    sensory: {
      tasteAxes: { umami: 4, earthy: 3, smoky: 2 },
      textureAxes: { tender: 4, creamy: 3 },
      aromaNotes: "Truffle-like notes reported in culinary literature",
      meatAnalogPotential: "moderate",
      meatAnalogRationale: "Savory umami profile; used as gourmet filling not structural analog",
      citationKeys: ["cruz2011"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Expanded gray-black galls on maize ears",
    },
    nutrition: {
      proteinPercent: 9,
      fiberPercent: 8,
      fatPercent: 4,
      moisturePercent: 82,
      citationKeys: ["cruz2011"],
    },
    geographic: {
      nativeRange: "Mexico, Central America",
      cultivatedRegions: "Mexico, USA (gourmet cultivation on corn)",
      habitat: "Pathogen of Zea mays (corn)",
      gbifUrl: "https://www.gbif.org/species/5240515",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "22901",
        catalogUrl: "https://www.atcc.org/products/22901",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ustilago_maydis_01.jpg/640px-Ustilago_maydis_01.jpg",
        caption: "Corn smut (huitlacoche) on maize",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Ustilago_maydis_01.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 30,
      hyphaeThickness: 0.028,
      hyphaeColor: "#4a4038",
      hyphaeDensity: 10,
      fruitingBodyType: "smut",
      capDiameter: 5,
      stipeLength: 0,
      capColor: "#2a2420",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["cruz2011"],
  },
  {
    slug: "morchella-spp",
    genus: "Morchella",
    speciesEpithet: "spp.",
    scientificName: "Morchella spp.",
    commonNames: ["morel", "yellow morel", "black morel"],
    ncbiTaxonomyId: "117371",
    taxonomy: {
      phylum: "Ascomycota",
      class: "Pezizomycetes",
      order: "Pezizales",
      family: "Morchellaceae",
      genus: "Morchella",
    },
    sensory: {
      tasteAxes: { umami: 4, earthy: 4, nutty: 3 },
      textureAxes: { tender: 3, honeycomb: 4 },
      meatAnalogPotential: "low",
      citationKeys: ["pilz2007", "kalac2016"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Honeycomb-pitted ascocarp; hollow stipe and cap",
    },
    nutrition: {
      proteinPercent: 26,
      fiberPercent: 12,
      fatPercent: 1,
      moisturePercent: 90,
      confidenceNotes: "Aggregated across Morchella species",
      citationKeys: ["pilz2007", "kalac2016"],
    },
    geographic: {
      nativeRange: "Northern temperate forests worldwide",
      cultivatedRegions: "China, USA, France — cultivation expanding",
      habitat: "Mycorrhizal and saprotrophic in forest ecosystems",
      gbifUrl: "https://www.gbif.org/species/5240508",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "64238",
        catalogUrl: "https://www.atcc.org/products/64238",
        availabilityNotes: "Morchella esculenta culture",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Morchella_esculenta_01.jpg/640px-Morchella_esculenta_01.jpg",
        caption: "Yellow morel (Morchella esculenta)",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Morchella_esculenta_01.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 35,
      hyphaeThickness: 0.02,
      hyphaeColor: "#d8c8a0",
      hyphaeDensity: 7,
      fruitingBodyType: "mushroom",
      capDiameter: 5,
      stipeLength: 8,
      capColor: "#c4a060",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["pilz2007", "kalac2016"],
  },
  {
    slug: "calvatia-gigantea",
    genus: "Calvatia",
    speciesEpithet: "gigantea",
    scientificName: "Calvatia gigantea",
    commonNames: ["giant puffball", "langerman"],
    ncbiTaxonomyId: "68788",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Agaricomycetes",
      order: "Agaricales",
      family: "Agaricaceae",
      genus: "Calvatia",
    },
    sensory: {
      tasteAxes: { umami: 2, earthy: 2, mild: 4 },
      textureAxes: { tender: 4, spongy: 4 },
      meatAnalogPotential: "low",
      citationKeys: ["kalac2016", "stamets2005"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Large white globose puffball; gleba turns olive-brown at maturity",
    },
    nutrition: {
      proteinPercent: 18,
      fiberPercent: 20,
      fatPercent: 2,
      moisturePercent: 88,
      citationKeys: ["kalac2016"],
    },
    geographic: {
      nativeRange: "Temperate regions worldwide",
      habitat: "Grasslands, meadows, lawns",
      gbifUrl: "https://www.gbif.org/species/5240493",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "74214",
        catalogUrl: "https://www.atcc.org/products/74214",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Calvatia_gigantea_01.jpg/640px-Calvatia_gigantea_01.jpg",
        caption: "Giant puffball",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Calvatia_gigantea_01.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 40,
      hyphaeThickness: 0.02,
      hyphaeColor: "#f5f0e8",
      hyphaeDensity: 6,
      fruitingBodyType: "puffball",
      capDiameter: 15,
      stipeLength: 0,
      capColor: "#f0ebe0",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["kalac2016", "stamets2005"],
  },
  {
    slug: "coprinus-comatus",
    genus: "Coprinus",
    speciesEpithet: "comatus",
    scientificName: "Coprinus comatus",
    commonNames: ["shaggy mane", "lawyer's wig", "ink cap"],
    ncbiTaxonomyId: "352851",
    taxonomy: {
      phylum: "Basidiomycota",
      class: "Agaricomycetes",
      order: "Agaricales",
      family: "Agaricaceae",
      genus: "Coprinus",
    },
    sensory: {
      tasteAxes: { umami: 2, mild: 3 },
      textureAxes: { tender: 4, delicate: 3 },
      meatAnalogPotential: "low",
      citationKeys: ["barros2008", "kalac2016"],
    },
    morphology: {
      hyphalType: "septate",
      fruitingBodyStructure: "Cylindrical shaggy cap; deliquescing gills",
    },
    nutrition: {
      proteinPercent: 27,
      fiberPercent: 14,
      fatPercent: 2,
      moisturePercent: 92,
      citationKeys: ["barros2008"],
    },
    geographic: {
      nativeRange: "Temperate regions worldwide",
      habitat: "Disturbed ground, roadsides, lawns",
      gbifUrl: "https://www.gbif.org/species/5240497",
    },
    strains: [
      {
        collectionName: "ATCC",
        strainId: "62072",
        catalogUrl: "https://www.atcc.org/products/62072",
      },
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Coprinus_comatus_01.jpg/640px-Coprinus_comatus_01.jpg",
        caption: "Shaggy mane mushroom",
        license: "CC BY-SA 3.0",
        attributionText: "Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Coprinus_comatus_01.jpg",
      },
    ],
    morphology3D: {
      hyphaeBranchAngle: 45,
      hyphaeThickness: 0.02,
      hyphaeColor: "#f0ebe4",
      hyphaeDensity: 7,
      fruitingBodyType: "mushroom",
      capDiameter: 4,
      stipeLength: 10,
      capColor: "#f5f0e8",
      showMycelium: true,
      showFruitingBody: true,
    },
    speciesCitationKeys: ["barros2008", "kalac2016"],
  },
];

export { verified };
