import { db } from "@/lib/db";

export const TAXONOMY_RANKS = [
  "kingdom",
  "phylum",
  "class",
  "order",
  "family",
  "genus",
] as const;

export type TaxonomyRank = (typeof TAXONOMY_RANKS)[number];

const RANK_LABELS: Record<TaxonomyRank, string> = {
  kingdom: "Kingdom",
  phylum: "Phylum",
  class: "Class",
  order: "Order",
  family: "Family",
  genus: "Genus",
};

export function isTaxonomyRank(value: string): value is TaxonomyRank {
  return (TAXONOMY_RANKS as readonly string[]).includes(value);
}

export function taxonomySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function taxonomyRankPath(rank: TaxonomyRank, name: string): string {
  return `/taxonomy/${rank}/${taxonomySlug(name)}`;
}

export function rankLabel(rank: TaxonomyRank): string {
  return RANK_LABELS[rank];
}

export function rankFromDiagramLabel(label: string): TaxonomyRank | null {
  const map: Record<string, TaxonomyRank> = {
    Kingdom: "kingdom",
    Phylum: "phylum",
    Class: "class",
    Order: "order",
    Family: "family",
    Genus: "genus",
  };
  return map[label] ?? null;
}

function taxonValueForRank(
  rank: TaxonomyRank,
  taxonomy: {
    kingdom: string;
    phylum: string | null;
    class: string | null;
    order: string | null;
    family: string | null;
  },
  genus: string,
): string | null {
  switch (rank) {
    case "kingdom":
      return taxonomy.kingdom;
    case "phylum":
      return taxonomy.phylum;
    case "class":
      return taxonomy.class;
    case "order":
      return taxonomy.order;
    case "family":
      return taxonomy.family;
    case "genus":
      return genus;
    default: {
      const _exhaustive: never = rank;
      return _exhaustive;
    }
  }
}

export async function getSpeciesByTaxon(rank: TaxonomyRank, slug: string) {
  const species = await db.species.findMany({
    include: { taxonomy: true },
    orderBy: { scientificName: "asc" },
  });

  return species.filter((s) => {
    if (!s.taxonomy) return false;
    const value = taxonValueForRank(rank, s.taxonomy, s.genus);
    return value != null && taxonomySlug(value) === slug;
  });
}

export function getTaxonDisplayName(
  rank: TaxonomyRank,
  slug: string,
  species: Awaited<ReturnType<typeof getSpeciesByTaxon>>,
): string {
  for (const s of species) {
    if (!s.taxonomy) continue;
    const value = taxonValueForRank(rank, s.taxonomy, s.genus);
    if (value != null && taxonomySlug(value) === slug) {
      return value;
    }
  }

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
