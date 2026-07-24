export type OpenAlexWork = {
  id: string;
  doi: string | null;
  title: string;
  publication_year: number | null;
  authorships: { author: { display_name: string } }[];
  primary_location?: {
    source?: { display_name: string };
  };
};

export async function lookupDoi(doi: string): Promise<OpenAlexWork | null> {
  const normalized = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").trim();
  const response = await fetch(
    `https://api.openalex.org/works/doi:${encodeURIComponent(normalized)}`,
    { next: { revalidate: 86400 } },
  );
  if (!response.ok) return null;
  return (await response.json()) as OpenAlexWork;
}

export function formatOpenAlexCitation(work: OpenAlexWork) {
  const authors = work.authorships
    .slice(0, 3)
    .map((a) => a.author.display_name)
    .join(", ");
  const journal = work.primary_location?.source?.display_name ?? "";
  return {
    title: work.title,
    authors: authors || undefined,
    year: work.publication_year ?? undefined,
    journal: journal || undefined,
    doi: work.doi?.replace("https://doi.org/", "") ?? undefined,
  };
}
