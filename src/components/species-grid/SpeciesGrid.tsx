"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { ScientificName } from "@/components/species/ScientificName";
import { ThemedSelect } from "@/components/ui/ThemedSelect";
import { formatEnumLabel, formatTagLabel } from "@/lib/format";
import { parseCommonNames } from "@/lib/types";

export type GridSpecies = {
  id: string;
  slug: string;
  scientificName: string;
  genus: string;
  commonNames: string;
  verificationStatus: string;
  meatAnalogPotential: string;
  meatAlternativeUse: boolean;
  commercialStatus: string;
  inCommercialProduct: boolean;
  tasteTags: string[];
  textureTags: string[];
  proteinPercent: number | null;
};

type SpeciesGridProps = {
  data: GridSpecies[];
  initialSearch?: string;
};

const columnHelper = createColumnHelper<GridSpecies>();

const commercialStatusLabels: Record<string, string> = {
  commercial_meat_analog: "Commercial Meat Analog",
  commercial_food: "Commercial Food",
  research_only: "Research Only",
  traditional_food: "Traditional Food",
  none: "None Documented",
};

function verificationColor(status: string) {
  switch (status) {
    case "peer_reviewed":
      return "bg-sage/25 text-truffle";
    case "expert_verified":
      return "bg-gold/30 text-truffle";
    case "single_source":
      return "bg-gold/15 text-muted";
    case "draft":
      return "bg-surface-muted text-muted";
    default:
      return "bg-surface-muted text-muted";
  }
}

function commercialProductColor(inUse: boolean) {
  return inUse ? "bg-berry/15 text-berry" : "bg-surface-muted text-muted";
}

