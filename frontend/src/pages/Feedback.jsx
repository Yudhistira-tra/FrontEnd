import React, { useState } from 'react';
import './Feedback.css';
import { feedbackCategories } from '../data/mockData';
import messageIcon from '../assets/Icon-3.png';

export function Feedback({ onSubmit, onBackToHome }) {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    category: feedbackCategories[0],
    title: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.userName.trim() || !formData.email.trim() || !formData.title.trim() || !formData.message.trim()) return;
    if (onSubmit) {
      onSubmit({
        userName: formData.userName.trim(),
        email: formData.email.trim(),
        category: formData.category,
        title: formData.title.trim(),
        message: formData.message.trim(),
      });
    }
    setSuccess(true);
    setFormData({ userName: '', email: '', category: feedbackCategories[0], title: '', message: '' });
  };

  return (
    <div className="feedback-page">
      <header className="feedback-header">
        <button type="button" onClick={onBackToHome} className="back-button">
          &larr; Kembali ke Beranda
        </button>
      </header>

      <div className="feedback-hero">
        <img src={messageIcon} alt="" className="hero-icon" />
        <span className="feedback-eyebrow">KONTAK & MASUKAN</span>
        <h1>Kritik, Saran & Feedback</h1>
        <p>
          Sampaikan permintaan ulasan produk baru, laporan bug teknis, atau saran fitur.
          Masukan Anda langsung masuk ke antrean moderasi admin.
        </p>
      </div>

      {success && (
        <div className="feedback-success">
          Masukan terkirim! Tim redaksi akan meninjau dan menindaklanjutinya. Status awal: Belum Ditanggapi.
        </div>
      )}

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fb-name">Nama Lengkap</label>
            <input
              id="fb-name"
              type="text"
              name="userName"
              placeholder="Nama Anda"
              className="feedback-input"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fb-email">Alamat Email</label>
            <input
              id="fb-email"
              type="email"
              name="email"
              placeholder="nama@email.com"
              className="feedback-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="fb-category">Kategori Masukan</label>
          <select
            id="fb-category"
            name="category"
            className="feedback-input"
            value={formData.category}
            onChange={handleChange}
          >
            {feedbackCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fb-title">Judul Masukan</label>
          <input
            id="fb-title"
            type="text"
            name="title"
            placeholder="Contoh: Tolong review Asus ROG Ally X 2024"
            className="feedback-input"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fb-message">Detail Pesan</label>
          <textarea
            id="fb-message"
            name="message"
            rows={5}
            placeholder="Jelaskan kebutuhan, langkah reproduksi bug, atau detail saran Anda..."
            className="feedback-input"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="feedback-submit">
          Kirim Masukan →
        </button>
      </form>
    </div>
  );
}
