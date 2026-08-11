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
        <div className="mb-6 rounded-2xl border border-border/60 bg-cream px-5 py-5 sm:px-6">
          <h1 className="font-display text-3xl font-bold leading-tight text-truffle md:text-4xl">
            Alternative Protein Fungi Database
          </h1>
          <div className="mt-3 flex h-1.5 w-40 overflow-hidden rounded-full">
            <span className="flex-1 bg-gold" />
            <span className="flex-1 bg-berry" />
            <span className="flex-1 bg-sage" />
            <span className="flex-1 bg-truffle" />
          </div>
        </div>
        <DatabaseUniqueness />
        <SpeciesGrid data={gridData} initialSearch={q ?? ""} />
      </div>
    </div>
  );
}
