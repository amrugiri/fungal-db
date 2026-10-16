import type { MeatAnalogPotential } from "../../src/generated/prisma/client";
import { isStrainProductUrl } from "../../src/lib/catalog-url";
import type { SensoryPublishedMeasurement } from "../../src/lib/types";
import type { SpeciesSeed } from "./species-data";

/** NCBI Taxonomy IDs confirmed via E-utilities esummary (species rank unless noted). */
const NCBI_TAXONOMY_ID: Record<string, string> = {
  "agaricus-bisporus": "5341",
  "agaricus-subrufescens": "87252",
  "aspergillus-niger": "5061",
  "aspergillus-oryzae": "5062",
  "aspergillus-sojae": "41058",
  "auricularia-auricula-judae": "29892",
  "calocybe-indica": "282373",
  "calvatia-gigantea": "68762",
  "cantharellus-cibarius": "36066",
  "coprinus-comatus": "56187",
  "cordyceps-militaris": "73501",
  "cyberlindnera-jadinii": "4903",
  "cyclocybe-aegerita": "1973307",
  "flammulina-velutipes": "38945",
  "fusarium-sp-flavolapis": "2776169",
  "fusarium-venenatum": "56646",
  "ganoderma-lucidum": "5315",
  "grifola-frondosa": "5627",
  "hericium-erinaceus": "91752",
  "hypsizygus-marmoreus": "39966",
  "laetiporus-sulphureus": "5630",
  "lentinula-edodes": "5353",
  "morchella-spp": "5193",
  "neurospora-intermedia": "5142",
  "paecilomyces-variotii": "264951",
  "pholiota-nameko": "1538424",
  "pleurotus-citrinopileatus": "98342",
  "pleurotus-djamor": "34470",
  "pleurotus-eryngii": "5323",
  "pleurotus-ostreatus": "5322",
  "pleurotus-pulmonarius": "28995",
  "rhizopus-oligosporus": "4847",
  "rhizopus-oryzae": "64495",
  "schizophyllum-commune": "5334",
  "sparassis-crispa": "139825",
  "stropharia-rugosoannulata": "68746",
  "tremella-fuciformis": "64657",
  "trichoderma-reesei": "51453",
  "tricholoma-matsutake": "40145",
  "tuber-borchii": "42251",
  "ustilago-maydis": "5270",
  "volvariella-volvacea": "36659",
};

const YANG_2001_DOI = "10.1016/s0308-8146(00)00262-4";
const REIS_2012_DOI = "10.1016/j.fct.2011.10.056";
const LI_2014_DOI = "10.1016/j.foodchem.2013.08.006";
const PHAT_2016_DOI = "10.1016/j.foodchem.2015.07.113";

/** Phat, Moon & Lee (2016) Table 3 human umami, 1–11 scale. Bar = (score − 1) × 5 / 10. */
const PHAT_2016_UMAMI: Record<string, { score: number; eucMgMsgPerG: number }> = {
  "pleurotus-ostreatus": { score: 9.33, eucMgMsgPerG: 3890 },
  "agaricus-bisporus": { score: 8.6, eucMgMsgPerG: 2480 },
  "grifola-frondosa": { score: 5.6, eucMgMsgPerG: 226 },
  "hericium-erinaceus": { score: 4.83, eucMgMsgPerG: 1160 },
  "hypsizygus-marmoreus": { score: 4.8, eucMgMsgPerG: 1280 },
  "pleurotus-citrinopileatus": { score: 4.67, eucMgMsgPerG: 252 },
  "pleurotus-eryngii": { score: 4.4, eucMgMsgPerG: 532 },
  "flammulina-velutipes": { score: 4.0, eucMgMsgPerG: 480 },
  "lentinula-edodes": { score: 4.0, eucMgMsgPerG: 243 },
  "sparassis-crispa": { score: 3.6, eucMgMsgPerG: 40.4 },
  "auricularia-auricula-judae": { score: 2.46, eucMgMsgPerG: 1.51 },
  "tremella-fuciformis": { score: 2.42, eucMgMsgPerG: 8.88 },
};

function phatUmamiBar(score: number): number {
  return Number((((score - 1) * 5) / 10).toFixed(1));
}

