import React from 'react';
import './navbar.css';

export function Navbar({onNavigate}) {
    return (
        <nav className="navbar">
            <div className="navbar-content-left">
                <div className="logo" onClick={() => onNavigate('home')} style={{cursor: 'pointer'}}>PTKOM</div>
                    <div className="navbar-links">
                        <a href="#Beranda" onClick={() => onNavigate('home')}>Beranda</a>
                        <a href="#Produk">Produk & Ulasan</a>
                        <a href="#Kontak" onClick={(e) => { e.preventDefault(); onNavigate('kontak'); }}>Kontak</a>
                    </div>
            </div>

            <div className="navbar-content-right">
                <span>Mode Tamu</span>
                <div type="button" onClick={() => onNavigate('login')}>Masuk</div>
                <div type="button" onClick={() => onNavigate('register')}>Daftar</div>
            </div>
        </nav>
    );
}