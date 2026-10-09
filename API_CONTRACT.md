# WartaTekno — API Contract (Frontend ↔ Backend)

> **How to use this file:** this is the single source of truth both sides code against.
> Human: read it top to bottom (~10 min). AI agent: implement every endpoint below
> exactly as specified and **ask before deviating** — do not invent field names,
> do not copy the frontend's demo shortcuts (listed at the bottom).

## 0. Basics

- Base URL: `http://127.0.0.1:8000/api/v1` (dev, `php artisan serve`). The
  frontend reads it from `REACT_APP_API_URL` — see `frontend/.env.example`.
- Auth: Laravel Sanctum token in `Authorization: Bearer <token>` header.
- Content type: `application/json`, except image upload (`multipart/form-data`).
- IDs are **opaque strings** on the frontend (backend slugs like
  `"laptop-thinkpad-x1-carbon-gen-11-2024"` or numeric ids — never parsed,
  only compared).
- Timestamps: backend returns **ISO 8601** (`2026-10-08T14:02:00+07:00`).
  The frontend formats "2 jam lalu" itself. Never store/return relative strings.
- List endpoints return Laravel paginator envelopes `{ data: [...], links, meta }`
  — the frontend service layer unwraps `.data`.
- **Field naming: backend is `snake_case`, frontend is `camelCase`.**
  The service layer maps both directions. Key pairs:

  | Backend | Frontend |
  |---|---|
  | `user_name` | `userName` |
  | `comment_text` | `comment` |
  | `image_url` | `image` |
  | `upvotes_count` | `likes` |
  | `created_at` | `createdAt` (ISO → formatted) |
- **Status vocab differs — map, don't rename either side:**

  | Resource | Backend value | Frontend label |
  |---|---|---|
  | Product | `draft` / `active` / `archived` | `Draf` / `Aktif` (/ `Arsip`) |
  | Comment | `pending` / `approved` / `flagged` | `Menunggu` / `Disetujui` / `Spam` |
  | Feedback | `new` / `read` / `resolved` | `Belum Ditanggapi` / `Sedang Ditinjau Tim Teknis` / `Selesai`+`Diimplementasikan` |

  > Frontend has 4 feedback statuses vs backend's 3: both `Selesai` and
  > `Diimplementasikan` map to `resolved` (distinguish client-side only, or
  > collapse to 3 labels later). Backend feedback `category` has one extra
  > value, `general`, with no frontend equivalent yet.

## 1. Demo accounts (seeded by `php artisan migrate --seed`)

| Name | Email | Password | Role |
|---|---|---|---|
| Admin Redaksi | admin@wartatekno.id | password | `admin` |
| Budi Santoso | budi@wartatekno.id | password | `member` |

> Frontend mock creds differ (`admin123`/`member123`, `budi.santoso@email.com`).
> When the frontend switches to the real backend, its login demo-hint must be
> updated to the seed accounts above.

## 2. Enums (exact strings, case-sensitive)

- Product `category`: `"Smartphone" | "Laptop" | "Audio" | "Smartwatch" | "Tablet" | "Aksesoris"`
- Product `status`: `"Aktif" | "Draf"`
- Comment `status`: `"Menunggu" | "Disetujui" | "Spam"`
- Feedback `category`: `"Permintaan Ulasan Produk Baru" | "Laporan Bug & Sistem" | "Saran Fitur & UI"`
- Feedback `status`: `"Belum Ditanggapi" | "Sedang Ditinjau Tim Teknis" | "Diimplementasikan" | "Selesai"`
- User `role`: `"admin" | "member"` (guests are simply unauthenticated)

## 3. Error shape (use for every failure)

```json
{ "message": "Email atau kata sandi salah" }
```

- `400` validation, `401` missing/invalid token, `403` valid token but wrong
  role (e.g. member hitting admin routes), `404` unknown id.

## 4. Endpoints

### Auth

**POST /auth/register** (public)
```json
// request
{ "name": "Budi Santoso", "email": "budi.santoso@email.com", "password": "member123" }
// → 201
{ "user": { "name": "Budi Santoso", "email": "budi.santoso@email.com", "role": "member" }, "token": "<jwt>" }
```
Role rule: `email` containing `admin` is **frontend demo logic only** — the real
backend assigns `member` by default; admins are promoted/seeded server-side.

**POST /auth/login** (public) — same shape as register response, `→ 200`.
**GET /me** (auth) — `{ "user": { "name": "...", "email": "...", "role": "member" } }`.

### Products

**GET /products** (public) → `200 [{ product }]`
**POST /products** (admin) — body: all fields below except `id`, `rating`,
`reviewsCount` (server defaults `rating: 5.0`, `reviewsCount: 0`) → `201 { product }`
**DELETE /products/:id** (admin) → `204`

