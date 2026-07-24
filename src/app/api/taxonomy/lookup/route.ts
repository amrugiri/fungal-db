import { NextResponse } from "next/server";
import { lineageToTaxonomy, lookupTaxonomy } from "@/lib/taxonomy/ncbi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "name parameter required" }, { status: 400 });
  }

  const result = await lookupTaxonomy(name);
  if (!result) {
    return NextResponse.json({ error: "Taxonomy not found" }, { status: 404 });
  }

  const taxonomy = lineageToTaxonomy(result.lineage, result.ranks);

  return NextResponse.json({
    taxId: result.taxId,
    scientificName: result.scientificName,
    lineage: result.lineage,
    taxonomy: {
      kingdom: taxonomy.kingdom ?? "Fungi",
      phylum: taxonomy.phylum,
      class: taxonomy.class,
      order: taxonomy.order,
      family: taxonomy.family,
      genus: taxonomy.genus,
    },
  });
}
