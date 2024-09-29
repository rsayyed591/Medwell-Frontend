import React, { useEffect, useState } from 'react'
import Patient from './../../public/patient.png'
import { User, Heart, FileText, PlusCircle, DollarSign, Calendar, Share2, ChevronRight, ChevronUp, ChevronDown, Menu, X, Activity, Droplet, Thermometer, Brain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Profile from './Patient/Profile'
import HealthCheck from './Patient/HealthCheck'
import Reports from './Patient/Reports'
import AddReport from './Patient/AddReport'
import ExpenseTracker from './Patient/ExpenseTracker'
import Appointments from './Patient/Appointments'
import ShareWithDoctor from './Patient/ShareWithDoctor'

const defaultChartData = {
  heartRate: [68, 72, 70, 75, 69, 71, 73, 76, 74, 72],
  bloodPressure: [120, 118, 122, 119, 121, 123, 120, 118, 117, 119],
  bloodSugar: [95, 100, 98, 102, 97, 99, 101, 96, 98, 100],
  cholesterol: [180, 185, 178, 182, 179, 183, 181, 184, 180, 182],
  bmi: [24.5, 24.3, 24.6, 24.4, 24.5, 24.7, 24.6, 24.5, 24.4, 24.6],
  mentalHealth: [7, 8, 7, 9, 8, 7, 8, 9, 8, 7]
}

export default function MedicalDashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('Health Check')
  const [isMobile, setIsMobile] = useState(false)
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [patientInfo, setPatientInfo] = useState({
    name: "Vivek Chouhan",
    id: "12345",
    age: "45",
    doctor: "Dr. Rohit Deshmukh",
    nextAppointment: "15 Oct 2024",
    bloodType: "O+",
    allergies: "None",
  })

  const charts = [
    { label: "Heart Rate", color: "#ff6b6b", icon: Heart, data: defaultChartData.heartRate },
    { label: "Blood Pressure", color: "#4ecdc4", icon: Activity, data: defaultChartData.bloodPressure },
    { label: "Blood Sugar", color: "#45aaf2", icon: Droplet, data: defaultChartData.bloodSugar },
    { label: "Cholesterol", color: "#fed330", icon: Thermometer, data: defaultChartData.cholesterol },
    { label: "BMI", color: "#26de81", icon: User, data: defaultChartData.bmi },
    { label: "Mental Health", color: "#a55eea", icon: Brain, data: defaultChartData.mentalHealth }
  ]

  const navItems = [
    { label: "Profile", icon: User },
    { label: "Health Check", icon: Heart },
    { label: "Reports", icon: FileText },
    { label: "Add Report", icon: PlusCircle },
    { label: "Expense Tracker", icon: DollarSign },
    { label: "Appointments", icon: Calendar },
    { label: "Share with Doctor", icon: Share2 },
  ]

  useEffect(() => {
    setIsLoaded(true)
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPatientInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    console.log('Updated patient info:', patientInfo)
    setIsEditMode(false)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'Profile':
        return <Profile 
          patientInfo={patientInfo} 
          isEditMode={isEditMode} 
          setIsEditMode={setIsEditMode} 
          handleInputChange={handleInputChange} 
          handleSave={handleSave} 
        />
      case 'Health Check':
        return <HealthCheck isLoaded={isLoaded} charts={charts} />
      case 'Reports':
        return <Reports />
      case 'Add Report':
        return <AddReport />
      case 'Expense Tracker':
        return <ExpenseTracker />
      case 'Appointments':
        return <Appointments />
      case 'Share with Doctor':
        return <ShareWithDoctor />
      default:
        return <div className="text-2xl">Select a section from the sidebar</div>
    }
  }

  const ProfileSection = () => (
    <div className={`p-4 ${(!isMobile && !isSidebarOpen) ? 'hidden' : ''}`}>
      <button
        onClick={() => setIsProfileExpanded(!isProfileExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center">
          <img src={Patient} alt="Patient" className="w-12 h-12 rounded-full mr-3" />
          <div>
            <h2 className="text-lg font-bold text-gray-800">{patientInfo.name}</h2>
            <p className="text-sm text-gray-600">Patient ID: {patientInfo.id}</p>
          </div>
        </div>
        {isProfileExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      <AnimatePresence>
        {isProfileExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm space-y-2 mb-4"
          >
            <p><strong>Age:</strong> {patientInfo.age}</p>
            <p><strong>Doctor:</strong> {patientInfo.doctor}</p>
            <p><strong>Next Appointment:</strong> {patientInfo.nextAppointment}</p>
            <p><strong>Blood Type:</strong> {patientInfo.bloodType}</p>
            <p><strong>Allergies:</strong> {patientInfo.allergies}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen flex">
      {/* Sidebar */}
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
                className="w-full flex justify-center items-center py-4 hover:bg-gray-100 transition-colors duration-200"
                onClick={toggleSidebar}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
            <div className="flex justify-between items-center p-4">
              {isSidebarOpen ? (
                <Link to="/" className="text-2xl font-bold">MedWell</Link>
              ) : (
                <img src={Patient} alt="Patient" className="w-10 h-8 rounded-full" />
              )}
              {(isMobile || isSidebarOpen) && (
                <button
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  onClick={toggleSidebar}
                >
                  <X className="h-6 w-6" />
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
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-gray-100'
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{activeSection}</h1>
          {(isMobile || !isSidebarOpen) && (
            <button
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
        </div>

        {renderContent()}
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