'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Home, User, Heart, FileText, PlusCircle, DollarSign, Calendar, Share2, MoreHorizontal, ChevronUp, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const mainNavItems = [
  { label: 'Home', icon: Home, path: '/patient' },
  { label: 'Profile', icon: User, path: '/patient/profile' },
  { label: 'Health', icon: Heart, path: '/patient/health-check' },
  { label: 'Reports', icon: FileText, path: '/patient/reports' },
  { label: 'Add Report', icon: PlusCircle, path: '/patient/add-report' }
]

const additionalNavItems = [
  { label: 'Expense Tracker', icon: DollarSign, path: '/patient/expense-tracker' },
  { label: 'Appointments', icon: Calendar, path: '/patient/appointments' },
  { label: 'Share with Doctor', icon: Share2, path: '/patient/share-with-doctor' }
]

export function MobileNav() {
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <nav className="bg-white border-t border-gray-200 rounded-t-3xl shadow-lg px-6 py-2">
        <ul className="flex justify-center items-center">
          {mainNavItems.map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <li key={index} className="flex-1 text-center">
                <Link
                  to={item.path}
                  className="flex flex-col items-center gap-1 py-2 px-3"
                >
                  <item.icon 
                    className={isActive ? "w-6 h-6 text-emerald-500 transition-colors" : "w-6 h-6 text-gray-500 transition-colors"} 
                  />
                  <span className={isActive ? "text-xs font-medium text-emerald-500" : "text-xs font-medium text-gray-500"}>
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
          <li ref={dropdownRef} className="flex-1 text-center relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex flex-col items-center gap-1 py-2 px-3 w-full"
            >
              <MoreHorizontal className="w-6 h-6 text-gray-500 transition-colors" />
              <span className="text-xs font-medium text-gray-500">More</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 transform -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div> */}
                <ul className="py-2">
                  {additionalNavItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.path}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  )
}

