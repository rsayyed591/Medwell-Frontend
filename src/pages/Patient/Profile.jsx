import React, { useState, useEffect, useRef } from 'react';
import { Edit, Heart, Clipboard, Calendar, MapPin, QrCode } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import { useFetch } from '../components/useFetch';

export default function Profile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [patientInfo, setPatientInfo] = useState({});
  const [originalPatientInfo, setOriginalPatientInfo] = useState({});
  const { savePatientInfo, updateProfilePic, getPatientInfo, isLoading } = useFetch();

  useEffect(() => {
    const fetchPatientInfo = async () => {
      const data = await getPatientInfo();
      if (data) {
        setPatientInfo(data);
        setOriginalPatientInfo(data);
        setProfilePic(data.profile_pic);
      } else {
        setPatientInfo({});
        setOriginalPatientInfo({});
        setProfilePic(null);
      }
    };
    fetchPatientInfo();
  }, [getPatientInfo]);

  useEffect(() => {
    if (patientInfo.user) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`imedwell.vercel.app/dashboard/user=${patientInfo.user}`)}`;
      setQrCodeUrl(qrUrl);
    } else {
      setQrCodeUrl('');
    }
  }, [patientInfo.user]);

  useEffect(() => {
    const removeProfileBackground = async () => {
      if (profilePic) {
        try {
          const result = await removeBackground(profilePic);
          setProfilePic(result);
        } catch (error) {
          console.error('Error removing background:', error);
        }
      }
    };
    removeProfileBackground();
  }, [profilePic]);

  const safeJoin = (arr, separator = ', ') => {
    return Array.isArray(arr) ? arr.join(separator) : arr || '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setProfilePic(reader.result);
        const formData = new FormData();
        formData.append('profile_pic', file);
        const result = await updateProfilePic(formData);
        if (result) {
          console.log('Profile picture updated successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const changedFields = {};
    Object.keys(patientInfo).forEach(key => {
      if (patientInfo[key] !== originalPatientInfo[key]) {
        changedFields[key] = patientInfo[key];
      }
    });
    
    if (Object.keys(changedFields).length > 0) {
      const result = await savePatientInfo(changedFields);
      if (result) {
        setOriginalPatientInfo(patientInfo);
        console.log('Patient info updated successfully');
      }
    }
    setIsEditMode(false);
  };

  const ProfileDisplay = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 mb-4">
            <img 
              src={profilePic || '/placeholder.svg?height=192&width=192'}
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
          <h2 className="text-2xl font-bold text-center mb-2">{patientInfo.name || 'No Name'}</h2>
          <p className="text-gray-600 text-center mb-1">User: {patientInfo.user || 'No User ID'}</p>
          <p className="text-gray-600 text-center mb-1">{patientInfo.phone_number || 'No Phone Number'}</p>
          <p className="text-gray-600 text-center mb-4">Age: {patientInfo.age || 'N/A'}</p>
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
            <p><span className="font-semibold">Blood Group:</span> {patientInfo.blood_group || 'Not specified'}</p>
            <p><span className="font-semibold">Height:</span> {patientInfo.height || 'Not specified'}</p>
            <p><span className="font-semibold">Weight:</span> {patientInfo.weight || 'Not specified'}</p>
            <p><span className="font-semibold">Allergies:</span> {safeJoin(patientInfo.allergies) || 'None'}</p>
            <p><span className="font-semibold">Aadhar Card:</span> {patientInfo.aadhar_card || 'Not provided'}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Clipboard className="w-5 h-5 mr-2 text-blue-500" />
            Medical History
          </h3>
          <div className="space-y-2">
            <p><span className="font-semibold">Chronic Conditions:</span> {patientInfo.chronic_condition || 'None reported'}</p>
            <p><span className="font-semibold">Family History:</span> {patientInfo.family_history || 'Not provided'}</p>
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
            <p><span className="font-semibold">City:</span> {patientInfo.city || 'Not specified'}</p>
            <p><span className="font-semibold">State:</span> {patientInfo.state || 'Not specified'}</p>
            <p><span className="font-semibold">Country:</span> {patientInfo.country || 'Not specified'}</p>
            <p><span className="font-semibold">PIN:</span> {patientInfo.pin || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileEdit = () => {
    const inputRefs = useRef({});

    useEffect(() => {
      if (inputRefs.current.name) {
        inputRefs.current.name.focus();
      }
    }, []);

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-48 h-48 mb-4">
              <img 
                src={profilePic || '/placeholder.svg?height=192&width=192'}
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
                value={patientInfo.name || ''}
                onChange={handleInputChange}
                ref={(el) => (inputRefs.current.name = el)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={patientInfo.age || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="user">User</label>
              <input
                type="text"
                id="user"
                name="user"
                value={patientInfo.user || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={patientInfo.phone_number || ''}
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
                value={patientInfo.blood_group || ''}
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
                value={patientInfo.height || ''}
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
                value={patientInfo.weight || ''}
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
                value={safeJoin(patientInfo.allergies)}
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
                value={patientInfo.aadhar_card || ''}
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
              value={patientInfo.chronic_condition || ''}
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
              value={patientInfo.family_history || ''}
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
                value={patientInfo.city || ''}
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
                value={patientInfo.state || ''}
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
                value={patientInfo.country || ''}
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
                value={patientInfo.pin || ''}
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
              setPatientInfo(originalPatientInfo);
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
    );
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4 md:p-6">
      {isEditMode ? (
        <div className="fixed inset-0 bg-white overflow-y-auto z-50">
          <div className="max-w-3xl mx-auto py-8">
            <ProfileEdit />
          </div>
        </div>
      ) : (
        <ProfileDisplay />
      )}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-gray-500">
                No QR Code available
              </div>
            )}
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