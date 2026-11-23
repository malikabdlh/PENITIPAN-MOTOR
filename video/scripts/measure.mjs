import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "scripts", "vo");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".srt")).sort();

const toSeconds = (ts) => {
  const m = ts.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
  if (!m) return 0;
  return (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]) + (+m[4]) / 1000;
};

const out = {};
for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), "utf8");
  const times = [...raw.matchAll(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/g)];
  const end = times.length ? Math.max(...times.map((m) => toSeconds(m[2]))) : 0;
  out[f.replace(/\.srt$/, "")] = Math.round(end * 100) / 100;
}
console.log(JSON.stringify(out, null, 2));
