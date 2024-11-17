import React, { useState } from 'react'
import { Calendar } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { ChevronLeft, ChevronRight, Clock, User, X } from 'lucide-react'

// Mock data for appointments
const initialAppointmentsData = [
  { id: 1, patientName: "John Doe", doctorName: "Dr. Smith", date: "2023-11-20", time: "09:00 AM", status: "Scheduled" },
  { id: 2, patientName: "Jane Smith", doctorName: "Dr. Johnson", date: "2023-11-21", time: "10:30 AM", status: "Scheduled" },
  { id: 3, patientName: "Bob Wilson", doctorName: "Dr. Brown", date: "2023-11-22", time: "02:00 PM", status: "Scheduled" },
  { id: 4, patientName: "Alice Johnson", doctorName: "Dr. Davis", date: "2023-11-23", time: "11:00 AM", status: "Scheduled" },
  { id: 5, patientName: "Charlie Brown", doctorName: "Dr. Wilson", date: "2023-11-24", time: "03:30 PM", status: "Scheduled" },
]

// Mock data for doctors
const doctorsData = [
  { id: 1, name: "Dr. Smith", specialty: "Cardiology" },
  { id: 2, name: "Dr. Johnson", specialty: "Pediatrics" },
  { id: 3, name: "Dr. Brown", specialty: "Neurology" },
  { id: 4, name: "Dr. Davis", specialty: "Orthopedics" },
  { id: 5, name: "Dr. Wilson", specialty: "Dermatology" },
]

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [appointments, setAppointments] = useState(initialAppointmentsData)

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment)
    setIsRescheduling(false)
  }

  const handleReschedule = () => {
    setIsRescheduling(true)
  }

  const handleCancel = () => {
    setAppointments(appointments.filter(apt => apt.id !== selectedAppointment.id))
    setSelectedAppointment(null)
  }

  const handleConfirmReschedule = () => {
    const updatedAppointments = appointments.map(apt => {
      if (apt.id === selectedAppointment.id) {
        return { ...apt, date: selectedDate.toISOString().split('T')[0] }
      }
      return apt
    })
    setAppointments(updatedAppointments)
    setSelectedAppointment(null)
    setIsRescheduling(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{
          backgroundImage: "url('/hospital/bg3.jpg')",
          filter: "brightness(0.7)"
        }}
      ></div>
      <div className="relative z-10 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Appointment Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 text-black">Upcoming Appointments</h2>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="bg-gray-100 p-4 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
                    <span className="font-medium text-black">{appointment.patientName}</span>
                    <span className="text-sm text-gray-600">{appointment.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <User className="h-4 w-4 mr-2 text-green-600" />
                    {appointment.doctorName}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    {appointment.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 text-black">Calendar</h2>
            <style jsx global>{`
              .react-calendar {
                border: none;
                width: 100%;
                background: transparent;
                font-family: inherit;
                line-height: 1.125em;
              }
              .react-calendar__navigation button {
                color: #000;
                min-width: 44px;
                background: none;
                font-size: 16px;
                margin-top: 8px;
              }
              .react-calendar__navigation button:enabled:hover,
              .react-calendar__navigation button:enabled:focus {
                background-color: #e6e6e6;
              }
              .react-calendar__navigation button[disabled] {
                background-color: #f0f0f0;
              }
              .react-calendar__tile {
                padding: 10px 6px;
                background: none;
                text-align: center;
                line-height: 16px;
                font-size: 14px;
                border-radius: 6px;
              }
              .react-calendar__tile:enabled:hover,
              .react-calendar__tile:enabled:focus {
                background-color: #e6e6e6;
                color: #000;
              }
              .react-calendar__tile--now {
                background: #f0f0f0;
                color: #000;
              }
              .react-calendar__tile--active {
                background: #22c55e;
                color: white;
              }
              .react-calendar__tile--active:enabled:hover,
              .react-calendar__tile--active:enabled:focus {
                background: #22c55e;
                color: white;
              }
              .react-calendar__month-view__weekdays {
                text-align: center;
                text-transform: uppercase;
                font-weight: bold;
                font-size: 12px;
                color: #000;
              }
              .react-calendar__month-view__days__day--weekend {
                color: #d10000;
              }
            `}</style>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              className="shadow-sm"
              tileClassName="text-sm hover:bg-gray-200"
            />
          </div>
        </div>

        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-800">{selectedAppointment.patientName}</p>
                    <p className="text-sm text-gray-600">{selectedAppointment.doctorName}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-800">{selectedAppointment.date}</p>
                    <p className="text-sm text-gray-600">{selectedAppointment.time}</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-md p-2">
                  <p className="text-sm text-gray-800">
                    Status: <span className="font-medium">{selectedAppointment.status}</span>
                  </p>
                </div>
              </div>
              {isRescheduling ? (
                <div>
                  <p className="mb-2 text-gray-700 font-medium">Select a new date:</p>
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsRescheduling(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmReschedule}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Confirm Reschedule
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleReschedule}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}