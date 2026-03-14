import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readContactSubmissions } from "@/lib/content";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default async function AdminContactPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const submissions = await readContactSubmissions();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Contact submissions</h1>
      <p className="mt-1 text-slate-400">
        Form submissions from the contact page. Newest first.
      </p>
      {submissions.length === 0 ? (
        <p className="mt-8 text-slate-400">No submissions yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold text-white">{s.name}</div>
                <time className="text-xs text-slate-500" dateTime={s.createdAt}>
                  {formatDate(s.createdAt)}
                </time>
              </div>
              <div className="mt-1 text-sm text-cyan-400">
                <a href={`mailto:${s.email}`} className="hover:underline">
                  {s.email}
                </a>
              </div>
              {s.company && (
                <div className="mt-1 text-sm text-slate-400">{s.company}</div>
              )}
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
                {s.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
