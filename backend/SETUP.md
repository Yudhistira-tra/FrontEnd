# WartaTekno Backend (Laravel + SQLite)

## Syarat
PHP **8.3+** (diuji di 8.5) dan Composer. Ekstensi yang perlu aktif di `php.ini`:
`mbstring`, `openssl`, `fileinfo`, `curl`, `pdo_sqlite`, `sqlite3`, `zip`, `intl`, `gd`.

Laravel yang dipakai: **13.x** (`composer.json` minta `laravel/framework ^13.17`).
Database default **SQLite** — PostgreSQL tidak wajib.

## Langkah (sekali saja)

```bash
cd backend
composer install
cp .env.example .env      # Windows: copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

API aktif di http://127.0.0.1:8000/api/v1

`migrate` membuat `database/database.sqlite` otomatis kalau file-nya belum ada.
Perintah di atas sudah meng-*seed* produk, kategori, komentar, dan akun demo.

## Cara baru (repo ini sudah berisi proyek Laravel)

Folder `backend/` di repo ini **sudah** proyek Laravel lengkap — tidak perlu
`composer create-project` dan tidak perlu menyalin isi `wartatekno-backend.zip`.
Cukup `composer install` seperti di atas.

## Akun seed

- `admin@wartatekno.id` / `password` (admin)
- `budi@wartatekno.id` / `password` (member)

Segera ganti password admin sebelum dipakai di production.

## Kalau mau pakai PostgreSQL

1. `CREATE DATABASE technology_marketplace;`
2. Isi bagian `DB_*` di `.env`: `DB_CONNECTION=pgsql`, host, port, nama, user, password.
3. `php artisan migrate:fresh --seed`

Nilai plusnya: pencarian lewat API (`?search=`) memakai `ilike` yang hanya ada di
PostgreSQL. Di SQLite endpoint itu mengembalikan 500 (frontend tidak terpengaruh karena
filter jalan di sisi klien). Kolom `specs_json` bertipe `jsonb` di migrasi tetap jalan di
SQLite.

## Kalau PHP sistem terlalu lama

Di Windows, unduh ZIP "PHP 8.x NTS", extract ke misal `C:\php-8.5-portable`, lalu buat
`php.ini` berisi `extension_dir = "C:\php-8.5-portable\ext"` dan baris `extension=...`
untuk daftar ekstensi di atas. Jalankan semua perintah dengan path lengkap:

```bash
C:\php-8.5-portable\php.exe artisan serve --host=127.0.0.1 --port=8000
```
