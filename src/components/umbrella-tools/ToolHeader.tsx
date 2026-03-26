import Link from "next/link";
import { DEV_TOOL_CATEGORY_LABELS } from "@/lib/umbrella-tools/tools-config";
import type { DevToolCategory } from "@/lib/umbrella-tools/tools-config";

type Props = {
  title: string;
  description: string;
  category?: DevToolCategory;
  /** Plain text; use `\\n\\n` between paragraphs. Renders visible copy for users & search. */
  seoIntro?: string;
};

export default function ToolHeader({ title, description, category, seoIntro }: Props) {
  const introParagraphs = seoIntro?.trim()
    ? seoIntro
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <header className="mb-8 border-b border-border/40 pb-8">
      <Link
        href="/dev-tools"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <span aria-hidden>←</span> All tools
      </Link>
      {category ? (
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/90">
          {DEV_TOOL_CATEGORY_LABELS[category]}
        </p>
      ) : null}
      <h1 className={`font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl ${category ? "mt-2" : "mt-5"}`}>
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
      {introParagraphs.length > 0 ? (
        <div
          className="mt-6 max-w-2xl space-y-3 border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]"
          role="region"
          aria-label="About this tool"
        >
          {introParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : null}
    </header>
  );
}
