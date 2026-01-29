#!/usr/bin/env node
import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set. Create a .env file or export DATABASE_URL.");
  process.exit(1);
}

/**
 * Prefer stable, schema-qualified table names.
 * If a table isn't found in the provided schema, we'll also try the "troy" schema,
 * because your DB appears to have some objects there.
 */
const TABLES = [
  "public.market_items",
  "public.market_item_external_ids",
  "public.market_prices_current",
  "public.market_price_daily",
  "public.market_price_snapshots",
  "public.market_sales_comps",
  "public.market_values_daily",

  "public.pokemon_market_prices_graded_latest",
  "public.pokemon_set_code_map_table",
  "public.pokemon_set_code_map_tbl",
  "public.pokemon_set_name_map",

  "public.price_alerts",

  "public.products",
  "public.product_images",
  "public.product_tags",

  "public.user_collection_items",
  "public.user_collection_item_valuations",
  "public.user_collection_daily_valuations",
  "public.user_revalue_jobs",
  "public.user_plans",
  "public.user_wishlist_items",
];

function padRight(s, n) {
  const str = String(s);
  return str.length >= n ? str : str + " ".repeat(n - str.length);
}

function quoteIdent(s) {
  return `"${String(s).replace(/"/g, '""')}"`;
}

// quote schema/table safely: schema.table -> "schema"."table"
function quoteQualified(name) {
  const parts = String(name).split(".");
  if (parts.length === 1) return quoteIdent(parts[0]);
  if (parts.length === 2) return `${quoteIdent(parts[0])}.${quoteIdent(parts[1])}`;
  return quoteIdent(name);
}

function toAltSchema(tableName, altSchema) {
  const parts = String(tableName).split(".");
  if (parts.length === 2) return `${altSchema}.${parts[1]}`;
  return `${altSchema}.${tableName}`;
}

async function resolveExistingTable(client, tableName) {
  // tableName must be "schema.table" for to_regclass to work reliably
  const exists = await client.query("select to_regclass($1) as reg", [tableName]);
  if (exists.rows?.[0]?.reg) return tableName;

  // Try troy schema as a fallback (some of your tables appear under schema "troy")
  const alt = toAltSchema(tableName, "troy");
  const existsAlt = await client.query("select to_regclass($1) as reg", [alt]);
  if (existsAlt.rows?.[0]?.reg) return alt;

  return null;
}

async function safeCount(client, tableName) {
  const resolved = await resolveExistingTable(client, tableName);
  if (!resolved) return { ok: false, table: tableName, reason: "missing" };

  const q = `select count(*)::bigint as c from ${quoteQualified(resolved)}`;
  const r = await client.query(q);
  return { ok: true, table: resolved, count: r.rows?.[0]?.c ?? null };
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  try {
    const v = await client.query("select version() as version");
    const who = await client.query("select current_database() as db, current_user as user");

    console.log("✅ Connected");
    console.log(`DB: ${who.rows?.[0]?.db} as ${who.rows?.[0]?.user}`);
    console.log(v.rows?.[0]?.version);
    console.log("");

    const longest = TABLES.reduce((m, t) => Math.max(m, t.length), 0);

    for (const t of TABLES) {
      const res = await safeCount(client, t);
      if (!res.ok) {
        console.log(`${padRight(t, longest)}  (missing)`);
        continue;
      }
      // If it resolved to a different schema, show it
      const label = res.table === t ? t : `${t} -> ${res.table}`;
      console.log(`${padRight(label, longest + 7)}  ${res.count} rows`);
    }
  } finally {
    await client.end().catch(() => {});
  }
}

main().catch((err) => {
  console.error("❌ dbInfo failed:", err?.message || err);
  process.exit(1);
});
