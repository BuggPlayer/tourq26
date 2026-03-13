import type { ReactNode } from "react";

export function getFreebieContent(slug: string): (() => ReactNode) | null {
  const map: Record<string, () => ReactNode> = {
    "mobile-app-partner-checklist": () => <MobileAppChecklist />,
    "project-brief-template": () => <ProjectBriefTemplate />,
    "app-pre-launch-checklist": () => <PreLaunchChecklist />,
    "build-vs-buy-vs-partner-guide": () => <BuildVsBuyGuide />,
  };
  return map[slug] ?? null;
}

function MobileAppChecklist() {
  return (
    <>
      <p>Use this checklist when evaluating a mobile app development partner. Tick each item as you verify it.</p>
      <h2>Portfolio & experience</h2>
      <ul>
        <li>They have shipped apps similar to yours (industry, scale, or tech stack).</li>
        <li>You can see or try live apps (App Store / Play Store links).</li>
        <li>They’ve provided 1–2 references you can contact.</li>
      </ul>
      <h2>Process & communication</h2>
      <ul>
        <li>Clear process: discovery, sprints, milestones, and handover.</li>
        <li>Single point of contact and regular update cadence.</li>
        <li>Written contract with scope, timeline, payment terms, and IP ownership.</li>
      </ul>
      <h2>Technical & quality</h2>
      <ul>
        <li>Modern stack (e.g. React Native, Flutter, or native) with a maintenance plan.</li>
        <li>QA and testing strategy (manual and/or automated).</li>
        <li>Post-launch support and iteration options.</li>
      </ul>
      <h2>Red flags</h2>
      <ul>
        <li>Vague estimates or “we’ll figure it out as we go” with no scope.</li>
        <li>No contract or unclear ownership of code and design.</li>
        <li>No access to repos or design files.</li>
      </ul>
    </>
  );
}

function ProjectBriefTemplate() {
  return (
    <>
      <p>Fill this out before kicking off a project. Share it with your development partner so everyone is aligned.</p>
      <h2>Project overview</h2>
      <ul>
        <li><strong>Product name:</strong> _______________________</li>
        <li><strong>One-line description:</strong> _______________________</li>
        <li><strong>Goal (what success looks like):</strong> _______________________</li>
      </ul>
      <h2>Audience & use case</h2>
      <ul>
        <li><strong>Who is it for?</strong> _______________________</li>
        <li><strong>Main use case (in one sentence):</strong> _______________________</li>
      </ul>
      <h2>Scope</h2>
      <ul>
        <li><strong>Platforms:</strong> [ ] iOS  [ ] Android  [ ] Web  [ ] Other: _______</li>
        <li><strong>Must-have features (list 3–5):</strong> _______________________</li>
        <li><strong>Out of scope for v1:</strong> _______________________</li>
      </ul>
      <h2>Timeline & budget</h2>
      <ul>
        <li><strong>Target launch (date or quarter):</strong> _______________________</li>
        <li><strong>Budget range or constraints:</strong> _______________________</li>
      </ul>
      <h2>Stakeholders</h2>
      <ul>
        <li><strong>Decision-maker:</strong> _______________________</li>
        <li><strong>Day-to-day contact:</strong> _______________________</li>
      </ul>
    </>
  );
}

function PreLaunchChecklist() {
  return (
    <>
      <p>Run through this before you submit to the stores or go live. Adjust for web if you’re not shipping a native app.</p>
      <h2>Testing</h2>
      <ul>
        <li>All critical user flows tested on real devices (not just simulators).</li>
        <li>Test on minimum supported OS versions.</li>
        <li>Performance acceptable on low-end devices.</li>
        <li>Offline or poor-network behavior considered (if relevant).</li>
      </ul>
      <h2>Store listing (iOS / Android)</h2>
      <ul>
        <li>App name, short description, and long description finalized.</li>
        <li>Screenshots for required device sizes.</li>
        <li>Privacy policy URL set and live.</li>
        <li>Support URL or contact for the store listing.</li>
      </ul>
      <h2>Legal & compliance</h2>
      <ul>
        <li>Privacy policy and terms of service published and linked.</li>
        <li>Cookie or consent flows implemented if required (e.g. GDPR).</li>
        <li>Data handling (storage, third parties) documented.</li>
      </ul>
      <h2>Launch day</h2>
      <ul>
        <li>Monitoring and error reporting in place.</li>
        <li>Support channel (email, chat, or in-app) ready.</li>
        <li>Rollback or hotfix process agreed with the team.</li>
      </ul>
    </>
  );
}

function BuildVsBuyGuide() {
  return (
    <>
      <p>A short guide to help you decide whether to build in-house, buy off-the-shelf, or work with a technology partner.</p>
      <h2>Build in-house</h2>
      <p><strong>When it fits:</strong> You need full control, the product is core to your business, and you have (or can hire) the right team. Best for long-term, evolving products.</p>
      <p><strong>Trade-off:</strong> Higher fixed cost, hiring and retention overhead, and slower to start unless you already have capacity.</p>
      <h2>Buy (off-the-shelf)</h2>
      <p><strong>When it fits:</strong> Your needs align with what existing tools do (CRM, email, analytics, simple websites). Fast to deploy and often cheaper at low scale.</p>
      <p><strong>Trade-off:</strong> Less customization, vendor lock-in, and you may outgrow the tool or hit limits.</p>
      <h2>Partner (outsource / dedicated team)</h2>
      <p><strong>When it fits:</strong> You need custom software (app, platform, integration) but don’t want to hire a full team. You want to move fast and keep ownership of the product.</p>
      <p><strong>Trade-off:</strong> You depend on the partner’s quality and communication; choose carefully and have a clear brief and contract.</p>
      <h2>Quick decision guide</h2>
      <ul>
        <li><strong>Generic need, low customization</strong> → Prefer buy.</li>
        <li><strong>Core product, long-term</strong> → Build (in-house or with a partner for the build, then maintain in-house if you prefer).</li>
        <li><strong>Custom product, need speed, no in-house devs</strong> → Partner.</li>
      </ul>
    </>
  );
}