function phat2016Panel(slug: string): SensoryPublishedMeasurement | undefined {
  const row = PHAT_2016_UMAMI[slug];
  if (!row) return undefined;
  const bar = phatUmamiBar(row.score);
  return {
    kind: "panel_score",
    name: "Umami intensity (trained panel)",
    value: row.score,
    unit: "on 1–11 scale",
    method:
      "10 trained panellists; 1% w/v boiling-water extract served at 45 °C; 11-point umami scale (1 very weak, 6 medium, 11 very strong)",
    sample: "Freeze-dried Korean market fruiting bodies (Phat et al. 2016)",
    notes: `Phat, Moon & Lee (2016) Table 3 mean. Table 2 EUC is ${row.eucMgMsgPerG} mg MSG/g dry weight. The 0–5 bar on this page is (score − 1) × 5 / 10 = ${bar}.`,
    citationKey: "phat2016",
    doi: PHAT_2016_DOI,
  };
}

function phatDisclaimer(slug: string): string | undefined {
  const row = PHAT_2016_UMAMI[slug];
  if (!row) return undefined;
  const bar = phatUmamiBar(row.score);
  return `Umami bar is Phat et al. (2016) Table 3 human panel (${row.score} on a 1–11 scale), rescaled as (score − 1) × 5 / 10 = ${bar}. Other 0–5 axes are empty because that paper did not score them.`;
}
const YANG_2001_SPECIES = new Set([
  "flammulina-velutipes",
  "lentinula-edodes",
  "pleurotus-ostreatus",
]);

function yang2001Dw(
  name: string,
  value: number,
  sample: string,
  extra?: string,
): SensoryPublishedMeasurement {
  return {
    kind: "taste_compound",
    name,
    value,
    unit: "mg/g dry weight",
    method: "HPLC of air-dried (60 °C) fruiting-body powder; N × 4.38 for protein in Table 1",
    sample,
    notes: extra,
    citationKey: "yang2013_enoki",
    doi: YANG_2001_DOI,
  };
}

function reis2012Sugar(
  name: string,
  value: number,
  sample: string,
  extra?: string,
): SensoryPublishedMeasurement {
  return {
    kind: "taste_compound",
    name,
    value,
    unit: "g/100 g fw",
    method: "HPLC-RI of 80% aqueous ethanol extract",
    sample,
    notes: extra,
    citationKey: "bao2008",
    doi: REIS_2012_DOI,
  };
}

function li2014Taste(
  name: string,
  sample: string,
  notes: string,
  value?: number,
  unit?: string,
): SensoryPublishedMeasurement {
  return {
    kind: "taste_compound",
    name,
    value,
    unit,
    method: "Non-volatile taste-component analysis of commercial dried fruiting bodies",
    sample,
    notes,
    citationKey: "li2014_taste",
    doi: LI_2014_DOI,
  };
}

