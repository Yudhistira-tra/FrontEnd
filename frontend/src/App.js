import './App.css'; 
import mockupImage from './assets/Eliteng.png';
import mockupImage2 from './assets/Dumbbg.png';
import './Components/navbar.css';
import './Components/HeroSection.css';
import './Components/productCard.css';
import { Navbar } from './Components/navbar.jsx';
import { HeroSection } from './Components/HeroSection.jsx'; 
import { ProductCard } from './Components/productCard.jsx';

const mockProducts = [
  {
    id: 1,
    title: 'Elite Eter',
    image: mockupImage,
    category: 'Sona',
    price: 500000,
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Dumbbg',
    image: mockupImage2,
    category: 'Sona',
    price: 1500000,
    rating: 4.5,
  }
]


function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />

      <main className="product-grid"> {mockProducts.map((product) => (
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
    </div>
  );
}

export default App;