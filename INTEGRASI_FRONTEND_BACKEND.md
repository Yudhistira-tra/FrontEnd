# Integrasi Frontend WartaTekno dengan API Backend Laravel

Frontend menggunakan `fetch` ke API Laravel pada `REACT_APP_API_URL` (default `http://127.0.0.1:8000/api/v1`). Endpoint di bawah disesuaikan dengan `routes/api.php` dan daftar `php artisan route:list` backend.

## Pemetaan halaman dan endpoint

| Halaman/fitur | Endpoint |
|---|---|
| Beranda/katalog | `GET /products`, `GET /categories` |
| Detail produk | `GET /products/{id-atau-slug}`, `GET /products/{id-atau-slug}/comments` |
| Login/registrasi | `POST /auth/login`, `POST /auth/register` |
| Sesi pengguna | `GET /auth/me`, `POST /auth/logout` |
| Koleksi tersimpan | `GET /me/saved`, `POST /me/saved/{productId}`, `PATCH /me/saved/{productId}`, `DELETE /me/saved/{productId}` |
| Ulasan produk | `POST /products/{id-atau-slug}/comments`, `POST /comments/{commentId}/like` |
| Feedback publik | `POST /feedback` |
| Admin – dashboard data | `GET /admin/dashboard` tersedia di backend |
| Admin – produk | `GET /admin/products`, `POST /products`, `PUT /products/{productId}`, `DELETE /products/{productId}` |
| Admin – moderasi komentar | `GET /admin/comments`, `PATCH /admin/comments/{commentId}`, `DELETE /admin/comments/{commentId}` |
| Admin – feedback | `GET /admin/feedbacks`, `PATCH /admin/feedbacks/{feedbackId}`, `DELETE /admin/feedbacks/{feedbackId}` |

Halaman Tentang Kami bersifat informatif/statis sehingga tidak membutuhkan request database. Login Google dan reset kata sandi tidak dihubungkan karena backend belum menyediakan endpoint untuk kedua fitur tersebut.

## Catatan pemetaan data

- Daftar produk publik hanya mengembalikan produk berstatus `active`; halaman admin mengambil seluruh status melalui `/admin/products`.
- Frontend memakai `slug` sebagai ID tampilan/navigasi, tetapi memakai ID numerik database (`databaseId`) untuk route yang memakai implicit model binding seperti simpan/hapus/edit produk.
- API komentar menerima `comment_text`; komentar guest membutuhkan `user_name` dan `user_email`, sedangkan komentar pengguna login memakai identitas token. Antarmuka saat ini meminta login sebelum mengirim komentar.
- Feedback backend hanya memiliki `message`, bukan `title`; frontend menggabungkan judul dan isi menjadi satu `message` agar sesuai validasi backend.
- Endpoint koleksi tersimpan menggunakan pagination default 12 item; frontend mengambil seluruh halaman yang dilaporkan API.
- Backend belum memiliki endpoint khusus upload gambar produk. Form admin saat ini menyimpan `image_url` dari URL yang ditempel pengguna, bukan mengunggah file lokal.

## Menjalankan

1. Pastikan `.env` berada di folder `frontend` (sejajar dengan `package.json`) dan berisi:

   ```env
   REACT_APP_API_URL=http://127.0.0.1:8000/api/v1
   ```

2. Jalankan backend dari folder Laravel: `php artisan serve`.
3. Jalankan frontend dari folder `frontend`: `npm install` lalu `npm start`.
4. Jika `.env` diubah saat React berjalan, hentikan frontend dengan `Ctrl+C`, lalu jalankan `npm start` kembali.
5. Request hanya bisa berhasil jika PostgreSQL hidup, `.env` backend benar, migrasi sudah dijalankan, dan database berisi data.

Akun seed (jika seeder sudah dijalankan): `admin@wartatekno.id` / `password` dan `budi@wartatekno.id` / `password`.
