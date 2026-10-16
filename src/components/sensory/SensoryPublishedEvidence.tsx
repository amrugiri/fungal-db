import { CitationBadge } from "@/components/citation-badge/CitationBadge";
import { SubHeading } from "@/components/ui/headings";
import type { Citation } from "@/generated/prisma/client";
import type { SensoryPublishedMeasurement } from "@/lib/types";

const KIND_LABEL: Record<SensoryPublishedMeasurement["kind"], string> = {
  taste_compound: "Taste-active compound",
  volatile: "Volatile (GC-MS)",
  texture_instrumental: "Instrumental texture",
  panel_score: "Trained panel",
};

type SensoryPublishedEvidenceProps = {
  measurements: SensoryPublishedMeasurement[];
  citations: Citation[];
};

export function SensoryPublishedEvidence({
  measurements,
  citations,
}: SensoryPublishedEvidenceProps) {
  if (measurements.length === 0) return null;

  return (
    <div className="mt-6">
      <SubHeading as="h4">Published measurements</SubHeading>
      <p className="mb-3 text-sm text-black">
        Identifications and methods taken from the cited papers. Concentrations
        are shown only when they were copied from the paper.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-sans font-bold">What was measured</th>
              <th className="py-2 pr-3 font-sans font-bold">Method</th>
              <th className="py-2 pr-3 font-sans font-bold">Sample</th>
              <th className="py-2 font-sans font-bold">Source</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((row, i) => {
              const citation = citations.find(
                (c) => row.doi && c.doi && c.doi.toLowerCase() === row.doi.toLowerCase(),
              );
              const amount =
                row.value != null
                  ? `${row.value}${row.unit ? ` ${row.unit}` : ""}`
                  : null;
              return (
                <tr key={`${row.name}-${i}`} className="border-b border-border/70 align-top">
                  <td className="py-2 pr-3">
                    <p className="font-medium">{row.name}</p>
                    <p className="text-xs text-muted">{KIND_LABEL[row.kind]}</p>
                    {amount && <p className="mt-1">{amount}</p>}
                    {row.notes && <p className="mt-1 text-black">{row.notes}</p>}
                  </td>
                  <td className="py-2 pr-3">{row.method}</td>
                  <td className="py-2 pr-3">{row.sample ?? "—"}</td>
                  <td className="py-2">
                    {citation ? <CitationBadge citation={citation} /> : row.citationKey}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
