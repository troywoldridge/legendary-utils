#!/usr/bin/env node
import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set.");
  process.exit(1);
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  try {
    const r = await client.query(`
      select n.nspname as schema, count(*)::int as tables
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where c.relkind = 'r'
        and n.nspname not in ('pg_catalog','information_schema')
      group by 1
      order by 1;
    `);

    console.log("📦 Tables by schema");
    for (const row of r.rows) console.log(`${row.schema}: ${row.tables}`);

    const list = await client.query(`
      select n.nspname as schema, c.relname as table
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where c.relkind = 'r'
        and n.nspname not in ('pg_catalog','information_schema')
      order by 1,2
      limit 50;
    `);

    console.log("\n🧾 First 50 tables (schema.table)");
    for (const row of list.rows) console.log(`${row.schema}.${row.table}`);
  } finally {
    await client.end().catch(() => {});
  }
}

main().catch((err) => {
  console.error("❌ dbSchemaSnapshot failed:", err?.message || err);
  process.exit(1);
});
