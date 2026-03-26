import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Maintenance",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <p className="text-sm font-medium uppercase tracking-widest text-primary">Torq Studio</p>
      <h1 className="mt-4 max-w-md font-display text-3xl font-bold text-foreground sm:text-4xl">
        We&apos;ll be back shortly
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The site is undergoing scheduled maintenance. Thank you for your patience.
      </p>
      <Link
        href="/admin"
        className="mt-10 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Admin
      </Link>
    </div>
  );
}
