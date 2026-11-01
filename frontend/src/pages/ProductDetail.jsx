import React, { useState } from 'react';
import './ProductDetail.css';
import { getComments, postComment, likeComment, getProduct } from '../services/api';
import saveIcon from '../assets/Icon (9).png';

function initials(name) {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function updateCommentTree(comments, id, updates) {
  return comments.map((comment) => String(comment.id) === String(id)
    ? { ...comment, ...updates }
    : { ...comment, replies: updateCommentTree(comment.replies || [], id, updates) });
}

export function ProductDetail({ productId = 'thinkpad-x1-gen11', products, onBackToGrid, currentUser, onRequireLogin, isSaved, onToggleSave }) {
  const catalog = products || [];
  const [detailProduct, setDetailProduct] = useState(null);
  const product = detailProduct || catalog.find((p) => String(p.id) === String(productId));
  const isGuest = !currentUser;

  const [selectedImage, setSelectedImage] = useState(0);

  const [comments, setComments] = useState([]);
  const [loadError, setLoadError] = useState('');
  React.useEffect(() => {
    let active = true;
    setDetailProduct(null);
    setLoadError('');
    if (productId) getProduct(productId).then((item) => { if (active) setDetailProduct(item); }).catch((err) => { if (active) setLoadError(err.message); });
    return () => { active = false; };
  }, [productId]);
  React.useEffect(() => { if (productId) getComments(productId).then(setComments).catch(err => setLoadError(err.message)); }, [productId]);

  const [likedIds, setLikedIds] = useState([]);
  React.useEffect(() => { setLikedIds(comments.filter(c => c.likedByMe).map(c => c.id)); }, [comments]);

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [replyTarget, setReplyTarget] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const imagesList = product?.images && product.images.length > 0
    ? product.images
    : [product?.image].filter(Boolean);

  const handleLike = (commentId) => {
    if (isGuest) {
      if (onRequireLogin) onRequireLogin();
      return;
    }
    likeComment(commentId).then(result => {
      setComments(prev => updateCommentTree(prev, commentId, { likes: result.upvotes_count }));
      setLikedIds(prev => result.liked
        ? [...new Set([...prev, String(commentId)])]
        : prev.filter(id => String(id) !== String(commentId)));
    }).catch(err => alert(err.message));
  };

  const handleReply = (comment) => {
    if (isGuest) {
      if (onRequireLogin) onRequireLogin();
      return;
    }
    setReplyTarget(comment);
    setSubmissionMessage('');
    setNewComment((prev) => (prev ? `${prev} @${comment.userName} ` : `@${comment.userName} `));
    document.getElementById('review-textarea')?.focus();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (isGuest || !newComment.trim()) return;

    try {
      const result = await postComment(productId, newComment, newRating, replyTarget?.id);
      setNewComment('');
      setReplyTarget(null);
      setSubmissionMessage(result.message || 'Komentar berhasil dikirim.');
      if (result.data?.status === 'approved') {
        try {
          setComments(await getComments(productId));
        } catch (err) {
          alert(`Komentar berhasil dikirim, tetapi daftar komentar gagal diperbarui: ${err.message}`);
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const renderComment = (comment, depth = 0) => (
    <article key={comment.id} className={`comment-item ${depth > 0 ? 'comment-reply' : ''} ${comment.isStaff ? 'staff-reply' : ''}`}>
      <div className="comment-header">
        <div className="user-info">
          <span className="avatar">{initials(comment.userName)}</span>
          <div>
            <div className="comment-name-row">
              <strong>{comment.userName}</strong>
              {comment.isStaff && <span className="staff-badge">Admin</span>}
              {comment.rating != null && <span className="comment-stars">{'★'.repeat(comment.rating)}</span>}
            </div>
            <span className="comment-date">{comment.createdAt}</span>
          </div>
        </div>
      </div>
      <p className="comment-content">{comment.comment}</p>
      <div className="comment-actions">
        <button
          type="button"
          className={`like-btn ${likedIds.includes(String(comment.id)) ? 'active' : ''}`}
          onClick={() => handleLike(comment.id)}
          title={isGuest ? 'Masuk untuk menyukai' : 'Suka'}
        >
          ⇧ {comment.likes || 0} Suka
        </button>
        <button type="button" className="reply-btn" onClick={() => handleReply(comment)}>
          ← Balas
        </button>
      </div>
      {comment.replies?.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}
    </article>
  );

  if (!product) return <div className="product-detail-page"><p>Memuat detail produk atau produk tidak ditemukan.</p><button onClick={onBackToGrid}>Kembali ke Katalog</button></div>;

  return (
    <div className="product-detail-page">
      {loadError && <p role="alert">Gagal memuat komentar: {loadError}</p>}
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
                <img src={saveIcon} alt="" className="fav-icon" />
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
                  <p>{currentUser.role === 'admin' && replyTarget ? 'Balasan admin akan dipublikasikan langsung.' : 'Komentar akan ditinjau sebelum ditampilkan kepada publik.'}</p>
                </div>
              </div>
              <span className="badge-verified">✓ {currentUser.role === 'admin' ? 'Admin' : 'Member Terverifikasi'}</span>
            </div>

            {replyTarget ? (
              <div className="reply-context">
                Membalas {replyTarget.userName}
                <button type="button" onClick={() => { setReplyTarget(null); setNewComment(''); }}>Batal</button>
              </div>
            ) : (
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
            )}

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
              <div>
                <span className="markdown-hint">
                  {currentUser.role === 'admin' && replyTarget
                    ? 'Balasan admin tampil langsung.'
                    : 'Komentar menunggu persetujuan admin.'}
                </span>
                {submissionMessage && <span role="status" className="submission-message">{submissionMessage}</span>}
              </div>
              <button type="submit" className="submit-comment-btn">{replyTarget ? 'Kirim Balasan' : 'Kirim untuk Ditinjau'}</button>
            </div>
          </form>
          )}

          <div className="comments-list">
            {comments.map((comment) => renderComment(comment))}
          </div>
        </section>
      </main>
    </div>
  );
}
