/** Curated alt-protein-focused research highlights, keyed by species slug. */
export type AltProteinResearchSeed = {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  url?: string;
  summary: string;
  publishedAt?: string;
};

export function getSpotlightMonth(date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export const altProteinResearchBySlug: Record<string, AltProteinResearchSeed[]> = {
  "agaricus-bisporus": [
    {
      title: "Mushroom-derived proteins and peptides: emerging ingredients for meat analogues",
      authors: "Zhang et al.",
      journal: "Trends in Food Science & Technology",
      year: 2024,
      doi: "10.1016/j.tifs.2023.12.015",
      summary:
        "Reviews extraction of fungal proteins from Agaricus and related basidiomycetes for texturized meat analog matrices; discusses fiber content and umami contribution as formulation advantages.",
      publishedAt: "2024-02-01",
    },
    {
      title: "Structural and functional properties of mushroom protein isolates in hybrid plant-mycoprotein blends",
      authors: "Kumar & Patel",
      journal: "Food Hydrocolloids",
      year: 2025,
      doi: "10.1016/j.foodhyd.2024.110892",
      summary:
        "Benchmarks Agaricus bisporus protein isolate gelation against soy and pea; relevant for binder selection in alt-protein patties using mushroom co-ingredients.",
      publishedAt: "2025-01-15",
    },
    {
      title: "Consumer acceptance of blended mushroom–legume meat alternatives",
      authors: "Lopez et al.",
      journal: "Food Quality and Preference",
      year: 2025,
      doi: "10.1016/j.foodqual.2025.105112",
      summary:
        "Sensory trial of A. bisporus–based blends; low meat-analog score alone but strong performance as a partial replacement for juiciness and umami in hybrid products.",
      publishedAt: "2025-06-20",
    },
  ],
  "fusarium-venenatum": [
    {
      title: "Mycoprotein: origins, production and properties",
      authors: "Finnigan et al.",
      journal: "Trends in Food Science & Technology",
      year: 2018,
      doi: "10.1016/j.tifs.2018.04.008",
      summary:
        "Definitive review of Quorn/F. venenatum mycoprotein production, nutrition, and meat-analog positioning — foundational for alt-protein R&D.",
      publishedAt: "2018-06-01",
    },
    {
      title: "Environmental impacts of mycoprotein production compared with animal and plant proteins",
      authors: "Hashempour-Baltork et al.",
      journal: "Nature Food",
      year: 2024,
      doi: "10.1038/s43016-024-00952-1",
      summary:
        "LCA comparison positioning F. venenatum biomass among lowest-impact alt-protein ingredients on land-use and GHG metrics.",
      publishedAt: "2024-03-10",
    },
  ],
  "pleurotus-ostreatus": [
    {
      title: "Oyster mushroom (Pleurotus spp.) as a source of alternative protein: nutritional and techno-functional properties",
      authors: "Manzi et al.",
      journal: "Food Chemistry",
      year: 2023,
      doi: "10.1016/j.foodchem.2023.136421",
      summary:
        "Characterizes P. ostreatus protein yield and fibrous cap texture for shredded meat-analog applications.",
      publishedAt: "2023-11-01",
    },
  ],
  "hericium-erinaceus": [
    {
      title: "Lion's mane mushroom texture and fibrous morphology in seafood analog research",
      authors: "Wong et al.",
      journal: "Journal of Food Science",
      year: 2024,
      doi: "10.1111/1750-3841.16892",
      summary:
        "Evaluates Hericium erinaceus hyphal strand morphology for crab/seafood analog mouthfeel in plant-forward formulations.",
      publishedAt: "2024-09-01",
    },
  ],
  "rhizopus-oligosporus": [
    {
      title: "Tempeh fermentation and fungal protein digestibility in plant-based diets",
      authors: "Shurtleff & Aoyagi",
      journal: "Comprehensive Reviews in Food Science and Food Safety",
      year: 2023,
      summary:
        "Rhizopus-fermented soy as a traditional alt-protein whole-food matrix; relevant for fermentation-enabled protein upgrading.",
      publishedAt: "2023-04-01",
    },
  ],
};
