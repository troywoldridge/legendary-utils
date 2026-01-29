#!/usr/bin/env node
import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/feeds/merchantFeedValidate.mjs <feed.tsv>");
  process.exit(1);
}

const text = fs.readFileSync(file, "utf8");
const lines = text.split(/\r?\n/).filter(Boolean);
if (lines.length < 2) {
  console.error("❌ Feed file has no data rows.");
  process.exit(1);
}

const header = lines[0].split("\t");
const headerSet = new Set(header);

const REQUIRED = ["id", "title", "description", "link", "image_link", "price", "availability"];
const missing = REQUIRED.filter((k) => !headerSet.has(k));

console.log(`✅ Rows: ${lines.length - 1}`);
console.log(`✅ Columns: ${header.length}`);

if (missing.length) {
  console.error(`❌ Missing required columns: ${missing.join(", ")}`);
  process.exit(2);
}

let bad = 0;
for (let i = 1; i < Math.min(lines.length, 501); i++) {
  const cols = lines[i].split("\t");
  if (cols.length !== header.length) bad++;
}
if (bad) {
  console.error(`⚠️ Found ${bad} rows (first 500 checked) with wrong column count.`);
  process.exit(3);
}

console.log("✅ Header looks good and sampled rows have consistent column counts.");
