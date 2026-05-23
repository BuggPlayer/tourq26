/**
 * Why-us research band (DESIGN.md → research-band-dark + research-card).
 * Polarity-flipped dark navy band with a 3-up grid of hairline-on-dark cards.
 * Each card has a mono eyebrow label, a display-md stat, and body copy.
 */

const reasons: { eyebrow: string; stat: string; title: string; description: string }[] = [
  {
    eyebrow: "COST DISCIPLINE",
    stat: "40%",
    title: "Lower spend, same senior bar",
    description:
      "Efficient delivery and remote talent free budget for product work — without trading away senior-engineer quality on the critical path.",
  },
  {
    eyebrow: "DELIVERY",
    stat: "100%",
    title: "On-time, milestone-checked",
    description:
      "Written scope, written acceptance criteria, weekly checkpoints. Finance and leadership see steady progress — not a status meeting.",
  },
  {
    eyebrow: "OWNERSHIP",
    stat: "1:1",
    title: "Engineers, not account layers",
    description:
      "You speak with the people writing and reviewing your code. Handover ships with READMEs and runbooks your team can audit.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="band-dark"
      aria-labelledby="why-us-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-[80px]">
        <header className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mono-eyebrow text-white/55">WHY TORQ STUDIO</p>
            <h2 id="why-us-heading" className="display-xl mt-4 text-white">
              Grounded in production work, not theatre.
            </h2>
          </div>
          <p className="text-[16px] leading-[1.5] text-white/65 lg:col-span-5 lg:self-end">
            Three things teams hear back from clients again and again — the same three
            things we optimise for from kickoff through hand-over.
          </p>
        </header>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((item) => (
            <li
              key={item.title}
              className="card-flat-on-dark card-hover flex h-full flex-col"
            >
              <p className="mono-eyebrow text-white/55">{item.eyebrow}</p>
              <p className="stat-number mt-6 text-[44px] leading-none text-white">
                {item.stat}
              </p>
              <h3 className="display-md mt-6 text-white">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
