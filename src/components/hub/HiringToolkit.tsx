"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { pdf } from "@react-pdf/renderer";
import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";
import { useState } from "react";

const schema = z.object({
  jobTitle: z.string().min(2),
  stack: z.string().min(2),
  seniority: z.enum(["junior", "mid", "senior", "staff"]),
  jobDescription: z.string().optional(),
});

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11 },
  h1: { fontSize: 18, marginBottom: 12 },
  h2: { fontSize: 13, marginTop: 10, marginBottom: 6 },
  p: { marginBottom: 4 },
});

function InterviewPdfDoc(props: { title: string; blocks: string[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>TorqStudio — Interview set</Text>
        <Text style={styles.p}>{props.title}</Text>
        {props.blocks.map((b, i) => (
          <Text key={i} style={styles.p}>
            • {b}
          </Text>
        ))}
      </Page>
    </Document>
  );
}

function ruleBasedQuestions(values: z.infer<typeof schema>): string[] {
  const s = values.seniority;
  const base = [
    `System: How would you design a ${values.stack} feature slice for "${values.jobTitle}"?`,
    `Coding: Pick a medium ${values.stack.split(",")[0]?.trim() || "language"} problem involving maps or trees.`,
    `Behavior: Tell me about a production incident you owned end-to-end.`,
    `Collaboration: How do you review PRs for ${values.jobTitle} peers?`,
  ];
  if (s === "senior" || s === "staff") {
    base.push(
      "Architecture: Trade-offs between SSR, static generation, and client rendering for SEO-heavy pages.",
      "People: How do you grow ICs on a team delivering interview-critical features?",
    );
  }
  if (values.jobDescription) {
    base.push(
      `Domain: Ask two deep questions directly tied to: ${values.jobDescription.slice(0, 180)}…`,
    );
  }
  return base;
}

export function HiringToolkit() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      jobTitle: "Senior Frontend Engineer",
      stack: "React, TypeScript, Next.js",
      seniority: "senior",
      jobDescription: "",
    },
  });

  async function generate(values: z.infer<typeof schema>) {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 200));
      setItems(ruleBasedQuestions(values));
    } finally {
      setLoading(false);
    }
  }

  async function exportPdf() {
    if (!items.length) return;
    const blob = await pdf(
      <InterviewPdfDoc
        title={form.getValues("jobTitle")}
        blocks={items}
      />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "torqstudio-interview-set.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
        onSubmit={form.handleSubmit(generate)}
      >
        <h2 className="font-semibold text-slate-100">Job context</h2>
        <label className="block text-sm text-slate-400">
          Title
          <input
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            {...form.register("jobTitle")}
          />
        </label>
        <label className="block text-sm text-slate-400">
          Tech stack
          <input
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            {...form.register("stack")}
          />
        </label>
        <label className="block text-sm text-slate-400">
          Seniority
          <select
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            {...form.register("seniority")}
          >
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="staff">Staff</option>
          </select>
        </label>
        <label className="block text-sm text-slate-400">
          Job description (optional)
          <textarea
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            {...form.register("jobDescription")}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate question set"}
        </button>
        <p className="text-xs text-slate-500">
          Uses rule-based templates on-device. For GPT-4 generated sets, call a
          secured API route with your OpenAI key (see README).
        </p>
      </form>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="font-semibold text-slate-100">Output</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          {items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
        {items.length > 0 && (
          <button
            type="button"
            onClick={exportPdf}
            className="mt-6 rounded-lg border border-slate-600 px-4 py-2 text-sm"
          >
            Export PDF
          </button>
        )}
      </div>
    </div>
  );
}
