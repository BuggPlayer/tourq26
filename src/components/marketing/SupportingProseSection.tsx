/**
 * Visible, crawlable body copy for marketing pages (DESIGN.md → display sans
 * for narrative, mono eyebrow for section labels). Left-aligned text block
 * with hairline rules above and below; never centred.
 */
export function SupportingProseSection({
  id,
  eyebrow = "EDITORIAL",
  heading,
  paragraphs,
  className = "",
}: {
  id: string;
  /** Mono-caps eyebrow rendered above the heading. */
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  className?: string;
}) {
  return (
    <section
      className={`band-light border-t border-hairline ${className}`.trim()}
      aria-labelledby={id}
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="mono-eyebrow text-muted-foreground">{eyebrow}</p>
            <h2 id={id} className="display-lg mt-4 text-foreground">
              {heading}
            </h2>
          </div>
          <div className="space-y-4 text-[16px] leading-[1.6] text-muted-foreground lg:col-span-7 lg:max-w-[640px]">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
