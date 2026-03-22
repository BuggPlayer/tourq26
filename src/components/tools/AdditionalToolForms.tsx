"use client";

import { useState } from "react";
import { fieldClass, labelClass } from "./form-ui";

type FormShellProps = {
  onSubmit: (f: Record<string, unknown>) => void;
  loading: boolean;
  error: string | null;
  result: string | null;
  onCopy: () => void;
  copied: boolean;
  submitLabel: string;
  children: React.ReactNode;
};

/** Wrapper that passes fields from local state on submit */
function FormShellFields({
  onSubmit,
  loading,
  error,
  submitLabel,
  children,
  getFields,
}: Omit<FormShellProps, "result" | "onCopy" | "copied"> & {
  getFields: () => Record<string, unknown>;
}) {
  return (
    <form
      className="space-y-5 rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(getFields());
      }}
    >
      {children}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-95 disabled:opacity-50 sm:w-auto"
      >
        {loading ? "Generating…" : submitLabel}
      </button>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export function RfpForm(props: Omit<FormShellProps, "submitLabel" | "children">) {
  const { onSubmit, loading, error, result, onCopy, copied } = props;
  const [orgName, setOrgName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [objectives, setObjectives] = useState("");
  const [scope, setScope] = useState("");
  const [timeline, setTimeline] = useState<
    "lt3m" | "3to6m" | "6to12m" | "gt12m" | "flexible"
  >("3to6m");
  const [budgetBand, setBudgetBand] = useState<
    "under25k" | "25to100k" | "100to250k" | "250kplus"
  >("25to100k");
  const [techNeeds, setTechNeeds] = useState("");
  const [constraints, setConstraints] = useState("");
  const [evaluationNotes, setEvaluationNotes] = useState("");

  return (
    <div className="space-y-8">
      <FormShellFields
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        submitLabel="Generate RFP / brief"
        getFields={() => ({
          orgName,
          projectTitle,
          summary,
          objectives,
          scope,
          timeline,
          budgetBand,
          techNeeds,
          constraints,
          evaluationNotes,
        })}
      >
        <div>
          <label className={labelClass} htmlFor="orgName">
            Organization name
          </label>
          <input
            id="orgName"
            className={fieldClass}
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
            maxLength={200}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="projectTitle">
            Project title
          </label>
          <input
            id="projectTitle"
            className={fieldClass}
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            required
            maxLength={200}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="summary">
            Executive summary
          </label>
          <textarea
            id="summary"
            className={`${fieldClass} min-h-[100px] resize-y`}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            minLength={20}
            maxLength={2500}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="objectives">
            Business objectives
          </label>
          <textarea
            id="objectives"
            className={`${fieldClass} min-h-[80px] resize-y`}
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            required
            minLength={10}
            maxLength={2000}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="scope">
            Scope & deliverables
          </label>
          <textarea
            id="scope"
            className={`${fieldClass} min-h-[120px] resize-y`}
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            required
            minLength={10}
            maxLength={3000}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="timeline">
              Timeline
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
              <option value="flexible">Flexible</option>
            </select>
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
        </div>
        <div>
          <label className={labelClass} htmlFor="techNeeds">
            Technical requirements
          </label>
          <textarea
            id="techNeeds"
            className={`${fieldClass} min-h-[80px] resize-y`}
            value={techNeeds}
            onChange={(e) => setTechNeeds(e.target.value)}
            required
            minLength={5}
            maxLength={1500}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="constraints">
            Constraints (optional)
          </label>
          <textarea
            id="constraints"
            className={`${fieldClass} min-h-[72px] resize-y`}
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            maxLength={1500}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="evaluationNotes">
            How you want to evaluate vendors (optional)
          </label>
          <textarea
            id="evaluationNotes"
            className={`${fieldClass} min-h-[72px] resize-y`}
            value={evaluationNotes}
            onChange={(e) => setEvaluationNotes(e.target.value)}
            maxLength={1200}
          />
        </div>
      </FormShellFields>
      <ResultBlock result={result} loading={loading} onCopy={onCopy} copied={copied} />
    </div>
  );
}

export function TechStackForm(props: Omit<FormShellProps, "submitLabel" | "children">) {
  const { onSubmit, loading, error, result, onCopy, copied } = props;
  const [stage, setStage] = useState<"idea" | "mvp" | "growth" | "scale">("mvp");
  const [engTeamSize, setEngTeamSize] = useState<
    "solo" | "small_2_5" | "medium_6_20" | "large_20plus"
  >("small_2_5");
  const [loadBand, setLoadBand] = useState<
    "unknown" | "low" | "medium" | "high" | "spiky"
  >("unknown");
  const [spendPosture, setSpendPosture] = useState<
    "minimize_ops_cost" | "balanced" | "prioritize_velocity"
  >("balanced");
  const [compliance, setCompliance] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-8">
      <FormShellFields
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        submitLabel="Generate stack analysis"
        getFields={() => ({
          stage,
          engTeamSize,
          loadBand,
          spendPosture,
          compliance,
          notes,
        })}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="stage">
              Company / product stage
            </label>
            <select
              id="stage"
              className={fieldClass}
              value={stage}
              onChange={(e) => setStage(e.target.value as typeof stage)}
            >
              <option value="idea">Idea / pre-product</option>
              <option value="mvp">MVP / early</option>
              <option value="growth">Growth</option>
              <option value="scale">Scale</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="engTeamSize">
              Engineering team size
            </label>
            <select
              id="engTeamSize"
              className={fieldClass}
              value={engTeamSize}
              onChange={(e) => setEngTeamSize(e.target.value as typeof engTeamSize)}
            >
              <option value="solo">Solo / founder-engineer</option>
              <option value="small_2_5">2–5</option>
              <option value="medium_6_20">6–20</option>
              <option value="large_20plus">20+</option>
            </select>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="loadBand">
              Traffic / load (expected)
            </label>
            <select
              id="loadBand"
              className={fieldClass}
              value={loadBand}
              onChange={(e) => setLoadBand(e.target.value as typeof loadBand)}
            >
              <option value="unknown">Unknown</option>
              <option value="low">Low / internal</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="spiky">Spiky / burst</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="spendPosture">
              Spend posture
            </label>
            <select
              id="spendPosture"
              className={fieldClass}
              value={spendPosture}
              onChange={(e) => setSpendPosture(e.target.value as typeof spendPosture)}
            >
              <option value="minimize_ops_cost">Minimize ops cost</option>
              <option value="balanced">Balanced</option>
              <option value="prioritize_velocity">Prioritize velocity (managed OK)</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="compliance">
            Compliance / data (optional)
          </label>
          <textarea
            id="compliance"
            className={`${fieldClass} min-h-[72px] resize-y`}
            value={compliance}
            onChange={(e) => setCompliance(e.target.value)}
            maxLength={600}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="notes">
            Current stack or preferences (optional)
          </label>
          <textarea
            id="notes"
            className={`${fieldClass} min-h-[72px] resize-y`}
            placeholder="e.g. Team strong in TypeScript; avoid Kubernetes for now"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={800}
          />
        </div>
      </FormShellFields>
      <ResultBlock result={result} loading={loading} onCopy={onCopy} copied={copied} />
    </div>
  );
}

