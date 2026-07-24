import Link from "next/link";
import { formatEnumLabel, formatRegulatoryStatus } from "@/lib/format";
import { SectionHeading, SubHeading, labelClass } from "@/components/ui/headings";

type AltProteinSpotlightProps = {
  scientificName: string;
  meatAnalogPotential: string;
  meatAnalogRationale: string | null;
  meatAlternativeUse: boolean;
  commercialStatus: string;
  applicationSummary: string | null;
  proteinPercent: number | null;
  pdcaas: number | null;
  diaas: number | null;
  fdaStatus: string | null;
  efsaStatus: string | null;
};

export function AltProteinSpotlight({
  scientificName,
  meatAnalogPotential,
  meatAnalogRationale,
  meatAlternativeUse,
  commercialStatus,
  applicationSummary,
  proteinPercent,
  pdcaas,
  diaas,
  fdaStatus,
  efsaStatus,
}: AltProteinSpotlightProps) {
  const isHighRelevance =
    meatAlternativeUse ||
    meatAnalogPotential === "high" ||
    meatAnalogPotential === "moderate" ||
    commercialStatus === "commercial_meat_analog";

  return (
    <section className="mb-8 rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6">
      <SectionHeading>Alternative Protein Spotlight</SectionHeading>
      <p className="mb-4 text-sm text-black">
        Alt-protein relevance for <em>{scientificName}</em> — meat analog potential, commercial use,
        protein quality, and regulatory context in one view.
      </p>
      <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-blue-100 bg-white p-3">
          <SubHeading as="dt">Meat Analog Potential</SubHeading>
          <dd className={`text-lg font-bold ${isHighRelevance ? "text-blue-900" : "text-black"}`}>
            {formatEnumLabel(meatAnalogPotential)}
          </dd>
          {meatAnalogRationale && <dd className="mt-1 text-black">{meatAnalogRationale}</dd>}
        </div>
        <div className="rounded-lg border border-blue-100 bg-white p-3">
          <SubHeading as="dt">Commercial Alt-Protein Use</SubHeading>
          <dd className="font-bold text-black">
            {meatAlternativeUse ? "Yes — meat analog ingredient" : "Not a primary meat analog"}
          </dd>
          <dd className="mt-1 text-black">{formatEnumLabel(commercialStatus)}</dd>
        </div>
        <div className="rounded-lg border border-blue-100 bg-white p-3">
          <SubHeading as="dt">Protein Profile</SubHeading>
          <dd>
            <span className={labelClass}>Protein:</span>{" "}
            {proteinPercent != null ? `${proteinPercent}%` : "—"}
            {pdcaas != null && (
              <>
                {" "}
                · <span className={labelClass}>PDCAAS:</span> {pdcaas.toFixed(2)}
              </>
            )}
            {diaas != null && (
              <>
                {" "}
                · <span className={labelClass}>DIAAS:</span> {diaas.toFixed(2)}
              </>
            )}
          </dd>
        </div>
        <div className="rounded-lg border border-blue-100 bg-white p-3 sm:col-span-2 lg:col-span-3">
          <SubHeading as="dt">Regulatory (Food / Alt Protein)</SubHeading>
          <dd>
            FDA: {formatRegulatoryStatus(fdaStatus)} · EFSA: {formatRegulatoryStatus(efsaStatus)}
          </dd>
          {applicationSummary && <dd className="mt-2 text-black">{applicationSummary}</dd>}
        </div>
      </dl>
      <p className="mt-4 text-xs text-zinc-600">
        Jump to{" "}
        <Link href="#alt-protein-research" className="text-blue-700 hover:underline">
          monthly alt-protein research
        </Link>
        ,{" "}
        <Link href="#commercial-use" className="text-blue-700 hover:underline">
          commercial use
        </Link>
        , or{" "}
        <Link href="#nutrition" className="text-blue-700 hover:underline">
          nutrition
        </Link>
        .
      </p>
    </section>
  );
}
