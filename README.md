# InventoryManagementSystem-LS

[![CI](https://github.com/baguvix7/InventoryManagementSystem-LS/actions/workflows/ci.yml/badge.svg)](https://github.com/baguvix7/InventoryManagementSystem-LS/actions/workflows/ci.yml)

College Sports Club — Inventory Management System

This repository contains a full-stack prototype for managing sports equipment, keys, categories and audit history for a college sports club. It includes a TypeScript backend (Express + Prisma), a Prisma schema and migrations, OpenAPI contract, and notes for a Next.js admin UI.

Contents
- `PRD.md` — Product Requirements Document
- `spec/system_spec.md` — Wipe-coding system specification
- `api/openapi.yaml` — OpenAPI contract for the backend
- `prisma/schema.prisma` & `prisma/migrations/` — Prisma schema and migrations
- `infra/db/schema.sql` — Postgres-ready SQL schema
- `apps/backend/` — TypeScript Express backend (Prisma client, API endpoints)
- `docs/export_and_hosting.md` — Excel export format and hosting notes

Quick Setup (local)
1. Start local Postgres and Adminer (docker-compose provides both):

```powershell
docker compose up -d
```

This starts a Postgres 15 instance and Adminer (DB admin UI) on ports `5432` and `8080` respectively.

2. Copy environment file and install dependencies:

```powershell
cp .env.example .env
npm install
```

3. Run migrations and seed the database (from repo root):

```powershell
npm run migrate
npm run seed
```

4. Run the backend (development):

```powershell
cd apps/backend
npm run dev
```

The backend listens on `PORT` (default `4000`).

Environment variables
- Copy `.env.example` to `.env` and update values as needed.
- Important vars:
	- `DATABASE_URL` — e.g. `postgresql://postgres:postgres@localhost:5432/inventory`
	- `JWT_SECRET` — secret used to sign JWT tokens
	- `PORT` — backend port (optional)

Directory structure (important parts)

```
.
├─ apps/
│  └─ backend/            # Express + Prisma backend
├─ prisma/                # Prisma schema & migrations
├─ infra/                 # DB-related SQL (schema.sql)
├─ api/                   # OpenAPI contract (openapi.yaml)
├─ docs/                  # Notes (export & hosting)
├─ PRD.md                 # Product Requirements
└─ README.setup.md        # Auxiliary setup guide
```

Postgres Admin (Adminer)
- Adminer UI: http://localhost:8080
- Connection (from Adminer container):
	- System: PostgreSQL
	- Server: `db`
	- Username: `postgres`
	- Password: `postgres`
	- Database: `inventory`

If connecting from host tools (psql), use host `localhost` and port `5432`.

Backend: API overview
- Base path: `/api/v1`
- Important endpoints implemented in the backend:
	- `POST /api/v1/auth/login` — email-only login (allowlist check)
	- `GET /api/v1/products` — list products (filters: sport_id, status, q, page, limit)
	- `POST /api/v1/products` — create product (admin)
	- `GET /api/v1/products/:id` — product details + history
	- `PATCH /api/v1/products/:id/status` — change status & create history (admin)
	- `DELETE /api/v1/products/:id` — soft-delete (admin)
	- `GET /api/v1/export/inventory?format=xlsx` — download inventory snapshot (XLSX)
	- `GET /api/v1/keys` and `POST /api/v1/keys/:id/handover` — key management
	- `GET/POST/DELETE /api/v1/admin/allowed-emails` — manage allowlist (admin)

Migration & Seed
- `npm run migrate` — runs Prisma migrations (creates DB schema)
- `npm run seed` — runs `prisma/seed.ts` to populate sample data (5 sports, 20 products, holders, admin user)

Testing
- Backend tests (basic integration) are under `apps/backend/tests` and use `jest` + `supertest`.
- From `apps/backend`:

```powershell
npm run test
```

Troubleshooting
- If Prisma complains about missing `@prisma/client`, run `npx prisma generate` or reinstall dependencies.
- If `prisma migrate` fails, try resetting and pushing schema:

```powershell
npx prisma migrate reset --force
npx prisma db push
```

- Ensure `.env` `DATABASE_URL` matches docker-compose (postgres://postgres:postgres@localhost:5432/inventory).
- If ports are in use, stop conflicting services or change `docker-compose.yml` port mapping.

References
- Product Requirements: `PRD.md`
- System spec: `spec/system_spec.md`
- OpenAPI contract: `api/openapi.yaml`
- SQL schema (reference): `infra/db/schema.sql`

Next steps (frontend)
- Build a Next.js admin UI in `apps/frontend/` that provides:
	- Landing / Dashboard with view toggle (by sport / alphabetical)
	- Category detail lists and product detail pages
	- Key management and admin settings pages
	- Use `BACKEND_URL` env to point to local backend

---

If you want, I can now continue with Step 2.2 (backend polish, finish tests) or wait to scaffold the frontend — let me know which.
# InventoryManagementSystem-LS