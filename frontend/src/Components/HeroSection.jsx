import React, { useState } from 'react';

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

export function HeroSection() {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const categories = ['Semua', 'Smartphone', 'Laptop', 'Audio', 'Smartwatch', 'tablet', 'Aksesoris'];

    return (
        <section className="hero-section">
            <div className="top-text">
                <div className="text-container">
                    <h1 style={{fontSize: 48, fontWeight: 750}}>Temukan Ulasan Gadget & Teknologi Terbaru</h1>
                    <p style={{fontSize: 18}}>Portal ulasan independen, spesifikasi akurat, dan ruang diskusi gadget terpercaya.</p>
                </div>
                <div className="hero-search">
                    <input className="search-input" type="text" placeholder="Cari produk..." />
                    <button type="button" className="search-btn">Cari</button>
                </div>
                <div className="category-buttons-container">
                    {categories.map((category) => (
                        <CategoryButton
                            key={category}
                            label={category}
                            isActive={activeCategory === category}
                            onClick={() => setActiveCategory(category)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}