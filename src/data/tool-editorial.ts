export type ToolFaq = { q: string; a: string };

export type ToolEditorial = {
  metaTitle: string;
  metaDescription: string;
  /** Short lead under H1 */
  intro: string;
  methodology: string[];
  faqs: ToolFaq[];
};

export const toolEditorial: Record<string, ToolEditorial> = {
  "app-budget-estimator": {
    metaTitle: "App & software budget estimator (ranges & assumptions)",
    metaDescription:
      "Free AI-assisted budget ranges for mobile apps and custom software. Understand cost drivers — not a formal quote. From Torq Studio.",
    intro:
      "Use this to sanity-check scope before you talk to vendors or investors. Outputs are indicative ranges based on your inputs, not a binding estimate.",
    methodology: [
      "We combine typical market patterns for agency and hybrid delivery with the complexity, platforms, and timeline you describe.",
      "Ranges intentionally wide where information is thin — tightening an estimate always needs discovery, design, and often a technical spike.",
      "For a firm quote or milestone plan, book a short call with our team after you have a brief or backlog.",
    ],
    faqs: [
      {
        q: "Is this a quote from Torq Studio?",
        a: "No. It is an educational range to help you plan. A real quote depends on detailed requirements, design, and delivery model.",
      },
      {
        q: "Why are the ranges so wide?",
        a: "Software cost varies sharply with integrations, compliance, design depth, and quality bar. Wider ranges reflect that uncertainty until scope is defined.",
      },
      {
        q: "What should I do next?",
        a: "Use our vendor evaluation tool and project brief resources, then speak with 2–3 shortlisted partners with a clear brief.",
      },
    ],
  },
  "vendor-evaluation": {
    metaTitle: "Software vendor & dev partner evaluation tool",
    metaDescription:
      "Generate a criteria checklist and discovery-call questions for choosing a software development partner. Free AI tool from Torq Studio.",
    intro:
      "Choosing a partner is about fit, communication, and delivery discipline — not just hourly rates. This tool turns your context into actionable questions.",
    methodology: [
      "Outputs emphasize governance: ownership, testing, releases, security, and how scope changes are handled.",
      "We suggest questions you can ask consistently across vendors so answers are comparable.",
      "Pair this with our free Mobile App Development Partner Checklist for a printable baseline.",
    ],
    faqs: [
      {
        q: "Can this replace a formal RFP?",
        a: "It helps you prepare for conversations and shortlists. For larger buys, combine it with a written brief or RFP your legal team approves.",
      },
      {
        q: "How do I use the output?",
        a: "Bring the checklist to discovery calls. Score answers privately afterward; avoid sharing one vendor’s answers with another.",
      },
    ],
  },
  "one-pager-pitch": {
    metaTitle: "One-pager pitch generator for founders",
    metaDescription:
      "Draft a clear founder narrative: problem, audience, solution, traction, and ask. Edit and share — free AI tool from Torq Studio.",
    intro:
      "Investors and partners skim fast. This generator produces a tight narrative you should edit until every line reflects your voice and facts.",
    methodology: [
      "Structure follows common partner and angel expectations: problem clarity, who cares, what you built, evidence, and what you need.",
      "We avoid inventing metrics — you supply traction; the model will not fabricate revenue or user numbers.",
      "For fundraising materials beyond a one-pager, treat this as a first draft only.",
    ],
    faqs: [
      {
        q: "Will the AI invent traction numbers?",
        a: "It should not. Always replace any placeholder with verified metrics and get sign-off from your team before sending externally.",
      },
      {
        q: "Is this legal or investment advice?",
        a: "No. It is drafting help only. Consult qualified advisors for securities, tax, and legal matters.",
      },
    ],
  },
  "rfp-drafter": {
    metaTitle: "Software RFP & project brief generator",
    metaDescription:
      "Draft an RFP or project brief for custom software: scope, technical expectations, commercial outline, and evaluation criteria. Free AI tool from Torq Studio.",
    intro:
      "A solid RFP reduces mismatch and rework. This generator structures what vendors need to quote fairly — you still need legal and procurement review for regulated buys.",
    methodology: [
      "Sections follow common B2B software procurement: background, scope, delivery expectations, commercial model ask, and how proposals will be scored.",
      "We do not invent certifications or compliance claims your organization does not have.",
      "Pair with our blog on writing RFPs for custom software and the vendor evaluation tool for shortlists.",
    ],
    faqs: [
      {
        q: "Is this legally binding?",
        a: "No. It is a drafting aid. Have counsel review before you issue an RFP in regulated or high-value contexts.",
      },
      {
        q: "Can I send this as-is?",
        a: "Treat it as a first draft. Add your boilerplate, NDA process, and any mandatory vendor forms your company requires.",
      },
    ],
  },
  "tech-stack-roi": {
    metaTitle: "Tech stack trade-offs & scalability (startup)",
    metaDescription:
      "Reason about monolith vs services, ops burden, and risks for your stage — not fake dollar ROI. Free educational AI tool from Torq Studio.",
    intro:
      "Choosing stack is about trade-offs: velocity, hiring, cost, and failure modes. This tool gives a structured opinion you should validate with your team and a solutions architect for large bets.",
    methodology: [
      "Output emphasizes architecture posture and operational load rather than hype or brand loyalty.",
      "We explicitly avoid fabricated financial ROI — use real numbers from your finance team for business cases.",
      "Triggers for revisiting the stack help you plan reviews as team size and traffic change.",
    ],
    faqs: [
      {
        q: "Is this architecture sign-off?",
        a: "No. It is educational. Critical systems need design review, threat modeling, and capacity planning with qualified engineers.",
      },
      {
        q: "Why no dollar ROI?",
        a: "Credible ROI needs your cost base, revenue model, and risk tolerance. Generic numbers would mislead.",
      },
    ],
  },
  "interview-prep": {
    metaTitle: "Technical interview prep — tracks, Q&A, industry bar",
    metaDescription:
      "Pick tracks (frontend, backend, system design, DevOps, mobile, data/ML, security), set industry bar, get structured Q&A or hiring packs. Copy, share, self-rate locally. Free tool from Torq Studio.",
    intro:
      "Choose 1–4 tracks and an industry calibration (startup vs big tech vs enterprise). Candidate mode returns per-track questions with reference answers and a study plan. Hiring mode returns a scorecard, rounds, and rubric-style questions. Star ratings are stored only in your browser.",
    methodology: [
      "Output is structured JSON from the model, then rendered as cards so you can copy one question, the full Q+A, or share via the device share sheet when available.",
      "Framework focus (e.g. React) nudges frontend questions toward that stack when you select Frontend.",
      "Hiring mode emphasizes lawful, job-related questions; pair with your HR guidelines.",
    ],
    faqs: [
      {
        q: "Will this cover my company’s legal interview rules?",
        a: "No. Use your HR and counsel for jurisdiction-specific requirements.",
      },
      {
        q: "Where are my star ratings stored?",
        a: "Only in your browser (localStorage) on this device. They are not sent to Torq Studio.",
      },
      {
        q: "Candidate mode: is this enough to pass?",
        a: "It is a study scaffold. Deep practice, real system design, and coding practice still matter.",
      },
    ],
  },
  "founder-one-pager": {
    metaTitle: "Founder investor one-pager & intro sheet",
    metaDescription:
      "Generate a tight investor-ready one-pager: problem, solution, traction, team, ask. Edit before sending. From Torq Studio.",
    intro:
      "Different from a long narrative pitch: this is a single-page intro suitable for forwards and first meetings. Every metric must be yours — we do not invent traction.",
    methodology: [
      "Sections map to what many angels and seed funds skim first: clarity, evidence, and a specific ask.",
      "Use alongside our general one-pager pitch tool if you want a longer story variant.",
      "Export: copy into Docs or Notion; PDF export can be added later.",
    ],
    faqs: [
      {
        q: "How is this different from the one-pager pitch tool?",
        a: "This one is formatted as a founder/company intro sheet with name, role, and funding stage fields. The pitch tool is a looser narrative flow.",
      },
      {
        q: "Can I send this to investors immediately?",
        a: "Only after you verify every fact, align with co-founders, and comply with securities rules in your jurisdiction.",
      },
    ],
  },
  "job-post-generator": {
    metaTitle: "Engineering job post generator",
    metaDescription:
      "Draft inclusive engineering job posts with clear responsibilities, bar, and benefits. Edit and publish. Free AI tool from Torq Studio.",
    intro:
      "Good posts attract the right applicants and reduce noise. This generator turns your inputs into a structured post — tune tone to your brand and run past hiring managers and HR.",
    methodology: [
      "Structure follows common high-signal posts: hook, scope, expectations, stack, and how to apply.",
      "We aim for inclusive wording; your policies and legal team should review EEO and compensation statements.",
      "Works well with our interview prep tool in hiring-manager mode for the next step.",
    ],
    faqs: [
      {
        q: "Does this meet legal hiring requirements?",
        a: "It is a draft. Compliance depends on your location and company policies — involve HR/legal where needed.",
      },
      {
        q: "Can I use it for non-engineering roles?",
        a: "You can try by adjusting the stack field to domain skills, but the prompts are optimized for software roles.",
      },
    ],
  },
};
