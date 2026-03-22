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
    <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-8 text-center">
      <h1 className="font-display text-xl font-semibold text-red-200">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-red-300/90">
        {error.message || "An unexpected error occurred in the hub."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
      >
        Try again
      </button>
    </div>
  );
}
