import { db } from "@/lib/db";
import { parseCommonNames, parseJsonField, type TasteAxes, type TextureAxes } from "@/lib/types";

type AltProteinResearchHighlightRow = {
  id: string;
  speciesId: string;
  spotlightMonth: string;
  title: string;
  authors: string | null;
  journal: string | null;
  year: number | null;
  doi: string | null;
  url: string | null;
  summary: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

async function fetchAltProteinResearchHighlights(
  speciesId: string,
): Promise<AltProteinResearchHighlightRow[]> {
  const delegate = (
    db as {
      altProteinResearchHighlight?: {
        findMany: (args: unknown) => Promise<AltProteinResearchHighlightRow[]>;
      };
    }
  ).altProteinResearchHighlight;

  if (!delegate) return [];

  try {
    return await delegate.findMany({
      where: { speciesId },
      orderBy: [{ spotlightMonth: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getSpeciesList(search?: string) {
  const species = await db.species.findMany({
    include: {
      taxonomy: true,
      sensoryProfiles: { take: 1 },
      nutritionProfiles: { take: 1 },
      commercialApplications: { take: 1 },
    },
    orderBy: { scientificName: "asc" },
  });

  if (!search?.trim()) return species;

  const q = search.toLowerCase();
  return species.filter((s) => {
    const commonNames = parseCommonNames(s.commonNames);
    return (
      s.scientificName.toLowerCase().includes(q) ||
      s.genus.toLowerCase().includes(q) ||
      commonNames.some((n) => n.toLowerCase().includes(q))
    );
  });
}

export async function getSpeciesBySlug(slug: string) {
  const species = await db.species.findUnique({
    where: { slug },
    include: {
      taxonomy: true,
      sensoryProfiles: {
        include: {
          citationLinks: { include: { citation: true } },
        },
      },
      morphologies: true,
      nutritionProfiles: {
        include: {
          citationLinks: { include: { citation: true } },
        },
      },
      geographicDistributions: true,
      cultureCollectionStrains: true,
      commercialApplications: {
        include: {
          citationLinks: { include: { citation: true } },
        },
      },
      speciesImages: {
        include: {
          citationLinks: { include: { citation: true } },
        },
      },
      morphologyModels3D: {
        include: {
          citationLinks: { include: { citation: true } },
        },
      },
      citationLinks: { include: { citation: true } },
    },
  });

  if (!species) return null;

  const altProteinResearchHighlights = await fetchAltProteinResearchHighlights(species.id);

  return { ...species, altProteinResearchHighlights };
}

export async function getSpeciesByIds(slugs: string[]) {
  return db.species.findMany({
    where: { slug: { in: slugs } },
    include: {
      taxonomy: true,
      sensoryProfiles: { take: 1 },
      morphologies: { take: 1 },
      nutritionProfiles: { take: 1 },
      geographicDistributions: { take: 1 },
      cultureCollectionStrains: true,
      commercialApplications: { take: 1 },
      morphologyModels3D: { take: 1 },
      speciesImages: { take: 3 },
    },
  });
}

export type SpeciesRow = Awaited<ReturnType<typeof getSpeciesList>>[number];

export function getTasteTags(sensory: SpeciesRow["sensoryProfiles"][0] | undefined): string[] {
  if (!sensory) return [];
  const axes = parseJsonField<TasteAxes>(sensory.tasteAxes, {});
  return Object.entries(axes)
    .filter(([, v]) => v > 0)
    .map(([k]) => k);
}

export function getTextureTags(sensory: SpeciesRow["sensoryProfiles"][0] | undefined): string[] {
  if (!sensory) return [];
  const axes = parseJsonField<TextureAxes>(sensory.textureAxes, {});
  return Object.entries(axes)
    .filter(([, v]) => v > 0)
    .map(([k]) => k);
}

export function getProteinPercent(
  nutrition: SpeciesRow["nutritionProfiles"][0] | undefined,
): number | null {
  return nutrition?.proteinPercent ?? null;
}