const PUBLISHED_SENSORY: Record<string, SensoryPublishedMeasurement[]> = {
  "agaricus-bisporus": [
    reis2012Sugar(
      "Mannitol",
      5.6,
      "White A. bisporus (Champignon), supermarket fruiting bodies, Bragança, g/100 g fresh weight",
      "Reis et al. (2012) Table 3. Brown/Portobello mannitol in the same table is 4.01 g/100 g fw.",
    ),
    reis2012Sugar(
      "Total sugars",
      5.79,
      "White A. bisporus (Champignon), supermarket fruiting bodies, Bragança, g/100 g fresh weight",
      "Reis et al. (2012) Table 3. Brown/Portobello total sugars in the same table are 4.27 g/100 g fw.",
    ),
  ],
  "flammulina-velutipes": [
    yang2001Dw(
      "MSG-like free amino acids (Asp + Glu)",
      7.06,
      "Yellow winter mushroom, Taiwan market, air-dried 60 °C, mg/g dry weight",
      "Yang, Lin & Mau (2001) Table 4. White strain in the same table is 1.57 mg/g — not averaged into this row.",
    ),
    yang2001Dw(
      "Flavour 5′-nucleotides (GMP + IMP + XMP)",
      6.32,
      "Yellow winter mushroom, Taiwan market, air-dried 60 °C, mg/g dry weight",
      "Yang, Lin & Mau (2001) Table 5. White strain flavour 5′-nucleotides are 8.60 mg/g.",
    ),
    yang2001Dw(
      "Total free amino acids",
      31.5,
      "Yellow winter mushroom, Taiwan market, air-dried 60 °C, mg/g dry weight",
      "Yang, Lin & Mau (2001) Table 3. White strain total is 19.2 mg/g. Glutamic acid in yellow is 6.82 mg/g.",
    ),
    reis2012Sugar(
      "Fructose",
      4.6,
      "Golden needle mushroom, supermarket fruiting bodies, Bragança, g/100 g fresh weight",
      "Reis et al. (2012) Table 3. Predominant sugar in this cultivated sample.",
    ),
    reis2012Sugar(
      "Total sugars",
      8.29,
      "Golden needle mushroom, supermarket fruiting bodies, Bragança, g/100 g fresh weight",
      "Reis et al. (2012) Table 3.",
    ),
  ],
  "lentinula-edodes": [
    yang2001Dw(
      "MSG-like free amino acids (Asp + Glu)",
      1.71,
      "Shiitake strain 271, Taiwan market, air-dried 60 °C, mg/g dry weight",
      "Yang, Lin & Mau (2001) Table 4. Tainung 1 in the same table is 1.93 mg/g — not averaged into this row.",
    ),
    yang2001Dw(
      "Flavour 5′-nucleotides (GMP + IMP + XMP)",
      11.6,
      "Shiitake strain 271, Taiwan market, air-dried 60 °C, mg/g dry weight",
      "Yang, Lin & Mau (2001) Table 5. Tainung 1 flavour 5′-nucleotides are 1.60 mg/g. The paper ranks umami: strain 271 > winter mushrooms > oysters and Tainung 1.",
    ),
    yang2001Dw(
      "Total free amino acids",
      12.5,
      "Shiitake strain 271, Taiwan market, air-dried 60 °C, mg/g dry weight",
      "Yang, Lin & Mau (2001) Table 3. Tainung 1 total is 10.5 mg/g.",
    ),
    reis2012Sugar(
      "Mannitol",
      10.01,
      "Shiitake, supermarket fruiting bodies, Bragança, g/100 g fresh weight",
      "Reis et al. (2012) Table 3. Highest mannitol among the six samples in that table.",
    ),
    reis2012Sugar(
      "Total sugars",
      14.08,
      "Shiitake, supermarket fruiting bodies, Bragança, g/100 g fresh weight",
      "Reis et al. (2012) Table 3.",
    ),
  ],
  "pleurotus-ostreatus": [
    yang2001Dw(
      "MSG-like free amino acids (Asp + Glu)",
      0.84,
      "Tree oyster mushroom, Taiwan market, air-dried 60 °C, mg/g dry weight",
      "Yang, Lin & Mau (2001) Table 4. Abalone mushroom (P. cystidiosus, not in this catalogue) is 1.21 mg/g in the same table.",
    ),
    yang2001Dw(
      "Flavour 5′-nucleotides (GMP + IMP + XMP)",
      6.09,
      "Tree oyster mushroom, Taiwan market, air-dried 60 °C, mg/g dry weight",
      "Yang, Lin & Mau (2001) Table 5. Glutamic acid (Table 3) is 0.71 mg/g. The two oysters were comparable in flavour 5′-nucleotides.",
    ),
    yang2001Dw(
      "Total free amino acids",
      4.08,
      "Tree oyster mushroom, Taiwan market, air-dried 60 °C, mg/g dry weight",
      "Yang, Lin & Mau (2001) Table 3. Lowest total free amino acids among the six samples in that paper.",
    ),
    reis2012Sugar(
      "Trehalose",
      4.42,
      "Oyster mushroom, supermarket fruiting bodies, Bragança, g/100 g fresh weight",
      "Reis et al. (2012) Table 3. Predominant sugar in this cultivated sample.",
    ),
    reis2012Sugar(
      "Total sugars",
      4.97,
      "Oyster mushroom, supermarket fruiting bodies, Bragança, g/100 g fresh weight",
      "Reis et al. (2012) Table 3.",
    ),
  ],
  "pleurotus-eryngii": [
    reis2012Sugar(
      "Trehalose",
      8.01,
      "King oyster mushroom, supermarket fruiting bodies, Bragança, g/100 g fresh weight",
      "Reis et al. (2012) Table 3.",
    ),
    reis2012Sugar(
      "Total sugars",
      8.67,
      "King oyster mushroom, supermarket fruiting bodies, Bragança, g/100 g fresh weight",
      "Reis et al. (2012) Table 3.",
    ),
    li2014Taste(
      "Total 5′-nucleotides",
      "Commercial dried Pleurotus eryngii, China",
      "Li et al. (2014) abstract: lowest 5′-nucleotide level among the five dried mushrooms they compared. Other species-level tables were not copied (full PDF not obtained).",
      1.68,
      "mg/g",
    ),
  ],
  "coprinus-comatus": [
    li2014Taste(
      "Total 5′-nucleotides",
      "Commercial dried Coprinus comatus, China",
      "Li et al. (2014) abstract: highest 5′-nucleotide level among the five dried mushrooms they compared. Ranked with A. blazei and A. cylindracea as highly strong umami. Equivalent umami concentration range in that paper is 11.19–88.37 g/100 g dry weight across all five species — not a C. comatus-only value.",
      3.79,
      "mg/g",
    ),
  ],
  "agaricus-subrufescens": [
    li2014Taste(
      "Citric acid",
      "Commercial dried Agaricus blazei, China",
      "Li et al. (2014) abstract: highest organic acid among the five dried mushrooms they compared. A. blazei is treated here as A. subrufescens. Ranked as highly strong umami. Other concentrations are in the paper tables.",
      113.13,
      "mg/g",
    ),
  ],
  "cyclocybe-aegerita": [
    li2014Taste(
      "Umami ranking (no species-level concentration copied)",
      "Commercial dried Agrocybe cylindracea, China",
      "Li et al. (2014) studied A. cylindracea (often treated as Cyclocybe cylindracea / C. aegerita). The abstract ranks it with A. blazei and C. comatus as highly strong umami. No A. cylindracea concentration is stated in the abstract.",
    ),
  ],
  "hypsizygus-marmoreus": [
    {
      kind: "taste_compound",
      name: "Free amino acids (including taste-active residues)",
      method: "HPLC of free amino acids",
      sample: "Hypsizygus marmoreus fruiting bodies",
      notes:
        "Lee et al. (2003) report free amino acids for this species. Values are in the paper and have not been copied here.",
      citationKey: "lee2018_hypsizygus",
      doi: "10.1016/s0308-8146(03)00093-1",
    },
  ],
  "schizophyllum-commune": [
    {
      kind: "panel_score",
      name: "Sensory flavor profile of split-gill extract",
      method: "Descriptive sensory analysis of an aqueous extract",
      sample: "Schizophyllum commune extract (not whole-fruiting-body 0–5 scores)",
      notes:
        "Laplamool et al. (2023) profile flavor of an extract and its effect on salt taste. That is not a meat-analog panel and is not the source of any 0–5 bars on this page.",
      citationKey: "laplamool2023_schizophyllum",
      doi: "10.3390/foods12203745",
    },
  ],
};

