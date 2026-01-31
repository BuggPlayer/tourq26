import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 bg-[var(--background)]">
      <div className="mx-auto max-w-md text-center">
        <p className="font-display text-6xl font-bold text-[var(--color-primary)] sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-xl font-semibold text-white sm:text-2xl">
          Page not found
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-[var(--background)] transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
