import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { LogOut, Heart, Activity, FileText, DollarSign, Stethoscope } from 'lucide-react'
import { useAuth } from '../Auth/useAuth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [navBackground, setNavBackground] = useState('bg-[#FFFFFF]')
  const { logout } = useAuth()
  
  const Links = [
    { name: 'Home', link: '/', icon: Heart },
    { name: 'Dashboard', link: '/patient', icon: Activity },
    { name: 'DDashboard', link: '/doctor', icon: Activity },
    { name: 'HDashboard', link: '/hospital', icon: Activity },
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
        setNavBackground('bg-[#FFFFFF] shadow-md')
      } else {
        setNavBackground('bg-[#FFFFFF]')
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
            <span className="text-2xl font-bold text-[#005B96]">Medwell</span>
          </Link>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#005B96] hover:text-[#003E5C] focus:outline-none focus:text-[#003E5C]"
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
          } md:block mt-4 md:mt-0 bg-[#FFFFFF]`}
        >
          <ul className="flex flex-col md:flex-row md:items-center md:space-x-6">
            {Links.map((link) => (
              <li key={link.name} className="my-3 md:my-0">
                <Link
                  to={link.link}
                  className="flex items-center text-[#003E5C] hover:text-[#005B96] text-sm relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#005B96] after:left-0 after:-bottom-1 after:rounded-full after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="mr-2 h-5 w-5" />
                  {link.name}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <li className="my-3 md:my-0">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-[#003E5C] hover:text-[#005B96] transition duration-300"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </button>
              </li>
            ) : (
              <li className="my-3 md:my-0">
                <Link
                  to="/auth"
                  className="inline-flex items-center text-[#FFFFFF] bg-[#005B96] hover:bg-[#003E5C] px-4 py-1.5 rounded-full text-sm transition duration-300"
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

