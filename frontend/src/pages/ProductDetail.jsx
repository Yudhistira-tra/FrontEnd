import React, { useState } from 'react';
import './ProductDetail.css';
import { initialProducts, initialComments } from '../data/mockData';

function initials(name) {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function ProductDetail({ productId = 'thinkpad-x1-gen11', products, onBackToGrid, currentUser, onRequireLogin, isSaved, onToggleSave }) {
  const catalog = products && products.length > 0 ? products : initialProducts;
  const product = catalog.find((p) => p.id === productId) || catalog[0];
  const isGuest = !currentUser;

  const [selectedImage, setSelectedImage] = useState(0);

  const [comments, setComments] = useState(
    initialComments
      .filter((c) => c.productId === product.id && c.status !== 'Spam')
      .map((c) => ({ ...c, likes: c.likes || 0 }))
  );

  const [likedIds, setLikedIds] = useState([]);

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const handleLike = (commentId) => {
    if (isGuest) {
      if (onRequireLogin) onRequireLogin();
      return;
    }
    const hasLiked = likedIds.includes(commentId);
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: (c.likes || 0) + (hasLiked ? -1 : 1) } : c))
    );
    setLikedIds((prev) => (hasLiked ? prev.filter((id) => id !== commentId) : [...prev, commentId]));
  };

  const handleReply = (userName) => {
    if (isGuest) {
      if (onRequireLogin) onRequireLogin();
      return;
    }
    setNewComment((prev) => (prev ? `${prev} @${userName} ` : `@${userName} `));
    document.getElementById('review-textarea')?.focus();
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (isGuest || !newComment.trim()) return;

    const commentObj = {
      id: `c-${Date.now()}`,
      productId: product.id,
      userName: currentUser?.name || 'User Terverifikasi',
      userRole: currentUser?.role === 'admin' ? 'Admin' : 'Member Terverifikasi',
      rating: newRating,
      createdAt: 'Baru saja',
      comment: newComment,
      likes: 0
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

            <div className="detail-actions">
              <button
                type="button"
                className={`fav-btn ${isSaved ? 'active' : ''}`}
                onClick={() => onToggleSave && onToggleSave(product.id)}
              >
                {isSaved ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}
              </button>
              <button
                type="button"
                className="review-btn"
                onClick={() => document.getElementById('review-textarea')?.focus()}
              >
                Tulis Ulasan Saya
              </button>
            </div>

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
          <div className="discussion-head">
            <div>
              <h2>Diskusi & Komentar Pengguna</h2>
              <p>Berbagi opini, impresi pemakaian nyata, atau ajukan pertanyaan teknis.</p>
            </div>
            <span className="comment-count-pill">{comments.length} Komentar</span>
          </div>

          {isGuest ? (
            <div className="comment-locked">
              <div className="comment-locked-text">
                <strong>Masuk untuk menulis komentar & rating <span className="guest-pill">Mode Tamu</span></strong>
                <p>Anda belum masuk ke akun WartaTekno. Silakan masuk atau buat akun gratis agar dapat membagikan impresi, memberi rating, dan berdiskusi.</p>
              </div>
              <div className="comment-locked-actions">
                <button type="button" className="submit-comment-btn" onClick={() => onRequireLogin && onRequireLogin()}>
                  Masuk Akun Sekarang
                </button>
                <button type="button" className="btn-light" onClick={() => onRequireLogin && onRequireLogin('register')}>
                  Daftar Gratis
                </button>
              </div>
            </div>
          ) : (
          <form onSubmit={handleAddComment} className="review-card">
            <div className="review-card-head">
              <div className="review-user">
                <span className="avatar">{initials(currentUser.name)}</span>
                <div>
                  <strong>Tulis Ulasan & Komentar Anda sebagai {currentUser.name}</strong>
                  <p>Ulasan Anda akan dipublikasikan secara langsung untuk komunitas WartaTekno.</p>
                </div>
              </div>
              <span className="badge-verified">✓ {currentUser.role === 'admin' ? 'Admin' : 'Member Terverifikasi'}</span>
            </div>

            <div className="rating-row">
              <span className="rating-label">Rating Keseluruhan:</span>
              <span className="star-picker">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={s <= newRating ? 'star on' : 'star'}
                    onClick={() => setNewRating(s)}
                    aria-label={`${s} bintang`}
                  >
                    ★
                  </button>
                ))}
              </span>
              <strong>{newRating}.0 / 5.0</strong>
            </div>

            <label className="review-text-label" htmlFor="review-textarea">Ulasan & Opini Pribadi</label>
            <textarea
              id="review-textarea"
              rows={4}
              placeholder={`Bagikan pengalaman performa, daya tahan, atau pertanyaan teknis terkait ${product.title}...`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <div className="review-card-foot">
              <span className="markdown-hint">Format teks Markdown didukung</span>
              <button type="submit" className="submit-comment-btn">Publikasikan Ulasan</button>
            </div>
          </form>
          )}

          <div className="comments-list">
            {comments.map((comment) => {
              const hasLiked = likedIds.includes(comment.id);

              return (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <div className="user-info">
                      <span className="avatar">{initials(comment.userName)}</span>
                      <div>
                        <div className="comment-name-row">
                          <strong>{comment.userName}</strong>
                          <span className="comment-stars">{'★'.repeat(comment.rating || 5)}</span>
                        </div>
                        <span className="comment-date">{comment.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <p className="comment-content">{comment.comment}</p>

                  <div className="comment-actions">
                    <button
                      type="button"
                      className={`like-btn ${hasLiked ? 'active' : ''}`}
                      onClick={() => handleLike(comment.id)}
                      title={isGuest ? 'Masuk untuk menyukai' : 'Suka'}
                    >
                      ⇧ {comment.likes || 0} Suka
                    </button>
                    <button
                      type="button"
                      className="reply-btn"
                      onClick={() => handleReply(comment.userName)}
                    >
                      ← Balas
                    </button>
                  </div>

                  {comment.reply && (
                    <div className="staff-reply">
                      <div className="comment-header">
                        <div className="user-info">
                          <span className="avatar">{initials(comment.reply.author)}</span>
                          <div>
                            <div className="comment-name-row">
                              <strong>{comment.reply.author}</strong>
                              <span className="staff-badge">Admin</span>
                            </div>
                            <span className="comment-date">{comment.reply.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                      <p className="comment-content">{comment.reply.text}</p>
                      <div className="comment-actions">
                        <span className="helpful">{comment.reply.helpful} Terbantu</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
