import type { AltProteinResearchSeed } from "./alt-protein-research";
import type { SpeciesSeed } from "./species-data";

/** Full species payload stored in prisma/seed/species/<slug>.json */
export type SpeciesBundle = {
  species: SpeciesSeed;
  altProteinResearch?: AltProteinResearchSeed[];
};
