export type CommercialCompany = {
  name: string;
  products?: string[];
  website?: string;
  notes?: string;
  region?: string;
};

export type ProductionProcessStep = {
  title: string;
  description: string;
  learnMoreUrl?: string;
  learnMoreLabel?: string;
};

export type TasteAxes = Record<string, number>;
export type TextureAxes = Record<string, number>;
export type AminoAcidBasis = "per_100g_protein" | "per_100g_food" | "percent_of_protein";

export type AminoAcids = Record<string, number>;

export type AminoAcidProfile = {
  basis: AminoAcidBasis;
  values: AminoAcids;
};

export type MorphologyParameters = {
  visualizationStyle?: "microscopy" | "macroscopic";
  stainColor?: string;
  backgroundColor?: string;
  hyphaeBranchAngle: number;
  hyphaeThickness: number;
  hyphaeColor: string;
  hyphaeDensity: number;
  fruitingBodyType:
    | "none"
    | "mushroom"
    | "oyster"
    | "king_oyster"
    | "coral"
    | "lions_mane"
    | "maitake"
    | "puffball"
    | "jelly"
    | "smut"
    | "morel"
    | "bracket";
  capDiameter: number;
  stipeLength: number;
  capColor: string;
  showMycelium: boolean;
  showFruitingBody: boolean;
};

export function parseJsonField<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseCommonNames(value: string): string[] {
  return parseJsonField<string[]>(value, []);
}
