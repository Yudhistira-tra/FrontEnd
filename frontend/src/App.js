import './App.css'; 
import react, { useState } from 'react';
import mockupImage from './assets/Eliteng.png';
import mockupImage2 from './assets/Dumbbg.png';

import './Components/navbar.css';
import './Components/HeroSection.css';
import './Components/productCard.css';

import { Navbar } from './Components/navbar.jsx';
import { HeroSection } from './Components/HeroSection.jsx'; 
import { ProductCard } from './Components/productCard.jsx';
import { Pagination } from './Components/Pagination.jsx';
import { Authentication } from './pages/Authentication.jsx';

const mockProducts = [
 { id: 1, title: 'Elite Eter', image: mockupImage, category: 'Sona', price: 500000, rating: 4.8 },
  { id: 2, title: 'Elite Eter', image: mockupImage, category: 'Sona', price: 500000, rating: 4.8 },
  { id: 3, title: 'Dumbbg', image: mockupImage2, category: 'Sona', price: 1500000, rating: 4.5 },
  { id: 4, title: 'Elite Eter', image: mockupImage, category: 'Sona', price: 500000, rating: 4.8 },
  { id: 5, title: 'Dumbbg', image: mockupImage2, category: 'Sona', price: 1500000, rating: 4.5 },
  { id: 6, title: 'Elite Eter', image: mockupImage, category: 'Sona', price: 500000, rating: 4.8 },
  { id: 7, title: 'Dumbbg', image: mockupImage2, category: 'Sona', price: 1500000, rating: 4.5 }
];


function App() {

  const [activePage, setActivePage] = useState('home');
  const [currentPage, setCurrentPage] = useState(1);
  

  const productsPerPage = 6;
  const totalPages = Math.ceil(mockProducts.length / productsPerPage) || 1;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = mockProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="App">
      <Navbar onNavigate={(page) => setActivePage(page)}/>
      {activePage === 'home' && (
        <>
      <HeroSection />
      <main className="product-grid"> {currentProducts.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          image={product.image}
          category={product.category}
          price={product.price}
          rating={product.rating}
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

      {(activePage === 'login' || activePage === 'register') && (
        <main className="auth-container">
          <Authentication
          defaultMode = {activePage}
          onBackToHome={() => setActivePage('home')}
          />
        </main>
      )}
    </div>
  );
}

export default App;