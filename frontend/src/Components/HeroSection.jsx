import React, { useState } from 'react';


export function HeroSection() {
    return (
        <section className="hero-section">
            <div className="top-text">
                <h1>Temukan Ulasan Gadget & Teknologi Terbaru</h1>
                <p>Portal ulasan independen, spesifikasi akurat, dan ruang diskusi gadget terpercaya.</p>
                <div className="hero-search">
                    <input className="search-input" type="text" placeholder="Cari produk..." />
                    <button type="button" className="search-btn">Cari</button>
                </div>
            </div>
        </section>
    );
}