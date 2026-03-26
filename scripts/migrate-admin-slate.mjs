/**
 * Maps Tailwind slate/cyan in admin UI to global theme tokens.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dirs = [
  path.join(__dirname, "..", "src", "app", "admin"),
  path.join(__dirname, "..", "src", "components", "admin"),
];

const REPLACEMENTS = [
  [/border-slate-700\/50/g, "border-border/50"],
  [/border-slate-600/g, "border-border"],
  [/border-slate-700/g, "border-border"],
  [/border-slate-800/g, "border-border"],
  [/bg-slate-800\/30/g, "bg-muted/30"],
  [/bg-slate-800\/50/g, "bg-muted/50"],
  [/bg-slate-800\/95/g, "bg-background/95"],
  [/bg-slate-900\/50/g, "bg-surface/50"],
  [/bg-slate-900\/40/g, "bg-surface/40"],
  [/bg-slate-950/g, "bg-background"],
  [/bg-slate-900/g, "bg-surface"],
  [/bg-slate-800/g, "bg-muted"],
  [/bg-slate-700/g, "bg-muted"],
  [/bg-slate-600/g, "bg-muted"],
  [/text-slate-400/g, "text-muted-foreground"],
  [/text-slate-500/g, "text-muted-foreground"],
  [/text-slate-300/g, "text-foreground/90"],
  [/text-slate-200/g, "text-foreground/95"],
  [/hover:text-slate-300/g, "hover:text-foreground"],
  [/hover:bg-slate-600/g, "hover:bg-muted"],
  [/hover:bg-slate-700/g, "hover:bg-muted"],
  [/bg-cyan-600/g, "bg-primary"],
  [/hover:bg-cyan-500/g, "hover:bg-primary-hover"],
  [/text-cyan-400/g, "text-primary"],
  [/hover:border-cyan-500\/50/g, "hover:border-primary/50"],
  [/focus:border-cyan-500/g, "focus:border-primary"],
  [/focus:ring-cyan-500/g, "focus:ring-primary"],
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (name.endsWith(".tsx")) files.push(p);
  }
  return files;
}

let n = 0;
for (const dir of dirs) {
  for (const file of walk(dir)) {
    let s = fs.readFileSync(file, "utf8");
    const o = s;
    for (const [re, rep] of REPLACEMENTS) {
      s = s.replace(re, rep);
    }
    if (s !== o) {
      fs.writeFileSync(file, s);
      n++;
      console.log(file.replace(path.join(__dirname, ".."), ""));
    }
  }
}
console.log(`Done. ${n} files updated.`);
