import React, { useState } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { google_ngrok_url } from '../../utils/global'

const DoctorIcon = new L.Icon({
  iconUrl: 'modiji.svg',
  iconAnchor: [44, 60],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  iconSize: [80, 100],
});

const dummyDoctors = [
  { name: "Dr. Sanika", specialty: "General Physician", address: "123 MG Road, Bangalore, Karnataka", latitude: 12.9716, longitude: 77.5946 },
  { name: "Dr. Nishikant", specialty: "Pediatrician", address: "456 Anna Salai, Chennai, Tamil Nadu", latitude: 13.0827, longitude: 80.2707 },
  { name: "Mc. Rohit Seshmukh", specialty: "Church priest", address: "789 SV Road, Mumbai, Maharashtra", latitude: 19.0760, longitude: 72.8777 },
  { name: "Dr. Rehan 👁️sha", specialty: "Gynecologist", address: "101 Camac Street, Kolkata, West Bengal", latitude: 22.5726, longitude: 88.3639 },
  { name: "Dr. Vivek Backender", specialty: "Orthopedic Surgeon", address: "202 Banjara Hills, Hyderabad, Telangana", latitude: 17.4126, longitude: 78.4387 },
]

export default function DoctorSearch() {
  const [loading, setLoading] = useState(false)
  const [doctors, setDoctors] = useState(dummyDoctors)
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]) // Default to center of India
  const [buttonClicked, setButtonClicked] = useState(false)

  const searchNearbyDoctors = async () => {
    setLoading(true)
    setButtonClicked(true)
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords
        setMapCenter([latitude, longitude])
        try {
          const response = await axios.post(google_ngrok_url+'/search_doctors', {
            latitude,
            longitude
          })

          if (response.data && response.data.length > 0) {
            setDoctors(response.data)
          }
        } catch (error) {
          console.error('Error fetching doctors:', error)
        }
      }, (error) => {
        console.error('Error getting location:', error)
      })
    } catch (error) {
      console.error('Error searching for doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center mb-8">
        <button 
          className={`w-64 py-4 px-6 text-white font-semibold rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out transform hover:scale-105 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }`}
          onClick={searchNearbyDoctors}
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center text-lg">
              <span className="mr-2">🔍</span>
              Find Nearby Doctors
            </div>
          )}
        </button>
      </div>

      <div className={`mt-8 flex flex-col lg:flex-row gap-8 ${!buttonClicked ? 'filter blur-md' : ''}`}>
        <div className="lg:w-1/2">
          <div className="h-[calc(100vh-200px)] w-full rounded-lg overflow-hidden shadow-lg">
            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {doctors.map((doctor, index) => (
                <Marker 
                  key={index} 
                  position={[doctor.latitude, doctor.longitude]} 
                  icon={DoctorIcon}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      <p className="text-sm">{doctor.address}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Nearby Doctors</h2>
          <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-4">
            {doctors.map((doctor, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-bold text-lg text-blue-600">{doctor.name}</h3>
                <p className="text-gray-700">{doctor.specialty}</p>
                <p className="text-gray-600 text-sm mt-1">{doctor.address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!buttonClicked && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <p className="text-2xl font-bold text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg">
            Click "Find Nearby Doctors" to see results
          </p>
        </div>
      )}
    </div>
  )
}

