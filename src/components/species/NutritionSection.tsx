import { CitationBadge } from "@/components/citation-badge/CitationBadge";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { SubHeading, labelClass } from "@/components/ui/headings";
import {
  aminoAcidBasisLabel,
  formatAminoAcidLabel,
  formatOptionalProteinQualityScore,
} from "@/lib/format";
import { parseJsonField, type AminoAcids } from "@/lib/types";

const ESSENTIAL_AMINO_ACIDS = new Set([
  "histidine",
  "isoleucine",
  "leucine",
  "lysine",
  "methionine",
  "cystine",
  "phenylalanine",
  "threonine",
  "tryptophan",
  "valine",
]);

type NutritionProfileData = {
  proteinPercent: number | null;
  fiberPercent: number | null;
  fatPercent: number | null;
  moisturePercent: number | null;
  aminoAcids: string | null;
  aminoAcidBasis: string | null;
  pdcaas: number | null;
  diaas: number | null;
  limitingAminoAcids: string | null;
  preparationContext: string | null;
  confidenceNotes: string | null;
  citationLinks: { id: string; citation: Parameters<typeof CitationBadge>[0]["citation"] }[];
};

type NutritionSectionProps = {
  nutrition: NutritionProfileData;
};

export function NutritionSection({ nutrition }: NutritionSectionProps) {
  const aminoAcids = parseJsonField<AminoAcids>(nutrition.aminoAcids, {});
  const aminoAcidEntries = Object.entries(aminoAcids).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  return (
    <CollapsibleSection title="Nutrition" defaultOpen id="nutrition">
      <table className="w-full text-sm">
        <tbody>
          {nutrition.proteinPercent != null && (
            <tr className="border-b border-zinc-100">
              <td className={`py-2 ${labelClass}`}>Protein</td>
              <td className="py-2">{nutrition.proteinPercent}%</td>
            </tr>
          )}
          {nutrition.fiberPercent != null && (
            <tr className="border-b border-zinc-100">
              <td className={`py-2 ${labelClass}`}>Fiber</td>
              <td className="py-2">{nutrition.fiberPercent}%</td>
            </tr>
          )}
          {nutrition.fatPercent != null && (
            <tr className="border-b border-zinc-100">
              <td className={`py-2 ${labelClass}`}>Fat</td>
              <td className="py-2">{nutrition.fatPercent}%</td>
            </tr>
          )}
          {nutrition.moisturePercent != null && (
            <tr className="border-b border-zinc-100">
              <td className={`py-2 ${labelClass}`}>Moisture</td>
              <td className="py-2">{nutrition.moisturePercent}%</td>
            </tr>
          )}
        </tbody>
      </table>

      {nutrition.preparationContext && (
        <p className="mt-2 text-sm text-black">{nutrition.preparationContext}</p>
      )}

      <div className="mt-6">
        <SubHeading>Protein Quality</SubHeading>
        <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className={labelClass}>PDCAAS</dt>
            <dd>{formatOptionalProteinQualityScore(nutrition.pdcaas)}</dd>
          </div>
          <div>
            <dt className={labelClass}>DIAAS</dt>
            <dd>{formatOptionalProteinQualityScore(nutrition.diaas)}</dd>
          </div>
          {nutrition.limitingAminoAcids && (
            <div className="sm:col-span-2">
              <dt className={labelClass}>Limiting Amino Acids</dt>
              <dd>{nutrition.limitingAminoAcids}</dd>
            </div>
          )}
        </dl>
        {nutrition.diaas == null && nutrition.pdcaas != null && (
          <p className="mt-2 text-sm text-black">
            DIAAS not reported in cited literature for this entry.
          </p>
        )}
      </div>

      <div className="mt-6">
        <SubHeading>Amino Acid Profile</SubHeading>
        {aminoAcidEntries.length > 0 ? (
          <>
            {nutrition.aminoAcidBasis && (
              <p className="mt-1 text-sm text-black">
                Values expressed as {aminoAcidBasisLabel(nutrition.aminoAcidBasis)}.
              </p>
            )}
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left">
                  <th className={`py-2 ${labelClass}`}>Amino Acid</th>
                  <th className={`py-2 ${labelClass}`}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {aminoAcidEntries.map(([key, value]) => (
                  <tr key={key} className="border-b border-zinc-100">
                    <td className="py-2">
                      {formatAminoAcidLabel(key)}
                      {ESSENTIAL_AMINO_ACIDS.has(key) && (
                        <span className="ml-2 rounded bg-green-50 px-1.5 py-0.5 text-xs font-semibold text-green-900">
                          Essential
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      {nutrition.aminoAcidBasis === "percent_of_protein"
                        ? `${value}%`
                        : `${value} g`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="mt-2 text-sm text-zinc-600">
            Amino acid composition not yet curated for this species.
          </p>
        )}
      </div>

      {nutrition.confidenceNotes && (
        <p className="mt-4 text-sm text-black">{nutrition.confidenceNotes}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1">
        {nutrition.citationLinks.map((l) => (
          <CitationBadge key={l.id} citation={l.citation} />
        ))}
      </div>
    </CollapsibleSection>
  );
}
