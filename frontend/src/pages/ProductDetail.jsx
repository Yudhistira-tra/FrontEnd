import React, { useState } from 'react';
import './ProductDetail.css';
import { initialProducts, initialComments } from '../data/mockData';

export function ProductDetail({ productId = 'thinkpad-x1-gen11', onBackToGrid, currentUser }) {
  const product = initialProducts.find((p) => p.id === productId) || initialProducts[0];

  const [selectedImage, setSelectedImage] = useState(0);

  const [comments, setComments] = useState(
    initialComments
      .filter((c) => c.productId === product.id)
      .map((c) => ({ ...c, upvotes: c.upvotes || 0 }))
  );

  const [upvotedCommentIds, setUpvotedCommentIds] = useState([]);

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleUpvote = (commentId) => {
    const isAlreadyUpvoted = upvotedCommentIds.includes(commentId);
    
    setComments((prevComments) =>
      prevComments.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            upvotes: (c.upvotes || 0) + (isAlreadyUpvoted ? -1 : 1),
          };
        }
        return c;
      })
    );

    if (isAlreadyUpvoted) {
      setUpvotedCommentIds(upvotedCommentIds.filter((id) => id !== commentId));
    } else {
      setUpvotedCommentIds([...upvotedCommentIds, commentId]);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: `c-${Date.now()}`,
      productId: product.id,
      author: currentUser?.name || 'User Terverifikasi',
      role: 'Member Terverifikasi',
      rating: newRating,
      date: 'Baru saja',
      content: newComment,
      upvotes: 0
    };

    setComments([commentObj, ...comments]);
    setNewComment('');
  };

  return (
    <div className="product-detail-page">
      <header className="product-detail-header">
        <button type="button" onClick={onBackToGrid} className="back-button">
          &larr; Kembali ke Katalog
        </button>
      </header>

      <main className="main-content">
        <div className="product-hero">
          <div className="gallery-container">
            <div className="main-image-card">
              <img
                src={imagesList[selectedImage]}
                alt={product.title}
                className="main-image"
              />
            </div>
            {imagesList.length > 1 && (
              <div className="thumbnail-grid">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`thumbnail-btn ${selectedImage === idx ? 'active' : ''}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="info-container">
            <div>
              <span className="badge-category">{product.category}</span>
              <h1 className="product-title">{product.title}</h1>
              <div className="price-tag-rating">
                Rp {product.startingPrice ? product.startingPrice.toLocaleString('id-ID') : product.price?.toLocaleString('id-ID')}
              </div>
            </div>

            <p className="product-description">{product.description}</p>

            <h3 className="specs-section-title">Spesifikasi Ringkas</h3>
            <div className="specs-card">
              {product.specs && product.specs.map((spec, i) => (
                <div key={i} className="spec-row">
                  <div className="spec-label">
                    <span>{spec.icon || '>'}</span>
                    <span>{spec.label}</span>
                  </div>
                  <div className="spec-value">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="discussion-section">
          <h2>Diskusi & Komentar ({comments.length})</h2>

          <form onSubmit={handleAddComment} className="comment-form">
            <h3>Tulis Ulasan Anda</h3>
            <div className="rating-select">
              <label>Rating:</label>
              <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                <option value={3}>⭐⭐⭐ (3/5)</option>
                <option value={2}>⭐⭐ (2/5)</option>
                <option value={1}>⭐ (1/5)</option>
              </select>
            </div>
            <textarea
              rows={3}
              placeholder="Bagikan pengalaman atau ulasan Anda tentang produk ini..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit" className="submit-comment-btn"> Kirim Ulasan </button>
          </form>

          <div className="comments-list">
            {comments.map((comment) => {
              const hasUpvoted = upvotedCommentIds.includes(comment.id);

              return (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <div className="user-info">
                      <strong>{comment.author}</strong>
                      <span className="badge-verified">{comment.role}</span>
                    </div>
                    <span className="comment-date">{comment.date}</span>
                  </div>
                  <div className="comment-rating">{'★'.repeat(comment.rating)}</div>
                  <p className="comment-content">{comment.content}</p>

                  <div className="comment-actions" style={{ marginTop: '12px' }}>
                    <button
                      type="button"
                      className={`upvote-btn ${hasUpvoted ? 'active' : ''}`}
                      onClick={() => handleUpvote(comment.id)}
                    >
                       {hasUpvoted ? '⬆' : '⇧'} ({comment.upvotes || 0})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}