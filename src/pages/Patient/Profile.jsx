import React, { useState, useEffect } from 'react';
import { Edit, Heart, Clipboard, Calendar, MapPin, QrCode } from 'lucide-react';
import { google_ngrok_url } from '../../utils/global';
import { useFetch } from '../components/useFetch';
import Chat from "../components/Chat"

export default function Profile({ patientInfo }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditPicMode, setIsEditPicMode] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [profilePic, setProfilePic] = useState('/Vivek.jpg');
  const [localPatientInfo, setLocalPatientInfo] = useState(patientInfo);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrError, setQrError] = useState(null);
  const { savePatientInfo, updateProfilePic } = useFetch();

  useEffect(() => {
    setLocalPatientInfo(patientInfo);
    if (patientInfo && patientInfo.profile_qr) {
      const fullQrUrl = google_ngrok_url + patientInfo.profile_qr;
      setQrCodeUrl(fullQrUrl);
      console.log(qrCodeUrl)
    }
    if (patientInfo && patientInfo.profile_pic) {
      const profile_pic = google_ngrok_url + patientInfo.profile_pic;
      setProfilePic(profile_pic);
      console.log(profilePic)
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const updatedData = {};
    
    for (let [key, value] of formData.entries()) {
      if (key === 'chronic_conditions' || key === 'family_history' || key === 'allergies') {
        value = value.split(',').map(item => item.trim()).filter(Boolean);
      }
      if (JSON.stringify(value) !== JSON.stringify(localPatientInfo[key])) {
        updatedData[key] = value;
      }
    }

    if (Object.keys(updatedData).length > 0) {
      try {
        await savePatientInfo(updatedData);
        setLocalPatientInfo(prev => ({ ...prev, ...updatedData }));
        setIsEditMode(false);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    } else {
      setIsEditMode(false);
    }
  };

  const handleProfilePicSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profilePic instanceof File) {
        await updateProfilePic(profilePic);
      }
      setIsEditPicMode(false);
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

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
            <button
              className="absolute top-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
              onClick={() => setIsEditPicMode(true)}
            >
              <Edit className="h-4 w-4" />
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
            <p><span className="font-semibold">Allergies:</span> {localPatientInfo?.allergies}</p>
            <p><span className="font-semibold">Aadhar Card:</span> {localPatientInfo?.aadhar_card}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Clipboard className="w-5 h-5 mr-2 text-blue-500" />
            Medical History
          </h3>
          <div className="space-y-2">
            <p><span className="font-semibold">Chronic Conditions:</span> {localPatientInfo?.chronic_conditions}</p>
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
  );

  const [selectedFileName, setSelectedFileName] = useState('No file chosen');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setSelectedFileName(URL.createObjectURL(file));
      console.log(profilePic)
    }
  };

  if (!localPatientInfo) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4 md:p-6">
      {isEditMode ? (
        <div className="fixed inset-0 bg-white overflow-y-auto z-50">
          <div className="max-w-3xl mx-auto py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={localPatientInfo?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="age">Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      defaultValue={localPatientInfo?.age || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                     <div
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 text-sm"
                    aria-label="Email address"
                  >
                  {localPatientInfo?.user_info.email || ''}
                  </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="phone_number">Phone Number</label>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      defaultValue={localPatientInfo?.phone_number || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="blood_group">Blood Group</label>
                    <input
                      type="text"
                      id="blood_group"
                      name="blood_group"
                      defaultValue={localPatientInfo?.blood_group || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="height">Height</label>
                    <input
                      type="text"
                      id="height"
                      name="height"
                      defaultValue={localPatientInfo?.height || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="weight">Weight</label>
                    <input
                      type="text"
                      id="weight"
                      name="weight"
                      defaultValue={localPatientInfo?.weight || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="allergies">Allergies</label>
                    <input
                      type="text"
                      id="allergies"
                      name="allergies"
                      defaultValue={localPatientInfo?.allergies || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="aadhar_card">Aadhar Card</label>
                    <input
                      type="text"
                      id="aadhar_card"
                      name="aadhar_card"
                      defaultValue={localPatientInfo?.aadhar_card || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-1" htmlFor="chronic_conditions">Chronic Conditions</label>
                  <textarea
                    id="chronic_conditions"
                    name="chronic_conditions"
                    defaultValue={Array.isArray(localPatientInfo?.chronic_conditions) 
                      ? localPatientInfo.chronic_conditions.join(', ') 
                      : localPatientInfo?.chronic_conditions || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter conditions separated by commas"
                  />
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-1" htmlFor="family_history">Family History</label>
                  <textarea
                    id="family_history"
                    name="family_history"
                    defaultValue={Array.isArray(localPatientInfo?.family_history) 
                      ? localPatientInfo.family_history.join(', ') 
                      : localPatientInfo?.family_history || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter family history items separated by commas"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      defaultValue={localPatientInfo?.city || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      defaultValue={localPatientInfo?.state || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      defaultValue={localPatientInfo?.country || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="pin">PIN</label>
                    <input
                      type="text"
                      id="pin"
                      name="pin"
                      defaultValue={localPatientInfo?.pin || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
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
      {isEditPicMode && 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Update Profile Picture</h2>
            <form onSubmit={handleProfilePicSubmit}>
              <div className="mb-4">
                <label htmlFor="profile_pic" className="block text-sm font-medium mb-2">
                  Choose new profile picture
                </label>
                <div className="flex flex-col space-y-4 items-center">
                  <label
                    htmlFor="profile_pic"
                    className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="profile_pic"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="ml-3 text-sm text-gray-600"><img src={selectedFileName} alt="File" /></span>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditPicMode(false)}
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
      }
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-64 h-64" 
                onLoad={() => console.log('QR code image loaded successfully')}
                onError={(error) => {
                  console.error('Error loading QR code image:', error);
                  setQrError('Failed to load QR code image');
                }}
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-red-500">
                No QR code available
              </div>
            )}
            {qrError && (
              <p className="text-red-500 mt-2">{qrError}</p>
            )}
            <button
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => {
                setShowQR(false);
                setQrError(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Chat/>
    </div>
  );
}