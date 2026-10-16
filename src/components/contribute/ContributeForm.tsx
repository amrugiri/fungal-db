"use client";

import { useState } from "react";
import {
  COMMERCIAL_STATUSES,
  CONSUMPTION_FORMS,
  MEAT_ANALOG_POTENTIALS,
  MEAT_ANALOG_USE,
  PROOF_TYPES,
  SENSORY_CHARACTERISTICS,
  SENSORY_EVIDENCE_KINDS,
  SENSORY_METHODS,
  SENSORY_UNITS,
  emptySensoryRow,
  sensoryRowHasData,
  type ContributeSpeciesOption,
  type SensoryRowInput,
} from "@/lib/contribute-options";

const fieldClass =
  "h-10 w-full appearance-none rounded-xl border-2 border-gold bg-cream px-3 py-2 font-sans text-sm font-medium text-truffle outline-none transition-colors placeholder:text-muted/70 hover:border-berry focus:border-berry focus:bg-surface";
const textAreaClass =
  "min-h-24 w-full rounded-xl border-2 border-gold bg-cream px-3 py-2 font-sans text-sm text-truffle outline-none transition-colors placeholder:text-muted/70 hover:border-berry focus:border-berry focus:bg-surface";
const labelClass = "mb-1 block font-sans text-sm font-semibold text-truffle";

type ContributeFormProps = {
  species: ContributeSpeciesOption[];
};

