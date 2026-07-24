import { formatEnumLabel, formatOptionalProteinQualityScore } from "@/lib/format";
import { formatSpotlightMonth, getResearchDoiUrl } from "@/lib/alt-protein";
import { CommercialUseContent } from "@/components/species/CommercialUseContent";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { CollapsibleSubSection } from "@/components/ui/CollapsibleSubSection";
import { SubHeading, labelClass } from "@/components/ui/headings";
import { CitationBadge } from "@/components/citation-badge/CitationBadge";

type ResearchHighlight = {
  id: string;
  title: string;
  authors: string | null;
  journal: string | null;
  year: number | null;
  doi: string | null;
  url: string | null;
  summary: string;
};

type CommercialData = {
  meatAlternativeUse: boolean;
  applicationSummary: string;
  commercialStatus: string;
  companies: string;
  productionProcess: string;
  confidenceNotes: string | null;
  citationLinks: { id: string; citation: Parameters<typeof CitationBadge>[0]["citation"] }[];
};

function describeConsumptionForm(
  commercialStatus: string,
  meatAlternativeUse: boolean,
): string | null {
  const asWholeFood =
    commercialStatus === "commercial_food" || commercialStatus === "traditional_food";

  if (asWholeFood && meatAlternativeUse) {
    return "Consumed as whole mushroom (fresh, cooked, dried, or canned) and also used in some meat-analog or hybrid formulations.";
  }
  if (asWholeFood) {
    return "Consumed as whole mushroom — typically fresh, cooked, dried, or canned.";
  }
  if (commercialStatus === "commercial_meat_analog") {
    return "Used as processed mycoprotein in meat-analog products; not typically sold as an intact fruiting body.";
  }
  return null;
}

type AltProteinUsageSectionProps = {
  scientificName: string;
  meatAnalogPotential: string;
  meatAnalogRationale: string | null;
  meatAlternativeUse: boolean;
  commercialStatus: string;
  applicationSummary: string | null;
  proteinPercent: number | null;
  pdcaas: number | null;
  diaas: number | null;
  highlights: ResearchHighlight[];
  spotlightMonth: string;
  commercial?: CommercialData;
  productImages?: {
    id: string;
    url: string;
    caption: string | null;
    license: string | null;
    attributionText: string | null;
  }[];
  biomassImages?: {
    id: string;
    url: string;
    caption: string | null;
    license: string | null;
    attributionText: string | null;
  }[];
};

export function AltProteinUsageSection({
  scientificName,
  meatAnalogPotential,
  meatAnalogRationale,
  meatAlternativeUse,
  commercialStatus,
  applicationSummary,
  proteinPercent,
  pdcaas,
  diaas,
  highlights,
  spotlightMonth,
  commercial,
  productImages = [],
  biomassImages = [],
}: AltProteinUsageSectionProps) {
  const monthLabel = formatSpotlightMonth(spotlightMonth);
  const consumptionNote = describeConsumptionForm(commercialStatus, meatAlternativeUse);

  return (
    <CollapsibleSection title="Alternative Protein Usage" defaultOpen id="alt-protein-usage">
      <p className="mb-4 text-sm text-black">
        How <em>{scientificName}</em> is positioned for meat analogs, hybrid formulations, and
        alt-protein product development.
      </p>

      <SubHeading>Usage potential</SubHeading>
      <dl className="mt-2 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className={labelClass}>Meat analog potential</dt>
          <dd>{formatEnumLabel(meatAnalogPotential)}</dd>
          {meatAnalogRationale && <dd className="mt-1 text-black">{meatAnalogRationale}</dd>}
        </div>
        <div>
          <dt className={labelClass}>Commercial alt-protein role</dt>
          <dd>{meatAlternativeUse ? "Used in meat-analog products" : "Not a primary meat analog"}</dd>
          <dd className="mt-1 text-black">{formatEnumLabel(commercialStatus)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className={labelClass}>Protein relevance</dt>
          <dd>
            Protein: {proteinPercent != null ? `${proteinPercent}%` : "—"}
            {" · "}
            PDCAAS: {formatOptionalProteinQualityScore(pdcaas)}
            {" · "}
            DIAAS: {formatOptionalProteinQualityScore(diaas)}
          </dd>
          {applicationSummary && <dd className="mt-1 text-black">{applicationSummary}</dd>}
          {consumptionNote && (
            <dd className="mt-1 text-black">
              <span className="font-bold">Consumption form: </span>
              {consumptionNote}
            </dd>
          )}
        </div>
      </dl>

      {commercial && (
        <CommercialUseContent
          commercial={commercial}
          productImages={productImages}
          biomassImages={biomassImages}
          scientificName={scientificName}
        />
      )}

      <CollapsibleSubSection title="Relevant literature" defaultOpen={false}>
        <p className="text-xs text-zinc-600">
          Curated alt-protein literature — refreshed monthly ({monthLabel}).
        </p>
        {highlights.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">
            No alt-protein-focused studies listed for this species this month.
          </p>
        ) : (
          <ul className="mt-3 space-y-4">
            {highlights.map((item) => {
              const link = item.url ?? getResearchDoiUrl(item.doi);
              return (
                <li key={item.id} className="text-sm">
                  <p className="font-bold text-black">
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline"
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </p>
                  <p className="text-xs text-zinc-600">
                    {item.authors}
                    {item.journal && ` · ${item.journal}`}
                    {item.year && ` (${item.year})`}
                  </p>
                  <p className="mt-1 text-black">{item.summary}</p>
                </li>
              );
            })}
          </ul>
        )}
      </CollapsibleSubSection>
    </CollapsibleSection>
  );
}
