import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import Loader from './pages/components/Loader';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Hero from './pages/Hero';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate some initialization process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading ? (
        <Loader />
      ) : (
        <Router>
          <Layout />
        </Router>
      )}
    </div>
  );
}

function Layout() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/pricing" element={<Pricing />} /> 
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/about" element={<About />} />        
          <Route path="/signup" element={<SignUp />} />        
          <Route path="/login" element={<Login />} />        
        </Routes>
      </main>
      <Footer/>
    </>
  );
}