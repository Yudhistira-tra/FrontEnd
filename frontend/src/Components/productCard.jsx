import React from 'react';
import './productCard.css';

export function ProductCard({ id, image, category, title, price, rating, onClickDetail }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={image} alt={title} className="product-image" />
        <span className="product-badge">{category}</span>
      </div>
      <div className="product-details">
        <div className="product-rating">★ {rating}</div>
        <h3 className="product-title">{title}</h3>
        <div className="price-container">
          <p className="referensi">Harga Referensi</p>
          <p className="product-price">
            Rp {typeof price === 'number' ? price.toLocaleString('id-ID') : price}
          </p>
        </div>
        <div className="product-footer">
          <button 
            type="button" 
            className="detail-btn" 
            onClick={() => onClickDetail && onClickDetail(id)}
          >
            Detail & Ulasan &gt;
          </button>
          <button type="button" className="save-btn">
            <span>Simpan</span>
          </button>
        </div>
      </div>
    </div>
  );
}