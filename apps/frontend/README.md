# Frontend (Next.js + TypeScript)

This is a minimal Next.js admin UI for the College Sports Inventory backend.

Setup

1. Copy env example:

```bash
cp .env.local.example .env.local
```

2. Install and run:

```bash
npm install
npm run dev
```

Environment
- `NEXT_PUBLIC_API_URL` should point to the backend, default: `http://localhost:4000`.

Pages
- `/login` — email login
- `/` — dashboard (view toggle, search, download snapshot)
- `/category/[sport]` — list items by sport
- `/product/[id]` — item detail, history, change status
- `/keys` — key status & handover
- `/admin` — manage allowed emails

Notes
- The app stores JWT in `localStorage` and attaches it to write requests.
- Snapshot download fetches the export endpoint with Authorization and downloads the blob.

Acceptance
- `cd apps/frontend && npm run dev` should start the Next.js dev server.
- Login with seeded admin `admin@college.edu` and test actions (change status, export, admin allowlist).
