import { formatScientificNameParts } from "@/lib/format";

type ScientificNameProps = {
  genus: string;
  speciesEpithet?: string;
  scientificName?: string;
  className?: string;
};

/** Genus and species epithet in italics per ICN nomenclature. */
export function ScientificName({
  genus,
  speciesEpithet,
  scientificName,
  className = "",
}: ScientificNameProps) {
  if (speciesEpithet) {
    return (
      <em className={className}>{formatScientificNameParts(genus, speciesEpithet)}</em>
    );
  }

  const parts = (scientificName ?? genus).trim().split(/\s+/);
  if (parts.length >= 2) {
    return (
      <em className={className}>
        {parts[0]} {parts.slice(1).join(" ")}
      </em>
    );
  }

  return <em className={className}>{genus}</em>;
}

/** Taxonomic ranks above species are roman; genus and species are italic. */
export function TaxonomyBreadcrumb({
  kingdom,
  phylum,
  taxonomicClass,
  order,
  family,
  genus,
  speciesEpithet,
}: {
  kingdom?: string | null;
  phylum?: string | null;
  taxonomicClass?: string | null;
  order?: string | null;
  family?: string | null;
  genus: string;
  speciesEpithet?: string;
}) {
  const ranks: { label: string; italic: boolean }[] = [];
  if (kingdom) ranks.push({ label: kingdom, italic: false });
  if (phylum) ranks.push({ label: phylum, italic: false });
  if (taxonomicClass) ranks.push({ label: taxonomicClass, italic: false });
  if (order) ranks.push({ label: order, italic: false });
  if (family) ranks.push({ label: family, italic: false });
  ranks.push({ label: genus, italic: true });
  if (speciesEpithet) ranks.push({ label: speciesEpithet, italic: true });

  return (
    <p className="text-sm text-black">
      {ranks.map((rank, i) => (
        <span key={`${rank.label}-${i}`}>
          {i > 0 && " › "}
          {rank.italic ? <em>{rank.label}</em> : rank.label}
        </span>
      ))}
    </p>
  );
}
