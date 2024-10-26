import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './pages/components/Loader';
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Hero from './pages/Hero';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Loader onLoadingComplete={handleLoadingComplete} />
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Router>
          <Layout />
        </Router>
      </div>
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
          edit-profile
        </Routes>
      </main>
      <Footer/>
    </>
  );
}