"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Milestone = { id: string; title: string; questionCount: number };

type Plan = {
  id: string;
  slug: string;
  name: string;
  description: string;
  durationDays: number;
  milestones: Milestone[];
};

export default function PlansPage() {
  const { data } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then((d) => setPlans(d.plans ?? []));
  }, []);

  async function enroll(planId: string) {
    if (!data?.user) {
      toast.error("Sign in to track a plan");
      return;
    }
    const res = await fetch("/api/plans/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    if (!res.ok) {
      toast.error("Could not enroll");
      return;
    }
    toast.success("Plan saved to your profile");
  }

  return (
    <div className="space-y-6">
      <Link href="/hub/candidate" className="text-sm text-primary hover:underline">
        ← Candidate hub
      </Link>
      <h1 className="font-display text-3xl font-bold text-foreground">
        Preparation plans
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Pick a track to anchor your study calendar. Progress is stored per
        account; pair milestones with questions from the bank.
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {plans.map((p) => (
          <li
            key={p.id}
            className="rounded-2xl border border-border bg-surface/40 p-5"
          >
            <h2 className="font-display text-lg font-semibold text-primary">
              {p.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">{p.durationDays} days</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-foreground/90">
              {p.milestones.map((m) => (
                <li key={m.id}>
                  {m.title}{" "}
                  <span className="text-muted-foreground">(~{m.questionCount} items)</span>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => enroll(p.id)}
              className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Track this plan
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
