import Link from "next/link";
import type { NodeJsQAItem } from "@/data/nodejs-interview-qa";

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="hub-qa-inline-code rounded px-1 py-0.5 font-mono text-[0.9em]">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function hasStructuredBody(item: NodeJsQAItem) {
  return !!(
    item.answerIntro ||
    (item.bullets && item.bullets.length > 0) ||
    item.codeExample
  );
}

type Props = {
  item: NodeJsQAItem;
  totalBankCount: number;
  /** Full page shows CTA + source row; accordion can hide CTA */
  showCta?: boolean;
  listHref?: string;
  /** e.g. “JavaScript & Node.js” — used in “N … interview questions” */
  ctaBankLabel?: string;
};

export function NodeJsInterviewAnswer({
  item,
  totalBankCount,
  showCta = true,
  listHref = "/hub/candidate/interview/nodejs",
  ctaBankLabel = "JavaScript & Node.js",
}: Props) {
  const structured = hasStructuredBody(item);

  return (
    <div style={{ color: "var(--hub-page-fg, #e2e8f0)" }}>
      <h2 className="text-lg font-bold" style={{ color: "var(--hub-page-fg, #f8fafc)" }}>
        Answer
      </h2>

      {structured ? (
        <>
          {item.answerIntro ? (
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--hub-page-fg, #e2e8f0)" }}>
              <InlineText text={item.answerIntro} />
            </p>
          ) : null}
          {item.bullets && item.bullets.length > 0 ? (
            <ul
              className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed"
              style={{ color: "var(--hub-page-fg, #e2e8f0)" }}
            >
              {item.bullets.map((b) => (
                <li key={b.title}>
                  <strong className="font-semibold">{b.title}</strong>
                  {b.text ? (
                    <>
                      {" "}
                      <InlineText text={b.text} />
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
          {item.codeExample ? (
            <pre className="mt-5 overflow-x-auto rounded-xl bg-[#1e1e1e] p-4 text-left text-sm leading-relaxed text-foreground">
              <code className="font-mono text-[13px]">{item.codeExample}</code>
            </pre>
          ) : null}
        </>
      ) : (
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--hub-page-fg, #e2e8f0)" }}>
          <InlineText text={item.answer} />
        </p>
      )}

      {showCta ? (
        <div
          className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-end sm:justify-between"
          style={{ borderColor: "var(--hub-border, #334155)" }}
        >
          <p className="text-sm" style={{ color: "var(--hub-muted, #94a3b8)" }}>
            Having a tech or coding interview? Check{" "}
            <Link
              href={listHref}
              className="hub-qa-link font-medium underline-offset-2 hover:underline"
            >
              {totalBankCount} {ctaBankLabel} interview questions
            </Link>
            .
          </p>
          {item.source ? (
            <p
              className="shrink-0 text-right text-xs italic sm:max-w-[45%]"
              style={{ color: "var(--hub-muted, #94a3b8)" }}
            >
              Source:{" "}
              {item.source.url ? (
                <a
                  href={item.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hub-qa-link underline-offset-2 hover:underline not-italic"
                >
                  {item.source.name}
                </a>
              ) : (
                item.source.name
              )}
            </p>
          ) : null}
        </div>
      ) : item.source ? (
        <p
          className="mt-4 text-right text-xs italic"
          style={{ color: "var(--hub-muted, #94a3b8)" }}
        >
          Source:{" "}
          {item.source.url ? (
            <a
              href={item.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hub-qa-link underline-offset-2 hover:underline not-italic"
            >
              {item.source.name}
            </a>
          ) : (
            item.source.name
          )}
        </p>
      ) : null}
    </div>
  );
}
