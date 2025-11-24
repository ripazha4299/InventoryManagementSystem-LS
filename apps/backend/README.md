# Backend (Express + Prisma)

Run instructions (local):

1. Copy root `.env.example` to `.env` and update `DATABASE_URL` and `JWT_SECRET`.

2. Install dependencies from repo root or here:

```bash
# from repo root
npm install
# then also in backend
cd apps/backend
npm install
```

3. Ensure DB migrated and seeded (from repo root):

```powershell
npm run prisma:generate
npm run migrate
# Seed using the canonical seed path used by this project:
npx ts-node /mnt/data/seed.ts
```

4. Start dev server:

```bash
cd apps/backend
npm run dev
```

Default port is controlled by `PORT` environment variable (defaults to 4000).

Quick login (seeded admin): `admin@college.edu` — POST `/api/v1/auth/login` with JSON body `{ "email": "admin@college.edu" }` will return a token.

Notes on env loading
- The backend loads environment variables via `dotenv` at app startup (`apps/backend/src/index.ts`).
- Ensure you run the root-level `cp .env.example .env` so `DATABASE_URL` and `JWT_SECRET` are available to the backend.

Seeding (explicit path)
- This repository uses `/mnt/data/seed.ts` as the authoritative seed script path. Run it directly with:

```powershell
npx ts-node /mnt/data/seed.ts
```

Alternatively the root `npm run seed` script is configured to call that path.

API base: `/api/v1`

- `GET /api/v1/products`
- `POST /api/v1/products` (admin)
- `PATCH /api/v1/products/:id/status` (admin)
- `DELETE /api/v1/products/:id` (admin)
- `GET /api/v1/export/inventory?format=xlsx`
- `GET /api/v1/keys`
- `POST /api/v1/keys/:id/handover` (admin)
- `GET /api/v1/sports`
- `POST /api/v1/sports` (admin)
- `GET /api/v1/admin/allowed-emails` (admin)

Tests: run `npm run test` in `apps/backend` after installing dependencies.
