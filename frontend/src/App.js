import './App.css'; 
import './Components/navbar.css';
import './Components/HeroSection.css';
import { Navbar } from './Components/navbar.jsx';
import { HeroSection } from './Components/HeroSection.jsx';

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection /> 
    </div>
  );
}

export default App;