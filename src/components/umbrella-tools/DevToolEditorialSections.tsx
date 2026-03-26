import { DEV_TOOL_EDITORIAL_BODY_CLASS } from "@/lib/dev-tool-editorial-body-class";

/** @deprecated Prefer `DevToolAccordionContent` — kept for any direct HTML FAQ usage. */
export function DevToolEditorialSections({ html }: { html: string }) {
  return (
    <div className="mx-auto mt-14 max-w-4xl border-t border-border/40 pt-14 lg:mt-16 lg:pt-16">
      <section aria-labelledby="dev-tool-public-faq-heading">
        <h2
          id="dev-tool-public-faq-heading"
          className="font-display text-2xl font-bold tracking-tight text-foreground"
        >
          FAQ
        </h2>
        <div className={DEV_TOOL_EDITORIAL_BODY_CLASS} dangerouslySetInnerHTML={{ __html: html }} />
      </section>
    </div>
  );
}
