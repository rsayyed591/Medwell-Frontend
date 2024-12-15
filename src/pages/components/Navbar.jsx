import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { LogOut, Heart, Activity, FileText, DollarSign, Stethoscope } from 'lucide-react'
import { useAuth } from '../Auth/useAuth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [navBackground, setNavBackground] = useState('bg-white')
  const { logout } = useAuth()
  
  const Links = [
    { name: 'Home', link: '/', icon: Heart },
    { name: 'Dashboard', link: '/Dashboard', icon: Activity },
    { name: 'DDashboard', link: '/doctordashboard', icon: Activity },
    { name: 'HDashboard', link: '/hospitaldashboard', icon: Activity },
    { name: 'Pricing', link: '/pricing', icon: DollarSign },
    { name: 'About', link: '/about', icon: FileText },
    { name: 'DoctorSearch', link: '/doctorsearch', icon: Stethoscope },
  ]

  const useAuthState = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
      const checkAuthStatus = () => {
        const token = localStorage.getItem('Token')
        setIsLoggedIn(!!token)
      }

      checkAuthStatus()

      window.addEventListener('storage', checkAuthStatus)
      window.addEventListener('authStateChange', checkAuthStatus)

      return () => {
        window.removeEventListener('storage', checkAuthStatus)
        window.removeEventListener('authStateChange', checkAuthStatus)
      }
    }, [])

    return isLoggedIn
  }

  const isLoggedIn = useAuthState()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavBackground('bg-white shadow-md')
      } else {
        setNavBackground('bg-white')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleLogout = () => {
    logout()
    window.dispatchEvent(new Event('authStateChange'))
  }

  return (
    <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${navBackground}`}>
      <div className="container mx-auto px-4 py-4 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <img src="/logo.png" alt="" />
            </div>
            <span className="text-2xl font-bold text-blue-600">Medwell</span>
          </Link>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800"
              aria-label="toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3BottomRightIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:block mt-4 md:mt-0 bg-white`}
        >
          <ul className="flex flex-col md:flex-row md:items-center md:space-x-6">
            {Links.map((link) => (
              <li key={link.name} className="my-3 md:my-0">
                <Link
                  to={link.link}
                  className="text-gray-700 hover:text-blue-600 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <li className="my-3 md:my-0">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-blue-600 transition duration-300"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </button>
              </li>
            ) : (
              <li className="my-3 md:my-0">
                <Link
                  to="/auth"
                  className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}