#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

const PATTERNS = [
  "BEGIN PRIVATE KEY",
  "API_KEY",
  "SECRET",
  "TOKEN",
  "PASSWORD",
  "Authorization: Bearer",
  "postgres://",
  "DATABASE_URL=",
  "x-admin-token"
];

const SKIP_DIRS = new Set([".git", "node_modules", ".next", "dist"]);

function walk(dir, files) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walk(p, files);
      continue;
    }
    if (ent.isFile()) files.push(p);
  }
}

function main() {
  const files = [];
  walk(root, files);

  const hits = [];
  for (const f of files) {
    const buf = fs.readFileSync(f);
    if (buf.includes(0)) continue; // skip binaries
    const text = buf.toString("utf8");

    for (const pat of PATTERNS) {
      if (text.includes(pat)) hits.push({ file: f, pattern: pat });
    }
  }

  if (hits.length === 0) {
    console.log("✅ Safety scan: no obvious secret patterns found.");
    return;
  }

  console.log("⚠️ Safety scan found potential sensitive patterns:\n");
  for (const h of hits) console.log(`- ${h.pattern}  in  ${h.file}`);
  console.log("\nReview these before publishing.");
  process.exit(2);
}

main();
