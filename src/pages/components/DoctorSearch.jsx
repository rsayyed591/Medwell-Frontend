import { useState, useCallback } from 'react'
import { useMediaQuery } from 'react-responsive'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapPin, Search } from 'lucide-react'

const DoctorIcon = new L.Icon({
  iconUrl: '/logo.png',
  iconAnchor: [40, 60],
  popupAnchor: [0, -60],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  iconSize: [80, 100],
})

function MapUpdater({ center }) {
  const map = useMap()
  map.setView(center, 13)
  return null
}

export default function DoctorSearch() {
  const [loading, setLoading] = useState(false)
  const [doctors, setDoctors] = useState([])
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629])
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationOption, setLocationOption] = useState('') 
  const [selectedSpecialty, setSelectedSpecialty] = useState("No Specialty")

  const isMobile = useMediaQuery({ maxWidth: 767 })

  const districts = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ]

  const availableSpecialties = [
    "No Specialty",
    "General Physician",
    "Pediatrician",
    "Gynecologist",
    "Dermatologist",
    "Orthopedic Surgeon",
    "Cardiologist",
    "Neurologist"
  ]

  const searchNearbyDoctors = useCallback(async (lat, lon) => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        lat: lat,
        lon: lon,
        "km":10,
      }
      if (selectedSpecialty !== "No Specialty") {
        payload.specialty = selectedSpecialty
      }
      const response = await axios.post(`https://60c3-43-231-238-206.ngrok-free.app/get_nearby_doctor/`, payload)
      if (response.data && response.data.data) {
        setDoctors(response.data.data)
      } else {
        setDoctors([])
        setError('No doctors found in this location.')
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
      setError('Failed to fetch nearby doctors. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [selectedSpecialty])

  const handleNormalSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery) return
    
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`https://60c3-43-231-238-206.ngrok-free.app/search_doctors_and_hospitals/`, {
        query: searchQuery
      })
      if (response.data && response.data.data) {
        setDoctors(response.data.data)
        if (response.data.data.length > 0) {
          const firstDoctor = response.data.data[0].data
          setMapCenter([firstDoctor.location.lat, firstDoctor.location.lon])
        }
      } else {
        setDoctors([])
        setError('No doctors found matching your search.')
      }
    } catch (error) {
      console.error('Error searching doctors:', error)
      setError('Failed to search doctors. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSearch = async (e) => {
    e.preventDefault()
    if (locationOption === '') {
      setError('Please select a location to find nearby doctors.')
      return
    }

    if (locationOption === 'current') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter([latitude, longitude])
          searchNearbyDoctors(latitude, longitude)
        },
        (error) => {
          console.error('Error getting current location:', error)
          setError('Failed to get your current location. Please ensure location services are enabled.')
        }
      )
    } else {
      const dummyCoordinates = {
        'Mumbai': [19.0760, 72.8777],
        'Delhi': [28.6139, 77.2090],
        'Bangalore': [12.9716, 77.5946],
        'Hyderabad': [17.3850, 78.4867],
        'Chennai': [13.0827, 80.2707],
        'Kolkata': [22.5726, 88.3639],
        'Pune': [18.5204, 73.8567],
        'Ahmedabad': [23.0225, 72.5714],
        'Jaipur': [26.9124, 75.7873],
        'Lucknow': [26.8467, 80.9462]
      }

      const [latitude, longitude] = dummyCoordinates[locationOption] || [20.5937, 78.9629]
      setMapCenter([latitude, longitude])
      searchNearbyDoctors(latitude, longitude)
    }
  }

  return (
    <div className="min-h-screen bg-[#27428c]">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-white text-center mb-4">Your home for health</h1>
          <h2 className="text-2xl text-white text-center mb-8">Find Your Doctor</h2>

          <div className="grid gap-6">
            {/* Normal Search */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Search Doctors and Hospitals</h3>
              <form onSubmit={handleNormalSearch} className="flex gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <Search className="text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctors, clinics, hospitals, etc."
                    className="w-full p-2 focus:outline-none"
                  />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Search
                </button>
              </form>
            </div>

            {/* Location and Specialty Search */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Find Nearby Doctors</h3>
              <form onSubmit={handleLocationSearch} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex items-center gap-2">
                    <MapPin className="text-gray-400" />
                    <select
                      value={locationOption}
                      onChange={(e) => setLocationOption(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none"
                    >
                      <option value="">Select location</option>
                      <option value="current">Use current location</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
                    Find Nearby
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSpecialties.map((specialty) => (
                    <label key={specialty} className="inline-flex items-center">
                      <input
                        type="radio"
                        className="hidden"
                        name="specialty"
                        value={specialty}
                        checked={selectedSpecialty === specialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                      />
                      <span className={`px-3 py-1 rounded-full cursor-pointer text-sm ${
                        selectedSpecialty === specialty
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}>
                        {specialty}
                      </span>
                    </label>
                  ))}
                </div>
              </form>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="relative">
                {isMobile ? (
                  // Mobile view: Only show doctor cards
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Doctors</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="space-y-4 max-h-[calc(100vh-450px)] overflow-y-auto pr-4">
                      {doctors.map((doctor) => (
                        <div 
                          key={doctor.id} 
                          className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                          <h3 className="font-bold text-lg text-blue-600">{doctor.data.name}</h3>
                          <p className="text-gray-700">{doctor.data.speciality || 'General'}</p>
                          <p className="text-gray-600 text-sm mt-1">{doctor.data.address}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Desktop view: Show map and doctor cards side by side
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/2">
                      <div className="h-[calc(100vh-300px)] w-full rounded-lg overflow-hidden shadow-lg relative z-0">
                        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <MapUpdater center={mapCenter} />
                          {doctors.map((doctor) => (
                            <Marker 
                              key={doctor.id} 
                              position={[doctor.data.location.lat, doctor.data.location.lon]} 
                              icon={DoctorIcon}
                            />
                          ))}
                        </MapContainer>
                      </div>
                    </div>

                    <div className="lg:w-1/2">
                      <h2 className="text-2xl font-bold mb-4">Doctors</h2>
                      {error && <p className="text-red-500 mb-4">{error}</p>}
                      <div className="space-y-4 max-h-[calc(100vh-450px)] overflow-y-auto pr-4">
                        {doctors.map((doctor) => (
                          <div 
                            key={doctor.id} 
                            className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                          >
                            <h3 className="font-bold text-lg text-blue-600">{doctor.data.name}</h3>
                            <p className="text-gray-700">{doctor.data.speciality || 'General'}</p>
                            <p className="text-gray-600 text-sm mt-1">{doctor.data.address}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 bg-white bg-opacity-75">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

