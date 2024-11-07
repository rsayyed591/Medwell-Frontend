import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Initialize localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Sample data structure
const dashboardData = {
  overview: {
    patients: 78,
    reviews: 12,
    appointments: 13,
    surgeries: 1
  },
  schedule: [
    {
      time: "09:00",
      patientName: "Patient Name"
    }
  ],
  upcomingAppointments: [
    {
      patientName: "Patient Name",
      reasonForVisit: "Reason for Visit",
      appointmentDate: "Appointment Date"
    }
  ]
};

// Icon components
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const StethoscopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
    <circle cx="20" cy="10" r="2"></circle>
  </svg>
);

export function Dashboard() {
  return (
    <div style={{ padding: '24px', backgroundColor: '#e6f7ff', minHeight: '100vh' }}>
      {/* Today's Overview */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>Today's Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <OverviewCard icon={<UsersIcon />} value={dashboardData.overview.patients} label="Patients" />
        <OverviewCard icon={<StarIcon />} value={dashboardData.overview.reviews} label="Reviews" />
        <OverviewCard icon={<CalendarIcon />} value={dashboardData.overview.appointments} label="Appointments" />
        <OverviewCard icon={<StethoscopeIcon />} value={dashboardData.overview.surgeries} label="Surgery" />
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Schedule Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px', fontSize: '0.875rem' }}>
                {["08:00", "09:00", "10:00", "11:00", "12:00", "01:00", "02:00", "03:00"].map((time) => (
                  <div key={time} style={{ textAlign: 'center', color: '#666' }}>{time}</div>
                ))}
              </div>
              <div style={{ height: '80px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12.5%', top: '0', width: '12.5%', height: '100%' }}>
                  <div style={{ backgroundColor: '#ffcccb', color: '#d32f2f', borderRadius: '4px', padding: '4px', fontSize: '0.875rem' }}>
                    Patient Name
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Upcoming Appointments</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>
                    <th style={{ paddingBottom: '8px' }}>Patient Name</th>
                    <th style={{ paddingBottom: '8px' }}>Reason for Visit</th>
                    <th style={{ paddingBottom: '8px' }}>Appointment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.upcomingAppointments.map((appointment, index) => (
                    <tr key={index} style={{ borderBottom: index === dashboardData.upcomingAppointments.length - 1 ? 'none' : '1px solid #e0e0e0' }}>
                      <td style={{ padding: '12px 0' }}>{appointment.patientName}</td>
                      <td style={{ padding: '12px 0' }}>{appointment.reasonForVisit}</td>
                      <td style={{ padding: '12px 0' }}>{appointment.appointmentDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Calendar */}
          <Card>
            <Calendar
              localizer={localizer}
              events={[]}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 400 }}
            />
          </Card>

          {/* Notifications */}
          <Card>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Notifications</h3>
            <div style={{ height: '200px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}></div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({ icon, value, label }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}>
      <div style={{ marginRight: '16px' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>{label}</div>
      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}>
      {children}
    </div>
  );
}