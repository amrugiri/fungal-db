import { NextResponse } from "next/server";
import {
  sensoryRowHasData,
  type SensoryRowInput,
} from "@/lib/contribute-options";
import { adminNotifyEmail, sendAdminEmail } from "@/lib/mail";
import { getSpeciesCatalog } from "@/lib/species";

export const runtime = "nodejs";

const MAX_FILES = 4;
const MAX_FILE_BYTES = 1_200_000;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"];

function isAllowedProofFile(file: File): boolean {
  if (ALLOWED_TYPES.has(file.type)) return true;
  const name = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function field(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function row(label: string, value: string): string {
  if (!value) return "";
  return `<tr><th style="text-align:left;padding:6px 12px 6px 0;vertical-align:top;">${escapeHtml(label)}</th><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`;
}

function parseSensoryRows(raw: string): SensoryRowInput[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SensoryRowInput[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(sensoryRowHasData);
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read the form." }, { status: 400 });
  }

  const name = field(form, "name");
  const email = field(form, "email");
  const speciesSlug = field(form, "speciesSlug");
  const doi = field(form, "doi");
  const citation = field(form, "citation");
  const sourceUrl = field(form, "sourceUrl");
  const proofType = field(form, "proofType");
  const meatAnalogPotential = field(form, "meatAnalogPotential");
  const meatAnalogUse = field(form, "meatAnalogUse");
  const commercialStatus = field(form, "commercialStatus");
  const consumptionForm = field(form, "consumptionForm");
  const applicationNotes = field(form, "applicationNotes");
  const companyProduct = field(form, "companyProduct");
  const productionNotes = field(form, "productionNotes");
  const additionalNotes = field(form, "additionalNotes");
  const aromaNotes = field(form, "aromaNotes");
  const imageCategory = field(form, "imageCategory");
  const imageUrl = field(form, "imageUrl");
  const imageCaption = field(form, "imageCaption");
  const imageLicense = field(form, "imageLicense");
  const hyphalType = field(form, "hyphalType");
  const cellWall = field(form, "cellWall");
  const fruitingBody = field(form, "fruitingBody");
  const microscopyNotes = field(form, "microscopyNotes");
  const proteinPercent = field(form, "proteinPercent");
  const fiberPercent = field(form, "fiberPercent");
  const fatPercent = field(form, "fatPercent");
  const moisturePercent = field(form, "moisturePercent");
  const nutritionBasis = field(form, "nutritionBasis");
  const pdcaas = field(form, "pdcaas");
  const diaas = field(form, "diaas");
  const aminoAcidBasis = field(form, "aminoAcidBasis");
  const nutritionPrep = field(form, "nutritionPrep");
  const nativeRange = field(form, "nativeRange");
  const cultivatedRegions = field(form, "cultivatedRegions");
  const habitat = field(form, "habitat");
  const gbifUrl = field(form, "gbifUrl");
  const collectionName = field(form, "collectionName");
  const strainId = field(form, "strainId");
  const catalogUrl = field(form, "catalogUrl");
  const strainNotes = field(form, "strainNotes");
  const fdaStatus = field(form, "fdaStatus");
  const efsaStatus = field(form, "efsaStatus");
  const regulatoryNotes = field(form, "regulatoryNotes");
  const sensoryRows = parseSensoryRows(field(form, "sensoryRows"));
  const sectionValues = {
    meatAnalogPotential,
    meatAnalogUse,
    commercialStatus,
    consumptionForm,
    applicationNotes,
    companyProduct,
    productionNotes,
    additionalNotes,
    aromaNotes,
    imageCategory,
    imageUrl,
    imageCaption,
    imageLicense,
    hyphalType,
    cellWall,
    fruitingBody,
    microscopyNotes,
    proteinPercent,
    fiberPercent,
    fatPercent,
    moisturePercent,
    nutritionBasis,
    pdcaas,
    diaas,
    aminoAcidBasis,
    nutritionPrep,
    nativeRange,
    cultivatedRegions,
    habitat,
    gbifUrl,
    collectionName,
    strainId,
    catalogUrl,
    strainNotes,
    fdaStatus,
    efsaStatus,
    regulatoryNotes,
  };

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!speciesSlug) {
    return NextResponse.json({ error: "Select a species." }, { status: 400 });
  }

  const catalog = await getSpeciesCatalog();
  const species = catalog.find((item) => item.slug === speciesSlug);
  if (!species) {
    return NextResponse.json({ error: "Unknown species." }, { status: 400 });
  }

  const files = form
    .getAll("proofFiles")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Attach at most ${MAX_FILES} files.` }, { status: 400 });
  }
  for (const file of files) {
    if (!isAllowedProofFile(file)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.name}. Use PDF or an image.` },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `${file.name} is over 1.2 MB. Compress it or send a citation instead.` },
        { status: 400 },
      );
    }
  }

  const hasProof = Boolean(doi || citation || sourceUrl || files.length > 0);
  if (!hasProof) {
    return NextResponse.json(
      { error: "Attach proof: a DOI, citation, URL, or image/PDF of the source." },
      { status: 400 },
    );
  }

  const hasPayload =
    sensoryRows.length > 0 || Object.values(sectionValues).some((value) => value.length > 0);
  if (!hasPayload) {
    return NextResponse.json(
      { error: "Fill at least one species-page section before submitting." },
      { status: 400 },
    );
  }

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      contentType: file.type,
      content: Buffer.from(await file.arrayBuffer()),
    })),
  );

  const sensoryHtml = sensoryRows.length
    ? sensoryRows
        .map(
          (item, index) =>
            `<h3 style="margin:16px 0 8px;">Sensory row ${index + 1}</h3><table>${
              row("Characteristic", item.characteristic) +
              row("Evidence type", item.evidenceKind) +
              row("Value", item.value) +
              row("Unit", item.unit) +
              row("Method", item.method) +
              row("Sample", item.sample) +
              row("Notes", item.notes)
            }</table>`,
        )
        .join("")
    : "<p>No sensory rows.</p>";

  const html = `
    <p>A MycoProt contribution form was submitted for review. Nothing has been added to the database.</p>
    <table>
      ${row("Name", name)}
      ${row("Email", email)}
      ${row("Species", `${species.scientificName} (${species.slug})`)}
      ${row("Proof type", proofType)}
      ${row("DOI", doi)}
      ${row("Citation", citation)}
      ${row("Source URL", sourceUrl)}
      ${row("Attached files", attachments.map((file) => file.filename).join(", ") || "None")}
    </table>
    <h2>Images</h2>
    <table>
      ${row("Category", imageCategory)}
      ${row("URL", imageUrl)}
      ${row("Caption", imageCaption)}
      ${row("License", imageLicense)}
    </table>
    <h2>Sensory Profile</h2>
    ${sensoryHtml}
    <table>${row("Aroma", aromaNotes)}</table>
    <h2>Alternative Protein Usage</h2>
    <table>
      ${row("Meat analog potential", meatAnalogPotential)}
      ${row("Used in meat analogs", meatAnalogUse)}
      ${row("Commercial status", commercialStatus)}
      ${row("Consumption form", consumptionForm)}
      ${row("Company / product", companyProduct)}
      ${row("Application notes", applicationNotes)}
      ${row("Production process", productionNotes)}
    </table>
    <h2>Morphology</h2>
    <table>
      ${row("Hyphal type", hyphalType)}
      ${row("Cell wall", cellWall)}
      ${row("Fruiting body", fruitingBody)}
      ${row("Microscopy notes", microscopyNotes)}
    </table>
    <h2>Nutrition</h2>
    <table>
      ${row("Protein", proteinPercent)}
      ${row("Fiber", fiberPercent)}
      ${row("Fat", fatPercent)}
      ${row("Moisture", moisturePercent)}
      ${row("Proximate basis", nutritionBasis)}
      ${row("PDCAAS", pdcaas)}
      ${row("DIAAS", diaas)}
      ${row("Amino-acid basis", aminoAcidBasis)}
      ${row("Sample / preparation", nutritionPrep)}
    </table>
    <h2>Geographic Distribution</h2>
    <table>
      ${row("Native range", nativeRange)}
      ${row("Cultivated regions", cultivatedRegions)}
      ${row("Habitat", habitat)}
      ${row("GBIF URL", gbifUrl)}
    </table>
    <h2>Culture Collection Strains</h2>
    <table>
      ${row("Collection", collectionName)}
      ${row("Strain ID", strainId)}
      ${row("Catalog URL", catalogUrl)}
      ${row("Availability notes", strainNotes)}
    </table>
    <h2>Regulatory Status</h2>
    <table>
      ${row("FDA (US)", fdaStatus)}
      ${row("EFSA (EU)", efsaStatus)}
      ${row("Notes", regulatoryNotes)}
    </table>
    <h2>Additional notes</h2>
    <p>${escapeHtml(additionalNotes) || "None"}</p>
  `;

  const text = [
    `Contribution for ${species.scientificName}`,
    `From: ${name} <${email}>`,
    `DOI: ${doi || "—"}`,
    `Citation: ${citation || "—"}`,
    `URL: ${sourceUrl || "—"}`,
    `Files: ${attachments.map((file) => file.filename).join(", ") || "none"}`,
    "",
    JSON.stringify({ sensoryRows, ...sectionValues }, null, 2),
  ].join("\n");

  try {
    await sendAdminEmail({
      subject: `MycoProt contribution: ${species.scientificName} from ${name}`,
      html,
      text,
      replyTo: email,
      attachments,
    });
  } catch (error) {
    console.error("Contribute email failed", error);
    return NextResponse.json(
      { error: "The form was received but the admin email could not be sent. Try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    notify: adminNotifyEmail(),
  });
}
