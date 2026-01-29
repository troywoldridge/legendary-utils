#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const limitMB = Number(process.env.LARGE_FILE_MB || "20");
const limitBytes = limitMB * 1024 * 1024;

const SKIP_DIRS = new Set([".git", "node_modules", ".next", "dist"]);

function walk(dir, out) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walk(path.join(dir, ent.name), out);
      continue;
    }
    if (!ent.isFile()) continue;

    const p = path.join(dir, ent.name);
    const st = fs.statSync(p);
    if (st.size >= limitBytes) out.push({ p, size: st.size });
  }
}

function fmt(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function main() {
  const out = [];
  walk(root, out);
  out.sort((a, b) => b.size - a.size);

  console.log(`🔎 Large files >= ${limitMB}MB under: ${root}\n`);
  if (out.length === 0) {
    console.log("✅ None found.");
    return;
  }
  for (const x of out) {
    console.log(`${fmt(x.size)}  ${x.p}`);
  }
  process.exitCode = 2;
}

main();
