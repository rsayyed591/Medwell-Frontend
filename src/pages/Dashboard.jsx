import React, { useEffect, useState } from 'react'
import Patient from './../../public/patient.png'
import { Activity, Heart, Thermometer, Droplet, User, Brain, Menu, X, FileText, PlusCircle, DollarSign, Calendar, Share2, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const defaultChartData = {
  heartRate: [68, 72, 70, 75, 69, 71, 73, 76, 74, 72],
  bloodPressure: [120, 118, 122, 119, 121, 123, 120, 118, 117, 119],
  bloodSugar: [95, 100, 98, 102, 97, 99, 101, 96, 98, 100],
  cholesterol: [180, 185, 178, 182, 179, 183, 181, 184, 180, 182],
  bmi: [24.5, 24.3, 24.6, 24.4, 24.5, 24.7, 24.6, 24.5, 24.4, 24.6],
  mentalHealth: [7, 8, 7, 9, 8, 7, 8, 9, 8, 7]
}

const LineChart = ({ data, color, label }) => {
  const chartData = {
    labels: Array.from({ length: data.length }, (_, i) => i + 1),
    datasets: [
      {
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: color,
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  }

  return <Line data={chartData} options={options} />
}

const CircularMetric = ({ value, total, label, icon: Icon, color }) => {
  const percentage = (value / total) * 100;
  return (
    <div className="flex items-center space-x-6">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-12 h-12 text-gray-600" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold" style={{ color }}>
          {value}
        </div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
};

const AnimatedCard = ({ children, index, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.5, delay: index * 0.1 + delay }}
    >
      {children}
    </motion.div>
  )
}

export default function MedicalDashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('Health Check')
  const [isMobile, setIsMobile] = useState(false)
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)

  const charts = [
    { label: "Heart Rate", color: "#ff6b6b", icon: Heart, data: defaultChartData.heartRate },
    { label: "Blood Pressure", color: "#4ecdc4", icon: Activity, data: defaultChartData.bloodPressure },
    { label: "Blood Sugar", color: "#45aaf2", icon: Droplet, data: defaultChartData.bloodSugar },
    { label: "Cholesterol", color: "#fed330", icon: Thermometer, data: defaultChartData.cholesterol },
    { label: "BMI", color: "#26de81", icon: User, data: defaultChartData.bmi },
    { label: "Mental Health", color: "#a55eea", icon: Brain, data: defaultChartData.mentalHealth }
  ]

  const navItems = [
    { label: "Health Check", icon: Heart },
    { label: "Reports", icon: FileText },
    { label: "Add Report", icon: PlusCircle },
    { label: "Expense Tracker", icon: DollarSign },
    { label: "Appointments", icon: Calendar },
    { label: "Share with Doctor", icon: Share2 },
  ]

  const patientInfo = {
    name: "Vivek Chouhan",
    id: "12345",
    age: "45",
    doctor: "Dr. Rohit Deshmukh",
    nextAppointment: "15 Oct 2024",
    bloodType: "O+",
    allergies: "None",
  }

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

  const renderContent = () => {
    switch (activeSection) {
      case 'Health Check':
        return (
          <>
            {/* Line Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {charts.map((chart, index) => (
                <AnimatedCard key={index} index={index + 1}>
                  <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">{chart.label}</h3>
                    <div className="h-40">
                      {isLoaded && <LineChart data={chart.data} color={chart.color} label={chart.label} />}
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* Circular Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {charts.map((chart, index) => (
                <AnimatedCard key={index} index={index} delay={index >= 3 ? 0.5 : 0}>
                  <CircularMetric 
                    value={chart.data[chart.data.length - 1]}
                    total={Math.max(...chart.data)}
                    label={chart.label}
                    icon={chart.icon}
                    color={chart.color}
                  />
                </AnimatedCard>
              ))}
            </div>
          </>
        )
      case 'Reports':
        return <div className="text-2xl">Your Reports</div>
      case 'Add Report':
        return <div className="text-2xl">Add a New Report</div>
      case 'Expense Tracker':
        return <div className="text-2xl">Expense Tracker</div>
      case 'Appointments':
        return <div className="text-2xl">Your Appointments</div>
      case 'Share with Doctor':
        return <div className="text-2xl">Share Information with Your Doctor</div>
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

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}