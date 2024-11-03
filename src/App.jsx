import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Loader from './pages/components/Loader'
import Navbar from './pages/components/Navbar'
import Footer from './pages/components/Footer'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Pricing from './pages/Pricing'
import Hero from './pages/Hero'
import  SignUp  from './pages/Auth/SignUp'
import  Login  from './pages/Auth/Login'
import UserSelect from './pages/UserSelect'
import  DoctorLogin  from './pages/Auth/DoctorLogin'
import  DoctorSignUp  from './pages/Auth/DoctorSignup'
import HospitalLogin from './pages/Auth/HospitalLogin'
import  HospitalSignUp  from './pages/Auth/HospitalSignup'

function LoaderWrapper() {
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/') {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [location])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (!isLoading) {
    return null
  }

  return <Loader onLoadingComplete={handleLoadingComplete} />
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Router>
        <LoaderWrapper />
        <Layout />
      </Router>
    </div>
  )
}

function Layout() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/auth" element={<UserSelect />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/signup" element={<DoctorSignUp />} />
          <Route path="/hospital/login" element={<HospitalLogin />} />
          <Route path="/hospital/signup" element={<HospitalSignUp />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}