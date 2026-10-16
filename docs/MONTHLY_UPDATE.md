# Monthly living-resource update

Run this on the first of each month so MycoProt stays current.

## What “living” means

1. **New species** — add a fungus only when it is food-relevant (cultivated edible, fermentation ingredient, or mycoprotein/SCP) and you have citable sources.
2. **Existing pages** — fill empty nutrition, sensory, regulatory, commercial, and research fields when a new primary paper states a number. Refresh a filled field only when the new paper supersedes it.
3. **Do not auto-write facts** — the scan only proposes papers. Copy values from tables. Leave a field empty if the paper does not state it. Do not restore curator 0–5 bars or mix wet- and dry-weight nutrition.

Alerts go to **amruthagirivasan@gmail.com** (GitHub issue assignee + optional Gmail if `GMAIL_APP_PASSWORD` is set) and should be opened as a review, not a silent merge.

Expert submissions from `/contribute` arrive by the same email and are reviewed the same way: source first, then copy.

## Automated scan

```bash
npm run monthly:scan -- --since-days 35 --out docs/reports/monthly-latest.md
```

A GitHub Action (`.github/workflows/monthly-update.yml`) runs this on the 1st of each month and opens an issue with the report.

## Curator steps

1. Open the issue or the markdown report.
2. For each species with hits, read the paper. If it fills an empty number or claim, update `prisma/seed/species/<slug>.json` or `prisma/seed/scientific-audit.ts` and add a citation in `prisma/seed/citations.ts`.
3. If a new commercial or research mycoprotein organism appears (new *Fusarium* food strain, new Pekilo-style process, new cultivated mushroom used as analog), scaffold it:

```bash
npm run species:scaffold -- --genus "Genus" --epithet "epithet" --common-names "name" --type fermentation
# edit the JSON, then:
npm run species:add -- --slug genus-epithet --full-reseed
```

4. Copy the seeded SQLite snapshot used in production:

```bash
npm run db:seed
cp dev.db data/fungal.db   # if DATABASE_URL is file:./dev.db
```

5. Deploy so species pages update.

## Scope reminder

Skip purely culinary wild mushrooms, medicinal-only polypores, and industrial enzyme fungi unless they have documented food-protein or analog use.
