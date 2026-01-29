# legendary-utils

A curated set of reusable utility scripts used in and around the **Legendary Collectibles** stack.

This repo is intentionally small and practical: database checks, feed helpers, and maintenance tools.

## Setup
1. Install dependencies:
   - `npm install`
2. Copy `.env.example` to `.env` and fill in values.

## Scripts

### Database
- **DB ping**: verify Postgres connectivity
  - `npm run db:ping`

## Notes
- This is a public-safe repo: secrets are not committed.
- Some private integrations and environment-specific scripts are intentionally omitted.
