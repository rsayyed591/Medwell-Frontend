import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import Patient from './../../public/patient.png'
import { Activity, Heart, Thermometer, Droplet, User, Brain, Menu, X, FileText, PlusCircle, DollarSign, Calendar, Share2, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
// Mock data for charts
const generateChartData = () => Array.from({ length: 20 }, (_, i) => ({ x: i, y: Math.random() * 100 }))

const LineChart = ({ data, color }) => {
  const svgRef = useRef(null)

  useEffect(() => {
    if (data && svgRef.current) {
      const svg = d3.select(svgRef.current)
      svg.selectAll("*").remove() // Clear previous chart

      const margin = { top: 20, right: 20, bottom: 30, left: 40 }
      const width = svg.node().getBoundingClientRect().width
      const height = svg.node().getBoundingClientRect().height
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom

      const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, innerWidth])
      const y = d3.scaleLinear().domain([0, d3.max(data, d => d.y)]).range([innerHeight, 0])

      const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d.y))

      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", line)

      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).ticks(5))

      g.append("g")
        .call(d3.axisLeft(y).ticks(5))
    }
  }, [data, color])

  return <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet"></svg>
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

  const charts = [
    { label: "Heart Rate", color: "#ff6b6b", icon: Heart },
    { label: "Blood Pressure", color: "#4ecdc4", icon: Activity },
    { label: "Blood Sugar", color: "#45aaf2", icon: Droplet },
    { label: "Cholesterol", color: "#fed330", icon: Thermometer },
    { label: "BMI", color: "#26de81", icon: User },
    { label: "Mental Health", color: "#a55eea", icon: Brain }
  ]

  const navItems = [
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
                      {isLoaded && <LineChart data={generateChartData()} color={chart.color} />}
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
                    value={Math.floor(Math.random() * 100)}
                    total={100}
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
            <div className={`p-4 ${(!isMobile && !isSidebarOpen) ? 'hidden' : ''}`}>
              <div className="flex justify-between items-center mb-6">
                <Link to="/" className="text-2xl font-bold">MedWell</Link>
                <button
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  onClick={toggleSidebar}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <img src={Patient} alt="Patient" className="w-32 h-32 rounded-full mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Vivek Chouhan</h2>
              <p className="text-lg text-center text-gray-600 mb-6">Patient ID: 12345</p>
              <div className="text-lg space-y-2 mb-8">
                <p><strong className="font-semibold">Age:</strong> 45</p>
                <p><strong className="font-semibold">Doctor:</strong> Dr. Rohit Deshmukh</p>
                <p><strong className="font-semibold">Next Appointment:</strong> 15 Oct 2024</p>
                <p><strong className="font-semibold">Blood Type:</strong> O+</p>
                <p><strong className="font-semibold">Allergies:</strong> None</p>
              </div>
            </div>
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