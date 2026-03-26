import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

export type DevToolPageShellProps = {
  /** Registry slug — must exist in `UMBRELLA_TOOLS` for metadata. */
  slug: string;
  children: React.ReactNode;
  /**
   * When `true` (default), wraps `children` in a landmark section with heading “Try it”.
   * Set `false` for long-form pages that define their own sections (e.g. JSON formatter, slug generator).
   */
  showTryHeading?: boolean;
  /** Overrides the default “Try it” heading. */
  tryHeading?: string;
};

/**
 * Standard shell for `/dev-tools/[slug]` tools: `<article>`, {@link ToolHeader} from registry, optional primary “Try it” block.
 */
export function DevToolPageShell({
  slug,
  children,
  showTryHeading = true,
  tryHeading = "Try it",
}: DevToolPageShellProps) {
  const meta = getDevToolBySlug(slug);
  return (
    <article>
      <ToolHeader
        title={meta?.title ?? "Developer tool"}
        description={meta?.description ?? ""}
        category={meta?.category}
        seoIntro={meta?.seoIntro}
      />
      {showTryHeading ? (
        <section className="border-t border-border/50 pt-10" aria-labelledby="dev-tool-try-heading">
          <h2
            id="dev-tool-try-heading"
            className="font-display text-lg font-semibold tracking-tight text-foreground"
          >
            {tryHeading}
          </h2>
          <div className="mt-4">{children}</div>
        </section>
      ) : (
        children
      )}
    </article>
  );
}
