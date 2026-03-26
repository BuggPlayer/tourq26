"use client";

/**
 * Launch offer: full access is free (`HUB_ALL_FREE_LAUNCH` in `src/lib/hub/usage.ts`).
 * Paid plans are shown as “coming later” for transparency.
 */
export default function PricingPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl font-bold text-foreground">Pricing</h1>
        <p className="mt-3 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
          <strong className="font-semibold">Launch offer:</strong> everything in
          Interview Hub is <strong>free</strong> right now — all question types,
          frameworks, system design labs, and unlimited practice. No payment
          required.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Optional paid plans may return later for extras (e.g. live mock
          interviews). Stripe hooks stay in the codebase for when you turn that
          on.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-primary/50 bg-surface/40 p-6">
          <h2 className="text-lg font-semibold text-primary">Current access</h2>
          <p className="mt-2 text-3xl font-bold text-foreground">₹0</p>
          <ul className="mt-4 list-inside list-disc text-sm text-foreground/90">
            <li>Unlimited submissions &amp; runs</li>
            <li>DSA, UI (all frameworks), quizzes, frontend system design</li>
            <li>Job board, community forums, preparation plans</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-border bg-surface/30 p-6 opacity-90">
          <h2 className="text-lg font-semibold text-muted-foreground">Future paid add-ons</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Not sold while launch pricing is active. Previously planned: monthly /
            yearly Premium (INR) and paid mock sessions via Stripe + Calendly.
          </p>
        </article>
      </div>
    </div>
  );
}
