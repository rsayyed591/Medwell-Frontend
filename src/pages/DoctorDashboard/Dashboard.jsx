import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { 
  Users, 
  Star, 
  MessageSquare, 
  Stethoscope,
  Bell,
  Calendar as CalendarIcon,
  FileText
} from 'lucide-react';

const dashboardData = {
  overview: {
    patients: 78,
    reviews: 12,
    appointments: 13,
    surgeries: 1
  },
  schedule: [
    { time: '09:00', patientName: 'Nishi Twopper', duration: 30 },
    { time: '10:30', patientName: 'Nishi Sir', duration: 45 },
    { time: '13:00', patientName: 'Nishi Police', duration: 60 },
  ],
  upcomingAppointments: [
    { patientName: 'Rahil', reason: 'Annual Checkup', date: '2024-10-05' },
    { patientName: 'Adnan', reason: 'Follow-up', date: '2024-10-06' },
    { patientName: 'Bilal', reason: 'Consultation', date: '2024-10-07' },
  ],
  notifications: [
    { icon: <Bell size={16} />, message: 'New appointment request', time: '5 min ago' },
    { icon: <CalendarIcon size={16} />, message: 'Reminder: Team meeting at 2 PM', time: '1 hour ago' },
    { icon: <FileText size={16} />, message: 'Lab results for patient #1234 are ready', time: '3 hours ago' },
  ]
};

function AnimatedNumber({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
}

export default function Dashboard() {
  const [date, setDate] = useState(new Date(2024, 9, 1));

  return (
    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-5">
        {/* Left Column */}
        <div>
          {/* Overview Section */}
          <div className="mb-5">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Today's Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <OverviewCard icon={<Users size={24} />} value={dashboardData.overview.patients} label="Patients" color="bg-blue-500" />
              <OverviewCard icon={<Star size={24} />} value={dashboardData.overview.reviews} label="Reviews" color="bg-yellow-500" />
              <OverviewCard icon={<MessageSquare size={24} />} value={dashboardData.overview.appointments} label="Appointments" color="bg-green-500" />
              <OverviewCard icon={<Stethoscope size={24} />} value={dashboardData.overview.surgeries} label="Surgery" color="bg-red-500" />
            </div>
          </div>

          {/* Schedule Section */}
          <div className="mb-5">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Schedule</h2>
            <div className="bg-white rounded-xl p-5 overflow-x-auto shadow-md">
              <div className="grid grid-cols-8 border-b border-blue-100 pb-2.5 mb-5 min-w-[640px]">
                {["08:00", "09:00", "10:00", "11:00", "12:00", "01:00", "02:00", "03:00"].map((time) => (
                  <div key={time} className="text-center text-sm text-blue-600 font-medium">
                    {time}
                  </div>
                ))}
              </div>
              <div className="h-[60px] relative min-w-[640px]">
                <div className="absolute inset-0 grid grid-cols-8 border-l border-t border-blue-100">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="border-r border-b border-blue-100" />
                  ))}
                </div>
                {dashboardData.schedule.map((appointment, index) => (
                  <div 
                    key={index}
                    className="absolute bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm z-10 shadow-md"
                    style={{
                      left: `${(parseInt(appointment.time.split(':')[0]) - 8 + parseInt(appointment.time.split(':')[1]) / 60) * 12.5}%`,
                      width: `${appointment.duration / 4.8}%`
                    }}
                  >
                    {appointment.patientName}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Upcoming Appointments</h2>
            <div className="bg-white rounded-xl p-5 overflow-x-auto shadow-md">
              <div className="grid grid-cols-3 border-b border-blue-100 pb-2.5 text-sm font-medium text-blue-700 min-w-[480px]">
                <div className="border-r border-blue-100 px-2">Patient Name</div>
                <div className="border-r border-blue-100 px-2">Reason for Visit</div>
                <div className="px-2">Appointment Date</div>
              </div>
              {dashboardData.upcomingAppointments.map((appointment, index) => (
                <div key={index} className="grid grid-cols-3 border-b border-blue-100 py-2.5 text-sm text-blue-600 min-w-[480px] hover:bg-blue-50 transition-colors">
                  <div className="border-r border-blue-100 px-2">{appointment.patientName}</div>
                  <div className="border-r border-blue-100 px-2">{appointment.reason}</div>
                  <div className="px-2">{appointment.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - moved inside the grid for responsive layout */}
        <div className="lg:order-2 order-1">
          {/* Calendar */}
          <div className="mb-5">
            <Calendar
              onChange={setDate}
              value={date}
              next2Label={null}
              prev2Label={null}
              className="react-calendar custom-calendar"
            />
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl p-5 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Notifications</h2>
            <div className="space-y-4">
              {dashboardData.notifications.map((notification, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="mt-1 text-blue-500 bg-blue-100 p-2 rounded-full">{notification.icon}</div>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">{notification.message}</p>
                    <p className="text-xs text-blue-600">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Base styles for the custom calendar */
        .custom-calendar {
          width: 100%;
          border: none;
          background: white;
          border-radius: 0.75rem;
          padding: 0.9375rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .custom-calendar .react-calendar__navigation {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.625rem;
        }
        .custom-calendar .react-calendar__navigation button {
          background: none;
          border: none;
          padding: 0.3125rem;
          min-width: auto;
          color: #3b82f6;
        }
        .custom-calendar .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75rem;
          color: #3b82f6;
        }
        .custom-calendar .react-calendar__month-view__weekdays abbr {
          text-decoration: none;
        }
        .custom-calendar .react-calendar__tile {
          padding: 0.625rem;
          font-size: 0.875rem;
          border: none;
          color: #1e40af;
        }
        .custom-calendar .react-calendar__tile:enabled:hover {
          background: #dbeafe;
        }
        .custom-calendar .react-calendar__tile--active {
          background: #3b82f6;
          color: white;
        }
        .custom-calendar .react-calendar__tile--now {
          background: #bfdbfe;
          color: #1e40af;
        }

        /* Responsive styles for mobile screens */
        @media (max-width: 768px) {
          .custom-calendar {
            padding: 0.5rem;
            border-radius: 0.5rem;
          }
          .custom-calendar .react-calendar__navigation button {
            padding: 0.25rem;
            font-size: 0.75rem;
          }
          .custom-calendar .react-calendar__month-view__weekdays {
            font-size: 0.65rem;
          }
          .custom-calendar .react-calendar__tile {
            padding: 0.5rem;
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .custom-calendar {
            padding: 0.375rem;
            border-radius: 0.25rem;
          }
          .custom-calendar .react-calendar__navigation button {
            padding: 0.2rem;
            font-size: 0.7rem;
          }
          .custom-calendar .react-calendar__month-view__weekdays {
            font-size: 0.6rem;
          }
          .custom-calendar .react-calendar__tile {
            padding: 0.4rem;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}

function OverviewCard({ icon, value, label, color }) {
  return (
    <div className={`${color} rounded-xl p-4 flex items-center gap-3 text-white shadow-md transition-transform hover:scale-105`}>
      <div className="bg-white bg-opacity-30 p-2 rounded-full">{icon}</div>
      <div>
        <div className="text-2xl font-bold">
          <AnimatedNumber value={value} />
        </div>
        <div className="text-sm opacity-90">{label}</div>
      </div>
    </div>
  );
}