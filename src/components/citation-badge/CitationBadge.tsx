import type { Citation } from "@/generated/prisma/client";

type CitationBadgeProps = {
  citation: Citation;
};

export function CitationBadge({ citation }: CitationBadgeProps) {
  const href = citation.doi
    ? `https://doi.org/${citation.doi}`
    : citation.pmid
      ? `https://pubmed.ncbi.nlm.nih.gov/${citation.pmid}/`
      : citation.url ?? undefined;

  const label = citation.doi
    ? `DOI: ${citation.doi}`
    : citation.patentNumber
      ? `Patent ${citation.patentNumber}`
      : citation.title.slice(0, 40);

  if (!href) {
    return (
      <span className="inline-flex items-center rounded bg-zinc-100 px-2 py-0.5 text-xs text-black">
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700 hover:bg-blue-100"
      title={citation.title}
    >
      {label}
    </a>
  );
}

export function CitationList({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {citations.map((c) => (
        <CitationBadge key={c.id} citation={c} />
      ))}
    </div>
  );
}
