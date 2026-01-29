#!/usr/bin/env node
import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set. Create a .env file or export DATABASE_URL.");
  process.exit(1);
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  try {
    await client.connect();
    const v = await client.query("select version() as version");
    const db = await client.query("select current_database() as db, current_user as user");
    console.log("✅ Connected");
    console.log(`DB: ${db.rows?.[0]?.db} as ${db.rows?.[0]?.user}`);
    console.log(v.rows?.[0]?.version);
  } finally {
    await client.end().catch(() => {});
  }
}

main().catch((err) => {
  console.error("❌ dbPing failed:", err?.message || err);
  process.exit(1);
});
