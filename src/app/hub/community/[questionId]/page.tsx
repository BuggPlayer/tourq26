"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function ReplyBox({
  threadId,
  onPosted,
}: {
  threadId: string;
  onPosted: () => void;
}) {
  const [body, setBody] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const res = await fetch("/api/forum/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, body }),
    });
    if (!res.ok) toast.error("Could not reply");
    else {
      setBody("");
      onPosted();
    }
  }
  return (
    <form className="mt-3 flex flex-col gap-2" onSubmit={submit}>
      <textarea
        rows={2}
        placeholder="Reply"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="self-start rounded-lg border border-slate-600 px-3 py-1 text-xs"
      >
        Reply
      </button>
    </form>
  );
}

type Post = {
  id: string;
  body: string;
  createdAt: string;
  user: { name: string | null; image: string | null };
};

type Thread = {
  id: string;
  title: string;
  posts: Post[];
};

export default function ForumThreadPage() {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useSession();
  const [threads, setThreads] = useState<Thread[]>([]);
  const newThread = useForm<{ title: string; body: string }>({
    defaultValues: { title: "", body: "" },
  });

  const load = useCallback(() => {
    fetch(`/api/forum?questionId=${questionId}`)
      .then((r) => r.json())
      .then((d) => setThreads(d.threads ?? []));
  }, [questionId]);

  useEffect(() => {
    load();
  }, [load]);

  async function createThread(values: { title: string; body: string }) {
    const res = await fetch("/api/forum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, ...values }),
    });
    if (!res.ok) {
      toast.error("Sign in to create a thread");
      return;
    }
    newThread.reset();
    load();
  }

  return (
    <div className="space-y-8">
      <Link href="/hub/community" className="text-sm text-cyan-400 hover:underline">
        ← Community
      </Link>
      <h1 className="font-display text-2xl font-bold text-white">Discussion</h1>
      {data?.user && (
        <form
          className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4"
          onSubmit={newThread.handleSubmit(createThread)}
        >
          <p className="text-sm font-medium text-slate-300">Start a thread</p>
          <input
            placeholder="Title"
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
            {...newThread.register("title", { required: true })}
          />
          <textarea
            rows={3}
            placeholder="First post"
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
            {...newThread.register("body", { required: true })}
          />
          <button
            type="submit"
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm text-white"
          >
            Post
          </button>
        </form>
      )}
      <ul className="space-y-6">
        {threads.map((t) => (
          <li key={t.id} className="rounded-xl border border-slate-800 p-4">
            <h2 className="font-semibold text-slate-100">{t.title}</h2>
            <ul className="mt-3 space-y-2 border-l border-slate-700 pl-3">
              {t.posts.map((p) => (
                <li key={p.id} className="text-sm text-slate-300">
                  <span className="text-xs text-slate-500">
                    {p.user.name ?? "User"} ·{" "}
                    {new Date(p.createdAt).toLocaleString()}
                  </span>
                  <p className="mt-1 whitespace-pre-wrap">{p.body}</p>
                </li>
              ))}
            </ul>
            {data?.user && <ReplyBox threadId={t.id} onPosted={load} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
