import React, { useState } from 'react';
import './ProductModal.css';

const categoryOptions = ['Smartphone', 'Laptop', 'Audio', 'Smartwatch', 'Tablet', 'Aksesoris'];

export function ProductModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: 'ASUS ROG Zephyrus G16 (2024)',
    category: 'Laptop',
    sku: 'ASUS-ROG-G16-2024',
    price: '32999000',
    brand: 'ASUS',
    image: '',
    specsSummary: 'Intel Core Ultra 9 185H, RTX 4070 8GB GDDR6, 32GB LPDDR5X, 1TB SSD NVMe, Layar 16-inch ROG Nebula OLED 2.5K 240Hz',
  });
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB.');
      return;
    }
    setError('');
    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category || !form.price || !form.brand.trim()) {
      setError('Nama produk, kategori, harga, dan merek wajib diisi.');
      return;
    }
    const priceNum = Number(String(form.price).replace(/[^0-9]/g, ''));
    if (!priceNum) {
      setError('Harga referensi tidak valid.');
      return;
    }
    if (onSave) {
      onSave({
        title: form.title.trim(),
        brand: form.brand.trim(),
        category: form.category,
        sku: form.sku.trim() || `SKU-${Date.now()}`,
        price: priceNum,
        rating: 5.0,
        reviewsCount: 0,
        status: 'Draf',
        image: form.image || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
        description: form.specsSummary.trim(),
        specs: form.specsSummary.trim()
          ? [{ label: 'Ringkasan', value: form.specsSummary.trim() }]
          : [],
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2>Tambah Produk Baru</h2>
            <p>Lengkapi detail informasi produk elektronik untuk katalog WartaTekno</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="modal-group">
            <label>NAMA PRODUK <span className="req">*</span></label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="ASUS ROG Zephyrus G16 (2024)" />
          </div>

          <div className="modal-row">
            <div className="modal-group">
              <label>KATEGORI PRODUK <span className="req">*</span></label>
              <select name="category" value={form.category} onChange={handleChange}>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="modal-group">
              <label>SKU / KODE MODEL</label>
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="ASUS-ROG-G16-2024" />
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-group">
              <label>HARGA REFERENSI (RP) <span className="req">*</span></label>
              <div className="price-wrap">
                <span>Rp</span>
                <input name="price" value={form.price} onChange={handleChange} placeholder="32.999.000" inputMode="numeric" />
              </div>
            </div>
            <div className="modal-group">
              <label>MEREK / BRAND <span className="req">*</span></label>
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="ASUS" />
            </div>
          </div>

          <div className="modal-group">
            <label>UPLOAD GAMBAR PRODUK</label>
            <label className="dropzone">
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} hidden />
              {(preview || form.image) ? (
                <img src={preview || form.image} alt="preview" className="drop-preview" />
              ) : (
                <>
                  <span className="drop-text">Tarik foto produk ke sini atau <span className="drop-link">pilih file</span></span>
                  <span className="drop-hint">Format didukung: PNG, JPG, WebP (maksimal 5MB)</span>
                </>
              )}
            </label>
            <input
              name="image"
              value={form.image.startsWith('blob:') ? '' : form.image}
              onChange={handleChange}
              placeholder="...atau tempel URL gambar di sini"
              className="url-input"
            />
          </div>

          <div className="modal-group">
            <label>RINGKASAN SPESIFIKASI UTAMA</label>
            <textarea name="specsSummary" rows={4} value={form.specsSummary} onChange={handleChange} />
          </div>

          {error && <div className="modal-error">{error}</div>}

          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-save">✓ Simpan Produk</button>
          </div>
        </form>
      </div>
    </div>
  );
}
