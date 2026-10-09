import React, { useState } from 'react';
import './App.css';
import { Navbar } from './Components/navbar.jsx';
import { HeroSection } from './Components/HeroSection.jsx';
import { ProductCard } from './Components/productCard.jsx';
import { Pagination } from './Components/Pagination.jsx';
import { Authentication } from './pages/Authentication.jsx';
import { ProductDetail } from './pages/ProductDetail.jsx';
import { Feedback } from './pages/Feedback.jsx';
import { KoleksiTersimpan } from './pages/KoleksiTersimpan.jsx';
import { About } from './pages/About.jsx';
import warningIcon from './assets/Icon-4.png';
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
  const [products, setProducts] = useState(initialProducts);
  const [currentUser, setCurrentUser] = useState(null); // null = guest, {name,email,role}
  const [savedIds, setSavedIds] = useState([]);

  const productsPerPage = 10;

  const filteredProducts = products.filter((p) => {
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
    setActivePage('detail');
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

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveAdminMenu('produk');
      setActivePage('admin');
    } else {
      setActivePage('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('home');
  };

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [{ ...newProduct, id: `p-${Date.now()}` }, ...prev]);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleToggleSave = (id) => {
    if (!currentUser) {
      setActivePage('login');
      return;
    }
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const savedProducts = products.filter((p) => savedIds.includes(p.id));

  return (
    <div className="App">
      <Navbar
        onNavigate={(page) => setActivePage(page)}
        currentUser={currentUser}
        onLogout={handleLogout}
        isAdminView={activePage === 'admin' && currentUser?.role === 'admin'}
        savedCount={savedIds.length}
      />

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
            currentUser={currentUser}
            onNavigate={(page) => setActivePage(page)}
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
                isSaved={savedIds.includes(product.id)}
                onToggleSave={handleToggleSave}
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
          products={products}
          onBackToGrid={() => setActivePage('home')}
          currentUser={currentUser}
          onRequireLogin={(mode) => setActivePage(mode === 'register' ? 'register' : 'login')}
          isSaved={savedIds.includes(selectedProductId)}
          onToggleSave={handleToggleSave}
        />
      )}

      {activePage === 'tersimpan' && (
        !currentUser ? (
          <div className="admin-placeholder">
            <h2>Masuk untuk melihat simpanan</h2>
            <p>Koleksi tersimpan hanya untuk Member dan Admin.</p>
            <button type="button" className="feedback-submit" style={{ maxWidth: 240, margin: '12px auto 0' }} onClick={() => setActivePage('login')}>
              Masuk Sekarang
            </button>
          </div>
        ) : (
          <KoleksiTersimpan
            savedProducts={savedProducts}
            currentUser={currentUser}
            onRemove={(id) => setSavedIds((prev) => prev.filter((s) => s !== id))}
            onOpenDetail={(id) => { setSelectedProductId(id); setActivePage('detail'); }}
            onBackToHome={() => setActivePage('home')}
            onBrowse={() => setActivePage('home')}
          />
        )
      )}

      {activePage === 'admin' && (
        currentUser?.role !== 'admin' ? (
          <div className="admin-placeholder">
            <img src={warningIcon} alt="" className="placeholder-icon" />
            <h2>Akses Ditolak</h2>
            <p>Halaman admin hanya untuk peran Admin. Silakan masuk sebagai admin.</p>
            <button type="button" className="feedback-submit" style={{ maxWidth: 240, margin: '12px auto 0' }} onClick={() => setActivePage('login')}>
              Masuk sebagai Admin
            </button>
          </div>
        ) : (
        <AdminLayout
          activeMenu={activeAdminMenu}
          onMenuSelect={setActiveAdminMenu}
        >
          {activeAdminMenu === 'produk' && <KelolaProduk products={products} onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct} />}
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
        )
      )}

      {activePage === 'kontak' && (
        <Feedback
          onSubmit={handleAddFeedback}
          onBackToHome={() => setActivePage('home')}
        />
      )}

      {activePage === 'tentang' && (
        <About onBackToHome={() => setActivePage('home')} />
      )}

      {(activePage === 'login' || activePage === 'register') && (
        <main className="auth-container">
          <Authentication
            defaultMode={activePage}
            onBackToHome={() => setActivePage('home')}
            onLogin={handleLogin}
          />
        </main>
      )}

      <footer className={activePage === 'admin' ? 'app-footer admin-offset' : 'app-footer'}>
        <div className="app-footer-inner">
        <span className="footer-brand">Warta<span>Tekno</span></span>
        <span className="footer-desc">Portal ulasan dan spesifikasi gadget terpercaya.</span>
        <nav className="footer-links">
          <button type="button" onClick={() => setActivePage('home')}>Beranda</button>
          <button type="button" onClick={() => setActivePage('kontak')}>Kontak</button>
          <button type="button" onClick={() => setActivePage('tentang')}>Tentang Kami</button>
          {currentUser?.role === 'admin' && (
            <button type="button" onClick={() => { setActivePage('admin'); setActiveAdminMenu('feedback'); }}>Kelola</button>
          )}
        </nav>
        </div>
      </footer>
    </div>
  );
}

export default App;