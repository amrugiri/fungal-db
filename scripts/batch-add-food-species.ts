#!/usr/bin/env tsx
/**
 * Scaffold, enrich, and DB-load the food / alt-protein species batch.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { foodSpeciesBatch, slugForEntry } from "../prisma/seed/batch-food-species";
import { citations, citationMap } from "../prisma/seed/citations";
import { scaffoldSpeciesBundle } from "../prisma/seed/scaffold-species";
import { replaceSpeciesInDatabase } from "../prisma/seed/seed-species-record";
import type { SpeciesBundle } from "../prisma/seed/species-bundle";

const CUSTOM_DIR = path.join(process.cwd(), "prisma/seed/species");

function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./dev.db";
  if (raw.startsWith("file:")) {
    const filePath = raw.replace("file:", "");
    return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  }
  return raw;
}

async function upsertMissingCitations(prisma: PrismaClient) {
  const existing = await prisma.citation.findMany();
  for (const c of citations) {
    const found = existing.find(
      (row) =>
        (c.doi && row.doi === c.doi) ||
        (c.patentNumber && row.patentNumber === c.patentNumber) ||
        (c.url && row.url === c.url && row.title === c.title) ||
        (!c.doi && !c.url && !c.patentNumber && row.title === c.title && row.year === (c.year ?? null)),
    );
    if (found) continue;
    const created = await prisma.citation.create({
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
    });
    existing.push(created);
  }
  return citationMap(existing);
}

async function main() {
  if (!fs.existsSync(CUSTOM_DIR)) fs.mkdirSync(CUSTOM_DIR, { recursive: true });

  const adapter = new PrismaBetterSqlite3({ url: getDatabaseUrl() });
  const prisma = new PrismaClient({ adapter });
  const citeIds = await upsertMissingCitations(prisma);

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
      if (!citationId) {
        console.warn(`  warning: missing citation key ${key}`);
        continue;
      }
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

  const added: string[] = [];

  for (const entry of foodSpeciesBatch) {
    const slug = slugForEntry(entry);
    console.log(`\n→ ${slug}`);

    const scaffolded = await scaffoldSpeciesBundle({
      genus: entry.genus,
      speciesEpithet: entry.speciesEpithet,
      commonNames: entry.commonNames,
      cultivationType: entry.cultivationType,
      meatAlternativeUse: true,
      meatAnalogPotential: entry.meatAnalogPotential,
    });

    const patchedSpecies = entry.patch(scaffolded.species);
    const bundle: SpeciesBundle = {
      species: patchedSpecies,
      altProteinResearch: entry.research,
    };

    const outPath = path.join(CUSTOM_DIR, `${slug}.json`);
    fs.writeFileSync(outPath, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
    console.log(`  wrote ${outPath}`);

    await replaceSpeciesInDatabase(prisma, citeIds, linkCitations, bundle);
    console.log(`  db updated`);
    added.push(slug);
  }

  await prisma.$disconnect();
  console.log(`\nDone. Added ${added.length} species:`);
  for (const s of added) console.log(`  - ${s}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
