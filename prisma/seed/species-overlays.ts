import type { RegulatoryStatus } from "../../src/generated/prisma/client";
import type { MorphologyParameters } from "../../src/lib/types";
import { speciesAminoAcidOverlays, speciesProductionOverlays } from "./species-enrichment";
import type { SpeciesSeed } from "./species-data";

type CommercialOverlay = NonNullable<SpeciesSeed["commercialUse"]>;

type SpeciesOverlay = {
  regulatory: {
    fda: RegulatoryStatus;
    efsa: RegulatoryStatus;
    notes?: string;
  };
  commercialUse: CommercialOverlay;
  morphology3D?: Partial<MorphologyParameters>;
  nutrition?: Partial<SpeciesSeed["nutrition"]>;
};

export const speciesOverlays: Record<string, SpeciesOverlay> = {
  "fusarium-venenatum": {
    regulatory: {
      fda: "gras",
      efsa: "novel_food_authorized",
      notes:
        "Mycoprotein (Quorn) has FDA GRAS status; authorized as novel food in the EU since 1999.",
    },
    commercialUse: {
      meatAlternativeUse: true,
      commercialStatus: "commercial_meat_analog",
      applicationSummary:
        "Industrial mycoprotein meat analog (Quorn) — the only fungal species used at global commercial scale for dedicated meat alternatives.",
      companies: [
        {
          name: "Quorn Foods (Monde Nissin)",
          website: "https://www.quorn.com",
          region: "UK, USA, EU, Australia, and other markets",
          products: ["Chicken-style pieces", "Mince", "Fillets", "Sausages", "Burgers", "Nuggets"],
          notes:
            "Primary commercial mycoprotein brand; biomass from F. venenatum strain ATCC 20334 lineage.",
        },
      ],
      productionProcess: [
        {
          title: "Submerged Aerobic Fermentation",
          description:
            "Strain A3/5 grown in stirred fermenters on glucose and mineral salts; continuous culture controls RNA.",
          learnMoreUrl: "https://www.quorn.co.uk/about-quorn/how-quorn-is-made",
          learnMoreLabel: "How Quorn is made (Quorn Foods)",
        },
        {
          title: "Harvest & Heat Treatment",
          description: "Biomass separated and heat-treated to reduce RNA and inactivate enzymes.",
          learnMoreUrl: "https://doi.org/10.1016/j.tifs.2018.04.008",
          learnMoreLabel: "Finnigan (2018) review",
        },
        {
          title: "Texturization Into Meat-Like Forms",
          description: "Heat-treated hyphae bound and formed into fibrous meat-like products.",
          learnMoreUrl: "https://patents.google.com/patent/US5945148",
          learnMoreLabel: "Quorn texture patent",
        },
      ],
      confidenceNotes: "Only globally approved mycoprotein meat analog at commercial scale; sold in 17+ countries.",
      citationKeys: ["finnigan2018", "quorn_patent", "wardley1977"],
    },
    morphology3D: {
      visualizationStyle: "microscopy",
      stainColor: "#3b6ea8",
      backgroundColor: "#f4f1ea",
    },
  },
  "pleurotus-ostreatus": {
    regulatory: {
      fda: "traditional_food",
      efsa: "approved_safe",
      notes: "Widely consumed cultivated mushroom; long history of safe food use globally.",
    },
    commercialUse: {
      meatAlternativeUse: true,
      commercialStatus: "commercial_food",
      applicationSummary:
        "Major cultivated edible mushroom worldwide; used fresh and in meat-analog formulations (e.g. shredded applications).",
      companies: [{ name: "Multiple global growers & brands", region: "Worldwide" }],
      citationKeys: ["manzi2013", "valverde2015"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "oyster",
      capDiameter: 9,
      stipeLength: 2,
      capColor: "#c4b08a",
      backgroundColor: "#f7f4ef",
    },
  },
  "pleurotus-eryngii": {
    regulatory: {
      fda: "traditional_food",
      efsa: "approved_safe",
      notes: "Commercially cultivated king oyster mushroom with established food-use history.",
    },
    commercialUse: {
      meatAlternativeUse: true,
      commercialStatus: "commercial_food",
      applicationSummary:
        "King oyster cultivated globally; dense stipe sold as scallop/chicken-style analog in retail and foodservice.",
      companies: [{ name: "Asian and EU specialty mushroom producers", region: "Global" }],
      citationKeys: ["bao2008", "valverde2015"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "king_oyster",
      capDiameter: 5,
      stipeLength: 14,
      capColor: "#d4c4a8",
      backgroundColor: "#f7f4ef",
    },
  },
  "hericium-erinaceus": {
    regulatory: {
      fda: "gras",
      efsa: "approved_safe",
      notes: "Lion's mane sold as food and supplement; GRAS notices exist for certain mushroom ingredients.",
    },
    commercialUse: {
      meatAlternativeUse: true,
      commercialStatus: "commercial_food",
      applicationSummary:
        "Cultivated for fresh consumption and extracts; fibrous texture studied for seafood/chicken analogs.",
      companies: [{ name: "Specialty mushroom farms and supplement brands", region: "Asia, North America, EU" }],
      citationKeys: ["wong2018"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "lions_mane",
      capDiameter: 7,
      capColor: "#f5f0e8",
      backgroundColor: "#f7f4ef",
    },
  },
  "agaricus-bisporus": {
    regulatory: {
      fda: "traditional_food",
      efsa: "approved_safe",
      notes: "Most widely cultivated mushroom globally (button/portobello); longstanding safe consumption.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "commercial_food",
      applicationSummary: "Dominant commercial mushroom crop (fresh, canned, frozen) but not a primary meat-analog ingredient.",
      companies: [{ name: "Global mushroom industry (e.g. Monterey, Phillips)", region: "Worldwide" }],
      citationKeys: ["shah2014"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "mushroom",
      capDiameter: 7,
      stipeLength: 5,
      capColor: "#e8e0d4",
      backgroundColor: "#f7f4ef",
    },
  },
  "lentinula-edodes": {
    regulatory: {
      fda: "traditional_food",
      efsa: "approved_safe",
      notes: "Shiitake — centuries of culinary use; widely cultivated and exported.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "commercial_food",
      applicationSummary: "Major cultivated edible mushroom (fresh, dried, processed) in Asian and global markets.",
      companies: [{ name: "Shiitake growers and exporters", region: "East Asia, global" }],
      citationKeys: ["bao2013"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "mushroom",
      capDiameter: 8,
      stipeLength: 4,
      capColor: "#8b6914",
      backgroundColor: "#f7f4ef",
    },
  },
  "ganoderma-lucidum": {
    regulatory: {
      fda: "not_evaluated",
      efsa: "approved_safe",
      notes: "Sold as tea, powder, and supplements; not a GRAS-affirmed whole food in US but long TCM use.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "commercial_food",
      applicationSummary: "Reishi marketed as functional food and nutraceutical, not as meat analog.",
      companies: [{ name: "TCM and supplement manufacturers", region: "Asia, global" }],
      citationKeys: ["sanodiya2010"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "bracket",
      capDiameter: 10,
      stipeLength: 2,
      capColor: "#a63d2a",
      backgroundColor: "#f7f4ef",
    },
  },
  "tremella-fuciformis": {
    regulatory: {
      fda: "not_evaluated",
      efsa: "approved_safe",
      notes: "Snow fungus used in Asian desserts and soups; limited Western regulatory dossiers.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "commercial_food",
      applicationSummary: "Cultivated jelly fungus for confectionery and soups; gelatinous texture, not meat-like.",
      companies: [{ name: "Asian specialty producers", region: "China, Southeast Asia" }],
      citationKeys: ["mao2015"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "jelly",
      capDiameter: 8,
      capColor: "#f8f4f0",
      backgroundColor: "#f7f4ef",
    },
  },
  "grifola-frondosa": {
    regulatory: {
      fda: "traditional_food",
      efsa: "approved_safe",
      notes: "Maitake cultivated and wild-harvested; established culinary use in Japan and North America.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "commercial_food",
      applicationSummary: "Cultivated maitake sold fresh and dried; valued for umami, not primarily as meat analog.",
      companies: [{ name: "Japanese and North American growers", region: "Japan, USA" }],
      citationKeys: ["guo2015"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "maitake",
      capDiameter: 9,
      capColor: "#9a8b72",
      backgroundColor: "#f7f4ef",
    },
  },
  "volvariella-volvacea": {
    regulatory: {
      fda: "traditional_food",
      efsa: "approved_safe",
      notes: "Straw mushroom — staple cultivated mushroom in tropical Asia.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "commercial_food",
      applicationSummary: "Commercial tropical mushroom (fresh and canned), especially Southeast Asia.",
      companies: [{ name: "Tropical mushroom farms", region: "Thailand, Vietnam, China" }],
      citationKeys: ["barros2008"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "mushroom",
      capDiameter: 6,
      stipeLength: 8,
      capColor: "#e8dcc8",
      backgroundColor: "#f7f4ef",
    },
  },
  "auricularia-auricula-judae": {
    regulatory: {
      fda: "traditional_food",
      efsa: "approved_safe",
      notes: "Wood ear mushroom — long history in East Asian cuisine.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "commercial_food",
      applicationSummary: "Dried and rehydrated wood ear sold globally for texture in Asian dishes.",
      companies: [{ name: "Asian dried mushroom exporters", region: "China, global" }],
      citationKeys: ["barros2008"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "jelly",
      capDiameter: 7,
      capColor: "#3d2817",
      backgroundColor: "#f7f4ef",
    },
  },
  "aspergillus-oryzae": {
    regulatory: {
      fda: "gras",
      efsa: "approved_safe",
      notes: "Koji mold — GRAS for enzyme production; centuries of safe use in fermented foods (miso, sake, soy sauce).",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "commercial_food",
      applicationSummary:
        "Industrial koji starter for fermented foods; biomass not typically eaten directly but essential commercial fermentation organism.",
      companies: [
        { name: "Japanese koji suppliers (e.g. Higuchi Matsunosuke)", region: "Japan" },
        { name: "Global fermentation industry", region: "Worldwide" },
      ],
      citationKeys: ["machida2008"],
    },
    morphology3D: {
      visualizationStyle: "microscopy",
      stainColor: "#4a6741",
      backgroundColor: "#f4f1ea",
      fruitingBodyType: "none",
      showFruitingBody: false,
    },
  },
  "rhizopus-oligosporus": {
    regulatory: {
      fda: "gras",
      efsa: "approved_safe",
      notes: "Tempeh starter — GRAS for food fermentation; traditional Indonesian food with safe history.",
    },
    commercialUse: {
      meatAlternativeUse: true,
      commercialStatus: "traditional_food",
      applicationSummary:
        "Primary tempeh fermenter; whole fermented soybean cake sold as plant protein food globally.",
      companies: [
        { name: "Tempeh producers (Lightlife, Tofurky, artisan brands)", region: "Indonesia, USA, EU" },
      ],
      citationKeys: ["nout1987"],
    },
    morphology3D: {
      visualizationStyle: "microscopy",
      stainColor: "#2d4a3e",
      backgroundColor: "#f4f1ea",
      showMycelium: true,
      showFruitingBody: false,
      fruitingBodyType: "none",
    },
  },
  "neurospora-intermedia": {
    regulatory: {
      fda: "not_evaluated",
      efsa: "not_evaluated",
      notes: "Oncom (West Java) — traditional fermented food; no US/EU novel food dossier identified.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "traditional_food",
      applicationSummary: "Used in Indonesian oncom (fermented peanut or okara cake); regional traditional product.",
      companies: [{ name: "West Javanese artisan producers", region: "Indonesia" }],
      citationKeys: ["davis2000"],
    },
    morphology3D: {
      visualizationStyle: "microscopy",
      stainColor: "#c45c26",
      backgroundColor: "#f4f1ea",
      hyphaeColor: "#c45c26",
      showMycelium: true,
      showFruitingBody: false,
      fruitingBodyType: "none",
    },
  },
  "trichoderma-reesei": {
    regulatory: {
      fda: "gras",
      efsa: "not_approved_food",
      notes: "GRAS for enzyme production (cellulases); biomass not approved or sold as human food.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "research_only",
      applicationSummary:
        "Industrial enzyme producer for bioethanol and food processing; not a direct food or meat analog organism.",
      companies: [{ name: "Novozymes / industrial biotech", region: "Global" }],
      citationKeys: ["martinez2008"],
    },
    morphology3D: {
      visualizationStyle: "microscopy",
      stainColor: "#2e6b3c",
      backgroundColor: "#f4f1ea",
      fruitingBodyType: "none",
      showFruitingBody: false,
    },
  },
  "ustilago-maydis": {
    regulatory: {
      fda: "not_evaluated",
      efsa: "not_evaluated",
      notes: "Huitlacoche — traditional Mexican food; not GRAS-affirmed in US.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "traditional_food",
      applicationSummary: "Corn smut galls harvested as gourmet ingredient (huitlacoche) in Mexico and specialty export.",
      companies: [{ name: "Mexican specialty producers", region: "Mexico, USA specialty" }],
      citationKeys: ["cruz2011"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "smut",
      capDiameter: 6,
      capColor: "#5a4a3a",
      backgroundColor: "#f7f4ef",
    },
  },
  "morchella-spp": {
    regulatory: {
      fda: "traditional_food",
      efsa: "approved_safe",
      notes: "Morels wild-harvested and increasingly cultivated; established gourmet food use.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "commercial_food",
      applicationSummary: "Wild and cultivated morels sold fresh, dried, and frozen in specialty markets.",
      companies: [{ name: "Specialty wild and cultivated mushroom suppliers", region: "North America, EU" }],
      citationKeys: ["pilz2007", "kalac2016"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "morel",
      capDiameter: 5,
      stipeLength: 9,
      capColor: "#c9a84c",
      backgroundColor: "#f7f4ef",
    },
  },
  "calvatia-gigantea": {
    regulatory: {
      fda: "not_evaluated",
      efsa: "not_evaluated",
      notes: "Giant puffball occasionally foraged; no commercial regulatory dossier.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "none",
      applicationSummary: "Occasional wild/foraged food; no significant commercial product market documented.",
      companies: [],
      citationKeys: ["kalac2016"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "puffball",
      capDiameter: 12,
      capColor: "#f5f0e6",
      backgroundColor: "#f7f4ef",
    },
  },
  "coprinus-comatus": {
    regulatory: {
      fda: "traditional_food",
      efsa: "approved_safe",
      notes: "Shaggy mane — known edible with caution (alcohol interaction); minor commercial niche.",
    },
    commercialUse: {
      meatAlternativeUse: false,
      commercialStatus: "commercial_food",
      applicationSummary: "Small-scale fresh market sales and foraging; limited industrial use.",
      companies: [{ name: "Specialty foragers and farmers' markets", region: "Temperate regions" }],
      citationKeys: ["barros2008"],
    },
    morphology3D: {
      visualizationStyle: "macroscopic",
      showMycelium: false,
      showFruitingBody: true,
      fruitingBodyType: "mushroom",
      capDiameter: 5,
      stipeLength: 10,
      capColor: "#f5f5f0",
      backgroundColor: "#f7f4ef",
    },
  },
};

export function applySpeciesOverlay(sp: SpeciesSeed): SpeciesSeed {
  const overlay = speciesOverlays[sp.slug];
  const aminoOverlay =
    sp.nutrition.aminoAcids != null ? {} : (speciesAminoAcidOverlays[sp.slug] ?? {});
  const productionSteps =
    overlay?.commercialUse.productionProcess?.length
      ? overlay.commercialUse.productionProcess
      : (speciesProductionOverlays[sp.slug] ?? []);

  if (!overlay) {
    return {
      ...sp,
      nutrition: { ...sp.nutrition, ...aminoOverlay },
      commercialUse: sp.commercialUse
        ? {
            ...sp.commercialUse,
            productionProcess:
              (sp.commercialUse.productionProcess?.length ?? 0) > 0
                ? sp.commercialUse.productionProcess
                : productionSteps,
          }
        : sp.commercialUse,
    };
  }

  return {
    ...sp,
    morphology3D: { ...sp.morphology3D, ...overlay.morphology3D },
    nutrition: { ...sp.nutrition, ...overlay.nutrition, ...aminoOverlay },
    commercialUse: {
      ...overlay.commercialUse,
      productionProcess: productionSteps,
    },
    regulatory: overlay.regulatory,
  };
}