const MEAT_ANALOG: Record<
  string,
  { potential: MeatAnalogPotential; rationale: string; meatAlternativeUse?: boolean }
> = {
  "fusarium-venenatum": {
    potential: "high",
    rationale:
      "Commercial Quorn mycoprotein: submerged Fusarium venenatum biomass is heat-treated and texturized into meat-style products (Finnigan 2019; US4041189A).",
    meatAlternativeUse: true,
  },
  "fusarium-sp-flavolapis": {
    potential: "high",
    rationale:
      "Commercial Fy Protein from Nature's Fynd; EFSA 2025 and GRAS/Health Canada dossiers describe fermented Fusarium biomass as a meat- and dairy-style ingredient.",
    meatAlternativeUse: true,
  },
  "rhizopus-oligosporus": {
    potential: "moderate",
    rationale:
      "Traditional tempeh starter: the mycelium binds soy into a sliceable cake sold as a plant protein food. That is a fermented food, not a Quorn-style mycoprotein isolate.",
    meatAlternativeUse: true,
  },
  "pleurotus-ostreatus": {
    potential: "moderate",
    rationale:
      "Shredded fruiting bodies are used in foodservice as chicken-style strips. That is culinary use of the mushroom, not a published submerged-mycoprotein process.",
    meatAlternativeUse: true,
  },
  "pleurotus-eryngii": {
    potential: "moderate",
    rationale:
      "Dense stipes are sold as scallop- or chicken-style cuts. Culinary analog use; not a dedicated fermentation meat-analog strain.",
    meatAlternativeUse: true,
  },
  "pleurotus-pulmonarius": {
    potential: "moderate",
    rationale:
      "Oyster-type pileus is shredded in the same culinary way as P. ostreatus. No species-specific industrial mycoprotein dossier was verified here.",
    meatAlternativeUse: true,
  },
  "pleurotus-djamor": {
    potential: "moderate",
    rationale:
      "Fibrous pink oyster caps are used as culinary shreds. Consumer recipes are not the same as a cited meat-analog trial.",
    meatAlternativeUse: true,
  },
  "pleurotus-citrinopileatus": {
    potential: "moderate",
    rationale:
      "Yellow oyster morphology shreds like other Pleurotus. Culinary analog use only; no verified industrial mycoprotein product.",
    meatAlternativeUse: true,
  },
  "hericium-erinaceus": {
    potential: "moderate",
    rationale:
      "Cooked spines flake in a seafood-like way. That is a culinary observation, not a trained meat-analog panel or commercial mycoprotein brand.",
    meatAlternativeUse: true,
  },
  "flammulina-velutipes": {
    potential: "moderate",
    rationale:
      "Long cultivated stipes are used as noodle-like extenders. Culinary extender use; Yang et al. (2001) measured taste chemistry, not analog performance.",
    meatAlternativeUse: true,
  },
  "schizophyllum-commune": {
    potential: "unknown",
    rationale:
      "Kleijburg & Wösten (2025) review biology and applications (including materials and schizophyllan), not a commercial mycoprotein product. Laplamool et al. (2023) profile an extract's flavor — not meat-analog texture.",
    meatAlternativeUse: false,
  },
  "rhizopus-oryzae": {
    potential: "moderate",
    rationale:
      "Used as a tempeh starter (often as Rhizopus arrhizus). Not a dedicated commercial meat-analog brand in this catalogue.",
    meatAlternativeUse: true,
  },
  "paecilomyces-variotii": {
    potential: "unknown",
    rationale:
      "Pekilo was a 1970s Finnish single-cell protein process, mainly for feed. Modern food-use papers exist; this catalogue does not treat it as a current commercial meat analog.",
    meatAlternativeUse: false,
  },
  "aspergillus-sojae": {
    potential: "low",
    rationale: "Koji mold for soy fermentation. The organism is a processing culture, not a meat-analog biomass.",
    meatAlternativeUse: false,
  },
  "cordyceps-militaris": {
    potential: "low",
    rationale: "Cultivated functional/culinary fungus. No verified meat-analog product or panel was curated.",
    meatAlternativeUse: false,
  },
  "laetiporus-sulphureus": {
    potential: "low",
    rationale:
      "Wild 'chicken of the woods' is a culinary common name for fibrous brackets. That is not a commercial analog product or a published 0–5 texture panel.",
    meatAlternativeUse: false,
  },
};

