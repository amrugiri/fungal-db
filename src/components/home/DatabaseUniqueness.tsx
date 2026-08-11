const featureCards = [
  {
    label: "Alt-protein R&D",
    title: "Built for formulation teams",
    body: "Meat-analog potential, PDCAAS/DIAAS, regulatory status, and commercial use — mapped field by field.",
    shape: "rounded-3xl",
    tone: "bg-gold/40 border-gold text-truffle",
    labelTone: "text-truffle/80",
  },
  {
    label: "Sensory benchmarks",
    title: "Taste & texture axes",
    body: "Standardized 0–5 scales for umami, fibrous, chewy, and more — compare fungi like ingredient specs.",
    shape: "rounded-[2rem]",
    tone: "bg-berry/20 border-berry/50 text-truffle",
    labelTone: "text-berry",
  },
  {
    label: "Go-to-market context",
    title: "Process & products",
    body: "Production workflows, companies, and retail categories bridge bench science to shelf placement.",
    shape: "rounded-2xl",
    tone: "bg-sage/40 border-sage text-truffle",
    labelTone: "text-truffle/80",
  },
  {
    label: "3D morphology",
    title: "Interactive anatomy",
    body: "Rotatable fruiting-body models and hyphae schematics link structure to mouthfeel and processing.",
    shape: "rounded-[1.75rem]",
    tone: "bg-truffle text-cream border-truffle",
    labelTone: "text-gold",
  },
  {
    label: "Evidence quality",
    title: "Citation transparency",
    body: "Peer-reviewed sources linked per field so R&D teams can judge evidence strength at a glance.",
    shape: "rounded-3xl",
    tone: "bg-surface border-gold text-truffle",
    labelTone: "text-sage",
  },
  {
    label: "Literature feed",
    title: "Monthly research highlights",
    body: "Curated alt-protein papers surfaced on each species page — no manual PubMed sweeps required.",
    shape: "rounded-[2.25rem]",
    tone: "bg-gold text-truffle border-truffle/20",
    labelTone: "text-truffle/70",
  },
] as const;

export function DatabaseUniqueness() {
  return (
    <section className="mb-10">
      <div className="max-w-3xl rounded-2xl border border-border/50 bg-cream px-5 py-4 sm:px-6">
        <p className="font-sans text-lg font-medium leading-relaxed text-truffle">
          The citation-backed reference for fungal ingredients in alternative protein — from
          strain selection and sensory benchmarking to protein quality, morphology, and commercial
          positioning.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((card) => (
          <article
            key={card.title}
            className={`feature-card group relative border-2 p-5 transition-transform duration-200 ease-out hover:z-10 hover:scale-105 ${card.shape} ${card.tone}`}
          >
            <p
              className={`font-sans text-xs font-semibold uppercase tracking-wider ${card.labelTone}`}
            >
              {card.label}
            </p>
            <h3 className="mt-2 font-display text-xl font-bold leading-snug">
              {card.title}
            </h3>
            <p className="mt-2 font-sans text-sm leading-relaxed opacity-90">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
