"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MorphologyViewerLazy } from "@/components/morphology-viewer/MorphologyViewerLazy";
import {
  formatEnumLabel,
  formatRegulatoryStatus,
  formatTagLabel,
} from "@/lib/format";
import type { MorphologyParameters } from "@/lib/types";

export type CompareRow = {
  slug: string;
  scientificName: string;
  genus: string;
  speciesEpithet: string;
  commonNames: string;
  meatAnalog: string;
  commercialProduct: boolean;
  commercialStatus: string;
  fdaStatus: string | null;
  efsaStatus: string | null;
  aromaNotes: string;
  tasteAxes: Record<string, number>;
  textureAxes: Record<string, number>;
  protein: number | null;
  fiber: number | null;
  hyphalType: string;
  nativeRange: string;
  strains: string;
  morphologyParams: MorphologyParameters;
  referenceImageUrl: string | null;
  referenceImageCaption: string | null;
};

const commercialStatusLabels: Record<string, string> = {
  commercial_meat_analog: "Commercial Meat Analog",
  commercial_food: "Commercial Food",
  research_only: "Research Only",
  traditional_food: "Traditional Food",
  none: "None Documented",
};

function highlightMax(values: (number | null)[]): Set<number> {
  const nums = values.filter((v): v is number => v != null);
  if (nums.length === 0) return new Set();
  const max = Math.max(...nums);
  const indices = new Set<number>();
  values.forEach((v, i) => {
    if (v === max) indices.add(i);
  });
  return indices;
}

function CompareSpeciesHeader({
  row,
}: {
  row: CompareRow;
}) {
  const [hovered, setHovered] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);

  const openPreview = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHovered(true);
  };

  const closePreview = () => {
    leaveTimerRef.current = setTimeout(() => setHovered(false), 120);
  };

  useLayoutEffect(() => {
    if (!hovered || !anchorRef.current) {
      setPopupPos(null);
      return;
    }

    const updatePosition = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      const popupWidth = 240;
      const popupHeight = 248;
      const gap = 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const showBelow = spaceBelow >= popupHeight + gap || rect.top < popupHeight + gap;

      const top = showBelow ? rect.bottom + gap : rect.top - popupHeight - gap;
      const left = Math.min(
        Math.max(8, rect.left + rect.width / 2 - popupWidth / 2),
        window.innerWidth - popupWidth - 8,
      );

      setPopupPos({ top, left });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [hovered]);

  const popup =
    hovered && popupPos
      ? createPortal(
          <div
            className="fixed z-50 w-60 rounded-lg border border-zinc-300 bg-white p-2 shadow-xl"
            style={{ top: popupPos.top, left: popupPos.left }}
            onMouseEnter={openPreview}
            onMouseLeave={closePreview}
          >
            <div className="h-52 w-full overflow-hidden rounded-md">
              <MorphologyViewerLazy
                parameters={row.morphologyParams}
                referenceImageUrl={row.referenceImageUrl}
                referenceCaption={row.referenceImageCaption}
                referenceAlt={row.scientificName}
                heightClass="h-52"
                showCaption={false}
              />
            </div>
            <p className="mt-2 text-center text-xs text-black">3D morphology preview</p>
          </div>,
          document.body,
        )
      : null;

  return (
    <th className="min-w-[168px] px-4 py-3 align-top">
      <div
        ref={anchorRef}
        className="relative flex flex-col items-center gap-2 pb-1"
        onMouseEnter={openPreview}
        onMouseLeave={closePreview}
      >
        {popup}
        <div className="h-28 w-28 shrink-0">
          <MorphologyViewerLazy
            parameters={row.morphologyParams}
            referenceImageUrl={row.referenceImageUrl}
            referenceCaption={row.referenceImageCaption}
            referenceAlt={row.scientificName}
            compact
            showCaption={false}
          />
        </div>
        <Link
          href={`/species/${row.slug}`}
          className="relative z-10 text-center text-base font-bold text-blue-700 hover:underline"
        >
          <em>
            {row.genus} {row.speciesEpithet}
          </em>
        </Link>
      </div>
    </th>
  );
}

