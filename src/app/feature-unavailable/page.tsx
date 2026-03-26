import type { Metadata } from "next";
import Link from "next/link";

const MESSAGES: Record<string, { title: string; body: string }> = {
  marketing_contact_form: {
    title: "Contact unavailable",
    body: "The contact page and form are temporarily disabled. Please try again later or reach us via your usual channel.",
  },
  marketing_blog: {
    title: "Blog unavailable",
    body: "The blog is temporarily unavailable.",
  },
};

export const metadata: Metadata = {
  title: "Unavailable",
  robots: { index: false, follow: false },
};

export default async function FeatureUnavailablePage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>;
}) {
  const { k } = await searchParams;
  const msg = (k && MESSAGES[k]) || {
    title: "Unavailable",
    body: "This part of the site is temporarily disabled.",
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#07090e] px-6 text-center text-slate-200">
      <h1 className="max-w-md font-display text-2xl font-bold text-white sm:text-3xl">{msg.title}</h1>
      <p className="mt-4 max-w-md text-slate-400">{msg.body}</p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-[#07090e] hover:bg-cyan-500"
      >
        Back to home
      </Link>
    </div>
  );
}
