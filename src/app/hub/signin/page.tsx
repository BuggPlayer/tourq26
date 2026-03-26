"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function HubSignInPage() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setErr(null);
    const res = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    if (res?.error) {
      setErr("Invalid email or password.");
      return;
    }
    router.push("/hub/candidate");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface/50 p-8">
      <h1 className="font-display text-2xl font-bold text-foreground">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/hub/register" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <label htmlFor="email" className="text-sm text-foreground/90">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            aria-invalid={!!form.formState.errors.email}
            {...form.register("email")}
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm text-foreground/90">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
            {...form.register("password")}
          />
        </div>
        {err && (
          <p className="text-sm text-destructive" role="alert">
            {err}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-foreground hover:bg-primary-hover"
        >
          Continue
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        OAuth (Google / GitHub) is enabled automatically when{" "}
        <code className="text-muted-foreground">AUTH_GOOGLE_*</code> /{" "}
        <code className="text-muted-foreground">AUTH_GITHUB_*</code> are set — a
        provider button will appear here once configured.
      </p>
    </div>
  );
}
