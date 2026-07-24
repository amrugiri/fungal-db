import { formatRegulatoryStatus } from "@/lib/format";

type RegulatoryStatusLineProps = {
  fdaStatus: string | null;
  efsaStatus: string | null;
  regulatoryNotes?: string | null;
};

export function RegulatoryStatusLine({
  fdaStatus,
  efsaStatus,
  regulatoryNotes,
}: RegulatoryStatusLineProps) {
  if (!fdaStatus && !efsaStatus) {
    return null;
  }

  return (
    <p className="mt-2 text-sm text-black">
      <span className="font-bold">Regulatory: </span>
      FDA — {formatRegulatoryStatus(fdaStatus)} · EFSA — {formatRegulatoryStatus(efsaStatus)}
      {regulatoryNotes ? ` (${regulatoryNotes})` : ""}
    </p>
  );
}
