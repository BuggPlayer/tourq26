"use client";

import { useState } from "react";
import type { LiveToolId } from "@/lib/tools/schemas";
import {
  FounderOnePagerForm,
  JobPostForm,
  RfpForm,
  TechStackForm,
} from "./AdditionalToolForms";
import InterviewPrepRunner from "./InterviewPrepRunner";
import { fieldClass, labelClass } from "./form-ui";

type Props = { toolId: LiveToolId };

export default function ToolRunner({ toolId }: Props) {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(fields: Record<string, unknown>) {
    setError(null);
    setCopied(false);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/tools/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, fields }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      if (data.text) setResult(data.text);
      else setError("No output returned.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  const shell = {
    onSubmit: handleSubmit,
    loading,
    error,
    result,
    onCopy: copyResult,
    copied,
  };

  if (toolId === "app-budget-estimator") {
    return <BudgetForm {...shell} />;
  }
  if (toolId === "vendor-evaluation") {
    return <VendorForm {...shell} />;
  }
  if (toolId === "one-pager-pitch") {
    return <OnePagerForm {...shell} />;
  }
  if (toolId === "rfp-drafter") {
    return <RfpForm {...shell} />;
  }
  if (toolId === "tech-stack-roi") {
    return <TechStackForm {...shell} />;
  }
  if (toolId === "interview-prep") {
    return <InterviewPrepRunner />;
  }
  if (toolId === "founder-one-pager") {
    return <FounderOnePagerForm {...shell} />;
  }
  return <JobPostForm {...shell} />;
}

function BudgetForm({
  onSubmit,
  loading,
  error,
  result,
  onCopy,
  copied,
}: {
  onSubmit: (f: Record<string, unknown>) => void;
  loading: boolean;
  error: string | null;
  result: string | null;
  onCopy: () => void;
  copied: boolean;
}) {
  const [platforms, setPlatforms] = useState("");
  const [complexity, setComplexity] = useState<"low" | "medium" | "high">("medium");
  const [timeline, setTimeline] = useState<"lt3m" | "3to6m" | "6to12m" | "gt12m">("3to6m");
  const [teamModel, setTeamModel] = useState<"in_house" | "agency" | "hybrid">("hybrid");

  return (
    <div className="space-y-8">
      <form
        className="space-y-5 rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ platforms, complexity, timeline, teamModel });
        }}
      >
        <div>
          <label className={labelClass} htmlFor="platforms">
            Platforms & product type
          </label>
          <textarea
            id="platforms"
            className={`${fieldClass} min-h-[88px] resize-y`}
            placeholder="e.g. iOS + Android consumer app, admin web dashboard, Stripe billing"
            value={platforms}
            onChange={(e) => setPlatforms(e.target.value)}
            required
            maxLength={500}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="complexity">
              Scope complexity
            </label>
            <select
              id="complexity"
              className={fieldClass}
              value={complexity}
              onChange={(e) => setComplexity(e.target.value as typeof complexity)}
            >
              <option value="low">Low — focused MVP</option>
              <option value="medium">Medium</option>
              <option value="high">High — many integrations / compliance</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="timeline">
              Target timeline
            </label>
            <select
              id="timeline"
              className={fieldClass}
              value={timeline}
              onChange={(e) => setTimeline(e.target.value as typeof timeline)}
            >
              <option value="lt3m">Under 3 months</option>
              <option value="3to6m">3–6 months</option>
              <option value="6to12m">6–12 months</option>
              <option value="gt12m">12+ months</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="teamModel">
              Delivery model
            </label>
            <select
              id="teamModel"
              className={fieldClass}
              value={teamModel}
              onChange={(e) => setTeamModel(e.target.value as typeof teamModel)}
            >
              <option value="in_house">Mostly in-house</option>
              <option value="agency">Agency / studio</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-95 disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Generating…" : "Generate estimate"}
        </button>
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </form>
      <ResultBlock result={result} loading={loading} onCopy={onCopy} copied={copied} />
    </div>
  );
}