const COMMERCIAL_COPY: Partial<
  Record<
    string,
    {
      status?: NonNullable<SpeciesSeed["commercialUse"]>["commercialStatus"];
      applicationSummary?: string;
      companies?: NonNullable<SpeciesSeed["commercialUse"]>["companies"];
      productionProcess?: NonNullable<SpeciesSeed["commercialUse"]>["productionProcess"];
      confidenceNotes?: string;
    }
  >
> = {
  "schizophyllum-commune": {
    status: "research_only",
    applicationSummary:
      "Eaten as a traditional mushroom in some regions. Kleijburg & Wösten (2025) review biology, schizophyllan, and materials uses. No commercial mycoprotein meat-analog product was verified for this catalogue.",
    companies: [],
    productionProcess: [],
    confidenceNotes:
      "Do not treat the 2025 review as evidence of a commercial meat-analog product.",
  },
  "rhizopus-oryzae": {
    status: "traditional_food",
    applicationSummary:
      "Tempeh-associated Rhizopus (current name often Rhizopus arrhizus). Used as a fermentation culture, not as a branded mycoprotein meat analog in this catalogue.",
  },
  "paecilomyces-variotii": {
    status: "research_only",
    applicationSummary:
      "Historical Pekilo single-cell protein (mainly feed). Modern food-use research exists; not listed here as a current commercial meat analog.",
  },
};

