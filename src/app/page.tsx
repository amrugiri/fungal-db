import { DatabaseUniqueness } from "@/components/home/DatabaseUniqueness";
import { SpeciesGrid } from "@/components/species-grid/SpeciesGrid";
import {
  getProteinPercent,
  getSpeciesList,
  getTasteTags,
  getTextureTags,
} from "@/lib/species";

type HomeProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;
  const species = await getSpeciesList(q);

  const gridData = species.map((s) => {
    const commercial = s.commercialApplications[0];
    const inCommercialProduct =
      commercial != null &&
      commercial.commercialStatus !== "none" &&
      commercial.commercialStatus !== "research_only";
    return {
      id: s.id,
      slug: s.slug,
      scientificName: s.scientificName,
      genus: s.genus,
      commonNames: s.commonNames,
      verificationStatus: s.verificationStatus,
      meatAnalogPotential: s.sensoryProfiles[0]?.meatAnalogPotential ?? "unknown",
      meatAlternativeUse: commercial?.meatAlternativeUse ?? false,
      commercialStatus: commercial?.commercialStatus ?? "none",
      inCommercialProduct,
      tasteTags: getTasteTags(s.sensoryProfiles[0]),
      textureTags: getTextureTags(s.sensoryProfiles[0]),
      proteinPercent: getProteinPercent(s.nutritionProfiles[0]),
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-black">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Alternative Protein Fungi Database</h1>
      </div>
      <DatabaseUniqueness />
      <SpeciesGrid data={gridData} initialSearch={q ?? ""} />
    </div>
  );
}
