export const FEATURE_FLAG_KEYS = [
  "maintenance_mode",
  "marketing_contact_form",
  "marketing_blog",
  "nav_tools",
  "floating_whatsapp",
  "dev_tools_code_playground",
] as const;

export type FeatureFlagKey = (typeof FEATURE_FLAG_KEYS)[number];

export type FeatureFlagDefinition = {
  key: FeatureFlagKey;
  label: string;
  description: string;
  category: "Site" | "Marketing";
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
    key: "marketing_blog",
    label: "Blog",
    description: "All routes under /blog.",
    category: "Marketing",
    defaultEnabled: true,
    envOverride: "FF_MARKETING_BLOG",
  },
  {
    key: "nav_tools",
    label: "Nav: Dev tools link",
    description: "Header link to /dev-tools (browser utilities).",
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
    key: "dev_tools_code_playground",
    label: "Dev tools: Code playground",
    description:
      "Public /dev-tools/code-playground (Monaco IDE + Piston runs). When off, the page is hidden, hub links removed, and playground runs return 403. Hub /api/run for interviews is unchanged.",
    category: "Site",
    defaultEnabled: true,
    envOverride: "FF_DEV_TOOLS_CODE_PLAYGROUND",
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