function PopCheckbox({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
        checked
          ? "border-sage bg-sage text-cream"
          : "border-gold bg-cream hover:border-berry"
      } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
    >
      {checked ? (
        <svg
          key="checked"
          viewBox="0 0 16 16"
          className="checkbox-pop-mark h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          aria-hidden
        >
          <path d="M3 8.5l3.2 3.2L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </button>
  );
}

const filterControlClass =
  "h-10 min-w-[10.5rem] appearance-none rounded-xl border-2 border-gold bg-cream px-3 py-2 font-sans text-sm font-medium text-truffle outline-none transition-colors placeholder:text-muted/70 hover:border-berry focus:border-berry focus:bg-surface";

export function SpeciesGrid({ data, initialSearch = "" }: SpeciesGridProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState(initialSearch);
  const [genusFilter, setGenusFilter] = useState("");
  const [meatFilter, setMeatFilter] = useState("");
  const [meatAltFilter, setMeatAltFilter] = useState("");
  const [commercialFilter, setCommercialFilter] = useState("");
  const [commercialProductFilter, setCommercialProductFilter] = useState("");
  const [citationLevelFilter, setCitationLevelFilter] = useState("");
  const [tasteFilter, setTasteFilter] = useState("");
  const [textureFilter, setTextureFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const genera = useMemo(
    () => [...new Set(data.map((d) => d.genus))].sort(),
    [data],
  );

  const tasteTags = useMemo(
    () => [...new Set(data.flatMap((d) => d.tasteTags))].sort(),
    [data],
  );

  const textureTags = useMemo(
    () => [...new Set(data.flatMap((d) => d.textureTags))].sort(),
    [data],
  );

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (genusFilter && row.genus !== genusFilter) return false;
      if (meatFilter && row.meatAnalogPotential !== meatFilter) return false;
      if (meatAltFilter === "yes" && !row.meatAlternativeUse) return false;
      if (meatAltFilter === "no" && row.meatAlternativeUse) return false;
      if (commercialFilter && row.commercialStatus !== commercialFilter) return false;
      if (commercialProductFilter === "yes" && !row.inCommercialProduct) return false;
      if (commercialProductFilter === "no" && row.inCommercialProduct) return false;
      if (citationLevelFilter && row.verificationStatus !== citationLevelFilter) return false;
      if (tasteFilter && !row.tasteTags.includes(tasteFilter)) return false;
      if (textureFilter && !row.textureTags.includes(textureFilter)) return false;
      if (globalFilter) {
        const q = globalFilter.toLowerCase();
        const commons = parseCommonNames(row.commonNames).join(" ").toLowerCase();
        if (
          !row.scientificName.toLowerCase().includes(q) &&
          !row.genus.toLowerCase().includes(q) &&
          !commons.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [
    data,
    genusFilter,
    meatFilter,
    meatAltFilter,
    commercialFilter,
    commercialProductFilter,
    citationLevelFilter,
    tasteFilter,
    textureFilter,
    globalFilter,
  ]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: "",
        cell: ({ row }) => {
          const isChecked = selected.has(row.original.slug);
          return (
            <PopCheckbox
              checked={isChecked}
              disabled={!isChecked && selected.size >= 4}
              onChange={(nextChecked) => {
                const next = new Set(selected);
                if (nextChecked) {
                  if (next.size < 4) next.add(row.original.slug);
                } else {
                  next.delete(row.original.slug);
                }
                setSelected(next);
              }}
            />
          );
        },
      }),
      columnHelper.accessor("scientificName", {
        header: "Scientific Name",
        cell: (info) => (
          <Link
            href={`/species/${info.row.original.slug}`}
            className="font-sans text-base font-extrabold text-sage hover:text-berry hover:underline"
          >
            <ScientificName
              genus={info.row.original.genus}
              scientificName={info.getValue()}
              className="font-extrabold"
            />
          </Link>
        ),
      }),
      columnHelper.accessor("genus", {
        header: "Genus",
        cell: (info) => <em>{info.getValue()}</em>,
      }),
      columnHelper.accessor((row) => parseCommonNames(row.commonNames).join(" · "), {
        id: "commonName",
        header: "Common Name",
        cell: (info) => {
          const names = parseCommonNames(info.row.original.commonNames);
          return names.length > 0 ? names.join(" · ") : "—";
        },
      }),
      columnHelper.accessor("meatAnalogPotential", {
        header: "Meat Analog Potential",
        cell: (info) => formatEnumLabel(info.getValue()),
      }),
      columnHelper.accessor("meatAlternativeUse", {
        header: "Meat Alternative",
        cell: (info) => (info.getValue() ? "Yes" : "No"),
      }),
      columnHelper.accessor("commercialStatus", {
        header: "Commercial Status",
        cell: (info) =>
          commercialStatusLabels[info.getValue()] ?? formatEnumLabel(info.getValue()),
      }),
      columnHelper.accessor("tasteTags", {
        header: "Taste Tags",
        cell: (info) =>
          info
            .getValue()
            .slice(0, 3)
            .map(formatTagLabel)
            .join(", ") || "—",
      }),
      columnHelper.accessor("proteinPercent", {
        header: "Protein %",
        cell: (info) => (info.getValue() != null ? `${info.getValue()}%` : "—"),
      }),
      columnHelper.accessor("inCommercialProduct", {
        header: "Commercial Product",
        cell: (info) => (
          <span
            className={`rounded px-2 py-0.5 text-xs font-bold ${commercialProductColor(info.getValue())}`}
          >
            {info.getValue() ? "Yes" : "No"}
          </span>
        ),
      }),
    ],
    [selected],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const compareUrl =
    selected.size >= 2 ? `/compare?ids=${[...selected].join(",")}` : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-gold bg-surface-muted p-4">
        <p className="mb-3 font-display text-lg font-bold text-truffle">Filters</p>
        <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search species..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className={`${filterControlClass} min-w-[14rem] flex-1`}
        />
        <ThemedSelect
          value={genusFilter}
          onChange={setGenusFilter}
          options={[
            { value: "", label: "All Genera" },
            ...genera.map((g) => ({ value: g, label: g })),
          ]}
        />
        <ThemedSelect
          value={meatFilter}
          onChange={setMeatFilter}
          options={[
            { value: "", label: "Meat Analog Potential" },
            { value: "high", label: "High" },
            { value: "moderate", label: "Moderate" },
            { value: "low", label: "Low" },
            { value: "unknown", label: "Unknown" },
          ]}
        />
        <ThemedSelect
          value={meatAltFilter}
          onChange={setMeatAltFilter}
          options={[
            { value: "", label: "Used in Meat Alternatives" },
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
        <ThemedSelect
          value={commercialProductFilter}
          onChange={setCommercialProductFilter}
          options={[
            { value: "", label: "In Commercial Product" },
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
        <ThemedSelect
          value={commercialFilter}
          onChange={setCommercialFilter}
          options={[
            { value: "", label: "Commercial Status" },
            { value: "commercial_meat_analog", label: "Commercial Meat Analog" },
            { value: "commercial_food", label: "Commercial Food" },
            { value: "research_only", label: "Research Only" },
            { value: "traditional_food", label: "Traditional Food" },
            { value: "none", label: "None Documented" },
          ]}
        />
        <ThemedSelect
          value={citationLevelFilter}
          onChange={setCitationLevelFilter}
          title="How well database entries are supported by citations, not food-safety approval"
          options={[
            { value: "", label: "Citation Level" },
            { value: "peer_reviewed", label: "Peer Reviewed" },
            { value: "expert_verified", label: "Expert Verified" },
            { value: "single_source", label: "Single Source" },
            { value: "draft", label: "Draft" },
          ]}
        />
        <ThemedSelect
          value={tasteFilter}
          onChange={setTasteFilter}
          options={[
            { value: "", label: "Taste Tag" },
            ...tasteTags.map((tag) => ({ value: tag, label: formatTagLabel(tag) })),
          ]}
        />
        <ThemedSelect
          value={textureFilter}
          onChange={setTextureFilter}
          options={[
            { value: "", label: "Texture Tag" },
            ...textureTags.map((tag) => ({ value: tag, label: formatTagLabel(tag) })),
          ]}
        />
        {compareUrl && (
          <Link
            href={compareUrl}
            className="inline-flex h-10 items-center rounded-xl bg-berry px-4 font-sans text-sm font-semibold text-cream transition-colors hover:bg-truffle"
          >
            Compare {selected.size} Species
          </Link>
        )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border-2 border-gold/50 bg-cream/95">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-gold/20">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-sans text-base font-bold text-truffle"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as string] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border bg-cream/95">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gold/10">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-truffle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">
        {filteredData.length} of {data.length} species shown. Select 2–4 to compare (commercial use,
        sensory, morphology). &quot;Citation Level&quot; on species pages reflects how well database
        entries are sourced, not food-safety approval.
      </p>
    </div>
  );
}
