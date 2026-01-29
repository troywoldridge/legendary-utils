#!/usr/bin/env node
import "dotenv/config";

const REQUIRED = [
  "DATABASE_URL",
];

const OPTIONAL = [
  "ADMIN_API_TOKEN",
  "REVALUE_ORIGIN",
];

function mask(v) {
  const s = String(v ?? "");
  if (!s) return "";
  if (s.length <= 6) return "***";
  return `${s.slice(0, 3)}***${s.slice(-3)}`;
}

function main() {
  let ok = true;

  console.log("🔎 Env Check\n");

  for (const k of REQUIRED) {
    const v = process.env[k];
    if (!v) {
      ok = false;
      console.log(`❌ ${k}: MISSING`);
    } else {
      console.log(`✅ ${k}: set (${mask(v)})`);
    }
  }

  console.log("");

  for (const k of OPTIONAL) {
    const v = process.env[k];
    if (!v) console.log(`➖ ${k}: not set`);
    else console.log(`✅ ${k}: set (${mask(v)})`);
  }

  if (!ok) process.exit(1);
  console.log("\n✅ Environment looks good.");
}

main();
