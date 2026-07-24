# Glossary — Fungal Mycoprotein Database

Living reference for coding, database, and mycology terms used in this project. Updated as features are added.

## Web and app basics

| Term | Definition |
|------|------------|
| **Browser** | Chrome, Safari, Firefox, etc. — where users view the database website |
| **Frontend** | Everything the user sees and clicks (pages, tables, 3D viewer) |
| **Backend** | Server-side logic: fetch data from the database, validate inputs, hide secrets |
| **Full-stack** | An app with both frontend and backend (Next.js does both in one project) |
| **localhost** | Your own computer acting as a temporary server; `localhost:3000` = open the app locally |
| **API** | A structured way for programs to request data (e.g. `/api/species`) |
| **Deploy** | Put the app on the internet so others can use it (e.g. Vercel) |

## Languages and file types

| Term | Definition |
|------|------------|
| **TypeScript (TS)** | JavaScript with type labels; fewer silent bugs |
| **JSON** | Text format for structured data like `{"umami": 4, "bitter": 1}` |
| **`.tsx` file** | TypeScript + React UI components (pages and widgets) |
| **`.prisma` file** | Blueprint describing database tables and relationships |

## Frameworks and tools

| Term | Definition |
|------|------------|
| **Next.js** | React framework for websites; handles routing, server logic, deployment |
| **React** | Library for building UI from reusable **components** |
| **Component** | A reusable UI piece — like a function that returns visual output |
| **npm** | Node Package Manager — installs libraries (`npm install`) |
| **Prisma** | ORM — talk to the database using TypeScript instead of raw SQL |
| **TanStack Table** | Library for sortable, filterable data grids |
| **Tailwind CSS** | Utility-first CSS framework for styling via class names |

## Database concepts

| Term | Definition |
|------|------------|
| **Database** | Organized, persistent storage — linked tables many apps can query |
| **SQLite** | Lightweight file-based relational database (local development) |
| **PostgreSQL** | Production-grade relational database (Supabase migration target) |
| **Table** | One entity type (e.g. `Species`, `Citation`) |
| **Row / record** | One entry (e.g. one fungus species) |
| **Schema** | Design of all tables and how they connect |
| **Migration** | Versioned change to the schema |
| **Seed data** | Initial rows loaded for development (MVP species) |
| **ORM** | Object-Relational Mapping — Prisma maps TypeScript to SQL |

## Data and verification

| Term | Definition |
|------|------------|
| **Citation / provenance** | Record of where a fact came from (DOI, patent, catalog page) |
| **DOI** | Digital Object Identifier — permanent link ID for journal papers |
| **PMID** | PubMed ID — index for biomedical literature |
| **Verification status** | Confidence in a record: `draft` → `single_source` → `peer_reviewed` → `expert_verified` |
| **CRUD** | Create, Read, Update, Delete — basic data operations |

## Mycology (food science context)

| Term | Definition |
|------|------------|
| **Hypha** | Thread-like fungal cell filament; building block of mycelium |
| **Mycelium** | Mass of intertwined hyphae; harvested for mycoprotein products |
| **Fruiting body** | Reproductive structure (mushroom) |
| **Mycoprotein** | Protein-rich fungal biomass used as food (e.g. Quorn from *Fusarium venenatum*) |
| **Substrate** | What the fungus grows on (grain, wood, broth) |
| **Chitin** | Polysaccharide in fungal cell walls; affects firmness and bite |

## 3D visualization

| Term | Definition |
|------|------------|
| **Three.js** | JavaScript library for 3D graphics in the browser |
| **React Three Fiber** | React wrapper around Three.js |
| **Parametric model** | 3D shape generated from parameters (hyphae angle, cap size) rather than a scanned mesh |
| **GLB / GLTF** | Common 3D model file formats |
