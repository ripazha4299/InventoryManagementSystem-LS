# Prisma — migrations & seed

This directory contains the Prisma schema, an initial migration, and a TypeScript seed script.

Quick local setup (assuming Docker + docker-compose is available):

1. Start a local Postgres (see repo `docker-compose.yml` if present), or run your own Postgres instance.

2. Copy `.env.example` to `.env` and update `DATABASE_URL`.

3. Install dependencies:

```bash
npm install
```

4. Run the migration (this will create the DB schema):

```bash
npm run migrate
```

5. Seed the database:

```bash
npm run seed
```

6. Confirm data exists (psql):

```bash
psql "$DATABASE_URL" -c "SELECT count(*) FROM \"Product\";"
```

Notes:
- The migration SQL included is `prisma/migrations/0001_init/migration.sql`.
- The seed script `prisma/seed.ts` uses `ts-node`. If you prefer JS, compile it with `tsc`.
