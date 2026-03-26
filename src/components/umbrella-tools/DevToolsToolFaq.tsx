"use client";

import { usePathname } from "next/navigation";
import { useCallback, useId, useMemo, useState } from "react";
import { getDevToolFaqItems } from "@/lib/umbrella-tools/dev-tool-faq";

export function DevToolsToolFaq() {
  const pathname = usePathname();
  const baseId = useId();
  const slug = useMemo(() => {
    const segments = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
    if (segments.length !== 2 || segments[0] !== "dev-tools" || segments[1] === "about") return null;
    return segments[1]!;
  }, [pathname]);

  const items = slug ? getDevToolFaqItems(slug) : [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(index);
      }
    },
    [toggle],
  );

  if (!slug || items.length === 0) return null;

  return (
    <section className="mt-14 border-t border-border/50 pt-10" aria-labelledby={`${baseId}-faq-heading`}>
      <h2 id={`${baseId}-faq-heading`} className="font-display text-lg font-semibold tracking-tight text-foreground">
        Frequently asked questions
      </h2>
      <p className="mt-1 text-sm text-foreground/80">
        Common questions about privacy and how these tools work.
      </p>
      <div className="mt-6 divide-y divide-border/60 rounded-xl border border-border/60 bg-surface/30">
        {items.map((item, index) => {
          const panelId = `${baseId}-faq-panel-${index}`;
          const buttonId = `${baseId}-faq-trigger-${index}`;
          const expanded = openIndex === index;
          return (
            <div key={item.question} className="px-4 py-2 first:pt-3 last:pb-3">
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                aria-label={`${expanded ? "Collapse" : "Expand"} FAQ: ${item.question}`}
                className="flex w-full items-start justify-between gap-3 rounded-lg py-1.5 text-left text-sm font-medium text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => toggle(index)}
                onKeyDown={(e) => onKeyDown(e, index)}
              >
                <span>{item.question}</span>
                <span className="shrink-0 text-muted-foreground" aria-hidden>
                  {expanded ? "−" : "+"}
                </span>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!expanded}
                className="pb-2 pt-1 text-sm leading-relaxed text-foreground/85 motion-safe:transition-opacity motion-reduce:transition-none"
              >
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
