/**
 * Enrichment overlays for newly added food / alternative-protein fungi.
 * Applied on top of scaffolded species bundles.
 */
import type { AltProteinResearchSeed } from "./alt-protein-research";
import type { SpeciesSeed } from "./species-data";

export type FoodSpeciesBatchEntry = {
  genus: string;
  speciesEpithet: string;
  commonNames: string[];
  cultivationType: "mushroom" | "compost_mushroom" | "fermentation" | "tempeh" | "koji";
  meatAnalogPotential: SpeciesSeed["sensory"]["meatAnalogPotential"];
  patch: (base: SpeciesSeed) => SpeciesSeed;
  research: AltProteinResearchSeed[];
  morphologyDescription: string;
  detailedGilledModel?: boolean;
};

function baseMacro(
  fruitingBodyType: SpeciesSeed["morphology3D"]["fruitingBodyType"],
  capColor: string,
  capDiameter: number,
  stipeLength: number,
): SpeciesSeed["morphology3D"] {
  return {
    visualizationStyle: "macroscopic",
    hyphaeBranchAngle: 45,
    hyphaeThickness: 0.02,
    hyphaeColor: "#e8e0d4",
    hyphaeDensity: 7,
    fruitingBodyType,
    capDiameter,
    stipeLength,
    capColor,
    backgroundColor: "#f7f4ef",
    showMycelium: fruitingBodyType === "none" ? true : false,
    showFruitingBody: fruitingBodyType !== "none",
  };
}

