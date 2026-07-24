import { citationLevelDescription, formatEnumLabel } from "@/lib/format";

type CitationLevelBadgeProps = {
  status: string;
};

/** How well this database entry is supported by citations — not a food-safety rating. */
export function CitationLevelBadge({ status }: CitationLevelBadgeProps) {
  return (
    <span
      className="rounded bg-green-100 px-2 py-1 font-bold text-green-900"
      title={citationLevelDescription(status)}
    >
      Citation Level: {formatEnumLabel(status)}
    </span>
  );
}
