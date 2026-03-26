const editorialBodyClass =
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

/** Admin-authored FAQ (rich HTML), same Quill output style as blog — appears below the tool, above `DevToolsToolFaq`. */
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
        <div className={editorialBodyClass} dangerouslySetInnerHTML={{ __html: html }} />
      </section>
    </div>
  );
}
