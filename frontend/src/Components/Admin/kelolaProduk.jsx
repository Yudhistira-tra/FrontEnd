import React, { useState } from 'react';
import './KelolaProduk.css';
import { Pagination } from '../Pagination';
import { ProductModal } from './ProductModal';
import plusIcon from '../../assets/Icon.png';
import produkIcon from '../../assets/produk.png';
import reviewIcon from '../../assets/Review.png';
import moderasiIcon from '../../assets/Moderasi.png';
import filterIcon from '../../assets/Filter.png';


function SummaryCard({ title, value, label, icon, sub, subClass }) {
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
      {sub && <span className={`card-sub ${subClass || ''}`}>{sub}</span>}
    </div>
  );
}

export function KelolaProduk({ products: productsProp, categories = [], stats = {}, onAddProduct, onUpdateProduct, onDeleteProduct, onOpenDetail }) {

  const product = productsProp || [];
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [appliedFilters, setAppliedFilters] = useState({ search: '', category: 'Semua', status: 'Semua' });

  const filteredProducts = product.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(appliedFilters.search.toLowerCase()));

    const matchesCategory =
      appliedFilters.category === 'Semua' || item.category === appliedFilters.category;

    const matchesStatus =
      appliedFilters.status === 'Semua' || item.status === appliedFilters.status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleFilterApply = () => {
    setAppliedFilters({
      search: searchQuery,
      category: selectedCategory,
      status: selectedStatus,
    });
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const startItem = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const endItem = Math.min(indexOfLastItem, totalItems);

  const handleDelete = (id) => { if (window.confirm('Yakin ingin menghapus produk ini?')) onDeleteProduct && onDeleteProduct(id); };

  const handleSaveProduct = async (newProduct) => { try { if (editingProduct) await onUpdateProduct(newProduct); else if (onAddProduct) await onAddProduct(newProduct); setShowModal(false); setEditingProduct(null); setCurrentPage(1); } catch (err) { alert(err.message); } };

  const handleActivate = async (item) => { try { await onUpdateProduct({ ...item, status: 'Aktif' }); } catch (err) { alert(err.message); } };

  const totalProducts = Number(stats.total_products ?? product.length);

  const totalReviews = Number(stats.total_comments ?? product.reduce(
    (acc, prod) => acc + (prod.reviewsCount || 0),
    0
  ));
  const approvedCommentPercentage = Number(stats.approved_comment_percentage ?? 0);
  const productsThisMonth = Number(stats.products_this_month ?? 0);

  const pendingModeration = Number(stats.draft_products ?? product.filter(
    (prod) => prod.status && prod.status.toLowerCase() === 'draf'
  ).length);

  const summaryCards = [
    {
      id: 1,
      title: 'TOTAL PRODUK TERDAFTAR',
      value: totalProducts.toLocaleString('id-ID'),
      label: 'Produk',
      icon: <img src={produkIcon} alt="Produk" />,
      sub: `↗ +${productsThisMonth} bulan ini`,
      subClass: 'sub-green',
    },
    {
      id: 2,
      title: 'TOTAL ULASAN PENGGUNA',
      value: totalReviews.toLocaleString('id-ID'),
      label: 'Ulasan',
      icon: <img src={reviewIcon} alt="Review" />,
      sub: `● ${approvedCommentPercentage}% Disetujui`,
      subClass: 'sub-blue',
    },
    {
      id: 3,
      title: 'MENUNGGU MODERASI',
      value: pendingModeration.toLocaleString('id-ID'),
      label: 'Produk',
      icon: <img src={moderasiIcon} alt="Moderasi" />,
      sub: 'Perlu verifikasi spesifikasi',
      subClass: 'sub-orange',
    },
  ];

  return (
    <div className="kelola-produk-container">
      <div className="top-part">
        <div className="text-top-part">
          <div className="breadcrumb">ADMIN PANEL <span>›</span> <span className="crumb-active">KATALOG PRODUK</span></div>
          <h1>Kelola Produk Elektronik</h1>
          <p>
            Kelola katalog produk, spesifikasi teknis, harga pasar, dan status
            publikasi ulasan
          </p>
        </div>
        <button className="add-btn" onClick={() => { setEditingProduct(null); setShowModal(true); }}>
          <img src={plusIcon} alt="Plus" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {showModal && (
        <ProductModal onClose={() => { setShowModal(false); setEditingProduct(null); }} onSave={handleSaveProduct} initialProduct={editingProduct} categories={categories} />
      )}

      <div className="cards">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.id}
            title={card.title}
            value={card.value}
            label={card.label}
            icon={card.icon}
            sub={card.sub}
            subClass={card.subClass}
          />
        ))}
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Cari Produk..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => { if (e.key === 'Enter') handleFilterApply(); }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="filter-dropdown"
        >
          <option value="Semua">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category.id || category.slug} value={category.name}>{category.name}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="status-dropdown"
        >
          <option value="Semua">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Draf">Draf</option>
        </select>

        <button className='filter-btn' onClick={handleFilterApply}>
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
            {totalItems === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                  Tidak ada produk yang ditemukan.
                </td>
              </tr>
            ) : (
              currentProducts.map((p) => (
                <tr key={p.id}>
                  <td className="col-product">
                    <div className="cell-inner">
                      <img src={p.image} alt={p.title} className="thumb-img" />
                      <div className="product-info">
                        <strong>{p.title}</strong>
                        <span className="sku-text">SKU: {p.sku || 'N/A'}</span>
                      </div>
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
                      {p.reviewsCount > 0 && p.rating != null
                        ? <><span className="star">★</span> {Number(p.rating).toFixed(1)}</>
                        : <span>Belum ada rating</span>}
                      <span className="review-count">
                        ({p.reviewsCount || 0} ulasan)
                      </span>
                    </div>
                  </td>

                  <td className="col-status">
                    <div className="cell-inner">
                      <span
                        className={`status-pill ${
                          p.status === 'Draf' ? 'status-draf' : 'status-aktif'
                        }`}
                      >
                        • {p.status || 'Aktif'}
                      </span>
                      {p.status === 'Draf' && (
                        <button
                          className="btn-action link-activate"
                          onClick={() => handleActivate(p)}
                        >
                          Aktifkan
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="col-actions">
                    <div className="cell-inner">
                      <button
                        className="btn-action link-detail"
                        onClick={() => onOpenDetail && onOpenDetail(p.id)}
                      >
                        Detail
                      </button>
                      <button
                        className="btn-action link-edit"
                        onClick={() => { setEditingProduct(p); setShowModal(true); }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-action link-delete"
                        onClick={() => handleDelete(p.databaseId)}
                      >
                        Hapus
                      </button>
                    </div>
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