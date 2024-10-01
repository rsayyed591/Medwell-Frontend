import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, FileText, AlertCircle, ExternalLink, X, Download } from 'lucide-react'
import Modal from 'react-modal'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Set the app element for accessibility
Modal.setAppElement('#root') // Adjust this if your app's root element has a different id

// Mock data for demonstration (same as before)
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

  const handleReportClick = useCallback((report) => {
    setSelectedReport(report)
  }, [])

  const handleBackClick = useCallback(() => {
    setSelectedReport(null)
  }, [])

  const handleViewReport = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleDownloadPDF = useCallback((report) => {
    const doc = new jsPDF()

    // Set custom fonts
    doc.setFont("helvetica", "bold")

    // Add title
    doc.setFontSize(24)
    doc.setTextColor(66, 135, 245)
    doc.text(report.title, 20, 20)

    // Add report details
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Date: ${report.date}`, 20, 35)
    doc.text(`Collection Date: ${report.collectionDate}`, 20, 42)
    doc.text(`Doctor: ${report.doctorName}`, 20, 49)

    // Add summary
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text('Summary', 20, 60)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    const splitSummary = doc.splitTextToSize(report.summary, 170)
    doc.text(splitSummary, 20, 70)

    // Add detailed results
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text('Detailed Results', 20, 90)

    const tableData = Object.entries(report.elements).map(([name, data]) => [
      name.replace(/([A-Z])/g, ' $1').trim(),
      `${data.value} ${data.unit}`,
      `${data.min} - ${data.max} ${data.unit}`,
      data.value >= data.min && data.value <= data.max ? 'In Range' : 'Out of Range'
    ])

    doc.autoTable({
      startY: 100,
      head: [['Test', 'Value', 'Normal Range', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [66, 135, 245], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      styles: { cellPadding: 5, fontSize: 10 }
    })

    // Add footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.setTextColor(150)
      doc.text('MedWell AI © 2024 | Empowering Health Through Innovation', 20, doc.internal.pageSize.height - 10)
    }

    // Save the PDF
    doc.save(`${report.title.replace(/\s+/g, '_')}_Report.pdf`)
  }, [])

  const ReportCard = useCallback(({ report, onClick, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
      onClick={() => onClick(report)}
    >
      <h3 className="text-xl font-semibold mb-3">{report.title}</h3>
      <p className="text-sm text-gray-600">{report.date}</p>
    </motion.div>
  ), [])

  const DetailedReport = useCallback(({ report }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
        onClick={handleBackClick}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Reports
      </motion.button>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-2xl font-bold mb-2 sm:mb-0">{report.title}</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownloadPDF(report)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded flex items-center justify-center transition-colors duration-300 text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewReport}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center justify-center transition-colors duration-300 text-sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Full Report
          </motion.button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {Object.entries(report.elements).map(([name, data]) => {
          const isInRange = data.value >= data.min && data.value <= data.max
          return (
            <motion.div
              key={name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
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
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  ), [handleBackClick, handleViewReport, handleDownloadPDF])

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {selectedReport ? (
          <motion.div
            key="detailed-report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DetailedReport report={selectedReport} />
          </motion.div>
        ) : (
          <motion.div
            key="report-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-6 flex items-center">
              <FileText className="w-8 h-8 mr-2" />
              Your Reports
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockReports.map((report, index) => (
                <ReportCard key={report.id} report={report} onClick={handleReportClick} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="View Full Report"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg w-11/12 h-5/6 max-w-4xl max-h-full flex flex-col"
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold">Full Report: {selectedReport?.title}</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
          <div className="flex-grow relative">
            <object
              data={selectedReport?.reportUrl.replace('/view', '/preview')}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <p>Unable to display PDF file. <a href={selectedReport?.reportUrl} target="_blank" rel="noopener noreferrer">Download</a> instead.</p>
            </object>
          </div>
        </motion.div>
      </Modal>
    </div>
  )
}