function SelectField({
  id,
  label,
  required,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </label>
      <select
        id={id}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      >
        {options.map((option) => (
          <option key={option.value || `${id}-empty`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ContributeForm({ species }: ContributeFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [speciesSlug, setSpeciesSlug] = useState("");
  const [sensoryRows, setSensoryRows] = useState<SensoryRowInput[]>([
    emptySensoryRow(),
    emptySensoryRow(),
  ]);
  const [meatAnalogPotential, setMeatAnalogPotential] = useState("");
  const [meatAnalogUse, setMeatAnalogUse] = useState("");
  const [commercialStatus, setCommercialStatus] = useState("");
  const [consumptionForm, setConsumptionForm] = useState("");
  const [applicationNotes, setApplicationNotes] = useState("");
  const [companyProduct, setCompanyProduct] = useState("");
  const [productionNotes, setProductionNotes] = useState("");
  const [proofType, setProofType] = useState("");
  const [doi, setDoi] = useState("");
  const [citation, setCitation] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function updateRow(index: number, patch: Partial<SensoryRowInput>) {
    setSensoryRows((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("proofFiles");
    const files = fileInput instanceof HTMLInputElement ? Array.from(fileInput.files ?? []) : [];

    if (!name.trim() || !email.trim() || !speciesSlug) {
      setStatus("error");
      setMessage("Name, email, and species are required.");
      return;
    }
    if (!doi.trim() && !citation.trim() && !sourceUrl.trim() && files.length === 0) {
      setStatus("error");
      setMessage("Attach proof: a DOI, citation, URL, or image/PDF of the source.");
      return;
    }

    const filledSensory = sensoryRows.filter(sensoryRowHasData);
    const hasAltProtein = Boolean(
      meatAnalogPotential ||
        meatAnalogUse ||
        commercialStatus ||
        consumptionForm ||
        applicationNotes.trim() ||
        companyProduct.trim() ||
        productionNotes.trim() ||
        additionalNotes.trim(),
    );
    if (filledSensory.length === 0 && !hasAltProtein) {
      setStatus("error");
      setMessage("Add at least one sensory or alt-protein field before submitting.");
      return;
    }

    const body = new FormData();
    body.set("name", name.trim());
    body.set("email", email.trim());
    body.set("speciesSlug", speciesSlug);
    body.set("sensoryRows", JSON.stringify(filledSensory));
    body.set("meatAnalogPotential", meatAnalogPotential);
    body.set("meatAnalogUse", meatAnalogUse);
    body.set("commercialStatus", commercialStatus);
    body.set("consumptionForm", consumptionForm);
    body.set("applicationNotes", applicationNotes.trim());
    body.set("companyProduct", companyProduct.trim());
    body.set("productionNotes", productionNotes.trim());
    body.set("proofType", proofType);
    body.set("doi", doi.trim());
    body.set("citation", citation.trim());
    body.set("sourceUrl", sourceUrl.trim());
    body.set("additionalNotes", additionalNotes.trim());
    for (const file of files) body.append("proofFiles", file);

    setStatus("submitting");
    setMessage("");
    const response = await fetch("/api/contribute", { method: "POST", body });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error ?? "Submission failed. Try again.");
      return;
    }
    setStatus("success");
    setMessage(
      "Thank you. Your submission was emailed to the MycoProt admin for review. Nothing is published until it is checked against the source. We will follow up at this email if we have questions.",
    );
    form.reset();
    setName("");
    setEmail("");
    setSpeciesSlug("");
    setSensoryRows([emptySensoryRow(), emptySensoryRow()]);
    setMeatAnalogPotential("");
    setMeatAnalogUse("");
    setCommercialStatus("");
    setConsumptionForm("");
    setApplicationNotes("");
    setCompanyProduct("");
    setProductionNotes("");
    setProofType("");
    setDoi("");
    setCitation("");
    setSourceUrl("");
    setAdditionalNotes("");
  }

  return (
    <form className="space-y-10" onSubmit={onSubmit}>
      <section className="space-y-4">
        <h2 className="font-sans text-lg font-semibold text-truffle">Your details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="contributor-name">
              Name *
            </label>
            <input
              id="contributor-name"
              name="name"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="contributor-email">
              Email *
            </label>
            <input
              id="contributor-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClass}
            />
          </div>
        </div>
        <SelectField
          id="species"
          label="Species"
          required
          value={speciesSlug}
          onChange={setSpeciesSlug}
          options={[
            { value: "", label: "Select species" },
            ...species.map((item) => ({
              value: item.slug,
              label: item.scientificName,
            })),
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-semibold text-truffle">Sensory</h2>
        <p className="text-sm text-black">
          One published measurement per row. Do not convert chemistry into a 0–5 bar unless the
          paper used that scale. Leave unused rows blank.
        </p>
        {sensoryRows.map((row, index) => (
          <fieldset
            key={index}
            className="grid gap-4 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-2"
          >
            <legend className="px-1 font-sans text-sm font-semibold text-truffle">
              Sensory measurement {index + 1}
            </legend>
            <SelectField
              id={`characteristic-${index}`}
              label="Characteristic"
              value={row.characteristic}
              onChange={(value) => updateRow(index, { characteristic: value })}
              options={SENSORY_CHARACTERISTICS}
            />
            <SelectField
              id={`evidence-${index}`}
              label="Evidence type"
              value={row.evidenceKind}
              onChange={(value) => updateRow(index, { evidenceKind: value })}
              options={SENSORY_EVIDENCE_KINDS}
            />
            <div>
              <label className={labelClass} htmlFor={`value-${index}`}>
                Reported value
              </label>
              <input
                id={`value-${index}`}
                value={row.value}
                onChange={(event) => updateRow(index, { value: event.target.value })}
                className={fieldClass}
                placeholder="e.g. 7.06 or 4.2"
              />
            </div>
            <SelectField
              id={`unit-${index}`}
              label="Unit"
              value={row.unit}
              onChange={(value) => updateRow(index, { unit: value })}
              options={SENSORY_UNITS}
            />
            <SelectField
              id={`method-${index}`}
              label="Method"
              value={row.method}
              onChange={(value) => updateRow(index, { method: value })}
              options={SENSORY_METHODS}
            />
            <div>
              <label className={labelClass} htmlFor={`sample-${index}`}>
                Sample
              </label>
              <input
                id={`sample-${index}`}
                value={row.sample}
                onChange={(event) => updateRow(index, { sample: event.target.value })}
                className={fieldClass}
                placeholder="e.g. freeze-dried fruiting bodies, strain, country"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor={`sensory-notes-${index}`}>
                Notes for this measurement
              </label>
              <input
                id={`sensory-notes-${index}`}
                value={row.notes}
                onChange={(event) => updateRow(index, { notes: event.target.value })}
                className={fieldClass}
                placeholder="Table number, strain, wet vs dry basis"
              />
            </div>
          </fieldset>
        ))}
        <button
          type="button"
          className="font-sans text-sm font-semibold text-berry hover:underline"
          onClick={() => setSensoryRows((rows) => [...rows, emptySensoryRow()])}
        >
          Add another sensory measurement
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-semibold text-truffle">Alt-protein usage</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="meat-analog-potential"
            label="Meat analog potential"
            value={meatAnalogPotential}
            onChange={setMeatAnalogPotential}
            options={MEAT_ANALOG_POTENTIALS}
          />
          <SelectField
            id="meat-analog-use"
            label="Meat-analog usage"
            value={meatAnalogUse}
            onChange={setMeatAnalogUse}
            options={MEAT_ANALOG_USE}
          />
          <SelectField
            id="commercial-status"
            label="Commercial status"
            value={commercialStatus}
            onChange={setCommercialStatus}
            options={COMMERCIAL_STATUSES}
          />
          <SelectField
            id="consumption-form"
            label="Consumption form"
            value={consumptionForm}
            onChange={setConsumptionForm}
            options={CONSUMPTION_FORMS}
          />
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="company-product">
              Company or product
            </label>
            <input
              id="company-product"
              value={companyProduct}
              onChange={(event) => setCompanyProduct(event.target.value)}
              className={fieldClass}
              placeholder="e.g. Quorn pieces; Nature’s Fynd Fy Protein"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="application-notes">
              Application notes
            </label>
            <textarea
              id="application-notes"
              value={applicationNotes}
              onChange={(event) => setApplicationNotes(event.target.value)}
              className={textAreaClass}
              placeholder="How this species is used in meat analogs, hybrids, or fermented foods"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="production-notes">
              Production notes
            </label>
            <textarea
              id="production-notes"
              value={productionNotes}
              onChange={(event) => setProductionNotes(event.target.value)}
              className={textAreaClass}
              placeholder="Submerged fermentation, solid-state, fruiting-body crop, strain IDs"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-semibold text-truffle">Proof</h2>
        <p className="text-sm text-black">
          A DOI, full citation, URL, or a screenshot/PDF of the table is required. Submissions
          without a source are not reviewed.
        </p>
        <SelectField
          id="proof-type"
          label="What is the source?"
          value={proofType}
          onChange={setProofType}
          options={PROOF_TYPES}
        />
        <div>
          <label className={labelClass} htmlFor="doi">
            DOI
          </label>
          <input
            id="doi"
            value={doi}
            onChange={(event) => setDoi(event.target.value)}
            className={fieldClass}
            placeholder="10.1016/j.foodchem.2015.07.113"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="citation">
            Citation
          </label>
          <textarea
            id="citation"
            value={citation}
            onChange={(event) => setCitation(event.target.value)}
            className={textAreaClass}
            placeholder="Author, year, title, journal"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="source-url">
            Source URL
          </label>
          <input
            id="source-url"
            type="url"
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            className={fieldClass}
            placeholder="https://"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="proof-files">
            Images or PDFs of the table / figure
          </label>
          <input
            id="proof-files"
            name="proofFiles"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            multiple
            className="block w-full font-sans text-sm text-truffle file:mr-3 file:rounded-xl file:border-2 file:border-gold file:bg-cream file:px-3 file:py-2 file:font-sans file:text-sm file:font-semibold file:text-truffle hover:file:border-berry"
          />
          <p className="mt-1 text-xs text-muted">Up to 4 files, 1.2 MB each. PDF or image.</p>
        </div>
        <div>
          <label className={labelClass} htmlFor="additional-notes">
            Anything else the reviewer should know
          </label>
          <textarea
            id="additional-notes"
            value={additionalNotes}
            onChange={(event) => setAdditionalNotes(event.target.value)}
            className={textAreaClass}
          />
        </div>
      </section>

      {message ? (
        <p className={`text-sm ${status === "error" ? "text-berry" : "text-truffle"}`}>{message}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-xl bg-berry px-5 py-2.5 font-sans text-sm font-semibold text-cream hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Submit for review"}
      </button>
    </form>
  );
}
