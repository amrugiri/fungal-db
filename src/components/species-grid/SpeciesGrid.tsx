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
      return "bg-green-100 text-green-800";
    case "expert_verified":
      return "bg-emerald-100 text-emerald-800";
    case "single_source":
      return "bg-amber-100 text-amber-800";
    case "draft":
      return "bg-zinc-100 text-black";
    default:
      return "bg-zinc-100 text-black";
  }
}

function commercialProductColor(inUse: boolean) {
  return inUse ? "bg-blue-100 text-blue-900" : "bg-zinc-100 text-black";
}

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
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selected.has(row.original.slug)}
            onChange={(e) => {
              const next = new Set(selected);
              if (e.target.checked) {
                if (next.size < 4) next.add(row.original.slug);
              } else {
                next.delete(row.original.slug);
              }
              setSelected(next);
            }}
            className="rounded border-zinc-300"
          />
        ),
      }),
      columnHelper.accessor("scientificName", {
        header: "Scientific Name",
        cell: (info) => (
          <Link
            href={`/species/${info.row.original.slug}`}
            className="font-medium text-blue-700 hover:underline"
          >
            <ScientificName
              genus={info.row.original.genus}
              scientificName={info.getValue()}
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
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search species..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        <select
          value={genusFilter}
          onChange={(e) => setGenusFilter(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">All Genera</option>
          {genera.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          value={meatFilter}
          onChange={(e) => setMeatFilter(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Meat Analog Potential</option>
          <option value="high">High</option>
          <option value="moderate">Moderate</option>
          <option value="low">Low</option>
          <option value="unknown">Unknown</option>
        </select>
        <select
          value={meatAltFilter}
          onChange={(e) => setMeatAltFilter(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Used in Meat Alternatives</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <select
          value={commercialProductFilter}
          onChange={(e) => setCommercialProductFilter(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">In Commercial Product</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <select
          value={commercialFilter}
          onChange={(e) => setCommercialFilter(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Commercial Status</option>
          <option value="commercial_meat_analog">Commercial Meat Analog</option>
          <option value="commercial_food">Commercial Food</option>
          <option value="research_only">Research Only</option>
          <option value="traditional_food">Traditional Food</option>
          <option value="none">None Documented</option>
        </select>
        <select
          value={citationLevelFilter}
          onChange={(e) => setCitationLevelFilter(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
          title="How well database entries are supported by citations — not food-safety approval"
        >
          <option value="">Citation Level</option>
          <option value="peer_reviewed">Peer Reviewed</option>
          <option value="expert_verified">Expert Verified</option>
          <option value="single_source">Single Source</option>
          <option value="draft">Draft</option>
        </select>
        <input
          type="text"
          placeholder="Taste Tag Filter"
          value={tasteFilter}
          onChange={(e) => setTasteFilter(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Texture Tag Filter"
          value={textureFilter}
          onChange={(e) => setTextureFilter(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        {compareUrl && (
          <Link
            href={compareUrl}
            className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700"
          >
            Compare {selected.size} Species
          </Link>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="cursor-pointer px-4 py-3 text-left text-base font-bold text-black"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as string] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-black">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-black">
        {filteredData.length} of {data.length} species shown. Select 2–4 to compare (commercial use,
        sensory, morphology). &quot;Citation Level&quot; on species pages reflects how well database
        entries are sourced — not food-safety approval.
      </p>
    </div>
  );
}
