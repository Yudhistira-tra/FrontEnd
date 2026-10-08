import React, { useState } from 'react';
import './FeedbackPengguna.css';
import { Pagination } from '../Pagination';
import { feedbackCategories, feedbackStatuses } from '../../data/mockData';

function SummaryCard({ title, value, label, icon, accent, sub, subClass }) {
  return (
    <div className="card-container">
      <div className="card-top">
        <span className="card-title">{title}</span>
        <span className="card-icon">{icon}</span>
      </div>
      <div className="card-value">
        <h2 className={accent}>{value}</h2>
        <span>{label}</span>
      </div>
      {sub && <span className={`card-sub ${subClass || ''}`}>{sub}</span>}
    </div>
  );
}

function categoryBadgeClass(category) {
  if (category.includes('Bug')) return 'badge-red';
  if (category.includes('Saran')) return 'badge-purple';
  return 'badge-blue';
}

function statusPillClass(status) {
  if (status === 'Belum Ditanggapi') return 'status-belum';
  if (status === 'Sedang Ditinjau Tim Teknis') return 'status-tinjau';
  if (status === 'Diimplementasikan' || status === 'Selesai') return 'status-selesai';
  return 'status-belum';
}

export function FeedbackPengguna({ feedbacks, onStatusChange, onDelete }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filtered = feedbacks.filter((f) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      f.title.toLowerCase().includes(q) ||
      f.message.toLowerCase().includes(q) ||
      f.userName.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'Semua' || f.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Semua' || f.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const indexOfLast = safePage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const startItem = totalItems === 0 ? 0 : indexOfFirst + 1;
  const endItem = Math.min(indexOfLast, totalItems);

  const totalMasuk = feedbacks.length;
  const perluTindak = feedbacks.filter((f) => f.status === 'Belum Ditanggapi' || f.status === 'Sedang Ditinjau Tim Teknis').length;
  const selesai = feedbacks.filter((f) => f.status === 'Diimplementasikan' || f.status === 'Selesai').length;
  const selesaiPct = totalMasuk === 0 ? '0%' : `${Math.round((selesai / totalMasuk) * 1000) / 10}%`;

  const cycleStatus = (f) => {
    const idx = feedbackStatuses.indexOf(f.status);
    const next = feedbackStatuses[(idx + 1) % feedbackStatuses.length];
    if (onStatusChange) onStatusChange(f.id, next);
  };

  const markDone = (f) => {
    if (onStatusChange) onStatusChange(f.id, 'Selesai');
  };

  return (
    <div className="feedback-admin">
      <div className="fb-admin-head">
        <div>
          <div className="breadcrumb">ADMIN PANEL <span>›</span> <span className="crumb-active">FEEDBACK PENGGUNA</span></div>
          <h1>Kritik, Saran &amp; Feedback Pengguna</h1>
          <p>Kelola masukan pengguna, laporan bug teknis, permintaan peninjauan produk baru, dan saran perbaikan fitur secara terpusat.</p>
        </div>
        <button type="button" className="export-btn" onClick={() => alert('Ekspor CSV/Excel belum diimplementasikan (mock).')}>
          ⬇ Ekspor Laporan (CSV/Excel)
        </button>
      </div>

      <div className="cards">
        <SummaryCard
          title="TOTAL MASUKAN MASUK"
          value={totalMasuk}
          label="Masukan"
          icon="💬"
          sub="↗ +12 bulan ini"
          subClass="sub-green"
        />
        <SummaryCard
          title="PERLU DITINDAKLANJUTI"
          value={perluTindak}
          label="Tiket"
          icon="📥"
          accent="text-red"
          sub="◷ Target respon di bawah 24 jam"
          subClass="sub-red"
        />
        <SummaryCard
          title="SELESAI / IMPLEMENTASI"
          value={selesai}
          label="Tiket"
          icon="✓"
          sub={`● ${selesaiPct} Terselesaikan`}
          subClass="sub-blue"
        />
      </div>

      <div className="fb-filter-bar">
        <div className="fb-pills">
          <button
            type="button"
            className={`pill ${selectedCategory === 'Semua' ? 'active' : ''}`}
            onClick={() => { setSelectedCategory('Semua'); setCurrentPage(1); }}
          >
            Semua Kategori ({totalMasuk})
          </button>
          {feedbackCategories.map((cat) => {
            const count = feedbacks.filter((f) => f.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                className={`pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
        <div className="fb-filter-right">
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Cari pesan atau tiket..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="status-dropdown"
          >
            <option value="Semua">Semua Status</option>
            {feedbackStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="fb-list">
        {totalItems === 0 ? (
          <div className="fb-empty">Tidak ada masukan yang ditemukan.</div>
        ) : (
          current.map((f) => (
            <article key={f.id} className="fb-card">
              <div className="fb-card-top">
                <div className="fb-meta">
                  <span className={`fb-cat ${categoryBadgeClass(f.category)}`}>
                    {f.category.toUpperCase()}
                  </span>
                  <span className="dot">•</span>
                  <strong>{f.userName}</strong>
                  <span className="fb-email">({f.email})</span>
                  <span className="dot">•</span>
                  <span className="fb-time">◷ {f.timeAgo}</span>
                </div>
                <span className={`fb-status ${statusPillClass(f.status)}`}>● {f.status}</span>
              </div>

              <h3 className="fb-title">“{f.title}”</h3>
              <p className="fb-message">{f.message}</p>

              <div className="fb-card-bottom">
                <div className="fb-tags">
                  {f.tags && f.tags.map((t, i) => (
                    <span key={i} className="fb-tag">{t}</span>
                  ))}
                </div>
                <div className="fb-actions">
                  <button type="button" className="btn-light" onClick={() => cycleStatus(f)}>
                    Ubah Status
                  </button>
                  {f.status !== 'Selesai' && f.status !== 'Diimplementasikan' ? (
                    <button type="button" className="btn-primary" onClick={() => markDone(f)}>
                      ✓ Tandai Selesai
                    </button>
                  ) : (
                    <button type="button" className="btn-light" onClick={() => alert(`${f.userName} <${f.email}>\n\n${f.title}\n\n${f.message}`)}>
                      👁 Detail Masukan
                    </button>
                  )}
                  <button type="button" className="btn-danger-link" onClick={() => onDelete && onDelete(f.id)}>
                    Hapus
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="table-footer">
        <div className="pagination-info">
          Menampilkan <strong>{startItem} - {endItem}</strong> dari <strong>{totalItems}</strong> total masukan pengguna
        </div>
        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
