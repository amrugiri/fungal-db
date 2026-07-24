const featureCards = [
  {
    label: "Alt-protein R&D",
    title: "Built for formulation teams",
    body: "Meat-analog potential, PDCAAS/DIAAS, regulatory status, and commercial use — mapped field by field.",
  },
  {
    label: "Sensory benchmarks",
    title: "Taste & texture axes",
    body: "Standardized 0–5 scales for umami, fibrous, chewy, and more — compare fungi like ingredient specs.",
  },
  {
    label: "Go-to-market context",
    title: "Process & products",
    body: "Production workflows, companies, and retail categories bridge bench science to shelf placement.",
  },
  {
    label: "3D morphology",
    title: "Interactive anatomy",
    body: "Rotatable fruiting-body models and hyphae schematics link structure to mouthfeel and processing.",
  },
  {
    label: "Evidence quality",
    title: "Citation transparency",
    body: "Peer-reviewed sources linked per field so R&D teams can judge evidence strength at a glance.",
  },
  {
    label: "Literature feed",
    title: "Monthly research highlights",
    body: "Curated alt-protein papers surfaced on each species page — no manual PubMed sweeps required.",
  },
];

export function DatabaseUniqueness() {
  return (
    <section className="mb-10">
      <p className="max-w-3xl text-lg font-medium leading-relaxed text-zinc-800">
        The citation-backed reference for fungal ingredients in alternative protein — from strain
        selection and sensory benchmarking to protein quality, morphology, and commercial positioning.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((card) => (
          <article
            key={card.title}
            className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-80" />
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {card.label}
            </p>
            <h3 className="mt-2 text-base font-bold text-black">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
