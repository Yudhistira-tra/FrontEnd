import React, { useState, useEffect } from 'react';
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
import { getProducts, getMe, getSaved, saveProduct, unsaveProduct, logout, postFeedback, getToken, createProduct, updateProduct, deleteProduct, getAdminFeedbacks, updateFeedbackStatus, removeFeedback, getAdminProducts, getCategories } from './services/api';
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
  const [feedbacks, setFeedbacks] = useState([]);
  const [products, setProducts] = useState([]);
  const [dataError, setDataError] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // null = guest, {name,email,role}
  const [savedIds, setSavedIds] = useState([]);
  const [savedProductItems, setSavedProductItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (activePage === 'admin' && activeAdminMenu === 'produk' && currentUser?.role === 'admin') getAdminProducts().then(setProducts).catch(err => setDataError(err.message));
    if (activePage === 'admin' && activeAdminMenu === 'feedback' && currentUser?.role === 'admin') getAdminFeedbacks().then(r => setFeedbacks(r.feedbacks)).catch(err => setDataError(err.message));
  }, [activePage, activeAdminMenu, currentUser]);

  useEffect(() => {
    getProducts({ per_page: 50 }).then(setProducts).catch(err => setDataError(err.message)).finally(() => setLoadingProducts(false));
    getCategories().then(setCategories).catch(err => console.warn('Gagal memuat kategori:', err.message));
    if (getToken()) getMe().then(async user => { setCurrentUser(user); if (user.role === 'admin') { setActivePage('admin'); setActiveAdminMenu('produk'); } const saved = await getSaved(); setSavedProductItems(saved); setSavedIds(saved.map(p => p.id)); }).catch(() => { localStorage.removeItem('wartatekno_token'); });
  }, []);

  const productsPerPage = 10;

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleAddFeedback = async (data) => { await postFeedback(data); };

  const handleFeedbackStatusChange = (id, nextStatus) => updateFeedbackStatus(id, nextStatus).then(() => getAdminFeedbacks().then(r => setFeedbacks(r.feedbacks))).catch(err => alert(err.message));

  const handleFeedbackDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus masukan ini?')) {
      removeFeedback(id).then(() => setFeedbacks(prev => prev.filter(f => String(f.id) !== String(id)))).catch(err => alert(err.message));
    }
  };

  const handleLogin = async (user) => {
    setCurrentUser(user);
    try { const saved = await getSaved(); setSavedProductItems(saved); setSavedIds(saved.map(p => p.id)); } catch (err) { console.warn(err); }
    if (user.role === 'admin') {
      setActiveAdminMenu('produk');
      setActivePage('admin');
    } else {
      setActivePage('home');
    }
  };

  const handleLogout = async () => { try { await logout(); } catch (_) {} setCurrentUser(null); setSavedIds([]); setSavedProductItems([]); setActivePage('home'); };

  const handleAddProduct = async (newProduct) => { const saved = await createProduct(newProduct); setProducts(prev => [saved, ...prev]); };

  const handleUpdateProduct = async (product) => { const updated = await updateProduct(product); setProducts(prev => prev.map(p => p.databaseId === updated.databaseId ? updated : p)); };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      deleteProduct(id).then(() => setProducts((prev) => prev.filter((p) => String(p.databaseId) !== String(id)))).catch(err => alert(err.message));
    }
  };

  const handleToggleSave = (id) => {
    if (!currentUser) {
      setActivePage('login');
      return;
    }
    const product = products.find(p => p.id === id);
    if (!product) return;
    const already = savedIds.includes(id);
    (already ? unsaveProduct(product.databaseId) : saveProduct(product.databaseId))
      .then(async () => { const saved = await getSaved(); setSavedProductItems(saved); setSavedIds(saved.map(p => p.id)); })
      .catch(err => alert(err.message));
  };

  const savedProducts = savedProductItems;

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
            categories={categories}
          />
          {dataError && <p role="alert" style={{padding:'16px', color:'#b91c1c'}}>Gagal memuat katalog: {dataError}</p>}
          {loadingProducts && <p style={{padding:'16px'}}>Memuat produk dari database...</p>}
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
            onRemove={async (id) => { const p = savedProductItems.find(x => x.id === id); if (p) { try { await unsaveProduct(p.databaseId); const saved = await getSaved(); setSavedProductItems(saved); setSavedIds(saved.map(x => x.id)); } catch (err) { alert(err.message); } } }}
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
          {activeAdminMenu === 'produk' && (
            <KelolaProduk
              products={products}
              categories={categories}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onOpenDetail={handleOpenDetail}
            />
          )}
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
          <button type="button" onClick={() => setActivePage('kontak')}>Beri Masukan</button>
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