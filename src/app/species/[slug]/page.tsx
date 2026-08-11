import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CitationBadge } from "@/components/citation-badge/CitationBadge";
import { InteractiveMorphologyViewerLazy } from "@/components/morphology-viewer/InteractiveMorphologyViewerLazy";
import { AltProteinUsageSection } from "@/components/species/AltProteinUsageSection";
import { BackToTopButton } from "@/components/species/BackToTopButton";
import { CitationLevelBadge } from "@/components/species/CitationLevelBadge";
import { NutritionSection } from "@/components/species/NutritionSection";
import { RegulatorySection } from "@/components/species/RegulatorySection";
import { ScientificName, TaxonomyBreadcrumb } from "@/components/species/ScientificName";
import { SpeciesNavArrows } from "@/components/species/SpeciesNavArrows";
import { SensoryChart } from "@/components/sensory/SensoryChart";
import { SpeciesImageFigure } from "@/components/species/SpeciesImageFigure";
import { buildTaxonomyLevels, TaxonomyDiagram } from "@/components/taxonomy/TaxonomyDiagram";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { SubHeading, labelClass } from "@/components/ui/headings";
import { getCurrentSpotlightMonth } from "@/lib/alt-protein";
import { formatEnumLabel } from "@/lib/format";
import { getSpeciesBySlug, getSpeciesNeighbors } from "@/lib/species";
import {
  parseCommonNames,
  parseJsonField,
  type MorphologyParameters,
  type TasteAxes,
  type TextureAxes,
} from "@/lib/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const species = await getSpeciesBySlug(slug);
  if (!species) return { title: "Species not found" };

  const commonNames = parseCommonNames(species.commonNames);
  return {
    title: species.scientificName,
    description: `Alternative protein and mycoprotein profile for ${species.scientificName}${commonNames.length ? ` (${commonNames.join(", ")})` : ""}. Sensory, nutrition, morphology, commercial use, and citations.`,
    openGraph: {
      title: species.scientificName,
      description: `Alt-protein database entry for ${species.scientificName}`,
    },
  };
}

