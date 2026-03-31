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
 * Shared card surface for primary tool UI — same visual system as the default “Try it” block.
 * Use for long-form tools (`showTryHeading={false}`) so editors and controls match standard tools.
 */
export const DEV_TOOL_PRIMARY_SURFACE_CLASS =
  "w-full max-w-full min-w-0 box-border overflow-x-auto overscroll-x-contain rounded-xl border border-border/60 bg-surface/90 p-4 shadow-sm ring-1 ring-border/15 sm:rounded-3xl sm:p-8 lg:p-10 " +
  /* Larger primary inputs — shorter min-height on phones so keyboard + chrome leave room */
  "max-sm:[&_textarea]:min-h-[min(12rem,32dvh)] [&_textarea]:min-h-[min(16rem,38dvh)] sm:[&_textarea]:min-h-[min(20rem,44dvh)] lg:[&_textarea]:min-h-[min(22rem,48dvh)] [&_textarea]:max-w-full [&_textarea]:rounded-2xl [&_textarea]:border-border/70 [&_textarea]:px-4 [&_textarea]:py-3.5 [&_textarea]:text-base [&_textarea]:leading-relaxed sm:[&_textarea]:px-6 sm:[&_textarea]:py-5 sm:[&_textarea]:text-lg " +
  "[&_input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='range']):not([type='color'])]:min-h-12 [&_input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='range']):not([type='color'])]:rounded-xl [&_input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='range']):not([type='color'])]:px-4 [&_input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='range']):not([type='color'])]:text-base sm:[&_input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='range']):not([type='color'])]:text-lg " +
  "[&_select]:min-h-12 [&_select]:rounded-xl [&_select]:px-4 [&_select]:text-base sm:[&_select]:text-lg " +
  "[&>p]:text-base [&>p]:leading-relaxed sm:[&>p]:text-lg " +
  "[&_.flex.flex-wrap>button]:rounded-xl [&_.flex.flex-wrap>button]:px-4 [&_.flex.flex-wrap>button]:py-2.5 [&_.flex.flex-wrap>button]:text-sm sm:[&_.flex.flex-wrap>button]:px-5 sm:[&_.flex.flex-wrap>button]:py-3 sm:[&_.flex.flex-wrap>button]:text-base";

const tryWorkspaceClass = `mt-4 sm:mt-6 ${DEV_TOOL_PRIMARY_SURFACE_CLASS}`;

/** Standard shell for `/dev-tools/[slug]` tools: article, {@link ToolHeader}, optional primary “Try it” block. */
export function DevToolPageShell({
  slug,
  children,
  showTryHeading = true,
  tryHeading = "Try it",
}: DevToolPageShellProps) {
  const meta = getDevToolBySlug(slug);
  const headerProps = {
    title: meta?.title ?? "Developer tool",
    description: meta?.description ?? "",
    category: meta?.category,
    seoIntro: meta?.seoIntro,
  };

  if (!showTryHeading) {
    return (
      <article className="w-full min-w-0 max-w-full">
        <ToolHeader {...headerProps} segment="full" />
        {children}
      </article>
    );
  }

  return (
    <article className="w-full min-w-0 max-w-full">
      <ToolHeader {...headerProps} segment="lead" />
      <section className="min-w-0" aria-labelledby="dev-tool-try-heading">
        <h2
          id="dev-tool-try-heading"
          className="break-words text-balance font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl"
        >
          {tryHeading}
        </h2>
        <div data-dev-tool-try className={tryWorkspaceClass}>
          {children}
        </div>
      </section>
      <ToolHeader {...headerProps} segment="trail" />
    </article>
  );
}
