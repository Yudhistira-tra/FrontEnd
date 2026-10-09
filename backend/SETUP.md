# WartaTekno Backend (Laravel + PostgreSQL)

## Syarat
PHP 8.2+, Composer, PostgreSQL, ekstensi PHP `pdo_pgsql` aktif (php.ini), Laravel 11 atau lebih baru.

## Langkah (sekali saja)
1. Buat database di PostgreSQL:
   `CREATE DATABASE technology_marketplace;`
2. Buat proyek Laravel baru, lalu pasang Sanctum:
   composer create-project laravel/laravel wartatekno-backend
   cd wartatekno-backend
   composer require laravel/sanctum
3. Salin SEMUA isi folder zip ini ke root proyek (timpa jika diminta:
   bootstrap/app.php, migrasi users, DatabaseSeeder).
4. Ubah bagian DB di `.env` sesuai `.env.postgres.example`.
5. Jalankan:
   php artisan migrate --seed
   php artisan storage:link
   php artisan serve

API aktif di http://127.0.0.1:8000/api/v1

Akun seed: admin@wartatekno.id / password (admin), budi@wartatekno.id / password (member).
Segera ganti password admin sebelum dipakai di production.
