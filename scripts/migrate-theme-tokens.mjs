/**
 * One-off migration: legacy CSS var() + slate/cyan in classNames → semantic theme utilities.
 * Run: node scripts/migrate-theme-tokens.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "src");

const REPLACEMENTS = [
  // Marketing / pages — var() forms (longest first)
  [/text-\[var\(--color-primary-hover\)\]/g, "text-primary-hover"],
  [/hover:text-\[var\(--color-primary-hover\)\]/g, "hover:text-primary-hover"],
  [/bg-\[var\(--color-primary-hover\)\]/g, "bg-primary-hover"],
  [/hover:bg-\[var\(--color-primary-hover\)\]/g, "hover:bg-primary-hover"],
  [/from-\[var\(--color-primary-hover\)\]/g, "from-primary-hover"],
  [/via-\[var\(--color-primary-hover\)\]/g, "via-primary-hover"],
  [/to-\[var\(--color-primary-hover\)\]/g, "to-primary-hover"],
  [/text-\[var\(--color-accent\)\]/g, "text-accent"],
  [/bg-\[var\(--color-accent\)\]/g, "bg-accent"],
  [/from-\[var\(--color-accent\)\]/g, "from-accent"],
  [/to-\[var\(--color-accent\)\]/g, "to-accent"],
  [/bg-\[var\(--color-accent\)\]/g, "bg-accent"],
  [/bg-\[var\(--color-primary-muted\)\]/g, "bg-primary-muted"],
  [/border-\[var\(--color-primary\)\]/g, "border-primary"],
  [/ring-\[var\(--color-primary\)\]/g, "ring-primary"],
  [/text-\[var\(--color-primary\)\]/g, "text-primary"],
  [/hover:text-\[var\(--color-primary\)\]/g, "hover:text-primary"],
  [/bg-\[var\(--color-primary\)\]/g, "bg-primary"],
  [/from-\[var\(--color-primary\)\]/g, "from-primary"],
  [/via-\[var\(--color-primary\)\]/g, "via-primary"],
  [/to-\[var\(--color-primary\)\]/g, "to-primary"],
  [/text-\[var\(--color-muted\)\]/g, "text-muted-foreground"],
  [/bg-\[var\(--background\)\]/g, "bg-background"],
  [/from-\[var\(--background\)\]/g, "from-background"],
  [/to-\[var\(--background\)\]/g, "to-background"],
  [/bg-\[var\(--surface\)\]/g, "bg-surface"],
  [/bg-\[var\(--color-surface\)\]/g, "bg-surface"],
  [/bg-\[var\(--color-surface-elevated\)\]/g, "bg-surface-elevated"],
  [/border-\[var\(--color-border\)\]/g, "border-border"],
  [/text-\[var\(--background\)\]/g, "text-primary-foreground"],
  [/bg-\[var\(--surface\)\]\/90/g, "bg-surface/90"],
  [/bg-\[var\(--color-surface\)\]\/90/g, "bg-surface/90"],
  // opacity / partial
  [/text-\[var\(--color-primary\)\]\/95/g, "text-primary/95"],
  [/text-\[var\(--color-primary\)\]\/25/g, "text-primary/25"],
  [/bg-\[var\(--color-primary\)\]\/15/g, "bg-primary/15"],
  [/bg-\[var\(--color-primary\)\]\/25/g, "bg-primary/25"],
  [/bg-\[var\(--color-primary\)\]\/35/g, "bg-primary/35"],
  [/border-\[var\(--color-primary\)\]\/35/g, "border-primary/35"],
  [/border-\[var\(--color-primary\)\]\/30/g, "border-primary/30"],
  [/border-\[var\(--color-primary\)\]\/40/g, "border-primary/40"],
  [/hover:border-\[var\(--color-primary\)\]\/30/g, "hover:border-primary/30"],
  [/hover:border-\[var\(--color-primary\)\]/g, "hover:border-primary"],
  [/hover:bg-\[var\(--color-primary-muted\)\]/g, "hover:bg-primary-muted"],
  [/from-\[var\(--color-primary\)\]\/20/g, "from-primary/20"],
  [/to-\[var\(--color-accent\)\]\/15/g, "to-accent/15"],
  [/to-\[var\(--color-accent\)\]\/12/g, "to-accent/12"],
  [/via-\[var\(--color-primary\)\]/g, "via-primary"],
  [/from-\[var\(--color-primary\)\]\/25/g, "from-primary/25"],
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name === "node_modules") continue;
      walk(p, files);
    } else if (/\.(tsx|ts|css)$/.test(name)) {
      files.push(p);
    }
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  let s = fs.readFileSync(file, "utf8");
  const orig = s;
  for (const [re, rep] of REPLACEMENTS) {
    s = s.replace(re, rep);
  }
  if (s !== orig) {
    fs.writeFileSync(file, s);
    changed++;
    console.log(file.replace(root, "src"));
  }
}
console.log(`Updated ${changed} files.`);
