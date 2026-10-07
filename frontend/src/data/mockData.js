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
    status: "Disetujui"
  },
  {
    id: "c2",
    productId: "thinkpad-x1-gen11",
    userName: "Dimas Prasetyo",
    userRole: "Tamu Unverified",
    rating: 1.0,
    comment: "Kunjungi tautan judi online ini untuk slot gacor...",
    createdAt: "3 Jam lalu",
    status: "Spam"
  }
];