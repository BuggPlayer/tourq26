import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

const cards = [
  {
    href: "/admin/hub/interview-banks",
    title: "Interview Q&A banks",
    desc: "Create banks (Node.js, React, …), categories, and Q&A at /hub/candidate/interview/[slug].",
  },
  {
    href: "/admin/hub/plans",
    title: "Preparation plans",
    desc: "Milestones and durations for /hub/candidate/plans.",
  },
  {
    href: "/admin/hub/company-tags",
    title: "Company tags",
    desc: "Labels linked to coding / system-design questions.",
  },
  {
    href: "/admin/hub/questions",
    title: "Interview questions",
    desc: "DSA, UI, quiz, and frontend system-design items.",
  },
];

export default async function AdminHubHomePage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Interview Hub (CMS)</h1>
      <p className="mt-1 max-w-2xl text-slate-400">
        Content here is stored in your hub database (MongoDB). After changes, candidate pages pick up updates on
        the next request. Run <code className="text-cyan-400/90">npm run db:seed</code> if collections are empty.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="block rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 transition hover:border-cyan-500/40 hover:bg-slate-800/50"
            >
              <h2 className="font-semibold text-white">{c.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{c.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
