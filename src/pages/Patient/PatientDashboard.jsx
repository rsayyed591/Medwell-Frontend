import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Droplet } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import HealthCheck from './HealthCheck';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PatientDashboard({ profileData, expenseData, appointmentData, healthData, reportsData }) {
  const [showHealthCheck, setShowHealthCheck] = useState(false);
  const handleHealthCheck = () => {
    setShowHealthCheck(prev => !prev);
  };
  
  const [plateletData, setPlateletData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Platelet Count',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  });

  useEffect(() => {
    if (healthData && healthData.platelet_count) {
      setPlateletData({
        labels: healthData.platelet_count.map((_, index) => `Day ${index + 1}`),
        datasets: [
          {
            label: 'Platelet Count',
            data: healthData.platelet_count,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      });
    }
  }, [healthData]);

  const BoxWrapper = ({ children, className }) => (
    <motion.div
      className={`bg-white p-4 rounded-lg shadow-md ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-purple-500 text-white p-6 rounded-lg flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Medwell !</h1>
          <p className="mb-4">Here, some random words</p>
          <button
            onClick={handleHealthCheck}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Check Your Health
          </button>
        </div>
        <img src="/doctors.png" alt="Doctors" className="h-32 object-contain" />
      </div>

      <BoxWrapper className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <div className="flex flex-col items-center">
          <img src={profileData.profile_pic || "/placeholder.svg?height=100&width=100"} alt={profileData.name} className="w-20 h-20 rounded-full mb-2" />
          <p className="font-medium">{profileData.name}</p>
          <p className="text-sm text-gray-600">Age: {profileData.age}</p>
        </div>
      </BoxWrapper>

      <BoxWrapper className="col-span-1 md:col-span-1 lg:col-span-1 bg-purple-100">
        <h2 className="text-lg font-semibold mb-2">Total Expenses</h2>
        <p className="text-3xl font-bold text-green-500">Rs. {expenseData.overall_expense}</p>
      </BoxWrapper>

      <BoxWrapper className="col-span-1 md:col-span-1 lg:col-span-1 bg-purple-50">
        <h2 className="text-lg font-semibold mb-2">Upcoming Appointment</h2>
        <p><strong>Doctor:</strong> {appointmentData.doctor}</p>
        <p><strong>Date:</strong> {appointmentData.date}</p>
      </BoxWrapper>

      <BoxWrapper className="col-span-1 md:col-span-1 lg:col-span-1 bg-purple-50">
        <h2 className="text-lg font-semibold mb-2">WBC Count</h2>
        <div className="flex items-center">
          <div className="bg-gray-200 p-2 rounded-full mr-2">
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-xl font-bold">{healthData.wbc_count[healthData.wbc_count.length - 1]}</span>
        </div>
      </BoxWrapper>

      <BoxWrapper className="col-span-1 md:col-span-1 lg:col-span-1 bg-purple-50">
        <h2 className="text-lg font-semibold mb-2">Hemoglobin</h2>
        <div className="flex items-center">
          <div className="bg-gray-200 p-2 rounded-full mr-2">
            <Droplet className="w-6 h-6 text-red-500" />
          </div>
          <span className="text-xl font-bold">{healthData.hemoglobin[healthData.hemoglobin.length - 1]}</span>
        </div>
      </BoxWrapper>

      <BoxWrapper className="col-span-1 md:col-span-2 lg:col-span-2 h-64">
        <h2 className="text-lg font-semibold mb-2">Platelet Count</h2>
        <div className="h-52">
          <Line data={plateletData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </BoxWrapper>

      <BoxWrapper className="col-span-1 md:col-span-2 lg:col-span-2">
        <h2 className="text-lg font-semibold mb-2">Your Reports</h2>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {reportsData.map((report, index) => (
            <div key={index} className="p-2 bg-gray-100 rounded">
              <p className="font-medium">Report {index + 1}</p>
              <p className="text-sm text-gray-600">{report.date}</p>
            </div>
          ))}
        </div>
      </BoxWrapper>
      {showHealthCheck && <HealthCheck healthData={healthData} />}
    </div>
  );
}