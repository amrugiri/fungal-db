# Curation Guide

How to verify and add species to the Fungal Mycoprotein Database.

Every month, run the living-resource playbook in `docs/MONTHLY_UPDATE.md` (OpenAlex scan, copy new table values into empty fields, add new food / mycoprotein fungi).

## Principles

1. **Every factual claim needs a citation** — DOI, PMID, patent, or verified catalog URL.
2. **Never use Wikipedia as a primary source** — trace claims to journals, patents, or collection catalogs.
3. **Mark uncertainty** — use `unknown` for sparse data; document conflicts in `confidence_notes`.
4. **Verify external links** — culture collection URLs must resolve to the correct strain page.

## Verification status workflow

| Status | When to use |
|--------|-------------|
| `draft` | Initial entry, incomplete citations |
| `single_source` | One credible source only |
| `peer_reviewed` | Multiple peer-reviewed sources agree |
| `expert_verified` | Reviewed by domain expert curator |

## Adding a species (admin UI)

1. Log in at `/admin` with `ADMIN_PASSWORD`.
2. Use **NCBI Taxonomy Lookup** to fetch taxonomy ID and lineage from scientific name.
3. Create the species record with genus, epithet, common names, and taxonomic IDs.
4. Add related records: sensory profile, morphology, nutrition, distribution, strains, images.
5. For each non-trivial field, link a citation via DOI lookup (OpenAlex) or manual entry.
6. Set `verification_status` appropriately before publishing.

## DOI lookup

Paste a DOI in the admin helper. The app calls OpenAlex (`https://api.openalex.org/works/doi:...`) to fetch title, authors, year, and journal.

## NCBI taxonomy lookup

Enter a scientific name. The app calls NCBI E-utilities to fetch taxonomy ID and lineage (kingdom through genus).

## Citation types

- **journal** — peer-reviewed articles (prefer DOI)
- **review** — review articles
- **patent** — process or composition patents
- **book** — textbooks and handbooks
- **catalog** — culture collection strain pages
- **website** — taxonomic authorities (MycoBank, GBIF) — use sparingly

## Strict extraction (nutrition and sensory)

Keep the field empty until a number is copied from a paper. Do not fill gaps with typical-mushroom defaults or 0–5 guesses.

1. Open the paper (PDF or HTML). Confirm the species, sample (fresh/dry, fruiting body/biomass), and units.
2. Copy only values that appear in a table or sentence. Record table/figure, basis (g/100 g wet, % dry matter), and method (AOAC, HPLC, N factor).
3. If the paper names a compound but gives no number, add a `publishedEvidence` row without `value`/`unit`.
4. One paper, one basis. Do not mix wet-weight and dry-weight percentages in the same table.
5. Confirm the Crossref title matches the DOI before linking it.
6. For `meat_analog_potential`, cite a product or a process paper — not a scaffold score.

0–5 taste/texture axes stay empty unless a named panel protocol reports that scale.

## Images and 3D assets

- Only use CC-licensed or public domain images.
- Record license, attribution, and source URL in `SpeciesImage`.
- Parametric 3D models are generated from morphology metadata; uploaded GLB files need license metadata.

## Batch approval

When adding multiple species, prepare an approval packet:

1. Species summary (5–10 bullet facts)
2. Citations table (claim → source)
3. Uncertainties flagged
4. Science brief for food-science context

## Migrating to Supabase (PostgreSQL)

1. Create a Supabase project and copy the PostgreSQL connection string.
2. Update `DATABASE_URL` in production environment.
3. Change `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`.
4. Run `npx prisma migrate deploy`.
5. Re-run seed or export/import data.

SQLite is for local development only; production should use PostgreSQL for concurrent access and full-text search.