function VendorForm({
  onSubmit,
  loading,
  error,
  result,
  onCopy,
  copied,
}: {
  onSubmit: (f: Record<string, unknown>) => void;
  loading: boolean;
  error: string | null;
  result: string | null;
  onCopy: () => void;
  copied: boolean;
}) {
  const [stack, setStack] = useState("");
  const [region, setRegion] = useState("");
  const [budgetBand, setBudgetBand] = useState<
    "under25k" | "25to100k" | "100to250k" | "250kplus"
  >("25to100k");
  const [compliance, setCompliance] = useState("");

  return (
    <div className="space-y-8">
      <form
        className="space-y-5 rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ stack, region, budgetBand, compliance });
        }}
      >
        <div>
          <label className={labelClass} htmlFor="stack">
            Stack & tech context
          </label>
          <input
            id="stack"
            type="text"
            className={fieldClass}
            placeholder="e.g. React Native, Node, PostgreSQL, AWS"
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            required
            maxLength={400}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="region">
            Region / timezone preference
          </label>
          <input
            id="region"
            type="text"
            className={fieldClass}
            placeholder="e.g. Western Europe, US East, GCC, overlap with IST"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
            maxLength={200}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="budgetBand">
            Indicative budget band
          </label>
          <select
            id="budgetBand"
            className={fieldClass}
            value={budgetBand}
            onChange={(e) => setBudgetBand(e.target.value as typeof budgetBand)}
          >
            <option value="under25k">Under ~$25k</option>
            <option value="25to100k">~$25k–$100k</option>
            <option value="100to250k">~$100k–$250k</option>
            <option value="250kplus">$250k+</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="compliance">
            Compliance / security (optional)
          </label>
          <textarea
            id="compliance"
            className={`${fieldClass} min-h-[72px] resize-y`}
            placeholder="e.g. GDPR, SOC2 roadmap, on-prem constraints"
            value={compliance}
            onChange={(e) => setCompliance(e.target.value)}
            maxLength={500}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-95 disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Generating…" : "Generate checklist & questions"}
        </button>
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </form>
      <ResultBlock result={result} loading={loading} onCopy={onCopy} copied={copied} />
    </div>
  );
}

function OnePagerForm({
  onSubmit,
  loading,
  error,
  result,
  onCopy,
  copied,
}: {
  onSubmit: (f: Record<string, unknown>) => void;
  loading: boolean;
  error: string | null;
  result: string | null;
  onCopy: () => void;
  copied: boolean;
}) {
  const [problem, setProblem] = useState("");
  const [audience, setAudience] = useState("");
  const [solution, setSolution] = useState("");
  const [traction, setTraction] = useState("");
  const [ask, setAsk] = useState("");

  return (
    <div className="space-y-8">
      <form
        className="space-y-5 rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ problem, audience, solution, traction, ask });
        }}
      >
        <div>
          <label className={labelClass} htmlFor="problem">
            Problem
          </label>
          <textarea
            id="problem"
            className={`${fieldClass} min-h-[88px] resize-y`}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            required
            minLength={10}
            maxLength={2000}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="audience">
            Who it&apos;s for
          </label>
          <textarea
            id="audience"
            className={`${fieldClass} min-h-[72px] resize-y`}
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            required
            minLength={5}
            maxLength={1500}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="solution">
            Solution / product
          </label>
          <textarea
            id="solution"
            className={`${fieldClass} min-h-[88px] resize-y`}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            required
            minLength={10}
            maxLength={2000}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="traction">
            Traction (optional)
          </label>
          <textarea
            id="traction"
            className={`${fieldClass} min-h-[72px] resize-y`}
            placeholder="Metrics, pilots, revenue — be specific; we won’t invent numbers"
            value={traction}
            onChange={(e) => setTraction(e.target.value)}
            maxLength={1500}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="ask">
            Ask (optional)
          </label>
          <textarea
            id="ask"
            className={`${fieldClass} min-h-[72px] resize-y`}
            placeholder="Raise, intro, pilot, hire — what you want from the reader"
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            maxLength={1500}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-95 disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Generating…" : "Generate one-pager draft"}
        </button>
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </form>
      <ResultBlock result={result} loading={loading} onCopy={onCopy} copied={copied} />
    </div>
  );
}

function ResultBlock({
  result,
  loading,
  onCopy,
  copied,
}: {
  result: string | null;
  loading: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  if (!result && !loading) return null;
  return (
    <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-semibold text-white">Result</h2>
        {result && (
          <button
            type="button"
            onClick={onCopy}
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-white hover:border-[var(--color-primary)]/40"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      {loading && !result && (
        <p className="mt-4 text-sm text-[var(--color-muted)]">Drafting… this usually takes a few seconds.</p>
      )}
      {result && (
        <div className="mt-4 max-h-[min(70vh,720px)] overflow-y-auto rounded-xl bg-[var(--background)]/80 p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--color-muted)]">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
