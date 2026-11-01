
- **Frontend** — React 19 (Create React App) di `frontend/`, jalan di `http://localhost:3000`
- **Backend** — Laravel 13 + Sanctum di `backend/`, REST API di `http://127.0.0.1:8000/api/v1`
- **Database** — SQLite (default, tidak perlu PostgreSQL)
- Kontrak API: [API_CONTRACT.md](API_CONTRACT.md), catatan integrasinya di [INTEGRASI_FRONTEND_BACKEND.md](INTEGRASI_FRONTEND_BACKEND.md)
- Mockup desain: folder `Design/`

## Menjalankan aplikasi

Prasyarat: Node 18+, PHP **8.3 atau lebih baru** (sudah diuji di 8.5), Composer.

### 1. Backend (PowerShell terminal pertama)

```powershell
Set-Location .\backend
if (!(Test-Path vendor)) { composer install }
if (!(Test-Path .env)) {
  Copy-Item .env.example .env
  php artisan key:generate
}
php artisan migrate --seed
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

`.env.example` sudah mengarah ke SQLite (`DB_CONNECTION=sqlite`), tidak perlu membuat
database sendiri — `migrate` akan membuat `backend/database/database.sqlite`.
Biarkan terminal backend tetap terbuka.

Jika `.env` sudah ada dan aplikasi pernah disiapkan, jangan menimpa `.env` atau
mengulang `key:generate`. Cukup jalankan:

```powershell
Set-Location .\backend
php artisan migrate --seed
```

`migrate --seed` tidak menghapus data. Untuk hanya mengisi ulang akun dan data
contoh pada database yang migrasinya sudah lengkap, jalankan
`php artisan db:seed --class=DatabaseSeeder`.

Kalau PHP  8.2 atau lebih lama, `composer install` akan gagal
(`symfony/*` v8 butuh PHP 8.4+). Di Windows, unduh ZIP "PHP 8.x NTS Windows", extract ke
misalnya `C:\php-8.5-portable`, buat `php.ini` di dalamnya dengan:

```ini
extension_dir = "C:\php-8.5-portable\ext"
extension=mbstring
extension=openssl
extension=fileinfo
extension=curl
extension=pdo_sqlite
extension=sqlite3
extension=zip
extension=intl
extension=gd
```

lalu jalankan perintah di atas dengan `C:\php-8.5-portable\php.exe artisan ...`.

### 2. Frontend (PowerShell terminal kedua)

```powershell
Set-Location .\frontend
npm.cmd install
npm.cmd start
```

Buka `http://localhost:3000`. Alamat API bisa diganti lewat `REACT_APP_API_URL` di
`frontend/.env`; default-nya sudah `http://127.0.0.1:8000/api/v1`.
Jalankan perintah frontend dari folder `frontend` (bukan root repo), dan biarkan
terminal ini tetap terbuka. Jika `.env` frontend diubah, hentikan lalu mulai ulang
frontend agar konfigurasi API dimuat ulang.

> Kalau muncul **"Failed to fetch"**, hampir selalu berarti `php artisan serve` mati —
> cek terminal backend, jalankan ulang, lalu refresh browser.

### Memeriksa koneksi dan data

Dengan kedua server berjalan, buka `http://127.0.0.1:8000/api/v1/products?per_page=3`.
Respons harus memiliki `data` berisi produk. Untuk memastikan akun demo tersedia,
jalankan `php artisan db:seed --class=DatabaseSeeder` dari folder `backend`, lalu
masuk dengan kredensial di bawah. Jika katalog masih kosong, pastikan terminal
backend berada di folder `backend` dan `DB_CONNECTION=sqlite` pada `backend/.env`
mengarah ke database yang sama.

## Akun demo

| Email | Password | Peran |
| --- | --- | --- |
| `admin@wartatekno.id` | `password` | Admin — membuka panel katalog |
| `budi@wartatekno.id` | `password` | Member — ulasan, komentar, simpan produk |

Untuk menghapus seluruh data dan membangun ulang database dari awal (PERINGATAN:
semua data lokal akan hilang):

```powershell
Set-Location .\backend
php artisan migrate:fresh --seed
```

## Fitur

**Publik** — katalog produk dengan filter kategori dan pencarian, halaman detail produk
(spesifikasi, harga referensi, diskusi komentar), tulis ulasan + rating, like komentar,
koleksi tersimpan (wishlist), form masukan/feedback, halaman Tentang Kami.

**Admin** — Kelola Produk (tambah, edit, aktifkan produk draf, hapus, buka detail),
Moderasi Komentar (setujui, tandai spam, hapus), Feedback Pengguna (ubah status,
tandai selesai, hapus).

Statistik admin diambil dari endpoint dashboard, komentar biasa dimoderasi sebelum
dipublikasikan, dan balasan komentar dapat bertingkat. Upload gambar produk mendukung
file PNG/JPG/WebP atau URL. Detail endpoint dan aturan payload ada di
[API_CONTRACT.md](API_CONTRACT.md) dan [INTEGRASI_FRONTEND_BACKEND.md](INTEGRASI_FRONTEND_BACKEND.md).
