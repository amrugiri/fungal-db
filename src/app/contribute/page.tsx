import type { Metadata } from "next";
import { ContributeForm } from "@/components/contribute/ContributeForm";
import { getSpeciesCatalog } from "@/lib/species";

export const metadata: Metadata = {
  title: "Contribute data",
  description:
    "Suggest citation-backed sensory or alt-protein data for a MycoProt species. Submissions are reviewed before anything is published.",
};

export default async function ContributePage() {
  const species = await getSpeciesCatalog();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-truffle">Contribute data</h1>
      <div className="mt-6 space-y-4 font-sans text-sm leading-relaxed text-truffle">
        <p>
          This form is intended for researchers, product developers, and other subject-matter
          experts who hold a <strong>citable source</strong> for a species already listed in
          MycoProt. The sections correspond to those on each species page: images, alternative-protein
          usage, sensory profile, morphology, nutrition, geographic distribution, culture-collection
          strains, and regulatory status. Please complete only those fields for which a source is
          available; leave remaining fields blank.
        </p>
        <p>
          All submitted information is reviewed by the administrator before it goes live on the
          database. Please submit accurate data and include citations or supporting images.
        </p>
      </div>
      <div className="mt-10">
        <ContributeForm species={species} />
      </div>
    </div>
  );
}