type VerifiedNutrition = {
  proteinPercent?: number;
  fiberPercent?: number;
  fatPercent?: number;
  moisturePercent?: number;
  pdcaas?: number;
  preparationContext: string;
  confidenceNotes: string;
  citationKeys: string[];
};

/** Numbers copied from a paper table or sentence. Empty means not yet extracted. */
const VERIFIED_NUTRITION: Record<string, VerifiedNutrition> = {
  "fusarium-venenatum": {
    proteinPercent: 11,
    fiberPercent: 6,
    fatPercent: 2.9,
    preparationContext:
      "Finnigan et al. (2019) Table 1: mycoprotein ingredient, g/100 g wet weight (source cited as mycoprotein.org).",
    confidenceNotes:
      "Copied from Finnigan 2019 Table 1 (wet weight). The same paper also says mycoprotein is typically 45% protein and 25% fibre by dry weight, citing Finnigan 2011 — that dry-weight pair is not shown in the % fields so wet and dry bases are not mixed.",
    citationKeys: ["finnigan2018"],
  },
  "fusarium-sp-flavolapis": {
    proteinPercent: 11.3,
    fiberPercent: 8.5,
    fatPercent: 1.2,
    moisturePercent: 75.8,
    pdcaas: 0.91,
    preparationContext:
      "EFSA 2025 Table 1, frozen biomass, wet basis, batch #6 (AOAC protein, fibre, fat, moisture).",
    confidenceNotes:
      "Copied from one EFSA batch so the numbers are not an average we invented. Other batches in that table: protein 11.3–13.4%, fibre 8.5–9.2%, fat 1.2–1.6%, moisture 74.7–76.8%. PDCAAS 0.91 is the applicant value reported by EFSA. EFSA did not establish safety of this novel food.",
    citationKeys: ["efsa2025_flavolapis"],
  },
  "cyclocybe-aegerita": {
    proteinPercent: 3.9,
    fiberPercent: 5.07,
    fatPercent: 0.8,
    moisturePercent: 87.4,
    preparationContext:
      "Manzi et al. (2004) Table 1 and Table 3 sample K: fresh Agrocybe aegerita, g/100 g edible weight. Protein is N × 4.38.",
    confidenceNotes:
      "Copied from Manzi 2004 raw fresh sample K. Fibre is total dietary fibre (Table 3). This is fresh-weight Italian grocery material, not dry matter.",
    citationKeys: ["manzi2013"],
  },
  "pleurotus-eryngii": {
    proteinPercent: 2.2,
    fiberPercent: 4.64,
    fatPercent: 0.8,
    moisturePercent: 86.6,
    preparationContext:
      "Manzi et al. (2004) Table 1 and Table 3 sample L: fresh Pleurotus eryngii, g/100 g edible weight. Protein is N × 4.38.",
    confidenceNotes:
      "Copied from Manzi 2004 raw fresh sample L. Fibre is total dietary fibre (Table 3). Fresh-weight, not dry matter. Reis et al. (2012) Table 2 is a different Portuguese supermarket sample (moisture 89.00, protein 1.21, fat 0.16 g/100 g fw, N × 4.38) and is not shown in these fields so the two papers are not mixed.",
    citationKeys: ["manzi2013", "bao2008"],
  },
  "agaricus-bisporus": {
    proteinPercent: 1.23,
    fatPercent: 0.19,
    moisturePercent: 91.27,
    preparationContext:
      "Reis et al. (2012) Table 2: white Agaricus bisporus (Champignon), supermarket fruiting bodies, Bragança, packed 23-03-2011. g/100 g fresh weight. Protein is N × 4.38 (AOAC / macro-Kjeldahl).",
    confidenceNotes:
      "Copied from Table 2 means (not SD). Brown/Portobello in the same table: moisture 91.64, protein 1.29, fat 0.14 g/100 g fw — not averaged into these fields. Fibre was not measured; carbohydrates (6.46 g/100 g fw, by difference) are not a fibre value. The discussion sentence gives protein 1.04–1.10 g/100 g for white, brown and king oyster, which does not match Table 2; the table is what is shown.",
    citationKeys: ["bao2008"],
  },
  "pleurotus-ostreatus": {
    proteinPercent: 0.76,
    fatPercent: 0.15,
    moisturePercent: 89.17,
    preparationContext:
      "Reis et al. (2012) Table 2: oyster mushroom, supermarket fruiting bodies, Bragança, packed 21-03-2011. g/100 g fresh weight. Protein is N × 4.38 (AOAC / macro-Kjeldahl).",
    confidenceNotes:
      "Copied from Table 2 means (not SD). Fibre was not measured; carbohydrates (9.30 g/100 g fw, by difference) are not a fibre value.",
    citationKeys: ["bao2008"],
  },
  "lentinula-edodes": {
    proteinPercent: 0.89,
    fatPercent: 0.35,
    moisturePercent: 79.78,
    preparationContext:
      "Reis et al. (2012) Table 2: shiitake, supermarket fruiting bodies, Bragança, packed 06-04-2011. g/100 g fresh weight. Protein is N × 4.38 (AOAC / macro-Kjeldahl).",
    confidenceNotes:
      "Copied from Table 2 means (not SD). Fibre was not measured; carbohydrates (17.62 g/100 g fw, by difference) are not a fibre value.",
    citationKeys: ["bao2008"],
  },
  "flammulina-velutipes": {
    proteinPercent: 0.47,
    fatPercent: 0.21,
    moisturePercent: 87.87,
    preparationContext:
      "Reis et al. (2012) Table 2: golden needle mushroom, supermarket fruiting bodies, Bragança, packed 06-04-2011. g/100 g fresh weight. Protein is N × 4.38 (AOAC / macro-Kjeldahl).",
    confidenceNotes:
      "Copied from Reis Table 2 means (not SD). Fibre was not measured; carbohydrates (10.57 g/100 g fw, by difference) are not a fibre value. Yang, Lin & Mau (2001) Table 1 yellow winter mushroom (dry weight, N × 4.38): protein 26.7%, crude fibre 16.98%, crude fat 9.23%; moisture 87.16% fresh weight. Those dry-weight figures are not shown in these % fields so wet and dry bases are not mixed.",
    citationKeys: ["bao2008", "yang2013_enoki"],
  },
};

