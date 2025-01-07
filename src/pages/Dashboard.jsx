import React, { useEffect, useState } from 'react'
import { Home, User, Heart, FileText, PlusCircle, DollarSign, Calendar, Share2, ChevronUp, ChevronDown, Activity, Droplet, Thermometer, Brain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, Outlet, useLocation, Routes, Route } from 'react-router-dom'
import { useFetch } from './components/useFetch'
import HealthCheck from './Patient/HealthCheck'
import { MobileNav } from './Patient/MobileNav'

export default function MedicalDashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [chartData, setChartData] = useState({})
  const [isMobile, setIsMobile] = useState(false)
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
  const [healthCheckData, setHealthCheckData] = useState({
    isLoaded: false,
    charts: []
  });

  const location = useLocation()

  const navItems = [
    { label: "Dashboard", icon: Home, path: "/patient" },
    { label: "Profile", icon: User, path: "/patient/profile" },
    { label: "Health Check", icon: Heart, path: "/patient/health-check" },
    { label: "Reports", icon: FileText, path: "/patient/reports" },
    { label: "Add Report", icon: PlusCircle, path: "/patient/add-report" },
    { label: "Expense Tracker", icon: DollarSign, path: "/patient/expense-tracker" },
    { label: "Appointments", icon: Calendar, path: "/patient/appointments" },
    { label: "Share with Doctor", icon: Share2, path: "/patient/share-with-doctor" },
  ]

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const healthCheckResult = await fetchHealthCheck()
        setChartData(healthCheckResult.data || {})
        
        const patientInfoResult = await getPatientInfo()
        setPatientInfo(patientInfoResult)
        console.log(patientInfoResult)

        setIsLoaded(true)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchAllData()

    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [fetchHealthCheck, getPatientInfo])

  useEffect(() => {
    const fetchHealthCheckData = async () => {
      try {
        const result = await fetchHealthCheck();
        setHealthCheckData({
          isLoaded: true,
          charts: [
            { label: "Hemoglobin", color: "#ff6b6b", icon: Heart, data: result.hemoglobin || [] },
            { label: "RBC Count", color: "#4ecdc4", icon: Activity, data: result.rbc_count || [] },
            { label: "WBC Count", color: "#45aaf2", icon: Droplet, data: result.wbc_count || [] },
            { label: "Platelet Count", color: "#fed330", icon: Thermometer, data: result.platelet_count || [] },
            { label: "PCV", color: "#26de81", icon: User, data: result.pcv || [] },
            { label: "Bilirubin", color: "#a55eea", icon: Brain, data: result.bilirubin || [] },
            { label: "Proteins", color: "#fd9644", icon: Thermometer, data: result.proteins || [] },
            { label: "Calcium", color: "#2bcbba", icon: User, data: result.calcium || [] },
            { label: "Blood Urea", color: "#eb3b5a", icon: Brain, data: result.blood_urea || [] },
            { label: "SR Cholesterol", color: "#778ca3", icon: Thermometer, data: result.sr_cholestrol || [] }
          ]
        });
      } catch (error) {
        console.error('Error fetching health check data:', error);
        setHealthCheckData({
          isLoaded: true,
          charts: []
        });
      }
    };

    fetchHealthCheckData();
  }, []);


  return (
    <div className="bg-gradient-to-br from-blue-50 to-white text-blue-900 min-h-screen flex">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex bg-white shadow-lg overflow-hidden flex-col w-72">
        <div className="flex justify-center items-center p-4 bg-blue-100 mb-6">
          <Link to="/" className="text-2xl font-bold text-gray-800">MedWell</Link>
        </div>
        <nav className="px-4 flex-grow">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`w-full text-left py-2 px-4 rounded-lg mb-2 flex items-center ${
                location.pathname === item.path
                  ? 'bg-gray-100 text-gray-600'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 p-4 border-t">
          <div className="flex items-center">
            <img src={patientInfo.profile_pic || "/patient.png"} alt="Patient" className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500" />
            <div>
              <h2 className="text-sm font-bold text-gray-800">{patientInfo?.name || 'John Doe'}</h2>
              <p className="text-xs text-blue-600">ID: {patientInfo?.id || 'P12345'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        {/* For mobile: Add a header with the MedWell logo */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <Link to="/" className="text-2xl font-bold text-gray-800">MedWell</Link>
          {/* You can add a menu button here if needed */}
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>
        </div>

        {isLoading ? (
          <div className="text-center text-blue-600">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading...
          </div>
        ) : error ? (
          <div>
            <div className="text-center text-red-500 mb-4">Error: {error}</div>
            <Outlet />
          </div>
        ) : (
          <Routes>
            <Route 
              path="health-check" 
              element={
                <HealthCheck 
                  isLoaded={healthCheckData.isLoaded} 
                  charts={healthCheckData.charts} 
                />
              } 
            />
            <Route path="*" element={<Outlet />} />
          </Routes>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobile && <MobileNav />}
    </div>
  )
}