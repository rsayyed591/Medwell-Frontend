import React, { useState } from 'react'
import { Edit, X, User, Briefcase, MapPin, Phone, Mail, Camera } from 'lucide-react'

const initialDoctorInfo = {
  name: "Dr. Nishi Sir",
  specialization: "Engiologist",
  experience: "15 years",
  location: "India, IN",
  phone: "+91 9819191971",
  email: "nishi@gmail.com",
  profilePicture: './doctorpfp.png'
}

export function DoctorProfile() {
  const [doctorInfo, setDoctorInfo] = useState(initialDoctorInfo)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [tempProfilePicture, setTempProfilePicture] = useState(null)

  const handleEditSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const updatedInfo = Object.fromEntries(formData.entries())
    updatedInfo.profilePicture = tempProfilePicture || doctorInfo.profilePicture
    setDoctorInfo(updatedInfo)
    setIsEditModalOpen(false)
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempProfilePicture(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
            <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 overflow-hidden">
                {doctorInfo.profilePicture ? (
                  <img src={doctorInfo.profilePicture} alt={doctorInfo.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={48} />
                )}
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{doctorInfo.name}</h1>
                <p className="text-lg sm:text-xl text-gray-600">{doctorInfo.specialization}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-200 text-lg"
            >
              <Edit className="w-5 h-5 inline-block mr-2" />
              Edit Profile
            </button>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center">
              <Briefcase className="w-6 h-6 text-gray-500 mr-3" />
              <span className="text-lg">{doctorInfo.experience} experience</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-gray-500 mr-3" />
              <span className="text-lg">{doctorInfo.location}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-gray-500 mr-3" />
              <span className="text-lg">{doctorInfo.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-gray-500 mr-3" />
              <span className="text-lg">{doctorInfo.email}</span>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-8 h-8" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 overflow-hidden mb-4">
                    {tempProfilePicture || doctorInfo.profilePicture ? (
                      <img 
                        src={tempProfilePicture || doctorInfo.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={64} />
                    )}
                  </div>
                  <label htmlFor="profile-picture" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center text-base">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Picture
                  </label>
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={doctorInfo.name}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-base py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="specialization" className="block text-base font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    defaultValue={doctorInfo.specialization}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-base py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="experience" className="block text-base font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    defaultValue={doctorInfo.experience}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-base py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-base font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    defaultValue={doctorInfo.location}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-base py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-base font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={doctorInfo.phone}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-base py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={doctorInfo.email}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-base py-2 px-3"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4 sticky bottom-0 bg-white pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-base text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}