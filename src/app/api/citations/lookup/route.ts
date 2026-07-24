import { NextResponse } from "next/server";
import { formatOpenAlexCitation, lookupDoi } from "@/lib/citations/openalex";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doi = searchParams.get("doi");
  if (!doi) {
    return NextResponse.json({ error: "doi parameter required" }, { status: 400 });
  }

  const work = await lookupDoi(doi);
  if (!work) {
    return NextResponse.json({ error: "DOI not found" }, { status: 404 });
  }

  return NextResponse.json(formatOpenAlexCitation(work));
}
