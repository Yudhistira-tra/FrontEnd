import React, { useState } from 'react';
import './ProductModal.css';


// specsSummary is prefilled as "Label: value" per line, so split each line back
// into a pair — otherwise saving an edit collapses every spec into one entry.
function parseSpecs(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const colon = line.indexOf(':');
      return colon > 0
        ? { label: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() }
        : { label: 'Ringkasan', value: line };
    });
}

export function ProductModal({ onClose, onSave, initialProduct, categories = [] }) {
  const [form, setForm] = useState(() => initialProduct ? ({ title: initialProduct.title || '', category: initialProduct.category || 'Laptop', sku: initialProduct.sku || '', price: String(initialProduct.price || ''), brand: initialProduct.brand || '', image: initialProduct.image || '', specsSummary: (initialProduct.specs || []).map(s => `${s.label}: ${s.value}`).join('\n') || initialProduct.description || '' }) : ({
    title: 'ASUS ROG Zephyrus G16 (2024)',
    category: 'Laptop',
    sku: 'ASUS-ROG-G16-2024',
    price: '32999000',
    brand: 'ASUS',
    image: '',
    specsSummary: 'Intel Core Ultra 9 185H, RTX 4070 8GB GDDR6, 32GB LPDDR5X, 1TB SSD NVMe, Layar 16-inch ROG Nebula OLED 2.5K 240Hz',
  }));
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
    setError('Backend saat ini menerima URL gambar, belum menyediakan endpoint upload file. Tempel URL gambar pada kolom di bawah.');
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
        databaseId: initialProduct?.databaseId,
        title: form.title.trim(),
        brand: form.brand.trim(),
        category: form.category,
        sku: form.sku.trim() || `SKU-${Date.now()}`,
        price: priceNum,
        rating: 5.0,
        reviewsCount: 0,
        status: initialProduct?.status || 'Draf',
        image: form.image && !form.image.startsWith('blob:') ? form.image : '',
        description: form.specsSummary.trim(),
        specs: parseSpecs(form.specsSummary.trim()),
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2>{initialProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
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
                {categories.map((c) => (
                  <option key={c.id || c.slug} value={c.name}>{c.name}</option>
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
            <button type="submit" className="btn-save">✓ {initialProduct ? 'Simpan Perubahan' : 'Simpan Produk'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