const NUTRITION_EMPTY_NOTE =
  "No proximate or amino-acid value is shown until it is copied from a paper table or sentence. Citation badges are leads, not a copied number.";

/** 0–5 bars copied from a published scale (rescaled). Empty means not proposed. */
const LITERATURE_TASTE_AXES: Record<string, Record<string, number>> = Object.fromEntries(
  Object.entries(PHAT_2016_UMAMI).map(([slug, row]) => [slug, { umami: phatUmamiBar(row.score) }]),
);

function verifiedNutrition(sp: SpeciesSeed): SpeciesSeed["nutrition"] {
  const extracted = VERIFIED_NUTRITION[sp.slug];
  if (!extracted) {
    return {
      proteinPercent: undefined,
      fiberPercent: undefined,
      fatPercent: undefined,
      moisturePercent: undefined,
      aminoAcids: undefined,
      aminoAcidBasis: undefined,
      pdcaas: undefined,
      diaas: undefined,
      limitingAminoAcids: undefined,
      preparationContext: undefined,
      confidenceNotes: NUTRITION_EMPTY_NOTE,
      citationKeys: sp.nutrition.citationKeys,
    };
  }
  return {
    proteinPercent: extracted.proteinPercent,
    fiberPercent: extracted.fiberPercent,
    fatPercent: extracted.fatPercent,
    moisturePercent: extracted.moisturePercent,
    aminoAcids: undefined,
    aminoAcidBasis: undefined,
    pdcaas: extracted.pdcaas,
    diaas: undefined,
    limitingAminoAcids: undefined,
    preparationContext: extracted.preparationContext,
    confidenceNotes: extracted.confidenceNotes,
    citationKeys: extracted.citationKeys,
  };
}

