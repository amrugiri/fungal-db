# Adding a new species

Use the CLI to scaffold a **full species bundle** (same richness as seeded species) and load it into the database.

## 1. Scaffold from admin-style fields

```bash
cd fungal-db

npm run species:scaffold -- \
  --genus "Hericium" \
  --epithet "coralloides" \
  --common-names "coral tooth mushroom" \
  --type mushroom
```

Or from a minimal JSON file:

```bash
npm run species:scaffold -- --input prisma/seed/input/example-minimal.json
```

This writes `prisma/seed/species/<slug>.json` with sensory, nutrition, amino acids, production process, images, 3D morphology, commercial use, geography, strains, regulatory info, and research highlights.

NCBI taxonomy is fetched automatically when possible.

### Cultivation types (`--type`)

| Type | Use for |
|------|---------|
| `mushroom` | Bag/block cultivated basidiomycetes (default) |
| `compost_mushroom` | Compost-grown species |
| `fermentation` | Submerged mycoprotein |
| `tempeh` | Rhizopus-style solid fermentation |
| `koji` | Aspergillus koji |

## 2. Review and edit

Open `prisma/seed/species/<slug>.json` and replace placeholders (image URL, strain IDs, research DOIs, cited nutrition values).

## 3. Add to database

```bash
npm run species:add -- --slug <slug>
```

Page goes live at `/species/<slug>`.

Options: `--no-db` (JSON only), `--full-reseed` (rebuild entire DB).

## Admin page vs CLI

The admin UI (`/admin`) only creates a sparse record. Use `species:scaffold` + `species:add` for a full page like the existing 19 species.
