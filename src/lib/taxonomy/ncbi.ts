export type NcbiTaxonomyResult = {
  taxId: string;
  scientificName: string;
  lineage: string[];
  ranks: string[];
};

export async function lookupTaxonomy(
  scientificName: string,
): Promise<NcbiTaxonomyResult | null> {
  const searchUrl = new URL(
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
  );
  searchUrl.searchParams.set("db", "taxonomy");
  searchUrl.searchParams.set("term", `${scientificName}[Scientific Name]`);
  searchUrl.searchParams.set("retmode", "json");

  const searchRes = await fetch(searchUrl.toString(), {
    next: { revalidate: 86400 },
  });
  if (!searchRes.ok) return null;

  const searchData = (await searchRes.json()) as {
    esearchresult?: { idlist?: string[] };
  };
  const taxId = searchData.esearchresult?.idlist?.[0];
  if (!taxId) return null;

  const summaryUrl = new URL(
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi",
  );
  summaryUrl.searchParams.set("db", "taxonomy");
  summaryUrl.searchParams.set("id", taxId);
  summaryUrl.searchParams.set("retmode", "json");

  const summaryRes = await fetch(summaryUrl.toString(), {
    next: { revalidate: 86400 },
  });
  if (!summaryRes.ok) return null;

  const summaryData = (await summaryRes.json()) as {
    result?: Record<
      string,
      {
        scientificname?: string;
        lineage?: string[];
        rank?: string[];
      }
    >;
  };

  const record = summaryData.result?.[taxId];
  if (!record) return null;

  return {
    taxId,
    scientificName: record.scientificname ?? scientificName,
    lineage: record.lineage ?? [],
    ranks: record.rank ?? [],
  };
}

export function lineageToTaxonomy(lineage: string[], ranks: string[]) {
  const taxonomy: Record<string, string> = {};
  for (let i = 0; i < lineage.length; i++) {
    const rank = ranks[i];
    if (rank && rank !== "no rank") {
      taxonomy[rank] = lineage[i];
    }
  }
  return taxonomy;
}
