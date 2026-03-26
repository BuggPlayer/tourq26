import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 bg-background">
      <div className="mx-auto max-w-md text-center">
        <p className="font-display text-6xl font-bold text-primary sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-xl font-semibold text-foreground sm:text-2xl">
          Page not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
