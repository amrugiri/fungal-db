import "dotenv/config";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { citations, citationMap } from "./seed/citations";
import { getSpotlightMonth } from "./seed/alt-protein-research";
import { loadAllSpeciesSeeds, loadAltProteinResearchMap } from "./seed/load-all-species";
import { verified } from "./seed/species-data";

const speciesData = loadAllSpeciesSeeds();
const altProteinResearchBySlug = loadAltProteinResearchMap();

function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./dev.db";
  if (raw.startsWith("file:")) {
    const filePath = raw.replace("file:", "");
    const resolved = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);
    return resolved;
  }
  return raw;
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: getDatabaseUrl() });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function linkCitations(
  citeIds: Map<string, string>,
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
    const citationId = citeIds.get(key);
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

async function main() {
  console.log("Clearing existing data...");
  await prisma.citationLink.deleteMany();
  await prisma.citation.deleteMany();
  await prisma.altProteinResearchHighlight.deleteMany();
  await prisma.commercialApplication.deleteMany();
  await prisma.morphologyModel3D.deleteMany();
  await prisma.speciesImage.deleteMany();
  await prisma.cultureCollectionStrain.deleteMany();
  await prisma.geographicDistribution.deleteMany();
  await prisma.nutritionProfile.deleteMany();
  await prisma.morphology.deleteMany();
  await prisma.sensoryProfile.deleteMany();
  await prisma.species.deleteMany();
  await prisma.taxonomy.deleteMany();

  console.log("Seeding citations...");
  const createdCitations = await Promise.all(
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
  const citeIds = citationMap(createdCitations);

  console.log(`Seeding ${speciesData.length} species...`);
  for (const sp of speciesData) {
    const taxonomy = await prisma.taxonomy.create({
      data: {
        kingdom: sp.taxonomy.kingdom ?? "Fungi",
        phylum: sp.taxonomy.phylum,
        class: sp.taxonomy.class,
        order: sp.taxonomy.order,
        family: sp.taxonomy.family,
        genus: sp.taxonomy.genus,
      },
    });

    const species = await prisma.species.create({
      data: {
        slug: sp.slug,
        genus: sp.genus,
        speciesEpithet: sp.speciesEpithet,
        scientificName: sp.scientificName,
        commonNames: JSON.stringify(sp.commonNames),
        synonyms: sp.synonyms ? JSON.stringify(sp.synonyms) : null,
        mycobankId: sp.mycobankId ?? null,
        ncbiTaxonomyId: sp.ncbiTaxonomyId,
        verificationStatus: verified,
        fdaStatus: sp.regulatory?.fda ?? null,
        efsaStatus: sp.regulatory?.efsa ?? null,
        regulatoryNotes: sp.regulatory?.notes ?? null,
        lastVerifiedAt: new Date(),
        verifiedBy: "seed-script",
        taxonomyId: taxonomy.id,
      },
    });

    const sensory = await prisma.sensoryProfile.create({
      data: {
        speciesId: species.id,
        tasteAxes: JSON.stringify(sp.sensory.tasteAxes),
        textureAxes: JSON.stringify(sp.sensory.textureAxes),
        aromaNotes: sp.sensory.aromaNotes ?? null,
        meatAnalogPotential: sp.sensory.meatAnalogPotential,
        meatAnalogRationale: sp.sensory.meatAnalogRationale ?? null,
        preparationContext: sp.sensory.preparationContext ?? null,
        confidenceNotes: sp.sensory.confidenceNotes ?? null,
        verificationStatus: verified,
      },
    });

    await prisma.morphology.create({
      data: {
        speciesId: species.id,
        hyphalType: sp.morphology.hyphalType,
        cellWallComposition: sp.morphology.cellWallComposition ?? null,
        fruitingBodyStructure: sp.morphology.fruitingBodyStructure ?? null,
        sporeCharacteristics: sp.morphology.sporeCharacteristics ?? null,
        microscopyNotes: sp.morphology.microscopyNotes ?? null,
        verificationStatus: verified,
      },
    });

    const nutrition = await prisma.nutritionProfile.create({
      data: {
        speciesId: species.id,
        proteinPercent: sp.nutrition.proteinPercent ?? null,
        fiberPercent: sp.nutrition.fiberPercent ?? null,
        fatPercent: sp.nutrition.fatPercent ?? null,
        moisturePercent: sp.nutrition.moisturePercent ?? null,
        aminoAcids: sp.nutrition.aminoAcids
          ? JSON.stringify(sp.nutrition.aminoAcids)
          : null,
        aminoAcidBasis: sp.nutrition.aminoAcidBasis ?? null,
        pdcaas: sp.nutrition.pdcaas ?? null,
        diaas: sp.nutrition.diaas ?? null,
        limitingAminoAcids: sp.nutrition.limitingAminoAcids ?? null,
        preparationContext: sp.nutrition.preparationContext ?? null,
        confidenceNotes: sp.nutrition.confidenceNotes ?? null,
        verificationStatus: verified,
      },
    });

    await prisma.geographicDistribution.create({
      data: {
        speciesId: species.id,
        nativeRange: sp.geographic.nativeRange,
        cultivatedRegions: sp.geographic.cultivatedRegions ?? null,
        habitat: sp.geographic.habitat ?? null,
        gbifUrl: sp.geographic.gbifUrl ?? null,
        verificationStatus: verified,
      },
    });

    for (const strain of sp.strains) {
      await prisma.cultureCollectionStrain.create({
        data: {
          speciesId: species.id,
          collectionName: strain.collectionName,
          strainId: strain.strainId,
          catalogUrl: strain.catalogUrl,
          availabilityNotes: strain.availabilityNotes ?? null,
          verificationStatus: verified,
        },
      });
    }

    for (const img of sp.images) {
      const image = await prisma.speciesImage.create({
        data: {
          speciesId: species.id,
          url: img.url,
          caption: img.caption,
          license: img.license,
          attributionText: img.attributionText,
          sourceUrl: img.sourceUrl ?? null,
          imageCategory: img.imageCategory ?? "other",
          verificationStatus: verified,
        },
      });
      if (img.citationKeys?.length) {
        await linkCitations(citeIds, img.citationKeys, {
          speciesImageId: image.id,
          fieldName: "image",
        });
      }
    }

    if (sp.commercialUse) {
      const commercial = await prisma.commercialApplication.create({
        data: {
          speciesId: species.id,
          meatAlternativeUse: sp.commercialUse.meatAlternativeUse,
          applicationSummary: sp.commercialUse.applicationSummary,
          commercialStatus: sp.commercialUse.commercialStatus,
          companies: JSON.stringify(sp.commercialUse.companies),
          productionProcess: JSON.stringify(sp.commercialUse.productionProcess ?? []),
          confidenceNotes: sp.commercialUse.confidenceNotes ?? null,
          verificationStatus: verified,
        },
      });
      await linkCitations(citeIds, sp.commercialUse.citationKeys, {
        commercialApplicationId: commercial.id,
        fieldName: "commercial_use",
      });
    }

    const model3d = await prisma.morphologyModel3D.create({
      data: {
        speciesId: species.id,
        sourceType: sp.slug === "agaricus-bisporus" ? "anatomical" : "parametric",
        parameters: JSON.stringify(sp.morphology3D),
        license: sp.slug === "agaricus-bisporus" ? "Anatomical schematic model" : "Generated parametric model",
        attributionText:
          sp.slug === "agaricus-bisporus"
            ? "Interactive Agaricus bisporus basidiocarp anatomy model"
            : "Parametric morphology schematic from database metadata",
        verificationStatus: verified,
      },
    });

    const researchItems = altProteinResearchBySlug[sp.slug];
    if (researchItems?.length) {
      const spotlightMonth = getSpotlightMonth();
      for (const item of researchItems) {
        await prisma.altProteinResearchHighlight.create({
          data: {
            speciesId: species.id,
            spotlightMonth,
            title: item.title,
            authors: item.authors,
            journal: item.journal,
            year: item.year,
            doi: item.doi ?? null,
            url: item.url ?? null,
            summary: item.summary,
            publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
          },
        });
      }
    }

    await linkCitations(citeIds, sp.speciesCitationKeys, {
      speciesId: species.id,
      fieldName: "species",
    });
    await linkCitations(citeIds, sp.sensory.citationKeys, {
      sensoryProfileId: sensory.id,
      fieldName: "sensory",
    });
    await linkCitations(citeIds, sp.nutrition.citationKeys, {
      nutritionProfileId: nutrition.id,
      fieldName: "nutrition",
    });
    await linkCitations(citeIds, sp.speciesCitationKeys.slice(0, 1), {
      morphologyModel3DId: model3d.id,
      fieldName: "morphology_3d",
    });

    console.log(`  ✓ ${sp.scientificName}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
