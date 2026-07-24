# Fungal Mycoprotein Database

A curated scientific knowledge base for fungal mycoprotein and edible fungi species, with citation-backed sensory profiles, nutrition data, morphology, and culture collection links.

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
cd fungal-db
npm install
cp .env.example .env   # or use existing .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed 19 MVP species with citations |
| `npm run db:reset` | Reset database and re-seed |

## Environment variables

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="your-secure-password"
```

## Features

- **Species grid** — sortable, filterable table (genus, meat analog potential, taste/texture tags, verification status)
- **Species detail** — taxonomy, images, sensory charts, 3D morphology viewer, nutrition with citations
- **Compare** — side-by-side comparison of 2–4 species with CSV export
- **Search** — full-text on scientific name, common names, genus
- **Admin** — password-protected CRUD, DOI lookup (OpenAlex), NCBI taxonomy helper

## Database

Local development uses **SQLite** (`file:./dev.db`). For production, migrate to **PostgreSQL** via Supabase:

1. Create a Supabase project
2. Set `DATABASE_URL` to the PostgreSQL connection string
3. Change `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`
4. Update `src/lib/db.ts` to use `@prisma/adapter-pg` instead of `better-sqlite3`
5. Run `npx prisma migrate deploy`

## Deploy to Vercel

1. Push the repo to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables: `DATABASE_URL` (PostgreSQL), `ADMIN_PASSWORD`
4. Use Supabase or Neon for production PostgreSQL — SQLite is not suitable for Vercel serverless
5. Deploy

```bash
npm run build   # verify locally first
```

## Documentation

- `docs/GLOSSARY.md` — coding and mycology terms
- `docs/MYCOLOGY_PRIMER.md` — fungi basics for food scientists
- `docs/CURATION_GUIDE.md` — how to verify and add species

## Disclaimer

This database is for research and education only — not food safety or regulatory guidance. See `/disclaimer`.
