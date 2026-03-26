import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "src");

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      walk(p, files);
    } else if (name.endsWith(".tsx")) {
      files.push(p);
    }
  }
  return files;
}

let n = 0;
for (const file of walk(root)) {
  let s = fs.readFileSync(file, "utf8");
  const o = s;
  s = s.replace(/text-white\/90/g, "text-foreground/90");
  s = s.replace(/text-white\/95/g, "text-foreground/95");
  s = s.replace(/hover:text-white/g, "hover:text-foreground");
  s = s.replace(/text-white(?![\w-])/g, "text-foreground");
  s = s.replace(/ring-white\/5/g, "ring-foreground/5");
  if (s !== o) {
    fs.writeFileSync(file, s);
    n++;
  }
}
console.log(`Updated ${n} files (text-white → text-foreground).`);
