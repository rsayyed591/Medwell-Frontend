import React, { useState } from 'react'
import { ArrowLeft, FileText } from 'lucide-react'

// Mock data for demonstration
const mockReports = [
  { id: 1, title: 'Annual Checkup', date: '28 Sept, 2024', collectionDate: '25 Sept, 2024', doctorName: 'Dr. Smith', summary: 'Overall health is good. Blood pressure is slightly elevated.', elements: [
    { name: 'Hemoglobin', value: '14.5 g/dL', status: 'normal' },
    { name: 'Red Blood Cells', value: '5.2 million/µL', status: 'normal' },
    { name: 'White Blood Cells', value: '7,500/µL', status: 'normal' },
    { name: 'Blood Pressure', value: '130/85 mmHg', status: 'elevated' },
  ]},
  { id: 2, title: 'Lipid Panel', date: '15 Oct, 2024', collectionDate: '12 Oct, 2024', doctorName: 'Dr. Johnson', summary: 'Cholesterol levels are within normal range.', elements: [
    { name: 'Total Cholesterol', value: '180 mg/dL', status: 'normal' },
    { name: 'LDL Cholesterol', value: '100 mg/dL', status: 'normal' },
    { name: 'HDL Cholesterol', value: '50 mg/dL', status: 'normal' },
    { name: 'Triglycerides', value: '150 mg/dL', status: 'normal' },
  ]},
  // Add more mock reports as needed
]

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null)

  const handleReportClick = (report) => {
    setSelectedReport(report)
  }

  const handleBackClick = () => {
    setSelectedReport(null)
  }

  const ReportCard = ({ report, onClick }) => (
    <div 
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(report)}
    >
      <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
      <p className="text-sm text-gray-600">{report.date}</p>
    </div>
  )

  const DetailedReport = ({ report }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <button 
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        onClick={handleBackClick}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Reports
      </button>
      <h2 className="text-2xl font-bold mb-4">{report.title}</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Report Date</p>
          <p className="font-semibold">{report.date}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Collection Date</p>
          <p className="font-semibold">{report.collectionDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Doctor</p>
          <p className="font-semibold">{report.doctorName}</p>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <p className="text-gray-700">{report.summary}</p>
      </div>
      <h3 className="text-lg font-semibold mb-4">Detailed Results</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {report.elements.map((element, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">{element.name}</h4>
            <p className="text-lg">{element.value}</p>
            <p className={`text-sm ${element.status === 'normal' ? 'text-green-600' : 'text-yellow-600'}`}>
              {element.status.charAt(0).toUpperCase() + element.status.slice(1)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedReport ? (
        <DetailedReport report={selectedReport} />
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <FileText className="w-8 h-8 mr-2" />
            Your Reports
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReports.map(report => (
              <ReportCard key={report.id} report={report} onClick={handleReportClick} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}