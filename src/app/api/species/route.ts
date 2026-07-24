import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const species = await db.species.findMany({
    include: { taxonomy: true },
    orderBy: { scientificName: "asc" },
  });
  return NextResponse.json(species);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    genus: string;
    speciesEpithet: string;
    scientificName: string;
    slug: string;
    commonNames: string[];
    ncbiTaxonomyId?: string;
    taxonomy?: {
      phylum?: string;
      class?: string;
      order?: string;
      family?: string;
      genus: string;
    };
  };

  let taxonomyId: string | undefined;
  if (body.taxonomy) {
    const taxonomy = await db.taxonomy.create({
      data: {
        phylum: body.taxonomy.phylum,
        class: body.taxonomy.class,
        order: body.taxonomy.order,
        family: body.taxonomy.family,
        genus: body.taxonomy.genus,
      },
    });
    taxonomyId = taxonomy.id;
  }

  const species = await db.species.create({
    data: {
      slug: body.slug,
      genus: body.genus,
      speciesEpithet: body.speciesEpithet,
      scientificName: body.scientificName,
      commonNames: JSON.stringify(body.commonNames),
      ncbiTaxonomyId: body.ncbiTaxonomyId,
      taxonomyId,
      verificationStatus: "draft",
    },
  });

  return NextResponse.json(species, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id: string;
    scientificName?: string;
    commonNames?: string[];
    verificationStatus?: "draft" | "single_source" | "peer_reviewed" | "expert_verified";
    ncbiTaxonomyId?: string;
  };

  const species = await db.species.update({
    where: { id: body.id },
    data: {
      scientificName: body.scientificName,
      commonNames: body.commonNames ? JSON.stringify(body.commonNames) : undefined,
      verificationStatus: body.verificationStatus,
      ncbiTaxonomyId: body.ncbiTaxonomyId,
    },
  });

  return NextResponse.json(species);
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  await db.species.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
