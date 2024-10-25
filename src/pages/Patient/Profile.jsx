import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit, X, Heart, Clipboard, Calendar, Bell } from 'lucide-react'
import Patient from './../../../public/Vivek.jpg'
import Appointments from './Appointments'

export default function Profile({ patientInfo, handleInputChange, handleSave }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [nextAppointment, setNextAppointment] = useState(null)

  useEffect(() => {
    // This is a placeholder for fetching the next appointment
    // In a real application, you would fetch this data from your backend or state management system
    const upcomingAppointment = {
      title: 'Annual Checkup',
      start: new Date(2024, 9, 15, 10, 0),
      doctor: 'Dr. Nishikant'
    }
    setNextAppointment(upcomingAppointment)
  }, [])

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-1 bg-white rounded-lg shadow-lg p-6"
        >
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-inner"></div>
            <img 
              src={Patient} 
              alt="Patient" 
              className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-full border-4 border-white shadow-lg"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">{patientInfo.name}</h2>
          <p className="text-gray-600 mb-1 text-center">Patient ID: {patientInfo.id}</p>
          <p className="text-gray-600 mb-1 text-center">{patientInfo.phone}</p>
          <p className="text-gray-600 mb-4 text-center">{patientInfo.email}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleEditMode}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Profile
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Heart className="w-6 h-6 mr-2 text-red-500" />
              Health Information
            </h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Blood Type:</span> {patientInfo.bloodType}</p>
              <p><span className="font-semibold">Height:</span> {patientInfo.height}</p>
              <p><span className="font-semibold">Weight:</span> {patientInfo.weight}</p>
              <p><span className="font-semibold">Allergies:</span> {patientInfo.allergies}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Clipboard className="w-6 h-6 mr-2 text-blue-500" />
              Medical History
            </h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Chronic Conditions:</span> {patientInfo.chronicConditions}</p>
              <p><span className="font-semibold">Past Surgeries:</span> {patientInfo.pastSurgeries}</p>
              <p><span className="font-semibold">Family History:</span> {patientInfo.familyHistory}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-green-500" />
              Appointments
            </h3>
            <div className="space-y-2">
              {nextAppointment ? (
                <>
                  <p><span className="font-semibold">Next Appointment:</span> {nextAppointment.title}</p>
                  <p><span className="font-semibold">Date:</span> {new Date(nextAppointment.start).toLocaleString()}</p>
                  <p><span className="font-semibold">Doctor:</span> {nextAppointment.doctor}</p>
                </>
              ) : (
                <p>No upcoming appointments</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Bell className="w-6 h-6 mr-2 text-yellow-500" />
              Notifications
            </h3>
            <div className="space-y-2">
              <p><span className="font-semibold">SMS Alerts:</span> <i>Coming soon</i></p>
              <p><span className="font-semibold">Email Notifications:</span> <i>Coming soon</i></p>
              <p><span className="font-semibold">Reminder Preference:</span> <i>Coming soon</i></p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                <button onClick={toggleEditMode} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">General Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={patientInfo.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="age">Age</label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={patientInfo.age}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={patientInfo.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={patientInfo.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">Health Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="bloodType">Blood Type</label>
                      <input
                        type="text"
                        id="bloodType"
                        name="bloodType"
                        value={patientInfo.bloodType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="height">Height</label>
                      <input
                        type="text"
                        id="height"
                        name="height"
                        value={patientInfo.height}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="weight">Weight</label>
                      <input
                        type="text"
                        id="weight"
                        name="weight"
                        value={patientInfo.weight}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="allergies">Allergies</label>
                      <input
                        type="text"
                        id="allergies"
                        name="allergies"
                        
                        value={patientInfo.allergies}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">Medical History</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="chronicConditions">Chronic Conditions</label>
                      <textarea
                        id="chronicConditions"
                        name="chronicConditions"
                        value={patientInfo.chronicConditions}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="pastSurgeries">Past Surgeries</label>
                      <textarea
                        id="pastSurgeries"
                        name="pastSurgeries"
                        value={patientInfo.pastSurgeries}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="familyHistory">Family History</label>
                      <textarea
                        id="familyHistory"
                        name="familyHistory"
                        value={patientInfo.familyHistory}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleSave()
                    toggleEditMode()
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}