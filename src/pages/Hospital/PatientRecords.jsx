import React, { useState } from 'react'
import { User, FileText, ChevronLeft } from 'lucide-react'

// Mock data
const profilesData = [
  { id: 1, name: "Dr. Rehan Sayyed", age: 18, type: "doctor", reportsCount: 3, image: "/hospital/pfp1.jpg" },
  { id: 2, name: "Dr. Rohit Deshmukh", age: 38, type: "doctor", reportsCount: 5, image: "/hospital/pfp2.jpg" },
  { id: 3, name: "Dr. Vivi Chauhan", age: 52, type: "doctor", reportsCount: 3, image: "/hospital/pfp3.jpg" },
  { id: 4, name: "Dr. Nishi Raut", age: 41, type: "doctor", reportsCount: 5, image: "/hospital/pfp4.jpg" },
  { id: 5, name: "Dr. Rahil Sir", age: 36, type: "doctor", reportsCount: 3, image: "/hospital/pfp5.jpg" },
  { id: 6, name: "Adnan Broker", age: 28, type: "patient", reportsCount: 5, image: "/hospital/pfp4.jpg" },
  { id: 7, name: "Rehan Shah", age: 35, type: "patient", reportsCount: 3, image: "/hospital/pfp3.jpg" },
  { id: 8, name: "Bilal Shaikh", age: 45, type: "patient", reportsCount: 5, image: "/hospital/pfp2.jpg" },
  { id: 9, name: "L1a2v3a4n5y6a7", age: 52, type: "patient", reportsCount: 3, image: "/hospital/pfp1.jpg" },
  { id: 10, name: "Azlaan Shaikh", age: 30, type: "patient", reportsCount: 5, image: "/hospital/pfp5.jpg" },
]

const reportsData = {
  1: [
    { id: 1, title: "Annual Checkup", date: "2023-05-15", status: "Completed" },
    { id: 2, title: "Follow-up", date: "2023-06-20", status: "Scheduled" },
    { id: 3, title: "Lab Results", date: "2023-04-10", status: "Reviewed" },
  ],
  2: [
    { id: 1, title: "Annual Checkup", date: "2023-05-15", status: "Completed" },
    { id: 2, title: "Follow-up", date: "2023-06-20", status: "Scheduled" },
    { id: 3, title: "Lab Results", date: "2023-04-10", status: "Reviewed" },
    { id: 4, title: "Dental Checkup", date: "2023-07-05", status: "Completed" },
    { id: 5, title: "Vaccination", date: "2023-08-15", status: "Scheduled" },
  ],
  3: [
    { id: 1, title: "Annual Checkup", date: "2023-05-15", status: "Completed" },
    { id: 2, title: "Follow-up", date: "2023-06-20", status: "Scheduled" },
    { id: 3, title: "Lab Results", date: "2023-04-10", status: "Reviewed" },
  ],
  4: [
    { id: 1, title: "Annual Checkup", date: "2023-05-15", status: "Completed" },
    { id: 2, title: "Follow-up", date: "2023-06-20", status: "Scheduled" },
    { id: 3, title: "Lab Results", date: "2023-04-10", status: "Reviewed" },
    { id: 4, title: "Dental Checkup", date: "2023-07-05", status: "Completed" },
    { id: 5, title: "Vaccination", date: "2023-08-15", status: "Scheduled" },
  ],
  5: [
    { id: 1, title: "Annual Checkup", date: "2023-05-15", status: "Completed" },
    { id: 2, title: "Follow-up", date: "2023-06-20", status: "Scheduled" },
    { id: 3, title: "Lab Results", date: "2023-04-10", status: "Reviewed" },
  ],
  6: [
    { id: 1, title: "Annual Checkup", date: "2023-05-15", status: "Completed" },
    { id: 2, title: "Follow-up", date: "2023-06-20", status: "Scheduled" },
    { id: 3, title: "Lab Results", date: "2023-04-10", status: "Reviewed" },
    { id: 4, title: "Dental Checkup", date: "2023-07-05", status: "Completed" },
    { id: 5, title: "Vaccination", date: "2023-08-15", status: "Scheduled" },
  ],
  7: [
    { id: 1, title: "Annual Checkup", date: "2023-05-15", status: "Completed" },
    { id: 2, title: "Follow-up", date: "2023-06-20", status: "Scheduled" },
    { id: 3, title: "Lab Results", date: "2023-04-10", status: "Reviewed" },
  ],
  8: [
    { id: 1, title: "Annual Checkup", date: "2023-05-15", status: "Completed" },
    { id: 2, title: "Follow-up", date: "2023-06-20", status: "Scheduled" },
    { id: 3, title: "Lab Results", date: "2023-04-10", status: "Reviewed" },
    { id: 4, title: "Dental Checkup", date: "2023-07-05", status: "Completed" },
    { id: 5, title: "Vaccination", date: "2023-08-15", status: "Scheduled" },
  ],
  9: [
    { id: 1, title: "Annual Checkup", date: "2023-05-15", status: "Completed" },
    { id: 2, title: "Follow-up", date: "2023-06-20", status: "Scheduled" },
    { id: 3, title: "Lab Results", date: "2023-04-10", status: "Reviewed" },
  ],
  10: [
    { id: 1, title: "Annual Checkup", date: "2023-05-15", status: "Completed" },
    { id: 2, title: "Follow-up", date: "2023-06-20", status: "Scheduled" },
    { id: 3, title: "Lab Results", date: "2023-04-10", status: "Reviewed" },
    { id: 4, title: "Dental Checkup", date: "2023-07-05", status: "Completed" },
    { id: 5, title: "Vaccination", date: "2023-08-15", status: "Scheduled" },
  ],
}

