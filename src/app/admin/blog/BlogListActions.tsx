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
        className="rounded bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-600"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        className="rounded bg-red-900/50 px-3 py-1.5 text-sm text-red-300 hover:bg-red-900/70"
      >
        Delete
      </button>
    </div>
  );
}
