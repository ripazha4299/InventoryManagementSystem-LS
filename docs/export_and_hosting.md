# Export & Hosting Notes

## Excel Snapshot Export
Endpoint: `GET /api/v1/export/inventory?format=xlsx`

Sheet: `Inventory_Snapshot`
Columns:
- Sport Category
- Item Name
- Item ID
- Date Added
- Current Status
- Holder Name
- Holder Roll
- Holder Contact
- Last Used By
- Last Updated Timestamp
- Item Age (days)

Grouping & sorting:
- Group by `Sport Category` ascending
- Within each sport, sort by `Item Name` ascending

Implementation notes:
- Use a server-side Excel library and stream rows to avoid high memory use.
  - Node: `exceljs` (streams) — recommended for Vercel/Node deployments.
  - Python: `openpyxl` or `xlsxwriter` with streaming (for large exports use `xlsxwriter`).
- Query DB in pages and write rows incrementally to the workbook stream.
- Use a transactionally-consistent read for snapshot accuracy if required.

## Hosting Recommendations (MVP)
- Frontend: Vercel (Next.js) — fast deploys and previews.
- Backend: Supabase (Postgres + Auth) or Render (Node/Express) — depends on preference for serverless vs stateful.
- DB: Supabase Postgres (works well with Supabase Auth and realtime features).

Pairing suggestions:
- Option A (fastest): Frontend on Vercel, DB/Auth on Supabase.
- Option B (stateful backend): Backend on Render + Supabase or Neon for Postgres.

Caveats:
- Free tiers have limits (storage size, paused projects). Confirm provider limits before production.
