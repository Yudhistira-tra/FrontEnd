import React, { useState } from 'react';
import './ModerasiKomentar.css';
import { Pagination } from '../Pagination';
import komentarIcon from '../../assets/komentar.png';
import moderasiIcon from '../../assets/Moderasi.png';
import reviewIcon from '../../assets/Review.png';
import filterIcon from '../../assets/Filter.png';
import { initialComments, initialProducts } from '../../data/mockData';

function SummaryCard({ title, value, label, icon }) {
  return (
    <div className="card-container">
      <span className="card-title">{title}</span>
      <div className="card-contents">
        <div className="card-left">
          <h2>{value}</h2>
          <span>{label}</span>
        </div>
        <div className="card-right">{icon}</div>
      </div>
    </div>
  );
}

function getProductTitle(productId) {
  const product = initialProducts.find((p) => p.id === productId);
  return product ? product.title : 'Produk Dihapus';
}

export function ModerasiKomentar() {
  const [comments, setComments] = useState(initialComments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const filteredComments = comments.filter((item) => {
    const matchesSearch =
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'Semua' || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredComments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstItem, indexOfLastItem);
  const startItem = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const endItem = Math.min(indexOfLastItem, totalItems);

  const handleApprove = (id) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, status: 'Disetujui' } : c))
    );
  };

  const handleSpam = (id) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, status: 'Spam' } : c))
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus ulasan ini?')) {
      setComments(comments.filter((c) => c.id !== id));
    }
  };

  const totalComments = comments.length;
  const pendingCount = comments.filter((c) => c.status === 'Menunggu').length;
  const approvedCount = comments.filter((c) => c.status === 'Disetujui').length;

  const summaryCards = [
    {
      id: 1,
      title: 'TOTAL ULASAN MASUK',
      value: totalComments.toLocaleString('id-ID'),
      label: 'Ulasan',
      icon: <img src={komentarIcon} alt="Ulasan" />,
    },
    {
      id: 2,
      title: 'MENUNGGU MODERASI',
      value: pendingCount.toLocaleString('id-ID'),
      label: 'Ulasan',
      icon: <img src={moderasiIcon} alt="Moderasi" />,
    },
    {
      id: 3,
      title: 'ULASAN TERSETUJUI',
      value: approvedCount.toLocaleString('id-ID'),
      label: 'Ulasan',
      icon: <img src={reviewIcon} alt="Tersetuju" />,
    },
  ];

  return (
    <div className="moderasi-container">
      <div className="top-part">
        <div className="text-top-part">
          <h1>Moderasi Komentar</h1>
          <p>
            Tinjau ulasan pengguna, setujui untuk ditampilkan, atau tandai sebagai spam
          </p>
        </div>
      </div>

      <div className="cards">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.id}
            title={card.title}
            value={card.value}
            label={card.label}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari pengguna atau ulasan..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="status-dropdown"
        >
          <option value="Semua">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Spam">Spam</option>
        </select>

        <button className="filter-btn">
          <img src={filterIcon} alt="Filter" style={{ width: '17px', height: '17px' }} />
          <span>Filter</span>
        </button>
      </div>

      <div className="table-container">
        <table className="comment-table">
          <thead>
            <tr>
              <th>PENGGUNA</th>
              <th>PRODUK</th>
              <th>RATING</th>
              <th>ULASAN</th>
              <th>WAKTU</th>
              <th>STATUS</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {totalItems === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>
                  Tidak ada ulasan yang ditemukan.
                </td>
              </tr>
            ) : (
              currentComments.map((c) => (
                <tr key={c.id}>
                  <td className="col-user">
                    <div className="user-info">
                      <strong>{c.userName}</strong>
                      <span className="role-text">{c.userRole}</span>
                    </div>
                  </td>

                  <td>
                    <span className="product-text">{getProductTitle(c.productId)}</span>
                  </td>

                  <td>
                    <div className="rating-box">
                      <span className="star">★</span> {c.rating || 0}
                    </div>
                  </td>

                  <td className="col-comment">
                    <p className="comment-text">{c.comment}</p>
                  </td>

                  <td>
                    <span className="time-text">{c.createdAt}</span>
                  </td>

                  <td>
                    <span className={`status-pill status-${c.status.toLowerCase()}`}>
                      • {c.status}
                    </span>
                  </td>

                  <td className="col-actions">
                    {c.status !== 'Disetujui' && (
                      <button
                        className="btn-action link-approve"
                        onClick={() => handleApprove(c.id)}
                      >
                        Setujui
                      </button>
                    )}
                    {c.status !== 'Spam' && (
                      <button
                        className="btn-action link-spam"
                        onClick={() => handleSpam(c.id)}
                      >
                        Spam
                      </button>
                    )}
                    <button
                      className="btn-action link-delete"
                      onClick={() => handleDelete(c.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="table-footer">
          <div className="pagination-info">
            Menampilkan <strong>{startItem} - {endItem}</strong> dari <strong>{totalItems}</strong> ulasan
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
