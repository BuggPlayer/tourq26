import Link from "next/link";
import { DEV_TOOL_CATEGORY_LABELS } from "@/lib/umbrella-tools/tools-config";
import type { DevToolCategory } from "@/lib/umbrella-tools/tools-config";

type Props = {
  title: string;
  description: string;
  category?: DevToolCategory;
};

export default function ToolHeader({ title, description, category }: Props) {
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
    </header>
  );
}
