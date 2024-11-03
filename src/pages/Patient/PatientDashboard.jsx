import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Droplet, DollarSign, Calendar, FileText, User } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import axios from 'axios'
import Chat from "../Chatbots/Chat"
import { google_ngrok_url } from '../../utils/global'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import HealthCheck from './HealthCheck'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function PatientDashboard() {
  const [showHealthCheck, setShowHealthCheck] = useState(false)
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // const [profileData, setProfileData] = useState(null)
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Hemoglobin',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'RBC Count',
        data: [],
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      },
      {
        label: 'WBC Count',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${google_ngrok_url}/patient/dashboard/`, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`
          }
        })
        setApiData(response.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (apiData && apiData.graph_data) {
      setGraphData({
        labels: apiData.graph_data.submitted_at,
        datasets: [
          {
            label: 'Hemoglobin',
            data: apiData.graph_data.hemoglobin.map(Number),
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          },
          {
            label: 'RBC Count',
            data: apiData.graph_data.rbc_count.map(Number),
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1
          },
          {
            label: 'WBC Count',
            data: apiData.graph_data.wbc_count.map(Number),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      })
    }
  }, [apiData])

  const handleHealthCheck = () => {
    setShowHealthCheck(prev => !prev)
  }

  const BoxWrapper = ({ children, className }) => (
    <motion.div
      className={`bg-white p-3 sm:p-4 rounded-lg shadow-md ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.div>
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!apiData) return <div>No data available</div>

  return (
    <div className="bg-gray-100 p-2 sm:p-4 rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="sm:col-span-2 lg:col-span-3 bg-blue-500 text-white p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between relative overflow-hidden min-h-[200px] sm:min-h-[250px]">
          <div className="z-10 mb-4 sm:mb-0 relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to Medwell!</h2>
            <p className="mb-4">Your health dashboard</p>
            <button
              onClick={handleHealthCheck}
              className="bg-white text-purple-600 px-4 sm:px-6 py-2 rounded-full hover:bg-purple-100 transition-colors text-base sm:text-lg font-semibold"
            >
              Check Your Health
            </button>
          </div>
          <img 
            src="/doctors.png" 
            alt="Doctors" 
            className="h-40 sm:h-48 lg:h-56 object-contain absolute right-0 bottom-0" 
          />
        </div>

        <BoxWrapper className="bg-[#ffffff] sm:col-span-2 lg:col-span-1">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Profile</h2>
          <div className="flex flex-col items-center">
            <img src={apiData.profile_pic || "/default-avatar.png"} alt={apiData.name} className="w-20 h-20 rounded-full mb-2" />
            <p className="font-medium">{apiData.name || 'John Doe'}</p>
            <p className="text-sm text-gray-600">Age: {apiData.age || 'N/A'}</p>
          </div>
        </BoxWrapper>

        <BoxWrapper className="bg-[#9370DB] text-white">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Total Expenses</h2>
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            <p className="text-xl sm:text-2xl font-bold">Rs. {apiData.overall_expense}</p>
          </div>
        </BoxWrapper>

        <BoxWrapper className="bg-[#B19CD9]">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Next Appointment</h2>
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            <p><strong>Doctor:</strong> {apiData.appointment.doctor_name}</p>
          </div>
          <p><strong>Date:</strong> {apiData.appointment.date}</p>
        </BoxWrapper>

        <BoxWrapper className="bg-[#ADD8E6]">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Avg. WBC Count</h2>
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full mr-2">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
            <span className="text-xl sm:text-2xl font-bold">{apiData.avg_health_data.avg_wbc_count.toFixed(2)}</span>
          </div>
        </BoxWrapper>

        <BoxWrapper className="bg-[#E0FFFF]">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Avg. Hemoglobin</h2>
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full mr-2">
              <Droplet className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
            <span className="text-xl sm:text-2xl font-bold">{apiData.avg_health_data.avg_hemoglobin.toFixed(2)}</span>
          </div>
        </BoxWrapper>

        <BoxWrapper className="sm:col-span-2 bg-[#E6E6FA]">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Health Metrics Over Time</h2>
          <div className="h-40 sm:h-48 lg:h-64">
            <Line data={graphData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </BoxWrapper>

        <BoxWrapper className="sm:col-span-2 bg-[#E6E6FA]">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Your Reports</h2>
          <div className="space-y-2 max-h-40 sm:max-h-48 lg:max-h-64 overflow-y-auto">
            {apiData.reports.map((report) => (
              <div key={report.id} className="p-2 bg-white rounded flex items-center justify-between">
                <div>
                  <p className="font-medium">{report.report_type || 'Unknown Type'}</p>
                  <p className="text-sm text-gray-600">Date: {report.report_date}</p>
                </div>
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
            ))}
          </div>
        </BoxWrapper>
      </div>
      {showHealthCheck && <HealthCheck healthData={apiData.avg_health_data} />}
      <Chat />
    </div>
  )
}