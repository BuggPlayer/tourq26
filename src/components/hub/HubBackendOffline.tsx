import Link from "next/link";

/** Shown when `HUB_BACKEND_FULL=false` or DB is unavailable for lab pages. */
export function HubBackendOffline() {
  return (
    <div
      className="mx-auto max-w-lg rounded-2xl border p-8"
      style={{
        borderColor: "var(--hub-border, #334155)",
        backgroundColor:
          "color-mix(in srgb, var(--hub-elevated) 80%, transparent)",
      }}
    >
      <h1
        className="font-display text-xl font-semibold"
        style={{ color: "var(--hub-page-fg)" }}
      >
        Hub database is off
      </h1>
      <p
        className="mt-3 text-sm leading-relaxed"
        style={{ color: "var(--hub-muted)" }}
      >
        This page needs the Interview Hub API and database. For production, set{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs text-primary">
          HUB_BACKEND_FULL=true
        </code>{" "}
        and a working{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs text-primary">
          DATABASE_URL
        </code>
        , then run migrations.
      </p>
      <Link
        href="/hub"
        className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
      >
        ← Back to hub overview
      </Link>
    </div>
  );
}
