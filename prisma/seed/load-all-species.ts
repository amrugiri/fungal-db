import fs from "node:fs";
import path from "node:path";
import { altProteinResearchBySlug } from "./alt-protein-research";
import { applySpeciesImages } from "./species-images";
import { applySpeciesOverlay } from "./species-overlays";
import { speciesData as builtInSpeciesData } from "./species-data";
import type { SpeciesBundle } from "./species-bundle";
import type { SpeciesSeed } from "./species-data";

const CUSTOM_SPECIES_DIR = path.join(process.cwd(), "prisma/seed/species");

export function loadCustomSpeciesBundles(): SpeciesBundle[] {
  if (!fs.existsSync(CUSTOM_SPECIES_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CUSTOM_SPECIES_DIR)
    .filter((file) => file.endsWith(".json") && !file.startsWith("_"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CUSTOM_SPECIES_DIR, file), "utf8");
      return JSON.parse(raw) as SpeciesBundle;
    });
}

export function loadCustomSpeciesBundlesBySlug(): Map<string, SpeciesBundle> {
  return new Map(loadCustomSpeciesBundles().map((bundle) => [bundle.species.slug, bundle]));
}

export function loadAllSpeciesSeeds(): SpeciesSeed[] {
  const customBySlug = loadCustomSpeciesBundlesBySlug();
  const merged: SpeciesSeed[] = [];

  for (const sp of builtInSpeciesData.map(applySpeciesOverlay).map(applySpeciesImages)) {
    const custom = customBySlug.get(sp.slug);
    merged.push(custom ? applySpeciesImages(custom.species) : sp);
  }

  for (const [slug, bundle] of customBySlug) {
    if (!builtInSpeciesData.some((sp) => sp.slug === slug)) {
      merged.push(applySpeciesImages(applySpeciesOverlay(bundle.species)));
    }
  }

  return merged.sort((a, b) => a.scientificName.localeCompare(b.scientificName));
}

export function loadAltProteinResearchMap(): Record<string, SpeciesBundle["altProteinResearch"]> {
  const map: Record<string, SpeciesBundle["altProteinResearch"]> = { ...altProteinResearchBySlug };

  for (const bundle of loadCustomSpeciesBundles()) {
    if (bundle.altProteinResearch?.length) {
      map[bundle.species.slug] = bundle.altProteinResearch;
    }
  }

  return map;
}

export function getSpeciesBundleBySlug(slug: string): SpeciesBundle | null {
  const customPath = path.join(CUSTOM_SPECIES_DIR, `${slug}.json`);
  if (fs.existsSync(customPath)) {
    return JSON.parse(fs.readFileSync(customPath, "utf8")) as SpeciesBundle;
  }

  const builtIn = builtInSpeciesData.find((sp) => sp.slug === slug);
  if (!builtIn) return null;

  return {
    species: applySpeciesImages(applySpeciesOverlay(builtIn)),
    altProteinResearch: altProteinResearchBySlug[slug],
  };
}
