import React, { useState } from 'react'
import { Building, Mail, Phone, MapPin, Edit, X, Check } from 'lucide-react'

const hospitalData = {
  name: "MedWell General Hospital",
  email: "info@medwell.com",
  phone: "+1 (555) 123-4567",
  address: "123 Health Avenue, Wellness City, MC 12345",
  description: "MedWell General Hospital is a state-of-the-art medical facility committed to providing exceptional healthcare services to our community. With a team of highly skilled professionals and cutting-edge technology, we strive to deliver compassionate care and promote overall well-being.",
  specializations: [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Oncology"
  ],
  departments: [
    "Emergency",
    "Surgery",
    "Intensive Care",
    "Radiology",
    "Laboratory"
  ]
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(hospitalData)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    console.log("Saving data:", editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData(hospitalData)
    setIsEditing(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 flex flex-col gap-4 p-4 md:gap-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white bg-opacity-90 p-4 rounded-lg shadow-md">
          <h1 className="text-xl sm:text-2xl font-bold text-green-800 mb-2 sm:mb-0">Hospital Profile</h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <Edit className="h-4 w-4" /> Edit Profile
            </button>
          )}
        </div>

        <div className="bg-white bg-opacity-90 p-4 sm:p-6 rounded-lg shadow-md">
          {isEditing ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hospital Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2 text-base"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2 text-base"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={editedData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2 text-base"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={editedData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2 text-base"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={editedData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2 text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors w-full sm:w-auto"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors w-full sm:w-auto"
                >
                  <Check className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-green-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{hospitalData.name}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{hospitalData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{hospitalData.phone}</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">{hospitalData.address}</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">About Us</h3>
                <p className="text-sm text-gray-600">{hospitalData.description}</p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {hospitalData.specializations.map((spec, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Departments</h3>
                <div className="flex flex-wrap gap-2">
                  {hospitalData.departments.map((dept, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}