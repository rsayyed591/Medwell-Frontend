'use client'

import React, { useState, useEffect } from 'react'
import { Home, User, FileText, Users, Calendar, BarChart, CreditCard, Package, ChevronRight, ChevronUp, ChevronDown, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, Outlet } from 'react-router-dom'

export default function HospitalDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)
  const location = useLocation()
  
  const hospitalInfo = {
    id: 'H12345',
    name: 'General Hospital',
    established: '1985',
    logo: "/logo.png"
  }

  const navItems = [
    { label: "Dashboard", icon: Home, path: "/hospital" },
    { label: "Profile", icon: User, path: "/hospital/profile" },
    { label: "Patient Records", icon: FileText, path: "/hospital/patient-records" },
    { label: "Doctors", icon: Users, path: "/hospital/doctors" },
    { label: "Appointments", icon: Calendar, path: "/hospital/appointments" },
    { label: "Analytics", icon: BarChart, path: "/hospital/analytics" },
    { label: "Billing", icon: CreditCard, path: "/hospital/billing" },
    { label: "Inventory", icon: Package, path: "/hospital/inventory" },
  ]

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const ProfileSection = () => (
    <div className={`p-4 ${(!isMobile && !isSidebarOpen) ? 'hidden' : ''}`}>
      <button
        onClick={() => setIsProfileExpanded(!isProfileExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center">
          <img src={hospitalInfo.logo} alt="Hospital" className="w-12 h-12 rounded-full mr-3 border-2 border-green-500" />
          <div>
            <h2 className="text-lg font-bold text-green-800">{'MedWell Hospital'}</h2>
            <p className="text-sm text-green-600">Hospital ID: {hospitalInfo.id}</p>
          </div>
        </div>
        {isProfileExpanded ? <ChevronUp className="h-5 w-5 text-green-500" /> : <ChevronDown className="h-5 w-5 text-green-500" />}
      </button>
      <AnimatePresence>
        {isProfileExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm space-y-2 mb-4 bg-green-50 p-4 rounded-lg"
          >
            <p><strong className="text-green-700">Name:</strong> <span className="text-green-600">{hospitalInfo.name}</span></p>
            <p><strong className="text-green-700">Established:</strong> <span className="text-green-600">{hospitalInfo.established}</span></p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-green-50 to-white text-green-900 min-h-screen flex">
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -300 } : {}}
            transition={{ duration: 0.3 }}
            className={`bg-gradient-to-br shadow-lg overflow-hidden flex flex-col ${
              isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'
            }`}
            style={{ width: isMobile ? '300px' : isSidebarOpen ? '300px' : '64px' }}
          >
            {(!isMobile && !isSidebarOpen) && (
              <button
                className="w-full flex justify-center items-center py-4 hover:bg-green-600 transition-colors duration-200"
                onClick={toggleSidebar}
              >
                <ChevronRight className="h-6 w-6 text-green-400" />
              </button>
            )}
            <div className="flex justify-between items-center p-4 bg-green-200">
              {isSidebarOpen ? (
                <Link to="/" className="text-2xl font-bold text-green-500">MedWell</Link>
              ) : (
                <img src="/logo.png" alt="MedWell" className="w-10 h-8" />
              )}
              {(isMobile || isSidebarOpen) && (
                <button
                  className="p-2 rounded-full hover:bg-green-600 transition-colors duration-200"
                  onClick={toggleSidebar}
                >
                  <X className="h-6 w-6 text-green-500" />
                </button>
              )}
            </div>
            <ProfileSection />
            <nav className={`${(!isMobile && !isSidebarOpen) ? 'px-2 mt-4' : 'px-4'} flex-grow overflow-y-auto`}>
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`w-full text-left py-2 px-4 rounded-lg mb-2 flex items-center ${
                    location.pathname === item.path
                      ? 'bg-green-700 text-white'
                      : 'hover:bg-green-800 text-green-500'
                  } ${(!isMobile && !isSidebarOpen) ? 'justify-center' : ''}`}
                  onClick={() => {
                    if (isMobile) setIsSidebarOpen(false)
                  }}
                >
                  <item.icon className={`${(!isMobile && !isSidebarOpen) ? '' : 'mr-2'} h-5 w-5`} />
                  {(isMobile || isSidebarOpen) && item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 p-8 md:p-3 overflow-auto">
        {isMobile && (
          <div className="flex justify-between mb-4">
            <h1 className="text-3xl font-bold text-green-800">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
            <button
              className="p-2 rounded-lg border border-green-300 hover:bg-green-100 transition-colors duration-200"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6 text-green-500" />
            </button>
          </div>
        )}
        <Outlet />
      </div>

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}

