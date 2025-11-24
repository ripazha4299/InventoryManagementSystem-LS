# v0.1.0 – Initial Release

## Summary
This initial release provides a working prototype of the College Sports Club Inventory Management System, including:

- Backend: TypeScript Express API using Prisma and PostgreSQL. Implements endpoints for authentication (email allowlist), products, sports (categories), keys, admin allowlist management, and an Excel export endpoint to stream inventory snapshots.
- Frontend: A scaffolded Next.js + TypeScript admin UI (under `apps/frontend`) with pages for login, dashboard, category/product views, key management and admin settings. (Scaffolded and wired to API.)
- API: OpenAPI contract at `api/openapi.yaml` describing the `/api/v1` surface (auth, products, sports, keys, admin, export).
- DB schema & seed: Prisma schema in `prisma/schema.prisma`, initial migration in `prisma/migrations/0001_init`, and a canonical seed script at `/mnt/data/seed.ts` to populate sample sports, products, holders, an admin user, and history entries.

## Quick setup (local)
1. Start Postgres and Adminer (docker-compose):

```powershell
docker compose up -d
```

2. Copy env and install dependencies:

```powershell
cp .env.example .env
npm install
```

3. Generate Prisma client and run migrations:

```powershell
npx prisma generate
npm run migrate
```

4. Seed the database (canonical seed):

```powershell
npm run seed
```

5. Start the backend (development):

```powershell
cd apps/backend
npm ci
npm run dev
```

6. Start the frontend (development):

```powershell
cd apps/frontend
npm ci
npm run dev
```

## Deployment notes
See `DEPLOY.md` for full deployment guidance. Summary:

- Recommended setup: Frontend on Vercel (Next.js), Backend on Render (Web Service), Database on Supabase or Neon (Postgres).
- Required environment variables:
  - `DATABASE_URL` — Postgres connection string for Prisma
  - `JWT_SECRET` — secret for signing JWT tokens
  - `NEXT_PUBLIC_API_URL` — frontend points to backend URL
- Use `npx prisma migrate deploy` to apply migrations in production and run the canonical seed if desired from a CI runner or through a secure one-off job.
- The export endpoint streams XLSX via `exceljs` (streaming writer) to avoid large memory usage — ensure the host has adequate memory/time limits for large exports.

## Known limitations
- Authentication is an email-only flow that relies on an allowlist; there is no password or OAuth flow yet.
- The frontend is scaffolded and functional but not fully styled or production hardened (access control UI, form validation, and UX polishing remain).
- CI currently runs migrations and tests but requires `DATABASE_URL` to be configured in CI secrets for `npx prisma migrate deploy` to succeed.
- No automated backups or DB migration rollback strategy included — backups should be arranged on the managed DB provider.
- Role and permission model is minimal (admin vs non-admin). Fine-grained RBAC has not been implemented.

## Next steps (v0.2.0)
- Complete and polish the Next.js admin UI: add UI/UX polish, form validation, and better state handling.
- Implement stronger auth options: invite-based sign-in, session handling, or OAuth providers.
- Add monitoring and logging integration (structured logs, error reporting).
- Harden CI/CD: add review app previews, run seed in ephemeral environments for tests, and add migration previews.
- Add export size limits/pagination or background jobs for very large exports.

---

If you want, I can prepare a `CHANGELOG.md` with the same content and provide the exact `git tag` and `gh release` commands to push the release; I will not create the git tag without your confirmation.
