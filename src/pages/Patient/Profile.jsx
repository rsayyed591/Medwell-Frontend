import React, { useState, useEffect } from 'react'
import { Edit, Heart, Clipboard, Calendar, MapPin, QrCode } from 'lucide-react'
import { removeBackground } from '@imgly/background-removal'
import { google_ngrok_url } from '../../utils/global'
import { useFetch } from '../components/useFetch'
export default function Profile({ patientInfo }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [profilePic, setProfilePic] = useState(google_ngrok_url+patientInfo?.profile_pic || '/Vivek.jpg')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [localPatientInfo, setLocalPatientInfo] = useState(patientInfo)
  const { savePatientInfo } = useFetch()
  useEffect(() => {
    setLocalPatientInfo(patientInfo)
  }, [patientInfo])

  useEffect(() => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`imedwell.vercel.app/dashboard/user=${localPatientInfo?.user}`)}`;
    setQrCodeUrl(qrUrl)
  }, [localPatientInfo?.user])

  useEffect(() => {
    const removeProfileBackground = async () => {
      if (profilePic && profilePic !== '/Vivek.jpg') {
        try {
          const result = await removeBackground(profilePic)
          setProfilePic(URL.createObjectURL(result))
        } catch (error) {
          console.error('Error removing background:', error)
        }
      }
    }
    removeProfileBackground()
  }, [profilePic])

  const safeJoin = (arr, separator = ', ') => {
    return Array.isArray(arr) ? arr.join(separator) : arr || ''
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLocalPatientInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePic(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Updated patient info:', localPatientInfo)
    await savePatientInfo(localPatientInfo)
    setIsEditMode(false)
  }

  const ProfileDisplay = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 mb-4">
            <img 
              src={profilePic}
              alt="Patient" 
              className="w-full h-full object-cover rounded-full"
            />
            <button
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
              onClick={() => setShowQR(true)}
            >
              <QrCode className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">{localPatientInfo?.name}</h2>
          <p className="text-gray-600 text-center mb-1">Email: {localPatientInfo?.user_info.email}</p>
          <p className="text-gray-600 text-center mb-1">{localPatientInfo?.phone_number}</p>
          <p className="text-gray-600 text-center mb-4">Age: {localPatientInfo?.age}</p>
          <button 
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            onClick={() => setIsEditMode(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            General
          </h3>
          <div className="space-y-2">
            <p><span className="font-semibold">Blood Group:</span> {localPatientInfo?.blood_group}</p>
            <p><span className="font-semibold">Height:</span> {localPatientInfo?.height}</p>
            <p><span className="font-semibold">Weight:</span> {localPatientInfo?.weight}</p>
            <p><span className="font-semibold">Allergies:</span> {safeJoin(localPatientInfo?.allergies)}</p>
            <p><span className="font-semibold">Aadhar Card:</span> {localPatientInfo?.aadhar_card}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Clipboard className="w-5 h-5 mr-2 text-blue-500" />
            Medical History
          </h3>
          <div className="space-y-2">
            <p><span className="font-semibold">Chronic Conditions:</span> {localPatientInfo?.chronic_condition}</p>
            <p><span className="font-semibold">Family History:</span> {localPatientInfo?.family_history}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-500" />
            Appointments
          </h3>
          <div className="space-y-2">
            <p><span className="font-semibold">Next Appointment:</span> Not scheduled</p>
            <p><span className="font-semibold">Date:</span> N/A</p>
            <p><span className="font-semibold">Doctor:</span> N/A</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-yellow-500" />
            Location
          </h3>
          <div className="space-y-2">
            <p><span className="font-semibold">City:</span> {localPatientInfo?.city}</p>
            <p><span className="font-semibold">State:</span> {localPatientInfo?.state}</p>
            <p><span className="font-semibold">Country:</span> {localPatientInfo?.country}</p>
            <p><span className="font-semibold">PIN:</span> {localPatientInfo?.pin}</p>
          </div>
        </div>
      </div>
    </div>
  )

  if (!localPatientInfo) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4 md:p-6">
      {isEditMode ? (
        <div className="fixed inset-0 bg-white overflow-y-auto z-50">
          <div className="max-w-3xl mx-auto py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-48 h-48 mb-4">
                    <img 
                      src={profilePic}
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                    <label htmlFor="profile_pic" className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 cursor-pointer">
                      <Edit className="h-4 w-4" />
                    </label>
                    <input
                      type="file"
                      id="profile_pic"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={localPatientInfo?.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="age">Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={localPatientInfo?.age || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={localPatientInfo?.user_info.email || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="phone_number">Phone Number</label>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={localPatientInfo?.phone_number || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="blood_group">Blood Group</label>
                    <input
                      type="text"
                      id="blood_group"
                      name="blood_group"
                      value={localPatientInfo?.blood_group || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="height">Height</label>
                    <input
                      type="text"
                      id="height"
                      name="height"
                      value={localPatientInfo?.height || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="weight">Weight</label>
                    <input
                      type="text"
                      id="weight"
                      name="weight"
                      value={localPatientInfo?.weight || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="allergies">Allergies</label>
                    <input
                      type="text"
                      id="allergies"
                      name="allergies"
                      value={safeJoin(localPatientInfo?.allergies)}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'allergies',
                          value: e.target.value.split(',').map(item => item.trim())
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="aadhar_card">Aadhar Card</label>
                    <input
                      type="text"
                      id="aadhar_card"
                      name="aadhar_card"
                      value={localPatientInfo?.aadhar_card || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-1" htmlFor="chronic_condition">Chronic Conditions</label>
                  <textarea
                    id="chronic_condition"
                    name="chronic_condition"
                    value={localPatientInfo?.chronic_condition || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-1" htmlFor="family_history">Family History</label>
                  <textarea
                    id="family_history"
                    name="family_history"
                    value={localPatientInfo?.family_history || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={localPatientInfo?.city || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={localPatientInfo?.state || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={localPatientInfo?.country || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="pin">PIN</label>
                    <input
                      type="text"
                      id="pin"
                      name="pin"
                      value={localPatientInfo?.pin || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setLocalPatientInfo(patientInfo);
                    setIsEditMode(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
          </div>
        </div>
      ) : (
        <ProfileDisplay />
      )}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
            <button
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => setShowQR(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}