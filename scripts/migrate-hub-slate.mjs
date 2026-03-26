import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dirs = [
  path.join(__dirname, "..", "src", "app", "hub"),
  path.join(__dirname, "..", "src", "components", "hub"),
];

const REPLACEMENTS = [
  [/border-slate-700\/50/g, "border-border/50"],
  [/border-slate-600/g, "border-border"],
  [/border-slate-500/g, "border-border"],
  [/border-slate-700/g, "border-border"],
  [/border-slate-800/g, "border-border"],
  [/bg-slate-800\/30/g, "bg-muted/30"],
  [/bg-slate-900\/40/g, "bg-surface/40"],
  [/bg-slate-900\/50/g, "bg-surface/50"],
  [/bg-slate-950/g, "bg-background"],
  [/bg-slate-900/g, "bg-surface"],
  [/bg-slate-800/g, "bg-muted"],
  [/text-slate-400/g, "text-muted-foreground"],
  [/text-slate-500/g, "text-muted-foreground"],
  [/text-slate-300/g, "text-foreground/90"],
  [/text-slate-100/g, "text-foreground"],
  [/hover:bg-slate-800/g, "hover:bg-muted"],
  [/bg-cyan-600/g, "bg-primary"],
  [/hover:bg-cyan-500/g, "hover:bg-primary-hover"],
  [/hover:bg-cyan-400/g, "hover:bg-primary-hover"],
  [/text-cyan-400/g, "text-primary"],
  [/text-cyan-300/g, "text-primary"],
  [/text-cyan-200/g, "text-primary"],
  [/text-cyan-500/g, "text-primary"],
  [/text-cyan-100/g, "text-primary"],
  [/border-cyan-800\/50/g, "border-primary/50"],
  [/border-cyan-900\/40/g, "border-primary/40"],
  [/bg-cyan-950\/25/g, "bg-primary/10"],
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
    }
  }
}
console.log(`Hub: ${n} files updated.`);
