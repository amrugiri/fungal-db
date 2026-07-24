import Link from "next/link";
import { formatEnumLabel, formatRegulatoryStatus } from "@/lib/format";
import { getSpeciesByIds } from "@/lib/species";
import {
  parseCommonNames,
  parseJsonField,
  type MorphologyParameters,
  type TasteAxes,
  type TextureAxes,
} from "@/lib/types";
import { CompareTable } from "./CompareTable";

type CompareProps = {
  searchParams: Promise<{ ids?: string }>;
};

const defaultMorphology: MorphologyParameters = {
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
};

export default async function ComparePage({ searchParams }: CompareProps) {
  const { ids } = await searchParams;
  const slugs = ids?.split(",").filter(Boolean) ?? [];

  if (slugs.length < 2 || slugs.length > 4) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-black">Compare Species</h1>
        <p className="mt-4 text-black">
          Select 2–4 species from the grid using checkboxes, then click Compare.
        </p>
        <Link href="/" className="mt-6 inline-block text-blue-700 hover:underline">
          ← Back to species grid
        </Link>
      </div>
    );
  }

  const species = await getSpeciesByIds(slugs);

  const rows = species.map((s) => {
    const sensory = s.sensoryProfiles[0];
    const nutrition = s.nutritionProfiles[0];
    const morphology = s.morphologies[0];
    const geo = s.geographicDistributions[0];
    const commercial = s.commercialApplications[0];
    const model3d = s.morphologyModels3D[0];
    const referenceImage =
      s.speciesImages.find((img) => img.imageCategory !== "commercial_product") ??
      s.speciesImages[0] ??
      null;
    const commercialProduct =
      commercial != null &&
      commercial.commercialStatus !== "none" &&
      commercial.commercialStatus !== "research_only";

    return {
      slug: s.slug,
      scientificName: s.scientificName,
      genus: s.genus,
      speciesEpithet: s.speciesEpithet,
      commonNames: parseCommonNames(s.commonNames).join(", "),
      meatAnalog: formatEnumLabel(sensory?.meatAnalogPotential ?? "unknown"),
      commercialProduct,
      commercialStatus: commercial?.commercialStatus ?? "none",
      fdaStatus: s.fdaStatus,
      efsaStatus: s.efsaStatus,
      aromaNotes: sensory?.aromaNotes ?? "",
      tasteAxes: sensory ? parseJsonField<TasteAxes>(sensory.tasteAxes, {}) : {},
      textureAxes: sensory ? parseJsonField<TextureAxes>(sensory.textureAxes, {}) : {},
      protein: nutrition?.proteinPercent ?? null,
      fiber: nutrition?.fiberPercent ?? null,
      hyphalType: morphology?.hyphalType ?? "—",
      nativeRange: geo?.nativeRange ?? "—",
      strains: s.cultureCollectionStrains.map((st) => `${st.collectionName} ${st.strainId}`).join("; "),
      morphologyParams: model3d
        ? parseJsonField<MorphologyParameters>(model3d.parameters, defaultMorphology)
        : defaultMorphology,
      referenceImageUrl: referenceImage?.url ?? null,
      referenceImageCaption: referenceImage
        ? [referenceImage.caption, referenceImage.license, referenceImage.attributionText]
            .filter(Boolean)
            .join(" — ")
        : null,
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Species Comparison</h1>
          <p className="text-sm text-black">
            Side-by-side alt-protein view of {rows.length} species — commercial use, sensory profile,
            nutrition, and morphology.
          </p>
        </div>
        <Link href="/" className="text-sm text-blue-700 hover:underline">
          ← Back to grid
        </Link>
      </div>
      <CompareTable rows={rows} />
    </div>
  );
}
