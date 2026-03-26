"use client";

import { Suspense } from "react";

function Body() {
  const cal = process.env.NEXT_PUBLIC_CALENDLY_URL;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-foreground">
        Mock interviews
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground">
        During our launch period, booking is <strong className="text-primary">complimentary</strong>{" "}
        — pick a time below when Calendly is configured. Paid checkout is
        disabled while everything is free (
        <code className="text-primary">HUB_ALL_FREE_LAUNCH</code> in the codebase).
      </p>
      {cal ? (
        <iframe
          title="Schedule mock interview"
          src={cal}
          className="h-[720px] w-full rounded-xl border border-border"
        />
      ) : (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Add{" "}
          <code className="text-primary">NEXT_PUBLIC_CALENDLY_URL</code> to your{" "}
          <code>.env</code> to embed your scheduling page.
        </div>
      )}
    </div>
  );
}

export default function MockInterviewPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <Body />
    </Suspense>
  );
}
