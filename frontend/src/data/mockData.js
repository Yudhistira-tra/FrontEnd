// src/data/mockData.js

export const initialProducts = [
  {
    id: "thinkpad-x1-gen11",
    title: "ThinkPad X1 Carbon Gen 11",
    brand: "Lenovo",
    category: "Laptop",
    sku: "LNV-X1C11-01",
    price: 28500000,
    rating: 4.8,
    reviewsCount: 42,
    status: "Aktif",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500",
    description:
      "Generasi ke-11 dari lini legendaris ini tetap menjadi standar emas ultrabook bisnis dengan bobot hanya 1.12 kg dan ergonomi keyboard terbaik di kelasnya.",
    specs: [
      { label: "Prosesor", value: "Intel Core i7-1365U (10 Cores, up to 5.20 GHz)" },
      { label: "Memori RAM", value: "32 GB LPDDR5 6400MHz (Soldered)" },
      { label: "Penyimpanan", value: "1 TB SSD M.2 PCIe Gen 4 NVMe Opal 2.0" },
      { label: "Layar", value: "14 WUXGA (1920 x 1200) IPS, 16:10, 400 nits" },
      { label: "Bobot", value: "1.12 kg (Sasis Carbon Fiber & Magnesium)" },
      { label: "Baterai", value: "57Wh Li-Polymer, Rapid Charge 65W USB-C" },
    ]
  },
  {
    id: "macbook-pro-14-m3",
    title: "Apple MacBook Pro 14 M3 Pro",
    brand: "Apple",
    category: "Laptop",
    sku: "APL-MBP14M3-02",
    price: 31999000,
    rating: 4.9,
    reviewsCount: 89,
    status: "Aktif",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    description: "Laptop berkinerja tinggi dengan chip M3 Pro untuk profesional kreatif.",
    specs: [
      { label: "Prosesor", value: "Apple M3 Pro (11-core CPU, 14-core GPU)" },
      { label: "Memori RAM", value: "18 GB Unified Memory" },
      { label: "Penyimpanan", value: "512 GB SSD Superfast" },
      { label: "Layar", value: "14.2-inch Liquid Retina XDR display" },
    ]
  },
  {
    id: "samsung-s24-ultra",
    title: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphone",
    sku: "SMG-S24U-512",
    price: 21999000,
    rating: 4.7,
    reviewsCount: 210,
    status: "Aktif",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
    description: "Smartphone flagship dengan kamera 200MP dan fitur Galaxy AI terintegrasi.",
    specs: [
      { label: "Prosesor", value: "Snapdragon 8 Gen 3 for Galaxy" },
      { label: "RAM / ROM", value: "12 GB / 512 GB" },
      { label: "Kamera", value: "200 MP Main + 50 MP Periscope Telephoto" },
    ]
  },
  {
    id: "sony-wh1000xm5",
    title: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Audio",
    sku: "SNY-WH1000XM5",
    price: 4999000,
    rating: 4.8,
    reviewsCount: 145,
    status: "Aktif",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    description: "Headphone nirkabel penutup telinga dengan teknologi Noise Cancelling peredam bising terbaik.",
    specs: [
      { label: "Tipe Driver", value: "30mm Precision Engineered" },
      { label: "Daya Tahan Baterai", value: "Hingga 30 Jam (ANC On)" },
    ]
  }
];

