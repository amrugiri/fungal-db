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
    <div className="relative isolate min-h-full overflow-x-clip bg-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-44 opacity-[0.14] bg-[url('/banners/mushroom-left.jpg')] bg-repeat-y bg-left-top bg-[length:220%_auto] [mask-image:linear-gradient(to_right,black_0%,black_25%,transparent_85%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,black_25%,transparent_85%)] sm:block md:w-56 lg:w-64 xl:w-72"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-44 opacity-[0.14] bg-[url('/banners/mushroom-right-soft.png?v=7')] bg-repeat-y bg-right-top bg-[length:220%_auto] [mask-image:linear-gradient(to_left,black_0%,black_25%,transparent_85%)] [-webkit-mask-image:linear-gradient(to_left,black_0%,black_25%,transparent_85%)] sm:block md:w-56 lg:w-64 xl:w-72"
      />

      <div className="relative z-10 mx-auto max-w-[96rem] px-4 py-8 text-foreground sm:px-10 md:px-14 lg:px-16 xl:px-20">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold leading-tight text-truffle md:text-4xl">
            MycoProt
          </h1>
          <p className="mt-2 max-w-3xl font-sans text-sm leading-relaxed text-muted md:text-base">
            Citation-backed reference for fungal ingredients in alternative
            protein: strain selection, sensory data, protein quality,
            morphology, and commercial use.
          </p>
        </div>
        <DatabaseUniqueness />
        <SpeciesGrid data={gridData} initialSearch={q ?? ""} />
      </div>
    </div>
  );
}
