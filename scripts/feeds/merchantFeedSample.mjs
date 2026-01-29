#!/usr/bin/env node
import fs from "node:fs";

const file = process.argv[2];
const n = Number(process.argv[3] || "5");

if (!file) {
  console.error("Usage: node scripts/feeds/merchantFeedSample.mjs <feed.tsv> [rows=5]");
  process.exit(1);
}

const text = fs.readFileSync(file, "utf8");
const lines = text.split(/\r?\n/).filter(Boolean);
if (lines.length === 0) {
  console.error("❌ Empty file.");
  process.exit(1);
}

const header = lines[0].split("\t");
console.log(`✅ Columns (${header.length}):`);
console.log(header.join(" | "));
console.log("");

const take = Math.min(n, lines.length - 1);
console.log(`🔎 First ${take} rows:\n`);

for (let i = 1; i <= take; i++) {
  const cols = lines[i].split("\t");
  const row = {};
  for (let j = 0; j < Math.min(cols.length, header.length); j++) {
    row[header[j]] = cols[j];
  }
  console.log(JSON.stringify(row, null, 2));
  console.log("---");
}
