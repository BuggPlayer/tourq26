"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MonacoCodeEditor } from "@/components/hub/MonacoCodeEditor";
import { NodeJsInterviewAnswer } from "@/components/hub/NodeJsInterviewAnswer";
import type { NodeJsQAItem } from "@/data/nodejs-interview-qa";
import { recordInterviewQaFullPageView } from "@/lib/hub/candidate-behavior";

const DIFF_BADGE: Record<string, string> = {
  Easy: "bg-success/15 text-success",
  Mid: "bg-primary/15 text-primary",
  Hard: "bg-destructive/15 text-destructive",
};

const DEFAULT_SCRATCH = `// Scratch space — try ideas from the answer on the left.
// Your edits are kept in this tab only (not saved to the server).

function example() {
  return true;
}
`;

type Props = {
  item: NodeJsQAItem;
  qNum: number;
  total: number;
  bankSlug: string;
  basePath: string;
  categories: readonly { id: string; label: string }[];
  ctaBankLabel: string;
};

export function NodeJsInterviewFullPage({
  item,
  qNum,
  total,
  bankSlug,
  basePath,
  categories,
  ctaBankLabel,
}: Props) {
  const categoryLabel =
    categories.find((c) => c.id === item.categoryId)?.label ?? item.categoryId;
  const badgeLabel = item.categoryBadge ?? categoryLabel;

  const initialCode = useMemo(
    () => (item.codeExample?.trim() ? item.codeExample : DEFAULT_SCRATCH),
    [item.codeExample],
  );

  const [code, setCode] = useState(initialCode);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    recordInterviewQaFullPageView(bankSlug, item.id);
  }, [bankSlug, item.id]);

  const [editorH, setEditorH] = useState(400);
  useEffect(() => {
    const update = () => {
      const lg = window.matchMedia("(min-width: 1024px)").matches;
      if (lg) {
        setEditorH(Math.max(360, window.innerHeight - 200));
      } else {
        setEditorH(Math.min(520, Math.max(280, window.innerHeight * 0.42)));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="hub-node-fullpage -mx-4 flex min-h-[calc(100vh-7rem)] flex-col md:-mx-8 lg:min-h-[calc(100vh-6rem)]">
      <nav
        className="shrink-0 border-b px-4 py-2 text-sm md:px-6"
        style={{ borderColor: "var(--hub-border, #1e293b)" }}
      >
        <Link
          href={basePath}
          className="hub-qa-link font-medium underline-offset-2 hover:underline"
        >
          ← All questions
        </Link>
      </nav>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Left: question + answer */}
        <section
          className="flex max-h-[55vh] min-h-0 flex-col border-b lg:max-h-none lg:w-[min(100%,520px)] lg:shrink-0 lg:border-b-0 lg:border-r xl:w-[42%]"
          style={{ borderColor: "var(--hub-border, #1e293b)" }}
          aria-labelledby="node-qa-heading"
        >
          <div className="shrink-0 border-b px-4 py-4 md:px-6" style={{ borderColor: "var(--hub-border, #1e293b)" }}>
            <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h1
                id="node-qa-heading"
                className="font-display text-lg font-bold leading-snug sm:text-xl"
                style={{ color: "var(--hub-page-fg, #f8fafc)" }}
              >
                Q{qNum}: {item.question}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {item.difficulty ? (
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold ${DIFF_BADGE[item.difficulty] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {item.difficulty}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/90 px-2.5 py-1 text-xs font-medium text-foreground/90">
                  <span className="text-base leading-none text-primary/80" aria-hidden>
                    ●
                  </span>
                  {badgeLabel} {total}
                </span>
              </div>
            </header>
          </div>
          <div
            className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--hub-page-bg, #020617) 40%, transparent)",
            }}
          >
            <div
              className="rounded-2xl border p-5 sm:p-6"
              style={{
                borderColor: "var(--hub-border, #1e293b)",
                backgroundColor:
                  "color-mix(in srgb, var(--hub-elevated, #0f172a) 80%, transparent)",
              }}
            >
              <NodeJsInterviewAnswer
                item={item}
                totalBankCount={total}
                showCta
                listHref={basePath}
                ctaBankLabel={ctaBankLabel}
              />
            </div>
          </div>
        </section>

        {/* Right: editor */}
        <section
          className="flex min-h-[min(420px,50vh)] flex-1 flex-col lg:min-h-0"
          aria-label="Code scratch pad"
        >
          <div
            className="flex shrink-0 items-center justify-between border-b px-3 py-2"
            style={{
              borderColor: "var(--hub-border, #1e293b)",
              backgroundColor:
                "color-mix(in srgb, var(--hub-elevated) 70%, transparent)",
            }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--hub-muted, #94a3b8)" }}
            >
              Editor
            </span>
            <span className="text-[11px]" style={{ color: "var(--hub-muted)" }}>
              JavaScript · local only
            </span>
          </div>
          <div className="min-h-0 flex-1 p-2">
            <MonacoCodeEditor
              value={code}
              onChange={setCode}
              language="javascript"
              height={`${editorH}px`}
              aria-label="Scratch code editor"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
