/** Verified Wikimedia direct image URLs (no /thumb/ paths — those return HTTP 400). */
export const speciesImageUrls: Record<
  string,
  { url: string; caption: string; license: string; attributionText: string; sourceUrl: string }
> = {
  "pleurotus-ostreatus": {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Pleurotus_ostreatus_JPG7.jpg",
    caption: "Oyster mushroom fruiting bodies",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus_JPG7.jpg",
  },
  "pleurotus-eryngii": {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Seta_de_cardo_%28Pleurotus_eryngii%29%2C_2012-10-03%2C_DD_01.JPG",
    caption: "King oyster mushroom",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Seta_de_cardo_(Pleurotus_eryngii),_2012-10-03,_DD_01.JPG",
  },
  "hericium-erinaceus": {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Lion%27s-mane_mushroom_imported_from_iNaturalist_photo_29576097_on_21_March_2024.jpg",
    caption: "Lion's mane fruiting body",
    license: "CC BY 4.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lion%27s-mane_mushroom_imported_from_iNaturalist_photo_29576097_on_21_March_2024.jpg",
  },
  "agaricus-bisporus": {
    url: "https://upload.wikimedia.org/wikipedia/commons/0/01/ChampignonMushroom.jpg",
    caption: "Button mushroom (Agaricus bisporus)",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:ChampignonMushroom.jpg",
  },
  "lentinula-edodes": {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/64/Shiitakegrowing.jpg",
    caption: "Shiitake cultivation",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Shiitakegrowing.jpg",
  },
  "ganoderma-lucidum": {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Ganoderma.lucidum.shanofee.png",
    caption: "Reishi bracket fruiting bodies",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ganoderma.lucidum.shanofee.png",
  },
  "tremella-fuciformis": {
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Tremella_fuciformis_337510.jpg",
    caption: "Snow fungus fruiting body",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tremella_fuciformis_337510.jpg",
  },
  "grifola-frondosa": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/23/Grifola_frondosa_%2829715305790%29.jpg",
    caption: "Maitake fruiting body",
    license: "CC BY 2.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Grifola_frondosa_(29715305790).jpg",
  },
  "volvariella-volvacea": {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/fc/StrawMushroom.jpg",
    caption: "Straw mushroom",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:StrawMushroom.jpg",
  },
  "auricularia-auricula-judae": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Jelly_Ear%2C_Auricularia_auricula-judae%2C_UK_2.jpg",
    caption: "Wood ear fungus",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Jelly_Ear,_Auricularia_auricula-judae,_UK_2.jpg",
  },
  "aspergillus-oryzae": {
    url: "https://upload.wikimedia.org/wikipedia/commons/d/df/Conidia%2C_Strigma%2C_Vesicle%2C_and_Conidiophores_of_Aspergillus_in_LPCB_Tease_Mount_Microscopy.jpg",
    caption: "Aspergillus conidiophores and hyphae (LPCB stain)",
    license: "CC BY-SA 4.0",
    attributionText: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Conidia,_Sterigma,_Vesicle,_and_Conidiophores_of_Aspergillus_in_LPCB_Tease_Mount_Microscopy.jpg",
  },
  "rhizopus-oligosporus": {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Tempeh_Rhizopus_oligosporus.JPG",
    caption: "Tempeh (Rhizopus-fermented soybeans)",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tempeh_Rhizopus_oligosporus.JPG",
  },
  "neurospora-intermedia": {
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Neurospora_crassahyphae.jpg",
    caption: "Neurospora hyphae (microscopy)",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Neurospora_crassahyphae.jpg",
  },
  "trichoderma-reesei": {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/81/Trichoderma.reesei.jpg",
    caption: "Trichoderma reesei culture",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Trichoderma.reesei.jpg",
  },
  "ustilago-maydis": {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Ustilago_maydis_J1b.jpg",
    caption: "Corn smut (huitlacoche) galls on maize",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ustilago_maydis_J1b.jpg",
  },
  "morchella-spp": {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Morchella_esculenta_-_DE_-_TH_-_2013-05-01_-_01.JPG",
    caption: "Yellow morel fruiting bodies",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Morchella_esculenta_-_DE_-_TH_-_2013-05-01_-_01.JPG",
  },
  "calvatia-gigantea": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Giant_Puffball.jpg",
    caption: "Giant puffball",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Giant_Puffball.jpg",
  },
  "coprinus-comatus": {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/66/Coprinus_comatus%2C_the_shaggy_ink_cap%2C_lawyer%27s_wig%2C_or_shaggy_mane_mushroom.jpg",
    caption: "Shaggy mane mushroom",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Coprinus_comatus,_the_shaggy_ink_cap,_lawyer%27s_wig,_or_shaggy_mane_mushroom.jpg",
  },
  "flammulina-velutipes": {
    url: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Flammulina_velutipes_04.jpg",
    caption: "Enoki (Flammulina velutipes) fruiting bodies",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Flammulina_velutipes_04.jpg",
  },
  "hypsizygus-marmoreus": {
    url: "https://upload.wikimedia.org/wikipedia/commons/1/14/2012-08-27_Hypsizygus_marmoreus_%28Peck%29_H.E._Bigelow_320031.jpg",
    caption: "Beech mushroom (Hypsizygus marmoreus)",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2012-08-27_Hypsizygus_marmoreus_(Peck)_H.E._Bigelow_320031.jpg",
  },
  "pleurotus-citrinopileatus": {
    url: "https://upload.wikimedia.org/wikipedia/commons/9/92/Limonenseitlinge_%28Pleurotus_citrinopileatus%29_-_20100828.jpg",
    caption: "Golden oyster (Pleurotus citrinopileatus)",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Limonenseitlinge_(Pleurotus_citrinopileatus)_-_20100828.jpg",
  },
  "pleurotus-djamor": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Pleurotus_djamor_crop.jpg",
    caption: "Pink oyster (Pleurotus djamor)",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pleurotus_djamor_crop.jpg",
  },
  "cyclocybe-aegerita": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/23/Agrocybe_aegerita.jpg",
    caption: "Pioppino (Cyclocybe / Agrocybe aegerita)",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Agrocybe_aegerita.jpg",
  },
  "pholiota-nameko": {
    url: "https://upload.wikimedia.org/wikipedia/commons/3/38/Pholiota_nameko_culture.JPG",
    caption: "Nameko (Pholiota nameko) cultivated fruiting bodies",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pholiota_nameko_culture.JPG",
  },
  "calocybe-indica": {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/83/Calocybe_indica_884511.jpg",
    caption: "Milky mushroom (Calocybe indica)",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Calocybe_indica_884511.jpg",
  },
  "stropharia-rugosoannulata": {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/2011-05-19_Stropharia_rugosoannulata_Farl._ex_Murrill_183478.jpg",
    caption: "Wine cap (Stropharia rugosoannulata)",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2011-05-19_Stropharia_rugosoannulata_Farl._ex_Murrill_183478.jpg",
  },
  "laetiporus-sulphureus": {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Laetiporus_sulphureus_big.jpg",
    caption: "Chicken of the woods (Laetiporus sulphureus)",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Laetiporus_sulphureus_big.jpg",
  },
  "sparassis-crispa": {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Cauliflower_fungus%2C_Ehrenbach.jpg",
    caption: "Cauliflower mushroom (Sparassis crispa)",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Cauliflower_fungus,_Ehrenbach.jpg",
  },
  "schizophyllum-commune": {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Schizophyllum_commune_%28849610%29.jpg",
    caption: "Split gill (Schizophyllum commune)",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Schizophyllum_commune_(849610).jpg",
  },
  "aspergillus-sojae": {
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Shoyukoji.jpg",
    caption: "Soy sauce koji (Aspergillus sojae on soy)",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Shoyukoji.jpg",
  },
  "rhizopus-oryzae": {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Tempeh_Rhizopus_oligosporus.JPG",
    caption: "Tempeh — Rhizopus solid-state fermentation (R. oryzae also used as starter)",
    license: "CC BY-SA 3.0",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tempeh_Rhizopus_oligosporus.JPG",
  },
  "cordyceps-militaris": {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Puppenkernkeule.jpg",
    caption: "Cordyceps militaris stromata",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Puppenkernkeule.jpg",
  },
  "agaricus-subrufescens": {
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Agaricus_subrufescens.jpg",
    caption: "Almond mushroom (Agaricus subrufescens)",
    license: "CC BY-SA (Wikimedia Commons)",
    attributionText: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Agaricus_subrufescens.jpg",
  },
};

export function applySpeciesImages<T extends { slug: string; images: { url: string }[] }>(
  sp: T,
): T {
  const fixed = speciesImageUrls[sp.slug];
  if (!fixed || sp.images.length === 0) return sp;
  return {
    ...sp,
    images: [{ ...sp.images[0], ...fixed }, ...sp.images.slice(1)],
  };
}
