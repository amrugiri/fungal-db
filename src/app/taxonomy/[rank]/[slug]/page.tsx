import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScientificName } from "@/components/species/ScientificName";
import { formatEnumLabel } from "@/lib/format";
import { parseCommonNames } from "@/lib/types";
import {
  getSpeciesByTaxon,
  getTaxonDisplayName,
  isTaxonomyRank,
  rankLabel,
  type TaxonomyRank,
} from "@/lib/taxonomy";

type PageProps = {
  params: Promise<{ rank: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { rank, slug } = await params;
  if (!isTaxonomyRank(rank)) {
    return { title: "Taxon not found" };
  }

  const species = await getSpeciesByTaxon(rank, slug);
  if (species.length === 0) {
    return { title: "Taxon not found" };
  }

  const name = getTaxonDisplayName(rank, slug, species);
  return {
    title: `${rankLabel(rank)}: ${name}`,
    description: `Species in the database classified under ${rankLabel(rank)} ${name}.`,
  };
}

export default async function TaxonomyPage({ params }: PageProps) {
  const { rank: rankParam, slug } = await params;
  if (!isTaxonomyRank(rankParam)) {
    notFound();
  }

  const rank = rankParam as TaxonomyRank;
  const species = await getSpeciesByTaxon(rank, slug);
  if (species.length === 0) {
    notFound();
  }

  const taxonName = getTaxonDisplayName(rank, slug, species);
  const italicName = rank === "genus";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 text-foreground">
      <p className="font-sans text-sm text-muted">
        <Link href="/" className="text-berry hover:underline">
          Species Database
        </Link>
        {" › "}
        <span>{rankLabel(rank)}</span>
      </p>

      <h1 className="mt-2 font-display text-3xl font-bold text-truffle">
        {italicName ? <em>{taxonName}</em> : taxonName}
      </h1>
      <p className="mt-1 font-sans text-sm text-muted">
        {rankLabel(rank)} · {species.length} species in database
      </p>

      <ul className="mt-8 divide-y divide-border rounded-lg border border-border bg-surface">
        {species.map((s) => {
          const commonNames = parseCommonNames(s.commonNames);
          return (
            <li key={s.id}>
              <Link
                href={`/species/${s.slug}`}
                className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-4 hover:bg-cream"
              >
                <span className="font-sans text-lg font-medium text-berry">
                  <ScientificName genus={s.genus} speciesEpithet={s.speciesEpithet} />
                </span>
                <span className="font-sans text-sm text-muted">
                  {commonNames.length > 0 ? commonNames.join(" · ") : ""}
                </span>
                <span className="w-full font-sans text-xs text-muted sm:w-auto">
                  {formatEnumLabel(s.verificationStatus)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