export function FounderOnePagerForm(props: Omit<FormShellProps, "submitLabel" | "children">) {
  const { onSubmit, loading, error, result, onCopy, copied } = props;
  const [fullName, setFullName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyOneLiner, setCompanyOneLiner] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [traction, setTraction] = useState("");
  const [teamNote, setTeamNote] = useState("");
  const [fundingStage, setFundingStage] = useState<
    "bootstrapped" | "pre_seed" | "seed" | "series_a" | "later" | "undisclosed"
  >("seed");
  const [ask, setAsk] = useState("");

  return (
    <div className="space-y-8">
      <FormShellFields
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        submitLabel="Generate investor one-pager"
        getFields={() => ({
          fullName,
          roleTitle,
          companyName,
          companyOneLiner,
          problem,
          solution,
          traction,
          teamNote,
          fundingStage,
          ask,
        })}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="fullName">
              Your name
            </label>
            <input
              id="fullName"
              className={fieldClass}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              maxLength={120}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="frole">
              Title / role
            </label>
            <input
              id="frole"
              className={fieldClass}
              placeholder="e.g. Co-founder & CEO"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              required
              maxLength={120}
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="companyName">
            Company name
          </label>
          <input
            id="companyName"
            className={fieldClass}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            maxLength={120}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="companyOneLiner">
            One-line company description
          </label>
          <input
            id="companyOneLiner"
            className={fieldClass}
            value={companyOneLiner}
            onChange={(e) => setCompanyOneLiner(e.target.value)}
            required
            minLength={5}
            maxLength={240}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="fproblem">
            Problem
          </label>
          <textarea
            id="fproblem"
            className={`${fieldClass} min-h-[88px] resize-y`}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            required
            minLength={10}
            maxLength={1800}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="fsolution">
            Solution / product
          </label>
          <textarea
            id="fsolution"
            className={`${fieldClass} min-h-[88px] resize-y`}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            required
            minLength={10}
            maxLength={1800}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="ftraction">
            Traction (optional)
          </label>
          <textarea
            id="ftraction"
            className={`${fieldClass} min-h-[72px] resize-y`}
            value={traction}
            onChange={(e) => setTraction(e.target.value)}
            maxLength={1200}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="teamNote">
            Team highlights (optional)
          </label>
          <textarea
            id="teamNote"
            className={`${fieldClass} min-h-[72px] resize-y`}
            value={teamNote}
            onChange={(e) => setTeamNote(e.target.value)}
            maxLength={800}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="fundingStage">
            Funding stage
          </label>
          <select
            id="fundingStage"
            className={fieldClass}
            value={fundingStage}
            onChange={(e) => setFundingStage(e.target.value as typeof fundingStage)}
          >
            <option value="bootstrapped">Bootstrapped</option>
            <option value="pre_seed">Pre-seed</option>
            <option value="seed">Seed</option>
            <option value="series_a">Series A</option>
            <option value="later">Later stage</option>
            <option value="undisclosed">Undisclosed</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="fask">
            Ask (optional)
          </label>
          <textarea
            id="fask"
            className={`${fieldClass} min-h-[72px] resize-y`}
            placeholder="Raise amount, intros, hiring…"
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            maxLength={800}
          />
        </div>
      </FormShellFields>
      <ResultBlock result={result} loading={loading} onCopy={onCopy} copied={copied} />
    </div>
  );
}

