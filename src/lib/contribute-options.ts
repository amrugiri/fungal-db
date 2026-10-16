export type ContributeSpeciesOption = {
  slug: string;
  scientificName: string;
};

export const SENSORY_CHARACTERISTICS = [
  { value: "", label: "Select characteristic" },
  { value: "umami", label: "Umami" },
  { value: "sweet", label: "Sweet" },
  { value: "bitter", label: "Bitter" },
  { value: "salty", label: "Salty" },
  { value: "sour", label: "Sour" },
  { value: "earthy", label: "Earthy" },
  { value: "nutty", label: "Nutty" },
  { value: "mild", label: "Mild" },
  { value: "meaty", label: "Meaty" },
  { value: "savory", label: "Savory" },
  { value: "chicken_like", label: "Chicken-like" },
  { value: "fibrous", label: "Fibrous (texture)" },
  { value: "chewy", label: "Chewy (texture)" },
  { value: "meat_like", label: "Meat-like (texture)" },
  { value: "crunchy", label: "Crunchy (texture)" },
  { value: "gelatinous", label: "Gelatinous (texture)" },
  { value: "tender", label: "Tender (texture)" },
  { value: "aroma", label: "Aroma" },
  { value: "other", label: "Other (describe in notes)" },
] as const;

export const SENSORY_EVIDENCE_KINDS = [
  { value: "", label: "Select evidence type" },
  { value: "panel_score", label: "Trained panel score" },
  { value: "taste_compound", label: "Taste-active compound (HPLC / chemistry)" },
  { value: "volatile", label: "Volatile (GC-MS)" },
  { value: "texture_instrumental", label: "Instrumental texture" },
  { value: "other", label: "Other published measurement" },
] as const;

export const SENSORY_UNITS = [
  { value: "", label: "Select unit" },
  { value: "0-5 intensity", label: "0–5 intensity" },
  { value: "1-11 panel", label: "1–11 panel scale" },
  { value: "mg/g dry weight", label: "mg/g dry weight" },
  { value: "g/100 g fresh weight", label: "g/100 g fresh weight" },
  { value: "g/100 g dry weight", label: "g/100 g dry weight" },
  { value: "mg MSG/g dry weight", label: "mg MSG/g dry weight (EUC)" },
  { value: "% wet weight", label: "% wet weight" },
  { value: "% dry weight", label: "% dry weight" },
  { value: "other", label: "Other (describe in notes)" },
] as const;

export const SENSORY_METHODS = [
  { value: "", label: "Select method" },
  { value: "trained_panel", label: "Trained sensory panel" },
  { value: "hplc", label: "HPLC" },
  { value: "gcms", label: "GC-MS" },
  { value: "electronic_tongue", label: "Electronic tongue" },
  { value: "texture_analyzer", label: "Texture analyzer" },
  { value: "other", label: "Other (describe in notes)" },
] as const;

export const MEAT_ANALOG_POTENTIALS = [
  { value: "", label: "Select potential" },
  { value: "high", label: "High" },
  { value: "moderate", label: "Moderate" },
  { value: "low", label: "Low" },
  { value: "unknown", label: "Unknown / not assessed" },
] as const;

export const MEAT_ANALOG_USE = [
  { value: "", label: "Select usage" },
  { value: "yes", label: "Used in meat-analog products" },
  { value: "no", label: "Not a primary meat analog" },
  { value: "unknown", label: "Unknown" },
] as const;

export const COMMERCIAL_STATUSES = [
  { value: "", label: "Select commercial status" },
  { value: "commercial_meat_analog", label: "Commercial meat analog" },
  { value: "commercial_food", label: "Commercial food" },
  { value: "traditional_food", label: "Traditional food" },
  { value: "research_only", label: "Research only" },
  { value: "none", label: "None" },
] as const;

export const CONSUMPTION_FORMS = [
  { value: "", label: "Select consumption form" },
  { value: "whole_mushroom", label: "Whole mushroom (fresh, cooked, dried, canned)" },
  { value: "processed_mycoprotein", label: "Processed mycoprotein / biomass" },
  { value: "hybrid", label: "Hybrid meat-analog formulation" },
  { value: "fermented_food", label: "Fermented food ingredient (koji, tempeh, oncom)" },
  { value: "other", label: "Other (describe in notes)" },
] as const;

export const PROOF_TYPES = [
  { value: "", label: "Select proof type" },
  { value: "peer_reviewed_paper", label: "Peer-reviewed paper" },
  { value: "preprint", label: "Preprint" },
  { value: "patent", label: "Patent" },
  { value: "lab_data", label: "Lab / thesis data" },
  { value: "product_spec", label: "Product specification or dossier" },
  { value: "other", label: "Other" },
] as const;

export type SensoryRowInput = {
  characteristic: string;
  evidenceKind: string;
  value: string;
  unit: string;
  method: string;
  sample: string;
  notes: string;
};

export function emptySensoryRow(): SensoryRowInput {
  return {
    characteristic: "",
    evidenceKind: "",
    value: "",
    unit: "",
    method: "",
    sample: "",
    notes: "",
  };
}

export function sensoryRowHasData(row: SensoryRowInput): boolean {
  return Boolean(
    row.characteristic ||
      row.evidenceKind ||
      row.value.trim() ||
      row.unit ||
      row.method ||
      row.sample.trim() ||
      row.notes.trim(),
  );
}
