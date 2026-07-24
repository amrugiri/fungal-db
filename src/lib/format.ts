export function formatEnumLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatTagLabel(tag: string): string {
  return tag
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatScientificNameParts(genus: string, speciesEpithet: string): string {
  return `${genus} ${speciesEpithet}`;
}

export function formatProteinQualityScore(score: number): string {
  return score.toFixed(3);
}

export function formatOptionalProteinQualityScore(score: number | null): string {
  return score != null ? formatProteinQualityScore(score) : "Not reported";
}

const AMINO_ACID_LABELS: Record<string, string> = {
  aspartic_acid: "Aspartic acid",
  glutamic_acid: "Glutamic acid",
};

export function formatAminoAcidLabel(key: string): string {
  if (AMINO_ACID_LABELS[key]) {
    return AMINO_ACID_LABELS[key];
  }
  return formatTagLabel(key);
}

export function aminoAcidBasisLabel(basis: string): string {
  switch (basis) {
    case "per_100g_protein":
      return "g per 100 g protein";
    case "per_100g_food":
      return "g per 100 g food";
    case "percent_of_protein":
      return "% of protein";
    default:
      return basis;
  }
}

const REGULATORY_LABELS: Record<string, string> = {
  gras: "GRAS",
  novel_food_authorized: "Novel Food Authorized",
  traditional_food: "Traditional Food / Long History of Use",
  approved_safe: "Approved Safe",
  not_evaluated: "Not Evaluated",
  not_approved_food: "Not Approved as Food",
  restricted_use: "Restricted Use",
};

export function formatRegulatoryStatus(status: string | null | undefined): string {
  if (!status) return "Not recorded";
  return REGULATORY_LABELS[status] ?? formatEnumLabel(status);
}

const CITATION_LEVEL_DESCRIPTIONS: Record<string, string> = {
  peer_reviewed: "Multiple peer-reviewed sources support this entry",
  expert_verified: "Reviewed by a domain expert curator",
  single_source: "Based on a single credible source",
  draft: "Initial entry — citations incomplete",
};

export function citationLevelDescription(status: string): string {
  return CITATION_LEVEL_DESCRIPTIONS[status] ?? "Database citation quality level";
}
