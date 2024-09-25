import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Hero from './pages/Hero';

function Layout() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/pricing' && <Navbar />}
      <main className={`flex-grow ${location.pathname !== '/pricing' ? 'pt-16' : ''}`}>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/pricing" element={<Pricing />} /> {/* Correctly defined the route */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Fixed case sensitivity */}
          <Route path="/about" element={<About />} />        
        </Routes>
      </main>
      {location.pathname !== '/pricing' && <Footer />} {/* Fixed Footer position */}
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <Layout />
      </Router>
    </div>
  );
}

export default App;
