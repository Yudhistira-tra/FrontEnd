import React, { useState } from 'react';
import './KoleksiTersimpan.css';

export function KoleksiTersimpan({ savedProducts, currentUser, onRemove, onOpenDetail, onBackToHome, onBrowse }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', ...new Set(savedProducts.map((p) => p.category))];

  const filtered = savedProducts.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const countBy = (cat) => savedProducts.filter((p) => p.category === cat).length;

  return (
    <div className="saved-page">
      <div className="saved-info-bar">
        <span>Menampilkan <strong>{savedProducts.length} produk gadget tersimpan</strong> dalam pantauan Anda.</span>
      </div>

      <div className="saved-breadcrumb">
        <button type="button" onClick={onBackToHome}>Beranda</button>
        <span>›</span><strong>Koleksi Tersimpan</strong>
      </div>

      <div className="saved-head">
        <div>
          <div className="saved-eyebrow">PUSTAKA PERSONAL</div>
          <h1>Koleksi &amp; Arsip Tersimpan</h1>
          <p>Kelola gadget incaran yang Anda pantau secara langsung dan artikel komprehensif yang disimpan untuk dibaca kembali.</p>
        </div>
        <button type="button" className="share-btn" onClick={() => alert('Tautan wishlist disalin (mock).')}>Bagikan Wishlist</button>
      </div>

      <div className="saved-filters">
        <div className="saved-pills">
          <button
            type="button"
            className={`pill ${selectedCategory === 'Semua' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Semua')}
          >
            Semua Simpanan ({savedProducts.length})
          </button>
          {categories.filter((c) => c !== 'Semua').map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat} ({countBy(cat)})
            </button>
          ))}
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Cari dalam arsip tersimpan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <h2 className="saved-section-title">Gadget &amp; Produk Pantauan Anda <span className="item-badge">{filtered.length} Item</span></h2>

      {filtered.length === 0 ? (
        <div className="saved-empty">
          <p>Belum ada produk tersimpan{savedProducts.length > 0 ? ' yang cocok dengan filter' : ''}.</p>
          <button type="button" className="share-btn" onClick={onBrowse}>Jelajahi Basis Data Produk</button>
        </div>
      ) : (
        <div className="saved-grid">
          {filtered.map((p) => (
            <article key={p.id} className="saved-card">
              <div className="saved-img-wrap">
                <img src={p.image} alt={p.title} />
                <span className="saved-cat">{p.category}</span>
                <button type="button" className="unsave-btn" title="Hapus dari simpanan" onClick={() => onRemove(p.id)}>×</button>
              </div>
              <div className="saved-body">
                <div className="saved-brand-row">
                  <span className="saved-brand">{(p.brand || '').toUpperCase()}</span>
                  <span className="saved-rating">★ {p.rating} <span>({p.reviewsCount || 0} Ulasan)</span></span>
                </div>
                <h3>{p.title}</h3>
                <p className="saved-specs">{p.description?.slice(0, 90)}{p.description?.length > 90 ? '...' : ''}</p>
                <div className="saved-price-row">
                  <span>Harga Referensi</span>
                  <strong>Rp {(p.price || 0).toLocaleString('id-ID')}</strong>
                </div>
                <button type="button" className="detail-full-btn" onClick={() => onOpenDetail(p.id)}>
                  Lihat Detail &amp; Ulasan
                </button>
                <button type="button" className="discount-btn" onClick={() => alert('Target diskon dicatat (mock).')}>
                  Atur Target Diskon
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="saved-cta">
        <div>
          <strong>Ingin menambahkan gadget ke pantauan?</strong>
          <p>Jelajahi basis data ulasan laboratorium kami, bandingkan spek, dan tandai tombol bookmark untuk menerima alert harga terendah.</p>
        </div>
        <button type="button" className="share-btn" onClick={onBrowse}>Jelajahi Basis Data Produk</button>
      </div>
    </div>
  );
}
