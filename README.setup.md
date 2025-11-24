# Local Setup (docker-compose)

This file mirrors the quick setup instructions. If you prefer, you can use this `README.setup.md` or update the root `README.md` manually with the same contents.

1. Start local Postgres and Adminer via Docker Compose:

```powershell
docker compose up -d
```

2. Copy example env and install dependencies:

```powershell
cp .env.example .env
npm install
```

3. Run DB migrations and seed (from repo root):

```powershell
npm run migrate
npm run seed
```

4. Start the backend (dev):

```powershell
cd apps/backend
npm run dev
```

## Adminer

Adminer will be available at `http://localhost:8080`.

Connect using:

- System: PostgreSQL
- Server: db
- Username: `postgres`
- Password: `postgres`
- Database: `inventory`

## Troubleshooting

- Ensure `DATABASE_URL` in `.env` is `postgresql://postgres:postgres@localhost:5432/inventory`.
- If `prisma migrate` fails, try `npx prisma migrate reset --force` and `npx prisma db push`.
- If `@prisma/client` is missing, run `npx prisma generate`.
