import { formatRegulatoryStatus } from "@/lib/format";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { labelClass } from "@/components/ui/headings";

type RegulatorySectionProps = {
  fdaStatus: string | null;
  efsaStatus: string | null;
  regulatoryNotes: string | null;
};

export function RegulatorySection({
  fdaStatus,
  efsaStatus,
  regulatoryNotes,
}: RegulatorySectionProps) {
  if (!fdaStatus && !efsaStatus && !regulatoryNotes) {
    return null;
  }

  return (
    <CollapsibleSection title="Regulatory Status" defaultOpen id="regulatory-status">
      <dl className="space-y-3 text-sm">
        <div>
          <dt className={labelClass}>FDA (US)</dt>
          <dd>{formatRegulatoryStatus(fdaStatus)}</dd>
        </div>
        <div>
          <dt className={labelClass}>EFSA (EU)</dt>
          <dd>{formatRegulatoryStatus(efsaStatus)}</dd>
        </div>
        {regulatoryNotes && (
          <div>
            <dt className={labelClass}>Notes</dt>
            <dd>{regulatoryNotes}</dd>
          </div>
        )}
      </dl>
    </CollapsibleSection>
  );
}
