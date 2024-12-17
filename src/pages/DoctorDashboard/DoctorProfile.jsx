import React, { useState } from 'react'
import { MapPin, Mail, Phone, Star, Edit, Facebook, Instagram, Twitter, Linkedin, TextIcon as Telegram, PhoneIcon as WhatsApp, Camera } from 'lucide-react'

const initialDoctorInfo = {
  name: "Dr. Lavanya Chouhan",
  specialization: "Heart Specialist",
  address: "Maharashtra, India",
  email: "lavanya@gmail.com",
  phone: "+91 9899899889",
  profilePicture: './doctorpfp(female).png',
  rating: 5,
  fullAddress: "15, SV Road, Mazgaon West, Maharashtra, Mumbai, India",
  services: [
    { name: "Breakup", price: "Rs. 550" },
    { name: "Heart Attack", price: "Rs. 460" },
    { name: "Donut Attack", price: "Rs. 460" }
  ],
  additionalInfo: [
    "Specialized in advanced cardiac procedures",
    "Published research in leading medical journals",
    "Regular speaker at medical conferences"
  ],
  shortBio: "",
  additionalComments: ""
}

export function DoctorProfile() {
  const [doctorInfo, setDoctorInfo] = useState(initialDoctorInfo)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [tempImage, setTempImage] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const updatedInfo = Object.fromEntries(formData.entries())
    
    const services = []
    for (let i = 0; i < 3; i++) {
      if (formData.get(`service-${i}`) && formData.get(`price-${i}`)) {
        services.push({
          name: formData.get(`service-${i}`),
          price: formData.get(`price-${i}`)
        })
      }
    }

    const additionalInfo = []
    for (let i = 0; i < 3; i++) {
      const info = formData.get(`additionalInfo-${i}`)
      if (info) additionalInfo.push(info)
    }

    setDoctorInfo(prevInfo => ({
      ...prevInfo,
      ...updatedInfo,
      services: services.length > 0 ? services : prevInfo.services,
      additionalInfo: additionalInfo.length > 0 ? additionalInfo : prevInfo.additionalInfo,
      profilePicture: tempImage || prevInfo.profilePicture,
      additionalComments: formData.get('additionalComments') || prevInfo.additionalComments,
      shortBio: formData.get('shortBio') || ''
    }))
    
    setIsEditing(false)
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
                  src={doctorInfo.profilePicture}
                  alt={doctorInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-semibold">{doctorInfo.name}</h1>
                <p className="text-gray-500 text-sm">{doctorInfo.specialization}</p>
                <div className="flex gap-1">
                  {[...Array(doctorInfo.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{doctorInfo.address}</span>
                  </div>
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
                <Edit className="w-4 h-4 inline mr-2" />
                Edit Profile
              </button>
              <div className="flex gap-2 mt-2">
                <h3 className="text-sm font-medium mr-2">Social Media</h3>
                <div className="flex gap-2">
                  {[
                    { Icon: Facebook, href: "#", color: "text-blue-600" },
                    { Icon: Instagram, href: "#", color: "text-pink-600" },
                    { Icon: Twitter, href: "#", color: "text-blue-400" },
                    { Icon: Telegram, href: "#", color: "text-blue-500" },
                    { Icon: WhatsApp, href: "#", color: "text-green-500" },
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
                <p className="text-gray-600">{doctorInfo.shortBio || `I am ${doctorInfo.name}, a dedicated ${doctorInfo.specialization.toLowerCase()} practicing in ${doctorInfo.address}. With a commitment to providing exceptional cardiac care, I specialize in diagnosing and treating various heart conditions. My practice combines evidence-based medicine with a patient-centered approach to ensure the best possible outcomes for my patients.`}</p>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">$</span>
                  </span>
                  <h2 className="text-lg font-semibold">Services and price list</h2>
                </div>
                <div className="space-y-3 text-sm">
                  {doctorInfo.services.map((service, index) => (
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
              <h2 className="text-lg font-semibold mb-3">Full Address</h2>
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">{doctorInfo.fullAddress}</p>
              </div>

              <h2 className="text-lg font-semibold mb-3">Additional Information</h2>
              <div className="space-y-2">
                {doctorInfo.additionalInfo.map((info, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-blue-600 font-medium">{index + 1}.</span>
                    <p className="text-sm text-gray-600">{info}</p>
                  </div>
                ))}
              </div>

              {doctorInfo.additionalComments && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-3">Additional Comments</h2>
                  <p className="text-sm text-gray-600">{doctorInfo.additionalComments}</p>
                </div>
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
              Cancel
            </button>
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('personal')}
              className={`pb-2 ${activeTab === 'personal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`pb-2 ${activeTab === 'professional' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Professional Information
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === 'personal' ? (
              <>
                <div className="flex flex-col items-start mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4">
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
                  <label className="block text-sm font-medium text-blue-600 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={doctorInfo.address}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">Full Address</label>
                  <textarea
                    name="fullAddress"
                    defaultValue={doctorInfo.fullAddress}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
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
                  {doctorInfo.services.map((service, index) => (
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
                  <label className="block text-sm font-medium text-blue-600 mb-1">Additional Information</label>
                  {doctorInfo.additionalInfo.map((info, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="text"
                        name={`additionalInfo-${index}`}
                        defaultValue={info}
                        placeholder={`Additional information #${index + 1}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">
                    Additional Comments
                  </label>
                  <textarea
                    name="additionalComments"
                    defaultValue={doctorInfo.additionalComments}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Cancel
              </button>
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
    </div>
  )
}