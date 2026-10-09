<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Feedback;
use App\Models\Product;
use App\Models\ProductComment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ---- Users ----
        $admin = User::updateOrCreate(['email' => 'admin@wartatekno.id'], [
            'name' => 'Admin Redaksi', 'password' => 'password', 'role' => 'admin',
        ]);
        $budi = User::updateOrCreate(['email' => 'budi@wartatekno.id'], [
            'name' => 'Budi Santoso', 'password' => 'password', 'role' => 'member',
        ]);

        // ---- Categories ----
        $cats = [];
        foreach (['Smartphone', 'Laptop', 'Audio', 'Smartwatch', 'Tablet', 'Aksesoris'] as $name) {
            $cats[$name] = Category::firstOrCreate(['slug' => Str::slug($name)], ['name' => $name]);
        }

        // ---- Products ----
        $rows = [
            ['Laptop', 'Laptop ThinkPad X1 Carbon Gen 11 (2024)', 'Lenovo', 'LNV-X1C-G11', 28500000, '2024-03-15', true,
                ['Prosesor' => 'Intel Core i7-1365U (10 Core, 12 Threads, up to 5.20 GHz)', 'RAM' => '32 GB LPDDR5 6400MHz (Soldered)',
                 'Penyimpanan' => '1 TB SSD M.2 PCIe Gen 4 NVMe Opal 2.0', 'Layar' => '14" WUXGA (1920x1200) IPS, 16:10, Anti-Glare, 400 nits',
                 'Bobot' => '1.12 kg (Serat Carbon Fiber & Magnesium)', 'Baterai & Daya' => '57Wh Li-Polymer, Rapid Charge 65W USB-C'],
                'Rekomendasi Editor: laptop bisnis tertipis dengan keyboard terbaik di kelasnya.', 9.0],
            ['Smartphone', 'Smartphone Pixel 8 Pro', 'Google', 'GGL-PX8P', 16200000, '2023-10-12', false,
                ['Chipset' => 'Google Tensor G3', 'RAM' => '12 GB', 'Layar' => '6.7" LTPO OLED 120Hz', 'Baterai' => '5050 mAh'], null, null],
            ['Audio', 'Headphone Sony WH-1000XM5', 'Sony', 'SNY-WH1000XM5', 5199000, '2022-05-20', false,
                ['Tipe' => 'Over-ear wireless', 'ANC' => 'Ya, 8 mikrofon', 'Baterai' => 'Hingga 30 jam', 'Konektivitas' => 'Bluetooth 5.2'], null, null],
            ['Smartwatch', 'Smartwatch Garmin Forerunner 265', 'Garmin', 'GRM-FR265', 7799000, '2023-03-16', false,
                ['Layar' => '1.3" AMOLED', 'GPS' => 'Multi-band', 'Baterai' => 'Hingga 13 hari', 'Tahan Air' => '5 ATM'], null, null],
            ['Tablet', 'Tablet iPad Air M2 11 Inci', 'Apple', 'APL-IPADAIR-M2', 11499000, '2024-05-15', false,
                ['Chipset' => 'Apple M2', 'Layar' => '11" Liquid Retina', 'Penyimpanan' => '128 GB', 'Konektivitas' => 'Wi-Fi 6E'], null, null],
            ['Aksesoris', 'Keyboard Keychron Q1 Pro Wireless', 'Keychron', 'KCR-Q1PRO', 3250000, '2023-06-01', false,
                ['Layout' => '75% QMK/VIA', 'Switch' => 'Hot-swappable', 'Koneksi' => 'Bluetooth 5.1 / USB-C', 'Casing' => 'Aluminium CNC'], null, null],
            ['Smartphone', 'Smartphone Samsung Galaxy S24 Ultra', 'Samsung', 'SMG-S24U', 21999000, '2024-01-31', false,
                ['Chipset' => 'Snapdragon 8 Gen 3 for Galaxy', 'RAM' => '12 GB', 'Penyimpanan' => '256 GB', 'Kamera' => '200 MP utama'], null, null],
            ['Laptop', 'Laptop MacBook Air M3 15 Inci', 'Apple', 'APL-MBA15-M3', 22499000, '2024-03-08', false,
                ['Chipset' => 'Apple M3', 'RAM' => '16 GB', 'Penyimpanan' => '512 GB SSD', 'Layar' => '15.3" Liquid Retina'], null, null],
        ];

        $products = [];
        foreach ($rows as [$cat, $title, $brand, $sku, $price, $release, $featured, $specs, $note, $score]) {
            $products[$title] = Product::updateOrCreate(['slug' => Str::slug($title)], [
                'category_id' => $cats[$cat]->id,
                'title' => $title,
                'brand' => $brand,
                'sku' => $sku,
                'description' => "Ulasan lengkap {$title} oleh redaksi WartaTekno.",
                'image_url' => 'https://placehold.co/800x600?text='.urlencode($title),
                'price' => $price,
                'release_date' => $release,
                'specs_json' => $specs,
                'editor_note' => $note,
                'editor_score' => $score,
                'status' => 'active',
                'is_featured' => $featured,
            ]);
        }

        // ---- Comments ----
        $thinkpad = $products['Laptop ThinkPad X1 Carbon Gen 11 (2024)'];
        if (! $thinkpad->comments()->exists()) {
            ProductComment::create([
                'product_id' => $thinkpad->id, 'user_name' => 'Rizky Pratama', 'user_email' => 'rizky@example.com',
                'comment_text' => 'Keyboard ThinkPad ini adalah yang terbaik untuk mengetik seharian. Daya tahan baterai dapat 7 jam lebih untuk browsing dan coding ringan.',
                'rating' => 5, 'upvotes_count' => 12, 'status' => 'approved',
            ]);
            $q = ProductComment::create([
                'product_id' => $thinkpad->id, 'user_name' => 'Dimas Nugroho', 'user_email' => 'dimas@example.com',
                'comment_text' => 'Apakah RAM-nya bisa di-upgrade seandainya nanti butuh lebih?', 'upvotes_count' => 7, 'status' => 'approved',
            ]);
            ProductComment::create([
                'product_id' => $thinkpad->id, 'parent_id' => $q->id, 'user_id' => $admin->id, 'user_name' => 'WartaTekno Staff',
                'user_email' => $admin->email, 'is_staff' => true, 'status' => 'approved',
                'comment_text' => 'Halo Dimas, RAM pada ThinkPad X1 Carbon Gen 11 bersifat soldered, jadi tidak bisa di-upgrade setelah pembelian.',
            ]);
            ProductComment::create([
                'product_id' => $products['Laptop MacBook Air M3 15 Inci']->id, 'user_name' => 'Akunbaster99', 'user_email' => 'spam@example.com',
                'comment_text' => 'Dapatkan diskon gila di https://spam.example/promo sekarang!', 'status' => 'flagged',
            ]);
        }

        // ---- Feedbacks ----
        if (! Feedback::exists()) {
            Feedback::insert([
                ['name' => 'Rizo Pratama', 'email' => 'rizo@example.com', 'category' => 'product_request', 'rating' => 5, 'status' => 'new',
                 'message' => 'Tolong tambahkan review lengkap Asus ROG Ally X 2024!', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Nabila Zuhri', 'email' => 'nabila@example.com', 'category' => 'bug_report', 'rating' => 3, 'status' => 'read',
                 'message' => 'Filter kategori tablet tidak menampilkan hasil di browser Safari.', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Hendra Susanto', 'email' => 'hendra@example.com', 'category' => 'feature_suggestion', 'rating' => 4, 'status' => 'new',
                 'message' => 'Fitur perbandingan spesifikasi 2 gadget side-by-side.', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
    }
}
