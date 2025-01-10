import React, { useState, useEffect, useMemo } from 'react'
import { useDocData } from './useDocData'
import { Copy, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'

const patientData = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Williams', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@brown.com' },
  { id: 4, name: 'David Lee', email: 'david@lee.com' },
  { id: 5, name: 'Eve Jackson', email: 'eve@example.com' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com' },
  { id: 7, name: 'Grace Wilson', email: 'grace@example.com' },
  { id: 8, name: 'Henry Davis', email: 'henry@example.com' },
  { id: 9, name: 'Ivy Rodriguez', email: 'ivy@example.com' },
  { id: 10, name: 'Jack Garcia', email: 'jack@example.com' },
]

const defaultHtmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medwell</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: {{body_background_color}};
        margin: 0;
        padding: 0;
        color: #333;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        background-color: #fff;
      }
      .header {
        background-color: #007bff;
        color: white;
        padding: 15px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .header p {
        margin: 5px 0 0;
        font-size: 14px;
        color: #e0e0e0;
      }
      .doctor-profile {
        margin-bottom: 20px;
        text-align: right;
      }
      .doctor-profile img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }
      .message-section {
        border: 1px dashed #ccc;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 5px;
      }
      .message-section h2 {
        color: #007bff;
        margin-top: 0;
      }
      .footer {
        background-color: #f1f1f1;
        padding: 15px;
        text-align: center;
        font-size: 12px;
        color: #6c757d;
        border-radius: 0 0 8px 8px;
      }
      .footer p {
        margin: 0;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Medwell</h1>
        <p>Enhancing Healthcare Communication</p>
      </div>
      <div class="doctor-profile">
        <img src="{{doctor_profile_pic}}" alt="Doctor Profile Picture">
      </div>
      <p>Dear Patient,</p>
      <p>Your doctor is excited to share personalized healthcare insights and services with you. Stay healthy and stay informed!</p>
      <div class="message-section">
        <h2>Doctor's Message:</h2>
        <div id="email-body">
          <!-- Email body content will go here -->
        </div>
      </div>
      <div class="footer">
        <p>This is an automated email from <strong>Medwell</strong>. Please do not reply.</p>
        <p>&copy; 2025 Medwell | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
      </div>
    </div>
  </body>
  </html>
`

export default function Marketing() {
  const { doctorInfo } = useDocData()
  const [selectedPatients, setSelectedPatients] = useState([])
  const [emailBody, setEmailBody] = useState('')
  const [subject, setSubject] = useState('')
  const [bodyBackgroundColor, setBodyBackgroundColor] = useState('#f0f9ff')
  const [emailBackgroundColor, setEmailBackgroundColor] = useState('white')
  const [htmlCode, setHtmlCode] = useState(defaultHtmlTemplate)
  const [showAiBox, setShowAiBox] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const navigate = useNavigate()

  const patientOptions = useMemo(() => patientData.map(patient => ({
    value: patient.id,
    label: patient.name
  })), [])

  useEffect(() => {
    const updatedHtml = defaultHtmlTemplate.replace(
      '<!-- Email body content will go here -->',
      emailBody
    )
      .replace('{{doctor_profile_pic}}', doctorInfo.profilePicture)
      .replace('{{body_background_color}}', bodyBackgroundColor)
      .replace('background-color: white', `background-color: ${emailBackgroundColor}`)
    setHtmlCode(updatedHtml)
  }, [emailBody, bodyBackgroundColor, emailBackgroundColor, doctorInfo.profilePicture])

  const handlePatientSelect = (selectedOptions) => {
    setSelectedPatients(selectedOptions.map(option => patientData.find(p => p.id === option.value)))
  }

  const handleBodyChange = (e) => {
    setEmailBody(e.target.value)
  }

  const handleSubjectChange = (e) => {
    setSubject(e.target.value)
  }

  const handleColorChange = (e) => {
    setBodyBackgroundColor(e.target.value)
  }

  const handleClear = () => {
    setSelectedPatients([])
    setEmailBody('')
    setSubject('')
    setBodyBackgroundColor('#f0f9ff')
    setEmailBackgroundColor('white')
  }

  const handleSubmit = async () => {
    if (!selectedPatients || selectedPatients.length === 0) {
      alert('Please select at least one patient.')
      return
    }
    console.log('Submitting email with:', {
      patients: selectedPatients.map(p => p.email),
      html: htmlCode,
      subject: subject
    })
    navigate('/doctor')
  }

  const handleGenerateWithAi = async () => {
    console.log('Generating email body with AI using prompt:', aiPrompt)
    setShowAiBox(false)
    setAiPrompt('')
    setEmailBody(`<!-- AI generated content will be inserted here -->`)
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 bg-gray-100 rounded-lg border border-gray-200">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Marketing</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Share Your Message</h2>
          <div className="mb-4 relative">
            <label htmlFor="patient" className="block text-sm font-medium text-gray-700">
              Patient Name:
            </label>
            <Select
              isMulti
              value={selectedPatients.map(patient => patientOptions.find(option => option.value === patient.id))}
              onChange={handlePatientSelect}
              options={patientOptions}
              className="mt-1"
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: '#9333ea',
                  ':hover': { borderColor: '#a855f7' }
                })
              }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700">
              Body:
            </label>
            <textarea
              id="body"
              value={emailBody}
              onChange={handleBodyChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <button
              onClick={() => setShowAiBox(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Generate with AI
            </button>
          </div>
          {showAiBox && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Generate with AI</h2>
                  <button onClick={() => setShowAiBox(false)} className="text-gray-500 hover:text-gray-700">
                    {/* <X className="w-5 h-5" /> */}
                    X
                  </button>
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  className="w-full p-2 border rounded-md mb-4"
                  rows={4}
                  placeholder="Enter prompt for AI..."
                />
                <button
                  onClick={handleGenerateWithAi}
                  className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Generate
                </button>
              </div>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={handleSubjectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="emailBackgroundColor" className="block text-sm font-medium text-gray-700">
              Email Background Color:
            </label>
            <input
              type="color"
              id="emailBackgroundColor"
              value={emailBackgroundColor}
              onChange={(e) => setEmailBackgroundColor(e.target.value)}
              className="mt-1 block w-full h-10 p-0 border-0 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bodyBackgroundColor" className="block text-sm font-medium text-gray-700">
              Body Background Color:
            </label>
            <input
              type="color"
              id="bodyBackgroundColor"
              value={bodyBackgroundColor}
              onChange={(e) => setBodyBackgroundColor(e.target.value)}
              className="mt-1 block w-full h-10 p-0 border-0 rounded-md shadow-sm"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full sm:w-auto mr-2"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <Mail className="w-4 h-4 mr-2" /> Submit
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">HTML</h2>
          <iframe
            srcDoc={htmlCode}
            title="Email Preview"
            className="w-full border-2 border-gray-200"
            style={{ height: '500px' }}
          />
          <button
            onClick={() => navigator.clipboard.writeText(htmlCode)}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <Copy className="w-4 h-4 mr-2" /> Copy HTML
          </button>
        </div>
      </div>
    </div>
  )
}

