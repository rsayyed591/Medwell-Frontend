import React, { useState, useRef } from 'react'
import { Upload, File, X } from 'lucide-react'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

export default function AddReport() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add Report</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
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
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg mb-2">Drag and drop your report here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <button 
                type="button"
                onClick={handleBrowseClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                Browse Files
              </button>
            </label>
          </div>
          {uploadedFile && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <File className="w-6 h-6 mr-2 text-blue-500" />
                <span className="text-sm">{uploadedFile.name}</span>
              </div>
              <button 
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Uploaded Report</h2>
          {previewUrl ? (
            <div className="border rounded-lg overflow-hidden">
              {uploadedFile.type.startsWith('image/') ? (
                <img src={previewUrl} alt="Uploaded report" className="w-full h-auto" />
              ) : uploadedFile.type === 'application/pdf' ? (
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
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center text-gray-500">
              No report uploaded yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
