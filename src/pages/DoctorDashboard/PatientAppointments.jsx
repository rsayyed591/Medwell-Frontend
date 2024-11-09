import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import moment from 'moment'
import { ChevronLeft, ChevronRight, User, Clock, CalendarDays, FileText, X } from 'lucide-react'

const initialAppointments = [
  {
    id: 1,
    title: 'Annual Checkup',
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    patient: 'Rehan Sayyed',
    notes: 'Review medical history',
    color: '#3b82f6'
  },
  {
    id: 2,
    title: 'Follow-up Consultation',
    start: new Date(new Date().setHours(new Date().getHours() + 24)),
    end: new Date(new Date().setHours(new Date().getHours() + 25)),
    patient: 'Rehan Shaikh',
    notes: 'Discuss test results',
    color: '#10b981'
  },
  {
    id: 3,
    title: 'New Patient Consultation',
    start: new Date(new Date().setHours(new Date().getHours() + 48)),
    end: new Date(new Date().setHours(new Date().getHours() + 49)),
    patient: 'Rehan Khan',
    notes: 'Initial assessment',
    color: '#f59e0b'
  }
]

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [todayAppointments, setTodayAppointments] = useState([])
  const [futureAppointments, setFutureAppointments] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [view, setView] = useState('list') // 'list' or 'calendar'

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    updateDisplayedAppointments()
  }, [appointments])

  const updateDisplayedAppointments = () => {
    const today = moment().startOf('day')
    const todayApps = appointments.filter(app => moment(app.start).isSame(today, 'day'))
    const futureApps = appointments
      .filter(app => moment(app.start).isAfter(today))
      .sort((a, b) => moment(a.start).diff(moment(b.start)))
    
    setTodayAppointments(todayApps)
    setFutureAppointments(futureApps)
  }

  const handleSelectEvent = useCallback((event) => {
    if (event && event.title) {
      setSelectedAppointment(event)
    }
  }, [])

  const handleNavigate = useCallback((action) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (action === 'PREV') {
        newDate.setDate(newDate.getDate() - 7)
      } else if (action === 'NEXT') {
        newDate.setDate(newDate.getDate() + 7)
      } else if (action === 'TODAY') {
        return new Date()
      }
      return newDate
    })
  }, [])

  const formatDateRange = (date) => {
    const start = moment(date).startOf('week')
    const end = moment(date).endOf('week')
    return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`
  }

  const AppointmentCard = ({ appointment }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow duration-200 border-l-4 border-blue-500"
      onClick={() => handleSelectEvent(appointment)}
    >
      <h3 className="font-semibold text-lg mb-2 text-blue-800">{appointment.title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-blue-700">{appointment.patient}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-blue-700">{moment(appointment.start).format('h:mm A')}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-blue-700">{moment(appointment.start).format('MMM D, YYYY')}</span>
        </div>
        <div className="flex items-center">
          <FileText className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-blue-700 truncate">{appointment.notes}</span>
        </div>
      </div>
    </motion.div>
  )

  const WeeklyCalendar = () => {
    const weekStart = moment(currentDate).startOf('week')
    const weekDays = Array.from({ length: 7 }, (_, i) => moment(weekStart).add(i, 'days'))
    const timeSlots = Array.from({ length: 24 }, (_, i) => moment().startOf('day').add(i, 'hours'))

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border bg-blue-50"></th>
              {timeSlots.map((time, index) => (
                <th key={index} className="p-2 border bg-blue-50 min-w-[100px] text-blue-800">
                  {time.format('h:mm A')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weekDays.map((day, dayIndex) => (
              <tr key={dayIndex}>
                <td className="p-2 border text-center font-semibold relative bg-blue-100 text-blue-800 min-w-[100px]">
                  {day.format('ddd, MMM D')}
                  {appointments.some(app => moment(app.start).isSame(day, 'day')) && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </td>
                {timeSlots.map((time, timeIndex) => {
                  const cellDateTime = moment(day).set({
                    hour: time.get('hour'),
                    minute: time.get('minute'),
                  })
                  const appointmentsInSlot = appointments.filter(app => 
                    moment(app.start).isSame(cellDateTime, 'hour')
                  )
                  return (
                    <td key={timeIndex} className="p-2 border relative min-h-[50px] hover:bg-blue-50 transition-colors duration-200">
                      {appointmentsInSlot.map((app, appIndex) => (
                        <div
                          key={appIndex}
                          className="absolute inset-0 flex items-center justify-center text-xs cursor-pointer text-white rounded-md"
                          style={{ backgroundColor: app.color }}
                          onClick={() => handleSelectEvent(app)}
                        >
                          {app.title}
                        </div>
                      ))}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Appointments</h1>
      <div className="mb-4 flex justify-center md:hidden">
        <button
          onClick={() => setView('list')}
          className={`px-4 py-2 rounded-l-lg ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}
        >
          List View
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`px-4 py-2 rounded-r-lg ${view === 'calendar' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}
        >
          Calendar View
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full md:w-1/3 ${isMobile && view === 'calendar' ? 'hidden' : ''}`}
        >
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-blue-800">Today's Appointments</h2>
            {todayAppointments.length === 0 ? (
              <p className="text-blue-600">No appointments scheduled for today</p>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
            
            <h2 className="text-xl md:text-2xl font-semibold mb-4 mt-8 text-blue-800">Upcoming Appointments</h2>
            {futureAppointments.length === 0 ? (
              <p className="text-blue-600">No upcoming appointments scheduled</p>
            ) : (
              <div className="space-y-4">
                {futureAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full md:w-full lg:w-2/3 ${isMobile && view === 'list' ? 'hidden' : ''}`}
        >
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 md:mb-8">
              <button 
                onClick={() => handleNavigate('PREV')} 
                className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200 text-blue-600"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <span className="text-base md:text-lg lg:text-2xl font-medium text-blue-800">
                {formatDateRange(currentDate)}
              </span>
              <button 
                onClick={() => handleNavigate('NEXT')} 
                className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200 text-blue-600"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <div className="w-full max-w-[245px] md:max-w-screen-sm md:w-full md:min-w-[400px] overflow-x-auto">
      <WeeklyCalendar />
    </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {selectedAppointment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white p-4 md:p-6 rounded-lg shadow-xl w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-blue-800">{selectedAppointment.title}</h2>
                  <button 
                    onClick={() => setSelectedAppointment(null)} 
                    className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200 text-blue-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-3 text-sm md:text-base">
                  <p className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    <strong className="text-blue-700">Patient:</strong> <span className="text-blue-600 ml-1">{selectedAppointment.patient}</span>
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    <strong className="text-blue-700">Start:</strong> <span className="text-blue-600 ml-1">{moment(selectedAppointment.start).format('MMMM D, YYYY h:mm A')}</span>
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    <strong className="text-blue-700">End:</strong> <span className="text-blue-600 ml-1">{moment(selectedAppointment.end).format('MMMM D, YYYY h:mm A')}</span>
                  </p>
                  <p className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                    <strong className="text-blue-700">Notes:</strong> <span className="text-blue-600 ml-1">{selectedAppointment.notes || 'No notes'}</span>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}