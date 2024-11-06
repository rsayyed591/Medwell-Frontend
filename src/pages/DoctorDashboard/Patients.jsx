import React, { useState, useMemo } from 'react'
import { FileText, Stethoscope, Search } from 'lucide-react'
import PatientReports from './PatientReports'
import PatientHealth from './PatientHealth'

const patientData = [
  {
    requested_at: "2024-11-05T00:56:46.972218+05:30",
    user_info: {
      id: 69,
      email: "rohit@gmail.com"
    }
  },
  {
    requested_at: "2024-11-05T00:40:57.816854+05:30",
    user_info: {
      id: 70,
      email: "amit@gmail.com"
    }
  },
  {
    requested_at: "2024-11-05T00:20:03.314123+05:30",
    user_info: {
      id: 71,
      email: "priya@gmail.com"
    }
  }
]

const PatientCard = ({ patient, onViewReports, onViewHealth }) => {
  const date = new Date(patient.requested_at)
  const formattedDate = date.toLocaleString()

  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 relative">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mr-4 bg-blue-100 text-blue-600">
          {patient.user_info.email[0].toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Patient {patient.user_info.id}</h3>
          <p className="text-sm text-gray-600">{patient.user_info.email}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-4">Last Request: {formattedDate}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-green-600">Check Reports</span>
          <button
            onClick={() => onViewReports(patient.user_info.id)}
            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-green-600 transition-colors duration-300"
            aria-label="View Patient Reports"
          >
            <FileText size={20} />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-red-600">Check Wellbeing</span>
          <button
            onClick={() => onViewHealth(patient.user_info.id)}
            className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-red-600 transition-colors duration-300"
            aria-label="View Patient Health"
          >
            <Stethoscope size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export const Patients = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [viewMode, setViewMode] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const sortedPatients = useMemo(() => 
    [...patientData].sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at)),
    []
  )

  const filteredPatients = useMemo(() => 
    sortedPatients.filter(patient => 
      patient.user_info.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.user_info.id.toString().includes(searchTerm)
    ),
    [sortedPatients, searchTerm]
  )

  const handleViewReports = (patientId) => {
    setSelectedPatientId(patientId)
    setViewMode('reports')
  }

  const handleViewHealth = (patientId) => {
    setSelectedPatientId(patientId)
    setViewMode('health')
  }

  const handleBackToPatients = () => {
    setSelectedPatientId(null)
    setViewMode(null)
  }

  if (selectedPatientId) {
    if (viewMode === 'reports') {
      return <PatientReports patientId={selectedPatientId} onClose={handleBackToPatients} />
    } else if (viewMode === 'health') {
      return <PatientHealth patientId={selectedPatientId} onClose={handleBackToPatients} />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Patients</h1>
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search patients by email or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
      {filteredPatients.length === 0 ? (
        <p className="text-center text-gray-600">No patients found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient, index) => (
            <PatientCard 
              key={index} 
              patient={patient} 
              onViewReports={handleViewReports}
              onViewHealth={handleViewHealth}
            />
          ))}
        </div>
      )}
    </div>
  )
}