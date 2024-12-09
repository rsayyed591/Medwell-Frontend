import React, { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js'
import { ArrowUp, ArrowDown, DollarSign, Users, Calendar, Clock, TrendingUp } from 'lucide-react'

Chart.register(...registerables)

// Mock JSON data for analytics
const analyticsData = {
  totalPatients: 1500,
  newPatients: 50,
  totalAppointments: 2800,
  revenue: 150000,
  patientTrend: [1200, 1250, 1300, 1350, 1400, 1450, 1500],
  appointmentStats: [
    { month: 'Jan', count: 200 },
    { month: 'Feb', count: 250 },
    { month: 'Mar', count: 180 },
    { month: 'Apr', count: 300 },
    { month: 'May', count: 280 },
    { month: 'Jun', count: 220 },
  ],
  financialSummary: [
    { category: 'Consultations', amount: 80000 },
    { category: 'Procedures', amount: 50000 },
    { category: 'Medications', amount: 15000 },
    { category: 'Lab Tests', amount: 5000 },
  ],
  departmentPerformance: [
    { department: 'Cardiology', score: 85 },
    { department: 'Neurology', score: 78 },
    { department: 'Pediatrics', score: 92 },
    { department: 'Orthopedics', score: 88 },
    { department: 'Oncology', score: 80 },
  ],
}

export default function Analytics() {
  const patientChartRef = useRef(null)
  const appointmentChartRef = useRef(null)
  const financialChartRef = useRef(null)
  const departmentChartRef = useRef(null)

  useEffect(() => {
    // Patient Trend Chart
    const patientCtx = patientChartRef.current.getContext('2d')
    const patientChart = new Chart(patientCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Total Patients',
          data: analyticsData.patientTrend,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 2000,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Patient Growth Trend',
            color: '#000',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              color: '#000',
            },
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              color: '#000',
            },
          },
        },
      },
    })

    // Appointment Statistics Chart
    const appointmentCtx = appointmentChartRef.current.getContext('2d')
    const appointmentChart = new Chart(appointmentCtx, {
      type: 'bar',
      data: {
        labels: analyticsData.appointmentStats.map(stat => stat.month),
        datasets: [{
          label: 'Appointments',
          data: analyticsData.appointmentStats.map(stat => stat.count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 2000,
          easing: 'easeOutBounce',
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Monthly Appointment Statistics',
            color: '#000',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              color: '#000',
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#000',
            },
          },
        },
      },
    })

    // Financial Summary Chart
    const financialCtx = financialChartRef.current.getContext('2d')
    const financialChart = new Chart(financialCtx, {
      type: 'doughnut',
      data: {
        labels: analyticsData.financialSummary.map(item => item.category),
        datasets: [{
          data: analyticsData.financialSummary.map(item => item.amount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000,
          easing: 'easeOutCirc',
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#000',
            },
          },
          title: {
            display: true,
            text: 'Financial Summary',
            color: '#000',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
      },
    })

    // Department Performance Chart
    const departmentCtx = departmentChartRef.current.getContext('2d')
    const departmentChart = new Chart(departmentCtx, {
      type: 'radar',
      data: {
        labels: analyticsData.departmentPerformance.map(dept => dept.department),
        datasets: [{
          label: 'Performance Score',
          data: analyticsData.departmentPerformance.map(dept => dept.score),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(75, 192, 192)'
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 2000,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Department Performance',
            color: '#000',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
        scales: {
          r: {
            angleLines: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
              color: '#000'
            },
            ticks: {
              color: '#000',
              backdropColor: 'rgba(255, 255, 255, 0.7)'
            }
          }
        }
      },
    })

    return () => {
      patientChart.destroy()
      appointmentChart.destroy()
      financialChart.destroy()
      departmentChart.destroy()
    }
  }, [])

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-6">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <h2 className="text-2xl font-bold text-gray-800">{analyticsData.totalPatients}</h2>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">{analyticsData.newPatients} new</span>
            </div>
          </div>
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <h2 className="text-2xl font-bold text-gray-800">{analyticsData.totalAppointments}</h2>
              </div>
              <Calendar className="h-10 w-10 text-purple-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">5% increase</span>
            </div>
          </div>
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <h2 className="text-2xl font-bold text-gray-800">${analyticsData.revenue.toLocaleString()}</h2>
              </div>
              <DollarSign className="h-10 w-10 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">10% increase</span>
            </div>
          </div>
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Appointment Duration</p>
                <h2 className="text-2xl font-bold text-gray-800">45 min</h2>
              </div>
              <Clock className="h-10 w-10 text-yellow-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">2 min decrease</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <canvas ref={patientChartRef}></canvas>
          </div>
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <canvas ref={appointmentChartRef}></canvas>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <canvas ref={financialChartRef}></canvas>
          </div>
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <canvas ref={departmentChartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  )
}