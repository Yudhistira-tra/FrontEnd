import React, { useState } from 'react';
import './App.css';
import { Navbar } from './Components/navbar.jsx';
import { HeroSection } from './Components/HeroSection.jsx';
import { ProductCard } from './Components/productCard.jsx';
import { Pagination } from './Components/Pagination.jsx';
import { Authentication } from './pages/Authentication.jsx';
import { ProductDetail } from './pages/ProductDetail.jsx';
import { Feedback } from './pages/Feedback.jsx';
import { initialProducts, initialFeedbacks } from './data/mockData.js';
import { KelolaProduk } from './Components/Admin/kelolaProduk.jsx'
import { ModerasiKomentar } from './Components/Admin/moderasiKomentar.jsx'
import { FeedbackPengguna } from './Components/Admin/feedbackPengguna.jsx'
import { AdminLayout } from './Components/Admin/AdminLayout.jsx';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeAdminMenu, setActiveAdminMenu] = useState('produk');
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);

  const productsPerPage = 6;

  const filteredProducts = initialProducts.filter((p) => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleOpenDetail = (id) => {
    setSelectedProductId(id);
    setActivePage('admin');
  };

  const handleAddFeedback = ({ userName, email, category, title, message }) => {
    const newTicket = {
      id: `f-${Date.now()}`,
      category,
      userName,
      email,
      timeAgo: 'Baru saja',
      title,
      message,
      tags: [],
      status: 'Belum Ditanggapi',
    };
    setFeedbacks((prev) => [newTicket, ...prev]);
  };

  const handleFeedbackStatusChange = (id, nextStatus) => {
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, status: nextStatus } : f)));
  };

  const handleFeedbackDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus masukan ini?')) {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="App">
      <Navbar onNavigate={(page) => setActivePage(page)} />

      {activePage === 'home' && (
        <>
          <HeroSection
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            onSearch={(query) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }}
          />
          <main className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', padding: '20px' }}>
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                image={product.image}
                category={product.category}
                price={product.price}
                rating={product.rating}
                onClickDetail={handleOpenDetail}
              />
            ))}
          </main>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}

      {activePage === 'detail' && (
        <ProductDetail
          productId={selectedProductId}
          onBackToGrid={() => setActivePage('home')}
        />
      )}

      {activePage === 'admin' && (
        <AdminLayout
          activeMenu={activeAdminMenu}
          onMenuSelect={setActiveAdminMenu}
        >
          {activeAdminMenu === 'produk' && <KelolaProduk />}
          {activeAdminMenu === 'ulasan' && <ModerasiKomentar />}
          {activeAdminMenu === 'feedback' && (
            <FeedbackPengguna
              feedbacks={feedbacks}
              onStatusChange={handleFeedbackStatusChange}
              onDelete={handleFeedbackDelete}
            />
          )}
          {activeAdminMenu !== 'produk' && activeAdminMenu !== 'ulasan' && activeAdminMenu !== 'feedback' && (
            <div className="admin-placeholder">
              <h2>Menu "{activeAdminMenu}"</h2>
              <p>Halaman ini masih dalam pengerjaan.</p>
            </div>
          )}
        </AdminLayout>
      )}

      {activePage === 'kontak' && (
        <Feedback
          onSubmit={handleAddFeedback}
          onBackToHome={() => setActivePage('home')}
        />
      )}

      {(activePage === 'login' || activePage === 'register') && (
        <main className="auth-container">
          <Authentication
            defaultMode={activePage}
            onBackToHome={() => setActivePage('home')}
          />
        </main>
      )}

      <footer className="app-footer">
        <span className="footer-brand">WartaTekno</span>
        <span className="footer-desc">Portal ulasan dan spesifikasi gadget terpercaya.</span>
        <nav className="footer-links">
          <button type="button" onClick={() => setActivePage('home')}>Beranda</button>
          <button type="button" onClick={() => setActivePage('kontak')}>Kontak</button>
          <button type="button" onClick={() => { setActivePage('admin'); setActiveAdminMenu('feedback'); }}>Kelola</button>
        </nav>
      </footer>
    </div>
  );
}

export default App;