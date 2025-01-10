import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Chat from "../Chatbots/Chat";

const timeSlots = {
  morning: [
    '9:00 AM', '9:10 AM', '9:20 AM', '9:30 AM', '9:40 AM',
    '9:50 AM', '10:00 AM', '10:10 AM', '10:20 AM', '10:30 AM'
  ],
  evening: [
    '5:00 PM', '5:10 PM', '5:20 PM', '5:30 PM', '5:40 PM',
    '5:50 PM', '6:00 PM', '6:10 PM', '6:20 PM'
  ]
};

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TakeAppointment({doctorId}) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
       <h1 className="text-3xl font-bold text-gray-800 mb-6">Take Appointment with Doctor {doctorId}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        {/* Calendar Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {currentWeek.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-1">
              <button
                onClick={handlePrevWeek}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextWeek}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDates.map((date) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateSelect(date)}
                  className={`h-10 w-full rounded-lg flex flex-col items-center justify-center text-sm
                    ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
                    ${isToday ? 'border border-blue-600' : ''}`}
                >
                  <span className="text-xs">{date.toLocaleString('default', { month: 'short' })}</span>
                  <span className="font-semibold">{date.getDate()}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Time Slots Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-8">
            {/* Morning Slots */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-orange-400" />
                  </span>
                  <h3 className="font-medium">Morning</h3>
                  <span className="text-sm text-gray-500">9:00 AM to 12:00 PM</span>
                </div>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slots
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 overflow-auto">
                <div className="flex flex-wrap gap-2">
                  {timeSlots.morning.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedSlot(time)}
                      className={`px-4 py-2 rounded-lg text-sm border
                        ${selectedSlot === time 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Evening Slots */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                  </span>
                  <h3 className="font-medium">Evening</h3>
                  <span className="text-sm text-gray-500">5:00 PM to 8:00 PM</span>
                </div>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slots
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 overflow-auto">
                <div className="flex flex-wrap gap-2">
                  {timeSlots.evening.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedSlot(time)}
                      className={`px-4 py-2 rounded-lg text-sm border
                        ${selectedSlot === time 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Waiting List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                  </span>
                  <h3 className="font-medium">Waiting List</h3>
                </div>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Wait List
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
                No patients in waiting list
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Chat />
    </div>
  );
}

