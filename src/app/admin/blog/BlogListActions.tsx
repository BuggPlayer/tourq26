"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function BlogListActions({ slug }: { slug: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/admin/content/blog/${encodeURIComponent(slug)}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Failed to delete");
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/blog/${encodeURIComponent(slug)}/edit`}
        className="rounded bg-muted px-3 py-1.5 text-sm text-foreground hover:bg-muted"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        className="rounded bg-destructive/15 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/25"
      >
        Delete
      </button>
    </div>
  );
}
