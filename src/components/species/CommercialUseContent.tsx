import { CitationBadge } from "@/components/citation-badge/CitationBadge";
import { SpeciesImageFigure } from "@/components/species/SpeciesImageFigure";
import { CollapsibleSubSection } from "@/components/ui/CollapsibleSubSection";
import { SubHeading } from "@/components/ui/headings";
import { formatEnumLabel } from "@/lib/format";
import { parseJsonField, type CommercialCompany, type ProductionProcessStep } from "@/lib/types";

type CommercialApplicationData = {
  meatAlternativeUse: boolean;
  applicationSummary: string;
  commercialStatus: string;
  companies: string;
  productionProcess: string;
  confidenceNotes: string | null;
  citationLinks: { id: string; citation: Parameters<typeof CitationBadge>[0]["citation"] }[];
};

const statusLabels: Record<string, string> = {
  commercial_meat_analog: "Commercial Meat Analog on Market",
  commercial_food: "Commercial Food Product",
  research_only: "Research / Development Only",
  traditional_food: "Traditional Food Use",
  none: "No Commercial Meat Analog Documented",
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
    return "Consumed as whole mushroom — typically fresh, cooked, dried, or canned rather than as a formulated meat analog.";
  }
  if (commercialStatus === "commercial_meat_analog") {
    return "Used as processed mycoprotein in meat-analog products; not typically sold as an intact fruiting body.";
  }
  return null;
}

type CommercialUseContentProps = {
  commercial: CommercialApplicationData;
  productImages: {
    id: string;
    url: string;
    caption: string | null;
    license: string | null;
    attributionText: string | null;
  }[];
  biomassImages: {
    id: string;
    url: string;
    caption: string | null;
    license: string | null;
    attributionText: string | null;
  }[];
  scientificName: string;
};

export function CommercialUseContent({
  commercial,
  productImages,
  biomassImages,
  scientificName,
}: CommercialUseContentProps) {
  const companies = parseJsonField<CommercialCompany[]>(commercial.companies, []);
  const productionSteps = parseJsonField<ProductionProcessStep[]>(
    commercial.productionProcess,
    [],
  );
  const consumptionNote = describeConsumptionForm(
    commercial.commercialStatus,
    commercial.meatAlternativeUse,
  );

  return (
    <>
      <CollapsibleSubSection title="Meat alternative applications" defaultOpen>
        <div className="flex flex-wrap gap-2 text-sm">
          <span
            className={`rounded px-2 py-1 font-bold ${
              commercial.meatAlternativeUse
                ? "bg-green-100 text-green-900"
                : "bg-zinc-100 text-black"
            }`}
          >
            {commercial.meatAlternativeUse
              ? "Used in Meat Alternatives"
              : "Not a Primary Meat Analog"}
          </span>
          {commercial.commercialStatus === "commercial_meat_analog" && (
            <span className="rounded bg-blue-50 px-2 py-1 font-bold text-blue-900">
              {statusLabels.commercial_meat_analog}
            </span>
          )}
        </div>
        {commercial.meatAlternativeUse && (
          <p className="mt-3 text-sm text-black">{commercial.applicationSummary}</p>
        )}
        {!commercial.meatAlternativeUse && commercial.commercialStatus === "commercial_meat_analog" && (
          <p className="mt-3 text-sm text-black">{commercial.applicationSummary}</p>
        )}
      </CollapsibleSubSection>

      <CollapsibleSubSection title="Commercial use" defaultOpen>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded bg-blue-50 px-2 py-1 font-bold text-blue-900">
            {statusLabels[commercial.commercialStatus] ??
              formatEnumLabel(commercial.commercialStatus)}
          </span>
        </div>

        <p className="mt-3 text-sm text-black">{commercial.applicationSummary}</p>

        {consumptionNote && (
          <p className="mt-2 text-sm text-black">
            <span className="font-bold">Consumption form: </span>
            {consumptionNote}
          </p>
        )}

        {commercial.confidenceNotes && (
          <p className="mt-2 text-sm text-black">{commercial.confidenceNotes}</p>
        )}

        <div className="mt-5">
          <SubHeading>Production process</SubHeading>
          {productionSteps.length > 0 ? (
            <ol className="mt-3 space-y-4 text-sm">
              {productionSteps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-zinc-800 bg-white text-sm font-bold !text-zinc-800">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-black">{step.title}</p>
                    <p className="mt-1 text-black">{step.description}</p>
                    {step.learnMoreUrl && (
                      <a
                        href={step.learnMoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-blue-700 hover:underline"
                      >
                        {step.learnMoreLabel ?? "Learn more (external)"} →
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-zinc-600">Production process not yet documented.</p>
          )}
        </div>

        {companies.length > 0 && (
          <div className="mt-6">
            <SubHeading>Companies &amp; products</SubHeading>
            <ul className="mt-2 space-y-4 text-sm">
              {companies.map((company) => (
                <li key={company.name} className="rounded border border-zinc-100 bg-zinc-50 p-3">
                  <p className="font-bold text-black">
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline"
                      >
                        {company.name}
                      </a>
                    ) : (
                      company.name
                    )}
                    {company.region ? ` (${company.region})` : ""}
                  </p>
                  {company.products && company.products.length > 0 && (
                    <p className="mt-1 text-black">
                      <span className="font-bold">Products: </span>
                      {company.products.join("; ")}
                    </p>
                  )}
                  {company.notes && <p className="mt-1 text-black">{company.notes}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(productImages.length > 0 || biomassImages.length > 0) && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {productImages.length > 0 && (
              <div>
                <SubHeading>Commercial products</SubHeading>
                <div className="mt-2 space-y-3">
                  {productImages.map((img) => (
                    <SpeciesImageFigure
                      key={img.id}
                      url={img.url}
                      alt={img.caption ?? `${scientificName} product`}
                      caption={`${img.caption ?? ""}${img.license ? ` — ${img.license}` : ""}${img.attributionText ? ` — ${img.attributionText}` : ""}`}
                    />
                  ))}
                </div>
              </div>
            )}
            {biomassImages.length > 0 && (
              <div>
                <SubHeading>Raw biomass / processed forms</SubHeading>
                <div className="mt-2 space-y-3">
                  {biomassImages.map((img) => (
                    <SpeciesImageFigure
                      key={img.id}
                      url={img.url}
                      alt={img.caption ?? `${scientificName} biomass`}
                      caption={`${img.caption ?? ""}${img.license ? ` — ${img.license}` : ""}${img.attributionText ? ` — ${img.attributionText}` : ""}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {commercial.citationLinks.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {commercial.citationLinks.map((l) => (
              <CitationBadge key={l.id} citation={l.citation} />
            ))}
          </div>
        )}
      </CollapsibleSubSection>
    </>
  );
}
