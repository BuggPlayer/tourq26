import type { DevToolHowToStep } from "@/lib/umbrella-tools/dev-tool-page-structure";

export function DevToolEditorialSections({
  features,
  howToSteps,
  benefits,
}: {
  features: string[];
  howToSteps: DevToolHowToStep[];
  benefits: string[];
}) {
  return (
    <div className="mt-10 min-w-0 space-y-12 border-t border-border/40 pt-10 sm:mt-12 sm:space-y-14 sm:pt-12">
      <section aria-labelledby="dev-tool-features-heading">
        <h2
          id="dev-tool-features-heading"
          className="font-display text-2xl font-bold tracking-tight text-foreground"
        >
          Features
        </h2>
        <ul className="mt-5 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="dev-tool-how-heading">
        <h2 id="dev-tool-how-heading" className="font-display text-2xl font-bold tracking-tight text-foreground">
          How to use
        </h2>
        <ol className="mt-5 list-decimal space-y-5 pl-5 text-sm leading-relaxed sm:text-base">
          {howToSteps.map((step, i) => (
            <li key={`${step.name}-${i}`} className="pl-1 marker:font-semibold marker:text-foreground">
              <span className="font-semibold text-foreground">{step.name}</span>
              <span className="mt-1 block font-normal text-muted-foreground">{step.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="dev-tool-benefits-heading">
        <h2 id="dev-tool-benefits-heading" className="font-display text-2xl font-bold tracking-tight text-foreground">
          Benefits
        </h2>
        <ul className="mt-5 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {benefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
