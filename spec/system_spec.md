# System Specification — Wipe-Coding (machine-friendly)

Name: CollegeSportsInventory
Auth: Email-based allowlist (admins only)
Primary roles: admin (sports club rep) — can CRUD items & keys; viewer (future) — read-only (not in v1)

## Pages / Views
1. Landing / Dashboard
- Components: `TopNav` (search input, user menu), `ViewToggle` (by_sport|alphabetical), `CategoryList`, `ProductList`, `DownloadSnapshotBtn`, `AddProductBtn`
- Inputs: `queryString`, `viewMode`
- Outputs: `products[]` (brief)

2. CategoryDetail
- Components: `CategoryHeader`, `ProductRow` (name, id, date_added, status, last_used_by, changeStatusBtn)
- Actions: `ClickProduct -> ItemDetail`

3. ItemDetail
- Components: `ItemSummary`, `UsageHistory`, `ChangeStatusForm`, `DeleteItemBtn`
- Actions: `SubmitChangeStatus` -> creates history entry & updates product

4. KeyManagement
- Components: `KeyStatus`, `KeyHistory`, `HandOverForm`
- Actions: `HandOverKey` -> log and update

5. DeletedItemsArchive
- Components: `ArchiveList` (deleted items with deletedDate & snapshot)

6. AdminSettings
- Components: `AllowedEmailsList`, `CategoryManager`

## Events / Actions
- ADD_ITEM {payload: item}
- UPDATE_ITEM_STATUS {itemId, newStatus, holder?, notes, updatedBy}
- DELETE_ITEM {itemId, deletedBy}
- DOWNLOAD_SNAPSHOT {format: excel}
- HANDOVER_KEY {from, to, timestamp}
- AUTH_SIGNIN (magic link / otp) — server validates against allowlist

## Data shapes
Product:
{
  "id": "uuid",
  "name": "string",
  "sport": "string",
  "date_added": "date",
  "status": "enum['INVENTORY','SPORTS_COMPLEX','WITH_PERSON','DELETED']",
  "current_holder": {"name":"string","roll":"string","contact":"string"},
  "last_used_by": {"name":"string","roll":"string"},
  "notes":"string"
}

HistoryEntry:
{
  "id":"uuid",
  "product_id":"uuid",
  "timestamp":"datetime",
  "action":"enum['ISSUED','RETURNED','STATUS_UPDATE','ADDED','DELETED']",
  "by":"admin_email",
  "holder":{"name","roll","contact"},
  "notes":"string"
}

KeyRecord:
{
  "id":"uuid",
  "key_name":"string",
  "current_holder":{"name","roll","contact"},
  "history":[{timestamp, from, to, by}]
}

API base path: `/api/v1` (see `api/openapi.yaml` for full contract)
