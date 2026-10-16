import type { ReactNode } from "react";
import { formatScientificNameParts } from "@/lib/format";

const GENERA =
  "Agaricus|Aspergillus|Auricularia|Calocybe|Calvatia|Candida|Cantharellus|Coprinus|Cordyceps|Cyberlindnera|Cyclocybe|Flammulina|Fusarium|Ganoderma|Grifola|Hericium|Hypsizygus|Laetiporus|Lentinula|Morchella|Neurospora|Paecilomyces|Penicillium|Pholiota|Pleurotus|Rhizopus|Saccharomyces|Schizophyllum|Sparassis|Stropharia|Tremella|Trichoderma|Tricholoma|Tuber|Ustilago|Volvariella";

const TAXON_RE = new RegExp(
  `\\b(?:${GENERA})(?:\\s+(?:sp\\.|spp\\.|[a-z][a-z-]+))*\\b`,
  "g",
);

/** Italicize binomials and comparison genera in running copy. */
export function ItalicizeTaxa({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  const re = new RegExp(TAXON_RE.source, "g");
  for (const match of text.matchAll(re)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    nodes.push(<em key={index}>{match[0]}</em>);
    last = index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

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
      <em className={`italic ${className}`}>{formatScientificNameParts(genus, speciesEpithet)}</em>
    );
  }

  const parts = (scientificName ?? genus).trim().split(/\s+/);
  if (parts.length >= 2) {
    return (
      <em className={`italic ${className}`}>
        {parts[0]} {parts.slice(1).join(" ")}
      </em>
    );
  }

  return <em className={`italic ${className}`}>{genus}</em>;
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
