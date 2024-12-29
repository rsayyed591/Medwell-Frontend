import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Loader from './pages/components/Loader'
import Navbar from './pages/components/Navbar'
import Footer from './pages/components/Footer'
import Dashboard from './pages/Dashboard'
import DDashboard from './pages/DoctorDashboard/Dashboard'
import { Patients } from './pages/DoctorDashboard/Patients'
import { DoctorProfile } from './pages/DoctorDashboard/DoctorProfile'
import PatientAppointments from './pages/DoctorDashboard/PatientAppointments'
import About from './pages/About'
import Pricing from './pages/Pricing'
import Hero from './pages/Hero'
import SignUp from './pages/Auth/SignUp'
import Login from './pages/Auth/Login'
import UserSelect from './pages/UserSelect'
import DoctorLogin from './pages/Auth/DoctorLogin'
import DoctorSignUp from './pages/Auth/DoctorSignup'
import HospitalLogin from './pages/Auth/HospitalLogin'
import HospitalSignUp from './pages/Auth/HospitalSignup'
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard'
import HospitalDashboard from './pages/Hospital/HospitalDashboard'
import DoctorSearch from './pages/components/DoctorSearch'

// Import Hospital Dashboard components
import HDashboard from './pages/Hospital/Dashboard'
import HospitalProfile from './pages/Hospital/Profile'
import PatientRecords from './pages/Hospital/PatientRecords'
import Doctors from './pages/Hospital/Doctors'
import HospitalAppointments from './pages/Hospital/Appointments'
import Analytics from './pages/Hospital/Analytics'
import Billing from './pages/Hospital/Billing'
import Inventory from './pages/Hospital/Inventory'

// Import Medical Dashboard components
import MedicalDashboard from './pages/Dashboard'
import PatientProfile from './pages/Patient/Profile'
import HealthCheck from './pages/Patient/HealthCheck'
import Reports from './pages/Patient/Reports'
import AddReport from './pages/Patient/AddReport'
import ExpenseTracker from './pages/Expenses/ExpenseTracker'
import PatientDashboard from './pages/Patient/PatientDashboard'
import PAppointments from './pages/Patient/Appointments'
import ShareWithDoctor from './pages/Patient/ShareWithDoctor'

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
          <Route path="/doctorsearch" element={<DoctorSearch />} />
          <Route path="/doctor" element={<DoctorDashboard />}>
            <Route index element={<DDashboard />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="patients" element={<Patients />} />
            <Route path="appointments" element={<PatientAppointments />} />
          </Route>
          <Route path="/hospital" element={<HospitalDashboard />}>
            <Route index element={<HDashboard />} />
            <Route path="profile" element={<HospitalProfile />} />
            <Route path="patient-records" element={<PatientRecords />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="appointments" element={<HospitalAppointments />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="billing" element={<Billing />} />
            <Route path="inventory" element={<Inventory />} />
          </Route>
          <Route path="/patient" element={<MedicalDashboard />}>
            <Route index element={<PatientDashboard />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="health-check" element={<HealthCheck />} />
            <Route path="reports" element={<Reports />} />
            <Route path="add-report" element={<AddReport />} />
            <Route path="expense-tracker" element={<ExpenseTracker />} />
            <Route path="appointments" element={<PAppointments />} />
            <Route path="share-with-doctor" element={<ShareWithDoctor />} />
          </Route>
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

