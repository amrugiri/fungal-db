/**
 * Registry of real 3D meshes (.glb) used by the interactive morphology viewer.
 *
 * A species listed here renders actual geometry — a surface the user can orbit,
 * look up into, and slice — rather than the parametric primitives or reference
 * image planes used as fallbacks. Every entry must declare where its geometry
 * came from, because a research reference database should never present an
 * unverified mesh as though it were a measured specimen.
 */

export type ModelProvenance =
  /** Photogrammetric reconstruction of a real specimen — accurate by construction. */
  | "photogrammetry"
  /** Hand/procedurally modelled from measurements published in the literature. */
  | "literature-modelled"
  /** Representative shape only; anatomy is schematic and not source-verified. */
  | "illustrative";

export type SpeciesMorphologyModel = {
  /** Path under /public. */
  url: string;
  /**
   * Up-axis of the source file. Blender/trimesh export Z-up; three.js is Y-up,
   * so "z" models get a -90 deg X rotation at load.
   */
  upAxis: "y" | "z";
  /**
   * Largest bounding-box dimension after normalisation, in scene units.
   * The scene camera sits at 2.65 with a 36 deg fov, so ~1.15 frames well while
   * preserving the model's real cap-to-stipe proportions.
   */
  targetSize?: number;
  /**
   * Node names of the *closed* parts, which get a filled cut face when the
   * cross-section is on. Open/zero-thickness geometry (gill ribbons, spines)
   * must be left out: the stencil pass counts a surface's inside, and an open
   * surface has none. Omit to disable capping entirely for this model.
   */
  solidParts?: string[];
  /** Colour of the cut face — the species' context (flesh). */
  sectionFleshColor?: string;
  provenance: ModelProvenance;
  /** Provenance note surfaced in the viewer info panel. */
  sourceNote: string;
};

export const PROVENANCE_LABELS: Record<ModelProvenance, string> = {
  photogrammetry: "Scanned specimen",
  "literature-modelled": "Literature-modelled",
  illustrative: "Illustrative model",
};