export function CompareTable({ rows }: { rows: CompareRow[] }) {
  const proteinHigh = highlightMax(rows.map((r) => r.protein));
  const umamiHigh = highlightMax(rows.map((r) => r.tasteAxes.umami ?? null));

  const tasteKeys = useMemo(
    () => [...new Set(rows.flatMap((r) => Object.keys(r.tasteAxes)))].sort(),
    [rows],
  );
  const textureKeys = useMemo(
    () => [...new Set(rows.flatMap((r) => Object.keys(r.textureAxes)))].sort(),
    [rows],
  );

  function exportCsv() {
    const headers = [
      "Scientific Name",
      "Commercial Product",
      "Meat Analog Potential",
      "Protein %",
      "FDA Status",
      "EFSA Status",
    ];
    const csvRows = rows.map((r) =>
      [
        r.scientificName,
        r.commercialProduct ? "Yes" : "No",
        r.meatAnalog,
        r.protein ?? "",
        formatRegulatoryStatus(r.fdaStatus),
        formatRegulatoryStatus(r.efsaStatus),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[headers.join(","), ...csvRows].join("\n")], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "species-comparison.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const fields: {
    label: string;
    get: (r: CompareRow) => string;
    highlight?: Set<number>;
  }[] = [
    { label: "Common Names", get: (r) => r.commonNames || "—" },
    {
      label: "In Commercial Product",
      get: (r) => (r.commercialProduct ? "Yes" : "No"),
    },
    {
      label: "Commercial Status",
      get: (r) =>
        commercialStatusLabels[r.commercialStatus] ??
        formatEnumLabel(r.commercialStatus),
    },
    { label: "Meat Analog Potential", get: (r) => r.meatAnalog },
    {
      label: "FDA Status",
      get: (r) => formatRegulatoryStatus(r.fdaStatus),
    },
    {
      label: "EFSA Status",
      get: (r) => formatRegulatoryStatus(r.efsaStatus),
    },
    { label: "Aroma Notes", get: (r) => r.aromaNotes || "—" },
    ...tasteKeys.map((key) => ({
      label: `Taste: ${formatTagLabel(key)} (0–5)`,
      get: (r: CompareRow) => String(r.tasteAxes[key] ?? "—"),
      highlight: key === "umami" ? umamiHigh : undefined,
    })),
    ...textureKeys.map((key) => ({
      label: `Texture: ${formatTagLabel(key)} (0–5)`,
      get: (r: CompareRow) => String(r.textureAxes[key] ?? "—"),
    })),
    {
      label: "Protein %",
      get: (r) => (r.protein != null ? `${r.protein}%` : "—"),
      highlight: proteinHigh,
    },
    { label: "Fiber %", get: (r) => (r.fiber != null ? `${r.fiber}%` : "—") },
    { label: "Hyphal Type", get: (r) => r.hyphalType },
    { label: "Native Range", get: (r) => r.nativeRange },
    { label: "Culture Strains", get: (r) => r.strains || "—" },
  ];

  return (
    <div>
      <button
        type="button"
        onClick={exportCsv}
        className="mb-4 rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700"
      >
        Export CSV
      </button>
      <div className="overflow-x-auto overflow-y-visible rounded-lg border border-zinc-200">
        <table className="min-w-full text-sm">
          <thead className="overflow-visible bg-zinc-50">
            <tr>
              <th className="px-4 py-3 text-left text-base font-bold text-black">Attribute</th>
              {rows.map((r) => (
                <CompareSpeciesHeader key={r.slug} row={r} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {fields.map((field) => (
              <tr key={field.label}>
                <td className="px-4 py-3 text-base font-bold text-black">{field.label}</td>
                {rows.map((r, i) => (
                  <td
                    key={r.slug}
                    className={`px-4 py-3 ${field.highlight?.has(i) ? "bg-green-50 font-medium text-green-900" : ""}`}
                  >
                    {field.get(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-black">
        Hover the 3D bubble on each species name for an enlarged morphology preview.
      </p>
    </div>
  );
}
