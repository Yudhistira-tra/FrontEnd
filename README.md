# WartaTekno

Portal ulasan dan spesifikasi gadget independen — proyek tugas akhir.

- **Frontend** — React 19 (Create React App) di `frontend/`, jalan di `http://localhost:3000`
- **Backend** — Laravel 13 + Sanctum di `backend/`, REST API di `http://127.0.0.1:8000/api/v1`
- **Database** — SQLite (default, tidak perlu PostgreSQL)
- Kontrak API: [API_CONTRACT.md](API_CONTRACT.md), catatan integrasinya di [INTEGRASI_FRONTEND_BACKEND.md](INTEGRASI_FRONTEND_BACKEND.md)
- Mockup desain: folder `Design/`

## Menjalankan aplikasi

Prasyarat: Node 18+, PHP **8.3 atau lebih baru** (sudah diuji di 8.5), Composer.

### 1. Backend

```bash
cd backend
composer install
cp .env.example .env          # Windows: copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

`.env.example` sudah mengarah ke SQLite (`DB_CONNECTION=sqlite`), jadi tidak perlu membuat
database sendiri — `migrate` akan membuat `backend/database/database.sqlite`.

Kalau PHP di mesin kamu 8.2 atau lebih lama, `composer install` akan gagal
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

### 2. Frontend (terminal terpisah)

```bash
cd frontend
npm install
npm start
```

Buka `http://localhost:3000`. Alamat API bisa diganti lewat `REACT_APP_API_URL` di
`frontend/.env`; default-nya sudah `http://127.0.0.1:8000/api/v1`.

> Kalau muncul **"Failed to fetch"**, hampir selalu berarti `php artisan serve` mati —
> cek terminal backend, jalankan ulang, lalu refresh browser.

## Akun demo

| Email | Password | Peran |
| --- | --- | --- |
| `admin@wartatekno.id` | `password` | Admin — membuka panel katalog |
| `budi@wartatekno.id` | `password` | Member — ulasan, komentar, simpan produk |

Untuk mengembalikan data contoh sebelum demo:

```bash
cd backend && php artisan migrate:fresh --seed
```

## Fitur

**Publik** — katalog produk dengan filter kategori dan pencarian, halaman detail produk
(spesifikasi, harga referensi, diskusi komentar), tulis ulasan + rating, like komentar,
koleksi tersimpan (wishlist), form masukan/feedback, halaman Tentang Kami.

**Admin** — Kelola Produk (tambah, edit, aktifkan produk draf, hapus, buka detail),
Moderasi Komentar (setujui, tandai spam, hapus), Feedback Pengguna (ubah status,
tandai selesai, hapus).

## Catatan yang diketahui

Diwarisi dari proses integrasi FE-BE, belum dibereskan:

- Kartu statistik admin menampilkan placeholder: "+N bulan ini" hanya mengulang total, dan
  "98% Terverifikasi" adalah angka tetap.
- Produk tanpa ulasan menampilkan ★0 di kartu katalog tapi ★5 di kolom rating tabel admin.
- Balasan admin di halaman detail tampil sebagai kartu kosong (nama field tidak cocok).
- Status "Menunggu" di moderasi komentar tidak pernah ditulis backend — komentar langsung
  publish, kecuali berisi tautan (otomatis ditandai Spam).
- Pencarian lewat API (`?search=`) memakai `ilike` khusus PostgreSQL, jadi mengembalikan
  500 di SQLite. Aplikasi web tidak terpengaruh karena filter berjalan di sisi klien.
- Upload gambar produk belum tersedia di backend; modal hanya menerima URL gambar.
- Balasan komentar hanya 1 level, dan timestamp masih format ISO mentah.
