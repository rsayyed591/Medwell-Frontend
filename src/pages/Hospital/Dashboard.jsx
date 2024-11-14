import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Share, Users, UserPlus, Scissors, Building, MoreVertical, Search, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const calendarEvents = [
  { date: new Date(2024, 0, 15), type: 'appointment', title: 'Dr. Rick Appointment', color: 'yellow' },
  { date: new Date(2024, 0, 16), type: 'meeting', title: 'Dentist Meetup', color: 'blue' },
  { date: new Date(2024, 0, 17), type: 'surgery', title: 'Ron Surgery', color: 'orange' },
]

const patientStats = [
  { day: "Mon", patient: 650, inpatient: 450 },
  { day: "Tue", patient: 700, inpatient: 400 },
  { day: "Wed", patient: 490, inpatient: 300 },
  { day: "Thu", patient: 600, inpatient: 350 },
  { day: "Fri", patient: 445, inpatient: 280 },
  { day: "Sat", patient: 320, inpatient: 190 },
  { day: "Sun", patient: 520, inpatient: 340 },
]

const patients = [
  {
    id: "01",
    code: "#FUP12132424",
    name: "Isagi Yoichi",
    age: 20,
    created: "25 Dec 2023",
    time: "08:30pm",
    type: "FUP/ECG",
    status: "Success"
  },
  {
    id: "02",
    code: "#ECG12132424",
    name: "Leonardo Decapio",
    age: 36,
    created: "25 Dec 2023",
    time: "08:30pm",
    type: "ECG",
    status: "Pending"
  },
]

export default function Dashboard() {
  const [date, setDate] = useState(new Date())
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const chartData = {
    labels: patientStats.map(stat => stat.day),
    datasets: [
      {
        label: 'Patient',
        data: patientStats.map(stat => stat.patient),
        backgroundColor: 'rgb(22 163 74)',
      },
      {
        label: 'Inpatient',
        data: patientStats.map(stat => stat.inpatient),
        backgroundColor: 'rgb(134 239 172)',
      },
    ],
  }

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = calendarEvents.filter(event => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth()
      )

      return dayEvents.length > 0 ? (
        <div className="flex flex-col gap-1 mt-1">
          {dayEvents.map((event, index) => (
            <div
              key={index}
              className="text-xs p-1 rounded-sm truncate"
              style={{
                backgroundColor: event.type === 'appointment' ? '#FEF3C7' : 
                               event.type === 'meeting' ? '#DBEAFE' : '#FED7AA',
                color: event.type === 'appointment' ? '#92400E' :
                       event.type === 'meeting' ? '#1E40AF' : '#9A3412'
              }}
            >
              {event.title}
            </div>
          ))}
        </div>
      ) : null
    }
    return null
  }

  const CustomNavigation = ({ label, onPrevClick, onNextClick }) => (
    <div className="flex items-center justify-between mb-4">
      <button onClick={onPrevClick} className="p-1 hover:bg-gray-100 rounded">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm font-medium">{label}</span>
      <button onClick={onNextClick} className="p-1 hover:bg-gray-100 rounded">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          padding: 15,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      y: {
        grid: {
          borderDash: [2, 4]
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12
          }
        }
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 bg-gray-100">
      <style jsx global>{`
        .react-calendar {
          border: none;
          width: 100%;
          max-width: 100%;
          background: white;
          font-family: inherit;
        }

        .react-calendar__tile {
          padding: 0.75em 0.5em;
          height: auto;
          text-align: center;
        }

        .react-calendar__month-view__days__day--weekend {
          color: inherit;
        }

        .react-calendar__tile--active {
          background: #dcfce7 !important;
          color: #166534 !important;
        }

        .react-calendar__tile--now {
          background: #f0fdf4;
        }

        .react-calendar__navigation button:disabled {
          background-color: transparent;
        }

        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #f0fdf4;
        }

        @media (max-width: 768px) {
          .react-calendar {
            font-size: 14px;
          }
          
          .react-calendar__tile {
            padding: 0.5em 0.3em;
          }
        }
      `}</style>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Welcome back, Hospi 👋</h1>
          <p className="text-sm text-green-600">Here is the latest update for the last 7 days, check now</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm leading-tight focus:outline-none focus:border-green-500">
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button className="flex items-center gap-2 bg-white text-green-600 border border-green-600 px-4 py-2 rounded-md text-sm hover:bg-green-50">
            <Share className="h-4 w-4" /> Share
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-green-600 text-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall visitors</span>
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="text-2xl font-bold">10,525</div>
          <p className="text-xs">+15.2% from last week</p>
          <div className="mt-4 text-xs">1,345 today</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">Total patient</span>
            <UserPlus className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-800">5,715</div>
          <p className="text-xs text-green-600">+10.4% from last week</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">Surgery</span>
            <Scissors className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-800">523</div>
          <p className="text-xs text-green-600">+5% from last week</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">Overall Room</span>
            <Building className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-800">221</div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-green-600">General Room</span>
              <span className="font-medium">110</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-green-600">Private Room</span>
              <span className="font-medium">111</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-green-800 mb-4">Patient Statistics</h2>
          <div className="relative w-full" style={{ minHeight: isMobile ? '250px' : '300px' }}>
            <Bar 
              data={chartData} 
              options={chartOptions}
              style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
            />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
          <h2 className="text-lg font-semibold text-green-800 mb-4">Calendar</h2>
          <div className="max-w-full overflow-x-auto">
            <Calendar
              onChange={setDate}
              value={date}
              tileContent={tileContent}
              navigationLabel={({ date }) => 
                `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
              }
              navigationButton={CustomNavigation}
              className="w-full border-0"
              tileClassName="text-sm p-2 rounded-lg hover:bg-gray-50"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-green-800 mb-4">All Patients</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search anything here"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <button className="flex items-center gap-2 bg-white text-green-600 border border-green-600 px-4 py-2 rounded-md text-sm hover:bg-green-50">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {patient.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.status === "Success" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}