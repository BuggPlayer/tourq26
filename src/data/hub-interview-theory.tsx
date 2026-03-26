/**
 * Interview-oriented theory copy for candidate hub tracks (read alongside practice).
 */

export function JavaScriptInterviewTheory() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
      <h3 className="text-base font-semibold text-primary">
        How interviewers think about JavaScript
      </h3>
      <p>
        Expect <strong>runtime + language</strong> questions alongside small
        coding exercises. Be ready to narrate your approach before you type:
        inputs, outputs, edge cases, then complexity.
      </p>
      <ul className="list-inside list-disc space-y-2 text-muted-foreground">
        <li>
          <strong className="text-foreground/90">Execution model</strong> — Call stack,
          microtasks (Promises) vs macrotasks (<code className="text-primary">setTimeout</code>),
          and why order matters in async snippets.
        </li>
        <li>
          <strong className="text-foreground/90">Scope & closures</strong> — Lexical
          scope, closure over variables in loops, and common “what logs?” traps.
        </li>
        <li>
          <strong className="text-foreground/90">Reference vs value</strong> — Objects
          and arrays passed by reference; mutating vs copying for immutability in
          React-style updates.
        </li>
        <li>
          <strong className="text-foreground/90">Arrays & maps</strong> — Two-pointer
          patterns, prefix sums, hash maps for O(n) lookups — say the invariant
          you maintain in the loop.
        </li>
        <li>
          <strong className="text-foreground/90">DOM & events</strong> — Event
          delegation, <code className="text-primary">preventDefault</code> vs{" "}
          <code className="text-primary">stopPropagation</code>, and basic
          accessibility (focus, labels).
        </li>
      </ul>
      <p className="text-xs text-muted-foreground">
        In the editor: use <strong className="text-muted-foreground">Run</strong> for
        quick feedback from the sandbox, then <strong className="text-muted-foreground">Submit</strong>{" "}
        when you want automated checks and coaching-style feedback.
      </p>
    </div>
  );
}

export function ReactInterviewTheory() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
      <h3 className="text-base font-semibold text-primary">
        React rounds: what to rehearse
      </h3>
      <p>
        UI interviews often mix <strong>small component builds</strong> with{" "}
        <strong>concept questions</strong> (hooks, rendering, performance). Read
        the brief, confirm behaviour with the interviewer, then implement in small
        steps.
      </p>
      <ul className="list-inside list-disc space-y-2 text-muted-foreground">
        <li>
          <strong className="text-foreground/90">Hooks rules</strong> — Only call hooks
          at the top level; stable dependency arrays in{" "}
          <code className="text-primary">useEffect</code> /{" "}
          <code className="text-primary">useMemo</code> /{" "}
          <code className="text-primary">useCallback</code>.
        </li>
        <li>
          <strong className="text-foreground/90">State vs props</strong> — Lift state
          when multiple children need the same source of truth; keep derived values
          computed during render when possible.
        </li>
        <li>
          <strong className="text-foreground/90">Reconciliation & keys</strong> — Why
          list keys must be stable; avoid using array index as key when order
          changes.
        </li>
        <li>
          <strong className="text-foreground/90">Controlled inputs</strong> — Pattern
          for forms: value + onChange; tie to validation and accessibility
          (<code className="text-primary">aria-*</code>, labels).
        </li>
        <li>
          <strong className="text-foreground/90">Performance story</strong> — When you
          would memoize, split bundles, or virtualize long lists — tie answers to
          measurable pain (slow TTI, janky scroll).
        </li>
      </ul>
      <p className="text-xs text-muted-foreground">
        UI challenges open a <strong className="text-muted-foreground">live preview</strong>{" "}
        and Monaco editor: edit HTML/JSX-style markup, then use Submit to run
        structure checks.
      </p>
    </div>
  );
}
