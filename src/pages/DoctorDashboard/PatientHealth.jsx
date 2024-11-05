import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { AnimatedCard, CircularMetric } from '../Patient/SharedComponents'
import CombinedChat from "../Chatbots/CombinedChat"
import { Activity, Droplet, Thermometer, Heart, Zap, Clipboard, ArrowLeft } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const dummyResponse = {
  "avg_data": {
    "avg_hemoglobin": 12.149999999999999,
    "avg_rbc_count": 4.47,
    "avg_wbc_count": 8125.0,
    "avg_platelet_count": 206000.0,
    "avg_pcv": 37.025,
    "avg_bilirubin": 0.57,
    "avg_proteins": 6.18,
    "avg_calcium": 8.19,
    "avg_blood_urea": 21.0,
    "avg_sr_cholestrol": 159.0
  },
  "data": {
    "submitted_at": [
      "2024-11-03",
      "2024-11-03",
      "2024-11-03",
      "2024-11-03"
    ],
    "hemoglobin": [
      "12.6",
      "12.1",
      "13.1",
      "10.8"
    ],
    "rbc_count": [
      "4.46",
      "4.72",
      "4.72",
      "3.98"
    ],
    "wbc_count": [
      "5000",
      "9700",
      "12700",
      "5100"
    ],
    "platelet_count": [
      "152000",
      "219000",
      "294000",
      "159000"
    ],
    "pcv": [
      "37.1",
      "38",
      "41",
      "32"
    ],
    "bilirubin": [
      null,
      "0.57",
      null,
      null
    ],
    "proteins": [
      null,
      "6.18",
      null,
      null
    ],
    "calcium": [
      null,
      "8.19",
      null,
      null
    ],
    "blood_urea": [
      null,
      "21",
      null,
      null
    ],
    "sr_cholestrol": [
      "159",
      null,
      null,
      null
    ]
  },
  "status": true
}

const LineChart = ({ data, color, label }) => {
  const chartData = {
    labels: dummyResponse.data.submitted_at,
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
      x: {
        type: 'category',
        display: true,
      },
      y: {
        type: 'linear',
        display: true,
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

export default function PatientHealth({ patientId, onClose }) {
  const charts = [
    { label: 'Hemoglobin', data: dummyResponse.data.hemoglobin.map(Number), color: '#FF6384', icon: Droplet },
    { label: 'RBC Count', data: dummyResponse.data.rbc_count.map(Number), color: '#36A2EB', icon: Thermometer },
    { label: 'WBC Count', data: dummyResponse.data.wbc_count.map(Number), color: '#FFCE56', icon: Activity },
    { label: 'Platelet Count', data: dummyResponse.data.platelet_count.map(Number), color: '#4BC0C0', icon: Heart },
    { label: 'PCV', data: dummyResponse.data.pcv.map(Number), color: '#9966FF', icon: Zap },
    { label: 'Cholesterol', data: dummyResponse.data.sr_cholestrol.filter(Boolean).map(Number), color: '#FF9F40', icon: Clipboard }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={onClose}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patients
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Patient Health - Patient {patientId}</h1>
      </div>

      {/* Line Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {charts.map((chart, index) => (
          <AnimatedCard key={index} index={index + 1}>
            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{chart.label}</h3>
              <div className="h-40">
                <LineChart data={chart.data} color={chart.color} label={chart.label} />
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
      <CombinedChat/>
    </div>
  )
}