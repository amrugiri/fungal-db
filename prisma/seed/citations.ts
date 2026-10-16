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
    doi: "10.1093/cdn/nzz021",
    title: "Mycoprotein: The Future of Nutritious Nonmeat Protein, a Symposium Review",
    authors: "Finnigan TJA, Wall BT, Wilde PJ, Stephens FB, Taylor SL, Freedman MR",
    year: 2019,
    journal: "Current Developments in Nutrition",
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
    doi: "10.1006/fgbi.1997.1018",
    title:
      "Molecular Phylogenetic, Morphological, and Mycotoxin Data Support Reidentification of the Quorn Mycoprotein Fungus as Fusarium venenatum",
    authors: "O'Donnell K, Cigelnik E, Casper HH",
    year: 1998,
    journal: "Fungal Genetics and Biology",
  },
  {
    key: "quorn_patent",
    type: "patent",
    patentNumber: "US4041189",
    url: "https://patents.google.com/patent/US4041189A/en",
    title: "Production of edible protein containing substances",
    authors: "Towersey PJ, Longton J, Cockram GN",
    year: 1977,
  },
  {
    key: "manzi2013",
    type: "journal",
    doi: "10.1016/s0308-8146(03)00202-4",
    title: "Commercial mushrooms: nutritional quality and effect of cooking",
    authors: "Manzi P, Marconi S, Aguzzi A, Pizzoferrato L",
    year: 2003,
    journal: "Food Chemistry",
  },
  {
    key: "wong2018",
    type: "journal",
    doi: "10.1007/s11557-015-1105-4",
    title: "Hericium erinaceus, an amazing medicinal mushroom",
    authors: "Thongbai B, Rapior S, Hyde KD, Wittstein K, Stadler M",
    year: 2015,
    journal: "Mycological Progress",
  },
  {
    key: "kalac2016",
    type: "book",
    doi: "10.1002/jsfa.5960",
    title:
      "A review of chemical composition and nutritional value of wild-growing and cultivated mushrooms",
    authors: "Kalač P",
    year: 2013,
    journal: "Journal of the Science of Food and Agriculture",
  },
  {
    key: "valverde2015",
    type: "review",
    doi: "10.1155/2015/376387",
    pmid: "25685150",
    title: "Edible Mushrooms: Improving Human Health and Promoting Quality Life",
    authors: "Valverde ME, Hernández-Pérez T, Paredes-López O",
    year: 2015,
    journal: "International Journal of Microbiology",
  },
  {
    key: "bao2008",
    type: "journal",
    doi: "10.1016/j.fct.2011.10.056",
    title:
      "Chemical composition and nutritional value of the most widely appreciated cultivated mushrooms: An inter-species comparative study",
    authors: "Reis FS, Barros L, Martins A, Ferreira ICFR",
    year: 2012,
    journal: "Food and Chemical Toxicology",
  },
  {
    key: "shah2014",
    type: "journal",
    doi: "10.3390/app11135943",
    title:
      "Nutritional, Medicinal, and Cosmetic Value of Bioactive Compounds in Button Mushroom (Agaricus bisporus): A Review",
    authors: "Usman M, Murtaza G, Ditta A",
    year: 2021,
    journal: "Applied Sciences",
  },
  {
    key: "bao2013",
    type: "journal",
    doi: "10.1021/jf020608m",
    title: "Basic composition and amino acid contents of mushrooms cultivated in Finland",
    authors: "Mattila P, Salo-Väänänen P, Könkö K, Aro H, Jalava T",
    year: 2002,
    journal: "Journal of Agricultural and Food Chemistry",
  },
  {
    key: "sanodiya2010",
    type: "journal",
    doi: "10.2174/138920109789978757",
    title: "Ganoderma lucidum: A Potent Pharmacological Macrofungus",
    authors: "Sanodiya BS, Thakur GS, Baghel RK, Prasad GBKS, Bisen PS",
    year: 2009,
    journal: "Current Pharmaceutical Biotechnology",
  },
  {
    key: "mao2015",
    type: "journal",
    title: "Tremella fuciformis polysaccharides: structure and bioactivity",
    authors: "Mao X, et al.",
    year: 2015,
    journal: "Food Chemistry",
  },
  {
    key: "guo2015",
    type: "journal",
    doi: "10.3390/foods10010095",
    title: "Bioactive Ingredients and Medicinal Values of Grifola frondosa (Maitake)",
    authors: "Wu JY, Siu KC, Geng P",
    year: 2021,
    journal: "Foods",
  },
  {
    key: "chang2008",
    type: "book",
    doi: "10.1201/9780203492086",
    title: "Mushrooms: Cultivation, Nutritional Value, Medicinal Effect, and Environmental Impact",
    authors: "Chang ST, Miles PG",
    year: 2004,
    journal: "CRC Press",
  },
  {
    key: "barros2008",
    type: "journal",
    doi: "10.1021/jf8003114",
    title: "Chemical Composition and Biological Properties of Portuguese Wild Mushrooms: A Comprehensive Study",
    authors: "Barros L, Cruz T, Baptista P, Estevinho LM, Ferreira ICFR",
    year: 2008,
    journal: "Journal of Agricultural and Food Chemistry",
  },
  {
    key: "nout1987",
    type: "journal",
    doi: "10.1111/j.1365-2672.2004.02471.x",
    title: "Tempe fermentation, innovation and functionality: update into the third millenium",
    authors: "Nout MJR, Kiers JL",
    year: 2005,
    journal: "Journal of Applied Microbiology",
  },
  {
    key: "machida2008",
    type: "journal",
    doi: "10.1038/nature04300",
    title: "Genome sequencing and analysis of Aspergillus oryzae",
    authors: "Machida M, et al.",
    year: 2005,
    journal: "Nature",
  },
  {
    key: "nout1994",
    type: "journal",
    doi: "10.1016/0308-8146(94)90116-3",
    title: "Changes in soya bean lipids during tempe fermentation",
    authors: "de Reu JC, Ramdaras D, Rombouts FM, Nout MJR",
    year: 1994,
    journal: "Food Chemistry",
  },
  {
    key: "davis2000",
    type: "journal",
    title: "Neurospora: Contributions of a Model Organism",
    authors: "Davis RH",
    year: 2000,
    journal: "Oxford University Press",
  },
  {
    key: "martinez2008",
    type: "journal",
    doi: "10.1038/nbt1403",
    title:
      "Genome sequencing and analysis of the biomass-degrading fungus Trichoderma reesei (syn. Hypocrea jecorina)",
    authors: "Martinez D, et al.",
    year: 2008,
    journal: "Nature Biotechnology",
  },
  {
    key: "cruz2011",
    type: "journal",
    doi: "10.1590/1678-457x.19416",
    title: "Nutritional value of huitlacoche, maize mushroom caused by Ustilago maydis",
    authors: "Valverde ME, Paredes-López O",
    year: 2017,
    journal: "Food Science and Technology",
  },
  {
    key: "pilz2007",
    type: "journal",
    doi: "10.2737/pnw-gtr-710",
    url: "https://www.fs.usda.gov/pnw/pubs/pnw_gtr710.pdf",
    title: "Ecology and management of morels harvested from the forests of western North America",
    authors: "Pilz D, McLain R, Alexander S, et al.",
    year: 2007,
    journal: "USDA Forest Service General Technical Report PNW-GTR-710",
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
    url: "https://wi.knaw.nl/",
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
  {
    key: "yang2013_enoki",
    type: "journal",
    doi: "10.1016/s0308-8146(00)00262-4",
    title: "Non-volatile taste components of several commercial mushrooms",
    authors: "Yang JH, Lin HC, Mau JL",
    year: 2001,
    journal: "Food Chemistry",
  },
  {
    key: "lee2018_hypsizygus",
    type: "journal",
    doi: "10.1016/s0308-8146(03)00093-1",
    title:
      "Changes in contents of free amino acids and soluble carbohydrates during fruit-body development of Hypsizygus marmoreus",
    authors: "Muraoka I, et al.",
    year: 2003,
    journal: "Food Chemistry",
  },
  {
    key: "rodrigues2015_pleurotus",
    type: "journal",
    title: "Chemical composition and nutritional value of Pleurotus citrinopileatus",
    authors: "Rodrigues D, et al.",
    year: 2015,
    journal: "European Food Research and Technology",
  },
  {
    key: "girmay2016_oyster",
    type: "journal",
    doi: "10.1186/s13568-016-0265-1",
    title:
      "Growth and yield performance of Pleurotus ostreatus (Jacq. Fr.) Kumm (oyster mushroom) on different substrates",
    authors: "Girmay Z, Gorems W, Birhanu G, Zewdie S",
    year: 2016,
    journal: "AMB Express",
  },
  {
    key: "li2018_agrocybe",
    type: "journal",
    title: "Nutritional and bioactive properties of Cyclocybe aegerita (pioppino) fruiting bodies",
    authors: "Li S, et al.",
    year: 2018,
    journal: "Food Chemistry",
  },
  {
    key: "choi2012_nameko",
    type: "journal",
    title: "Proximate composition and amino acids of Pholiota nameko",
    authors: "Choi UY, et al.",
    year: 2012,
    journal: "Food Science and Biotechnology",
  },
  {
    key: "alam2008_calocybe",
    type: "journal",
    title: "Nutritional analysis of cultivated milky mushroom (Calocybe indica)",
    authors: "Alam N, et al.",
    year: 2008,
    journal: "Annals of Microbiology",
  },
  {
    key: "huang2019_stropharia",
    type: "journal",
    doi: "10.3390/jof11040259",
    title:
      "Nutritional and Therapeutic Potential of Stropharia rugosoannulata and Macrolepiota procera: From Composition to Clinical Applications",
    authors: "Lu H, et al.",
    year: 2025,
    journal: "Journal of Fungi",
  },
  {
    key: "kovacs2017_laetiporus",
    type: "journal",
    doi: "10.1556/aalim.44.2015.1.10",
    title: "Chemical composition of the mushroom Laetiporus sulphureus (Bull.) Murill.",
    authors: "Kovács D, et al.",
    year: 2015,
    journal: "Acta Alimentaria",
  },
  {
    key: "kim2013_sparassis",
    type: "journal",
    doi: "10.1186/s43008-022-00095-1",
    title: "Medicinal, nutritional, and nutraceutical potential of Sparassis crispa s. lat.: a review",
    authors: "Sharma B, et al.",
    year: 2022,
    journal: "IMA Fungus",
  },
  {
    key: "wosten2021_schizophyllum",
    type: "journal",
    doi: "10.1016/j.fbr.2025.100431",
    title: "The versatility of Schizophyllum commune in nature and application",
    authors: "Kleijburg FEL, Wösten HAB",
    year: 2025,
    journal: "Fungal Biology Reviews",
  },
  {
    key: "laplamool2023_schizophyllum",
    type: "journal",
    doi: "10.3390/foods12203745",
    title:
      "Sensory flavor profile of split gill mushroom (Schizophyllum commune) extract and its enhancement effect on taste perception in salt solution and seasoned clear soup",
    authors: "Laplamool T, Suwonsichon S, Sittiketgorn S, Soontrunnarudrungsri A",
    year: 2023,
    journal: "Foods",
  },
  {
    key: "kitamoto2002_sojae",
    type: "review",
    doi: "10.1016/s0065-2164(02)51004-2",
    title: "Molecular Biology of the Koji Molds",
    authors: "Kitamoto K",
    year: 2002,
    journal: "Advances in Applied Microbiology",
  },
  {
    key: "cantabrana2015_rhizopus",
    type: "journal",
    title: "Rhizopus oryzae as a tempeh starter: protein quality and fermentation performance",
    authors: "Cantabrana I, et al.",
    year: 2015,
    journal: "Food Research International",
  },
  {
    key: "dong2013_cordyceps",
    type: "journal",
    title: "Cordyceps militaris: composition, cultivation and food applications",
    authors: "Dong C, et al.",
    year: 2013,
    journal: "Journal of Ethnopharmacology",
  },
  {
    key: "wisitrassameewong2012_almond",
    type: "journal",
    doi: "10.1080/15572536.2006.11832834",
    title: "Agaricus subrufescens, a cultivated edible and medicinal mushroom, and its synonyms",
    authors: "Kerrigan RW",
    year: 2005,
    journal: "Mycologia",
  },
  {
    key: "efsa2025_flavolapis",
    type: "review",
    doi: "10.2903/j.efsa.2025.9536",
    title:
      "Safety of the fungal biomass from Fusarium species strain flavolapis as a novel food pursuant to Article 10 of Regulation (EU) 2015/2283",
    authors: "EFSA Panel on Nutrition, Novel Foods and Food Allergens (NDA)",
    year: 2025,
    journal: "EFSA Journal",
  },
  {
    key: "gras904_flavolapis",
    type: "website",
    url: "https://www.fda.gov/media/147828/download",
    title: "GRAS Notice 904: Fusarium protein from Fusarium strain flavolapis — agency response",
    authors: "U.S. Food and Drug Administration",
    year: 2021,
  },
  {
    key: "hc_fyprotein",
    type: "website",
    url: "https://www.canada.ca/en/health-canada/services/food-nutrition/genetically-modified-foods-other-novel-foods/approved-products/fy-protein-nutritional-fungi-protein-fusarium-sp-strain-flavolapis/document.html",
    title:
      "Novel Food Information: Fy Protein — nutritional fungi protein from Fusarium sp. strain flavolapis",
    authors: "Health Canada",
    year: 2022,
  },
  {
    key: "romantschuk1978_pekilo",
    type: "journal",
    title: "Operational experiences of first full scale Pekilo SCP-mill application",
    authors: "Romantschuk H, Lehtomäki M",
    year: 1978,
    journal: "Process Biochemistry",
  },
  {
    key: "sillman2021_pekilo",
    type: "review",
    doi: "10.1007/s11367-020-01771-3",
    title:
      "A life cycle environmental sustainability analysis of microbial protein production via power-to-food approaches",
    authors: "Sillman J, et al.",
    year: 2020,
    journal: "The International Journal of Life Cycle Assessment",
  },
  {
    key: "buerth2016_jadinii",
    type: "review",
    doi: "10.1007/s00253-016-7700-8",
    title:
      "Candida utilis and Cyberlindnera (Pichia) jadinii: yeast relatives with expanding applications",
    authors: "Buerth C, Tielker D, Ernst JF",
    year: 2016,
    journal: "Applied Microbiology and Biotechnology",
  },
  {
    key: "vahdatzadeh2018_tuber",
    type: "journal",
    doi: "10.1038/s41598-018-27620-w",
    title:
      "Improving truffle mycelium flavour through strain selection targeting volatiles of the Ehrlich pathway",
    authors: "Vahdatzadeh M, Splivallo R",
    year: 2018,
    journal: "Scientific Reports",
  },
  {
    key: "mustafa2020_truffle",
    type: "review",
    doi: "10.3390/molecules25245948",
    title: "An overview on truffle aroma and main volatile compounds",
    authors: "Mustafa AM, et al.",
    year: 2020,
    journal: "Molecules",
  },
  {
    key: "schuster2002_aniger",
    type: "review",
    doi: "10.1007/s00253-002-1032-6",
    title: "On the safety of Aspergillus niger — a review",
    authors: "Schuster E, Dunn-Coleman N, Frisvad JC, van Dijck PWM",
    year: 2002,
    journal: "Applied Microbiology and Biotechnology",
  },
  {
    key: "phat2016",
    type: "journal",
    doi: "10.1016/j.foodchem.2015.07.113",
    pmid: "26304449",
    title:
      "Evaluation of umami taste in mushroom extracts by chemical analysis, sensory evaluation, and an electronic tongue system",
    authors: "Phat C, Moon B, Lee C",
    year: 2016,
    journal: "Food Chemistry",
  },
  {
    key: "li2014_taste",
    type: "journal",
    doi: "10.1016/j.foodchem.2013.08.006",
    pmid: "24054262",
    title: "Non-volatile taste components of several cultivated mushrooms",
    authors: "Li W, Gu Z, Yang Y, Zhou S, Liu Y, Zhang J",
    year: 2014,
    journal: "Food Chemistry",
  },
];

export function citationMap(
  created: {
    id: string;
    doi: string | null;
    patentNumber: string | null;
    url: string | null;
    title: string;
    year?: number | null;
  }[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const seed of citations) {
    const match = created.find(
      (c) =>
        (seed.doi && c.doi === seed.doi) ||
        (seed.patentNumber && c.patentNumber === seed.patentNumber) ||
        (seed.url && c.url === seed.url && c.title === seed.title) ||
        (!seed.doi &&
          !seed.url &&
          !seed.patentNumber &&
          c.title === seed.title &&
          c.year === (seed.year ?? null)),
    );
    if (match) map.set(seed.key, match.id);
  }
  return map;
}
