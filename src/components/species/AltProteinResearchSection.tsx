import { SectionHeading, SubHeading } from "@/components/ui/headings";
import { formatSpotlightMonth, getResearchDoiUrl } from "@/lib/alt-protein";

type ResearchHighlight = {
  id: string;
  title: string;
  authors: string | null;
  journal: string | null;
  year: number | null;
  doi: string | null;
  url: string | null;
  summary: string;
  spotlightMonth: string;
};

type AltProteinResearchSectionProps = {
  highlights: ResearchHighlight[];
  scientificName: string;
  spotlightMonth: string;
};

export function AltProteinResearchSection({
  highlights,
  scientificName,
  spotlightMonth,
}: AltProteinResearchSectionProps) {
  const monthLabel = formatSpotlightMonth(spotlightMonth);

  return (
    <section
      id="alt-protein-research"
      className="mb-8 rounded-lg border border-zinc-200 bg-white p-6"
    >
      <SectionHeading>Alt-Protein Research Spotlight</SectionHeading>
      <p className="mb-4 text-sm text-black">
        Curated studies with direct relevance to alternative protein R&D involving{" "}
        <em>{scientificName}</em>. This list is refreshed monthly — currently showing{" "}
        <strong>{monthLabel}</strong>.
      </p>
      {highlights.length === 0 ? (
        <p className="text-sm text-zinc-600">
          No alt-protein-focused studies are listed for this species this month. Check back after the
          next monthly refresh.
        </p>
      ) : (
        <ul className="space-y-4">
          {highlights.map((item) => {
            const link = item.url ?? getResearchDoiUrl(item.doi);
            return (
              <li key={item.id} className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-sm">
                <SubHeading as="h3" className="!text-base">
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
                </SubHeading>
                <p className="mt-1 text-xs text-zinc-600">
                  {item.authors}
                  {item.journal && ` · ${item.journal}`}
                  {item.year && ` (${item.year})`}
                </p>
                <p className="mt-2 text-black">{item.summary}</p>
                {item.doi && (
                  <a
                    href={getResearchDoiUrl(item.doi) ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-blue-700 hover:underline"
                  >
                    DOI: {item.doi}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
