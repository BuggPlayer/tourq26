import type { DevToolPublicBelowFold } from "@/lib/dev-tool-editorial";
import {
  DEV_TOOL_EDITORIAL_FAQ_ANSWER_CLASS,
  DEV_TOOL_EDITORIAL_GUIDE_INNER_CLASS,
} from "@/lib/dev-tool-editorial-body-class";

/** Divider-style FAQ: no outer card; one row per item (Stripe / Vercel–style). */
const detailsClass =
  "group border-0 [&_summary]:list-none [&_summary::-webkit-details-marker]:hidden";

const summaryClass =
  "flex w-full cursor-pointer items-start justify-between gap-3 rounded-lg px-2 py-4 text-left text-base font-medium text-foreground outline-none transition-colors " +
  "hover:bg-muted/30 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Admin-controlled guide (blog HTML) as expanded prose; FAQs use native `<details>` for crawlable Q&A.
 */
export function DevToolAccordionContent({ below }: { below: DevToolPublicBelowFold }) {
  const hasBlog = !!below.blogHtml?.trim();
  const structured = below.structuredFaq ?? [];
  const hasStructured = structured.length > 0;
  const hasLegacy = !!below.legacyFaqHtml?.trim();

  if (!hasBlog && !hasStructured && !hasLegacy) return null;

  return (
    <div className="mx-auto mt-14 max-w-4xl space-y-14 border-t border-border/40 pt-14 lg:mt-16 lg:space-y-16 lg:pt-16">
      {hasBlog ? (
        <section aria-labelledby="dev-tool-guide-heading">
          <h2
            id="dev-tool-guide-heading"
            className="font-display text-2xl font-bold tracking-tight text-foreground"
          >
            Guide
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            How to use this tool, examples, and related tips.
          </p>
          <div
            className={`mt-6 max-w-none ${DEV_TOOL_EDITORIAL_GUIDE_INNER_CLASS}`}
            dangerouslySetInnerHTML={{ __html: below.blogHtml! }}
          />
        </section>
      ) : null}

      {hasStructured || hasLegacy ? (
        <section aria-labelledby="dev-tool-faq-heading">
          <h2
            id="dev-tool-faq-heading"
            className="font-display text-2xl font-bold tracking-tight text-foreground"
          >
            FAQ
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Answers about this tool and how your data is handled.
          </p>
          <div className="mt-6 divide-y divide-border/40">
            {hasStructured
              ? structured.map((row, i) => (
                  <details key={row.id} className={detailsClass} open={i === 0}>
                    <summary className={summaryClass}>
                      <span className="pr-4">{row.question || `Question ${i + 1}`}</span>
                      <span
                        aria-hidden
                        className="mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="opacity-70">
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </summary>
                    <div
                      className={`pb-5 pl-2 pr-2 pt-0 sm:pl-2 sm:pr-2 ${DEV_TOOL_EDITORIAL_FAQ_ANSWER_CLASS}`}
                      dangerouslySetInnerHTML={{ __html: row.answerHtml }}
                    />
                  </details>
                ))
              : null}
            {hasLegacy ? (
              <details className={detailsClass} open={!hasStructured}>
                <summary className={summaryClass}>
                  <span className="pr-4">More help</span>
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="opacity-70">
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </summary>
                <div
                  className={`pb-5 pl-2 pr-2 pt-0 ${DEV_TOOL_EDITORIAL_FAQ_ANSWER_CLASS}`}
                  dangerouslySetInnerHTML={{ __html: below.legacyFaqHtml! }}
                />
              </details>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
