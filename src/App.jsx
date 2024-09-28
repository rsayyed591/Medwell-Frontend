import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Hero from './pages/Hero';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';

function Layout() {
  const location = useLocation();

  // Update the condition to correctly hide the Navbar and Footer
  const hideNavbarFooter = location.pathname === '/Dashboard';

  return (
    <>
      {/* Show Navbar only if it's not a page where it should be hidden */}
      {/* {!hideNavbarFooter && <Navbar />} */}
      <Navbar />
      <main className={`flex-grow pt-16 ${!hideNavbarFooter ? '' : ''}`}>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/pricing" element={<Pricing />} /> 
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/about" element={<About />} />        
          <Route path="/signup" element={<SignUp />} />        
          <Route path="/login" element={<Login />} />        
        </Routes>
      </main>
      {/* Show Footer only if it's not a page where it should be hidden */}
      {/* {!hideNavbarFooter && <Footer />} */}
      <Footer/>
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