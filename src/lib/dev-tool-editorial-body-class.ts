/** Shared ProseMirror/Quill editorial styles for dev-tool admin HTML below the fold. */
export const DEV_TOOL_EDITORIAL_BODY_CLASS =
  "dev-tool-editorial mt-6 max-w-none rounded-xl border border-border/50 bg-surface/40 p-6 sm:p-8 text-muted-foreground " +
  "[&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline " +
  "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic " +
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground " +
  "[&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground " +
  "[&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground " +
  "[&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground " +
  "[&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 " +
  "[&_p]:my-3 [&_p]:leading-relaxed " +
  "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:text-foreground " +
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";

/**
 * Same typography as {@link DEV_TOOL_EDITORIAL_BODY_CLASS} without an outer card — for FAQ answers inside accordions.
 */
export const DEV_TOOL_EDITORIAL_FAQ_ANSWER_CLASS =
  "dev-tool-editorial max-w-none text-sm text-muted-foreground " +
  "[&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline " +
  "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic " +
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground " +
  "[&_h1]:font-display [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-foreground " +
  "[&_h2]:mt-4 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground " +
  "[&_h3]:mt-3 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground " +
  "[&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 " +
  "[&_p]:my-2 [&_p]:leading-relaxed " +
  "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border/60 [&_pre]:bg-muted/40 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:text-foreground " +
  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5";

/** Guide block: full editorial typography, no inner border — outer shell uses soft `bg-muted/20` only. */
export const DEV_TOOL_EDITORIAL_GUIDE_INNER_CLASS =
  "dev-tool-editorial max-w-none text-muted-foreground [&_p:first-child]:mt-0 " +
  "[&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline " +
  "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic " +
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground " +
  "[&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground " +
  "[&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground " +
  "[&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground " +
  "[&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 " +
  "[&_p]:my-3 [&_p]:leading-relaxed " +
  "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:text-foreground " +
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";