export const speciesMorphologyModels: Partial<Record<string, SpeciesMorphologyModel>> = {
  "agaricus-bisporus": {
    url: "/models/agaricus-bisporus.glb",
    upAxis: "z",
    // All four parts are watertight — build_mushroom.py verifies this and
    // refuses to export otherwise — so every one of them gets a filled cut face,
    // including the lamellae, which read as thin slivers of flesh in section.
    solidParts: ["pileus_cap", "stipe_stem", "lamellae_gills", "annulus_ring"],
    sectionFleshColor: "#f2ece0",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh built from the described anatomy of Agaricus bisporus (convex pileus, radial lamellae, annulate stipe) via scripts/build_mushroom.py. Geometry is representative, not a scan of a measured specimen — replace with a photogrammetric capture before citing dimensions.",
  },
  "auricularia-auricula-judae": {
    url: "/models/auricularia-auricula-judae.glb",
    upAxis: "z",
    solidParts: ["hymenial_layer", "abhymenial_layer", "attachment_base"],
    // Gelatinous context is pale and translucent against the dark brown faces.
    sectionFleshColor: "#c9a894",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh built from the described anatomy of Auricularia auricula-judae (sessile auriculate cup, undulating lobed margin, veined hymenium) via scripts/build_wood_ear.py. Modelled as two plies distinguishing the fertile hymenial from the sterile abhymenial face, at roughly life thickness (~2 mm across a 6 cm ear); real context is more finely stratified than two layers. Geometry is representative, not a scan of a measured specimen.",
  },

  // The remainder are built from shared body plans in scripts/morphotypes.py,
  // driven by scripts/build_species.py. Each takes its proportions from this
  // species' own capDiameter / stipeLength record rather than a generic shape.
  "lentinula-edodes": {
    url: "/models/lentinula-edodes.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "stipe_stem", "lamellae_gills"],
    sectionFleshColor: "#f0ebdf",
    provenance: "illustrative",
    sourceNote:
      "Procedural gilled-agaric mesh: convex pileus, adnexed lamellae and a tough central stipe, proportioned from the 8 cm cap / 4 cm stipe on record. Exannulate, matching mature shiitake. Cap colour deviates from the record's stored capColor (#8b6914), which renders as an olive-gold at odds with the same record's own description of a brown cap. Geometry is representative, not a scan of a measured specimen.",
  },
  "volvariella-volvacea": {
    url: "/models/volvariella-volvacea.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "stipe_stem", "lamellae_gills", "volva_cup"],
    sectionFleshColor: "#f2ede2",
    provenance: "illustrative",
    sourceNote:
      "Procedural gilled-agaric mesh proportioned from the 6 cm cap / 8 cm stipe on record, with the prominent basal volva that distinguishes the genus modelled as a closed cup. Exannulate. Gills coloured for the pink mature state. Geometry is representative, not a scan of a measured specimen.",
  },
  "coprinus-comatus": {
    url: "/models/coprinus-comatus.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "stipe_stem", "lamellae_gills", "annulus_ring"],
    sectionFleshColor: "#f7f5f0",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of the shaggy ink cap in its young, edible state: the elongate near-cylindric pileus, shaggy recurved scales, crowded lamellae filling the cap interior, and the movable annulus. Proportioned from the 5 cm cap / 10 cm stipe on record. Deliquescence is not modelled. Geometry is representative, not a scan of a measured specimen.",
  },
  "pleurotus-eryngii": {
    url: "/models/pleurotus-eryngii.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "stipe_stem", "lamellae_gills"],
    sectionFleshColor: "#f4efe4",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh proportioned from the 5 cm cap / 14 cm stipe on record — the inverted proportions that make this species mostly dense stipe tissue, which is what the meat-analog literature is interested in. Shallow cap with decurrent lamellae. Geometry is representative, not a scan of a measured specimen.",
  },
  "pleurotus-ostreatus": {
    url: "/models/pleurotus-ostreatus.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "lamellae_gills", "stipe_stem"],
    sectionFleshColor: "#f2ece0",
    provenance: "illustrative",
    sourceNote:
      "Procedural shelf-form mesh: a laterally attached eccentric fan with decurrent lamellae running onto a rudimentary off-centre stipe, proportioned from the 9 cm cap / 2 cm stipe on record. Models a single basidiocarp rather than the imbricate cluster it usually fruits in. Geometry is representative, not a scan of a measured specimen.",
  },
  "ganoderma-lucidum": {
    url: "/models/ganoderma-lucidum.glb",
    upAxis: "z",
    solidParts: ["pileus_crust", "pore_surface", "stipe_stem"],
    sectionFleshColor: "#c8a882",
    provenance: "illustrative",
    sourceNote:
      "Procedural polypore mesh: reniform laterally stalked bracket, modelled as two plies separating the varnished upper crust from the pale poroid hymenium beneath. Individual pores are below the resolution of the mesh and are represented by the surface material rather than geometry. Proportioned from the 10 cm cap / 2 cm stalk on record. Geometry is representative, not a scan of a measured specimen.",
  },
  "grifola-frondosa": {
    url: "/models/grifola-frondosa.glb",
    upAxis: "z",
    solidParts: ["pileus_fronds", "pore_surface", "stipe_stem"],
    sectionFleshColor: "#f0ebe0",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of the maitake rosette: nine imbricate spoon-shaped pilei arising from a branched basal stipe, each with a poroid underside ply. Proportioned from the 9 cm cluster / 3 cm stipe on record. Frond count is representative — wild clusters vary widely. Geometry is representative, not a scan of a measured specimen.",
  },
  "hericium-erinaceus": {
    url: "/models/hericium-erinaceus.glb",
    upAxis: "z",
    solidParts: ["context_mass", "hymenial_spines"],
    sectionFleshColor: "#f8f5ef",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of a tooth fungus: an irregular unbranched context cushion whose lower surface carries ~190 pendant spines. Hericium has neither cap nor gills — the spines are the hymenophore. Proportioned from the 7 cm body on record; spine count and placement are representative rather than counted from a specimen.",
  },
  "tremella-fuciformis": {
    url: "/models/tremella-fuciformis.glb",
    upAxis: "z",
    solidParts: ["gelatinous_lobes"],
    sectionFleshColor: "#f6f2ee",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of the snow fungus: a rosette of seven thin, strongly undulating gelatinous lobes radiating from a common base, proportioned from the 8 cm body on record. Rendered opaque; fresh material is markedly translucent. Geometry is representative, not a scan of a measured specimen.",
  },
  "calvatia-gigantea": {
    url: "/models/calvatia-gigantea.glb",
    upAxis: "z",
    solidParts: ["peridium_wall", "gleba_mass"],
    sectionFleshColor: "#f0ece0",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of a gasteroid basidiocarp: a subglobose body narrowing to a sterile base, modelled as a thin peridium wall enclosing a solid gleba so the cross-section shows the spore mass within its wall. Coloured for the immature white gleba — the only edible stage. Proportioned from the 12 cm body on record; wild specimens reach far larger.",
  },
  "morchella-spp": {
    url: "/models/morchella-spp.glb",
    upAxis: "z",
    solidParts: ["ascocarp_body"],
    sectionFleshColor: "#efe6d2",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of a true morel: a pitted and ridged conical cap fused to the stipe, and continuously hollow from the cap apex through the base — the diagnostic feature separating Morchella from the false morels, and the reason the cross-section is worth opening on this genus. Cap and stipe share one material because they are one continuous shell. Proportions deviate from the record's 9 cm stipe against a 5 cm cap, which describes no Morchella; that figure is read as overall height, putting the cap at about half the fruiting body. Pit arrangement is representative and is not species-diagnostic within the genus.",
  },

  // Microscopic species: PROTOTYPE, pending review before the other four moulds.
  "fusarium-venenatum": {
    url: "/models/fusarium-venenatum.glb",
    upAxis: "z",
    solidParts: ["hyphal_filaments", "septa_cross_walls"],
    sectionFleshColor: "#c4b49c",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of a branching septate mycelium — the only morphology this species has, since it forms no fruiting body. Branch angle (35°) and hyphal thickness come from the species' 3D-model record; septa, apical dominance and tip taper follow the described habit. Conidia, chlamydospores and hyphal anastomosis are not modelled. Scale is relative only: this is a fragment of mycelium a few hundred micrometres across and is not dimensionally comparable to the macroscopic species in this database.",
  },
  "ustilago-maydis": {
    url: "/models/ustilago-maydis.glb",
    upAxis: "z",
    solidParts: ["smut_galls", "host_husk"],
    sectionFleshColor: "#6b5a48",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of corn smut: irregular fused galls swelling from the host ear, with a husk stub for context. Ustilago has no fruiting body of its own — the gall is hypertrophied host tissue filled with teliospores, which is why this looks unlike every other model in the set. Proportioned from the 6 cm gall on record.",
  },

  // Second cohort, same pipeline (scripts/morphotypes.py + build_species.py).
  "flammulina-velutipes": {
    url: "/models/flammulina-velutipes.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "stipe_stem", "lamellae_gills"],
    sectionFleshColor: "#f5f1e4",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of enoki in its cultivated form: a caespitose cluster of nine individuals from a shared base, each with a minute convex pileus on a greatly elongated stipe — the 1.5 cm cap against a 12 cm stipe on record is the defining proportion of the crop. Cluster members are built at reduced tessellation. Wild-form basidiocarps are shorter-stiped and darker.",
  },
  "hypsizygus-marmoreus": {
    url: "/models/hypsizygus-marmoreus.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "stipe_stem", "lamellae_gills"],
    sectionFleshColor: "#f2ece0",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of buna-shimeji: a caespitose cluster of seven agarics with convex mottled pileus on a firm central stipe, proportioned from the 3 cm cap / 6 cm stipe on record. The marbling that gives the species its name is carried by surface colour, not geometry.",
  },
  "pholiota-nameko": {
    url: "/models/pholiota-nameko.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "stipe_stem", "lamellae_gills"],
    sectionFleshColor: "#f0e6d2",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of nameko: a clustered agaric proportioned from the 3 cm cap / 5 cm stipe on record. The pileus is given a low roughness to read as the conspicuous gelatinous viscidity the species is prized for; the gluten layer itself is not modelled as geometry.",
  },
  "cyclocybe-aegerita": {
    url: "/models/cyclocybe-aegerita.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "stipe_stem", "lamellae_gills", "annulus_ring"],
    sectionFleshColor: "#f2ece0",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of pioppino: a central-stiped agaric with convex brown pileus and the persistent membranous annulus left by its partial veil, proportioned from the 5 cm cap / 8 cm stipe on record.",
  },
  "calocybe-indica": {
    url: "/models/calocybe-indica.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "stipe_stem", "lamellae_gills"],
    sectionFleshColor: "#f7f4ec",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of the milky mushroom: a robust all-white agaric with a broad pileus on a thick central stipe, proportioned from the 10 cm cap / 8 cm stipe on record.",
  },
  "stropharia-rugosoannulata": {
    url: "/models/stropharia-rugosoannulata.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "stipe_stem", "lamellae_gills", "annulus_ring"],
    sectionFleshColor: "#f2ece0",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of the wine cap: a large agaric with wine-red pileus, thick stipe and the thick rugose annulus the epithet refers to, proportioned from the 12 cm cap / 10 cm stipe on record. Gills are coloured for the greying purple-black mature state; they are pale when young.",
  },
  "agaricus-subrufescens": {
    url: "/models/agaricus-subrufescens.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "stipe_stem", "lamellae_gills", "annulus_ring"],
    sectionFleshColor: "#f2ece0",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of the almond mushroom: free gills, annulate stipe and a finely fibrillose brown pileus, the fibrils carried as a fine radial surface warp. Proportioned from the 8 cm cap / 7 cm stipe on record.",
  },
  "pleurotus-citrinopileatus": {
    url: "/models/pleurotus-citrinopileatus.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "lamellae_gills", "stipe_stem"],
    sectionFleshColor: "#f6efd8",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of the golden oyster: four imbricate laterally attached fans with decurrent lamellae running onto short lateral stipes, proportioned from the 7 cm cap / 2 cm stipe on record. Bright yellow pigment fades markedly with age and on cooking.",
  },
  "pleurotus-djamor": {
    url: "/models/pleurotus-djamor.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "lamellae_gills", "stipe_stem"],
    sectionFleshColor: "#f6dfe6",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of the pink oyster: four imbricate fans with decurrent lamellae and a short eccentric stipe, proportioned from the 8 cm cap / 2 cm stipe on record. The salmon-pink pigment is strongest in young fruit bodies and fades substantially on cooking.",
  },
  "laetiporus-sulphureus": {
    url: "/models/laetiporus-sulphureus.glb",
    upAxis: "z",
    solidParts: ["pileus_crust", "pore_surface", "stipe_stem"],
    sectionFleshColor: "#f7e9b0",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of chicken of the woods: five imbricate annual shelves, modelled as two plies separating the orange upper surface from the sulphur-yellow poroid hymenium beneath. Sessile — the record gives no stipe, and the stalk in the mesh is a vestigial attachment stub only. Individual pores are below the resolution of the mesh.",
  },
  "sparassis-crispa": {
    url: "/models/sparassis-crispa.glb",
    upAxis: "z",
    solidParts: ["crisped_lobes", "rooting_base"],
    sectionFleshColor: "#f2ece0",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of the cauliflower fungus: a globose head built from 44 flattened, crisped lobes on a rooting base. Sparassis has no pileus and no distinct hymenophore of its own — the fertile surface is carried on the lobes, which are therefore the entire organism above ground. Lobe count is representative.",
  },
  "schizophyllum-commune": {
    url: "/models/schizophyllum-commune.glb",
    upAxis: "z",
    solidParts: ["pileus_cap", "split_folds"],
    sectionFleshColor: "#efe6d6",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of the split gill: a small sessile fan whose gill-like folds are modelled as PAIRS of half-blades leaning apart, because they are not true lamellae — each fold is split longitudinally down its length, the character the genus is named for. Proportioned from the 4 cm cap on record.",
  },
  "cordyceps-militaris": {
    url: "/models/cordyceps-militaris.glb",
    upAxis: "z",
    solidParts: ["clavate_stroma", "perithecia"],
    sectionFleshColor: "#e6a06a",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of cultivated Cordyceps: six unbranched clavate orange stromata with perithecia embedded over the swollen upper half, which is what gives a mature stroma its pimpled outline. There is no pileus and there are no gills. The host insect or grain substrate is not modelled.",
  },
  "aspergillus-sojae": {
    url: "/models/aspergillus-sojae.glb",
    upAxis: "z",
    solidParts: ["conidiophore_stipe", "vesicle_phialides", "conidial_chains"],
    sectionFleshColor: "#d8c9ac",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of a single conidial head — the structure Aspergillus is identified by, and quite unlike a branching mycelium. Foot cell, unbranched stipe, globose vesicle, and phialides distributed over the whole vesicle on a Fibonacci sphere, each carrying a basipetal chain of conidia. Modelled uniseriate; A. sojae heads may be uniseriate or biseriate. Scale is relative only and not comparable to the macroscopic species.",
  },
  "rhizopus-oryzae": {
    url: "/models/rhizopus-oryzae.glb",
    upAxis: "z",
    solidParts: ["stolons_rhizoids", "sporangia", "columellae"],
    sectionFleshColor: "#cbbba0",
    provenance: "illustrative",
    sourceNote:
      "Procedural mesh of the tempeh mould's characteristic architecture: arching stolons rooting at nodes by tufts of rhizoids, with sporangiophores rising opposite each node and bearing a globose sporangium over a columella — visible when sectioned. Rhizopus is COENOCYTIC, so no septa are modelled anywhere; the generic septate-hypha labels would be factually wrong for this genus. Scale is relative only.",
  },
};

export function getSpeciesMorphologyModel(slug: string): SpeciesMorphologyModel | null {
  return speciesMorphologyModels[slug] ?? null;
}
