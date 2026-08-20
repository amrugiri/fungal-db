const featureCards = [
  {
    label: "Alt-protein R&D",
    title: "Built for formulation teams",
    body: "Meat-analog potential, PDCAAS/DIAAS, regulatory status, and commercial use, mapped field by field.",
    shape: "rounded-3xl",
    tone: "bg-gold/40 border-gold text-truffle",
    labelTone: "text-truffle/80",
  },
  {
    label: "Sensory benchmarks",
    title: "Taste & texture axes",
    body: "0–5 scales for umami, fibrous, chewy, and related traits, so you can compare fungi the way you would ingredient specs.",
    shape: "rounded-[2rem]",
    tone: "bg-berry/20 border-berry/50 text-truffle",
    labelTone: "text-berry",
  },
  {
    label: "Go-to-market context",
    title: "Process & products",
    body: "Production steps, companies, and product categories that connect lab work to what ends up on shelf.",
    shape: "rounded-2xl",
    tone: "bg-sage/40 border-sage text-truffle",
    labelTone: "text-truffle/80",
  },
  {
    label: "3D morphology",
    title: "Interactive anatomy",
    body: "Rotatable fruiting-body models and hyphae views that tie structure to texture and how the biomass processes.",
    shape: "rounded-[1.75rem]",
    tone: "bg-truffle text-cream border-truffle",
    labelTone: "text-gold",
  },
  {
    label: "Evidence quality",
    title: "Citation transparency",
    body: "Peer-reviewed sources linked to each field, so you can see how strong the backing is before you rely on a value.",
    shape: "rounded-3xl",
    tone: "bg-surface border-gold text-truffle",
    labelTone: "text-sage",
  },
  {
    label: "Literature feed",
    title: "Monthly research highlights",
    body: "Recent alt-protein papers collected on each species page, without digging through PubMed yourself.",
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
          A citation-backed reference for fungal ingredients in alternative protein, covering
          strain selection, sensory data, protein quality, morphology, and commercial use.
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
