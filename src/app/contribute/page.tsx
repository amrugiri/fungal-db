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
          This form is for researchers, product developers, and other subject-matter experts who
          have a <strong>citable source</strong> for a species already in MycoProt. Use it to send
          sensory measurements or alt-protein usage details.
        </p>
        <p>
          Nothing you submit is published automatically. The admin reviews every field against the
          attached paper, table, or figure. We will email you if a number, unit, or sample needs
          clarification. Curator guesses and unsourced 0–5 scores are not accepted.
        </p>
        <p>
          Values stay empty on species pages until they are copied from a paper. Wet-weight and
          dry-weight figures are not mixed.
        </p>
      </div>
      <div className="mt-10">
        <ContributeForm species={species} />
      </div>
    </div>
  );
}
