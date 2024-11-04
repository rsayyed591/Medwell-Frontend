import React, { useEffect, useState } from 'react'
import { Home, User, Heart, FileText, PlusCircle, DollarSign, Calendar, Share2, ChevronRight, ChevronUp, ChevronDown, Menu, X, Activity, Droplet, Thermometer, Brain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import Profile from './Patient/Profile'
import HealthCheck from './Patient/HealthCheck'
import Reports from './Patient/Reports'
import AddReport from './Patient/AddReport'
import ExpenseTracker from './Expenses/ExpenseTracker'
import PatientDashboard from './Patient/PatientDashboard'
import Appointments from './Patient/Appointments'
import ShareWithDoctor from './Patient/ShareWithDoctor'
import { useFetch } from './components/useFetch'

export default function MedicalDashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [chartData, setChartData] = useState({})
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('Dashboard')
  const [isMobile, setIsMobile] = useState(false)
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)
  const { isLoading, error, fetchHealthCheck, getPatientInfo } = useFetch()
  const [patientInfo, setPatientInfo] = useState({
    name: 'John Doe',
    id: 'P12345',
    age: 30,
    blood_group: 'O+',
    allergies: ['Peanuts', 'Penicillin'],
    profile_pic:"/Vivek.jpg",
    user_info:{email:'123@gmail.com'}
  })

  const [expenseData, setExpenseData] = useState({ overall_expense: 0 })
  const [appointmentData, setAppointmentData] = useState({ doctor: 'N/A', date: 'N/A' })
  const [healthData, setHealthData] = useState({ wbc_count: [], hemoglobin: [] })

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const healthCheckResult = await fetchHealthCheck()
        setChartData(healthCheckResult.data || {})
        
        const patientInfoResult = await getPatientInfo()
        setPatientInfo(patientInfoResult)
        console.log(patientInfoResult)
        setExpenseData({ overall_expense: 1000 })
        setAppointmentData({ doctor: 'Dr. Smith', date: '2024-03-15' })
        setHealthData({
          wbc_count: [4.5, 5.0, 4.8],
          hemoglobin: [14.2, 14.5, 14.0]
        })

        setIsLoaded(true)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchAllData()
  }, [fetchHealthCheck, getPatientInfo])
  
  const navigate = useNavigate()
  const charts = [
    { label: "Hemoglobin", color: "#ff6b6b", icon: Heart, data: chartData.hemoglobin || [] },
    { label: "RBC Count", color: "#4ecdc4", icon: Activity, data: chartData.rbc_count || [] },
    { label: "WBC Count", color: "#45aaf2", icon: Droplet, data: chartData.wbc_count || [] },
    { label: "Platelet Count", color: "#fed330", icon: Thermometer, data: chartData.platelet_count || [] },
    { label: "PCV", color: "#26de81", icon: User, data: chartData.pcv || [] },
    { label: "Bilirubin", color: "#a55eea", icon: Brain, data: chartData.bilirubin || [] },
    { label: "Proteins", color: "#fd9644", icon: Thermometer, data: chartData.proteins || [] },
    { label: "Calcium", color: "#2bcbba", icon: User, data: chartData.calcium || [] },
    { label: "Blood Urea", color: "#eb3b5a", icon: Brain, data: chartData.blood_urea || [] },
    { label: "SR Cholesterol", color: "#778ca3", icon: Thermometer, data: chartData.sr_cholestrol || [] }
  ]

  const navItems = [
    { label: "Profile", icon: User },
    { label: "Dashboard", icon: Home},
    { label: "Health Check", icon: Heart },
    { label: "Reports", icon: FileText },
    { label: "Add Report", icon: PlusCircle },
    { label: "Expense Tracker", icon: DollarSign },
    { label: "Appointments", icon: Calendar },
    { label: "Share with Doctor", icon: Share2 },
  ]

  useEffect(() => {
    const user = localStorage.getItem("Token")
    setIsLoaded(true)
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <PatientDashboard />
      case 'Profile':
        return <Profile patientInfo={patientInfo} />
      case 'Health Check':
        return <HealthCheck isLoaded={isLoaded} charts={charts} />
      case 'Reports':
        return <Reports  />
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
          <img src="/patient.png" alt="Patient" className="w-12 h-12 rounded-full mr-3" />
          <div>
            <h2 className="text-lg font-bold text-gray-800">{patientInfo?.name || 'John Doe'}</h2>
            <p className="text-sm text-gray-600">Patient ID: {patientInfo?.id || 'P12345'}</p>
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
            <p><strong>Age:</strong> {patientInfo?.age || 30}</p>
            <p><strong>Blood Type:</strong> {patientInfo?.blood_group || 'O+'}</p>
            <p><strong>Allergies:</strong> {patientInfo?.allergies?.join(', ') || 'None'}</p>
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
                <img src="/patient.png" alt="Patient" className="w-10 h-8 rounded-full" />
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

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div>
          <div className="text-center text-red-500">Error: {error}
          </div>
         { renderContent()}
          </div>
        ) : (
          renderContent()
        )}
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