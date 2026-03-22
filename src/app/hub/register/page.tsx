"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export default function HubRegisterPage() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setErr(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(data.error ?? "Registration failed");
      return;
    }
    router.push("/hub/signin");
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
      <h1 className="font-display text-2xl font-bold text-white">Create account</h1>
      <p className="mt-2 text-sm text-slate-400">
        Already have one?{" "}
        <Link href="/hub/signin" className="text-cyan-400 hover:underline">
          Sign in
        </Link>
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <label htmlFor="name" className="text-sm text-slate-300">
            Name
          </label>
          <input
            id="name"
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            {...form.register("name")}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm text-slate-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            {...form.register("email")}
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm text-slate-300">
            Password (min 8)
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            {...form.register("password")}
          />
        </div>
        {err && (
          <p className="text-sm text-red-400" role="alert">
            {err}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-cyan-600 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500"
        >
          Register
        </button>
      </form>
    </div>
  );
}
