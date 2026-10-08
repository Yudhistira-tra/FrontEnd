import React, { useState } from 'react';
import './HeroSection.css';

function CategoryButton({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      className={`category-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function HeroSection({ onSelectCategory, onSearch, currentUser, onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['Semua', 'Smartphone', 'Laptop', 'Audio', 'Smartwatch', 'Tablet', 'Aksesoris'];

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (onSelectCategory) onSelectCategory(category);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <section className="hero-section">
      <div className="top-text">
        <div className="text-container">
          <h1 style={{ fontSize: 40, fontWeight: 750 }}>Temukan Ulasan Gadget & Teknologi Terbaru</h1>
          <p style={{ fontSize: 16 }}>Portal ulasan independen, spesifikasi akurat, dan ruang diskusi gadget terpercaya.</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="hero-search">
          <input
            className="search-input"
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">Cari</button>
        </form>
        <div className="category-buttons-container">
          {categories.map((category) => (
            <CategoryButton
              key={category}
              label={category}
              isActive={activeCategory === category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
        {!currentUser && (
          <div className="community-bar">
            <div className="community-left">
              <div>
                <strong>Bergabung dengan Komunitas WartaTekno <span className="guest-pill">Akses Guest</span></strong>
                <p>Masuk untuk simpan wishlist gadget, beri rating independen, dan dapatkan notifikasi penurunan harga.</p>
              </div>
            </div>
            <button type="button" className="community-btn" onClick={() => onNavigate && onNavigate('login')}>
              Masuk / Daftar Sekarang
            </button>
          </div>
        )}
      </div>
    </section>
  );
}