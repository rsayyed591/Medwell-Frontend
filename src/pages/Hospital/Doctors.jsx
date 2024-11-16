import React, { useState } from 'react'
import { User, Edit, Trash2, Plus, X } from 'lucide-react'

// Mock JSON data for doctors
const initialDoctorsData = [
  { id: 1, name: "Dr. Rehan Sayyed", specialty: "Cardiology", experience: "15 years", image: "/hospital/pfp1.jpg" },
  { id: 2, name: "Dr. Nishikant Raut", specialty: "Pediatrics", experience: "10 years", image: "/hospital/pfp2.jpg" },
  { id: 3, name: "Dr. Vivek Chouhan", specialty: "Neurology", experience: "20 years", image: "/hospital/pfp3.jpg" },
  { id: 4, name: "Dr. Rohit Seshmukh", specialty: "Orthopedics", experience: "12 years", image: "/hospital/pfp4.jpg" },
  { id: 5, name: "Dr. Rohit Deshmukh", specialty: "Dermatology", experience: "8 years", image: "/hospital/pfp5.jpg" },
]

export default function Doctors() {
  const [doctors, setDoctors] = useState(initialDoctorsData)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', experience: '' })

  const handleAddDoctor = () => {
    setDoctors([...doctors, { ...newDoctor, id: doctors.length + 1, image: "/hospital/default-doctor.jpg" }])
    setNewDoctor({ name: '', specialty: '', experience: '' })
    setIsAdding(false)
  }

  const handleUpdateDoctor = () => {
    setDoctors(doctors.map(doc => doc.id === selectedDoctor.id ? selectedDoctor : doc))
    setSelectedDoctor(null)
  }

  const handleDeleteDoctor = (id) => {
    setDoctors(doctors.filter(doc => doc.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{
          backgroundImage: "url('/hospital/bg4.jpg')",
          filter: "brightness(0.7)"
        }}
      ></div>
      <div className="relative z-10 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Doctors Management</h1>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Doctors List</h2>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Doctor
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white bg-opacity-80 p-4 rounded-md shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-2">
                  <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                  <div>
                    <h3 className="font-semibold text-black">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-900 mb-2">Experience: {doctor.experience}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isAdding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">Add New Doctor</h2>
                <button onClick={() => setIsAdding(false)} className="text-gray-600 hover:text-gray-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                  className="w-full p-2 bg-gray-100 text-gray-600 placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                  type="text"
                  placeholder="Specialty"
                  value={newDoctor.specialty}
                  onChange={(e) => setNewDoctor({...newDoctor, specialty: e.target.value})}
                  className="w-full p-2 bg-gray-100 text-gray-600 placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                  type="text"
                  placeholder="Experience"
                  value={newDoctor.experience}
                  onChange={(e) => setNewDoctor({...newDoctor, experience: e.target.value})}
                  className="w-full p-2 bg-gray-100 text-gray-600 placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAddDoctor}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
                >
                  Add Doctor
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">Edit Doctor</h2>
                <button onClick={() => setSelectedDoctor(null)} className="text-green-200 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={selectedDoctor.name}
                  onChange={(e) => setSelectedDoctor({...selectedDoctor, name: e.target.value})}
                  className="w-full p-2 bg-gray-100 text-gray-600 placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                  type="text"
                  value={selectedDoctor.specialty}
                  onChange={(e) => setSelectedDoctor({...selectedDoctor, specialty: e.target.value})}
                  className="w-full p-2 bg-gray-100 text-gray-600 placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                  type="text"
                  value={selectedDoctor.experience}
                  onChange={(e) => setSelectedDoctor({...selectedDoctor, experience: e.target.value})}
                  className="w-full p-2 bg-gray-100 text-gray-600 placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleUpdateDoctor}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
                >
                  Update Doctor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}