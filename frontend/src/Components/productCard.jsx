import react from 'react';
import saveIcon from '../assets/Tags-Favorite--Streamline-Ultimate.svg';

export function ProductCard({ image, category, title, price, rating }) {
    return (
        <div className="product-card">
            <div className="product-image-container">
                <img src={image} alt={title} className="product-image"/>
                <span className="product-badge">{category}</span>
            </div>
            <div className="product-details">
                <div className="product-rating">⭐ {rating}</div>
                <h3 className="product-title">{title}</h3>
                <div className="price-container">
                    <p className="referensi">Harga Referensi</p>
                    <p className="product-price">Rp{price}</p>
                </div>
                <div className="product-footer">
                    <button type="button" className="detail-btn">Detail & Ulasan  &gt;</button>
                    <button type="button" className="save-btn">
                        <img src={saveIcon} alt="Save Icon" className="save-icon" />
                        <span>Simpan</span>
                    </button>
                </div>
            </div>
        </div>
    );
}