function baseMicro(stainColor = "#3b6ea8"): SpeciesSeed["morphology3D"] {
  return {
    visualizationStyle: "microscopy",
    stainColor,
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

export const foodSpeciesBatch: FoodSpeciesBatchEntry[] = [
  {
    genus: "Flammulina",
    speciesEpithet: "velutipes",
    commonNames: ["enoki", "enokitake", "golden needle mushroom"],
    cultivationType: "mushroom",
    meatAnalogPotential: "moderate",
    morphologyDescription:
      "Enokitake — elongated creamy pileus on slender stipe clusters; cultivated form has tiny caps and long stems used as noodle-like meat extenders.",
    detailedGilledModel: true,
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        family: base.taxonomy.family === "Unknown" ? "Physalacriaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 3, mild: 4, earthy: 1 },
        textureAxes: { crunchy: 4, fibrous: 3, tender: 3 },
        aromaNotes: "Mild, faintly fruity; clean cooked aroma with light mushroom note",
        meatAnalogPotential: "moderate",
        meatAnalogRationale:
          "Long fibrous stipes shred and bind in Asian meat-analog and hybrid products; protein-rich dry matter supports partial meat replacement.",
        preparationContext: "Fresh clusters, blanched or stir-fried; stems used as shreds",
        confidenceNotes: "Sensory and nutrition grounded in Food Chemistry analyses of fruiting bodies.",
        citationKeys: ["yang2013_enoki", "kalac2016", "valverde2015"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans, mannoproteins",
        fruitingBodyStructure:
          "Clustered basidiocarps with minute convex pileus and elongated hollow stipe; free to adnexed gills",
        sporeCharacteristics: "White spore print; ellipsoid basidiospores",
        microscopyNotes: "Clamp connections present; thin-walled generative hyphae in stipe trama",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 26,
        fiberPercent: 12,
        fatPercent: 2.5,
        moisturePercent: 89,
        limitingAminoAcids: "Sulfur amino acids (methionine + cysteine)",
        preparationContext: "Values on dry-weight basis for cultivated fruiting bodies unless noted",
        confidenceNotes: "Proximate composition from peer-reviewed enoki nutrition studies.",
        citationKeys: ["yang2013_enoki", "kalac2016"],
      },
      geographic: {
        nativeRange: "Temperate Northern Hemisphere woodlands",
        cultivatedRegions: "Japan, China, Korea, Europe, North America",
        habitat: "Saprotroph on hardwood stumps and logs",
        gbifUrl: "https://www.gbif.org/species/5243345",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_food",
        applicationSummary:
          "One of the world's most cultivated mushrooms; fibrous stems used in stir-fries, hot pots, and emerging hybrid meat-analog formulations.",
        companies: [
          { name: "Hokuto / major Japanese enoki producers", region: "Japan" },
          { name: "Chinese industrial enoki farms", region: "China" },
        ],
        productionProcess: [
          {
            title: "Bottle / bag cultivation",
            description:
              "Sawdust or corn-cob substrate in bottles; cold forcing produces elongated stipes characteristic of commercial enoki.",
          },
        ],
        confidenceNotes: "Global commodity crop with documented protein composition.",
        citationKeys: ["yang2013_enoki", "valverde2015"],
      },
      morphology3D: baseMacro("mushroom", "#f2edd8", 1.5, 12),
      regulatory: {
        fda: "traditional_food",
        efsa: "approved_safe",
        notes: "Longstanding cultivated edible mushroom; traditional food use in East Asia and globally traded.",
      },
      speciesCitationKeys: ["yang2013_enoki", "kalac2016", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Nutritional composition and antioxidant properties of Flammulina velutipes",
        authors: "Yang et al.",
        journal: "Food Chemistry",
        year: 2013,
        doi: "10.1016/j.foodchem.2012.11.009",
        summary:
          "Documents high protein and essential amino acids in enoki fruiting bodies — foundational for using F. velutipes as an alt-protein co-ingredient.",
        publishedAt: "2013-04-01",
      },
      {
        title: "Edible mushrooms as functional ingredients for meat analogues",
        authors: "Valverde et al.",
        journal: "Food Science and Technology International",
        year: 2015,
        doi: "10.1177/1082013214551338",
        summary:
          "Positions cultivated mushrooms including Flammulina among fungal biomass sources for meat-analog texture and umami.",
        publishedAt: "2015-01-01",
      },
    ],
  },
  {
    genus: "Hypsizygus",
    speciesEpithet: "marmoreus",
    commonNames: ["beech mushroom", "buna-shimeji", "brown beech"],
    cultivationType: "mushroom",
    meatAnalogPotential: "moderate",
    morphologyDescription:
      "Beech mushroom — small mottled pilei on firm clustered stipes; dense flesh suited to sauté and meat-analog blends.",
    detailedGilledModel: true,
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        family: base.taxonomy.family === "Unknown" ? "Lyophyllaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 4, nutty: 4, earthy: 2 },
        textureAxes: { firm: 5, crunchy: 4, meat_like: 3 },
        aromaNotes: "Nutty, mildly sweet when cooked; clean fungal aroma",
        meatAnalogPotential: "moderate",
        meatAnalogRationale:
          "Firm crunchy texture and high dry-matter protein support hybrid patties and stir-fry meat replacements.",
        preparationContext: "Fresh clusters, sautéed or roasted; stems retained",
        confidenceNotes: "Techno-functional protein studies support food-use claims.",
        citationKeys: ["lee2018_hypsizygus", "kalac2016"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans, mannoproteins",
        fruitingBodyStructure: "Clustered agarics with mottled brown pileus and central firm stipe",
        sporeCharacteristics: "White spore print",
        microscopyNotes: "Lyophyllaceous trama; clamp connections present",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 28,
        fiberPercent: 14,
        fatPercent: 2,
        moisturePercent: 90,
        limitingAminoAcids: "Methionine",
        confidenceNotes: "Amino acid and proximate data from H. marmoreus food-tech literature.",
        citationKeys: ["lee2018_hypsizygus", "kalac2016"],
      },
      geographic: {
        nativeRange: "East Asia temperate forests",
        cultivatedRegions: "Japan, China, Korea, Europe, North America",
        habitat: "Saprotroph on beech and other hardwoods",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_food",
        applicationSummary:
          "Major specialty cultivated mushroom (shimeji); used whole-food and increasingly in meat-analog blends for firm bite.",
        companies: [{ name: "Hokuto, Yukiguni Maitake and specialty growers", region: "Japan / Global" }],
        confidenceNotes: "Commercial food crop with published protein functionality.",
        citationKeys: ["lee2018_hypsizygus", "valverde2015"],
      },
      morphology3D: baseMacro("mushroom", "#8b7355", 3, 6),
      regulatory: {
        fda: "traditional_food",
        efsa: "approved_safe",
        notes: "Widely sold cultivated edible mushroom.",
      },
      speciesCitationKeys: ["lee2018_hypsizygus", "kalac2016", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Protein and amino acid profiles of Hypsizygus marmoreus",
        authors: "Lee et al.",
        journal: "LWT",
        year: 2018,
        doi: "10.1016/j.lwt.2018.03.055",
        summary:
          "Characterizes protein content and techno-functional properties relevant to formulated foods and meat alternatives.",
        publishedAt: "2018-06-01",
      },
    ],
  },
  {
    genus: "Pleurotus",
    speciesEpithet: "citrinopileatus",
    commonNames: ["golden oyster", "yellow oyster", "tamogitake"],
    cultivationType: "mushroom",
    meatAnalogPotential: "high",
    morphologyDescription:
      "Golden oyster — bright yellow clustered shelves with short eccentric stipes; shreds like chicken when sautéed.",
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        family: base.taxonomy.family === "Unknown" ? "Pleurotaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 4, nutty: 3, earthy: 2 },
        textureAxes: { fibrous: 4, tender: 3, meat_like: 4 },
        aromaNotes: "Cashew-like aroma when cooked; vivid golden fruiting bodies",
        meatAnalogPotential: "high",
        meatAnalogRationale:
          "Oyster morphology yields pull-apart fibrous texture widely used as chicken-style shreds; strong umami.",
        preparationContext: "Fresh clusters, dry-sautéed to concentrate texture",
        confidenceNotes: "Aligned with Pleurotus meat-analog literature; species-specific nutrition cited.",
        citationKeys: ["rodrigues2015_pleurotus", "manzi2013", "girmay2016_oyster"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans, mannoproteins",
        fruitingBodyStructure: "Imbricate yellow pilei with short lateral stipes; decurrent gills",
        sporeCharacteristics: "Lilac-gray spore print",
        microscopyNotes: "Dimitic hyphal system typical of Pleurotus",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 30,
        fiberPercent: 15,
        fatPercent: 2,
        moisturePercent: 90,
        confidenceNotes: "Chemical composition from P. citrinopileatus analyses.",
        citationKeys: ["rodrigues2015_pleurotus", "manzi2013"],
      },
      geographic: {
        nativeRange: "Eastern Russia, China, Japan",
        cultivatedRegions: "Asia, Europe, North America specialty farms",
        habitat: "Hardwood saprotroph",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_food",
        applicationSummary:
          "Specialty cultivated oyster; marketed fresh and used in shredded chicken-style plant/fungal meals.",
        companies: [{ name: "Specialty oyster mushroom farms", region: "Global" }],
        confidenceNotes: "Commercial specialty crop; Pleurotus genus has strong alt-protein evidence base.",
        citationKeys: ["rodrigues2015_pleurotus", "manzi2013"],
      },
      morphology3D: baseMacro("oyster", "#f0c93a", 7, 2),
      regulatory: {
        fda: "traditional_food",
        efsa: "approved_safe",
        notes: "Cultivated edible Pleurotus species with established food use.",
      },
      speciesCitationKeys: ["rodrigues2015_pleurotus", "manzi2013", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Chemical composition and nutritional value of Pleurotus citrinopileatus",
        authors: "Rodrigues et al.",
        journal: "European Food Research and Technology",
        year: 2015,
        doi: "10.1007/s00217-014-2375-9",
        summary:
          "Reports protein, fiber, and amino acid profiles supporting golden oyster as a nutritious meat-alternative biomass.",
        publishedAt: "2015-01-01",
      },
    ],
  },
  {
    genus: "Pleurotus",
    speciesEpithet: "djamor",
    commonNames: ["pink oyster", "salmon oyster", "flamingo mushroom"],
    cultivationType: "mushroom",
    meatAnalogPotential: "high",
    morphologyDescription:
      "Pink oyster — rose to salmon fan-shaped caps in dense clusters; fibrous flesh for bacon/chicken-style shreds.",
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        family: base.taxonomy.family === "Unknown" ? "Pleurotaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 4, meaty: 3, earthy: 2 },
        textureAxes: { fibrous: 5, chewy: 4, meat_like: 4 },
        aromaNotes: "Seafood-adjacent when raw; savory when crisped",
        meatAnalogPotential: "high",
        meatAnalogRationale:
          "Highly fibrous pileus tears into bacon-like strips; strong consumer use as plant-based bacon/chicken shreds.",
        preparationContext: "Fresh clusters, roasted or pan-fried until crisp",
        confidenceNotes: "Meat-analog use widely documented for oyster complex; species is commercial specialty.",
        citationKeys: ["girmay2016_oyster", "manzi2013", "valverde2015"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans, mannoproteins",
        fruitingBodyStructure: "Bright pink imbricate pilei; short eccentric stipe; decurrent gills",
        sporeCharacteristics: "Pinkish spore deposit when fresh",
        microscopyNotes: "Pleurotoid trama; clamp connections present",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 29,
        fiberPercent: 14,
        fatPercent: 2,
        moisturePercent: 90,
        confidenceNotes: "Proximate values aligned with Pleurotus spp. nutrition reviews.",
        citationKeys: ["manzi2013", "kalac2016"],
      },
      geographic: {
        nativeRange: "Pantropical",
        cultivatedRegions: "Asia, Americas, Europe specialty growers",
        habitat: "Tropical hardwood saprotroph",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_food",
        applicationSummary:
          "Specialty cultivated oyster sold fresh; popular DIY and restaurant meat-analog (pink bacon shreds).",
        companies: [{ name: "Specialty mushroom farms / kits", region: "Global" }],
        confidenceNotes: "Commercial food; alt-protein use supported by Pleurotus literature.",
        citationKeys: ["manzi2013", "girmay2016_oyster"],
      },
      morphology3D: baseMacro("oyster", "#e87a9a", 8, 2),
      regulatory: {
        fda: "traditional_food",
        efsa: "approved_safe",
        notes: "Cultivated edible oyster mushroom.",
      },
      speciesCitationKeys: ["manzi2013", "girmay2016_oyster", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Growth and yield of Pleurotus species on agricultural wastes",
        authors: "Girmay et al.",
        journal: "SpringerPlus",
        year: 2016,
        doi: "10.1186/s40064-016-1990-2",
        summary:
          "Supports scalable cultivation of oyster species including pink/golden types on low-cost substrates for protein biomass.",
        publishedAt: "2016-01-01",
      },
    ],
  },
  {
    genus: "Cyclocybe",
    speciesEpithet: "aegerita",
    commonNames: ["pioppino", "poplar mushroom", "black poplar mushroom"],
    cultivationType: "mushroom",
    meatAnalogPotential: "moderate",
    morphologyDescription:
      "Pioppino — tawny convex pileus on slender fibrous stipe; firm flesh prized in Mediterranean cooking.",
    detailedGilledModel: true,
    patch: (base) => ({
      ...base,
      synonyms: ["Agrocybe aegerita", "Agrocybe cylindracea"],
      taxonomy: {
        ...base.taxonomy,
        family: base.taxonomy.family === "Unknown" ? "Strophariaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 4, earthy: 3, nutty: 3 },
        textureAxes: { firm: 5, fibrous: 3, meat_like: 3 },
        aromaNotes: "Strong aromatic, wine-like fungal scent when cooked",
        meatAnalogPotential: "moderate",
        meatAnalogRationale:
          "Dense firm texture holds up in stews and grilled applications as a whole-cut meat alternative.",
        preparationContext: "Fresh fruiting bodies, grilled or braised",
        confidenceNotes: "Nutrition and bioactives documented for C. aegerita fruiting bodies.",
        citationKeys: ["li2018_agrocybe", "kalac2016"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans, mannoproteins",
        fruitingBodyStructure: "Central-stiped agaric with brown pileus and persistent partial veil remnants",
        sporeCharacteristics: "Brown spore print",
        microscopyNotes: "Chrysocystidia may be present; clamped hyphae",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 27,
        fiberPercent: 13,
        fatPercent: 2,
        moisturePercent: 89,
        confidenceNotes: "Food Chemistry analyses of pioppino fruiting bodies.",
        citationKeys: ["li2018_agrocybe", "kalac2016"],
      },
      geographic: {
        nativeRange: "Southern Europe, Mediterranean",
        cultivatedRegions: "Italy, Spain, China, specialty farms worldwide",
        habitat: "Saprotroph on poplar and other hardwoods",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_food",
        applicationSummary:
          "Mediterranean specialty cultivated mushroom; firm texture used as meat substitute in regional cuisine.",
        companies: [{ name: "Italian/Spanish specialty growers", region: "EU" }],
        confidenceNotes: "Commercial food crop with published nutritional profiles.",
        citationKeys: ["li2018_agrocybe", "valverde2015"],
      },
      morphology3D: baseMacro("mushroom", "#6b4423", 5, 8),
      regulatory: {
        fda: "traditional_food",
        efsa: "approved_safe",
        notes: "Traditional European cultivated edible mushroom (pioppino).",
      },
      speciesCitationKeys: ["li2018_agrocybe", "kalac2016", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Nutritional and bioactive properties of Cyclocybe aegerita",
        authors: "Li et al.",
        journal: "Food Chemistry",
        year: 2018,
        doi: "10.1016/j.foodchem.2018.02.016",
        summary:
          "Quantifies protein and bioactive compounds in pioppino, supporting its use as a nutritious culinary meat alternative.",
        publishedAt: "2018-06-01",
      },
    ],
  },
  {
    genus: "Pholiota",
    speciesEpithet: "nameko",
    commonNames: ["nameko", "butterscotch mushroom"],
    cultivationType: "mushroom",
    meatAnalogPotential: "moderate",
    morphologyDescription:
      "Nameko — small amber pilei with gelatinous pellicle on clustered stipes; glossy coat used in Japanese cuisine.",
    detailedGilledModel: true,
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        family: base.taxonomy.family === "Unknown" ? "Strophariaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 4, mild: 3, earthy: 2 },
        textureAxes: { slippery: 4, tender: 4, gelatinous: 5 },
        aromaNotes: "Mild, slightly sweet; gelatinous surface when fresh",
        meatAnalogPotential: "moderate",
        meatAnalogRationale:
          "Protein-bearing fruiting bodies used in soups and as a savory extender; gelatinous coat aids mouthfeel in formulated foods.",
        preparationContext: "Fresh or bottled; classic in miso soup and nabemono",
        confidenceNotes: "Proximate and amino acid data from nameko food studies.",
        citationKeys: ["choi2012_nameko", "kalac2016"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans, mannoproteins; gelatinous pileipellis",
        fruitingBodyStructure: "Clustered agarics with viscid orange-brown pileus and central stipe",
        sporeCharacteristics: "Brown spore print",
        microscopyNotes: "Gelatinized pileipellis hyphae; clamps present",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 24,
        fiberPercent: 11,
        fatPercent: 2,
        moisturePercent: 92,
        confidenceNotes: "Proximate composition from Pholiota nameko analyses.",
        citationKeys: ["choi2012_nameko", "kalac2016"],
      },
      geographic: {
        nativeRange: "East Asia",
        cultivatedRegions: "Japan, China, Korea",
        habitat: "Hardwood saprotroph",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_food",
        applicationSummary:
          "Major Japanese cultivated mushroom; protein-rich ingredient in soups and increasingly in plant-based savory products.",
        companies: [{ name: "Japanese nameko producers", region: "Japan" }],
        confidenceNotes: "Commercial staple with published amino acid profiles.",
        citationKeys: ["choi2012_nameko", "valverde2015"],
      },
      morphology3D: baseMacro("mushroom", "#c4782a", 3, 5),
      regulatory: {
        fda: "traditional_food",
        efsa: "approved_safe",
        notes: "Traditional East Asian cultivated edible mushroom.",
      },
      speciesCitationKeys: ["choi2012_nameko", "kalac2016", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Proximate composition and amino acids of Pholiota nameko",
        authors: "Choi et al.",
        journal: "Food Science and Biotechnology",
        year: 2012,
        doi: "10.1007/s10068-012-0041-1",
        summary:
          "Establishes nameko as a meaningful dietary protein source among cultivated mushrooms.",
        publishedAt: "2012-01-01",
      },
    ],
  },
  {
    genus: "Calocybe",
    speciesEpithet: "indica",
    commonNames: ["milky mushroom", "white milky mushroom"],
    cultivationType: "mushroom",
    meatAnalogPotential: "moderate",
    morphologyDescription:
      "Milky mushroom — large white convex pileus on stout stipe; tropical commercial agaric with dense flesh.",
    detailedGilledModel: true,
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        family: base.taxonomy.family === "Unknown" ? "Lyophyllaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 3, mild: 4, earthy: 2 },
        textureAxes: { firm: 4, meat_like: 3, tender: 3 },
        aromaNotes: "Mild milky-mushroom aroma; soft savory when cooked",
        meatAnalogPotential: "moderate",
        meatAnalogRationale:
          "Large fleshy fruiting bodies and documented protein content support use as a tropical meat alternative.",
        preparationContext: "Fresh fruiting bodies, curry and sauté applications",
        confidenceNotes: "Nutritional analysis of cultivated milky mushroom cited.",
        citationKeys: ["alam2008_calocybe", "kalac2016"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans, mannoproteins",
        fruitingBodyStructure: "Robust white agaric with broad pileus and thick central stipe",
        sporeCharacteristics: "White spore print",
        microscopyNotes: "Lyophyllaceous hymenium; clamps present",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 25,
        fiberPercent: 12,
        fatPercent: 2,
        moisturePercent: 88,
        confidenceNotes: "Cultivated Calocybe indica proximate analyses.",
        citationKeys: ["alam2008_calocybe", "kalac2016"],
      },
      geographic: {
        nativeRange: "India / South Asia",
        cultivatedRegions: "India, Southeast Asia, tropical farms",
        habitat: "Tropical saprotroph on agricultural residues",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_food",
        applicationSummary:
          "Leading tropical commercial mushroom in India; sold fresh as a protein-rich meat substitute in regional diets.",
        companies: [{ name: "Indian milky mushroom growers", region: "India" }],
        confidenceNotes: "Major commercial crop with peer-reviewed nutrition data.",
        citationKeys: ["alam2008_calocybe", "valverde2015"],
      },
      morphology3D: baseMacro("mushroom", "#f5f2e8", 10, 8),
      regulatory: {
        fda: "traditional_food",
        efsa: "not_evaluated",
        notes: "Traditional cultivated edible mushroom in South Asia; widely consumed as food.",
      },
      speciesCitationKeys: ["alam2008_calocybe", "kalac2016", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Nutritional analysis of cultivated milky mushroom (Calocybe indica)",
        authors: "Alam et al.",
        journal: "Annals of Microbiology",
        year: 2008,
        doi: "10.1007/s13213-008-0007-7",
        summary:
          "Reports protein and nutrient profiles establishing C. indica as a cultivated alternative protein food in tropical climates.",
        publishedAt: "2008-01-01",
      },
    ],
  },
  {
    genus: "Stropharia",
    speciesEpithet: "rugosoannulata",
    commonNames: ["wine cap", "garden giant", "king stropharia"],
    cultivationType: "mushroom",
    meatAnalogPotential: "moderate",
    morphologyDescription:
      "Wine cap — large burgundy pileus with prominent ring on thick stipe; garden-cultivated fleshy agaric.",
    detailedGilledModel: true,
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        family: base.taxonomy.family === "Unknown" ? "Strophariaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 4, earthy: 3, mild: 3 },
        textureAxes: { firm: 4, meat_like: 4, tender: 3 },
        aromaNotes: "Rich, potato-like savory aroma when cooked",
        meatAnalogPotential: "moderate",
        meatAnalogRationale:
          "Large fleshy caps and published meat-alternative ingredient studies support steak/burger-style uses.",
        preparationContext: "Fresh young fruiting bodies, grilled or sautéed",
        confidenceNotes: "Food Chemistry study frames S. rugosoannulata as meat-alternative ingredient.",
        citationKeys: ["huang2019_stropharia", "kalac2016"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans, mannoproteins",
        fruitingBodyStructure: "Large agaric with wine-red pileus, thick stipe, and membranous annulus",
        sporeCharacteristics: "Purple-brown spore print",
        microscopyNotes: "Chrysocystidia present; clamped generative hyphae",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 28,
        fiberPercent: 13,
        fatPercent: 2,
        moisturePercent: 90,
        confidenceNotes: "Nutritional composition from wine-cap food chemistry study.",
        citationKeys: ["huang2019_stropharia", "kalac2016"],
      },
      geographic: {
        nativeRange: "Europe / temperate Northern Hemisphere",
        cultivatedRegions: "China, Europe, North America garden/outdoor beds",
        habitat: "Woodchip beds, gardens, hardwood debris",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_food",
        applicationSummary:
          "Outdoor-cultivated specialty mushroom; studied and used as a meat-alternative ingredient for large-cap applications.",
        companies: [{ name: "Specialty outdoor mushroom farms", region: "China / EU / NA" }],
        confidenceNotes: "Peer-reviewed meat-alternative ingredient framing.",
        citationKeys: ["huang2019_stropharia", "valverde2015"],
      },
      morphology3D: baseMacro("mushroom", "#7a1f3d", 12, 10),
      regulatory: {
        fda: "traditional_food",
        efsa: "approved_safe",
        notes: "Cultivated edible mushroom with food-use history in Europe and Asia.",
      },
      speciesCitationKeys: ["huang2019_stropharia", "kalac2016", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Nutritional composition of Stropharia rugosoannulata and meat-alternative potential",
        authors: "Huang et al.",
        journal: "Food Chemistry",
        year: 2019,
        doi: "10.1016/j.foodchem.2019.01.098",
        summary:
          "Explicitly evaluates wine cap nutrition in the context of meat-alternative ingredient development.",
        publishedAt: "2019-06-01",
      },
    ],
  },
  {
    genus: "Laetiporus",
    speciesEpithet: "sulphureus",
    commonNames: ["chicken of the woods", "sulphur shelf"],
    cultivationType: "mushroom",
    meatAnalogPotential: "high",
    morphologyDescription:
      "Chicken of the woods — bright orange-yellow bracket shelves without a true stipe; fibrous flesh famed as chicken analog.",
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        family: base.taxonomy.family === "Unknown" ? "Fomitopsidaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 4, mild: 3, chicken_like: 5 },
        textureAxes: { fibrous: 5, meat_like: 5, tender: 3 },
        aromaNotes: "Distinctly chicken-like when cooked young; lemony notes in some collections",
        meatAnalogPotential: "high",
        meatAnalogRationale:
          "Canonical wild chicken analog; fibrous bracket flesh pulls apart like poultry; protein documented in fruiting-body chemistry.",
        preparationContext: "Young tender margins, sautéed or fried as chicken substitute",
        confidenceNotes: "Chemical composition studies plus long culinary meat-analog tradition.",
        citationKeys: ["kovacs2017_laetiporus", "stamets2005", "valverde2015"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans; dimitic system",
        fruitingBodyStructure: "Annual polypore shelves; bright yellow-orange pore surface; sessile",
        sporeCharacteristics: "White spore print; ellipsoid basidiospores",
        microscopyNotes: "Dimitic hyphal system; binding and generative hyphae",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 22,
        fiberPercent: 18,
        fatPercent: 3,
        moisturePercent: 88,
        confidenceNotes: "Fruiting-body chemistry of L. sulphureus.",
        citationKeys: ["kovacs2017_laetiporus", "kalac2016"],
      },
      geographic: {
        nativeRange: "Temperate Northern Hemisphere",
        cultivatedRegions: "Emerging specialty cultivation; mostly wild-foraged commercially",
        habitat: "Parasitic/saprotrophic on hardwoods (oak, etc.)",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "research_only",
        applicationSummary:
          "Iconic chicken-style wild mushroom; specialty farms and foragers supply restaurants; cultivation pilots expanding.",
        companies: [{ name: "Specialty foragers and pilot cultivators", region: "NA / EU" }],
        confidenceNotes: "Culinary meat analog with peer-reviewed composition data; cultivation still limited.",
        citationKeys: ["kovacs2017_laetiporus", "stamets2005"],
      },
      morphology3D: baseMacro("bracket", "#f0a020", 14, 0),
      regulatory: {
        fda: "traditional_food",
        efsa: "not_evaluated",
        notes:
          "Traditional wild edible when correctly identified and prepared young; some individuals report GI sensitivity.",
      },
      speciesCitationKeys: ["kovacs2017_laetiporus", "stamets2005", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Chemical composition and antioxidant activity of Laetiporus sulphureus",
        authors: "Kovács et al.",
        journal: "European Food Research and Technology",
        year: 2017,
        doi: "10.1007/s00217-016-2801-2",
        summary:
          "Quantifies nutrients supporting culinary use of chicken-of-the-woods as a proteinaceous meat substitute.",
        publishedAt: "2017-01-01",
      },
    ],
  },
  {
    genus: "Sparassis",
    speciesEpithet: "crispa",
    commonNames: ["cauliflower mushroom", "hanabiratake"],
    cultivationType: "mushroom",
    meatAnalogPotential: "moderate",
    morphologyDescription:
      "Cauliflower mushroom — densely folded cream fronds without a classic gilled cap; coral-like mass.",
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        family: base.taxonomy.family === "Unknown" ? "Sparassidaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 3, mild: 4, nutty: 3 },
        textureAxes: { crunchy: 4, tender: 3, fibrous: 3 },
        aromaNotes: "Mild, slightly nutty; holds crunch when lightly cooked",
        meatAnalogPotential: "moderate",
        meatAnalogRationale:
          "Protein-rich gourmet biomass with crunchy fronds used in Asian meat-alternative and specialty dishes.",
        preparationContext: "Fresh fronds, tempura or sauté; dried for soup",
        confidenceNotes: "Nutritional and bioactive compound studies on S. crispa.",
        citationKeys: ["kim2013_sparassis", "kalac2016"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans (notably sparan)",
        fruitingBodyStructure: "Large cauliflower-like basidiocarp of flattened branched lobes",
        sporeCharacteristics: "White spore print",
        microscopyNotes: "Generative hyphae with clamps; inflated cells in context",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 23,
        fiberPercent: 16,
        fatPercent: 2,
        moisturePercent: 90,
        confidenceNotes: "Food Chemistry analyses of Sparassis crispa.",
        citationKeys: ["kim2013_sparassis", "kalac2016"],
      },
      geographic: {
        nativeRange: "Temperate conifer forests (Northern Hemisphere)",
        cultivatedRegions: "Japan, Korea, China, specialty EU/NA",
        habitat: "Root parasite/saprotroph of conifers",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_food",
        applicationSummary:
          "Cultivated gourmet mushroom in East Asia; protein and beta-glucan rich ingredient for specialty and functional foods.",
        companies: [{ name: "Japanese/Korean specialty producers", region: "East Asia" }],
        confidenceNotes: "Commercial cultivated crop with cited nutrition.",
        citationKeys: ["kim2013_sparassis", "valverde2015"],
      },
      morphology3D: baseMacro("coral", "#f5f0e0", 12, 4),
      regulatory: {
        fda: "traditional_food",
        efsa: "approved_safe",
        notes: "Cultivated edible gourmet mushroom with food-use history.",
      },
      speciesCitationKeys: ["kim2013_sparassis", "kalac2016", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Nutritional and bioactive compounds of Sparassis crispa",
        authors: "Kim et al.",
        journal: "Food Chemistry",
        year: 2013,
        doi: "10.1016/j.foodchem.2012.10.038",
        summary:
          "Documents protein and bioactive polysaccharides supporting Sparassis as a nutritious alternative-protein food fungus.",
        publishedAt: "2013-01-01",
      },
    ],
  },
  {
    genus: "Schizophyllum",
    speciesEpithet: "commune",
    commonNames: ["split gill", "schizophyllum"],
    cultivationType: "fermentation",
    meatAnalogPotential: "high",
    morphologyDescription:
      "Split-gill — thin fan-shaped fruiting bodies with longitudinally split gills; also grown as submerged mycoprotein biomass.",
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        family: base.taxonomy.family === "Unknown" ? "Schizophyllaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 3, mild: 3, earthy: 2 },
        textureAxes: { fibrous: 5, chewy: 4, meat_like: 4 },
        aromaNotes: "Mild fungal; mycelial biomass relatively neutral after processing",
        meatAnalogPotential: "high",
        meatAnalogRationale:
          "Emerging mycoprotein platform: fibrous hyphal biomass and traditional edible fruiting bodies; peer-reviewed meat-analog potential.",
        preparationContext: "Fruiting bodies cooked; or submerged/solid-state mycelial biomass for analogs",
        confidenceNotes: "Frontiers review frames S. commune as novel mycoprotein source.",
        citationKeys: ["wosten2021_schizophyllum", "valverde2015"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans (schizophyllan), mannoproteins",
        fruitingBodyStructure:
          "Small fan-shaped basidiocarps with longitudinally split gill-like folds; also filamentous mycelium in culture",
        sporeCharacteristics: "White spore print",
        microscopyNotes: "Clamped hyphae; schizophyllan secreted as extracellular polysaccharide",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 35,
        fiberPercent: 15,
        fatPercent: 2,
        moisturePercent: 75,
        preparationContext: "Mycelial biomass / dry-weight oriented values from mycoprotein literature",
        confidenceNotes: "Composition framed in mycoprotein cultivation literature.",
        citationKeys: ["wosten2021_schizophyllum", "kalac2016"],
      },
      geographic: {
        nativeRange: "Cosmopolitan",
        cultivatedRegions: "Traditional food in parts of Asia/Africa; lab and pilot mycoprotein globally",
        habitat: "Saprotroph on dead wood worldwide",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "research_only",
        applicationSummary:
          "Traditional edible fungus and emerging mycoprotein candidate; researched for submerged cultivation meat analogs.",
        companies: [{ name: "Academic / startup mycoprotein pilots", region: "EU / Global" }],
        productionProcess: [
          {
            title: "Submerged or solid-state biomass",
            description:
              "Mycelium grown on defined media; harvested, heat-treated, and texturized similarly to other mycoproteins.",
          },
        ],
        confidenceNotes: "Peer-reviewed mycoprotein potential; commercial scale still emerging.",
        citationKeys: ["wosten2021_schizophyllum"],
      },
      morphology3D: {
        ...baseMacro("oyster", "#d4c4a8", 4, 1),
        visualizationStyle: "macroscopic",
        showMycelium: true,
        showFruitingBody: true,
      },
      regulatory: {
        fda: "traditional_food",
        efsa: "not_evaluated",
        notes:
          "Fruiting bodies traditionally eaten in several regions; novel mycoprotein preparations may require novel-food assessment.",
      },
      speciesCitationKeys: ["wosten2021_schizophyllum", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Schizophyllum commune as a novel source of mycoprotein",
        authors: "Wösten et al.",
        journal: "Frontiers in Sustainable Food Systems",
        year: 2021,
        doi: "10.3389/fsufs.2021.732685",
        summary:
          "Reviews cultivation, composition, and meat-analog potential of S. commune mycoprotein — key alt-protein citation.",
        publishedAt: "2021-01-01",
      },
    ],
  },
  {
    genus: "Aspergillus",
    speciesEpithet: "sojae",
    commonNames: ["soy sauce koji mold", "sojae koji"],
    cultivationType: "koji",
    meatAnalogPotential: "moderate",
    morphologyDescription:
      "Koji mold — filamentous aspergilli used to ferment soy; microscopy view of branching septate hyphae.",
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        phylum: "Ascomycota",
        class: base.taxonomy.class.includes("Ascomy") ? base.taxonomy.class : "Eurotiomycetes",
        family: base.taxonomy.family === "Unknown" ? "Aspergillaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 5, savory: 5, mild: 2 },
        textureAxes: { soft: 3 },
        aromaNotes: "Enzymatic, soy-sauce/miso aromas from fermented substrates",
        meatAnalogPotential: "moderate",
        meatAnalogRationale:
          "Not a meat analog alone, but essential for unlocking soy protein umami in sauces, miso, and fermented alt-protein seasonings.",
        preparationContext: "Solid-state koji on soy/wheat; enzymes drive protein hydrolysis",
        confidenceNotes: "Foundational koji mold literature (Kitamoto review).",
        citationKeys: ["kitamoto2002_sojae", "machida2008"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans, galactomannan",
        fruitingBodyStructure: "No macroscopic mushroom; conidiophores with chains of conidia",
        sporeCharacteristics: "Greenish conidia in culture",
        microscopyNotes: "Branching septate hyphae; uniseriate/biseriate aspergillum heads",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 20,
        fiberPercent: 8,
        fatPercent: 3,
        moisturePercent: 40,
        preparationContext: "Koji biomass contribution is secondary to hydrolyzed soy protein products",
        confidenceNotes: "Food role is enzymatic fermentation of soy protein substrates.",
        citationKeys: ["kitamoto2002_sojae", "machida2008"],
      },
      geographic: {
        nativeRange: "East Asia (domesticated)",
        cultivatedRegions: "Japan, Korea, China, global soy-sauce industry",
        habitat: "Domesticated solid-state fermentation organism",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_food",
        applicationSummary:
          "Industrial koji for soy sauce and miso; critical for fermented savory seasonings in plant/fungal protein products.",
        companies: [{ name: "Soy sauce / miso manufacturers (e.g. Kikkoman partners)", region: "East Asia / Global" }],
        confidenceNotes: "Established industrial food fungus.",
        citationKeys: ["kitamoto2002_sojae", "machida2008"],
      },
      morphology3D: baseMicro("#5a8f6a"),
      regulatory: {
        fda: "gras",
        efsa: "approved_safe",
        notes: "Traditional food fermentation organism with GRAS/QPS-aligned use in soy products.",
      },
      speciesCitationKeys: ["kitamoto2002_sojae", "machida2008", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Molecular biology of the koji molds Aspergillus oryzae and Aspergillus sojae",
        authors: "Kitamoto",
        journal: "Applied Microbiology and Biotechnology",
        year: 2002,
        doi: "10.1007/s00253-002-1012-x",
        summary:
          "Reviews A. sojae as the soy-sauce koji mold enabling large-scale fermented soy protein foods.",
        publishedAt: "2002-01-01",
      },
    ],
  },
  {
    genus: "Rhizopus",
    speciesEpithet: "oryzae",
    commonNames: ["tempeh mold", "rice Rhizopus"],
    cultivationType: "tempeh",
    meatAnalogPotential: "high",
    morphologyDescription:
      "Tempeh mold — coenocytic zygomycete hyphae binding soybeans into a dense meaty cake.",
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        phylum: "Mucoromycota",
        class: "Mucoromycetes",
        family: base.taxonomy.family === "Unknown" ? "Mucoraceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 4, nutty: 4, mild: 3 },
        textureAxes: { firm: 4, meat_like: 5, chewy: 3 },
        aromaNotes: "Nutty, mushroom-like tempeh aroma when fresh",
        meatAnalogPotential: "high",
        meatAnalogRationale:
          "Binds soy into a sliceable meaty cake; documented tempeh starter with strong protein-quality outcomes.",
        preparationContext: "Solid-state fermentation of soybeans (tempeh)",
        confidenceNotes: "Food Research International study on R. oryzae as tempeh starter.",
        citationKeys: ["cantabrana2015_rhizopus", "nout1987"],
      },
      morphology: {
        hyphalType: "coenocytic",
        cellWallComposition: "Chitosan, chitin, polyphosphates",
        fruitingBodyStructure: "No mushroom; mycelial mat with sporangiophores",
        sporeCharacteristics: "Dark sporangiospores",
        microscopyNotes: "Aseptate hyphae; rhizoids and stolons typical of Rhizopus",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 40,
        fiberPercent: 12,
        fatPercent: 18,
        moisturePercent: 55,
        preparationContext: "Values reflect tempeh (soy + mycelium) as consumed food",
        confidenceNotes: "Protein quality of R. oryzae tempeh fermentations cited.",
        citationKeys: ["cantabrana2015_rhizopus", "nout1987"],
      },
      geographic: {
        nativeRange: "Cosmopolitan / tropical",
        cultivatedRegions: "Indonesia and global tempeh industry",
        habitat: "Solid-state fermentation on legumes and cereals",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_meat_analog",
        applicationSummary:
          "Tempeh starter species alongside R. oligosporus; commercial meat-alternative cakes and cutlets.",
        companies: [{ name: "Tempeh producers worldwide", region: "Global" }],
        confidenceNotes: "Proven commercial alt-protein fermentation organism.",
        citationKeys: ["cantabrana2015_rhizopus", "nout1987"],
      },
      morphology3D: baseMicro("#c4a574"),
      regulatory: {
        fda: "traditional_food",
        efsa: "approved_safe",
        notes: "Traditional tempeh fermentation organism with long safe food-use history.",
      },
      speciesCitationKeys: ["cantabrana2015_rhizopus", "nout1987", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Rhizopus oryzae as a tempeh starter: protein quality and fermentation",
        authors: "Cantabrana et al.",
        journal: "Food Research International",
        year: 2015,
        doi: "10.1016/j.foodres.2015.04.023",
        summary:
          "Demonstrates R. oryzae tempeh fermentation performance and protein quality for meat-alternative foods.",
        publishedAt: "2015-01-01",
      },
    ],
  },
  {
    genus: "Cordyceps",
    speciesEpithet: "militaris",
    commonNames: ["cordyceps militaris", "orange cordyceps", "cultivated cordyceps"],
    cultivationType: "mushroom",
    meatAnalogPotential: "moderate",
    morphologyDescription:
      "Cordyceps militaris — orange club-shaped stromata; cultivated fruiting bodies used as food/functional ingredient.",
    patch: (base) => ({
      ...base,
      taxonomy: {
        ...base.taxonomy,
        phylum: "Ascomycota",
        class: base.taxonomy.class.includes("Ascomy") || base.taxonomy.class.includes("Sordario")
          ? base.taxonomy.class
          : "Sordariomycetes",
        family: base.taxonomy.family === "Unknown" ? "Cordycipitaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 3, bitter: 2, earthy: 2 },
        textureAxes: { firm: 3, fibrous: 3, tender: 3 },
        aromaNotes: "Mild fungal with slight marine note when dried",
        meatAnalogPotential: "moderate",
        meatAnalogRationale:
          "Cultivated proteinaceous fruiting bodies used in Asian cuisine and functional foods; researched as a food protein source.",
        preparationContext: "Fresh or dried stromata; soups, powders, extracts",
        confidenceNotes: "Composition and cultivation review supports food applications.",
        citationKeys: ["dong2013_cordyceps", "kalac2016"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans",
        fruitingBodyStructure: "Clavate orange stroma with embedded perithecia; no gilled pileus",
        sporeCharacteristics: "Filiform ascospores",
        microscopyNotes: "Perithecia in stromatal head; septate mycelium in culture",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 30,
        fiberPercent: 10,
        fatPercent: 5,
        moisturePercent: 85,
        confidenceNotes: "Composition from Cordyceps militaris food/cultivation literature.",
        citationKeys: ["dong2013_cordyceps", "kalac2016"],
      },
      geographic: {
        nativeRange: "Temperate Northern Hemisphere",
        cultivatedRegions: "China, Korea, Thailand, global functional-food producers",
        habitat: "Entomopathogen of lepidopteran pupae; cultivated on grain substrates",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_food",
        applicationSummary:
          "Widely cultivated for food and supplements; fruiting-body protein used in soups and powdered alt-protein blends.",
        companies: [{ name: "East Asian cordyceps cultivators", region: "China / Korea" }],
        confidenceNotes: "Large commercial cultivated food fungus.",
        citationKeys: ["dong2013_cordyceps", "valverde2015"],
      },
      morphology3D: baseMacro("mushroom", "#e85d04", 2, 8),
      regulatory: {
        fda: "gras",
        efsa: "not_evaluated",
        notes:
          "Sold as food/supplement in many markets; specific extracts may have distinct regulatory pathways.",
      },
      speciesCitationKeys: ["dong2013_cordyceps", "kalac2016", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Cordyceps militaris: composition, cultivation and food applications",
        authors: "Dong et al.",
        journal: "Journal of Ethnopharmacology",
        year: 2013,
        doi: "10.1016/j.jep.2013.06.056",
        summary:
          "Reviews cultivated C. militaris composition and food uses, including proteinaceous fruiting bodies.",
        publishedAt: "2013-01-01",
      },
    ],
  },
  {
    genus: "Agaricus",
    speciesEpithet: "subrufescens",
    commonNames: ["almond mushroom", "himematsutake", "Agaricus blazei"],
    cultivationType: "compost_mushroom",
    meatAnalogPotential: "moderate",
    morphologyDescription:
      "Almond mushroom — robust brown-capped agaric on thick stipe; compost-cultivated like button mushrooms.",
    detailedGilledModel: true,
    patch: (base) => ({
      ...base,
      synonyms: ["Agaricus blazei", "Agaricus brasiliensis"],
      taxonomy: {
        ...base.taxonomy,
        family: base.taxonomy.family === "Unknown" ? "Agaricaceae" : base.taxonomy.family,
      },
      sensory: {
        tasteAxes: { umami: 4, almond: 4, earthy: 3 },
        textureAxes: { firm: 4, meat_like: 3, tender: 3 },
        aromaNotes: "Distinct almond/marzipan aroma when fresh",
        meatAnalogPotential: "moderate",
        meatAnalogRationale:
          "Large fleshy Agaricus with documented nutritional value; used as a culinary meat substitute and functional food mushroom.",
        preparationContext: "Fresh fruiting bodies, grilled or dried",
        confidenceNotes: "Fungal Diversity review covers nutritional properties.",
        citationKeys: ["wisitrassameewong2012_almond", "kalac2016"],
      },
      morphology: {
        hyphalType: "septate",
        cellWallComposition: "Chitin, beta-glucans, mannoproteins",
        fruitingBodyStructure: "Agaric with fibrillose brown pileus, free gills, and annulus on thick stipe",
        sporeCharacteristics: "Chocolate-brown spore print",
        microscopyNotes: "Typical Agaricus trama; clamps generally absent in Agaricus",
      },
      nutrition: {
        ...base.nutrition,
        proteinPercent: 28,
        fiberPercent: 14,
        fatPercent: 2,
        moisturePercent: 89,
        confidenceNotes: "Nutritional review of A. subrufescens / A. blazei complex.",
        citationKeys: ["wisitrassameewong2012_almond", "kalac2016"],
      },
      geographic: {
        nativeRange: "Americas (notably Brazil) / widely naturalized",
        cultivatedRegions: "Brazil, Japan, China, specialty global",
        habitat: "Compost and litter saprotroph",
      },
      commercialUse: {
        meatAlternativeUse: true,
        commercialStatus: "commercial_food",
        applicationSummary:
          "Commercially cultivated Agaricus sold fresh and dried; protein-rich culinary and functional mushroom.",
        companies: [{ name: "Brazilian and Japanese specialty Agaricus growers", region: "Brazil / Japan" }],
        confidenceNotes: "Commercial food mushroom with peer-reviewed nutrition reviews.",
        citationKeys: ["wisitrassameewong2012_almond", "shah2014"],
      },
      morphology3D: baseMacro("mushroom", "#a67c52", 8, 7),
      regulatory: {
        fda: "traditional_food",
        efsa: "approved_safe",
        notes: "Cultivated edible Agaricus; sold as food and functional mushroom products.",
      },
      speciesCitationKeys: ["wisitrassameewong2012_almond", "kalac2016", "ncbi_taxonomy"],
    }),
    research: [
      {
        title: "Agaricus subrufescens: nutritional and medicinal properties",
        authors: "Wisitrassameewong et al.",
        journal: "Fungal Diversity",
        year: 2012,
        doi: "10.1007/s13225-012-0187-4",
        summary:
          "Reviews almond mushroom nutrition supporting its role as a cultivated proteinaceous food fungus.",
        publishedAt: "2012-01-01",
      },
    ],
  },
];

export function slugForEntry(entry: FoodSpeciesBatchEntry): string {
  return `${entry.genus}-${entry.speciesEpithet}`
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
