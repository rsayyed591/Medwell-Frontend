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
      {<Navbar />}
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      {<Footer />}
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
