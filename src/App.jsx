import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Loader from './pages/components/Loader'
import Navbar from './pages/components/Navbar'
import Footer from './pages/components/Footer'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Pricing from './pages/Pricing'
import Hero from './pages/Hero'
import { SignUp } from './pages/Auth/SignUp'
import { Login } from './pages/Auth/Login'
import UserSelect from './pages/UserSelect'
import { DoctorLogin } from './pages/Auth/DoctorLogin'
import { DoctorSignUp } from './pages/Auth/DoctorSignup'
import { HospitalLogin } from './pages/Auth/HospitalLogin'
import { HospitalSignUp } from './pages/Auth/HospitalSignup'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Loader onLoadingComplete={handleLoadingComplete} />
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Router>
          <Layout />
        </Router>
      </div>
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