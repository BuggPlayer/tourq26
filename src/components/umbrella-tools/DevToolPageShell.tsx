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
  "w-full max-w-full min-w-0 box-border overflow-x-auto overscroll-x-contain rounded-xl border border-border/45 bg-surface/80 p-3 shadow-[0_20px_50px_-28px_rgb(0_0_0/0.5),0_1px_0_0_rgb(255_255_255/0.04)_inset] ring-1 ring-inset ring-white/[0.04] backdrop-blur-[2px] sm:rounded-2xl sm:p-5 lg:p-6 dark:border-white/[0.07] dark:bg-surface/75 " +
  /* Compact textareas — still resizable; min-h avoids tiny boxes on mobile */
  "max-sm:[&_textarea]:min-h-[min(7.5rem,24dvh)] [&_textarea]:min-h-[min(8rem,26dvh)] sm:[&_textarea]:min-h-[min(9.5rem,30dvh)] lg:[&_textarea]:min-h-[min(11rem,34dvh)] [&_textarea]:max-h-[min(24rem,58dvh)] [&_textarea]:max-w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border-border/70 [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-sm [&_textarea]:leading-relaxed sm:[&_textarea]:px-4 sm:[&_textarea]:py-3 sm:[&_textarea]:text-sm " +
  "[&_input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='range']):not([type='color'])]:min-h-10 [&_input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='range']):not([type='color'])]:rounded-lg [&_input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='range']):not([type='color'])]:px-3 [&_input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='range']):not([type='color'])]:text-sm sm:[&_input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='range']):not([type='color'])]:text-sm " +
  "[&_select]:min-h-10 [&_select]:rounded-lg [&_select]:px-3 [&_select]:text-sm sm:[&_select]:text-sm " +
  "[&>p]:text-sm [&>p]:leading-relaxed sm:[&>p]:text-sm " +
  "[&_.flex.flex-wrap>button]:rounded-lg [&_.flex.flex-wrap>button]:px-3 [&_.flex.flex-wrap>button]:py-2 [&_.flex.flex-wrap>button]:text-xs sm:[&_.flex.flex-wrap>button]:px-4 sm:[&_.flex.flex-wrap>button]:py-2 sm:[&_.flex.flex-wrap>button]:text-sm";

const tryWorkspaceClass = `mt-3 sm:mt-4 ${DEV_TOOL_PRIMARY_SURFACE_CLASS}`;

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
          className="break-words text-balance font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl"
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
