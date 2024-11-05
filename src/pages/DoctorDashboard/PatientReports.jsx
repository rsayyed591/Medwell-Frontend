import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, FileText, AlertCircle, ExternalLink, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import CombinedChat from "../Chatbots/CombinedChat"

const dummyResponse = [
  {
    "id": "92868a17-7196-446b-a3f5-2333afdc5cb6",
    "report_file": "/media/user_reports/327969412_4f6395f0-d59a-4db6-99ce-0a57a4e827e5_1_sGTCRd9.pdf",
    "report_type": "blood_report",
    "submitted_at": "2024-11-03",
    "date_of_collection": "14/2/2022",
    "doctor_name": "Dr. SELF",
    "date_of_report": "15/2/2022",
    "summary": "The patient's HbA1c result suggests that he is at risk for Diabetes (Prediabetes)/ well controlled Diabetes in a known Diabetic. The Apolipoprotein B level is within the normal range. The Vitamin D level is sufficient.",
    "reportdetail": {
      "report_data": {
        "pcv": { "max": 50, "min": 36, "unit": "%", "value": 47.2 },
        "iron": { "max": 170, "min": 60, "unit": "μg/dL", "value": -1 },
        "sodium": { "max": 145, "min": 135, "unit": "mmol/L", "value": 136.1 },
        "albumin": { "max": 5.0, "min": 3.5, "unit": "g/dL", "value": 4.62 },
        "calcium": { "max": 10.2, "min": 8.5, "unit": "mg/dL", "value": 10.0 },
        "chloride": { "max": 107, "min": 98, "unit": "mmol/L", "value": 101.3 },
        "globulin": { "max": 4.0, "min": 2.0, "unit": "g/dL", "value": -1 },
        "proteins": { "max": 8.0, "min": 6.0, "unit": "g/dL", "value": 7.84 },
        "potassium": { "max": 5.0, "min": 3.5, "unit": "mmol/L", "value": 4.58 },
        "rbc_count": { "max": 5.4, "min": 4.2, "unit": "million cells/μL", "value": 5.35 },
        "wbc_count": { "max": 11.0, "min": 4.5, "unit": "thousand cells/μL", "value": 7.34 },
        "blood_urea": { "max": 20, "min": 7, "unit": "mg/dL", "value": 27.1 },
        "hemoglobin": { "max": 15.5, "min": 12.1, "unit": "g/dL", "value": 15.0 },
        "phosphorus": { "max": 4.5, "min": 2.5, "unit": "mg/dL", "value": 3.83 },
        "lymphocytes": { "max": 45, "min": 20, "unit": "%", "value": 2.07 },
        "neutrophils": { "max": 75, "min": 40, "unit": "%", "value": 4.59 },
        "s_uric_acid": { "max": 7.2, "min": 3.5, "unit": "mg/dL", "value": 5.03 },
        "s_creatinine": { "max": 1.2, "min": 0.6, "unit": "mg/dL", "value": 0.77 },
        "s_phosphorus": { "max": 4.5, "min": 2.5, "unit": "mg/dL", "value": 3.83 },
        "fasting_sugar": { "max": 100, "min": 70, "unit": "mg/dL", "value": 91.0 },
        "platelet_count": { "max": 450000, "min": 150000, "unit": "cells/μL", "value": 159.0 },
        "sr_cholesterol": { "max": 200, "min": 0, "unit": "mg/dL", "value": -1 },
        "bilirubin_total": { "max": 1.2, "min": 0.1, "unit": "mg/dL", "value": 0.58 },
        "hdl_cholesterol": { "max": 60, "min": 40, "unit": "mg/dL", "value": -1 },
        "bilirubin_direct": { "max": 0.3, "min": 0.0, "unit": "mg/dL", "value": 0.16 },
        "after_lunch_sugar": { "max": 140, "min": 70, "unit": "mg/dL", "value": -1 },
        "bilirubin_indirect": { "max": 0.8, "min": 0.1, "unit": "mg/dL", "value": 0.42 },
        "blood_urea_nitrogen": { "max": 20, "min": 7, "unit": "mg/dL", "value": -1 }
      }
    }
  }
]

export default function PatientReports({onClose}) {
  const [selectedReport, setSelectedReport] = useState(null)
  const [reports, setReports] = useState(dummyResponse)

  const handleReportClick = useCallback((report) => {
    setSelectedReport(report)
  }, [])

  const handleBackClick = useCallback(() => {
    setSelectedReport(null)
  }, [])

  const handleViewReport = useCallback(() => {
    if (selectedReport && selectedReport.report_file) {
      window.open(selectedReport.report_file, '_blank')
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
    doc.text(`: ${report.report_type}`, valuesX, 51)
    doc.text("Age / Gender", detailsX, 57)
    doc.text(": Not Available", valuesX, 57)
    doc.text("Consulting Dr.", detailsX, 63)
    doc.text(`: ${report.doctor_name}`, valuesX, 63)
    doc.text("Reg. Location", detailsX, 69)
    doc.text(": Not Available", valuesX, 69)

    // Add collection and reporting dates at the right end
    const datesX = 140
    doc.text(`Collected : ${report.date_of_collection}`, datesX, 63)
    doc.text(`Reported  : ${report.date_of_report}`, datesX, 69)

    // Add horizontal line
    doc.line(20, 75, 190, 75)

    // Add report title
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(report.report_type, 20, 85)

    // Add summary
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const splitSummary = doc.splitTextToSize(report.summary, 170)
    doc.text(splitSummary, 20, 95)

    // Add detailed results
    const tableData = Object.entries(report.reportdetail.report_data).map(([name, data]) => {
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
    doc.save(`${report.report_type.replace(/\s+/g, '_')}_Report.pdf`)
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
      <h3 className="text-xl font-semibold mb-3">{report.report_type}</h3>
      <p className="text-sm text-gray-600">{report.date_of_report}</p>
    </motion.div>
  ), [])

  const DetailedReport = useCallback(({ report }) => {
    const sortedElements = Object.entries(report.reportdetail.report_data).sort(([, a], [, b]) => {
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
          <h2 className="text-2xl font-bold mb-2 sm:mb-0">{report.report_type}</h2>
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
            {report.report_file && (
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
            <p className="font-semibold">{report.date_of_report}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Collection Date</p>
            <p className="font-semibold">{report.date_of_collection}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Doctor</p>
            <p className="font-semibold">{report.doctor_name}</p>
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
      <button
        onClick={onClose}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
        aria-label="Back to All Patients"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to All Patients
      </button>
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
              {reports.map((report, index) => (
                <ReportCard key={report.id} report={report} onClick={handleReportClick} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CombinedChat />
    </div>
  )
}