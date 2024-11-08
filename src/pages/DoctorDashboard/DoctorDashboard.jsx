import React, { useState, useEffect } from 'react'
import { Home, User, Users, Calendar, ChevronRight, ChevronUp, ChevronDown, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Patients } from './Patients'
import { DoctorProfile } from './DoctorProfile'
import Dashboard from './Dashboard'
import { PatientAppointments } from './PatientAppointments'

export default function DoctorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('Dashboard')
  const [isMobile, setIsMobile] = useState(false)
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)
  
  const doctorInfo = {
    name: 'Dr. Vivek Ammonia',
    id: 'D12345',
    specialization: 'Cardiologist',
    experience: '15 years',
    profile_pic: "/Vivek.jpg"
  }

  const navItems = [
    { label: "Dashboard", icon: Home, component: Dashboard },
    { label: "Profile", icon: User, component: DoctorProfile },
    { label: "Patients", icon: Users, component: Patients },
    { label: "Appointments", icon: Calendar, component: PatientAppointments },
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
          <img src={doctorInfo.profile_pic} alt="Doctor" className="w-12 h-12 rounded-full mr-3 border-2 border-blue-500" />
          <div>
            <h2 className="text-lg font-bold text-blue-800">{doctorInfo.name}</h2>
            <p className="text-sm text-blue-600">Doctor ID: {doctorInfo.id}</p>
          </div>
        </div>
        {isProfileExpanded ? <ChevronUp className="h-5 w-5 text-blue-500" /> : <ChevronDown className="h-5 w-5 text-blue-500" />}
      </button>
      <AnimatePresence>
        {isProfileExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm space-y-2 mb-4 bg-blue-50 p-4 rounded-lg"
          >
            <p><strong className="text-blue-700">Specialization:</strong> <span className="text-blue-600">{doctorInfo.specialization}</span></p>
            <p><strong className="text-blue-700">Experience:</strong> <span className="text-blue-600">{doctorInfo.experience}</span></p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const renderActiveComponent = () => {
    const activeItem = navItems.find(item => item.label === activeSection)
    if (activeItem && activeItem.component) {
      const Component = activeItem.component
      return <Component />
    }
    return <div className="text-2xl text-blue-800">Select a section from the sidebar</div>
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white text-blue-900 min-h-screen flex">
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -300 } : {}}
            transition={{ duration: 0.3 }}
            className={`bg-white shadow-lg overflow-hidden flex flex-col ${
              isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'
            }`}
            style={{ width: isMobile ? '300px' : isSidebarOpen ? '300px' : '64px' }}
          >
            {(!isMobile && !isSidebarOpen) && (
              <button
                className="w-full flex justify-center items-center py-4 hover:bg-blue-50 transition-colors duration-200"
                onClick={toggleSidebar}
              >
                <ChevronRight className="h-6 w-6 text-blue-500" />
              </button>
            )}
            <div className="flex justify-between items-center p-4 bg-blue-100">
              {isSidebarOpen ? (
                <Link to="/" className="text-2xl font-bold text-blue-800">MedWell</Link>
              ) : (
                <img src="/logo.png" alt="MedWell" className="w-10 h-8" />
              )}
              {(isMobile || isSidebarOpen) && (
                <button
                  className="p-2 rounded-full hover:bg-blue-200 transition-colors duration-200"
                  onClick={toggleSidebar}
                >
                  <X className="h-6 w-6 text-blue-500" />
                </button>
              )}
            </div>
            <ProfileSection />
            <nav className={`${(!isMobile && !isSidebarOpen) ? 'px-2 mt-4' : 'px-4'}`}>
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full text-left py-2 px-4 rounded-lg mb-2 flex items-center ${
                    activeSection === item.label
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-blue-50 text-blue-700'
                  } ${(!isMobile && !isSidebarOpen) ? 'justify-center' : ''}`}
                  onClick={() => {
                    setActiveSection(item.label)
                    if (isMobile) setIsSidebarOpen(false)
                  }}
                >
                  <item.icon className={`${(!isMobile && !isSidebarOpen) ? '' : 'mr-2'} h-5 w-5`} />
                  {(isMobile || isSidebarOpen) && item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 p-8 md:p-3">
        {isMobile && (
          <div className="flex justify-between mb-4">
          <h1 className="text-3xl font-bold text-blue-800">{activeSection}</h1>
            <button
              className="p-2 rounded-lg border border-blue-300 hover:bg-blue-100 transition-colors duration-200"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6 text-blue-500" />
            </button>
          </div>
        )}
        {renderActiveComponent()}
      </div>

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}