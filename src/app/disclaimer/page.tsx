export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-truffle">Disclaimer</h1>
      <div className="prose prose-neutral mt-6 space-y-4 font-sans text-sm leading-relaxed text-truffle">
        <p>
          The Fungal Mycoprotein Database is provided for <strong>research and educational
          purposes only</strong>. It is not intended to provide food safety, regulatory, medical,
          or nutritional advice.
        </p>
        <p>
          While we strive for citation-backed accuracy, data should be verified against primary
          literature before use in regulatory submissions, product development, or clinical
          decisions. Sensory scores and nutrition values may vary by strain, substrate, and
          preparation method.
        </p>
        <p>
          Edibility and regulatory status of fungal species depend on processing, geography,
          and local regulations. The presence of a species in this database does not constitute
          an endorsement for consumption.
        </p>
        <p>
          Images are used under their stated licenses (primarily Creative Commons). Parametric
          3D models are schematic representations, not anatomically exact reconstructions.
        </p>
        <p className="text-muted">
          Last updated: July 2026. For curation questions, see the admin interface and{" "}
          <code>docs/CURATION_GUIDE.md</code>.
        </p>
      </div>
    </div>
  );
}