export const initialComments = [
  {
    id: "c1",
    productId: "thinkpad-x1-gen11",
    userName: "Reza Pratama",
    userRole: "Member Terverifikasi",
    rating: 5.0,
    comment: "Keyboard ThinkPad tetap yang terbaik untuk mengetik seharian. Daya tahan baterai dapat 9 jam lebih untuk browsing dan coding ringan.",
    createdAt: "2 hari yang lalu",
    status: "Disetujui",
    likes: 12
  },
  {
    id: "c2",
    productId: "thinkpad-x1-gen11",
    userName: "Dimas Prasetyo",
    userRole: "Tamu Unverified",
    rating: 1.0,
    comment: "Kunjungi tautan judi online ini untuk slot gacor...",
    createdAt: "3 Jam lalu",
    status: "Spam",
    likes: 0
  },
  {
    id: "c6",
    productId: "thinkpad-x1-gen11",
    userName: "Dimas Nugroho",
    userRole: "Member",
    rating: 4.0,
    comment: "Apakah RAM-nya bisa di-upgrade sendiri di kemudian hari atau sudah tersolder?",
    createdAt: "4 hari yang lalu",
    status: "Disetujui",
    likes: 3,
    reply: {
      author: "WartaTekno Staff",
      role: "Editorial Staff",
      timeAgo: "3 hari yang lalu",
      text: "Halo Dimas, RAM pada ThinkPad X1 Carbon Gen 11 tersolder permanen (soldered), jadi pastikan memilih kapasitas yang cukup sejak awal pembelian.",
      helpful: 8
    }
  },
  {
    id: "c3",
    productId: "macbook-pro-14-m3",
    userName: "Sari Wulandari",
    userRole: "Member Terverifikasi",
    rating: 4.5,
    comment: "Layar XDR-nya memang tajam, tapi harga masih terasa tinggi untuk ukuran Indonesia.",
    createdAt: "1 Jam lalu",
    status: "Menunggu"
  },
  {
    id: "c4",
    productId: "samsung-s24-ultra",
    userName: "Budi Santoso",
    userRole: "Tamu Unverified",
    rating: 5.0,
    comment: "Kamera 200MP-nya benar-benar jernih saat night mode. Recommended!",
    createdAt: "5 Menit lalu",
    status: "Menunggu"
  },
  {
    id: "c5",
    productId: "sony-wh1000xm5",
    userName: "Rina Kartika",
    userRole: "Member Terverifikasi",
    rating: 4.0,
    comment: "ANC-nya luar biasa, tapi headband-nya agak sesak setelah pemakaian lebih dari 3 jam.",
    createdAt: "1 Hari lalu",
    status: "Menunggu"
  }
];

export const feedbackCategories = [
  "Permintaan Ulasan Produk Baru",
  "Laporan Bug & Sistem",
  "Saran Fitur & UI"
];

export const feedbackStatuses = [
  "Belum Ditanggapi",
  "Sedang Ditinjau Tim Teknis",
  "Diimplementasikan",
  "Selesai"
];

export const mockUsers = [
  {
    name: "Admin Redaksi",
    email: "admin@wartatekno.id",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    password: "member123",
    role: "member"
  }
];

export const initialFeedbacks = [
  {
    id: "f1",
    category: "Permintaan Ulasan Produk Baru",
    userName: "Reza Pratama",
    email: "reza.pratama@email.com",
    timeAgo: "2 Jam yang lalu",
    title: "Tolong tambahkan review lengkap Asus ROG Ally X 2024",
    message: "Halo tim WartaTekno, mohon ulas handheld konsol Asus ROG Ally X terbaru terkait daya tahan baterai dan ergonomi grip saat bermain game AAA. Apakah worth it untuk upgrade dari ROG Ally Z1 Extreme generasi pertama? Terima kasih!",
    tags: ["Kategori Perangkat: Gaming Handheld", "Target: Asus ROG Ally X"],
    status: "Belum Ditanggapi"
  },
  {
    id: "f2",
    category: "Laporan Bug & Sistem",
    userName: "Nabila Putri",
    email: "nabila.p@email.com",
    timeAgo: "Kemarin, 16:45",
    title: "Filter kategori tablet tidak menampilkan hasil di browser Safari",
    message: "Saat saya memilih opsi filter 'Tablet & Aksesori' di MacBook Safari 17.4, halaman terus memuat tanpa daftar produk. Mohon dicek tim teknis karena saat coba di Google Chrome berfungsi normal.",
    tags: ["macOS Sonoma / Safari 17.4", "ID Tiket: #BUG-9482"],
    status: "Sedang Ditinjau Tim Teknis"
  },
  {
    id: "f3",
    category: "Saran Fitur & UI",
    userName: "Hendra Gunawan",
    email: "hendra.g@gmail.com",
    timeAgo: "3 Hari yang lalu",
    title: "Fitur perbandingan spesifikasi 2 gadget side-by-side",
    message: "Saran untuk menambahkan fitur komparasi dua laptop/HP secara berdampingan agar pembaca lebih mudah membandingkan prosesor dan layar tanpa harus membuka dua tab terpisah.",
    tags: ["Rilis dalam pembaruan v2.4 (Modul Perbandingan Katalog)"],
    status: "Diimplementasikan"
  }
];