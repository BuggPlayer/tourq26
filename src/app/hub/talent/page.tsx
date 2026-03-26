"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type C = {
  id: string;
  headline: string;
  location: string;
  avgScore: number;
  skills: string[];
  displayName: string;
  contactHint: string;
};

const optSchema = z.object({
  optIn: z.boolean(),
  headline: z.string().max(240).optional(),
  location: z.string().max(200).optional(),
  skills: z.string().optional(),
});

export default function TalentPage() {
  const { data } = useSession();
  const [candidates, setCandidates] = useState<C[]>([]);
  const [skill, setSkill] = useState("");
  const form = useForm<z.infer<typeof optSchema>>({
    resolver: zodResolver(optSchema),
    defaultValues: { optIn: true, headline: "", location: "", skills: "" },
  });

  const load = useCallback(() => {
    const qs = new URLSearchParams();
    if (skill) qs.set("skill", skill);
    fetch(`/api/talent?${qs}`)
      .then((r) => r.json())
      .then((d) => setCandidates(d.candidates ?? []));
  }, [skill]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveOptIn(values: z.infer<typeof optSchema>) {
    const skills = (values.skills ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await fetch("/api/talent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, skills }),
    });
    const d = await res.json();
    if (!res.ok) {
      toast.error(d.error ?? "Failed");
      return;
    }
    toast.success("Talent pool preferences saved");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Talent pool</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Candidates who perform strongly can opt in. Companies filter by skills
          and scores (contact hints are masked for MVP).
        </p>
        <div className="mt-4 flex gap-2">
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Filter skill"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            aria-label="Filter by skill"
          />
          <button
            type="button"
            onClick={load}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            Apply
          </button>
        </div>
        <ul className="mt-6 space-y-3" role="list">
          {candidates.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-border bg-surface/40 p-4 text-sm"
            >
              <p className="font-medium text-foreground">{c.displayName}</p>
              <p className="text-muted-foreground">{c.headline || "Hub candidate"}</p>
              <p className="text-xs text-muted-foreground">
                Avg {c.avgScore.toFixed(1)} · {c.location || "Location n/a"}
              </p>
              <p className="mt-1 text-xs text-primary">Contact: {c.contactHint}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-border bg-surface/40 p-5">
        <h2 className="font-semibold text-foreground">Candidate opt-in</h2>
        {!data?.user ? (
          <p className="mt-2 text-sm text-muted-foreground">Sign in to join the pool.</p>
        ) : (
          <form
            className="mt-4 space-y-3"
            onSubmit={form.handleSubmit(saveOptIn)}
          >
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("optIn")} />
              Visible to hiring partners
            </label>
            <input
              placeholder="Headline"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              {...form.register("headline")}
            />
            <input
              placeholder="Location"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              {...form.register("location")}
            />
            <input
              placeholder="Skills (comma-separated)"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              {...form.register("skills")}
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-violet-600 py-2 text-sm text-foreground"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
