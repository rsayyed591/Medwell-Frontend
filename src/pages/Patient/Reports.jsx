import React, { useState } from 'react'
import { ArrowLeft, FileText, AlertCircle, ExternalLink, X } from 'lucide-react'
import Modal from 'react-modal'

// Set the app element for accessibility
Modal.setAppElement('#root') // Adjust this if your app's root element has a different id

// Mock data for demonstration
const mockReports = [
  {
    id: 1,
    title: 'Annual Checkup',
    date: '28 Sept, 2024',
    collectionDate: '25 Sept, 2024',
    doctorName: 'Dr. Smith',
    summary: 'Overall health is good. Calcium levels are slightly elevated.',
    elements: {
      calcium: { max: 10.2, min: 8.5, unit: 'mg/dL', value: 10.5 },
      hemoglobin: { max: 17.5, min: 13.5, unit: 'g/dL', value: 14.5 },
      redBloodCells: { max: 5.9, min: 4.5, unit: 'million/µL', value: 5.2 },
      whiteBloodCells: { max: 11000, min: 4500, unit: '/µL', value: 7500 },
    },
    reportUrl: 'https://drive.google.com/file/d/1XvgQ7lpsXazqMiH7dRiRs4prRbyjTEy4/view?usp=sharing',
  },
  {
    id: 2,
    title: 'Lipid Panel',
    date: '15 Oct, 2024',
    collectionDate: '12 Oct, 2024',
    doctorName: 'Dr. Johnson',
    summary: 'Cholesterol levels are within normal range.',
    elements: {
      totalCholesterol: { max: 200, min: 125, unit: 'mg/dL', value: 180 },
      ldlCholesterol: { max: 130, min: 0, unit: 'mg/dL', value: 100 },
      hdlCholesterol: { max: 60, min: 40, unit: 'mg/dL', value: 50 },
      triglycerides: { max: 150, min: 0, unit: 'mg/dL', value: 120 },
    },
    reportUrl: 'https://drive.google.com/file/d/1XvgQ7lpsXazqMiH7dRiRs4prRbyjTEy4/view?usp=sharing',
  },
  {
    id: 3,
    title: "Nutrient Deficiency Panel",
    date: "15 Nov, 2024",
    collectionDate: "12 Nov, 2024",
    doctorName: "Dr. Kumar",
    summary: "Several nutrient levels are below the normal range, indicating deficiencies in calcium, iron, and vitamin D.",
    elements: {
      calcium: { max: 10.5, min: 8.5, unit: "mg/dL", value: 7.9 },
      iron: { max: 170, min: 60, unit: "µg/dL", value: 50 },
      vitaminD: { max: 100, min: 30, unit: "ng/mL", value: 20 },
      magnesium: { max: 2.6, min: 1.8, unit: "mg/dL", value: 1.6 }
    },
    reportUrl: 'https://drive.google.com/file/d/1XvgQ7lpsXazqMiH7dRiRs4prRbyjTEy4/view?usp=sharing',
  },  
]

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleReportClick = (report) => {
    setSelectedReport(report)
  }

  const handleBackClick = () => {
    setSelectedReport(null)
  }

  const handleViewReport = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const ReportCard = ({ report, onClick }) => (
    <div
      className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(report)}
    >
      <h3 className="text-xl font-semibold mb-3">{report.title}</h3>
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{report.title}</h2>
        <button
          onClick={handleViewReport}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Full Report
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
        {Object.entries(report.elements).map(([name, data]) => {
          const isInRange = data.value >= data.min && data.value <= data.max
          return (
            <div
              key={name}
              className={`p-4 rounded-lg ${isInRange ? 'bg-green-100' : 'bg-red-100'}`}
            >
              <h4 className="font-semibold mb-2 capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <p className="text-lg">
                {data.value} {data.unit}
              </p>
              <p className="text-sm text-gray-600">
                Range: {data.min} - {data.max} {data.unit}
              </p>
              {!isInRange && (
                <p className="text-sm text-red-600 mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Out of normal range
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedReport ? (
        <>
          <DetailedReport report={selectedReport} />
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="View Full Report"
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75"
          >
            <div className="bg-white rounded-lg w-11/12 h-5/6 max-w-4xl max-h-full flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-2xl font-bold">Full Report: {selectedReport.title}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-grow relative">
                <iframe
                  src={`${selectedReport.reportUrl.replace('/view', '/preview')}#view=FitH`}
                  title="Report PDF"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </Modal>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <FileText className="w-8 h-8 mr-2" />
            Your Reports
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReports.map((report) => (
              <ReportCard key={report.id} report={report} onClick={handleReportClick} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}