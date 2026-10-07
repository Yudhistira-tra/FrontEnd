import React, { useState } from 'react';
import './KelolaProduk.css';
import { Pagination } from '../Pagination';
import plusIcon from '../../assets/Icon.png';
import produkIcon from '../../assets/produk.png';
import reviewIcon from '../../assets/Review.png';
import moderasiIcon from '../../assets/Moderasi.png';
import filterIcon from '../../assets/Filter.png';
import { initialProducts } from '../../data/mockData';

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

export function KelolaProduk() {

const [product, setProduct] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const filteredProducts = product.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'Semua' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const startItem = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const endItem = Math.min(indexOfLastItem, totalItems);

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      setProduct(product.filter((p) => p.id !== id));
    }
  };

  const totalProducts = product.length;

  const totalReviews = product.reduce(
    (acc, prod) => acc + (prod.reviewsCount || 0),
    0
  );

  const pendingModeration = product.filter(
    (prod) => prod.status && prod.status.toLowerCase() === 'draf'
  ).length;

  const summaryCards = [
    {
      id: 1,
      title: 'TOTAL PRODUK TERDAFTAR',
      value: totalProducts.toLocaleString('id-ID'),
      label: 'Produk',
      icon: <img src={produkIcon} alt="Produk" />,
    },
    {
      id: 2,
      title: 'TOTAL ULASAN PENGGUNA',
      value: totalReviews.toLocaleString('id-ID'),
      label: 'Ulasan',
      icon: <img src={reviewIcon} alt="Review" />,
    },
    {
      id: 3,
      title: 'MENUNGGU MODERASI',
      value: pendingModeration.toLocaleString('id-ID'),
      label: 'Produk',
      icon: <img src={moderasiIcon} alt="Moderasi" />,
    },
  ];

  return (
    <div className="kelola-produk-container">
      <div className="top-part">
        <div className="text-top-part">
          <h1>Kelola Produk</h1>
          <p>
            Kelola katalog produk, spesifikasi teknis, harga pasar, dan status
            publikasi ulasan
          </p>
        </div>
        <button className="add-btn">
          <img src={plusIcon} alt="Plus" />
          <span>Tambah Produk Baru</span>
        </button>
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
            placeholder="Cari Produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-dropdown"
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Smartphone">Smartphone</option>
          <option value="Laptop">Laptop</option>
          <option value="Aksesoris">Aksesoris</option>
          <option value="Audio">Audio</option>
          <option value="Smartwatch">Smartwatch</option>
          <option value="Tablet">Tablet</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="status-dropdown"
        >
          <option value="Semua">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Draf">Draf</option>
        </select>

        <button className='filter-btn'>
            <img src={filterIcon} alt="Plus" style={{ width: '17px', height: '17px' }}/>
            <span>Filter</span>
        </button>

      </div>

      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>PRODUK</th>
              <th>KATEGORI</th>
              <th>HARGA REFERENSI</th>
              <th>RATING & ULASAN</th>
              <th>STATUS</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {totalItems.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                  Tidak ada produk yang ditemukan.
                </td>
              </tr>
            ) : (
              currentProducts.map((p) => (
                <tr key={p.id}>
                  <td className="col-product">
                    <img src={p.image} alt={p.title} className="thumb-img" />
                    <div className="product-info">
                      <strong>{p.title}</strong>
                      <span className="sku-text">SKU: {p.sku || 'N/A'}</span>
                    </div>
                  </td>

                  <td>
                    <span className="category-text">{p.category}</span>
                  </td>

                  <td>
                    <strong>
                      Rp {(p.price || p.startingPrice || 0).toLocaleString('id-ID')}
                    </strong>
                  </td>

                  <td>
                    <div className="rating-box">
                      <span className="star">★</span> {p.rating || 5.0}
                      <span className="review-count">
                        ({p.reviewsCount || 0} ulasan)
                      </span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`status-pill ${
                        p.status === 'Draf' ? 'status-draf' : 'status-aktif'
                      }`}
                    >
                      • {p.status || 'Aktif'}
                    </span>
                  </td>

                  <td className="col-actions">
                    <button
                      className="btn-action link-detail"
                      onClick={() => console.log('Detail', p.id)}
                    >
                      Detail
                    </button>
                    <button
                      className="btn-action link-edit"
                      onClick={() => console.log('Edit', p.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-action link-delete"
                      onClick={() => handleDelete(p.id)}
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
            Menampilkan <strong>{startItem} - {endItem}</strong> dari <strong>{totalItems}</strong> produk
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