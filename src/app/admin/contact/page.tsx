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
      <h1 className="text-2xl font-bold text-foreground">Contact submissions</h1>
      <p className="mt-1 text-muted-foreground">
        Form submissions from the contact page. Newest first.
      </p>
      {submissions.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No submissions yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-border/50 bg-muted/30 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold text-foreground">{s.name}</div>
                <time className="text-xs text-muted-foreground" dateTime={s.createdAt}>
                  {formatDate(s.createdAt)}
                </time>
              </div>
              <div className="mt-1 text-sm text-primary">
                <a href={`mailto:${s.email}`} className="hover:underline">
                  {s.email}
                </a>
              </div>
              {s.company && (
                <div className="mt-1 text-sm text-muted-foreground">{s.company}</div>
              )}
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
                {s.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
