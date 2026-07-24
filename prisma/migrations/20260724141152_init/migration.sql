-- CreateTable
CREATE TABLE "taxonomies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kingdom" TEXT NOT NULL DEFAULT 'Fungi',
    "phylum" TEXT,
    "class" TEXT,
    "order" TEXT,
    "family" TEXT,
    "genus" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "species" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "genus" TEXT NOT NULL,
    "species_epithet" TEXT NOT NULL,
    "scientific_name" TEXT NOT NULL,
    "common_names" TEXT NOT NULL,
    "synonyms" TEXT,
    "mycobank_id" TEXT,
    "ncbi_taxonomy_id" TEXT,
    "index_fungorum_id" TEXT,
    "verification_status" TEXT NOT NULL DEFAULT 'draft',
    "fda_status" TEXT,
    "efsa_status" TEXT,
    "regulatory_notes" TEXT,
    "last_verified_at" DATETIME,
    "verified_by" TEXT,
    "confidence_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "taxonomy_id" TEXT,
    CONSTRAINT "species_taxonomy_id_fkey" FOREIGN KEY ("taxonomy_id") REFERENCES "taxonomies" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sensory_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "species_id" TEXT NOT NULL,
    "taste_axes" TEXT NOT NULL,
    "texture_axes" TEXT NOT NULL,
    "aroma_notes" TEXT,
    "meat_analog_potential" TEXT NOT NULL DEFAULT 'unknown',
    "meat_analog_rationale" TEXT,
    "preparation_context" TEXT,
    "verification_status" TEXT NOT NULL DEFAULT 'draft',
    "confidence_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "sensory_profiles_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "morphologies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "species_id" TEXT NOT NULL,
    "hyphal_type" TEXT NOT NULL DEFAULT 'unknown',
    "cell_wall_composition" TEXT,
    "fruiting_body_structure" TEXT,
    "spore_characteristics" TEXT,
    "microscopy_notes" TEXT,
    "verification_status" TEXT NOT NULL DEFAULT 'draft',
    "confidence_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "morphologies_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "nutrition_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "species_id" TEXT NOT NULL,
    "protein_percent" REAL,
    "fiber_percent" REAL,
    "fat_percent" REAL,
    "moisture_percent" REAL,
    "ash_percent" REAL,
    "amino_acids" TEXT,
    "amino_acid_basis" TEXT,
    "pdcaas" REAL,
    "diaas" REAL,
    "limiting_amino_acids" TEXT,
    "preparation_context" TEXT,
    "verification_status" TEXT NOT NULL DEFAULT 'draft',
    "confidence_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "nutrition_profiles_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "geographic_distributions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "species_id" TEXT NOT NULL,
    "native_range" TEXT,
    "cultivated_regions" TEXT,
    "habitat" TEXT,
    "gbif_url" TEXT,
    "verification_status" TEXT NOT NULL DEFAULT 'draft',
    "confidence_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "geographic_distributions_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "culture_collection_strains" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "species_id" TEXT NOT NULL,
    "collection_name" TEXT NOT NULL,
    "strain_id" TEXT NOT NULL,
    "catalog_url" TEXT NOT NULL,
    "availability_notes" TEXT,
    "verification_status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "culture_collection_strains_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "species_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "species_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "license" TEXT,
    "attribution_text" TEXT,
    "source_url" TEXT,
    "image_category" TEXT NOT NULL DEFAULT 'other',
    "verification_status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "species_images_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "commercial_applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "species_id" TEXT NOT NULL,
    "meat_alternative_use" BOOLEAN NOT NULL DEFAULT false,
    "application_summary" TEXT NOT NULL,
    "commercial_status" TEXT NOT NULL DEFAULT 'none',
    "companies" TEXT NOT NULL DEFAULT '[]',
    "production_process" TEXT NOT NULL DEFAULT '[]',
    "verification_status" TEXT NOT NULL DEFAULT 'draft',
    "confidence_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "commercial_applications_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "morphology_models_3d" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "species_id" TEXT NOT NULL,
    "file_url" TEXT,
    "thumbnail_url" TEXT,
    "source_type" TEXT NOT NULL DEFAULT 'parametric',
    "license" TEXT,
    "attribution_text" TEXT,
    "parameters" TEXT NOT NULL,
    "verification_status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "morphology_models_3d_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "citations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "doi" TEXT,
    "pmid" TEXT,
    "patent_number" TEXT,
    "url" TEXT,
    "title" TEXT NOT NULL,
    "authors" TEXT,
    "year" INTEGER,
    "journal" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "citation_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citation_id" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "notes" TEXT,
    "species_id" TEXT,
    "sensory_profile_id" TEXT,
    "nutrition_profile_id" TEXT,
    "species_image_id" TEXT,
    "morphology_model_3d_id" TEXT,
    "commercial_application_id" TEXT,
    CONSTRAINT "citation_links_citation_id_fkey" FOREIGN KEY ("citation_id") REFERENCES "citations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "citation_links_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "citation_links_sensory_profile_id_fkey" FOREIGN KEY ("sensory_profile_id") REFERENCES "sensory_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "citation_links_nutrition_profile_id_fkey" FOREIGN KEY ("nutrition_profile_id") REFERENCES "nutrition_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "citation_links_species_image_id_fkey" FOREIGN KEY ("species_image_id") REFERENCES "species_images" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "citation_links_morphology_model_3d_id_fkey" FOREIGN KEY ("morphology_model_3d_id") REFERENCES "morphology_models_3d" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "citation_links_commercial_application_id_fkey" FOREIGN KEY ("commercial_application_id") REFERENCES "commercial_applications" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "alt_protein_research_highlights" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "species_id" TEXT NOT NULL,
    "spotlight_month" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT,
    "journal" TEXT,
    "year" INTEGER,
    "doi" TEXT,
    "url" TEXT,
    "summary" TEXT NOT NULL,
    "published_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "alt_protein_research_highlights_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "species_slug_key" ON "species"("slug");

-- CreateIndex
CREATE INDEX "species_genus_idx" ON "species"("genus");

-- CreateIndex
CREATE INDEX "species_scientific_name_idx" ON "species"("scientific_name");

-- CreateIndex
CREATE INDEX "alt_protein_research_highlights_species_id_spotlight_month_idx" ON "alt_protein_research_highlights"("species_id", "spotlight_month");
