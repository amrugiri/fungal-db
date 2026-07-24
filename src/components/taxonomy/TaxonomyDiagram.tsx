import Link from "next/link";
import { rankFromDiagramLabel, taxonomyRankPath } from "@/lib/taxonomy";

export type TaxonomyLevel = {
  rank: string;
  name: string;
};

type TaxonomyDiagramProps = {
  levels: TaxonomyLevel[];
  speciesEpithet?: string;
  hideTitle?: boolean;
  embedded?: boolean;
};

export function TaxonomyDiagram({
  levels,
  speciesEpithet,
  hideTitle = false,
  embedded = false,
}: TaxonomyDiagramProps) {
  const allLevels = speciesEpithet
    ? [...levels, { rank: "Species", name: speciesEpithet }]
    : levels;

  return (
    <div
      className={embedded ? undefined : "rounded-lg border border-zinc-200 bg-white p-5"}
      aria-label="Taxonomic classification diagram"
    >
      {!hideTitle && <p className="mb-4 text-base font-bold text-black">Classification</p>}
      <ol className="flex flex-col items-center gap-0" aria-label="Taxonomic ranks">
        {allLevels.map((level, index) => {
          const isSpecies = level.rank === "Species";
          const isGenus = level.rank === "Genus";
          const highlight = isSpecies || isGenus;
          const taxonRank = rankFromDiagramLabel(level.rank);
          const href = taxonRank ? taxonomyRankPath(taxonRank, level.name) : null;

          const boxClasses = [
            "flex w-full max-w-[320px] flex-col items-center justify-center rounded-md border px-3 py-3 text-center transition-colors",
            highlight
              ? "border-green-600 bg-green-50"
              : "border-zinc-300 bg-zinc-50",
            href ? "hover:border-zinc-500 hover:bg-zinc-100" : "",
          ].join(" ");

          const content = (
            <>
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                {level.rank}
              </span>
              <span
                className={`mt-1 text-base text-black ${isSpecies || isGenus ? "font-bold italic" : "font-medium"}`}
              >
                {level.name}
              </span>
            </>
          );

          return (
            <li key={`${level.rank}-${level.name}`} className="flex w-full flex-col items-center">
              {index > 0 && <span className="my-1 h-4 w-px bg-zinc-300" aria-hidden />}
              {href ? (
                <Link href={href} className={boxClasses} aria-label={`View ${level.rank} ${level.name}`}>
                  {content}
                </Link>
              ) : (
                <div className={boxClasses}>{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function buildTaxonomyLevels(taxonomy: {
  kingdom?: string | null;
  phylum?: string | null;
  class?: string | null;
  order?: string | null;
  family?: string | null;
  genus: string;
}): TaxonomyLevel[] {
  const ranks: TaxonomyLevel[] = [];
  if (taxonomy.kingdom) ranks.push({ rank: "Kingdom", name: taxonomy.kingdom });
  if (taxonomy.phylum) ranks.push({ rank: "Phylum", name: taxonomy.phylum });
  if (taxonomy.class) ranks.push({ rank: "Class", name: taxonomy.class });
  if (taxonomy.order) ranks.push({ rank: "Order", name: taxonomy.order });
  if (taxonomy.family) ranks.push({ rank: "Family", name: taxonomy.family });
  ranks.push({ rank: "Genus", name: taxonomy.genus });
  return ranks;
}
