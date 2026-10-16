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
      title: "Non-volatile taste components of several commercial mushrooms",
      authors: "Yang, Lin & Mau",
      journal: "Food Chemistry",
      year: 2001,
      doi: "10.1016/s0308-8146(00)00262-4",
      summary:
        "HPLC of free amino acids and 5′-nucleotides in commercial fruiting bodies, including A. bisporus. The published chemical basis for umami in this species — not a meat-analog process paper.",
      publishedAt: "2001-03-01",
    },
    {
      title:
        "Nutritional, Medicinal, and Cosmetic Value of Bioactive Compounds in Button Mushroom (Agaricus bisporus): A Review",
      authors: "Usman, Murtaza & Ditta",
      journal: "Applied Sciences",
      year: 2021,
      doi: "10.3390/app11135943",
      summary:
        "Reviews composition and uses of A. bisporus. Culinary co-ingredient, not a dedicated mycoprotein platform.",
      publishedAt: "2021-06-28",
    },
  ],
  "fusarium-venenatum": [
    {
      title: "Mycoprotein: The Future of Nutritious Nonmeat Protein, a Symposium Review",
      authors: "Finnigan et al.",
      journal: "Current Developments in Nutrition",
      year: 2019,
      doi: "10.1093/cdn/nzz021",
      summary:
        "Definitive review of Quorn/F. venenatum mycoprotein production, nutrition, and meat-analog positioning — foundational for alt-protein R&D.",
      publishedAt: "2018-06-01",
    },
    {
      title:
        "Mycoprotein as novel functional ingredient: Mapping of functionality, composition and structure throughout the Quorn fermentation process",
      authors: "Lonchamp et al.",
      journal: "Food Chemistry",
      year: 2022,
      doi: "10.1016/j.foodchem.2022.133736",
      summary:
        "Maps composition and structure of F. venenatum biomass through the commercial fermentation process — process-level evidence for meat-analog functionality.",
      publishedAt: "2022-12-01",
    },
  ],
  "pleurotus-ostreatus": [
    {
      title: "Commercial mushrooms: nutritional quality and effect of cooking",
      authors: "Manzi, Marconi, Aguzzi & Pizzoferrato",
      journal: "Food Chemistry",
      year: 2003,
      doi: "10.1016/s0308-8146(03)00202-4",
      summary:
        "Nutrient composition of commercial mushrooms including Pleurotus, and the effect of cooking. Composition paper, not a shredded-analog process study.",
      publishedAt: "2003-02-01",
    },
  ],
  "hericium-erinaceus": [
    {
      title: "Hericium erinaceus, an amazing medicinal mushroom",
      authors: "Thongbai, Rapior, Hyde, Wittstein & Stadler",
      journal: "Mycological Progress",
      year: 2015,
      doi: "10.1007/s11557-015-1105-4",
      summary:
        "Reviews chemistry and uses of H. erinaceus. Fibrous hymenial spines are morphological, not a published seafood-analog process paper.",
      publishedAt: "2015-09-16",
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
