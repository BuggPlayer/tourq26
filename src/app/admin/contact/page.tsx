import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readContactSubmissions } from "@/lib/content";
import { AdminPageHeader } from "../AdminPageHeader";

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
      <AdminPageHeader
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Contact" },
        ]}
        title="Contact submissions"
        description="Form submissions from the contact page. Newest first."
      />

      {submissions.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No submissions yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {submissions.map((s) => (
            <article key={s.id} className="card-flat">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-medium text-foreground">{s.name}</h2>
                <time className="mono-label text-muted-foreground" dateTime={s.createdAt}>
                  {formatDate(s.createdAt).toUpperCase()}
                </time>
              </div>
              <p className="mt-1 text-[14px]">
                <a href={`mailto:${s.email}`} className="text-foreground underline underline-offset-2">
                  {s.email}
                </a>
              </p>
              {s.company ? (
                <p className="mt-1 text-[13px] text-muted-foreground">{s.company}</p>
              ) : null}
              <p className="mt-4 whitespace-pre-wrap text-[14px] leading-relaxed text-foreground/90">
                {s.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
