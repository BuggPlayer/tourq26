"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Item = {
  publicId: string;
  question: string;
  sortOrder: number;
  category: { slug: string; label: string };
};

export function InterviewBankItemsTable({
  bankSlug,
  initialItems,
}: {
  bankSlug: string;
  initialItems: Item[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const enc = encodeURIComponent(bankSlug);

  async function remove(publicId: string) {
    if (!window.confirm(`Delete “${publicId}”?`)) return;
    setDeleting(publicId);
    const res = await fetch(
      `/api/admin/hub/banks/${enc}/items/${encodeURIComponent(publicId)}`,
      { method: "DELETE" },
    );
    setDeleting(null);
    if (res.ok) router.refresh();
    else alert("Delete failed");
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-slate-700/50">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-slate-700 bg-slate-800/40 text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">Topic</th>
            <th className="px-4 py-3 font-medium">Question</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {initialItems.map((row) => (
            <tr key={row.publicId} className="border-b border-slate-800/80 hover:bg-slate-800/20">
              <td className="px-4 py-3 tabular-nums text-slate-500">{row.sortOrder}</td>
              <td className="px-4 py-3 font-mono text-xs text-cyan-400/90">{row.publicId}</td>
              <td className="px-4 py-3 text-slate-300">{row.category.label}</td>
              <td className="max-w-md px-4 py-3 text-slate-200 line-clamp-2">{row.question}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/hub/interview-banks/${enc}/edit/${encodeURIComponent(row.publicId)}`}
                  className="text-cyan-400 hover:underline"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={deleting === row.publicId}
                  onClick={() => remove(row.publicId)}
                  className="ml-3 text-red-400/90 hover:underline disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {initialItems.length === 0 && (
        <p className="p-8 text-center text-slate-500">No items. Add categories, then create questions.</p>
      )}
    </div>
  );
}
