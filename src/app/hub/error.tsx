"use client";

import { useEffect } from "react";

export default function HubError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-destructive/35 bg-destructive/10 p-8 text-center">
      <h1 className="font-display text-xl font-semibold text-destructive">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-destructive/90">
        {error.message || "An unexpected error occurred in the hub."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
