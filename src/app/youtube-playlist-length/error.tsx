"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function YouTubePlaylistLengthError({
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
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold text-foreground">Something went wrong</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The playlist calculator hit an unexpected error. You can try again or return home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Try again
        </button>
        <Link
          href="/youtube-playlist-length"
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted/30"
        >
          Reload tool
        </Link>
      </div>
    </div>
  );
}
