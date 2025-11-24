# Deployment Guide

This document describes two straightforward deployment options for the College Sports Inventory system.

Option A (recommended)
- Frontend: Vercel (Next.js)
- Backend: Render (Web Service) or Vercel serverless functions
- Database: Supabase (Postgres) or Neon

Steps (Vercel + Render + Supabase)
1. Frontend (Vercel)
  - Connect repo to Vercel.
  - Set environment variable: `NEXT_PUBLIC_API_URL` → `https://<your-backend-url>`
  - Deploy (Vercel automatically runs `npm run build`).

2. Backend (Render)
  - Create a new Web Service (Node).
  - Set build command: `npm ci && npm run build`
  - Start command: `npm run start` or use a process manager
  - Environment variables (Render):
    - `DATABASE_URL` (Postgres connection string)
    - `JWT_SECRET` (strong secret)
    - `PORT` (optional)

3. Database (Supabase / Neon)
  - Create a Postgres database.
  - Apply migrations: run `npx prisma migrate deploy` against the hosted DB.
  - Seed (optional): run the canonical seed script locally pointing at the hosted DB: `npx ts-node /mnt/data/seed.ts` (or use your CI/runner).

Option B (All on Render)
- You can host frontend and backend on Render services and use a managed Postgres (Render or external) similarly.

Required environment variables (summary)
- `DATABASE_URL` — Postgres connection string (used by Prisma)
- `JWT_SECRET` — secret for signing JWTs
- `NEXT_PUBLIC_API_URL` — frontend must know backend base URL (Vercel env)

Notes
- For production, do not use plaintext secrets in repos. Use your provider's secret management.
- For exports (Excel), ensure the service has enough memory/time to stream the workbook; consider using Render's larger plans if needed.

CI
- The repo contains `.github/workflows/ci.yml` which runs tests and frontend build on push/PR to `main`.

Rollback
- Keep database backups and test migrations on a non-production branch before deploying to production DB.
