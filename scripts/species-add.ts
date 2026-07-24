#!/usr/bin/env tsx
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { citations, citationMap } from "../prisma/seed/citations";
import {
  scaffoldSpeciesBundle,
  type MinimalSpeciesInput,
} from "../prisma/seed/scaffold-species";
import { replaceSpeciesInDatabase } from "../prisma/seed/seed-species-record";
import type { SpeciesBundle } from "../prisma/seed/species-bundle";

const CUSTOM_DIR = path.join(process.cwd(), "prisma/seed/species");
const INPUT_DIR = path.join(process.cwd(), "prisma/seed/input");

function usage(): void {
  console.log(`
Usage:
  npm run species:scaffold -- --genus Agaricus --epithet bisporus --common-names "button mushroom"
  npm run species:scaffold -- --input prisma/seed/input/my-species.json

  npm run species:add -- --slug my-species-slug
  npm run species:add -- prisma/seed/species/my-species-slug.json
  npm run species:add -- --slug my-species-slug --no-db   # write JSON only

Options (scaffold):
  --genus, --epithet, --scientific-name, --slug, --common-names
  --ncbi, --type mushroom|compost_mushroom|fermentation|tempeh|koji
  --meat-analog true|false
  --input <minimal.json>

Options (add):
  --slug <slug>     Load prisma/seed/species/<slug>.json
  --no-db           Skip database update (scaffold only writes file)
  --full-reseed     Run npm run db:seed instead of single-species upsert
`);
}

function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./dev.db";
  if (raw.startsWith("file:")) {
    const filePath = raw.replace("file:", "");
    return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  }
  return raw;
}

function parseArgs(argv: string[]) {
  const positional: string[] = [];
  const flags: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        flags[key] = "true";
      } else {
        flags[key] = next;
        i++;
      }
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeBundle(bundle: SpeciesBundle): string {
  ensureDir(CUSTOM_DIR);
  const outPath = path.join(CUSTOM_DIR, `${bundle.species.slug}.json`);
  fs.writeFileSync(outPath, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
  return outPath;
}

async function loadMinimalInput(flags: Record<string, string>): Promise<MinimalSpeciesInput> {
  if (flags.input) {
    const inputPath = path.resolve(flags.input);
    return JSON.parse(fs.readFileSync(inputPath, "utf8")) as MinimalSpeciesInput;
  }

  if (!flags.genus || !flags.epithet) {
    throw new Error("--genus and --epithet are required (or use --input)");
  }

  return {
    genus: flags.genus,
    speciesEpithet: flags.epithet,
    scientificName: flags["scientific-name"],
    slug: flags.slug,
    commonNames: flags["common-names"] ?? flags.epithet,
    ncbiTaxonomyId: flags.ncbi,
    cultivationType: (flags.type as MinimalSpeciesInput["cultivationType"]) ?? "mushroom",
    meatAlternativeUse: flags["meat-analog"] === "true",
  };
}

async function scaffoldCommand(flags: Record<string, string>) {
  const input = await loadMinimalInput(flags);
  const bundle = await scaffoldSpeciesBundle(input);
  const outPath = writeBundle(bundle);
  console.log(`Scaffold written: ${outPath}`);
  console.log(`Species page path: /species/${bundle.species.slug}`);
  console.log("Review placeholders (images, strains, research) then run:");
  console.log(`  npm run species:add -- --slug ${bundle.species.slug}`);
}

async function loadBundleFromArg(arg: string | undefined, slugFlag?: string): Promise<SpeciesBundle> {
  if (arg?.endsWith(".json")) {
    return JSON.parse(fs.readFileSync(path.resolve(arg), "utf8")) as SpeciesBundle;
  }
  const slug = slugFlag ?? arg;
  if (!slug) throw new Error("Provide --slug or a path to a species JSON file");
  const filePath = path.join(CUSTOM_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${filePath}. Run species:scaffold first.`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as SpeciesBundle;
}

async function addCommand(flags: Record<string, string>, positional: string[]) {
  const bundle = await loadBundleFromArg(positional[0], flags.slug);
  const outPath = writeBundle(bundle);
  console.log(`Validated bundle: ${outPath}`);

  if (flags["no-db"] === "true") return;

  if (flags["full-reseed"] === "true") {
    console.log("Running full database reseed...");
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync("npm", ["run", "db:seed"], { stdio: "inherit", cwd: process.cwd() });
    process.exit(result.status ?? 1);
  }

  const adapter = new PrismaBetterSqlite3({ url: getDatabaseUrl() });
  const prisma = new PrismaClient({ adapter });

  let citeRecords = await prisma.citation.findMany();
  if (citeRecords.length === 0) {
    citeRecords = await Promise.all(
      citations.map((c) =>
        prisma.citation.create({
          data: {
            type: c.type,
            doi: c.doi ?? null,
            pmid: c.pmid ?? null,
            patentNumber: c.patentNumber ?? null,
            url: c.url ?? null,
            title: c.title,
            authors: c.authors ?? null,
            year: c.year ?? null,
            journal: c.journal ?? null,
          },
        }),
      ),
    );
  }

  const citeIds = citationMap(citeRecords);

  async function linkCitations(
    citeIdMap: Map<string, string>,
    keys: string[],
    link: {
      speciesId?: string;
      sensoryProfileId?: string;
      nutritionProfileId?: string;
      speciesImageId?: string;
      morphologyModel3DId?: string;
      commercialApplicationId?: string;
      fieldName: string;
    },
  ) {
    for (const key of keys) {
      const citationId = citeIdMap.get(key);
      if (!citationId) continue;
      await prisma.citationLink.create({
        data: {
          citationId,
          fieldName: link.fieldName,
          speciesId: link.speciesId,
          sensoryProfileId: link.sensoryProfileId,
          nutritionProfileId: link.nutritionProfileId,
          speciesImageId: link.speciesImageId,
          morphologyModel3DId: link.morphologyModel3DId,
          commercialApplicationId: link.commercialApplicationId,
        },
      });
    }
  }

  await replaceSpeciesInDatabase(prisma, citeIds, linkCitations, bundle);
  await prisma.$disconnect();

  console.log(`Database updated for ${bundle.species.scientificName}`);
  console.log(`Open: http://localhost:3000/species/${bundle.species.slug}`);
}

async function main() {
  const [, , command, ...rest] = process.argv;
  const { positional, flags } = parseArgs(rest);

  if (!command || command === "help" || flags.help === "true") {
    usage();
    return;
  }

  ensureDir(INPUT_DIR);
  ensureDir(CUSTOM_DIR);

  if (command === "scaffold") {
    await scaffoldCommand(flags);
    return;
  }

  if (command === "add") {
    await addCommand(flags, positional);
    return;
  }

  usage();
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
