import React, { useState, useRef, useEffect } from 'react'
import { MapPin, Mail, Phone, Star, Edit2, Facebook, Instagram, Twitter, Linkedin, MessageCircle, PhoneCall, Camera, PlusCircle, X } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-routing-machine'
import { useDocData } from './useDocData'
import { google_ngrok_url, ngrok_url } from '../../utils/global'

delete L.Icon.Default.prototype._getIconUrl;


const initialDoctorInfo = {
  name: "",
  specialization: "",
  addresses: [],
  email: "",
  phone: "",
  profilePicture: './doctorpfp(female).png',
  rating: 5,
  services: [
    { name: "Consultation", price: "Rs. 550" },
    { name: "Follow-up", price: "Rs. 460" },
    { name: "Emergency Visit", price: "Rs. 1000" }
  ],
  shortBio: "",
  additionalComments: "",
  registrationNumber: '',
  verified: false,
  submittedAt: ''
}

export function DoctorProfile() {
  const {
    doctorInfo,
    addresses,
    loading,
    addressesLoading,
    addNewAddress,
    updateDoctorInfo,
    uploadMultimedia,
  } = useDocData();

  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [tempImage, setTempImage] = useState(null)
  const [newAddress, setNewAddress] = useState('')
  const [newAddressType, setNewAddressType] = useState('work')
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const mapRef = useRef(null)
  const routingControlRef = useRef(null)
  const [files, setFiles] = useState({
    profile: null,
    registration: null,
    aadhar: null,
    passport: null
  });

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (isMapModalOpen && selectedLocation) {
      initializeMap()
    }
  }, [isMapModalOpen, selectedLocation])


  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempImage(reader.result)
        console.log("Profile picture updated:", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileChange = (type, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      if (activeTab === 'personal') {
        const updatedInfo = Object.fromEntries(formData.entries());
        console.log("Updating doctor info:", updatedInfo);
        await updateDoctorInfo({
          name: updatedInfo.name,
          email: updatedInfo.email,
          phone_number: updatedInfo.phone,
          specialty: updatedInfo.specialization,
          registeration_number: updatedInfo.registrationNumber,
        });
      }
      
      if (activeTab === 'multimedia' && (files.profile || files.registration || files.aadhar || files.passport)) {
        console.log("Uploading multimedia files:", files);
        await uploadMultimedia(files);
      }
      
      setIsEditing(false);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error('Error updating doctor info:', error);
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location)
    setIsMapModalOpen(true)
  }

  const initializeMap = () => {
    if (!mapRef.current || !selectedLocation) return;

    const map = L.map(mapRef.current).setView([parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const doctorMarker = L.marker([parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)]).addTo(map);
    doctorMarker.bindPopup("Doctor's Location").openPopup();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userMarker = L.marker([latitude, longitude]).addTo(map);
          userMarker.bindPopup("Your Location").openPopup();

          if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
          }

          routingControlRef.current = L.Routing.control({
            waypoints: [
              L.latLng(latitude, longitude),
              L.latLng(parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon))
            ],
            routeWhileDragging: true,
            lineOptions: {
              styles: [{ color: '#6366F1', weight: 4 }]
            },
            show: false,
            addWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false
          }).addTo(map);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };

  const renderEditForm = () => {
    switch(activeTab) {
      case 'address':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter full address"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newAddressType}
                onChange={(e) => setNewAddressType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="work">Work</option>
                <option value="home">Home</option>
              </select>
              <button
                type="button"
                onClick={() => addNewAddress(newAddress, newAddressType)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>
            {addressesLoading ? (
              <div className="text-center py-4">Loading addresses...</div>
            ) : (
              addresses.map((addr, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="flex-grow px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {addr.address}
                  </span>
                  <span className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 capitalize">
                    {addr.address_type}
                  </span>
                </div>
              ))
            )}
          </div>
        )
      case 'personal':
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={doctorInfo.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={doctorInfo.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                defaultValue={doctorInfo.phone}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                defaultValue={doctorInfo.registrationNumber}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Specialization</label>
              <input
                type="text"
                name="specialization"
                defaultValue={doctorInfo.specialization}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Services</label>
              {(doctorInfo.services || []).map((service, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <input
                    type="text"
                    name={`service-${index}`}
                    defaultValue={service.name}
                    placeholder="Service name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name={`price-${index}`}
                    defaultValue={service.price}
                    placeholder="Price"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">
                Short Bio (Optional)
              </label>
              <textarea
                name="shortBio"
                defaultValue={doctorInfo.shortBio}
                rows={4}
                placeholder="Enter your bio or leave empty for auto-generated bio"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )
      case 'multimedia':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-2">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={tempImage || doctorInfo.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                    <Camera className="w-4 h-4 inline mr-2" />
                    Change Picture
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-600 mb-2">Registration Card</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PlusCircle className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Upload registration card</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('registration', e)}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-600 mb-2">Aadhar Card</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PlusCircle className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Upload Aadhar card</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('aadhar', e)}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-600 mb-2">Passport Size Photo</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PlusCircle className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Upload passport photo</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('passport', e)}
                  />
                </label>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-blue-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 md:p-8">
      {!isEditing ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
            {/* Left: Doctor Info */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={ngrok_url+doctorInfo.profilePicture}
                  alt={"Dr. "+doctorInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-semibold">{"Dr. "+doctorInfo.name}</h1>
                <p className="text-gray-500 text-sm">{doctorInfo.specialization}</p>
                {doctorInfo.verified && (
                  <p className="text-green-500 text-sm">Verified</p>
                )}
                <p className="text-gray-500 text-sm">Registration Number: {doctorInfo.registrationNumber}</p>
                <p className="text-gray-500 text-sm">Submitted At: {new Date(doctorInfo.submittedAt).toLocaleString()}</p>
                <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{doctorInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{doctorInfo.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Social Media and Edit */}
            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                <Edit2 className="w-4 h-4 inline mr-2" />
                Edit Profile
              </button>
              <div className="flex gap-2 mt-2">
                <h3 className="text-sm font-medium mr-2">Social Media</h3>
                <div className="flex gap-2">
                  {[
                    { Icon: Facebook, href: "#", color: "text-blue-600" },
                    { Icon: Instagram, href: "#", color: "text-pink-600" },
                    { Icon: Twitter, href: "#", color: "text-blue-400" },
                    { Icon: MessageCircle, href: "#", color: "text-blue-500" },
                    { Icon: PhoneCall, href: "#", color: "text-green-500" },
                    { Icon: Linkedin, href: "#", color: "text-blue-700" }
                  ].map(({ Icon, href, color }, index) => (
                    <a
                      key={index}
                      href={href}
                      className={`w-6 h-6 flex items-center justify-center rounded-full hover:opacity-80 ${color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Short Bio</h2>
              <div className="space-y-3 text-sm">
                <p className="text-gray-600">{doctorInfo.shortBio || `I am ${doctorInfo.name}, a dedicated ${doctorInfo.specialization.toLowerCase()} with multiple practice locations. My practice combines evidence-based medicine with a patient-centered approach to ensure the best possible outcomes for my patients.`}</p>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">$</span>
                  </span>
                  <h2 className="text-lg font-semibold">Services and price list</h2>
                </div>
                <div className="space-y-3 text-sm">
                  {(doctorInfo.services || []).map((service, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{service.name}</span>
                      <span className="font-medium">{service.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Practice Locations</h2>
              {addressesLoading ? (
                <div className="text-center py-4">Loading addresses...</div>
              ) : (addresses || []).length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((addr, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-blue-600 capitalize">{addr.address_type}</span>
                      </div>
                      <p className="text-sm text-gray-600">{addr.address}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <span>Lat: {addr.lat}, </span>
                        <span>Lon: {addr.lon}</span>
                      </div>
                      <button
                        onClick={() => handleLocationClick(addr)}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View on Map
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">No addresses found</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-600">Edit Profile</h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4 inline"/>
            </button>
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('personal')}
              className={`pb-2 ${activeTab === 'personal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('address')}
              className={`pb-2 ${activeTab === 'address' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Address Information
            </button>
            <button
              onClick={() => setActiveTab('multimedia')}
              className={`pb-2 ${activeTab === 'multimedia' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Multimedia Information
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {renderEditForm()}

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl h-[600px] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Location Map</h2>
              <button onClick={() => setIsMapModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4 inline"/>
              </button>
            </div>
            <div className="flex-grow" ref={mapRef}></div>
          </div>
        </div>
      )}
    </div>
  )
}

