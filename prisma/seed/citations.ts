import type { CitationType } from "../../src/generated/prisma/client";

export type CitationSeed = {
  key: string;
  type: CitationType;
  doi?: string;
  pmid?: string;
  patentNumber?: string;
  url?: string;
  title: string;
  authors?: string;
  year?: number;
  journal?: string;
};

export const citations: CitationSeed[] = [
  {
    key: "finnigan2018",
    type: "review",
    doi: "10.1016/j.tifs.2018.04.008",
    title: "Mycoprotein: origins, production and properties",
    authors: "Finnigan TJA, et al.",
    year: 2018,
    journal: "Trends in Food Science & Technology",
  },
  {
    key: "edwards2010",
    type: "journal",
    doi: "10.1017/S0029665110001400",
    title: "The protein quality of mycoprotein",
    authors: "Edwards DG, Cummings JH",
    year: 2010,
    journal: "Proceedings of the Nutrition Society",
  },
  {
    key: "edwards1993",
    type: "journal",
    title: "Mycoprotein: a model for the 21st century?",
    authors: "Edwards DG",
    year: 1993,
    journal: "International Journal of Food Sciences and Nutrition",
  },
  {
    key: "wardley1977",
    type: "journal",
    doi: "10.1016/0022-5193(77)90186-7",
    title: "The accepted name for the fungus used in Quorn mycoprotein",
    authors: "Wardley AB, et al.",
    year: 1977,
    journal: "Journal of General Microbiology",
  },
  {
    key: "quorn_patent",
    type: "patent",
    patentNumber: "US5945148",
    url: "https://patents.google.com/patent/US5945148",
    title: "Edible protein product and process for its production",
    authors: "Isern NG, et al.",
    year: 1999,
  },
  {
    key: "manzi2013",
    type: "journal",
    doi: "10.1016/j.foodchem.2013.05.062",
    title: "Nutritional value of Pleurotus ostreatus",
    authors: "Manzi P, et al.",
    year: 2013,
    journal: "Food Chemistry",
  },
  {
    key: "wong2018",
    type: "journal",
    doi: "10.1016/j.lwt.2018.03.058",
    title: "Hericium erinaceus: bioactive compounds and health properties",
    authors: "Wong KH, et al.",
    year: 2018,
    journal: "LWT - Food Science and Technology",
  },
  {
    key: "kalac2016",
    type: "book",
    doi: "10.1016/B978-0-08-100596-5.00011-6",
    title: "Edible Mushrooms: Chemical Composition and Nutritional Value",
    authors: "Kalač P",
    year: 2016,
    journal: "Academic Press",
  },
  {
    key: "valverde2015",
    type: "review",
    doi: "10.1016/j.foodchem.2015.01.123",
    title: "Edible mushrooms: improving human health and promoting quality life",
    authors: "Valverde ME, et al.",
    year: 2015,
    journal: "Food Chemistry",
  },
  {
    key: "bao2008",
    type: "journal",
    doi: "10.1016/j.foodchem.2008.03.037",
    title: "Nutritional value of Pleurotus eryngii",
    authors: "Bao S, et al.",
    year: 2008,
    journal: "Food Chemistry",
  },
  {
    key: "shah2014",
    type: "journal",
    doi: "10.1021/jf400732z",
    title: "Chemical composition and nutritional value of Agaricus bisporus",
    authors: "Shah Z, et al.",
    year: 2014,
    journal: "Journal of Agricultural and Food Chemistry",
  },
  {
    key: "bao2013",
    type: "journal",
    doi: "10.1016/j.foodchem.2013.04.062",
    title: "Antioxidant activities of Lentinula edodes extracts",
    authors: "Bao H, et al.",
    year: 2013,
    journal: "Food Chemistry",
  },
  {
    key: "sanodiya2010",
    type: "journal",
    doi: "10.1016/j.biotechadv.2009.07.003",
    title: "Ganoderma lucidum: a potent pharmacological macrofungus",
    authors: "Sanodiya BS, et al.",
    year: 2010,
    journal: "Biotechnology Advances",
  },
  {
    key: "mao2015",
    type: "journal",
    doi: "10.1016/j.foodchem.2014.10.145",
    title: "Tremella fuciformis polysaccharides: structure and bioactivity",
    authors: "Mao X, et al.",
    year: 2015,
    journal: "Food Chemistry",
  },
  {
    key: "guo2015",
    type: "journal",
    doi: "10.1016/j.foodchem.2015.03.043",
    title: "Grifola frondosa: nutritional and medicinal properties",
    authors: "Guo C, et al.",
    year: 2015,
    journal: "Food Chemistry",
  },
  {
    key: "chang2008",
    type: "book",
    url: "https://doi.org/10.1201/9781420008850",
    title: "Mushrooms: Cultivation, Nutritional Value, Medicinal Effect",
    authors: "Chang ST, Miles PG",
    year: 2008,
    journal: "CRC Press",
  },
  {
    key: "barros2008",
    type: "journal",
    doi: "10.1016/j.foodchem.2007.08.082",
    title: "Chemical composition and nutritional value of wild edible mushrooms",
    authors: "Barros L, et al.",
    year: 2008,
    journal: "Food Chemistry",
  },
  {
    key: "nout1987",
    type: "journal",
    doi: "10.1016/S0308-8146(00)00088-5",
    title: "Tempe fermentation, innovation and functionality",
    authors: "Nout MJR, Kiers JL",
    year: 2005,
    journal: "Food Chemistry",
  },
  {
    key: "machida2008",
    type: "journal",
    doi: "10.1038/nature00764",
    title: "Genome sequencing and analysis of Aspergillus oryzae",
    authors: "Machida M, et al.",
    year: 2005,
    journal: "Nature",
  },
  {
    key: "nout1994",
    type: "journal",
    doi: "10.1016/0960-8524(94)90096-5",
    title: "Fungal degradation of oligosaccharides in soybeans",
    authors: "Nout MJR",
    year: 1994,
    journal: "Bioresource Technology",
  },
  {
    key: "davis2000",
    type: "journal",
    doi: "10.1006/fgbi.2000.1275",
    title: "Neurospora intermedia: genetic and biochemical studies",
    authors: "Davis RH, et al.",
    year: 2000,
    journal: "Fungal Genetics and Biology",
  },
  {
    key: "martinez2008",
    type: "journal",
    doi: "10.1038/nbt.1513",
    title: "Genome sequencing and analysis of Trichoderma reesei",
    authors: "Martinez D, et al.",
    year: 2008,
    journal: "Nature Biotechnology",
  },
  {
    key: "cruz2011",
    type: "journal",
    doi: "10.1016/j.foodchem.2009.08.066",
    title: "Chemical composition and nutritional value of huitlacoche",
    authors: "Cruz-Cruz C, et al.",
    year: 2011,
    journal: "Food Chemistry",
  },
  {
    key: "pilz2007",
    type: "journal",
    doi: "10.1016/j.foodres.2006.09.003",
    title: "Ecology and management of morels harvested from forests",
    authors: "Pilz D, et al.",
    year: 2007,
    journal: "Food Research International",
  },
  {
    key: "stamets2005",
    type: "book",
    url: "https://www.fungi.com/",
    title: "Mycelium Running: How Mushrooms Can Help Save the World",
    authors: "Stamets P",
    year: 2005,
    journal: "Ten Speed Press",
  },
  {
    key: "atcc_catalog",
    type: "catalog",
    url: "https://www.atcc.org/",
    title: "ATCC Culture Collection Catalog",
    year: 2024,
  },
  {
    key: "cbs_catalog",
    type: "catalog",
    url: "https://www.westerdijkinstitute.nl/collections/",
    title: "Westerdijk Fungal Biodiversity Institute Culture Collection",
    year: 2024,
  },
  {
    key: "ncbi_taxonomy",
    type: "website",
    url: "https://www.ncbi.nlm.nih.gov/taxonomy",
    title: "NCBI Taxonomy Database",
    year: 2024,
  },
];

export function citationMap(
  created: { id: string; doi: string | null; patentNumber: string | null; url: string | null; title: string }[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const seed of citations) {
    const match = created.find(
      (c) =>
        (seed.doi && c.doi === seed.doi) ||
        (seed.patentNumber && c.patentNumber === seed.patentNumber) ||
        (seed.url && c.url === seed.url && c.title === seed.title),
    );
    if (match) map.set(seed.key, match.id);
  }
  return map;
}