function mergeEvidence(
  existing: SensoryPublishedMeasurement[] | undefined,
  extra: SensoryPublishedMeasurement[] | undefined,
): SensoryPublishedMeasurement[] | undefined {
  const merged = [...(existing ?? []), ...(extra ?? [])];
  if (merged.length === 0) return existing;
  const seen = new Set<string>();
  const out: SensoryPublishedMeasurement[] = [];
  for (const row of merged) {
    const key = `${row.doi ?? row.citationKey}|${row.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

function auditStrains(strains: SpeciesSeed["strains"]): SpeciesSeed["strains"] {
  return strains
    .filter((strain) => strain.strainId && strain.strainId !== "TBD")
    .map((strain) => {
      if (isStrainProductUrl(strain.catalogUrl)) return strain;
      return {
        ...strain,
        catalogUrl: "",
        availabilityNotes: [
          strain.availabilityNotes,
          "No public strain-level catalog page was verified; collection homepage links were removed.",
        ]
          .filter(Boolean)
          .join(" "),
      };
    });
}

export function applyScientificAudit(sp: SpeciesSeed): SpeciesSeed {
  const ncbi = NCBI_TAXONOMY_ID[sp.slug] ?? (sp.ncbiTaxonomyId === "000000" ? "" : sp.ncbiTaxonomyId);
  const analog = MEAT_ANALOG[sp.slug];
  const keptEvidence = (sp.sensory.publishedEvidence ?? []).filter((row) => {
    const yangRow = row.doi?.toLowerCase() === YANG_2001_DOI;
    return !yangRow || YANG_2001_SPECIES.has(sp.slug);
  });
  const phatRow = phat2016Panel(sp.slug);
  const publishedEvidence = mergeEvidence(keptEvidence, [
    ...(PUBLISHED_SENSORY[sp.slug] ?? []),
    ...(phatRow ? [phatRow] : []),
  ]);
  const citationKeys = [...sp.sensory.citationKeys];
  for (const row of publishedEvidence ?? []) {
    if (!citationKeys.includes(row.citationKey)) citationKeys.push(row.citationKey);
  }

  const commercialUse = sp.commercialUse
    ? {
        ...sp.commercialUse,
        meatAlternativeUse: analog?.meatAlternativeUse ?? false,
        commercialStatus: COMMERCIAL_COPY[sp.slug]?.status ?? sp.commercialUse.commercialStatus,
        applicationSummary:
          COMMERCIAL_COPY[sp.slug]?.applicationSummary ?? sp.commercialUse.applicationSummary,
        companies: COMMERCIAL_COPY[sp.slug]?.companies ?? sp.commercialUse.companies,
        productionProcess:
          COMMERCIAL_COPY[sp.slug]?.productionProcess ?? sp.commercialUse.productionProcess,
        confidenceNotes:
          COMMERCIAL_COPY[sp.slug]?.confidenceNotes ??
          (analog
            ? "Meat-analog wording was limited to uses that can be pointed to a product or a culinary practice, not to scaffold scores."
            : sp.commercialUse.confidenceNotes),
      }
    : sp.commercialUse;

  return {
    ...sp,
    ncbiTaxonomyId: ncbi,
    strains: auditStrains(sp.strains),
    sensory: {
      ...sp.sensory,
      tasteAxes: LITERATURE_TASTE_AXES[sp.slug] ?? {},
      textureAxes: {},
      meatAnalogPotential:
        analog?.potential ??
        (sp.sensory.meatAnalogPotential === "low" || sp.sensory.meatAnalogPotential === "unknown"
          ? sp.sensory.meatAnalogPotential
          : "unknown"),
      meatAnalogRationale:
        analog?.rationale ??
        (sp.sensory.meatAnalogPotential === "high" || sp.sensory.meatAnalogPotential === "moderate"
          ? "No verified commercial meat-analog product or published analog panel was curated for this species."
          : sp.sensory.meatAnalogRationale),
      confidenceNotes: phatDisclaimer(sp.slug),
      publishedEvidence,
      citationKeys,
    },
    nutrition: verifiedNutrition(sp),
    commercialUse,
  };
}
