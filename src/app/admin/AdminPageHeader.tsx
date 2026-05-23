import Link from "next/link";
import type { ReactNode } from "react";

export type Crumb = { label: string; href?: string };

export function AdminPageHeader({
  crumbs,
  title,
  description,
  actions,
}: {
  crumbs?: Crumb[];
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="border-b border-border/60 pb-6">
      {crumbs && crumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mono-label flex items-center gap-2 text-muted-foreground/80">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <span key={`${c.label}-${i}`} className="flex items-center gap-2">
                {c.href && !isLast ? (
                  <Link href={c.href} className="transition-colors hover:text-foreground">
                    {c.label.toUpperCase()}
                  </Link>
                ) : (
                  <span className={isLast ? "text-foreground" : ""}>
                    {c.label.toUpperCase()}
                  </span>
                )}
                {!isLast ? <span aria-hidden>/</span> : null}
              </span>
            );
          })}
        </nav>
      ) : null}
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="display-lg text-foreground">{title}</h1>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
