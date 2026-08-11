import Link from "next/link";

type SpeciesNeighbor = {
  slug: string;
  scientificName: string;
};

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SpeciesNavArrows({
  previous,
  next,
}: {
  previous: SpeciesNeighbor | null;
  next: SpeciesNeighbor | null;
}) {
  return (
    <nav
      aria-label="Species navigation"
      className="sticky top-0 z-30 -mx-4 mb-6 border-b border-border bg-cream/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-3"
    >
      <div className="flex items-center justify-between gap-3">
        {previous ? (
          <Link
            href={`/species/${previous.slug}`}
            className="group flex min-w-0 max-w-[48%] items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 font-sans text-sm text-truffle transition hover:border-gold"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-truffle group-hover:border-gold">
              <ArrowLeft />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-muted">Previous</span>
              <em className="block truncate font-semibold not-italic group-hover:text-berry sm:italic">
                {previous.scientificName}
              </em>
            </span>
          </Link>
        ) : (
          <span className="min-w-0 max-w-[48%]" />
        )}
        {next ? (
          <Link
            href={`/species/${next.slug}`}
            className="group flex min-w-0 max-w-[48%] items-center justify-end gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-right font-sans text-sm text-truffle transition hover:border-gold"
          >
            <span className="min-w-0">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-muted">Next</span>
              <em className="block truncate font-semibold not-italic group-hover:text-berry sm:italic">
                {next.scientificName}
              </em>
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-truffle group-hover:border-gold">
              <ArrowRight />
            </span>
          </Link>
        ) : (
          <span className="min-w-0 max-w-[48%]" />
        )}
      </div>
    </nav>
  );
}
