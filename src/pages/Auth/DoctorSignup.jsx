import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { EyeIcon, EyeOffIcon, Mail, Lock, Phone, Hash } from 'lucide-react'
import { ngrok_url, google_ngrok_url } from '../../utils/global'
import Loader from '../components/Loader'

export default function Component() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [googleRegistrationNumber, setGoogleRegistrationNumber] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("Token")
    if (token) {
      navigate("/Dashboard")
    }
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_KEY,
          callback: handleCallbackResponse
        })
        renderGoogleButton()
      } else {
        setTimeout(initializeGoogleSignIn, 100)
      }
    }

    initializeGoogleSignIn()
  }, [navigate, isMobile, googleRegistrationNumber.length])

  const renderGoogleButton = () => {
    const button = document.getElementById("signInDiv")
    if (button) {
      button.innerHTML = ''
      if (googleRegistrationNumber.length >= 6) {
        window.google.accounts.id.renderButton(
          button,
          { theme: "outline", size: "large", width: isMobile ? 300 : 400 }
        )
      }
    }
  }

  const handleCallbackResponse = (response) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("token", response.credential)
    formData.append("registration_number", googleRegistrationNumber)
    formData.append("role", 'doctor')
    fetch(`${google_ngrok_url}/auth/google_login_doctor/`, {
      method: "POST",
      body: formData,  
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("Token", data.access)
        navigate("/Dashboard")
      })
      .catch(() => {
        setErrorMessage("An error occurred during Google sign-up. Please try again.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.")
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    formData.append("phone", phone)
    formData.append("registration_number", registrationNumber)
    formData.append("role", 'doctor')
    fetch(`${ngrok_url}/auth/register_userdoctor/`, {
      method: "POST",
      body: formData,  
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === false) {
          setErrorMessage(data.mssg)
        } else {
          localStorage.setItem("Token", data.access_token)
         localStorage.setItem("role", 'doctor')
          navigate("/Dashboard")
        }
      })
      .catch(() => {
        setErrorMessage("An error occurred during sign-up. Please try again.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (isLoading) {
    return <Loader />
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="text-red-500 text-sm text-center">{errorMessage}</div>
      )}
      <div className="relative">
        <label htmlFor="email" className="text-sm text-gray-600 mb-1 block">Email</label>
        <div className="relative">
          <input
            id="email"
            type="email"
            required
            className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@gmail.com"
          />
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="phone" className="text-sm text-gray-600 mb-1 block">Phone no</label>
        <div className="relative">
          <input
            id="phone"
            type="tel"
            required
            className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone no"
          />
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="registration" className="text-sm text-gray-600 mb-1 block">Registration Number</label>
        <div className="relative">
          <input
            id="registration"
            type="text"
            required
            className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="Enter your registration number"
          />
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="password" className="text-sm text-gray-600 mb-1 block">Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-[#7C3AED] text-white rounded-full font-medium hover:bg-[#6D28D9] transition-colors"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#FFF5F5] text-gray-500">or</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="google-registration" className="text-sm text-gray-600 mb-1 block">Registration Number for Google Sign-In</label>
          <div className="relative">
            <input
              id="google-registration"
              type="text"
              className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
              value={googleRegistrationNumber}
              onChange={(e) => {
                setGoogleRegistrationNumber(e.target.value)
                renderGoogleButton()
              }}
              placeholder="Enter your registration number for Google Sign-In"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {googleRegistrationNumber.length < 6 
              ? `Enter at least ${6 - googleRegistrationNumber.length} more character${6 - googleRegistrationNumber.length === 1 ? '' : 's'} to enable Google Sign-In`
              : 'Google Sign-In is now available'}
          </p>
        </div>
        <div id="signInDiv" className="flex justify-center"></div>
      </div>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <Link to="/doctor/login" className="text-[#7C3AED] font-medium">
          Sign in
        </Link>
      </p>
    </form>
  )

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex flex-col">
        <div className="relative w-full">
          <div className="absolute inset-x-0 top-0 h-[225px] bg-[#B7A6F3] rounded-b-full" />
          
          <div className="relative pt-8 px-6 flex flex-col items-center">
            <h1 className="text-[#2D2D2D] text-3xl font-bold mb-0">Sign-Up</h1>
            <img
              src="/auth/doc_signup_mobile.png"
              alt="Doctor"
              className="w-40 h-40 object-contain mb-0"
            />
            
            <div className="w-full max-w-md">
              {renderForm()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex">
      <div className="hidden lg:flex flex-1 bg-[#F5F0FF] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 w-[70%] bg-[#B7A6F3] rounded-t-full translate-x-[120px] translate-y-20" />
        </div>
        <img
          src="/auth/doc_signup.png"
          alt="Doctor"
          className="relative w-[40%] h-auto object-contain"
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-[#2D2D2D] text-4xl font-bold mb-6">Create Account</h1>
          {renderForm()}
        </div>
      </div>
    </div>
  )
}