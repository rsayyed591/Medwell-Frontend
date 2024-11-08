import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ChevronLeft, ChevronRight, User, Clock, CalendarDays, FileText, X } from 'lucide-react'

const localizer = momentLocalizer(moment)

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

const messages = {
  allDay: 'All Day',
  previous: 'Previous',
  next: 'Next',
  today: 'Today',
  month: 'Month',
  week: 'Week',
  day: 'Day',
  agenda: 'Agenda',
  date: 'Date',
  time: 'Time',
  event: 'Event',
  noEventsInRange: 'No appointments in this time range.'
}

export function PatientAppointments() {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState(Views.WEEK)
  const [todayAppointments, setTodayAppointments] = useState([])
  const [futureAppointments, setFutureAppointments] = useState([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setCurrentView(mobile ? Views.DAY : Views.WEEK)
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
      const newDate = new Date(prevDate);
      if (action === 'PREV') {
        newDate.setDate(newDate.getDate() - (isMobile ? 1 : 7));
      } else if (action === 'NEXT') {
        newDate.setDate(newDate.getDate() + (isMobile ? 1 : 7));
      } else if (action === 'TODAY') {
        return new Date();
      }
      const day = newDate.getDay();
      newDate.setDate(newDate.getDate() - day);
      return newDate;
    });
  }, [isMobile]);

  const formatDateRange = (date) => {
    if (isMobile) {
      return moment(date).format('MMMM D, YYYY');
    }
    const start = moment(date).startOf('week');
    const end = moment(date).endOf('week');
    return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`;
  };

  const handleViewChange = useCallback((newView) => {
    setCurrentView(newView)
  }, [])

  const eventStyleGetter = useCallback((event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }, [])

  const AppointmentCard = ({ appointment }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow duration-200"
      onClick={() => handleSelectEvent(appointment)}
    >
      <h3 className="font-semibold text-lg mb-2">{appointment.title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-blue-500" />
          <span>{appointment.patient}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-blue-500" />
          <span>{moment(appointment.start).format('h:mm A')}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="w-4 h-4 mr-2 text-blue-500" />
          <span>{moment(appointment.start).format('MMM D, YYYY')}</span>
        </div>
        <div className="flex items-center">
          <FileText className="w-4 h-4 mr-2 text-blue-500" />
          <span className="truncate">{appointment.notes}</span>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-0">Appointment</h1>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 max-w-7xl mx-auto px-4 py-4 md:py-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/3"
        >
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Today's Appointments</h2>
            {todayAppointments.length === 0 ? (
              <p className="text-gray-500">No appointments scheduled for today</p>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
            
            <h2 className="text-xl md:text-2xl font-semibold mb-4 mt-8">Upcoming Appointments</h2>
            {futureAppointments.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments scheduled</p>
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
          className="w-full md:w-2/3"
        >
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 md:mb-8">
              <button 
                onClick={() => handleNavigate('PREV')} 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <span className="text-base md:text-lg lg:text-2xl font-medium">
                {formatDateRange(currentDate)}
              </span>
              <button 
                onClick={() => handleNavigate('NEXT')} 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <Calendar
              localizer={localizer}
              events={appointments}
              startAccessor="start"
              endAccessor="end"
              style={{ height: isMobile ? 400 : 600 }}
              view={currentView}
              onView={handleViewChange}
              views={isMobile ? [Views.DAY] : [Views.WEEK, Views.DAY]}
              date={currentDate}
              onNavigate={setCurrentDate}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              messages={messages}
              className="rounded-lg border border-gray-200"
              toolbar={false}
            />
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
                  <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">{selectedAppointment.title}</h2>
                  <button 
                    onClick={() => setSelectedAppointment(null)} 
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-3 text-sm md:text-base">
                  <p className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    <strong>Patient:</strong> {selectedAppointment.patient}
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    <strong>Start:</strong> {moment(selectedAppointment.start).format('MMMM D, YYYY h:mm A')}
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    <strong>End:</strong> {moment(selectedAppointment.end).format('MMMM D, YYYY h:mm A')}
                  </p>
                  <p className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                    <strong>Notes:</strong> {selectedAppointment.notes || 'No notes'}
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