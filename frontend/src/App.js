import React, { useState } from 'react';
import './App.css';
import { Navbar } from './Components/navbar.jsx';
import { HeroSection } from './Components/HeroSection.jsx';
import { ProductCard } from './Components/productCard.jsx';
import { Pagination } from './Components/Pagination.jsx';
import { Authentication } from './pages/Authentication.jsx';
import { ProductDetail } from './pages/ProductDetail.jsx';
import { initialProducts } from './data/mockData.js';
import { KelolaProduk } from './Components/Admin/kelolaProduk.jsx'
import { AdminLayout } from './Components/Admin/AdminLayout.jsx';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
        <AdminLayout activeMenu="produk">
          <KelolaProduk />
        </AdminLayout>
      )}

      {(activePage === 'login' || activePage === 'register') && (
        <main className="auth-container">
          <Authentication
            defaultMode={activePage}
            onBackToHome={() => setActivePage('home')}
          />
        </main>
      )}
    </div>
  );
}

export default App;