# legendary-utils

A curated set of reusable utility scripts used to operate and maintain the **Legendary Collectibles** platform.

This repo is designed to be **public-safe** (no secrets committed) while still showcasing real-world tooling:
- Postgres database checks + reporting
- Environment validation
- Feed validation helpers (Google Merchant)
- Repo hygiene utilities (large file scan, secret pattern scan)

> ✅ This is a toolbox repo: small scripts, fast execution, practical output.

---

## Folder layout

- `scripts/db/` — database utilities (Postgres)
- `scripts/diagnostics/` — environment + safety checks
- `scripts/feeds/` — feed helpers (Google Merchant TSV)
- `scripts/files/` — filesystem / repo utilities
- `.env.example` — template environment variables (NO secrets)

---

## Setup

### Requirements
- Node.js 18+ (recommended)
- PostgreSQL accessible via `DATABASE_URL`

### Install
```bash
npm install
> EOF
troy@adap:~/github/legendary-utils$ cat > README.md << 'EOF'
# legendary-utils

A curated set of reusable utility scripts used to operate and maintain the **Legendary Collectibles** platform.

This repo is designed to be **public-safe** (no secrets committed) while still showcasing real-world tooling:
- Postgres database checks + reporting
- Environment validation
- Feed validation helpers (Google Merchant)
- Repo hygiene utilities (large file scan, secret pattern scan)

> ✅ This is a toolbox repo: small scripts, fast execution, practical output.

---

## Folder layout

- `scripts/db/` — database utilities (Postgres)
- `scripts/diagnostics/` — environment + safety checks
- `scripts/feeds/` — feed helpers (Google Merchant TSV)
- `scripts/files/` — filesystem / repo utilities
- `.env.example` — template environment variables (NO secrets)

---

## Setup

### Requirements
- Node.js 18+ (recommended)
- PostgreSQL accessible via `DATABASE_URL`

### Install
```bash
npm install

 ## Configure enviroment
 - Copy example file
 - cp .env.example .env
 
 ## Scripts
 - Help (shows available commands)
 - npm run help
 
 ## Diagnostics
 - Env Check (Validates required ebv variables do not exist (does not print secrets))
 - npm run env:check
 - Safty scan (scans repo for commmon secret patterns befor publishing)
 - npm run safty:scan

 ## Database tools (Postgres)
 - Ping DB ( Verifies DB Connectivity and prints version info, Shows row counts for the main Legendary Collectibles tables used by pricing + valuation pipelines.)
 - npm run db:ping
 - DB info (table counts)
 - npm run db:info
 - Schema snapshot (Prints table counts by schema + lists first 50 tables.)
 - npm run db:schema

 ## Feed tools (Google Merchant TSV)
 - Validate feed output (Checks required columns + consistent row structure.)
 - npm run feed:validate -- ./feed.tsv
 - Sample feed output (Prints header + first N rows as JSON.)
 - npm run feed:sample -- ./feed.tsv 5

 ## Filesystem Tools
 - Find large files (Prevents committing accidental huge dumps (CSV/JSON/etc).)
 - npm run files:large
 - To change threshold:
 - LARGE_FILE_MB=50 npm run files:large


 ## Notes

This repo intentionally avoids private integrations (OAuth flows, tokens, etc.)

All secrets should be provided via environment variables

This repo is designed to be small, readable, and practical


## License
- MIT