export function JobPostForm(props: Omit<FormShellProps, "submitLabel" | "children">) {
  const { onSubmit, loading, error, result, onCopy, copied } = props;
  const [roleTitle, setRoleTitle] = useState("");
  const [companyOneLiner, setCompanyOneLiner] = useState("");
  const [seniority, setSeniority] = useState<
    "junior" | "mid" | "senior" | "lead" | "principal"
  >("senior");
  const [employmentType, setEmploymentType] = useState<
    "full_time" | "contract" | "contract_to_hire"
  >("full_time");
  const [workStyle, setWorkStyle] = useState<
    "remote" | "hybrid" | "onsite" | "flexible"
  >("remote");
  const [stack, setStack] = useState("");
  const [aboutMission, setAboutMission] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");

  return (
    <div className="space-y-8">
      <FormShellFields
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        submitLabel="Generate job post"
        getFields={() => ({
          roleTitle,
          companyOneLiner,
          seniority,
          employmentType,
          workStyle,
          stack,
          aboutMission,
          responsibilities,
          requirements,
          benefits,
        })}
      >
        <div>
          <label className={labelClass} htmlFor="jtitle">
            Job title
          </label>
          <input
            id="jtitle"
            className={fieldClass}
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            required
            maxLength={120}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="jcompany">
            Company one-liner
          </label>
          <input
            id="jcompany"
            className={fieldClass}
            placeholder="What you build + who for"
            value={companyOneLiner}
            onChange={(e) => setCompanyOneLiner(e.target.value)}
            required
            minLength={5}
            maxLength={400}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="seniority">
              Seniority
            </label>
            <select
              id="seniority"
              className={fieldClass}
              value={seniority}
              onChange={(e) => setSeniority(e.target.value as typeof seniority)}
            >
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="principal">Principal</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="employmentType">
              Employment
            </label>
            <select
              id="employmentType"
              className={fieldClass}
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as typeof employmentType)}
            >
              <option value="full_time">Full-time</option>
              <option value="contract">Contract</option>
              <option value="contract_to_hire">Contract-to-hire</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="workStyle">
              Work style
            </label>
            <select
              id="workStyle"
              className={fieldClass}
              value={workStyle}
              onChange={(e) => setWorkStyle(e.target.value as typeof workStyle)}
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="jstack">
            Stack / technologies
          </label>
          <input
            id="jstack"
            className={fieldClass}
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            required
            maxLength={500}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="aboutMission">
            About the company & mission
          </label>
          <textarea
            id="aboutMission"
            className={`${fieldClass} min-h-[100px] resize-y`}
            value={aboutMission}
            onChange={(e) => setAboutMission(e.target.value)}
            required
            minLength={10}
            maxLength={2000}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="responsibilities">
            Responsibilities (bullets or prose)
          </label>
          <textarea
            id="responsibilities"
            className={`${fieldClass} min-h-[120px] resize-y`}
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            required
            minLength={20}
            maxLength={3000}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="requirements">
            Must-have requirements (optional)
          </label>
          <textarea
            id="requirements"
            className={`${fieldClass} min-h-[80px] resize-y`}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            maxLength={2000}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="benefits">
            Benefits / perks (optional)
          </label>
          <textarea
            id="benefits"
            className={`${fieldClass} min-h-[72px] resize-y`}
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            maxLength={1200}
          />
        </div>
      </FormShellFields>
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