export default async function SpeciesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const species = await getSpeciesBySlug(slug);
  if (!species) notFound();
  const neighbors = await getSpeciesNeighbors(slug);

  const commonNames = parseCommonNames(species.commonNames);
  const sensory = species.sensoryProfiles[0];
  const morphology = species.morphologies[0];
  const nutrition = species.nutritionProfiles[0];
  const geo = species.geographicDistributions[0];
  const commercial = species.commercialApplications[0];
  const model3d = species.morphologyModels3D[0];
  const morphologyParams = model3d
    ? parseJsonField<MorphologyParameters>(model3d.parameters, {
        visualizationStyle: "macroscopic",
        hyphaeBranchAngle: 45,
        hyphaeThickness: 0.02,
        hyphaeColor: "#e8dcc8",
        hyphaeDensity: 8,
        fruitingBodyType: "mushroom",
        capDiameter: 5,
        stipeLength: 5,
        capColor: "#c4b5a0",
        showMycelium: true,
        showFruitingBody: true,
      })
    : null;

  const morphologyReferenceImage =
    species.speciesImages.find((img) => img.imageCategory !== "commercial_product") ??
    species.speciesImages[0] ??
    null;

  const organismImages = species.speciesImages.filter(
    (img) => img.imageCategory === "microscopy" || img.imageCategory === "organism",
  );
  const productImages = species.speciesImages.filter(
    (img) => img.imageCategory === "commercial_product",
  );
  const biomassImages = species.speciesImages.filter((img) => img.imageCategory === "biomass");
  const otherImages = species.speciesImages.filter((img) => img.imageCategory === "other");

  const taxonomyLevels = species.taxonomy ? buildTaxonomyLevels(species.taxonomy) : [];

  const allCitations = [
    ...species.citationLinks.map((l) => l.citation),
    ...(sensory?.citationLinks.map((l) => l.citation) ?? []),
    ...(nutrition?.citationLinks.map((l) => l.citation) ?? []),
    ...(commercial?.citationLinks.map((l) => l.citation) ?? []),
  ];
  const uniqueCitations = [...new Map(allCitations.map((c) => [c.id, c])).values()];

  const groupedRefs = {
    journal: uniqueCitations.filter((c) => c.type === "journal" || c.type === "review"),
    patent: uniqueCitations.filter((c) => c.type === "patent"),
    book: uniqueCitations.filter((c) => c.type === "book"),
    other: uniqueCitations.filter(
      (c) => !["journal", "review", "patent", "book"].includes(c.type),
    ),
  };

  const refGroupLabels: Record<keyof typeof groupedRefs, string> = {
    journal: "Journal",
    patent: "Patent",
    book: "Book",
    other: "Other Sources",
  };

  const spotlightMonth = getCurrentSpotlightMonth();
  const altProteinResearch = species.altProteinResearchHighlights.filter(
    (item) => item.spotlightMonth === spotlightMonth,
  );

  const galleryImages = [...organismImages, ...otherImages];
  const primaryImage =
    organismImages.find((img) => img.imageCategory === "organism") ??
    organismImages[0] ??
    galleryImages[0] ??
    null;
  const additionalImages = primaryImage
    ? galleryImages.filter((img) => img.id !== primaryImage.id)
    : galleryImages;

  const imageCaption = (img: (typeof galleryImages)[number]) =>
    [img.caption, img.license, img.attributionText].filter(Boolean).join(" — ");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-foreground">
      <BackToTopButton />
      <SpeciesNavArrows previous={neighbors.previous} next={neighbors.next} />
      {species.taxonomy && (
        <TaxonomyBreadcrumb
          kingdom={species.taxonomy.kingdom}
          phylum={species.taxonomy.phylum}
          taxonomicClass={species.taxonomy.class}
          order={species.taxonomy.order}
          family={species.taxonomy.family}
          genus={species.genus}
          speciesEpithet={species.speciesEpithet}
        />
      )}

      <div className="grid gap-x-8 gap-y-2 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="lg:col-span-2">
          <h1 className="font-display text-3xl font-bold text-truffle">
            <ScientificName genus={species.genus} speciesEpithet={species.speciesEpithet} />
          </h1>
          {commonNames.length > 0 && (
            <p className="mt-1 font-sans text-sm text-muted">{commonNames.join(" · ")}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <CitationLevelBadge status={species.verificationStatus} />
            {commercial && (
              <span
                className={`rounded px-2 py-1 font-sans font-bold ${
                  commercial.meatAlternativeUse || commercial.commercialStatus !== "none"
                    ? "bg-berry/15 text-berry"
                    : "bg-surface-muted text-muted"
                }`}
              >
                {commercial.commercialStatus === "none" && !commercial.meatAlternativeUse
                  ? "No Commercial Product"
                  : "In Commercial Use"}
              </span>
            )}
            {species.ncbiTaxonomyId && (
              <a
                href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${species.ncbiTaxonomyId}`}
                className="rounded bg-surface-muted px-2 py-1 font-sans text-truffle hover:bg-gold/30"
                target="_blank"
                rel="noopener noreferrer"
              >
                NCBI: {species.ncbiTaxonomyId}
              </a>
            )}
          </div>
        </div>

        <div className="min-w-0">
          {galleryImages.length > 0 && (
            <CollapsibleSection title="Images" defaultOpen>
              <div className="space-y-3">
                {primaryImage && (
                  <SpeciesImageFigure
                    medium
                    url={primaryImage.url}
                    alt={primaryImage.caption ?? species.scientificName}
                    caption={imageCaption(primaryImage)}
                  />
                )}
                {additionalImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:max-w-md">
                    {additionalImages.map((img) => (
                      <SpeciesImageFigure
                        key={img.id}
                        compact
                        url={img.url}
                        alt={img.caption ?? species.scientificName}
                        caption={imageCaption(img)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}

          {(sensory || commercial) && (
            <AltProteinUsageSection
              scientificName={species.scientificName}
              meatAnalogPotential={sensory?.meatAnalogPotential ?? "unknown"}
              meatAnalogRationale={sensory?.meatAnalogRationale ?? null}
              meatAlternativeUse={commercial?.meatAlternativeUse ?? false}
              commercialStatus={commercial?.commercialStatus ?? "none"}
              applicationSummary={commercial?.applicationSummary ?? null}
              proteinPercent={nutrition?.proteinPercent ?? null}
              pdcaas={nutrition?.pdcaas ?? null}
              diaas={nutrition?.diaas ?? null}
              highlights={altProteinResearch}
              spotlightMonth={spotlightMonth}
              commercial={commercial ?? undefined}
              productImages={productImages}
              biomassImages={biomassImages}
            />
          )}

          {sensory && (
            <CollapsibleSection title="Sensory Profile" defaultOpen>
              <SensoryChart
                tasteAxes={parseJsonField<TasteAxes>(sensory.tasteAxes, {})}
                textureAxes={parseJsonField<TextureAxes>(sensory.textureAxes, {})}
              />
              <div className="mt-4 grid gap-2 text-sm">
                <p>
                  <span className={labelClass}>Meat Analog Potential:</span>{" "}
                  {formatEnumLabel(sensory.meatAnalogPotential)}
                </p>
                {sensory.meatAnalogRationale && <p>{sensory.meatAnalogRationale}</p>}
                {sensory.aromaNotes && (
                  <p>
                    <span className={labelClass}>Aroma:</span> {sensory.aromaNotes}
                  </p>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {sensory.citationLinks.map((l) => (
                  <CitationBadge key={l.id} citation={l.citation} />
                ))}
              </div>
            </CollapsibleSection>
          )}

          {morphology && (
            <CollapsibleSection title="Morphology" defaultOpen>
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <SubHeading as="dt">Hyphal Type</SubHeading>
                  <dd>{morphology.hyphalType}</dd>
                </div>
                {morphology.cellWallComposition && (
                  <div>
                    <SubHeading as="dt">Cell Wall</SubHeading>
                    <dd>{morphology.cellWallComposition}</dd>
                  </div>
                )}
                {morphology.fruitingBodyStructure && (
                  <div className="sm:col-span-2">
                    <SubHeading as="dt">Fruiting Body</SubHeading>
                    <dd>{morphology.fruitingBodyStructure}</dd>
                  </div>
                )}
              </dl>
              {morphologyParams && (
                <div className="mt-6">
                  <SubHeading>Interactive 3D Anatomy</SubHeading>
                  <InteractiveMorphologyViewerLazy
                    slug={slug}
                    scientificName={species.scientificName}
                    commonNames={commonNames}
                    parameters={morphologyParams}
                  />
                </div>
              )}
            </CollapsibleSection>
          )}

          {nutrition && <NutritionSection nutrition={nutrition} />}

          {geo && (
            <CollapsibleSection title="Geographic Distribution" defaultOpen={false}>
              <dl className="space-y-4 text-sm">
                <div>
                  <SubHeading as="dt">Native Range</SubHeading>
                  <dd>{geo.nativeRange}</dd>
                </div>
                {geo.cultivatedRegions && (
                  <div>
                    <SubHeading as="dt">Cultivated Regions</SubHeading>
                    <dd>{geo.cultivatedRegions}</dd>
                  </div>
                )}
                {geo.habitat && (
                  <div>
                    <SubHeading as="dt">Habitat</SubHeading>
                    <dd>{geo.habitat}</dd>
                  </div>
                )}
              </dl>
              {geo.gbifUrl && (
                <a
                  href={geo.gbifUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-berry hover:underline"
                >
                  View on GBIF →
                </a>
              )}
            </CollapsibleSection>
          )}

          {species.cultureCollectionStrains.length > 0 && (
            <CollapsibleSection title="Culture Collection Strains" defaultOpen={false}>
              <ul className="space-y-3">
                {species.cultureCollectionStrains.map((strain) => (
                  <li key={strain.id} className="text-sm">
                    <a
                      href={strain.catalogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-berry hover:underline"
                    >
                      {strain.collectionName} {strain.strainId}
                    </a>
                    {strain.availabilityNotes && (
                      <p className="text-black">{strain.availabilityNotes}</p>
                    )}
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          <RegulatorySection
            fdaStatus={species.fdaStatus}
            efsaStatus={species.efsaStatus}
            regulatoryNotes={species.regulatoryNotes}
          />

          <CollapsibleSection title="References" defaultOpen={false}>
            {(["journal", "patent", "book", "other"] as const).map((group) => {
              const refs = groupedRefs[group];
              if (refs.length === 0) return null;
              return (
                <div key={group} className="mb-6">
                  <SubHeading>{refGroupLabels[group]}</SubHeading>
                  <ul className="space-y-2 text-sm">
                    {refs.map((c) => (
                      <li key={c.id}>
                        {c.authors && <span>{c.authors}. </span>}
                        <em>{c.title}</em>
                        {c.journal && <span>. {c.journal}</span>}
                        {c.year && <span> ({c.year})</span>}.{" "}
                        <CitationBadge citation={c} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </CollapsibleSection>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {taxonomyLevels.length > 0 && (
            <CollapsibleSection title="Classification" defaultOpen>
              <TaxonomyDiagram
                levels={taxonomyLevels}
                speciesEpithet={species.speciesEpithet}
                hideTitle
                embedded
              />
            </CollapsibleSection>
          )}
        </aside>
      </div>
    </div>
  );
}