const generateReportDetails = (profileId, reportId) => {
  const profile = profilesData.find(p => p.id === profileId);
  const report = reportsData[profileId].find(r => r.id === reportId);
  
  return {
    patientName: profile.name,
    doctorName: "Dr. John Doe",
    date: report.date,
    diagnosis: "Healthy",
    prescription: "N/A",
    notes: "Patient is in good health. Recommended regular exercise and balanced diet.",
  };
};

export default function PatientRecords() {
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile)
    setSelectedReport(null)
  }

  const handleReportClick = (report) => {
    setSelectedReport(report)
  }

  const handleBack = () => {
    if (selectedReport) {
      setSelectedReport(null)
    } else if (selectedProfile) {
      setSelectedProfile(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{
          backgroundImage: "url('/hospital/bg2.jpg')",
          filter: "brightness(0.7)"
        }}
      ></div>
      <div className="relative z-10 p-4 md:p-8">
        {(selectedProfile || selectedReport) && (
          <button
            onClick={handleBack}
            className="mb-4 flex items-center text-white hover:text-green-950"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>
        )}
        
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          {selectedReport ? "Report Details" : selectedProfile ? `${selectedProfile.name}'s Reports` : "Patient Records"}
        </h1>

        {!selectedProfile && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {profilesData.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleProfileClick(profile)}
              >
                <div className="flex items-center mb-2">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{profile.name}</h2>
                    <p className="text-sm text-gray-600">{profile.type === "doctor" ? "Doctor" : "Patient"}</p>
                  </div>
                </div>
                <p className="text-sm">Age: {profile.age}</p>
                <p className="text-sm">Reports: {profile.reportsCount}</p>
              </div>
            ))}
          </div>
        )}

        {selectedProfile && !selectedReport && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {reportsData[selectedProfile.id].map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleReportClick(report)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">{report.title}</h2>
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm">Date: {report.date}</p>
                <p className="text-sm">Status: {report.status}</p>
              </div>
            ))}
          </div>
        )}

        {selectedReport && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{selectedReport.title}</h2>
            <table className="w-full">
              <tbody>
                {Object.entries(generateReportDetails(selectedProfile.id, selectedReport.id)).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="py-2 font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                    <td className="py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}