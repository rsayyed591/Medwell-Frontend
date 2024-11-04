import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, X, Send, Loader2, FileText } from 'lucide-react'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { google_ngrok_url } from '../../utils/global'
import Chat from "../Chatbots/Chat"

export default function AddReport() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [taskId, setTaskId] = useState(null)
  const [taskStatus, setTaskStatus] = useState(null)
  const fileInputRef = useRef(null)
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setPreviewUrl(null)
    setUploadStatus(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current.click()
  }

  const handleUpload = async () => {
    if (!uploadedFile) {
      setUploadStatus('No file selected')
      return
    }

    setIsUploading(true)
    setUploadStatus('Uploading...')

    const bearerToken = localStorage.getItem('Token')
    if (!bearerToken) {
      setUploadStatus('Authentication token not found')
      setIsUploading(false)
      return
    }

    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${bearerToken}`)

    const formdata = new FormData()
    formdata.append("report", uploadedFile)

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    }

    try {
      const response = await fetch(`${google_ngrok_url}/patient/send_report/`, requestOptions)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      console.log(result)
      setTaskId(result.task_id)
      setUploadStatus('Upload successful')
      checkTaskStatus(result.task_id)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const checkTaskStatus = (id) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${google_ngrok_url}/patient/get_report_task_status/?task_id=${id}`,
          {method:"GET",
          headers:new Headers({"ngrok-skip-browser-warning": true})})
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTaskStatus(data.status)
        if (data.status === 'SUCCESS') {
          clearInterval(intervalId)
        }
      } catch (e) {
        console.error('Error checking task status:', e)
        setTaskStatus('ERROR')
        clearInterval(intervalId)
      }
    }

    const intervalId = setInterval(checkStatus, 4000)
    return () => clearInterval(intervalId)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white min-h-screen"
    >
      <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Add Medical Report</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center transition-all duration-300 hover:border-blue-500 bg-white shadow-lg"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <FileText className="w-16 h-16 text-blue-500 mb-4" />
              <p className="text-lg mb-2 text-blue-800">Drag and drop your medical report here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleBrowseClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300 shadow-md"
              >
                Browse Files
              </motion.button>
            </label>
          </motion.div>
          <AnimatePresence>
            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-white p-4 rounded-lg flex items-center justify-between shadow-md"
              >
                <div className="flex items-center">
                  <File className="w-6 h-6 mr-2 text-blue-500" />
                  <span className="text-sm text-blue-800">{uploadedFile.name}</span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-600 transition-colors duration-300"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          {uploadedFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpload}
                disabled={isUploading}
                className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center shadow-md ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Send className="w-5 h-5 mr-2" />
                {isUploading ? 'Uploading...' : 'Send Report'}
              </motion.button>
            </motion.div>
          )}
          {uploadStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 p-3 rounded-lg text-center shadow-md ${
                uploadStatus === 'Upload successful' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {uploadStatus}
            </motion.div>
          )}
          {taskId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-3 rounded-lg text-center bg-blue-100 text-blue-800 shadow-md"
            >
              {taskStatus === 'SUCCESS' ? (
                <div className="text-green-600 font-semibold">Task completed successfully!</div>
              ) : taskStatus === 'ERROR' ? (
                <div className="text-red-600 font-semibold">An error occurred while processing the task</div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-blue-700">Processing report...</span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2"
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Uploaded Report Preview</h2>
          <AnimatePresence>
            {previewUrl ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="border rounded-lg overflow-hidden bg-white shadow-lg"
              >
                {uploadedFile && uploadedFile.type.startsWith('image/') ? (
                  <img src={previewUrl} alt="Uploaded report" className="w-full h-auto" />
                ) : uploadedFile && uploadedFile.type === 'application/pdf' ? (
                  <div className="h-[600px]">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={previewUrl}
                        plugins={[defaultLayoutPluginInstance]}
                      />
                    </Worker>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Unsupported file type
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="no-preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border rounded-lg p-8 text-center text-gray-500 bg-white shadow-lg"
              >
                No report uploaded yet
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <div className="mt-8">
        <Chat />
      </div>
    </motion.div>
  )
}