```json
// product
{
  "id": "thinkpad-x1-gen11",
  "title": "ThinkPad X1 Carbon Gen 11",
  "brand": "Lenovo",
  "category": "Laptop",
  "sku": "LNV-X1C11-01",
  "price": 28500000,
  "rating": 4.8,
  "reviewsCount": 42,
  "status": "Aktif",
  "image": "https://…",
  "description": "Generasi ke-11 …",
  "specs": [{ "label": "Prosesor", "value": "Intel Core i7-1365U …" }]
}
```

### Comments (per product)

**GET /products/:id/comments** (public) — approved + pending only, **never Spam**
→ `200 [{ comment }]`. Admin moderation list may include Spam via `GET /comments?status=Spam` (admin).

**POST /products/:id/comments** (public on backend — guests send `user_name` +
`user_email`; logged-in users are identified by token. **Frontend stays
stricter**: its form is members-only and always sends the token.)
```json
// request (member)
{ "rating": 5, "comment_text": "Keyboard-nya enak…" }
// request (guest, backend-accepted — frontend never sends this)
{ "user_name": "Tamu", "user_email": "tamu@mail.com", "rating": 5, "comment_text": "…" }
// → 201
{
  "message": "Komentar berhasil dikirim.",
  "data": {
    "id": 12, "product_id": 3,
    "user_name": "Budi Santoso",
    "comment_text": "Keyboard-nya enak…",
    "rating": 5, "created_at": "2026-10-08T14:02:00+07:00",
    "status": "approved", "upvotes_count": 0
  }
}
```
Notes: comments containing links auto-return `status: flagged` (hidden publicly).
Replies use `parent_id` (one level); the comment list embeds approved `replies`
and per-user `liked_by_me` flags when authenticated.

**POST /comments/:id/like** (member/admin, toggle)
→ `200 { "liked": true, "upvotes_count": 13 }`
**PATCH /admin/comments/:id** (admin) — `{ "status": "approved" }` (values:
`pending | approved | flagged`). Admin list: `GET /admin/comments?status=&search=&product_id=`.
**DELETE /admin/comments/:id** (admin) → `204`

Staff replies (optional v1): embed as `comment.reply`:

```json
"reply": {
  "author": "WartaTekno Staff",
  "timeAgo": "2026-10-05T…",
  "text": "Halo Dimas, RAM-nya tersolder permanen…",
  "helpful": 8
}
```

### Feedbacks (Kontak form ↔ admin list)

**POST /feedback** (public — note singular)
```json
// request
{
  "userName": "Reza Pratama",
  "email": "reza.pratama@email.com",
  "category": "Permintaan Ulasan Produk Baru",
  "title": "Tolong tambahkan review Asus ROG Ally X 2024",
  "message": "Halo tim WartaTekno, mohon ulas…"
}
// → 201 (echo + server fields: id, created_at ISO, status "new", tags [])
```

**GET /admin/feedbacks?category=&status=&search=** (admin — server filters!)
**PATCH /admin/feedbacks/:id** (admin) — `{ "status": "read" }` (values:
`new | read | resolved`)
**DELETE /admin/feedbacks/:id** (admin) → `204`

### Saved / wishlist (per logged-in user)

**GET /me/saved** (member/admin) → `200` (saved products)
**POST /me/saved/:productId** (member/admin) → `201`
**DELETE /me/saved/:productId** (member/admin) → `204`

### Uploads (needed for the "Tambah Produk" file picker)

**POST /uploads** (admin, `multipart/form-data`, field `file`, ≤5MB, png/jpg/webp)
→ `201 { "url": "https://…" }`. Until this exists, the frontend sends an image
URL string in `product.image` — keep that working.

## 5. Role matrix

| Action | Guest | Member | Admin |
|---|---|---|---|
| Read catalog, detail, comments | ✓ | ✓ | ✓ |
| Kontak/feedback form | ✓ | ✓ | ✓ |
| Post comment, like, save/bookmark | — (redirect login) | ✓ | ✓ |
| Admin dashboard, CRUD, moderation, status changes | — | — | ✓ |

## 6. Do NOT copy these frontend demo shortcuts

1. `timeAgo` / `createdAt` as relative strings — backend uses ISO dates (§0).
2. `email.includes('admin')` role detection — roles come from the DB/token (§4 Auth).
3. Unknown-login fallback ("any email logs in as member") — backend returns `401`.
4. `blob:` image preview URLs — real URLs from §4 Uploads.
5. `initialProducts` / `initialComments` / `initialFeedbacks` in
   `frontend/src/data/mockData.js` are **seed/reference data**, not schema law —
   this file overrides them on conflict.

## 7. Open decisions (backend + owner agree, ~15 min)

1. Images v1: URL strings only, or real upload endpoint now? (Backend has
   `storage/` + `php artisan storage:link` in SETUP — confirm the upload route.)
2. Filtering: backend already supports `?search=&category=&status=` on admin
   lists — decision: switch frontend Filter buttons to server-side, or keep
   client-side for v1?
3. ~~Port/CORS~~ — resolved: `:8000`, allow `http://localhost:3000`.
4. ~~Seed~~ — resolved: backend seeds 8 products + 2 demo accounts.
