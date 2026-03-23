export const FEATURE_FLAG_KEYS = [
  "maintenance_mode",
  "marketing_contact_form",
  "marketing_tools",
  "marketing_blog",
  "marketing_freebies",
  "nav_interview_hub",
  "nav_tools",
  "floating_whatsapp",
  "hub_database_api",
  "hub_allow_registration",
] as const;

export type FeatureFlagKey = (typeof FEATURE_FLAG_KEYS)[number];

export type FeatureFlagDefinition = {
  key: FeatureFlagKey;
  label: string;
  description: string;
  category: "Site" | "Marketing" | "Interview Hub";
  defaultEnabled: boolean;
  envOverride?: string;
};

export const FEATURE_FLAG_DEFINITIONS: readonly FeatureFlagDefinition[] = [
  {
    key: "maintenance_mode",
    label: "Maintenance mode",
    description:
      "Public site shows a maintenance page. Admin (/admin) stays reachable. With Vercel KV, this applies at the edge; with files only, also set MAINTENANCE_MODE=true in .env for local testing.",
    category: "Site",
    defaultEnabled: false,
    envOverride: "MAINTENANCE_MODE",
  },
  {
    key: "marketing_contact_form",
    label: "Contact form & page",
    description: "Contact page and POST /api/contact submissions.",
    category: "Marketing",
    defaultEnabled: true,
    envOverride: "FF_MARKETING_CONTACT_FORM",
  },
  {
    key: "marketing_tools",
    label: "Tools section",
    description: "All routes under /tools.",
    category: "Marketing",
    defaultEnabled: true,
    envOverride: "FF_MARKETING_TOOLS",
  },
  {
    key: "marketing_blog",
    label: "Blog",
    description: "All routes under /blog.",
    category: "Marketing",
    defaultEnabled: true,
    envOverride: "FF_MARKETING_BLOG",
  },
  {
    key: "marketing_freebies",
    label: "Freebies",
    description: "All routes under /freebies.",
    category: "Marketing",
    defaultEnabled: true,
    envOverride: "FF_MARKETING_FREEBIES",
  },
  {
    key: "nav_interview_hub",
    label: "Nav: Interview Hub link",
    description: "Header link to /hub (does not disable /hub if URL is known).",
    category: "Marketing",
    defaultEnabled: true,
    envOverride: "FF_NAV_INTERVIEW_HUB",
  },
  {
    key: "nav_tools",
    label: "Nav: Tools link",
    description: "Header link to /tools.",
    category: "Marketing",
    defaultEnabled: true,
    envOverride: "FF_NAV_TOOLS",
  },
  {
    key: "floating_whatsapp",
    label: "Floating WhatsApp button",
    description: "Global floating chat button (requires NEXT_PUBLIC_WHATSAPP_NUMBER).",
    category: "Marketing",
    defaultEnabled: true,
    envOverride: "FF_FLOATING_WHATSAPP",
  },
  {
    key: "hub_database_api",
    label: "Hub database APIs",
    description:
      "Prisma-backed hub APIs (questions, submit, jobs, …). HUB_BACKEND_FULL=false in env always disables regardless of this toggle.",
    category: "Interview Hub",
    defaultEnabled: true,
    envOverride: "FF_HUB_DATABASE_API",
  },
  {
    key: "hub_allow_registration",
    label: "Hub: allow sign-up",
    description: "POST /api/register. OAuth may still need separate app configuration.",
    category: "Interview Hub",
    defaultEnabled: true,
    envOverride: "FF_HUB_ALLOW_REGISTRATION",
  },
] as const;

function parseEnvOverride(envName: string | undefined): boolean | undefined {
  if (!envName) return undefined;
  const raw = process.env[envName];
  if (raw === undefined || raw === "") return undefined;
  const v = raw.trim().toLowerCase();
  if (v === "true" || v === "1" || v === "yes" || v === "on") return true;
  if (v === "false" || v === "0" || v === "no" || v === "off") return false;
  return undefined;
}

export function resolveFeatureFlagsFromStored(
  stored: Record<string, boolean>,
): Record<FeatureFlagKey, boolean> {
  const out = {} as Record<FeatureFlagKey, boolean>;
  for (const def of FEATURE_FLAG_DEFINITIONS) {
    const fromEnv = parseEnvOverride(def.envOverride);
    if (fromEnv !== undefined) {
      out[def.key] = fromEnv;
      continue;
    }
    if (typeof stored[def.key] === "boolean") {
      out[def.key] = stored[def.key] as boolean;
      continue;
    }
    out[def.key] = def.defaultEnabled;
  }
  return out;
}
