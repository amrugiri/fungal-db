# Mycology Primer for Food Scientists

You know microbiology and food science; fungi are **eukaryotic** (unlike bacteria) and often **filamentous**. This primer gives vocabulary for curating species in the database.

## Core structures

| Term | Definition | Food / mycoprotein relevance |
|------|------------|------------------------------|
| **Hypha** (pl. hyphae) | Thread-like fungal cell filament | Building block of mycelium; wall composition (chitin, glucans) affects texture |
| **Mycelium** | Mass of intertwined hyphae | What many mycoprotein products harvest; fibrous networks mimic meat texture when processed |
| **Septate vs coenocytic** | Septate hyphae have cross-walls; coenocytic are multinucleate tubes | Affects growth rate, fragmentation, and fermentation rheology |
| **Fruiting body** | Reproductive structure (mushroom) | What consumers often eat; different texture/nutrition than submerged mycelium |
| **Spore** | Reproductive cell | Not the food product; important for ID and taxonomy |
| **Substrate** | What the fungus grows on (grain, wood, broth) | Strongly affects sensory profile and nutrition |
| **Chitin** | Polysaccharide in fungal cell walls | Contributes to firmness; relevant when comparing bite to meat |

## Major groups in this database

| Group | Examples | Why they matter for alt protein |
|-------|----------|--------------------------------|
| **Filamentous ascomycetes** | *Fusarium venenatum*, *Aspergillus oryzae*, *Neurospora intermedia* | Industrial submerged fermentation; Quorn, koji, oncom |
| **Zygomycetes** | *Rhizopus oligosporus* | Tempeh — mycelium binds soy matrix |
| **Basidiomycetes** | *Pleurotus*, *Agaricus*, *Hericium*, *Lentinula* | Fruiting-body foods; texture-focused meat analog research |
| **Ustilaginomycetes** | *Ustilago maydis* | Corn smut; unique savory/umami niche product |

## Taxonomic hierarchy

Fungal names follow binomial nomenclature: **Genus species** (e.g. *Fusarium venenatum*). The database stores:

- **Kingdom** → Phylum → Class → Order → Family → Genus
- External IDs: MycoBank, Index Fungorum, NCBI Taxonomy

Always verify names against [MycoBank](https://www.mycobank.org) before publishing.

## Sensory science bridge

As a food scientist, you understand panels, intensity scales, and texture profiling. In the database:

- Store **structured scores** (0–5 on umami, chewiness, etc.) only when literature reports quantified data
- Record **methodology** in `confidence_notes` (trained panel? consumer test? n=?)
- Use `unknown` when literature only says "meaty texture" without quantification — do not invent numbers

## Processing and product forms

| Product | Organism | Process |
|---------|----------|---------|
| Quorn mycoprotein | *Fusarium venenatum* | Submerged fermentation, RNA reduction, texturization |
| Tempeh | *Rhizopus oligosporus* | Solid-state fermentation on soybeans |
| Koji | *Aspergillus oryzae* | Solid-state on rice/barley for enzyme production |
| Oncom | *Neurospora intermedia* | Fermented legume cake (West Java) |
| Fresh mushrooms | Various basidiomycetes | Cultivated fruiting bodies |

## Safety note

Edibility and regulatory status vary by species, strain, and processing. This database is for research and education — not food safety or regulatory approval guidance.

## Recommended reading

- Reviews on mycoprotein and *Fusarium venenatum* (PubMed: "mycoprotein review")
- Quorn patents (texture formation, RNA reduction)
- FAO/WHO edible fungi reports for consumption context
- Taxonomic authority: MycoBank, Index Fungorum, NCBI Taxonomy
