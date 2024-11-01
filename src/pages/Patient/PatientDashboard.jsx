import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Droplet, DollarSign, Calendar } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import Chat from "../components/Chat"

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
import { google_ngrok_url } from '../../utils/global';

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
      className={`bg-white p-3 sm:p-4 rounded-lg shadow-md ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="bg-gray-100 p-2 sm:p-4 rounded-xl"> {/* Update 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"> {/* Update 2 */}
        <div className="sm:col-span-2 lg:col-span-3 bg-blue-500 text-white p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between relative overflow-hidden min-h-[200px] sm:min-h-[250px]"> {/* Update 3 */}
          <div className="z-10 mb-4 sm:mb-0 relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to Medwell !</h2>
            <p className="mb-4">Here, some random words</p>
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

        <BoxWrapper className="bg-[#D3D3D3] sm:col-span-2 lg:col-span-1"> {/* Update 5 */}
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Profile</h2>
          <div className="flex flex-col items-center">
            <img src={google_ngrok_url+profileData.profile_pic || "/Vivek.jpg"} alt={profileData.name} className="w-20 h-20 rounded-full mb-2" />
            <p className="font-medium">{profileData.name}</p>
            <p className="text-sm text-gray-600">Age: {profileData.age}</p>
          </div>
        </BoxWrapper>

        <BoxWrapper className="bg-[#9370DB] text-white"> {/* Update 5 */}
          <h2 className="text-base sm:text-lg font-semibold mb-2">Total Expenses</h2>
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            <p className="text-xl sm:text-2xl font-bold">Rs. {expenseData.overall_expense}</p>
          </div>
        </BoxWrapper>

        <BoxWrapper className="bg-[#B19CD9]"> {/* Update 5 */}
          <h2 className="text-base sm:text-lg font-semibold mb-2">Appointments</h2>
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            <p><strong>Doctor:</strong> {appointmentData.doctor}</p>
          </div>
          <p><strong>Date:</strong> {appointmentData.date}</p>
        </BoxWrapper>

        <BoxWrapper className="bg-[#ADD8E6]"> {/* Update 5 */}
          <h2 className="text-base sm:text-lg font-semibold mb-2">WBC Count</h2>
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full mr-2">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
            <span className="text-xl sm:text-2xl font-bold">{healthData.wbc_count[healthData.wbc_count.length - 1]}</span>
          </div>
        </BoxWrapper>

        <BoxWrapper className="bg-[#E0FFFF]"> {/* Update 5 */}
          <h2 className="text-base sm:text-lg font-semibold mb-2">HemoGoblin Count</h2>
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full mr-2">
              <Droplet className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
            <span className="text-xl sm:text-2xl font-bold">{healthData.hemoglobin[healthData.hemoglobin.length - 1]}</span>
          </div>
        </BoxWrapper>

        <BoxWrapper className="sm:col-span-2 bg-[#E6E6FA]"> {/* Update 5 */}
          <h2 className="text-base sm:text-lg font-semibold mb-2">Platelet Count</h2>
          <div className="h-40 sm:h-48 lg:h-64">
            <Line data={plateletData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </BoxWrapper>

        <BoxWrapper className="sm:col-span-2 bg-[#E6E6FA]"> {/* Update 5 */}
          <h2 className="text-base sm:text-lg font-semibold mb-2">Your Reports</h2>
          <div className="space-y-2 max-h-40 sm:max-h-48 lg:max-h-64 overflow-y-auto">
            {reportsData.map((report, index) => (
              <div key={index} className="p-2 bg-white rounded">
                <p className="font-medium">Report {index + 1}</p>
                <p className="text-sm text-gray-600">{report.date}</p>
              </div>
            ))}
          </div>
        </BoxWrapper>
      </div>
      {showHealthCheck && <HealthCheck healthData={healthData} />}
    <Chat/>

    </div>
  );
}