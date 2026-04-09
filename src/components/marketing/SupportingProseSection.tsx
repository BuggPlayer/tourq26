/**
 * Visible, crawlable body copy to improve text-to-HTML ratio on marketing pages.
 * Each call site should use unique paragraphs (avoid sitewide duplicate blocks).
 */
export function SupportingProseSection({
  id,
  heading,
  paragraphs,
  className = "",
}: {
  id: string;
  heading: string;
  paragraphs: string[];
  className?: string;
}) {
  return (
    <section
      className={`border-t border-border/40 ${className}`.trim()}
      aria-labelledby={id}
    >
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <h2 id={id} className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {heading}
        </h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
