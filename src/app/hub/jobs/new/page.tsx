"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  companyName: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(10),
  location: z.string().min(1),
  skills: z.string().min(2),
});

export default function NewJobPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      title: "",
      description: "",
      location: "",
      skills: "Next.js, TypeScript",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    const skills = values.skills.split(",").map((s) => s.trim()).filter(Boolean);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, skills }),
    });
    if (!res.ok) {
      toast.error("Could not post job — sign in?");
      return;
    }
    toast.success("Job posted");
    router.push("/hub/jobs");
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/hub/jobs" className="text-sm text-primary hover:underline">
        ← Jobs
      </Link>
      <h1 className="font-display text-2xl font-bold text-foreground">Post a job</h1>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {(["companyName", "title", "location"] as const).map((f) => (
          <label key={f} className="block text-sm text-muted-foreground">
            {f}
            <input
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              {...form.register(f)}
            />
          </label>
        ))}
        <label className="block text-sm text-muted-foreground">
          Description
          <textarea
            rows={5}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
            {...form.register("description")}
          />
        </label>
        <label className="block text-sm text-muted-foreground">
          Skills (comma-separated)
          <input
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
            {...form.register("skills")}
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-foreground"
        >
          Publish
        </button>
      </form>
    </div>
  );
}
