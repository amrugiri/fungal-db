#!/usr/bin/env tsx
/**
 * Scan OpenAlex for recent papers on each species (alt-protein / food context).
 * Used for the monthly living-resource update.
 */
import fs from "node:fs";
import path from "node:path";
import { loadAllSpeciesSeeds } from "../prisma/seed/load-all-species";

type Work = {
  title: string;
  year: number | null;
  doi: string | null;
  journal: string;
  authors: string;
};

function parseArgs(argv: string[]) {
  const flags: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) flags[key] = "true";
    else {
      flags[key] = next;
      i++;
    }
  }
  return flags;
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchOpenAlex(scientificName: string, fromDate: string): Promise<Work[]> {
  const query = `${scientificName} (mycoprotein OR "meat analog" OR "alternative protein" OR tempeh OR koji OR fermentation)`;
  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("search", query);
  url.searchParams.set("filter", `from_publication_date:${fromDate}`);
  url.searchParams.set("per_page", "5");
  url.searchParams.set("sort", "publication_date:desc");
  url.searchParams.set("mailto", "https://github.com/amrugiri/fungal-db");

  const response = await fetch(url, {
    headers: { "User-Agent": "MycoProt monthly scan (https://github.com/amrugiri/fungal-db)" },
  });
  if (!response.ok) {
    throw new Error(`OpenAlex ${response.status} for ${scientificName}`);
  }
  const data = (await response.json()) as {
    results?: {
      title: string;
      publication_year: number | null;
      doi: string | null;
      authorships?: { author?: { display_name?: string } }[];
      primary_location?: { source?: { display_name?: string } };
    }[];
  };

  return (data.results ?? []).map((work) => ({
    title: work.title,
    year: work.publication_year,
    doi: work.doi?.replace("https://doi.org/", "") ?? null,
    journal: work.primary_location?.source?.display_name ?? "",
    authors:
      (work.authorships ?? [])
        .slice(0, 3)
        .map((a) => a.author?.display_name)
        .filter(Boolean)
        .join(", ") || "Unknown",
  }));
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const sinceDays = Number(flags["since-days"] ?? 35);
  const fromDate = isoDaysAgo(sinceDays);
  const species = loadAllSpeciesSeeds();

  const lines: string[] = [
    `# Monthly literature scan`,
    ``,
    `Papers from ${fromDate} onward (OpenAlex). Copy table values into empty fields only. Do not invent 0–5 bars or mix wet/dry bases.`,
    ``,
  ];

  for (const sp of species) {
    process.stderr.write(`Scanning ${sp.scientificName}…\n`);
    let works: Work[] = [];
    try {
      works = await searchOpenAlex(sp.scientificName, fromDate);
    } catch (error) {
      lines.push(`## ${sp.scientificName}`, ``, `Scan failed: ${String(error)}`, ``);
      await sleep(250);
      continue;
    }
    lines.push(`## ${sp.scientificName}`, ``);
    if (works.length === 0) {
      lines.push(`No new alt-protein / food hits in this window.`, ``);
    } else {
      for (const work of works) {
        const doi = work.doi ? `https://doi.org/${work.doi}` : "";
        lines.push(`- ${work.year ?? "n.d."} — ${work.authors}. *${work.title}*. ${work.journal}. ${doi}`);
      }
      lines.push(``);
    }
    await sleep(250);
  }

  lines.push(`## Curator checklist`, ``);
  lines.push(`- [ ] For each hit, open the paper and copy empty nutrition / sensory / usage fields from tables`);
  lines.push(`- [ ] Leave a field empty if the paper does not state a number`);
  lines.push(`- [ ] Add citations; do not mix wet-weight and dry-weight values`);
  lines.push(`- [ ] Scaffold any newly commercial food or mycoprotein fungus not already in the catalogue`);
  lines.push(`- [ ] Reseed \`data/fungal.db\` and deploy`);
  lines.push(``);

  const markdown = `${lines.join("\n")}\n`;
  const out = flags.out;
  if (out) {
    const dest = path.resolve(out);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, markdown, "utf8");
    process.stderr.write(`Wrote ${dest}\n`);
  }
  process.stdout.write(markdown);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
