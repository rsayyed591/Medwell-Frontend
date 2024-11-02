import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, FileText, AlertCircle, ExternalLink, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import CombinedChat from "../Chatbots/CombinedChat"
export default function Reports({ reports }) {
  const [selectedReport, setSelectedReport] = useState(null)

  const handleReportClick = useCallback((report) => {
    setSelectedReport(report)
  }, [])

  const handleBackClick = useCallback(() => {
    setSelectedReport(null)
  }, [])

  const handleViewReport = useCallback(() => {
    if (selectedReport && selectedReport.reportUrl) {
      window.open(selectedReport.reportUrl, '_blank')
    }
  }, [selectedReport])

  const handleDownloadPDF = useCallback((report) => {
    const doc = new jsPDF()

    // Add border
    doc.rect(5, 5, 200, 287)

    // Add logo and quote
    doc.setFontSize(28)
    doc.setTextColor(128, 0, 128) // Purple color
    doc.text("MEDWELL", 20, 25)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100) // Gray color
    doc.text("Empowering Health Through Innovation", 20, 32)

    // Add decorative line under the quote
    doc.setDrawColor(128, 0, 128) // Purple color
    doc.line(20, 35, 100, 35)

    // Add report title vertically
    doc.setFontSize(16)
    doc.setTextColor(128, 0, 128) // Purple color
    doc.text("R E P O R T", 200, 40, null, 90)

    // Add patient details with improved alignment
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const detailsX = 20
    const valuesX = 50
    doc.text("CID", detailsX, 45)
    doc.text(`: ${report.id}`, valuesX, 45)
    doc.text("Name", detailsX, 51)
    doc.text(`: ${report.title}`, valuesX, 51)
    doc.text("Age / Gender", detailsX, 57)
    doc.text(": Not Available", valuesX, 57)
    doc.text("Consulting Dr.", detailsX, 63)
    doc.text(`: ${report.doctorName}`, valuesX, 63)
    doc.text("Reg. Location", detailsX, 69)
    doc.text(": Not Available", valuesX, 69)

    // Add collection and reporting dates at the right end
    const datesX = 140
    doc.text(`Collected : ${report.collectionDate}`, datesX, 63)
    doc.text(`Reported  : ${report.date}`, datesX, 69)

    // Add horizontal line
    doc.line(20, 75, 190, 75)

    // Add report title
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(report.title, 20, 85)

    // Add summary
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const splitSummary = doc.splitTextToSize(report.summary, 170)
    doc.text(splitSummary, 20, 95)

    // Add detailed results
    const tableData = Object.entries(report.elements).map(([name, data]) => {
      const isInRange = data.value >= data.min && data.value <= data.max
      return [
        name.replace(/([A-Z])/g, ' $1').trim(),
        `${data.value} ${data.unit}`,
        `${data.min} - ${data.max} ${data.unit}`,
        { content: isInRange ? 'In Range' : 'Out of Range', styles: { fillColor: isInRange ? [220, 252, 231] : [254, 226, 226], textColor: isInRange ? [22, 101, 52] : [185, 28, 28] } }
      ]
    })

    doc.autoTable({
      startY: 105,
      head: [['Test', 'Value', 'Normal Range', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [128, 0, 128], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { cellPadding: 5, fontSize: 8 }
    })

    // Add footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
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

  const DetailedReport = useCallback(({ report }) => {
    const sortedElements = Object.entries(report.elements).sort(([, a], [, b]) => {
      if (a.value === -1 && b.value !== -1) return 1;
      if (a.value !== -1 && b.value === -1) return -1;
      return 0;
    });

    return (
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
            {report.reportUrl && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewReport}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center justify-center transition-colors duration-300 text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Report
              </motion.button>
            )}
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
          {sortedElements.map(([name, data]) => {
            const isValuePresent = data.value !== -1;
            const isInRange = isValuePresent && data.value >= data.min && data.value <= data.max;
            return (
              <motion.div
                key={name}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 10
                    }
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-lg ${
                  isValuePresent
                    ? isInRange
                      ? 'bg-green-100'
                      : 'bg-red-100'
                    : 'bg-gray-100'
                } cursor-pointer`}
              >
                <h4 className="font-semibold mb-2 capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</h4>
                {isValuePresent ? (
                  <>
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
                  </>
                ) : (
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Values not present
                  </p>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    )
  }, [handleBackClick, handleViewReport, handleDownloadPDF])

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
              {reports.map((report, index) => (
                <ReportCard key={report.id} report={report} onClick={handleReportClick} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CombinedChat/>
    </div>
  )
}